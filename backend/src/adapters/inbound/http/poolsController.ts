import express from 'express';
import { PrismaPoolsRepository } from '../../outbound/postgres/poolsRepository';
import { createPool } from '../../../core/application/usecases/createPool';

const router = express.Router();
const poolsRepo = new PrismaPoolsRepository();

router.post('/', async (req, res) => {
  const { year, members } = req.body;
  // members: [{ shipId, cb_before }]
  if (!year || !Array.isArray(members)) return res.status(400).json({ error: 'year and members required' });
  try {
    const pool = await createPool(poolsRepo, Number(year), members);
    res.status(201).json(pool);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
