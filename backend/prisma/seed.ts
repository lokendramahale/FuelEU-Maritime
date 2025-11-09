import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const routes = [
    { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distanceKm: 12000, totalEmissions: 4500 },
    { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distanceKm: 11500, totalEmissions: 4200 },
    { routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distanceKm: 12500, totalEmissions: 4700 },
    { routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distanceKm: 11800, totalEmissions: 4300 },
    { routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distanceKm: 11900, totalEmissions: 4400 }
  ];

  for (const r of routes) {
    await prisma.route.upsert({
      where: { routeId: r.routeId },
      update: r,
      create: { ...r }
    });
  }

  // set R001 as baseline default if none has baseline true
  const anyBaseline = await prisma.route.findFirst({ where: { isBaseline: true } });
  if (!anyBaseline) {
    await prisma.route.updateMany({ where: { routeId: 'R001' }, data: { isBaseline: true } });
  }

  console.log('Seed completed');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
