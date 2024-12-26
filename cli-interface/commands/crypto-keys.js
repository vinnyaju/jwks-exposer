import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Diretório raiz para salvar as chaves
 */
const ROOT_KEYS_DIR = path.resolve('keys');

/**
 * Menu principal para criação de chaves com client_id
 */
export async function createKey() {
  console.log('=== Criação de Chaves de Criptografia ===');

  // Obter ou gerar client_id
  const { clientId, generateClientId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientId',
      message: 'Insira um client_id (deixe em branco para gerar automaticamente):',
    },
    {
      type: 'confirm',
      name: 'generateClientId',
      message: 'Gerar client_id automaticamente?',
      default: true,
      when: (answers) => !answers.clientId // Pergunta só se não foi fornecido um client_id
    }
  ]);

  const finalClientId = generateClientId ? uuidv4() : clientId;

  console.log(`Utilizando client_id: ${finalClientId}`);

  // Subdiretório específico do client_id
  const clientDir = path.join(ROOT_KEYS_DIR, finalClientId);
  await fs.mkdir(clientDir, { recursive: true });

  // Tipo de chave a ser gerada
  const { keyType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'keyType',
      message: 'Selecione o tipo de chave que deseja criar:',
      choices: ['RSA', 'EC (Elliptic Curve)', 'AES (Symmetric)']
    }
  ]);

  // Delegar criação conforme tipo de chave
  switch (keyType) {
    case 'RSA':
      await createRSAKey(clientDir);
      break;
    case 'EC (Elliptic Curve)':
      await createECKey(clientDir);
      break;
    case 'AES (Symmetric)':
      await createAESKey(clientDir);
      break;
    default:
      console.log('Opção inválida.');
  }
}

/**
 * Criação de chave RSA
 */
async function createRSAKey(clientDir) {
  const { keySize } = await inquirer.prompt([
    {
      type: 'list',
      name: 'keySize',
      message: 'Selecione o tamanho da chave (bits):',
      choices: [2048, 3072, 4096],
      default: 2048
    }
  ]);

  console.log(`Gerando chave RSA de ${keySize} bits...`);
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  console.log('Chave RSA gerada com sucesso.');
  await saveAsymmetricKeys(clientDir, 'rsa', { publicKey, privateKey });
}

/**
 * Criação de chave EC (Elliptic Curve)
 */
async function createECKey(clientDir) {
  const { curve } = await inquirer.prompt([
    {
      type: 'list',
      name: 'curve',
      message: 'Selecione a curva para a chave EC:',
      choices: ['prime256v1', 'secp384r1', 'secp521r1'],
      default: 'prime256v1'
    }
  ]);

  console.log(`Gerando chave EC na curva ${curve}...`);
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: curve,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  console.log('Chave EC gerada com sucesso.');
  await saveAsymmetricKeys(clientDir, 'ec', { publicKey, privateKey });
}

/**
 * Criação de chave AES
 */
async function createAESKey(clientDir) {
  const { keySize } = await inquirer.prompt([
    {
      type: 'list',
      name: 'keySize',
      message: 'Selecione o tamanho da chave AES (bits):',
      choices: [128, 192, 256, 512],
      default: 256
    }
  ]);

  console.log(`Gerando chave AES de ${keySize} bits...`);
  const key = crypto.randomBytes(keySize / 8).toString('hex');

  console.log('Chave AES gerada com sucesso.');
  await saveSymmetricKey(clientDir, 'aes', key);
}

/**
 * Salvar chaves assimétricas com o mesmo UUID e sufixos "pub" e "priv"
 */
async function saveAsymmetricKeys(clientDir, type, keys) {
  const keyUuid = uuidv4(); // UUID compartilhado para ambas as chaves
  const publicKeyPath = path.join(clientDir, `${keyUuid}-pub.pem`);
  const privateKeyPath = path.join(clientDir, `${keyUuid}-priv.pem`);

  await fs.writeFile(publicKeyPath, keys.publicKey);
  await fs.writeFile(privateKeyPath, keys.privateKey);

  console.log('Chaves salvas nos arquivos:');
  console.log(`- Chave pública: ${publicKeyPath}`);
  console.log(`- Chave privada: ${privateKeyPath}`);
}

/**
 * Salvar chave simétrica com um UUID único
 */
async function saveSymmetricKey(clientDir, type, key) {
  const keyUuid = uuidv4(); // UUID único para a chave simétrica
  const keyPath = path.join(clientDir, `${keyUuid}-sim.txt`);

  await fs.writeFile(keyPath, key);

  console.log('Chave simétrica salva no arquivo:');
  console.log(`- ${keyPath}`);
}
