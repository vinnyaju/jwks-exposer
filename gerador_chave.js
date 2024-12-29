const crypto = require('crypto');
console.log('Crie um arquivo .env com a chave PERSISTENCE_KEY');
console.log('PERSISTENCE_KEY=' + crypto.randomBytes(32).toString('base64')); // Gera chave em formato hexadecimal
