import type { Route } from "../../domain/types";

export function computeCB(route: Route, targetIntensity: number): number {
  const energy = route.fuelConsumption * 41000; // MJ in scope
  const diff = targetIntensity - route.ghgIntensity;
  return diff * energy;
}
