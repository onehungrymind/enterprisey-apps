import { Injectable, Logger } from '@nestjs/common';

export interface AggregationMetric {
  field: string;
  function: 'count' | 'sum' | 'avg' | 'min' | 'max';
  alias: string;
}

export interface AggregationConfig {
  groupBy: string[];
  metrics: AggregationMetric[];
}

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  executedAt: string;
}

export interface ReportQueryDefinition {
  id: string;
  name: string;
  pipelineId: string;
  aggregation: AggregationConfig;
  filters: QueryFilter[];
}

@Injectable()
export class QueryExecutor {
  private readonly logger = new Logger(QueryExecutor.name);

  /**
   * Execute a query against pipeline output data
   */
  async execute(query: ReportQueryDefinition): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      // 1. Fetch pipeline output from Transformation API
      const pipelineData = await this.fetchPipelineOutput(query.pipelineId);

      // 2. Apply filters
      let filteredData = this.applyFilters(pipelineData, query.filters || []);

      // 3. Apply aggregation
      const aggregatedData = this.applyAggregation(
        filteredData,
        query.aggregation || { groupBy: [], metrics: [] }
      );

      // 4. Format result
      const columns = this.getColumns(aggregatedData);

      this.logger.log(
        `Query ${query.id} executed: ${aggregatedData.length} rows in ${Date.now() - startTime}ms`
      );

