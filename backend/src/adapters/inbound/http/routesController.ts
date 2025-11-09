import express from 'express';
import { PrismaRoutesRepository } from '../../outbound/postgres/routesRepository';
import { computeComparison } from '../../../core/application/usecases/computeComparison';

const router = express.Router();
const repo = new PrismaRoutesRepository();

router.get('/', async (req, res) => {
  const filters: any = {};
  if (req.query.vesselType) filters.vesselType = String(req.query.vesselType);
  if (req.query.fuelType) filters.fuelType = String(req.query.fuelType);
  if (req.query.year) filters.year = Number(req.query.year);
  const routes = await repo.findAll(filters);
  res.json(routes);
});

router.post('/:id/baseline', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await repo.setBaseline(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/comparison', async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const result = await computeComparison(repo, year);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
