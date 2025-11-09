import { RoutesRepository, ComplianceRepository } from '../../ports/repositories';
import { RouteDTO } from '../../domain/types';

const TARGET_INTENSITY = 89.3368;
const MJ_PER_T = 41000;

export async function computeCBForRoute(route: RouteDTO, complianceRepo: ComplianceRepository) {
  const energy = route.fuelConsumption * MJ_PER_T; // MJ
  const cb = (TARGET_INTENSITY - route.ghgIntensity) * energy; // gCO2e
  // Save snapshot keyed by shipId (we'll use routeId as shipId)
  await complianceRepo.saveCB(route.routeId, route.year, cb);
  return { shipId: route.routeId, year: route.year, cb };
}
