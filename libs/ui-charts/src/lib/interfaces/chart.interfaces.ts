/**
 * Chart Abstraction Layer Interfaces
 * These interfaces define the contract for chart components.
 * The underlying implementation (Chart.js, D3, etc.) is hidden from consumers.
 */

/** Basic data point for time-series or categorical data */
export interface ChartDataPoint {
  label: string;
  value: number;
}

/** Multi-series data point */
export interface MultiSeriesDataPoint {
  label: string;
  values: Record<string, number>;
}

/** Donut/Pie segment */
export interface ChartSegment {
  label: string;
  value: number;
  color?: string;
}

/** Sparkline data - just numbers */
export type SparklineData = number[];

/** Common chart configuration */
export interface ChartConfig {
  /** Show/hide legend */
  showLegend?: boolean;
  /** Show/hide grid lines */
  showGrid?: boolean;
  /** Show/hide axes */
  showAxes?: boolean;
  /** Show/hide tooltips */
  showTooltips?: boolean;
  /** Animation duration in ms (0 = disabled) */
  animationDuration?: number;
  /** Aspect ratio (width/height) */
  aspectRatio?: number;
  /** Whether chart should be responsive */
  responsive?: boolean;
}

/** Line/Area chart specific config */
export interface LineChartConfig extends ChartConfig {
  /** Fill area under line */
  fill?: boolean;
  /** Line tension (0 = straight, 0.4 = curved) */
  tension?: number;
  /** Point radius (0 = no points) */
  pointRadius?: number;
  /** Line width */
  lineWidth?: number;
}

/** Bar chart specific config */
export interface BarChartConfig extends ChartConfig {
  /** Horizontal bars instead of vertical */
  horizontal?: boolean;
  /** Stacked bars */
  stacked?: boolean;
  /** Bar border radius */
  borderRadius?: number;
}

/** Donut/Pie chart specific config */
export interface DonutChartConfig extends ChartConfig {
  /** Cutout percentage (0 = pie, 50+ = donut) */
  cutout?: number;
}

/** Sparkline specific config */
export interface SparklineConfig {
  /** Line color (CSS color or variable) */
  color?: string;
  /** Line width */
  lineWidth?: number;
  /** Fill area under line */
  fill?: boolean;
  /** Fill color/opacity */
  fillColor?: string;
}

/** Color palette for multi-series charts */
export const DEFAULT_CHART_COLORS = [
  'var(--chart-1, #8b5cf6)',
  'var(--chart-2, #06b6d4)',
  'var(--chart-3, #10b981)',
  'var(--chart-4, #f59e0b)',
  'var(--chart-5, #ef4444)',
  'var(--chart-6, #ec4899)',
];
