import { StepHandler, TransformStep, SchemaField } from './handler.interface';

export class AggregateHandler implements StepHandler {
  generateSQL(step: TransformStep, inputCTE: string): string {
    const groupBy = step.config.groupBy || [];
    const metrics = step.config.metrics || [];

    if (groupBy.length === 0 && metrics.length === 0) {
      return `SELECT * FROM ${inputCTE}`;
    }

    const selectClauses: string[] = [];

    // Add group by fields
    for (const field of groupBy) {
      selectClauses.push(`"${this.sanitizeIdentifier(field)}"`);
    }

    // Add metric aggregations
    for (const metric of metrics) {
      const func = this.sanitizeFunction(metric.function);
      const field = this.sanitizeIdentifier(metric.field);
      const alias = this.sanitizeIdentifier(metric.alias || `${func}_${field}`);

      if (field === '*') {
        selectClauses.push(`${func}(*) AS "${alias}"`);
      } else {
        selectClauses.push(`${func}("${field}") AS "${alias}"`);
      }
    }

    let sql = `SELECT ${selectClauses.join(', ')} FROM ${inputCTE}`;

    if (groupBy.length > 0) {
      const groupByClause = groupBy.map((f: string) => `"${this.sanitizeIdentifier(f)}"`).join(', ');
      sql += ` GROUP BY ${groupByClause}`;
    }

    return sql;
  }

  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[] {
    const groupBy = step.config.groupBy || [];
    const metrics = step.config.metrics || [];

    const outputFields: SchemaField[] = [];

    // Add group by fields
    for (const fieldName of groupBy) {
      const inputField = inputSchema.find((f) => f.name === fieldName);
      if (inputField) {
        outputFields.push({ ...inputField });
      } else {
        outputFields.push({
          name: fieldName,
          type: 'string',
          nullable: false,
          sampleValues: [],
        });
      }
    }

    // Add metric fields
    for (const metric of metrics) {
      const alias = metric.alias || `${metric.function}_${metric.field}`;
      outputFields.push({
        name: alias,
        type: this.getMetricType(metric.function),
        nullable: false,
        sampleValues: [],
      });
    }

    return outputFields;
  }

  private sanitizeIdentifier(identifier: string): string {
    // Only allow alphanumeric and underscore
    return identifier.replace(/[^a-zA-Z0-9_]/g, '');
  }

  private sanitizeFunction(func: string): string {
    const allowed = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'STDDEV', 'VARIANCE'];
    const upper = func.toUpperCase();
    if (!allowed.includes(upper)) {
      throw new Error(`Invalid aggregate function: ${func}`);
    }
    return upper;
  }

  private getMetricType(func: string): string {
    const upper = func.toUpperCase();
    if (upper === 'COUNT') return 'number';
    if (upper === 'AVG' || upper === 'STDDEV' || upper === 'VARIANCE') return 'number';
    return 'number';
  }
}
