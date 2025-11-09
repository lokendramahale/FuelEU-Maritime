import { createPoolAllocation } from '../../src/core/application/usecases/createPool';

test('pool allocation greedy works', () => {
  const members = [
    { shipId: 'A', cb_before: 100 },
    { shipId: 'B', cb_before: -30 },
    { shipId: 'C', cb_before: -70 }
  ];
  const final = createPoolAllocation(members as any);
  // after allocation, deficits covered
  const a = final.find(f => f.shipId === 'A')!;
  const b = final.find(f => f.shipId === 'B')!;
  const c = final.find(f => f.shipId === 'C')!;
  expect(a.cb_after).toBeCloseTo(0);
  expect(b.cb_after).toBeCloseTo(0);
  expect(c.cb_after).toBeCloseTo(0);
});

