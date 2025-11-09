import { BankingRepository } from '../../../core/ports/repositories';
import { prisma } from '../../../infra/prismaClient';

export class PrismaBankingRepository implements BankingRepository {
  async getBanked(shipId: string, year: number) {
    const rows = await prisma.bankEntry.findMany({ where: { shipId, year } });
    return rows.reduce((s, r) => s + r.amount_gco2eq, 0);
  }
  async addBankEntry(shipId: string, year: number, amount: number) {
    await prisma.bankEntry.create({ data: { shipId, year, amount_gco2eq: amount } });
  }
  async consumeBanked(shipId: string, year: number, amount: number) {
    // simple approach: create negative bank entry to reduce total
    await prisma.bankEntry.create({ data: { shipId, year, amount_gco2eq: -Math.abs(amount) } });
  }
}
