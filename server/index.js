import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from './db.js';
import { initDb } from './initDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'proposta_facil_super_secret_jwt_key_2026';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
const WEBHOOK_URL = process.env.VITE_WEBHOOK_URL || process.env.WEBHOOK_URL || 'https://vm-n8n.xyrugy.easypanel.host/webhook/03a174c4-2ad0-426a-8c98-22685b7e85d1';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ AVISO DE SEGURANÇA: JWT_SECRET não definido nas variáveis de ambiente. Usando segredo temporário.');
}

// -------------------------------------------------------------
// SEGURANÇA: HELMET, COOKIES & CORS
// -------------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : null;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !allowedOrigins || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------
// SEGURANÇA: RATE LIMITING
// -------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas tentativas de acesso. Por favor, tente novamente em alguns minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Limite de requisições excedido. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// -------------------------------------------------------------
// MIDDLEWARE DE AUTENTICAÇÃO JWT
// -------------------------------------------------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token de autenticação não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.clearCookie('token');
      return res.status(403).json({ error: 'Sessão expirada ou token inválido. Faça login novamente.' });
    }
    req.user = user;
    next();
  });
};

// Helper de erro seguro
const handleServerError = (res, error, customMessage = 'Erro interno do servidor.') => {
  console.error('❌ Erro na API:', error);
  const message = error.message || customMessage;
  return res.status(500).json({ error: message });
};

// Helper de Opções do Cookie de Sessão
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// Cadastro (Signup)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = (full_name && typeof full_name === 'string') ? full_name.trim() : cleanEmail.split('@')[0];

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [userName, cleanEmail, hashedPassword, 'user']
    );

    const userId = result.insertId;

    await pool.query(
      'INSERT INTO assinaturas (user_id, plano) VALUES (?, ?)',
      [userId, 'Gratuito']
    );

    const token = jwt.sign({ id: userId, email: cleanEmail, full_name: userName, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, getCookieOptions());

    return res.json({
      token,
      user: { id: userId, email: cleanEmail, full_name: userName, role: 'user' }
    });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao realizar cadastro.');
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [users] = await pool.query('SELECT id, email, full_name, password_hash, role FROM users WHERE email = ?', [cleanEmail]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, getCookieOptions());

    return res.json({
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao realizar login.');
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logout realizado com sucesso.' });
});

// Usuário Atual (Me)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, full_name, role FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json({ user: users[0] });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao buscar perfil.');
  }
});

// Atualizar Senha
app.post('/api/auth/update-password', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);
    return res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao atualizar senha.');
  }
});

// ==========================================
// ROTAS DE IA SEGURAS (OPENAI + GEMINI)
// ==========================================

