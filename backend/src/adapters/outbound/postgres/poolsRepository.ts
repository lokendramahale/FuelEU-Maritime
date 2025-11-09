import { PoolsRepository } from '../../../core/ports/repositories';
import { prisma } from '../../../infra/prismaClient';

export class PrismaPoolsRepository implements PoolsRepository {
  async createPool(year: number, members: { shipId: string; cb_before: number; cb_after: number }[]) {
    const pool = await prisma.pool.create({
      data: {
        year,
        members: { create: members.map(m => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: m.cb_after })) }
      },
      include: { members: true }
    });
    return pool;
  }
}
