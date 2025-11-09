import { RoutesRepository } from '../../../core/ports/repositories';
import { RouteDTO } from '../../../core/domain/types';
import { prisma } from '../../../infra/prismaClient';

export class PrismaRoutesRepository implements RoutesRepository {
  async findAll(filter?: Partial<RouteDTO>): Promise<RouteDTO[]> {
    const where: any = {};
    if (filter?.vesselType) where.vesselType = filter.vesselType;
    if (filter?.fuelType) where.fuelType = filter.fuelType;
    if (filter?.year) where.year = filter.year;
    const rows = await prisma.route.findMany({ where, orderBy: { id: 'asc' } });
    return rows.map(r => ({
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distanceKm: r.distanceKm,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline
    }));
  }

  async findById(id: number) {
    const r = await prisma.route.findUnique({ where: { id } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distanceKm: r.distanceKm,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline
    };
  }

  async findBaseline(year?: number) {
    const where: any = { isBaseline: true };
    if (year) where.year = year;
    const r = await prisma.route.findFirst({ where });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distanceKm: r.distanceKm,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline
    };
  }

  async setBaseline(id: number) {
    // unset previous baseline same year
    const route = await prisma.route.findUnique({ where: { id } });
    if (!route) throw new Error('Route not found');
    await prisma.route.updateMany({ where: { year: route.year }, data: { isBaseline: false } });
    await prisma.route.update({ where: { id }, data: { isBaseline: true } });
  }

  async upsert(route: RouteDTO) {
    const r = await prisma.route.upsert({
      where: { routeId: route.routeId },
      create: {
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distanceKm: route.distanceKm,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline ?? false
      },
      update: {
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distanceKm: route.distanceKm,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline ?? false
      }
    });
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distanceKm: r.distanceKm,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline
    };
  }
}
