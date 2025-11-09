import { RoutesRepository } from '../../ports/repositories';

export async function computeComparison(routesRepo: RoutesRepository, year?: number) {
  const baseline = await routesRepo.findBaseline(year);
  const all = await routesRepo.findAll({ year: year ?? undefined });

  if (!baseline) throw new Error('No baseline route found');

  const results = all.map(route => {
    const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    const compliant = route.ghgIntensity <= baseline.ghgIntensity; // or compare to target? frontend asked target 89.3368; we'll return both
    return {
      route,
      percentDiff,
      compliant,
      target: 89.3368,
      compliantToTarget: route.ghgIntensity <= 89.3368
    };
  });

  return { baseline, comparisons: results };
}
