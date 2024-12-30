import * as jose from 'node-jose';
import {getPublicKeysByStatus as getFromDbPublicKeysByStatus, getPublicKeysByClientAndStatus as getFromDbPublicKeysByClientAndStatus} from '../../database/operations.js'

// Retorna todas as chaves públicas por status
export async function getPublicKeysByStatus(status) {
  const jwks = {
    keys: await getFromDbPublicKeysByStatus(status)
      .map(async (key) => await convertToJwk(key)
    ),
  };

  return jwks;
}

// Retorna as chaves públicas por clientId e status
export async function getPublicKeysByClientAndStatus(clientId, status) {
  const jwks = {
    keys: await getFromDbPublicKeysByClientAndStatus(clientId, status)
        .map(async (key) => await convertToJwk(key)
    ),
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
  console.log(key.value);

  console.log('jose-jwk: ' + jose.JWK);
  const jwk = await jose.JWK.asKey(key.value, 'pem');
  return {
    ...jwk.toJSON(),
    kid: key.id,
    alg: key.type === 'ec' ? `ES${key.key_info.replace('secp', '')}` : 'RS256',
    use: 'sig',
  };
}
