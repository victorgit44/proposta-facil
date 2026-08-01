import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!dbHost || !dbUser || !dbPassword || !dbName) {
  console.warn('⚠️ ATENÇÃO: Uma ou mais variáveis de ambiente do banco de dados (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) não foram definidas.');
}

// Pool de Conexões MariaDB Otimizado contra Desconexão (ECONNRESET)
const pool = mysql.createPool({
  host: dbHost,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,               // Descarta sockets ociosos excedentes
  idleTimeout: 30000,        // Fecha conexões inativas após 30 segundos
  queueLimit: 0,
  enableKeepAlive: true,     // Envia pacotes TCP Keep-Alive
  keepAliveInitialDelay: 10000 // Inicia o ping TCP após 10 segundos
});

// Resiliência Automática: Intercepta e Tenta Novamente em caso de ECONNRESET / Desconexão
const rawQuery = pool.query.bind(pool);
pool.query = async function (...args) {
  let attempts = 0;
  while (attempts < 3) {
    try {
      return await rawQuery(...args);
    } catch (err) {
      attempts++;
      const isNetworkError =
        err.code === 'ECONNRESET' ||
        err.code === 'PROTOCOL_CONNECTION_LOST' ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' ||
        err.message?.includes('ECONNRESET') ||
        err.message?.includes('closed');

      if (isNetworkError && attempts < 3) {
        console.warn(`⚠️ Conexão MariaDB resetada pela VPS (tentativa ${attempts}/3). Reconectando em 300ms...`);
        await new Promise(r => setTimeout(r, 300));
        continue;
      }
      throw err;
    }
  }
};

export default pool;
