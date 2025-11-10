export const TARGET_INTENSITY = 89.3368;

export function percentDiff(comparison: number, baseline: number): number {
  return ((comparison / baseline) - 1) * 100;
}

export function formatNumber(value?: number | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return "-";
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}


