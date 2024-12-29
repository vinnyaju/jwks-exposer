import { getPublicKeysByClientId } from '../../database/operations.js';

export async function getPublicKeysByClientIdCmd(clientId) {
  const keys = getPublicKeysByClientId(clientId);
  if (keys.length > 0) {
    console.log(`Chaves públicas encontradas para clientId "${clientId}":`);
    console.log(keys);
  } else {
    console.log(`Nenhuma chave pública encontrada para clientId "${clientId}".`);
  }
}