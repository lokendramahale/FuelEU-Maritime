// applyBanked.ts
import { BankingRepository } from '../../ports/repositories';

export async function applyBanked(bankingRepo: BankingRepository, shipId: string, year: number, amount: number) {
  const available = await bankingRepo.getBanked(shipId, year);
  if (amount > available) throw new Error('Insufficient banked amount');
  // consume banked
  await bankingRepo.consumeBanked(shipId, year, amount);
  return { applied: amount, remaining: available - amount };
}