// 1. Proxy Seguro para Preenchimento com OpenAI (ou Fallback Gemini)
app.post('/api/ai/fill-proposal', authenticateToken, async (req, res) => {
  try {
    const { input, type = 'proposta' } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Descreva o pedido para a IA.' });
    }

    const systemInstruction = `
      Você é um assistente especialista em criar propostas comerciais.
      Sua tarefa é ler o pedido do usuário e retornar APENAS um objeto JSON válido.
      NÃO use markdown (\`\`\`json). NÃO escreva explicações fora do JSON.
      
      Estrutura obrigatória do JSON:
      {
        "nome_cliente": "Nome do cliente ou empresa (string)",
        "empresa_cliente": "Nome da empresa (string)",
        "email_cliente": "Email (string)",
        "telefone_cliente": "Telefone (string)",
        "servico_prestado": "Descrição detalhada, profissional e vendedora do serviço (string)",
        "prazo_entrega": "Prazo estimado (string)",
        "observacoes": "Observações gerais (string)",
        "itens": [
          { "descricao": "Nome do item/serviço", "quantidade": 1, "valor_unitario": 0.00 }
        ]
      }
    `;

    // 🟢 OPÇÃO 1: OpenAI ChatGPT (Recomendado se OPENAI_API_KEY estiver configurada)
    if (OPENAI_API_KEY) {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: input }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });

      if (!openaiRes.ok) {
        const errData = await openaiRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Erro na OpenAI API (HTTP ${openaiRes.status})`);
      }

      const openaiData = await openaiRes.json();
      const rawContent = openaiData.choices[0]?.message?.content;
      const jsonData = JSON.parse(rawContent);

      return res.json(jsonData);
    }

    // 🔵 OPÇÃO 2: Google Gemini (Fallback)
    if (GOOGLE_API_KEY) {
      const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fullPrompt = `${systemInstruction}\n\nPedido do usuário: "${input}"`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonData = JSON.parse(text);

      return res.json(jsonData);
    }

    return res.status(500).json({ error: 'Nenhuma chave de API de IA (OPENAI_API_KEY ou GOOGLE_API_KEY) configurada no servidor.' });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao processar preenchimento com IA.');
  }
});

// 2. Proxy Seguro para o Chat IA (Integrado ao n8n Webhook)
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida.' });
    }

    // Verificar e incrementar limite de uso
    const [existing] = await pool.query('SELECT * FROM assinaturas WHERE user_id = ?', [req.user.id]);
    const userSub = existing[0] || { plano: 'Gratuito', mensagens_ia_mes: 0 };
    const limitsMap = { 'Gratuito': 10, 'Profissional': 500, 'Business': 99999 };
    const maxLimit = limitsMap[userSub.plano] || 10;

    if (userSub.mensagens_ia_mes >= maxLimit) {
      return res.status(403).json({ error: `Você atingiu o limite mensal de ${maxLimit} mensagens do seu plano.` });
    }

    let aiReply = '';

    try {
      const webhookResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      if (webhookResponse.ok) {
        const rawText = await webhookResponse.text();
        if (rawText && rawText.trim()) {
          try {
            const data = JSON.parse(rawText);
            aiReply = data.output || data.reply || data.message || data.text || (typeof data === 'string' ? data : '');
          } catch (e) {
            aiReply = rawText.trim();
          }
        }
      }
    } catch (n8nErr) {
      console.warn('⚠️ Webhook n8n indisponível, usando fallback para OpenAI:', n8nErr.message);
    }

    // 🟢 FALLBACK AUTOMÁTICO PARA OPENAI (Caso n8n responda vazio ou esteja sem o nó 'Respond to Webhook')
    if (!aiReply && OPENAI_API_KEY) {
      try {
        const formattedHistory = Array.isArray(history) 
          ? history.map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content || '' }))
          : [];

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Você é um assistente virtual especialista em propostas comerciais e contratos para a plataforma PropostaFácil. Responda de forma cortês, objetiva e vendedora em Português do Brasil.' },
              ...formattedHistory,
              { role: 'user', content: message }
            ],
            temperature: 0.7
          })
        });

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json();
          aiReply = openaiData.choices[0]?.message?.content || '';
        }
      } catch (openAiErr) {
        console.error('Erro no fallback da OpenAI:', openAiErr);
      }
    }

    if (!aiReply) {
      aiReply = 'Desculpe, não consegui obter uma resposta no momento. Por favor, tente novamente em instantes.';
    }

    await pool.query('UPDATE assinaturas SET mensagens_ia_mes = mensagens_ia_mes + 1 WHERE user_id = ?', [req.user.id]);

    return res.json({ reply: aiReply });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao comunicar com o assistente de IA.');
  }
});

// ==========================================
// ROTAS DE PROPOSTAS (PÚBLICAS & AUTENTICADAS)
// ==========================================

// Rota pública para visualização de proposta por clientes (Sem necessidade de login)
app.get('/api/propostas/public/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, numero_proposta, nome_cliente, email_cliente, telefone_cliente, empresa_cliente, servico_prestado, prazo_entrega, observacoes, status, validade, itens, valor_total, aceite_nome, aceite_ip, aceite_data, created_date FROM propostas WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Proposta não encontrada.' });

    const proposta = rows[0];
    proposta.itens = typeof proposta.itens === 'string' ? JSON.parse(proposta.itens || '[]') : (proposta.itens || []);

    // Buscar dados públicos da empresa remetente para exibir a logomarca e informações comerciais
    const [configRows] = await pool.query(
      'SELECT nome_empresa, cnpj, telefone, email, logo_url FROM configuracoes WHERE user_id = ?',
      [proposta.user_id]
    );

    const empresa = configRows[0] || {};
    delete proposta.user_id; // Remove user_id da resposta pública por segurança

    return res.json({
      ...proposta,
      empresa: {
        nome: empresa.nome_empresa || 'Empresa Prestadora',
        cnpj: empresa.cnpj || '',
        telefone: empresa.telefone || '',
        email: empresa.email || '',
        logo_url: empresa.logo_url || ''
      }
    });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao carregar proposta pública.');
  }
});

// Rota pública para aceite digital da proposta
app.post('/api/propostas/public/:id/accept', async (req, res) => {
  try {
    const { nome_assinante } = req.body;
    if (!nome_assinante || typeof nome_assinante !== 'string' || !nome_assinante.trim()) {
      return res.status(400).json({ error: 'Por favor, informe o seu nome completo para confirmar o aceite da proposta.' });
    }

    const [rows] = await pool.query('SELECT id, status FROM propostas WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Proposta não encontrada.' });

    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const now = new Date();

    await pool.query(
      'UPDATE propostas SET status = ?, aceite_nome = ?, aceite_ip = ?, aceite_data = ? WHERE id = ?',
      ['aprovada', nome_assinante.trim(), clientIp, now, req.params.id]
    );

    return res.json({
      success: true,
      message: 'Proposta aceita com sucesso!',
      aceite: {
        nome: nome_assinante.trim(),
        ip: clientIp,
        data: now
      }
    });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao registrar aceite da proposta.');
  }
});

// Rota pública para solicitação de ajuste ou recusa da proposta
app.post('/api/propostas/public/:id/reject', async (req, res) => {
  try {
    const { motivo } = req.body;
    const [rows] = await pool.query('SELECT id FROM propostas WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Proposta não encontrada.' });

    await pool.query(
      'UPDATE propostas SET status = ?, observacoes = CONCAT(COALESCE(observacoes, ""), "\n[Solicitação de Ajuste do Cliente]: ", ?) WHERE id = ?',
      ['recusada', (motivo || 'Solicitação de ajustes enviada pelo cliente.').trim(), req.params.id]
    );

    return res.json({ success: true, message: 'Solicitação enviada com sucesso ao vendedor.' });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao registrar solicitação.');
  }
});

app.get('/api/propostas', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, numero_proposta, nome_cliente, email_cliente, telefone_cliente, empresa_cliente, servico_prestado, prazo_entrega, observacoes, status, validade, itens, valor_total, created_date FROM propostas WHERE user_id = ? ORDER BY created_date DESC',
      [req.user.id]
    );

    const formatted = rows.map(r => ({
      ...r,
      itens: typeof r.itens === 'string' ? JSON.parse(r.itens || '[]') : (r.itens || [])
    }));

    return res.json(formatted);
  } catch (error) {
    return handleServerError(res, error, 'Erro ao listar propostas.');
  }
});

app.get('/api/propostas/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, numero_proposta, nome_cliente, email_cliente, telefone_cliente, empresa_cliente, servico_prestado, prazo_entrega, observacoes, status, validade, itens, valor_total, created_date FROM propostas WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Proposta não encontrada.' });

    const proposta = rows[0];
    proposta.itens = typeof proposta.itens === 'string' ? JSON.parse(proposta.itens || '[]') : (proposta.itens || []);
    return res.json(proposta);
  } catch (error) {
    return handleServerError(res, error, 'Erro ao buscar proposta.');
  }
});

app.post('/api/propostas', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const itensJson = JSON.stringify(data.itens || []);

    const [result] = await pool.query(
      `INSERT INTO propostas 
       (user_id, numero_proposta, nome_cliente, email_cliente, telefone_cliente, empresa_cliente, servico_prestado, prazo_entrega, observacoes, status, validade, itens, valor_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        data.numero_proposta || `PROP-${Date.now().toString().slice(-6)}`,
        data.nome_cliente || '',
        data.email_cliente || '',
        data.telefone_cliente || '',
        data.empresa_cliente || '',
        data.servico_prestado || '',
        data.prazo_entrega || '',
        data.observacoes || '',
        data.status || 'rascunho',
        data.validade || '',
        itensJson,
        parseFloat(data.valor_total) || 0
      ]
    );

    return res.json({ id: result.insertId, ...data });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao criar proposta.');
  }
});