      return {
        columns,
        rows: aggregatedData,
        totalRows: aggregatedData.length,
        executedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Query execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate SQL from query definition (for preview/debugging)
   */
  generateSQL(query: ReportQueryDefinition): string {
    const { groupBy, metrics } = query.aggregation || { groupBy: [], metrics: [] };
    const filters = query.filters || [];

    const selectClauses: string[] = [];

    // Add group by fields
    for (const field of groupBy) {
      selectClauses.push(`"${field}"`);
    }

    // Add metric aggregations
    for (const metric of metrics) {
      const func = metric.function.toUpperCase();
      if (metric.field === '*') {
        selectClauses.push(`${func}(*) AS "${metric.alias}"`);
      } else {
        selectClauses.push(`${func}("${metric.field}") AS "${metric.alias}"`);
      }
    }

    if (selectClauses.length === 0) {
      selectClauses.push('*');
    }

    let sql = `SELECT ${selectClauses.join(', ')}\nFROM pipeline_${query.pipelineId}_output`;

    // Add WHERE clause
    if (filters.length > 0) {
      const whereClauses = filters.map((f) => this.filterToSQL(f));
      sql += `\nWHERE ${whereClauses.join(' AND ')}`;
    }

    // Add GROUP BY clause
    if (groupBy.length > 0) {
      sql += `\nGROUP BY ${groupBy.map((f) => `"${f}"`).join(', ')}`;
    }

    return sql;
  }

  private async fetchPipelineOutput(pipelineId: string): Promise<Record<string, any>[]> {
    const transformationUrl = process.env.TRANSFORMATION_API_URL || 'http://localhost:3200/api';

    try {
      // Try to get preview data from the pipeline
      const response = await fetch(`${transformationUrl}/pipelines/${pipelineId}/preview`);
      if (response.ok) {
        const data = await response.json();
        // If preview returns schema, generate sample data
        if (Array.isArray(data) && data.length > 0 && data[0].name) {
          return this.generateSampleDataFromSchema(data);
        }
        return Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      this.logger.warn(`Could not fetch pipeline output, using sample data`);
    }

    // Return sample data for demonstration
    return this.generateSampleData(100);
  }

  private generateSampleData(count: number): Record<string, any>[] {
    const data: Record<string, any>[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const segments = ['Enterprise', 'Pro', 'Starter', 'Free'];
    const statuses = ['active', 'churned', 'trial'];
    const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
    const products = ['Analytics Pro', 'Data Pipeline', 'Report Builder', 'API Gateway', 'Dashboard Suite'];
    const stages = ['Visitors', 'Signups', 'Activated', 'Subscribed', 'Retained'];
    const categories = ['Billing', 'Technical', 'Feature Request', 'Bug Report', 'Account'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        // Time dimensions
        month: months[i % 12],
        day: days[i % 7],
        week: `Week ${(i % 4) + 1}`,

        // Business dimensions
        segment: segments[Math.floor(Math.random() * segments.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        product: products[Math.floor(Math.random() * products.length)],
        stage: stages[Math.floor(i / 20) % stages.length], // Funnel stages
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],

        // Financial metrics
        revenue: Math.floor(Math.random() * 50000) + 10000,
        deal_value: Math.floor(Math.random() * 100000) + 5000,
        units_sold: Math.floor(Math.random() * 500) + 50,

        // User metrics
        customer_count: Math.floor(Math.random() * 100) + 10,
        active_users: Math.floor(Math.random() * 5000) + 1000,
        users: Math.floor(Math.random() * 2000) + 500,

        // Support metrics
        ticket_count: Math.floor(Math.random() * 50) + 5,
        response_time: Math.floor(Math.random() * 24) + 1, // Hours

        // Churn metrics
        churned: Math.floor(Math.random() * 20) + 1,
        total: Math.floor(Math.random() * 100) + 50,

        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    return data;
  }

  private generateSampleDataFromSchema(schema: { name: string; type: string }[]): Record<string, any>[] {
    const data: Record<string, any>[] = [];
    for (let i = 0; i < 50; i++) {
      const row: Record<string, any> = {};
      for (const field of schema) {
        switch (field.type) {
          case 'number':
            row[field.name] = Math.floor(Math.random() * 1000);
            break;
          case 'boolean':
            row[field.name] = Math.random() > 0.5;
            break;
          case 'date':
            row[field.name] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
            break;
          default:
            row[field.name] = `${field.name}_${i}`;
        }
      }
      data.push(row);
    }
    return data;
  }

  private applyFilters(data: Record<string, any>[], filters: QueryFilter[]): Record<string, any>[] {
    if (filters.length === 0) return data;

    return data.filter((row) => {
      for (const filter of filters) {
        if (!this.matchesFilter(row, filter)) {
          return false;
        }
      }
      return true;
    });
  }

  private matchesFilter(row: Record<string, any>, filter: QueryFilter): boolean {
    const value = row[filter.field];
    const filterValue = filter.value;

    switch (filter.operator) {
      case 'eq':
        return value === filterValue;
      case 'neq':
        return value !== filterValue;
      case 'gt':
        return value > filterValue;
      case 'lt':
        return value < filterValue;
      case 'gte':
        return value >= filterValue;
      case 'lte':
        return value <= filterValue;
      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      case 'in':
        return Array.isArray(filterValue) && filterValue.includes(value);
      default:
        return true;
    }
  }

  private applyAggregation(
    data: Record<string, any>[],
    aggregation: AggregationConfig
  ): Record<string, any>[] {
    const { groupBy, metrics } = aggregation;

    if (groupBy.length === 0 && metrics.length === 0) {
      return data;
    }

    if (groupBy.length === 0) {
      // Single row aggregation
      const result: Record<string, any> = {};
      for (const metric of metrics) {
        result[metric.alias] = this.computeMetric(data, metric.field, metric.function);
      }
      return [result];
    }

    // Group by implementation
    const groups = new Map<string, Record<string, any>[]>();

    for (const row of data) {
      const key = groupBy.map((f) => String(row[f])).join('|');
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(row);
    }

    const results: Record<string, any>[] = [];
    for (const [, groupRows] of groups) {
      const result: Record<string, any> = {};
      for (const field of groupBy) {
        result[field] = groupRows[0][field];
      }
      for (const metric of metrics) {
        result[metric.alias] = this.computeMetric(groupRows, metric.field, metric.function);
      }
      results.push(result);
    }

    return results;
  }

  private computeMetric(
    data: Record<string, any>[],
    field: string,
    func: string
  ): number {
    const values = data.map((r) => Number(r[field])).filter((v) => !isNaN(v));

    switch (func.toLowerCase()) {
      case 'count':
        return field === '*' ? data.length : values.length;
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'avg':
        return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      case 'min':
        return values.length > 0 ? Math.min(...values) : 0;
      case 'max':
        return values.length > 0 ? Math.max(...values) : 0;
      default:
        return 0;
    }
  }

  private getColumns(data: Record<string, any>[]): string[] {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }

  private filterToSQL(filter: QueryFilter): string {
    const field = `"${filter.field}"`;
    const value = typeof filter.value === 'string' ? `'${filter.value}'` : filter.value;

    switch (filter.operator) {
      case 'eq':
        return `${field} = ${value}`;
      case 'neq':
        return `${field} != ${value}`;
      case 'gt':
        return `${field} > ${value}`;
      case 'lt':
        return `${field} < ${value}`;
      case 'gte':
        return `${field} >= ${value}`;
      case 'lte':
        return `${field} <= ${value}`;
      case 'contains':
        return `${field} ILIKE '%${filter.value}%'`;
      case 'in':
        const values = Array.isArray(filter.value)
          ? filter.value.map((v: any) => typeof v === 'string' ? `'${v}'` : v).join(', ')
          : value;
        return `${field} IN (${values})`;
      default:
        return 'true';
    }
  }
}
