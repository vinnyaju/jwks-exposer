import db from './migrations.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'; // Importa o módulo crypto no Node.js
import { Console } from 'console';


/**
 * Salvar um novo client_id
 */

function generateUuid() {
    return uuidv4();
}

export function saveDbClientId(clientId) {
  const stmt = db.prepare('INSERT OR IGNORE INTO clients (id) VALUES (?);');
  stmt.run(clientId);
  console.log(`Client ID salvo: ${clientId}`);
}
/**
 * Salvar chaves pública e privada de forma separada
 */
export function saveDbAsymmetricKeys(clientId, type, publicKey, privateKey) {
    const stmt = db.prepare(`
      INSERT INTO keys (id, client_id, type, usage, value)
      VALUES (?, ?, ?, ?, ?);
    `);
  
    const keyUuid = generateUuid(); // UUID único compartilhado

    const persistenceKey = process.env.PERSISTENCE_KEY;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(persistenceKey, 'base64'), iv);

    let privateKeyEncrypted = cipher.update(privateKey, 'utf8', 'base64');
    privateKeyEncrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();


    const jsonPrivateKeyEncrypted = JSON.stringify({
      alg: 'AES-256-GCM',
      key_length: 256,
      key_id: "ENV_PERSISTENCE_KEY", // Nomeando o campo
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encrypted_key: privateKeyEncrypted
    });


    stmt.run(keyUuid, clientId, type, 'public', publicKey);
    stmt.run(keyUuid, clientId, type, 'private', jsonPrivateKeyEncrypted);
  
    console.log(`Chaves assimétricas salvas com ID: ${keyUuid}`);
  }
/**
 * Salvar chave simétrica
 */
export function saveDbSymmetricKey(clientId, type, value) {
    const stmt = db.prepare(`
      INSERT INTO keys (id, client_id, type, usage, value)
      VALUES (?, ?, ?, ?, ?);
    `);
  
    const keyUuid = generateUuid();

    const persistenceKey = process.env.PERSISTENCE_KEY;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(persistenceKey, 'base64'), iv);

    let valueEncrypted = cipher.update(value, 'utf8', 'base64');
    valueEncrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();


    const jsonValueEncrypted = JSON.stringify({
      alg: 'AES-256-GCM',
      key_length: 256,
      key_id: "ENV_PERSISTENCE_KEY", // Nomeando o campo
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encrypted_key: valueEncrypted
    });

    stmt.run(keyUuid, clientId, type, 'symmetric', jsonValueEncrypted);
  
    console.log(`Chave simétrica salva com ID: ${keyUuid}`);
  }
/**
 * Consultar chaves associadas a um client_id
 */
export function getKeysByClientId(clientId) {
    const stmt = db.prepare('SELECT * FROM keys WHERE client_id = ?;');
    return stmt.all(clientId);
  }

export function getKeysByIdAndUsage(id, usage) {
    const stmt = db.prepare('SELECT * FROM keys WHERE id = ? AND usage = ?;');
    return stmt.all(id, usage);
  }

export function getKeysByUsage(usage) {
    const stmt = db.prepare('SELECT * FROM keys WHERE usage = ?;');
    return stmt.all(usage);
  }