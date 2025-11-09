// bankSurplus.ts
import { BankingRepository } from '../../ports/repositories';

export async function bankSurplus(bankingRepo: BankingRepository, shipId: string, year: number, amount: number) {
  if (amount <= 0) throw new Error('Only positive CB can be banked');
  await bankingRepo.addBankEntry(shipId, year, amount);
  const total = await bankingRepo.getBanked(shipId, year);
  return { cb_before: amount, banked_total: total };
}
