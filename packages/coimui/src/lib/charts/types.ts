export interface CoimChartSeries<TData = Record<string, unknown>> {
  key: string;
  label?: string;
  valueKey?: keyof TData & string;
  valueAccessor?: (row: TData) => number;
  color?: string;
  visible?: boolean;
}

export interface CoimPieDatum {
  key?: string;
  label: string;
  value: number;
  color?: string;
}

export interface CoimScatterDatum {
  x: number;
  y: number;
  r?: number;
  label?: string;
  series?: string;
}

export interface CoimRadarSeries {
  key: string;
  label: string;
  values: number[];
  color?: string;
}

export interface CoimHeatmapCell {
  x: string;
  y: string;
  value: number;
}

export interface CoimFunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface CoimLegendEntry {
  key: string;
  label: string;
  color: string;
  visible: boolean;
}

export interface CoimBarChartProps<TData = Record<string, unknown>> {
  data: TData[];
  xKey: keyof TData & string;
  series: CoimChartSeries<TData>[];
  orientation?: "vertical" | "horizontal";
  layout?: "group" | "stack";
  height?: number;
  showLegend?: boolean;
  grid?: boolean;
  title?: string;
  ariaLabel?: string;
  class?: string;
}

export interface CoimLineChartProps<TData = Record<string, unknown>> {
  data: TData[];
  xKey: keyof TData & string;
  series: CoimChartSeries<TData>[];
  curve?: "linear" | "smooth";
  showPoints?: boolean;
  height?: number;
  showLegend?: boolean;
  grid?: boolean;
  title?: string;
  ariaLabel?: string;
  class?: string;
}

export interface CoimAreaChartProps<TData = Record<string, unknown>> {
  data: TData[];
  xKey: keyof TData & string;
  series: CoimChartSeries<TData>[];
  stacked?: boolean;
  curve?: "linear" | "smooth";
  height?: number;
  showLegend?: boolean;
  grid?: boolean;
  title?: string;
  ariaLabel?: string;
  class?: string;
}
