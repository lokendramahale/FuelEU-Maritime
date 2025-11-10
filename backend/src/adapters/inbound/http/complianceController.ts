import express from 'express';
import { PrismaRoutesRepository } from '../../outbound/postgres/routesRepository';
import { PrismaComplianceRepository } from '../../outbound/postgres/complianceRepository';
import { computeCBForRoute } from '../../../core/application/usecases/computeCB';

const router = express.Router();
const routesRepo = new PrismaRoutesRepository();
const complianceRepo = new PrismaComplianceRepository();

router.get('/cb', async (req, res) => {
  // accepts shipId or routeId
  const { shipId, year } = req.query;
  if (!shipId || !year) {
    return res.status(400).json({ error: 'shipId and year required' });
  }
  // compute CB for route matching shipId and year
  const routes = await routesRepo.findAll({ routeId: String(shipId), year: Number(year) } as any);
  if (!routes || routes.length === 0) {
    return res.status(404).json({ error: 'Route not found' });
  }
  const result = await computeCBForRoute(routes[0], complianceRepo);
  res.json({ cb: result.cb, shipId: result.shipId, year: result.year });
});

router.get('/adjusted-cb', async (req, res) => {
  // For demonstration: returns cb and banked applied
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: 'shipId and year required' });
  // compute current CB
  const routes = await routesRepo.findAll({ routeId: String(shipId), year: Number(year) } as any);
  if (!routes || routes.length === 0) return res.status(404).json({ error: 'Route not found' });
  const cbObj = await computeCBForRoute(routes[0], complianceRepo);
  // get banked amount
  const { PrismaBankingRepository } = await import('../../outbound/postgres/bankingRepository');
  const bankingRepo = new PrismaBankingRepository();
  const banked = await bankingRepo.getBanked(String(shipId), Number(year));
  // adjusted: cb + banked (banked is positive surplus that can offset negative cb)
  const adjusted = cbObj.cb + banked;
  res.json({ shipId, year, cb_before: cbObj.cb, banked, adjusted });
});

export default router;
