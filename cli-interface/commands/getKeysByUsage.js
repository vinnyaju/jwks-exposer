import { getKeysByUsage } from '../../database/operations.js';

export async function getKeysByUsageCmd(usage) {
    const keys = getKeysByUsage(usage);
  if (keys.length > 0) {
    console.log(`Chaves encontradas para uso "${usage}":`);
    console.log(keys);
  } else {
    console.log(`Nenhuma chave encontrada para uso "${usage}".`);
  }
}