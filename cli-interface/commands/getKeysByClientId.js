import { getKeysByClientId } from '../../database/operations.js';

export async function getKeysByClientIdCmd(clientId) {
  const keys = getKeysByClientId(clientId);
  if (keys.length > 0) {
    console.log(`Chaves encontradas para clientId "${clientId}":`);
    console.log(keys);
  } else {
    console.log(`Nenhuma chave encontrada para clientId "${clientId}".`);
  }
}