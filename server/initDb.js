import pool from './db.js';
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

      // Migrações seguras de colunas para aceite digital de propostas
      try { await connection.query('ALTER TABLE propostas ADD COLUMN aceite_nome VARCHAR(255) NULL'); } catch (e) {}
      try { await connection.query('ALTER TABLE propostas ADD COLUMN aceite_ip VARCHAR(100) NULL'); } catch (e) {}
      try { await connection.query('ALTER TABLE propostas ADD COLUMN aceite_data DATETIME NULL'); } catch (e) {}

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

      // 7. Tabela biblioteca_blocos (Content Library Proposify)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS biblioteca_blocos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          titulo VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) DEFAULT 'servicos',
          conteudo TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (user_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 8. Tabela proposta_eventos (Tracking de Eventos Comercial)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS proposta_eventos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          proposta_id INT NOT NULL,
          tipo VARCHAR(50) NOT NULL,
          descricao TEXT,
          ip_origem VARCHAR(100),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (proposta_id),
          FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // 9. Tabela proposta_comentarios (Chat & Negociação Comercial)
      await connection.query(`
        CREATE TABLE IF NOT EXISTS proposta_comentarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          proposta_id INT NOT NULL,
          autor VARCHAR(255) NOT NULL,
          is_cliente BOOLEAN DEFAULT FALSE,
          mensagem TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX (proposta_id),
          FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

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
