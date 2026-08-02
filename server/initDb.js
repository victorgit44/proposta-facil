import pool from './db.js';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export async function initDb() {
  console.log('🔄 Verificando e criando estrutura de tabelas no MariaDB...');
  try {
    const connection = await pool.getConnection();
    try {
      // 1. Tabela users
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 2. Tabela assinaturas
      await connection.query(`
        CREATE TABLE IF NOT EXISTS assinaturas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          plano VARCHAR(50) DEFAULT 'Gratuito',
          propostas_criadas_mes INT DEFAULT 0,
          contratos_criadas_mes INT DEFAULT 0,
          mensagens_ia_mes INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX (user_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 3. Tabela propostas
      await connection.query(`
        CREATE TABLE IF NOT EXISTS propostas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          numero_proposta VARCHAR(100) NOT NULL,
          nome_cliente VARCHAR(255) NOT NULL,
          email_cliente VARCHAR(255),
          telefone_cliente VARCHAR(100),
          empresa_cliente VARCHAR(255),
          servico_prestado TEXT,
          prazo_entrega VARCHAR(255),
          observacoes TEXT,
          status VARCHAR(50) DEFAULT 'rascunho',
          validade VARCHAR(100),
          itens LONGTEXT,
          valor_total DECIMAL(10, 2) DEFAULT 0.00,
          created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (user_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migrações seguras de colunas para aceite digital de propostas e canvas visual
      try { await connection.query('ALTER TABLE propostas ADD COLUMN aceite_nome VARCHAR(255) NULL'); } catch (e) {}
      try { await connection.query('ALTER TABLE propostas ADD COLUMN aceite_ip VARCHAR(100) NULL'); } catch (e) {}
      try { await connection.query('ALTER TABLE propostas ADD COLUMN aceite_data DATETIME NULL'); } catch (e) {}
      try { await connection.query('ALTER TABLE propostas ADD COLUMN canvas_data LONGTEXT NULL'); } catch (e) {}

      // Migração: public_token UUID para URLs públicas seguras (anti-IDOR)
      try { await connection.query('ALTER TABLE propostas ADD COLUMN public_token VARCHAR(36) NULL'); } catch (e) {}
      try { await connection.query('CREATE UNIQUE INDEX idx_public_token ON propostas (public_token)'); } catch (e) {}
      // Povoar public_token em propostas existentes que ainda não possuem
      try {
        const [rows] = await connection.query('SELECT id FROM propostas WHERE public_token IS NULL');
        for (const row of rows) {
          const uuid = crypto.randomUUID();
          await connection.query('UPDATE propostas SET public_token = ? WHERE id = ?', [uuid, row.id]);
        }
      } catch (e) {}

      // 4. Tabela contratos
      await connection.query(`
        CREATE TABLE IF NOT EXISTS contratos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          numero_contrato VARCHAR(100) NOT NULL,
          contratante_nome VARCHAR(255),
          contratante_cpf_cnpj VARCHAR(100),
          contratante_endereco TEXT,
          contratante_email VARCHAR(255),
          contratante_telefone VARCHAR(100),
          contratado_nome VARCHAR(255),
          contratado_cpf_cnpj VARCHAR(100),
          contratado_endereco TEXT,
          contratado_email VARCHAR(255),
          contratado_telefone VARCHAR(100),
          objeto_contrato TEXT,
          valor_contrato DECIMAL(10, 2) DEFAULT 0.00,
          forma_pagamento VARCHAR(255),
          data_inicio VARCHAR(100),
          data_termino VARCHAR(100),
          prazo_vigencia VARCHAR(255),
          clausulas_adicionais TEXT,
          testemunhas LONGTEXT,
          created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (user_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 5. Tabela configuracoes_empresa
      await connection.query(`
        CREATE TABLE IF NOT EXISTS configuracoes_empresa (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL UNIQUE,
          nome_empresa VARCHAR(255),
          cnpj VARCHAR(100),
          email_empresa VARCHAR(255),
          telefone_empresa VARCHAR(100),
          endereco TEXT,
          website VARCHAR(255),
          logo_url LONGTEXT,
          cor_primaria VARCHAR(50) DEFAULT '#2563eb',
          mensagem_rodape TEXT,
          termos_condicoes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 6. Tabela produtos (Catálogo Proposify)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS produtos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          nome VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) DEFAULT 'Geral',
          descricao TEXT,
          preco_unitario DECIMAL(10, 2) DEFAULT 0.00,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (user_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 10. Tabela templates_preset (Modelos Prontos por Nicho)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS templates_preset (
          id INT AUTO_INCREMENT PRIMARY KEY,
          slug VARCHAR(100) NOT NULL UNIQUE,
          titulo VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          badge VARCHAR(50) DEFAULT 'Geral',
          descricao TEXT,
          valor_sugerido DECIMAL(10, 2) DEFAULT 0.00,
          servico TEXT,
          itens_count INT DEFAULT 1,
          cover_theme VARCHAR(50) DEFAULT 'blue',
          canvas_data LONGTEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 11. Tabela media_assets (Biblioteca de Imagens Corporativas HD)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS media_assets (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          url TEXT NOT NULL,
          thumb_url TEXT,
          tags VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // ── Seeding Automático de Templates ──
      const [existingTemplates] = await connection.query('SELECT COUNT(*) as count FROM templates_preset');
      if (existingTemplates[0].count === 0) {
        console.log('🌱 Povoando banco com banco de modelos iniciais (Seeding Templates)...');
        const defaultTemplates = [
          {
            slug: 'b2b-saas-dev',
            titulo: 'Desenvolvimento de Software & SaaS B2B',
            categoria: 'ti',
            badge: 'TI & Tech',
            descricao: 'Proposta comercial completa para sistemas web, aplicações SaaS sob medida, APIs e dashboards de gestão.',
            valor_sugerido: 18500.00,
            servico: 'Desenvolvimento de plataforma web responsiva com autenticação JWT, dashboard de gestão, integração REST API e suporte por 90 dias.',
            itens_count: 4,
            cover_theme: 'blue'
          },
          {
            slug: 'marketing-performance',
            titulo: 'Gestão de Tráfego Pago & Performance Marketing',
            categoria: 'marketing',
            badge: 'Marketing',
            descricao: 'Modelo estratégico de assessoria mensal em Meta Ads, Google Ads e criação de landing pages de alta conversão.',
            valor_sugerido: 4500.00,
            servico: 'Planejamento de campanhas de tráfego, otimização semanal de anúncios, criação de 2 Landing Pages e relatórios mensais de ROI.',
            itens_count: 3,
            cover_theme: 'purple'
          },
          {
            slug: 'consultoria-vendas',
            titulo: 'Consultoria em Processos Comerciais & CRM',
            categoria: 'consultoria',
            badge: 'Consultoria',
            descricao: 'Diagnóstico estratégico, estruturação do funil de vendas, treinamento de vendedores e implementação de CRM.',
            valor_sugerido: 9800.00,
            servico: 'Mapeamento de cadência comercial B2B, definição de SLA de vendas e 4 sessões de treinamento prático.',
            itens_count: 3,
            cover_theme: 'slate'
          },
          {
            slug: 'engenharia-obras',
            titulo: 'Proposta de Engenharia Civil & Reforma Corporativa',
            categoria: 'engenharia',
            badge: 'Engenharia',
            descricao: 'Memorial descritivo de obra, fornecimento de mão de obra qualificada, materiais e cronograma físico-financeiro.',
            valor_sugerido: 45000.00,
            servico: 'Execução de reforma comercial com adequação elétrica, drywall, piso elevado, pintura e emissão de ART.',
            itens_count: 5,
            cover_theme: 'cyan'
          },
          {
            slug: 'gastronomia-catering',
            titulo: 'Catering & Eventos Corporativos Premium',
            categoria: 'gastronomia',
            badge: 'Eventos',
            descricao: 'Apresentação de menus, lista de insumos, equipe de garçons e orçamento discriminado por convidado.',
            valor_sugerido: 12500.00,
            servico: 'Serviço de buffet completo para até 150 convidados com finger foods, coquetel de recepção e bebidas climatizadas.',
            itens_count: 4,
            cover_theme: 'amber'
          },
          {
            slug: 'imobiliario-locacao',
            titulo: 'Proposta de Locação & Gestão Imobiliária',
            categoria: 'imobiliario',
            badge: 'Imobiliário',
            descricao: 'Proposta de locação de espaço comercial com tabela de aluguéis, carência, garantias e memorial do imóvel.',
            valor_sugerido: 8500.00,
            servico: 'Locação de laje corporativa de 250m² com 4 vagas de garagem, suporte de manutenção e vistoria de entrada.',
            itens_count: 3,
            cover_theme: 'emerald'
          },
          {
            slug: 'ciberseguranca-pentest',
            titulo: 'Auditoria de Cibersegurança & PenTest LGPD',
            categoria: 'ciberseguranca',
            badge: 'Cibersegurança',
            descricao: 'Relatório de vulnerabilidades de TI, testes de invasão (PenTest), plano de mitigação e conformidade com LGPD.',
            valor_sugerido: 16000.00,
            servico: 'Análise de superfície de ataque, PenTest externo e interno, relatório executivo e re-teste após correção.',
            itens_count: 4,
            cover_theme: 'purple'
          },
          {
            slug: 'treinamento-corporativo',
            titulo: 'Workshops & Treinamentos de Liderança',
            categoria: 'educacao',
            badge: 'Treinamento',
            descricao: 'Programa pedagógico corporativo, material didático digital e certificado de horas para equipes executivas.',
            valor_sugerido: 6800.00,
            servico: 'Workshop presencial de 16 horas sobre Gestão Ágil, Liderança de Equipes Comerciais e Resolução de Conflitos.',
            itens_count: 3,
            cover_theme: 'blue'
          },
          {
            slug: 'facilities-limpeza',
            titulo: 'Terceirização de Facilities & Serviços Gerais',
            categoria: 'facilities',
            badge: 'Facilities',
            descricao: 'Escala de equipes terceirizadas, SLA de atendimento corporativo, uniforme e fornecimento de insumos.',
            valor_sugerido: 11200.00,
            servico: 'Prestação de serviços diários de conservação e limpeza predial com 3 auxiliares dedicados e supervisor semanal.',
            itens_count: 3,
            cover_theme: 'teal'
          },
          {
            slug: 'design-branding',
            titulo: 'Identidade Visual & Design System Completo',
            categoria: 'design',
            badge: 'Design',
            descricao: 'Criação de logotipo, manual de marca, paleta de cores, tipografia e kit para redes sociais.',
            valor_sugerido: 7500.00,
            servico: 'Branding completo com entrega de vetor, manual em PDF de 40 páginas e 15 templates editáveis no Figma.',
            itens_count: 4,
            cover_theme: 'pink'
          },
          {
            slug: 'contrato-prestacao-servico',
            titulo: 'Contrato Padrão de Prestação de Serviços',
            categoria: 'contratos',
            badge: 'Jurídico',
            descricao: 'Minuta jurídica completa para prestação de serviços com cláusulas de rescisão, sigilo e pagamentos.',
            valor_sugerido: 0.00,
            servico: 'Contrato comercial padrão pronto para preenchimento de contratante e contratado com validade jurídica.',
            itens_count: 1,
            cover_theme: 'slate'
          },
          {
            slug: 'nda-confidencialidade',
            titulo: 'Acordo de Confidencialidade (NDA)',
            categoria: 'contratos',
            badge: 'Jurídico',
            descricao: 'Termo de não-divulgação e proteção de propriedade intelectual para negociações comerciais confidenciais.',
            valor_sugerido: 0.00,
            servico: 'Termo de sigilo comercial e proteção de dados em conformidade com a MP 2.200-2 e a LGPD.',
            itens_count: 1,
            cover_theme: 'slate'
          }
        ];

        for (const t of defaultTemplates) {
          const canvasData = generateA4CanvasPages(t);
          await connection.query(
            `INSERT INTO templates_preset (slug, titulo, categoria, badge, descricao, valor_sugerido, servico, itens_count, cover_theme, canvas_data)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [t.slug, t.titulo, t.categoria, t.badge, t.descricao, t.valor_sugerido, t.servico, t.itens_count, t.cover_theme, JSON.stringify(canvasData)]
          );
        }
      }

      // Garantir que todos os templates existentes no banco tenham canvas_data no padrão A4 livre
      try {
        const [templates] = await connection.query('SELECT id, titulo, servico, descricao, valor_sugerido, cover_theme FROM templates_preset');
        for (const t of templates) {
          const canvasData = generateA4CanvasPages(t);
          await connection.query('UPDATE templates_preset SET canvas_data = ? WHERE id = ?', [JSON.stringify(canvasData), t.id]);
        }
      } catch (e) {}

      // ── Seeding Automático de Media Assets (Imagens HD) ──
      const [existingMedia] = await connection.query('SELECT COUNT(*) as count FROM media_assets');
      if (existingMedia[0].count === 0) {
        console.log('🌱 Povoando biblioteca de imagens HD corporativas (Seeding Media Assets)...');
        const defaultMedia = [
          { titulo: 'Escritório Corporativo Moderno', categoria: 'executivo', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', tags: 'office, corporate, business' },
          { titulo: 'Reunião de Diretoria', categoria: 'executivo', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', tags: 'meeting, team, executive' },
          { titulo: 'Desenvolvedor Codificando', categoria: 'tecnologia', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', tags: 'code, tech, software' },
          { titulo: 'Data Center & Servidores Cloud', categoria: 'tecnologia', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', tags: 'cloud, server, ti' },
          { titulo: 'Engenheiro em Obra', categoria: 'engenharia', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', tags: 'construction, engineer, building' },
          { titulo: 'Arquitetura & Planta Baixa', categoria: 'engenharia', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', tags: 'architecture, blueprint, home' },
          { titulo: 'Buffet Gastronômico Elegante', categoria: 'gastronomia', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80', tags: 'food, catering, event' },
          { titulo: 'Prato Executivo Gourmet', categoria: 'gastronomia', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', tags: 'gourmet, restaurant, dinner' },
          { titulo: 'Laje Corporativa Imobiliária', categoria: 'imobiliario', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', tags: 'real estate, building, tower' },
          { titulo: 'Equipe de Marketing & Growth', categoria: 'marketing', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', tags: 'marketing, strategy, growth' },
          { titulo: 'Auditoria & Contrato Assinado', categoria: 'juridico', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80', tags: 'contract, signature, legal' },
          { titulo: 'Cibersegurança & Segurança de Dados', categoria: 'tecnologia', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', tags: 'security, cyber, data' }
        ];

        for (const m of defaultMedia) {
          await connection.query(
            `INSERT INTO media_assets (titulo, categoria, url, tags) VALUES (?, ?, ?, ?)`,
            [m.titulo, m.categoria, m.url, m.tags]
          );
        }
      }

      console.log('✅ Estrutura de tabelas criada/verificada com sucesso no MariaDB!');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('❌ ERRO DETALHADO DO MARIADB:', error.message || error);
    throw error;
  }
}

// Se for executado diretamente no terminal (node server/initDb.js)
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  initDb()
    .then(() => {
      console.log('Finalizado com sucesso.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Erro na execução:', err);
      process.exit(1);
    });
}