app.put('/api/propostas/:id', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const itensJson = JSON.stringify(data.itens || []);

    const [result] = await pool.query(
      `UPDATE propostas SET
       numero_proposta = ?, nome_cliente = ?, email_cliente = ?, telefone_cliente = ?, empresa_cliente = ?,
       servico_prestado = ?, prazo_entrega = ?, observacoes = ?, status = ?, validade = ?, itens = ?, valor_total = ?
       WHERE id = ? AND user_id = ?`,
      [
        data.numero_proposta, data.nome_cliente, data.email_cliente, data.telefone_cliente, data.empresa_cliente,
        data.servico_prestado, data.prazo_entrega, data.observacoes, data.status, data.validade, itensJson, parseFloat(data.valor_total) || 0,
        req.params.id, req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proposta não encontrada ou sem permissão para alteração.' });
    }

    return res.json({ id: req.params.id, ...data });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao atualizar proposta.');
  }
});

app.delete('/api/propostas/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM propostas WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proposta não encontrada ou sem permissão para exclusão.' });
    }
    return res.json({ success: true });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao excluir proposta.');
  }
});

// ==========================================
// ROTAS DE CONTRATOS
// ==========================================

app.get('/api/contratos', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contratos WHERE user_id = ? ORDER BY created_date DESC',
      [req.user.id]
    );

    const formatted = rows.map(r => ({
      ...r,
      testemunhas: typeof r.testemunhas === 'string' ? JSON.parse(r.testemunhas || '[]') : (r.testemunhas || [])
    }));

    return res.json(formatted);
  } catch (error) {
    return handleServerError(res, error, 'Erro ao listar contratos.');
  }
});

