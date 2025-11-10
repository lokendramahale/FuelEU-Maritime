import type { Route, ComparisonRow } from "../../domain/types";
import { percentDiff, TARGET_INTENSITY } from "shared/helpers";

export function computeComparison(
  baseline: Route,
  comparison: Route
): ComparisonRow {
  const pd = percentDiff(comparison.ghgIntensity, baseline.ghgIntensity);
  const compliant = comparison.ghgIntensity <= TARGET_INTENSITY;
  return { baseline, comparison, percentDiff: pd, compliant };
}
