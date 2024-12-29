import { getKeysByClientId } from './database/operations.js';
import dotenv from 'dotenv';

dotenv.config();
console.log('=== Consulta de Chaves ===');
console.log(getKeysByClientId('c7a0bc58-2fa9-4a76-acbb-05845fe5a96c'));
