import { describe, it, expect } from "vitest";
import { computeComparison } from "core/application/usecases/computeComparison";

const baseline = { id: "1", routeId: "R0", vesselType: "C", fuelType: "HFO", year: 2024, ghgIntensity: 90, fuelConsumption: 1000, distance: 1000, totalEmissions: 100, isBaseline: true};
const comparison = { ...baseline, id:"2", routeId: "R1", ghgIntensity: 88 };

describe("computeComparison", () => {
  it("computes percent and compliance", () => {
    const r = computeComparison(baseline as any, comparison as any);
    expect(Math.round(r.percentDiff*1000)/1000).toBeCloseTo(((88/90)-1)*100, 6);
    expect(typeof r.compliant).toBe("boolean");
  });
});
