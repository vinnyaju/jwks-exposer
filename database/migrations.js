import Database from 'better-sqlite3';
import path from 'path';

// Caminho do banco de dados
const DB_PATH = path.resolve('db', 'database.sqlite');

// Abrir conexão com o banco
const db = new Database(DB_PATH);

// Executar migrations
function runMigrations() {
  console.log('Executando migrations...');

  // Criar tabela de clients
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id CHAR(36) PRIMARY KEY,         -- UUID do client_id
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Criar tabela de keys
  db.exec(`
    CREATE TABLE IF NOT EXISTS keys (
      id CHAR(36) NOT NULL,            -- UUID da chave
      client_id CHAR(36) NOT NULL,     -- Relacionamento com o client_id
      type VARCHAR(10) NOT NULL,       -- Tipo da chave (rsa, ec, aes)
      key_info VARCHAR(50) NOT NULL,   -- Informações da chave (ex: '2048', '4096', '256', 'prime256v1', 'secp384r1',  'secp521r1')
      usage VARCHAR(10) NOT NULL,      -- Uso: 'public', 'private' ou 'symmetric'
      value TEXT NOT NULL,             -- Valor da chave
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id, type, usage),
      FOREIGN KEY (client_id) REFERENCES clients (id)
    );
  `);

  // Criar índice para consultas frequentes por id e usage
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_keys_id_usage
    ON keys (id, usage);
  `);

  console.log('Migrations concluídas.');
}

// Rodar as migrations
runMigrations();

export default db;