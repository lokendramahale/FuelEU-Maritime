import express from 'express';
import { PrismaBankingRepository } from '../../outbound/postgres/bankingRepository';
import { bankSurplus } from '../../../core/application/usecases/bankSurplus';
import { applyBanked } from '../../../core/application/usecases/applyBanked';

const router = express.Router();
const repo = new PrismaBankingRepository();

router.get('/records', async (req, res) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: 'shipId & year required' });
  const total = await repo.getBanked(String(shipId), Number(year));
  res.json({ shipId, year, banked: total });
});

router.post('/bank', async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || typeof amount !== 'number') return res.status(400).json({ error: 'shipId, year, amount required' });
  try {
    const ret = await bankSurplus(repo, shipId, Number(year), amount);
    res.json(ret);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/apply', async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || typeof amount !== 'number') return res.status(400).json({ error: 'shipId, year, amount required' });
  try {
    const ret = await applyBanked(repo, shipId, Number(year), amount);
    res.json(ret);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
