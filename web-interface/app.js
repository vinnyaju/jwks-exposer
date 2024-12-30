import express from 'express';
import dotenv from 'dotenv';
import jwksRoutes from './routes/jwks.js';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o Express
const app = express();

// Rotas para JWKS
app.use('/', jwksRoutes);

// Porta configurável via .env
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
