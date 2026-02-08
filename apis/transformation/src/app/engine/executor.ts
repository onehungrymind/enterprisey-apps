import { Injectable, Logger } from '@nestjs/common';
import { SQLGenerator, SQLGenerationResult } from './sql-generator';
import { SchemaField, TransformStep } from './step-handlers';

export interface ExecutionResult {
  success: boolean;
  recordsProcessed: number;
  outputSchema: SchemaField[];
  sql: string;
  executionTimeMs: number;
  error?: string;
  data?: Record<string, any>[];
}

@Injectable()
export class PipelineExecutor {
  private readonly logger = new Logger(PipelineExecutor.name);
  private readonly sqlGenerator = new SQLGenerator();

  /**
   * Execute a pipeline and return the results
   */
  async execute(
    pipelineId: string,
    sourceId: string,
    steps: TransformStep[]
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // 1. Fetch source schema from Ingress API
      const sourceSchema = await this.fetchSourceSchema(sourceId);

      // 2. Generate SQL
      const sqlResult = this.sqlGenerator.compile(pipelineId, sourceId, steps, sourceSchema);

      this.logger.log(`Generated SQL for pipeline ${pipelineId}: ${sqlResult.sql.substring(0, 200)}...`);

      // 3. Fetch source data from Ingress API
      const sourceData = await this.fetchSourceData(sourceId);

      // 4. Execute transformation in-memory (for now)
      // In production, this would use a real database
      const transformedData = await this.executeInMemory(sourceData, steps);

      const executionTimeMs = Date.now() - startTime;

      return {
        success: true,
        recordsProcessed: transformedData.length,
        outputSchema: sqlResult.outputSchema,
        sql: sqlResult.sql,
        executionTimeMs,
        data: transformedData,
      };
    } catch (error: any) {
      const executionTimeMs = Date.now() - startTime;
      this.logger.error(`Pipeline execution failed: ${error.message}`);

      return {
        success: false,
        recordsProcessed: 0,
        outputSchema: [],
        sql: '',
        executionTimeMs,
        error: error.message,
      };
    }
  }

  /**
   * Generate SQL without executing
   */
  generateSQL(
    pipelineId: string,
    sourceId: string,
    steps: TransformStep[],
    sourceSchema: SchemaField[]
  ): SQLGenerationResult {
    return this.sqlGenerator.compile(pipelineId, sourceId, steps, sourceSchema);
  }

  private async fetchSourceSchema(sourceId: string): Promise<SchemaField[]> {
    const ingressUrl = process.env.INGRESS_API_URL || 'http://localhost:3100/api';

    try {
      const response = await fetch(`${ingressUrl}/sources/${sourceId}/schema`);
      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.statusText}`);
      }

      const schema = await response.json();
      return schema.fields || [];
    } catch (error: any) {
      this.logger.warn(`Could not fetch source schema: ${error.message}, using default`);
      return [
        { name: 'id', type: 'number', nullable: false, sampleValues: [] },
        { name: 'name', type: 'string', nullable: false, sampleValues: [] },
        { name: 'created_at', type: 'date', nullable: false, sampleValues: [] },
      ];
    }
  }

  private async fetchSourceData(sourceId: string): Promise<Record<string, any>[]> {
    const ingressUrl = process.env.INGRESS_API_URL || 'http://localhost:3100/api';

    try {
      // First try to get data from the source directly
      const response = await fetch(`${ingressUrl}/sources/${sourceId}/data?limit=10000`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      this.logger.warn(`Could not fetch source data, using sample data`);
    }

    // Return sample data if real data is not available
    return this.generateSampleData(100);
  }

  private generateSampleData(count: number): Record<string, any>[] {
    const data: Record<string, any>[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        name: `Record ${i + 1}`,
        email: `user${i + 1}@example.com`,
        amount: Math.floor(Math.random() * 10000),
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    return data;
  }

  /**
   * Execute transformations in-memory using JavaScript
   * This is a simplified implementation - in production use SQLite or PostgreSQL
   */
  private async executeInMemory(
    data: Record<string, any>[],
    steps: TransformStep[]
  ): Promise<Record<string, any>[]> {
    let result = [...data];

    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    for (const step of sortedSteps) {
      result = this.applyStep(result, step);
    }

    return result;
  }

  private applyStep(data: Record<string, any>[], step: TransformStep): Record<string, any>[] {
    switch (step.type.toLowerCase()) {
      case 'filter':
        return this.applyFilter(data, step);
      case 'map':
        return this.applyMap(data, step);
      case 'aggregate':
        return this.applyAggregate(data, step);
      case 'sort':
        return this.applySort(data, step);
      case 'deduplicate':
        return this.applyDeduplicate(data, step);
      default:
        return data;
    }
  }

  private applyFilter(data: Record<string, any>[], step: TransformStep): Record<string, any>[] {
    const condition = step.config.condition || step.config.expression;
    if (!condition) return data;

    // Simple field comparisons
    return data.filter((row) => {
      try {
        // Parse simple conditions like "status = 'active'" or "amount > 100"
        return this.evaluateCondition(row, condition);
      } catch {
        return true;
      }
    });
  }

  private evaluateCondition(row: Record<string, any>, condition: string): boolean {
    // Handle common SQL-like conditions
    const patterns = [
      { regex: /(\w+)\s*=\s*'([^']+)'/g, fn: (f: string, v: string) => row[f] === v },
      { regex: /(\w+)\s*=\s*(\d+)/g, fn: (f: string, v: string) => row[f] === Number(v) },
      { regex: /(\w+)\s*>\s*(\d+)/g, fn: (f: string, v: string) => row[f] > Number(v) },
      { regex: /(\w+)\s*<\s*(\d+)/g, fn: (f: string, v: string) => row[f] < Number(v) },
      { regex: /(\w+)\s*>=\s*(\d+)/g, fn: (f: string, v: string) => row[f] >= Number(v) },
      { regex: /(\w+)\s*<=\s*(\d+)/g, fn: (f: string, v: string) => row[f] <= Number(v) },
      { regex: /(\w+)\s+IS\s+NOT\s+NULL/gi, fn: (f: string) => row[f] != null },
      { regex: /(\w+)\s+IS\s+NULL/gi, fn: (f: string) => row[f] == null },
    ];

    for (const { regex, fn } of patterns) {
      const match = regex.exec(condition);
      if (match) {
        return fn(match[1], match[2]);
      }
    }

    return true;
  }

  private applyMap(data: Record<string, any>[], step: TransformStep): Record<string, any>[] {
    const mappings = step.config.mappings || [];
    if (mappings.length === 0) return data;

    return data.map((row) => {
      const newRow = { ...row };
      for (const mapping of mappings) {
        const alias = mapping.alias || mapping.name;
        // Simple expressions: field references or concatenation
        if (mapping.expression) {
          try {
            newRow[alias] = this.evaluateExpression(row, mapping.expression);
          } catch {
            newRow[alias] = null;
          }
        } else if (mapping.value !== undefined) {
          newRow[alias] = mapping.value;
        }
      }
      return newRow;
    });
  }

  private evaluateExpression(row: Record<string, any>, expression: string): any {
    // Simple field reference
    if (row[expression] !== undefined) {
      return row[expression];
    }

    // Concatenation with +
    if (expression.includes('+')) {
      const parts = expression.split('+').map((p) => p.trim());
      return parts.map((p) => {
        if (p.startsWith("'") && p.endsWith("'")) {
          return p.slice(1, -1);
        }
        return row[p] ?? p;
      }).join('');
    }

    return null;
  }

  private applyAggregate(data: Record<string, any>[], step: TransformStep): Record<string, any>[] {
    const groupBy = step.config.groupBy || [];
    const metrics = step.config.metrics || [];

    if (groupBy.length === 0) {
      // Single row result
      const result: Record<string, any> = {};
      for (const metric of metrics) {
        result[metric.alias || `${metric.function}_${metric.field}`] =
          this.computeMetric(data, metric.field, metric.function);
      }
      return [result];
    }

    // Group by implementation
    const groups = new Map<string, Record<string, any>[]>();

    for (const row of data) {
      const key = groupBy.map((f: string) => String(row[f])).join('|');
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
        result[metric.alias || `${metric.function}_${metric.field}`] =
          this.computeMetric(groupRows, metric.field, metric.function);
      }
      results.push(result);
    }

    return results;
  }

  private computeMetric(data: Record<string, any>[], field: string, func: string): number {
    const values = data.map((r) => Number(r[field])).filter((v) => !isNaN(v));

    switch (func.toUpperCase()) {
      case 'COUNT':
        return field === '*' ? data.length : values.length;
      case 'SUM':
        return values.reduce((a, b) => a + b, 0);
      case 'AVG':
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      case 'MIN':
        return values.length > 0 ? Math.min(...values) : 0;
      case 'MAX':
        return values.length > 0 ? Math.max(...values) : 0;
      default:
        return 0;
    }
  }

  private applySort(data: Record<string, any>[], step: TransformStep): Record<string, any>[] {
    const orderBy = step.config.orderBy || step.config.fields || [];
    if (orderBy.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const item of orderBy) {
        const field = typeof item === 'string' ? item : item.field;
        const direction = typeof item === 'string' ? 'ASC' : (item.direction || 'ASC').toUpperCase();
        const multiplier = direction === 'DESC' ? -1 : 1;

        if (a[field] < b[field]) return -1 * multiplier;
        if (a[field] > b[field]) return 1 * multiplier;
      }
      return 0;
    });
  }

  private applyDeduplicate(data: Record<string, any>[], step: TransformStep): Record<string, any>[] {
    const uniqueFields = step.config.uniqueFields || step.config.keys || [];

    if (uniqueFields.length === 0) {
      // Deduplicate by all fields
      const seen = new Set<string>();
      return data.filter((row) => {
        const key = JSON.stringify(row);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Deduplicate by specific fields
    const seen = new Set<string>();
    return data.filter((row) => {
      const key = uniqueFields.map((f: string) => String(row[f])).join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
