#!/usr/bin/env node
import { Command } from 'commander';
import { createKey } from './commands/createKey.js';
import { createPersistencyKey } from './commands/createPersistencyKey.js';
import { getKeysByClientId, getKeysByIdAndUsage, getKeysByUsage } from '../database/operations.js'; // Substitua pelo caminho correto

import dotenv from 'dotenv';

const program = new Command();

dotenv.config();

program
  .name('admin-console')
  .description('Console administrativo para operações críticas do sistema.')
  .version('1.0.0');

// Comando para gerenciar usuários
program
  .command('createKey')
  .description('Gerenciar Chaves Criptográficas.')
  .action(createKey);

program
  .command('create-persistency-key')
  .description('Gera uma chave de persistência em base64 para armazenamento de chaves privadas e simétricas na base de dados de maneira cifrada.')
  .action(createPersistencyKey);


// Comando: Consulta por `clientId`
program
  .command('get-by-client-id <clientId>')
  .description('Consulta chaves por clientId')
  .action((clientId) => {
    const keys = getKeysByClientId(clientId);
    if (keys.length > 0) {
      console.log(`Chaves encontradas para clientId "${clientId}":`);
      console.log(keys);
    } else {
      console.log(`Nenhuma chave encontrada para clientId "${clientId}".`);
    }
  });

// Comando: Consulta por `id` e `usage`
program
  .command('get-by-id-and-usage <id> <usage>')
  .description('Consulta chaves por ID e uso')
  .action((id, usage) => {
    const keys = getKeysByIdAndUsage(id, usage);
    if (keys.length > 0) {
      console.log(`Chaves encontradas para ID "${id}" com uso "${usage}":`);
      console.log(keys);
    } else {
      console.log(`Nenhuma chave encontrada para ID "${id}" com uso "${usage}".`);
    }
  });

// Comando: Consulta por `usage`
program
  .command('get-by-usage <usage>')
  .description('Consulta chaves por uso')
  .action((usage) => {
    const keys = getKeysByUsage(usage);
    if (keys.length > 0) {
      console.log(`Chaves encontradas com uso "${usage}":`);
      console.log(keys);
    } else {
      console.log(`Nenhuma chave encontrada com uso "${usage}".`);
    }
  });

program.parse(process.argv);
