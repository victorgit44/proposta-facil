import pool from './db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export async function createAdminUser(
  email = process.env.ADMIN_EMAIL || 'admin@propostafacil.com',
  rawPassword = process.env.ADMIN_PASSWORD || 'admin123',
  fullName = 'Administrador'
) {
  console.log(`🔑 Criando/Atualizando usuário admin (${email})...`);
  
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  let userId;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  if (existing.length > 0) {
    userId = existing[0].id;
    await pool.query('UPDATE users SET password_hash = ?, full_name = ?, role = ? WHERE id = ?', [hashedPassword, fullName, 'admin', userId]);
    console.log('✅ Usuário admin atualizado com sucesso.');
  } else {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, 'admin']
    );
    userId = result.insertId;
    console.log('✅ Usuário admin criado com sucesso.');
  }

  // Garante assinatura ativa (Plano Business)
  const [sub] = await pool.query('SELECT id FROM assinaturas WHERE user_id = ?', [userId]);
  if (sub.length === 0) {
    await pool.query(
      'INSERT INTO assinaturas (user_id, plano, propostas_criadas_mes, contratos_criadas_mes, mensagens_ia_mes) VALUES (?, ?, 0, 0, 0)',
      [userId, 'Business']
    );
    console.log('✅ Plano Business configurado para o admin.');
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  createAdminUser()
    .then(() => {
      console.log('Processo de seed concluído.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Erro no seed:', err);
      process.exit(1);
    });
}
