import { Injectable, Logger } from '@nestjs/common';
import { QueryExecutor, QueryResult } from './query-executor';

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string[];
  }[];
}

export interface MetricData {
  value: number | string;
  label: string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
}

export interface TableData {
  columns: string[];
  rows: Record<string, any>[];
}

export type WidgetData = ChartData | MetricData | TableData | Record<string, any>;

export interface WidgetConfig {
  id: string;
  type: 'bar_chart' | 'line_chart' | 'pie_chart' | 'metric' | 'table' | 'text';
  title: string;
  queryId?: string;
  config: Record<string, any>;
}

@Injectable()
export class WidgetDataService {
  private readonly logger = new Logger(WidgetDataService.name);
  private readonly queryExecutor = new QueryExecutor();

  /**
   * Get data for a widget based on its configuration
   */
  async getWidgetData(widget: WidgetConfig, query?: any): Promise<WidgetData> {
    if (!query) {
      return this.getDefaultData(widget.type);
    }

    try {
      const result = await this.queryExecutor.execute({
        id: query.id,
        name: query.name,
        pipelineId: query.pipelineId,
        aggregation: query.aggregation,
        filters: query.filters || [],
      });

      return this.formatForWidgetType(widget.type, result, widget.config);
    } catch (error: any) {
      this.logger.error(`Failed to get widget data: ${error.message}`);
      return this.getDefaultData(widget.type);
    }
  }

  private formatForWidgetType(
    type: string,
    result: QueryResult,
    config: Record<string, any>
  ): WidgetData {
    switch (type) {
      case 'bar_chart':
      case 'line_chart':
        return this.formatAsChart(result, config);
      case 'pie_chart':
        return this.formatAsPieChart(result, config);
      case 'metric':
        return this.formatAsMetric(result, config);
      case 'table':
        return this.formatAsTable(result);
      case 'text':
        return { text: config.text || '' };
      default:
        return this.formatAsTable(result);
    }
  }

  private formatAsChart(result: QueryResult, config: Record<string, any>): ChartData {
    if (result.rows.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const labelField = config.labelField || result.columns[0];
    const valueFields = config.valueFields || result.columns.slice(1);

    const labels = result.rows.map((row) => String(row[labelField]));

    const datasets = Array.isArray(valueFields)
      ? valueFields.map((field: string) => ({
          label: field,
          data: result.rows.map((row) => Number(row[field]) || 0),
        }))
      : [{
          label: valueFields,
          data: result.rows.map((row) => Number(row[valueFields]) || 0),
        }];

    return { labels, datasets };
  }

  private formatAsPieChart(result: QueryResult, config: Record<string, any>): ChartData {
    if (result.rows.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const labelField = config.labelField || result.columns[0];
    const valueField = config.valueField || result.columns[1];

    const labels = result.rows.map((row) => String(row[labelField]));
    const data = result.rows.map((row) => Number(row[valueField]) || 0);

    // Generate colors
    const colors = this.generateColors(labels.length);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
      }],
    };
  }

  private formatAsMetric(result: QueryResult, config: Record<string, any>): MetricData {
    if (result.rows.length === 0) {
      return { value: 0, label: config.label || 'Metric' };
    }

    const valueField = config.valueField || result.columns[0];
    const value = result.rows[0][valueField];

    // Calculate change if previous value is available
    let change: number | undefined;
    let changeDirection: 'up' | 'down' | 'neutral' | undefined;

    if (result.rows.length > 1 && config.comparePrevious) {
      const previousValue = result.rows[1][valueField];
      if (previousValue && previousValue !== 0) {
        change = ((value - previousValue) / previousValue) * 100;
        changeDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
      }
    }

    return {
      value: this.formatMetricValue(value, config.format),
      label: config.label || valueField,
      change,
      changeDirection,
    };
  }

  private formatAsTable(result: QueryResult): TableData {
    return {
      columns: result.columns,
      rows: result.rows,
    };
  }

  private formatMetricValue(value: any, format?: string): string | number {
    if (format === 'currency') {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    if (format === 'compact') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  }

  private generateColors(count: number): string[] {
    const baseColors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
    ];

    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }

  private getDefaultData(type: string): WidgetData {
    switch (type) {
      case 'bar_chart':
      case 'line_chart':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{ data: [10, 20, 15, 25, 30] }],
        };
      case 'pie_chart':
        return {
          labels: ['A', 'B', 'C'],
          datasets: [{ data: [30, 50, 20], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'] }],
        };
      case 'metric':
        return { value: 0, label: 'No data' };
      case 'table':
        return { columns: [], rows: [] };
      default:
        return {};
    }
  }
}
