import db from './migrations.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto'; // Importa o módulo crypto no Node.js


// Gerar um novo client_id
function generateUuid() {
    return uuidv4();
}

// Função para processar as chaves e descriptografar quando necessário
function processKeysForDecryption(keys) {
  return keys.map((key) => {
      if (key.usage === 'private' || key.usage === 'symmetric') {
          return {
              ...key,
              value: decryptKey(key.value), // Descriptografa o valor da chave
          };
      }
      return key; // Retorna como está para chaves públicas
  });
}

// Função para descriptografar valores
function decryptKey(value) {

  const persistenceKey = Buffer.from(process.env.PERSISTENCY_KEY, 'base64');

  const parsedValue = JSON.parse(value);

  if (parsedValue.alg !== 'AES-256-GCM' || parsedValue.key_length !== 256) {
      throw new Error('Algoritmo ou configuração não suportada.');
  }

  const ivBuffer = Buffer.from(parsedValue.iv, 'base64');
  const authTagBuffer = Buffer.from(parsedValue.authTag, 'base64');
  const encryptedKey = parsedValue.encrypted_key;

  const decipher = crypto.createDecipheriv('aes-256-gcm', persistenceKey, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(encryptedKey, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

function encryptKey(value) {
  const persistenceKey = Buffer.from(process.env.PERSISTENCY_KEY, 'base64');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', persistenceKey, iv);

  let encrypted = cipher.update(value, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();

  return {
      alg: 'AES-256-GCM',
      key_length: 256,
      key_id: "ENV_PERSISTENCY_KEY", // Nomeando o campo
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encrypted_key: encrypted
  };
}

/**
 * 
 * Salvar client_id
 */
export function saveDbClientId(clientId) {
  const stmt = db.prepare('INSERT OR IGNORE INTO clients (id) VALUES (?);');
  stmt.run(clientId);
  console.log(`Client ID salvo: ${clientId}`);
}
/**
 * Salvar chaves pública e privada de forma separada
 */
export function saveDbAsymmetricKeys(clientId, type, key_info, publicKey, privateKey) {
    const stmt = db.prepare(`
      INSERT INTO keys (id, client_id, type, key_info, usage, value)
      VALUES (?, ?, ?, ?, ?, ?);
    `);
  
    const keyUuid = generateUuid(); // UUID único compartilhado
    const encryptedPrivateKey = JSON.stringify(encryptKey(privateKey));
    stmt.run(keyUuid, clientId, type, key_info, 'public', publicKey);
    stmt.run(keyUuid, clientId, type, key_info, 'private', encryptedPrivateKey);
  
    console.log(`Chaves assimétricas salvas com ID: ${keyUuid}`);
  }
/**
 * Salvar chave simétrica
 */
export function saveDbSymmetricKey(clientId, type, key_info, value) {
    const stmt = db.prepare(`
      INSERT INTO keys (id, client_id, type, key_info, usage, value)
      VALUES (?, ?, ?, ?, ?, ?);
    `);
  
    const keyUuid = generateUuid();
    const encryptedKey = JSON.stringify(encryptKey(value));
    stmt.run(keyUuid, clientId, type, key_info, 'symmetric', encryptedKey);
  
    console.log(`Chave simétrica salva com ID: ${keyUuid}`);
  }

/**
 * Consultar chaves associadas a um client_id
 */
export function getKeysByClientId(clientId) {
  const stmt = db.prepare('SELECT * FROM keys WHERE client_id = ?;');
  const keys = stmt.all(clientId);
  return processKeysForDecryption(keys); // Processa as chaves retornadas
}

/**
 * Consultar chaves associadas a um client_id e uso
 */
export function getKeysByIdAndUsage(id, usage) {
  const stmt = db.prepare('SELECT * FROM keys WHERE id = ? AND usage = ?;');
  const keys = stmt.all(id, usage);
  return processKeysForDecryption(keys);
}

/**
 * Consultar chaves associadas a um uso independente do client_id
 */
export function getKeysByUsage(usage) {
  const stmt = db.prepare('SELECT * FROM keys WHERE usage = ?;');
  const keys = stmt.all(usage);
  return processKeysForDecryption(keys);
}

/**
 * Consultar chaves públicas para um dado client_id
 */
export function getPublicKeysByClientId(clientId) {
  const stmt = db.prepare('SELECT * FROM keys WHERE client_id = ? AND usage = ?;');
  const keys = stmt.all(clientId, 'public');
  return processKeysForDecryption(keys);
}

export function getPublicKeysByStatus(active) {
  const stmt = db.prepare('SELECT * FROM keys WHERE active = ? AND usage = ?');
  const keys = stmt.all(active, 'public');
  return processKeysForDecryption(keys);
}

export function getPublicKeysByClientAndStatus(clientId, active) {
  const stmt = db.prepare('SELECT * FROM keys WHERE client_id = ? AND active = ? AND usage = ?;');
  const keys = stmt.all(clientId, active, 'public');
  return processKeysForDecryption(keys);
}