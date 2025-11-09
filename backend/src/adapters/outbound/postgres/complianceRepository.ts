import { ComplianceRepository } from '../../../core/ports/repositories';
import { prisma } from '../../../infra/prismaClient';

export class PrismaComplianceRepository implements ComplianceRepository {
  async saveCB(shipId: string, year: number, cb: number) {
    await prisma.shipCompliance.create({ data: { shipId, year, cb_gco2eq: cb } });
  }
  async getCB(shipId: string, year: number) {
    const rec = await prisma.shipCompliance.findFirst({ where: { shipId, year }, orderBy: { createdAt: 'desc' } });
    return rec ? rec.cb_gco2eq : null;
  }
}
