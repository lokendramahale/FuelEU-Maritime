import { computeCBForRoute } from '../../src/core/application/usecases/computeCB';
import { PrismaComplianceRepository } from '../../src/adapters/outbound/postgres/complianceRepository';

// use a fake repo
class FakeComplianceRepo {
  saved: any[] = [];
  async saveCB(shipId: string, year: number, cb: number) { this.saved.push({ shipId, year, cb }); }
  async getCB() { return null; }
}

test('computeCB formula correctness', async () => {
  const repo = new FakeComplianceRepo() as any;
  const route = {
    routeId: 'RTEST',
    ghgIntensity: 90,
    fuelConsumption: 1000,
    year: 2025
  } as any;
  const res = await computeCBForRoute(route, repo);
  // energy = 1000 * 41000 = 41,000,000 MJ
  // cb = (89.3368 - 90) * 41,000,000 = -0.6632 * 41,000,000 = -27,201, - actually compute:
  const expected = (89.3368 - 90) * 1000 * 41000;
  expect(res.cb).toBeCloseTo(expected, 5);
  expect(repo.saved.length).toBe(1);
});
