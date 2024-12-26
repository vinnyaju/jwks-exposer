#!/usr/bin/env node
import { Command } from 'commander';
import { createKey } from './commands/crypto-keys.js';

const program = new Command();

program
  .name('admin-console')
  .description('Console administrativo para operações críticas do sistema.')
  .version('1.0.0');

// Comando para gerenciar usuários
program
  .command('crypto-keys')
  .description('Gerenciar Chaves Criptográficas.')
  .action(createKey);

program.parse(process.argv);
