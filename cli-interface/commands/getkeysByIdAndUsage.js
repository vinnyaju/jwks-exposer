import { getKeysByIdAndUsage } from '../../database/operations.js';
export async function getKeysByIdAndUsageCmd(id, usage) {
  const keys = getKeysByIdAndUsage(id, usage);
  if (keys.length > 0) {
    console.log(`Chaves encontradas para ID "${id}" com uso "${usage}":`);
    console.log(keys);
  } else {
    console.log(`Nenhuma chave encontrada para ID "${id}" com uso "${usage}".`);
  }
}