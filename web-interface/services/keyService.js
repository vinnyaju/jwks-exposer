import { exportJWK, importSPKI } from 'jose';
import {
  getPublicKeysByStatus as getFromDbPublicKeysByStatus, 
  getPublicKeysByClientAndStatus as getFromDbPublicKeysByClientAndStatus
} from '../../database/operations.js'

// Retorna todas as chaves públicas por status
export async function getPublicKeysByStatus(status) {
  const dbKeys = getFromDbPublicKeysByStatus(status);
  const keys = [];

  for (const dbKey of dbKeys) {
    keys.push(await convertToJwk(dbKey));
  }

  const jwks = {
    keys: keys
  };

  return jwks;
}

// Retorna as chaves públicas por clientId e status
export async function getPublicKeysByClientAndStatus(clientId, status) {
  
  const dbKeys = getFromDbPublicKeysByClientAndStatus(clientId, status);
  const keys = [];

  for (const dbKey of dbKeys) {
    keys.push(await convertToJwk(dbKey));
  }

  const jwks = {
    keys: keys
  };

  return jwks;
}

// Converte uma chave pública para o formato JWK
async function convertToJwk(key) {
  if (!key.value) {
    throw new Error(`A chave com ID ${key.id} não possui um valor válido em "value".`);
  }

  if (typeof key.value !== 'string' || !key.value.includes('-----BEGIN PUBLIC KEY-----')) {
    throw new Error(`Formato inválido de chave para key.id: ${key.id}`);
  }

  const alg = (
    key.type == 'ec' ? 
      `ES${key.key_info.replace('secp', '')
        .replace('prime', '')
        .replace('v1', '')
        .replace('r1', '')}` : 
      'RS256'
  );

  const importedKey = await importSPKI(key.value, alg);
  const jwk = await exportJWK(importedKey);
 
  return {
    ...jwk,
    kid: key.id,
    alg: alg,
    use: 'sig',
  };
}
