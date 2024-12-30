import express from 'express';
import { getPublicKeysByStatus, getPublicKeysByClientAndStatus } from '../services/keyService.js';

const router = express.Router();

// Rota: Retorna todas as chaves públicas por status
router.get('/:status/jwks.json', async (req, res) => {
  const { status } = req.params;

  try {
    const keys = await getPublicKeysByStatus(status == 'active' ? 1 : 0);
    res.json(keys);
  } catch (error) {
    console.error('Erro ao buscar JWKS:', error);
    res.status(500).json({ error: 'Erro interno ao buscar JWKS' });
  }
});

// Rota: Retorna as chaves públicas de um cliente específico por status
router.get('/:clientId/:status/jwks.json', async (req, res) => {
  const { clientId, status } = req.params;

  try {
    const keys = await getPublicKeysByClientAndStatus(clientId, status);
    res.json(keys);
  } catch (error) {
    console.error('Erro ao buscar JWKS:', error);
    res.status(500).json({ error: 'Erro interno ao buscar JWKS' });
  }
});

export default router;
