export type RouteDTO = {
  id?: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumption: number; // t
  distanceKm: number;
  totalEmissions: number;
  isBaseline?: boolean;
};
