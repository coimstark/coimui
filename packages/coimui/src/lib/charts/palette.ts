export const COIM_CHART_PALETTE = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent-1))",
  "hsl(var(--accent-2))",
  "hsl(var(--accent-3))",
  "hsl(var(--accent-4))",
  "hsl(var(--accent-5))",
  "hsl(var(--accent-6))",
] as const;

export function getChartColor(index: number, explicit?: string): string {
  if (explicit) return explicit;
  return COIM_CHART_PALETTE[((index % COIM_CHART_PALETTE.length) + COIM_CHART_PALETTE.length) % COIM_CHART_PALETTE.length];
}
