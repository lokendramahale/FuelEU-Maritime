import { PoolsRepository } from '../../ports/repositories';

export function createPoolAllocation(members: { shipId: string; cb_before: number }[]) {
  const sum = members.reduce((s, m) => s + m.cb_before, 0);
  if (sum < 0) throw new Error('Total CB of pool must be >= 0');

  // copy and sort
  const surplus = members.filter(m => m.cb_before > 0).sort((a, b) => b.cb_before - a.cb_before);
  const deficits = members.filter(m => m.cb_before < 0).sort((a, b) => a.cb_before - b.cb_before); // more negative first

  // result map
  const resultMap = new Map<string, number>();
  members.forEach(m => resultMap.set(m.shipId, m.cb_before));

  let si = 0;
  for (let di = 0; di < deficits.length; di++) {
    let deficit = -deficits[di].cb_before; // positive required
    while (deficit > 1e-6 && si < surplus.length) {
      const s = surplus[si];
      const available = resultMap.get(s.shipId) ?? 0;
      if (available <= 0) { si++; continue; }
      const transfer = Math.min(available, deficit);
      // apply transfer
      resultMap.set(s.shipId, (resultMap.get(s.shipId) ?? 0) - transfer);
      resultMap.set(deficits[di].shipId, (resultMap.get(deficits[di].shipId) ?? 0) + transfer);
      deficit -= transfer;
      if ((resultMap.get(s.shipId) ?? 0) <= 1e-9) si++;
    }
    if (deficit > 1e-6) {
      throw new Error('Insufficient surplus to cover deficits (should not happen if sum >= 0)');
    }
  }

  // validate rules: surplus not negative after transfers? previously enforced.
  const final = members.map(m => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: resultMap.get(m.shipId) ?? m.cb_before }));
  // validate: deficit ship cannot exit worse (cb_after >= cb_before)
  for (const f of final) {
    if (f.cb_after < f.cb_before - 1e-6) throw new Error('Allocation caused a ship to be worse off');
    if (f.cb_after < -1e-6) throw new Error('Surplus ship ended negative');
  }
  return final;
}

export async function createPool(poolsRepo: PoolsRepository, year: number, members: { shipId: string; cb_before: number }[]) {
  const alloc = createPoolAllocation(members);
  const pool = await poolsRepo.createPool(year, alloc);
  return pool;
}
