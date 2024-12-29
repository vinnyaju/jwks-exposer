#!/usr/bin/env node
import { Command } from 'commander';
import { createKey } from './commands/createKey.js';
import { createPersistencyKey } from './commands/createPersistencyKey.js';
import { getKeysByClientIdCmd } from './commands/getKeysByClientId.js';
import { getKeysByIdAndUsageCmd } from './commands/getkeysByIdAndUsage.js'
import { getKeysByUsageCmd } from './commands/getKeysByUsage.js';

import dotenv from 'dotenv';

const program = new Command();

dotenv.config();

program
  .name('admin-console')
  .description('Console administrativo para operações críticas do sistema.')
  .version('1.0.0');

// Comando para gerenciar usuários
program
  .command('create-key')
  .description('Gerenciar Chaves Criptográficas.')
  .action(createKey);

program
  .command('create-persistency-key')
  .description('Gera uma chave de persistência em base64 para armazenamento de chaves privadas e simétricas na base de dados de maneira cifrada.')
  .action(createPersistencyKey);


// Comando: Consulta por `clientId`
program
  .command('get-keys-by-client-id <clientId>')
  .description('Consulta chaves por clientId')
  .action( (clientId) => { 
    return getKeysByClientIdCmd(clientId); 
  });

// Comando: Consulta por `id` e `usage`
program
  .command('get-keys-by-id-and-usage <id> <usage>')
  .description('Consulta chaves por Id e Uso')
  .action( (id, usage) => { 
    return getKeysByIdAndUsageCmd(id, usage); 
  });

// Comando: Consulta por `usage`
program
  .command('get-keys-by-usage <usage>')
  .description('Consulta chaves por Uso')
  .action( (usage) => { 
    return getKeysByUsageCmd(usage); 
  });

program.parse(process.argv);
