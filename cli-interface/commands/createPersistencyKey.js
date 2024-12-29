import crypto from 'crypto';

export async function createPersistencyKey() {
  console.log('Crie um arquivo .env com a chave PERSISTENCY_KEY');
  console.log('PERSISTENCY_KEY=' + crypto.randomBytes(32).toString('base64'));
}