app.get('/api/contratos/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contratos WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Contrato não encontrado.' });

    const contrato = rows[0];
    contrato.testemunhas = typeof contrato.testemunhas === 'string' ? JSON.parse(contrato.testemunhas || '[]') : (contrato.testemunhas || []);
    return res.json(contrato);
  } catch (error) {
    return handleServerError(res, error, 'Erro ao buscar contrato.');
  }
});

app.post('/api/contratos', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const testemunhasJson = JSON.stringify(data.testemunhas || []);

    const [result] = await pool.query(
      `INSERT INTO contratos 
       (user_id, numero_contrato, contratante_nome, contratante_cpf_cnpj, contratante_endereco, contratante_email, contratante_telefone,
        contratado_nome, contratado_cpf_cnpj, contratado_endereco, contratado_email, contratado_telefone,
        objeto_contrato, valor_contrato, forma_pagamento, data_inicio, data_termino, prazo_vigencia, clausulas_adicionais, testemunhas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        data.numero_contrato || `CONT-${Date.now().toString().slice(-6)}`,
        data.contratante_nome || '', data.contratante_cpf_cnpj || '', data.contratante_endereco || '', data.contratante_email || '', data.contratante_telefone || '',
        data.contratado_nome || '', data.contratado_cpf_cnpj || '', data.contratado_endereco || '', data.contratado_email || '', data.contratado_telefone || '',
        data.objeto_contrato || '', parseFloat(data.valor_contrato) || 0, data.forma_pagamento || '', data.data_inicio || '', data.data_termino || '', data.prazo_vigencia || '',
        data.clausulas_adicionais || '', testemunhasJson
      ]
    );

    return res.json({ id: result.insertId, ...data });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao criar contrato.');
  }
});

app.put('/api/contratos/:id', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const testemunhasJson = JSON.stringify(data.testemunhas || []);

    const [result] = await pool.query(
      `UPDATE contratos SET
       numero_contrato = ?, contratante_nome = ?, contratante_cpf_cnpj = ?, contratante_endereco = ?, contratante_email = ?, contratante_telefone = ?,
       contratado_nome = ?, contratado_cpf_cnpj = ?, contratado_endereco = ?, contratado_email = ?, contratado_telefone = ?,
       objeto_contrato = ?, valor_contrato = ?, forma_pagamento = ?, data_inicio = ?, data_termino = ?, prazo_vigencia = ?, clausulas_adicionais = ?, testemunhas = ?
       WHERE id = ? AND user_id = ?`,
      [
        data.numero_contrato, data.contratante_nome, data.contratante_cpf_cnpj, data.contratante_endereco, data.contratante_email, data.contratante_telefone,
        data.contratado_nome, data.contratado_cpf_cnpj, data.contratado_endereco, data.contratado_email, data.contratado_telefone,
        data.objeto_contrato, parseFloat(data.valor_contrato) || 0, data.forma_pagamento, data.data_inicio, data.data_termino, data.prazo_vigencia, data.clausulas_adicionais, testemunhasJson,
        req.params.id, req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado ou sem permissão para alteração.' });
    }

    return res.json({ id: req.params.id, ...data });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao atualizar contrato.');
  }
});

app.delete('/api/contratos/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM contratos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado ou sem permissão para exclusão.' });
    }
    return res.json({ success: true });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao excluir contrato.');
  }
});

// ==========================================
// ROTAS DE CONFIGURAÇÕES DA EMPRESA
// ==========================================

app.get('/api/configuracoes', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM configuracoes_empresa WHERE user_id = ?',
      [req.user.id]
    );
    return res.json(rows);
  } catch (error) {
    return handleServerError(res, error, 'Erro ao buscar configurações.');
  }
});

app.post('/api/configuracoes', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const [existing] = await pool.query('SELECT id FROM configuracoes_empresa WHERE user_id = ?', [req.user.id]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE configuracoes_empresa SET
         nome_empresa = ?, cnpj = ?, email_empresa = ?, telefone_empresa = ?, endereco = ?, website = ?,
         logo_url = ?, cor_primaria = ?, mensagem_rodape = ?, termos_condicoes = ?
         WHERE user_id = ?`,
        [
          data.nome_empresa || '', data.cnpj || '', data.email_empresa || '', data.telefone_empresa || '', data.endereco || '', data.website || '',
          data.logo_url || '', data.cor_primaria || '#2563eb', data.mensagem_rodape || '', data.termos_condicoes || '',
          req.user.id
        ]
      );
      return res.json({ id: existing[0].id, ...data });
    } else {
      const [result] = await pool.query(
        `INSERT INTO configuracoes_empresa
         (user_id, nome_empresa, cnpj, email_empresa, telefone_empresa, endereco, website, logo_url, cor_primaria, mensagem_rodape, termos_condicoes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id, data.nome_empresa || '', data.cnpj || '', data.email_empresa || '', data.telefone_empresa || '', data.endereco || '', data.website || '',
          data.logo_url || '', data.cor_primaria || '#2563eb', data.mensagem_rodape || '', data.termos_condicoes || ''
        ]
      );
      return res.json({ id: result.insertId, ...data });
    }
  } catch (error) {
    return handleServerError(res, error, 'Erro ao salvar configurações.');
  }
});

// ==========================================
// ROTAS DE ASSINATURAS E CONTROLADORES DE USO
// ==========================================

app.get('/api/assinaturas', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assinaturas WHERE user_id = ?', [req.user.id]);
    if (rows.length === 0) {
      const [result] = await pool.query('INSERT INTO assinaturas (user_id, plano) VALUES (?, ?)', [req.user.id, 'Gratuito']);
      return res.json([{ id: result.insertId, user_id: req.user.id, plano: 'Gratuito', propostas_criadas_mes: 0, contratos_criadas_mes: 0, mensagens_ia_mes: 0 }]);
    }
    return res.json(rows);
  } catch (error) {
    return handleServerError(res, error, 'Erro ao buscar dados da assinatura.');
  }
});

app.post('/api/usage/increment', authenticateToken, async (req, res) => {
  try {
    const { item_type } = req.body;
    let field = '';

    if (item_type === 'proposta') field = 'propostas_criadas_mes';
    else if (item_type === 'contrato') field = 'contratos_criadas_mes';
    else if (item_type === 'ia') field = 'mensagens_ia_mes';
    else return res.status(400).json({ error: 'Tipo de item inválido para contagem de uso.' });

    const [existing] = await pool.query('SELECT id FROM assinaturas WHERE user_id = ?', [req.user.id]);
    if (existing.length === 0) {
      await pool.query('INSERT INTO assinaturas (user_id, plano) VALUES (?, ?)', [req.user.id, 'Gratuito']);
    }

    await pool.query(`UPDATE assinaturas SET ${field} = ${field} + 1 WHERE user_id = ?`, [req.user.id]);
    return res.json({ success: true });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao registrar incremento de uso.');
  }
});

// Upload de Logo
app.post('/api/upload-logo', authenticateToken, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Formato de imagem inválido.' });
    }
    return res.json({ url: image });
  } catch (error) {
    return handleServerError(res, error, 'Erro ao realizar upload do logo.');
  }
});

// Servir arquivos estáticos do frontend (Deploy em Produção no EasyPanel)
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.resolve(distPath, 'index.html'));
  }
  next();
});

// Inicialização do Servidor
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor API REST seguro rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Falha ao inicializar o banco de dados:', err);
});
