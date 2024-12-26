import db from './migrations.js';
import { v4 as uuidv4 } from 'uuid';

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
    stmt.run(keyUuid, clientId, type, 'public', publicKey);
    stmt.run(keyUuid, clientId, type, 'private', privateKey);
  
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
    stmt.run(keyUuid, clientId, type, 'symmetric', value);
  
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