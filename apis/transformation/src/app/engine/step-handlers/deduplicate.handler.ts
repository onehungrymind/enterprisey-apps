import { StepHandler, TransformStep, SchemaField } from './handler.interface';

export class DeduplicateHandler implements StepHandler {
  generateSQL(step: TransformStep, inputCTE: string): string {
    const uniqueFields = step.config.uniqueFields || step.config.keys || [];
    const orderBy = step.config.orderBy || [];

    if (uniqueFields.length === 0) {
      // Simple DISTINCT on all fields
      return `SELECT DISTINCT * FROM ${inputCTE}`;
    }

    // Use PostgreSQL's DISTINCT ON for more control
    const distinctFields = uniqueFields
      .map((f: string) => `"${this.sanitizeIdentifier(f)}"`)
      .join(', ');

    let sql = `SELECT DISTINCT ON (${distinctFields}) * FROM ${inputCTE}`;

    // Add ORDER BY if specified (required for DISTINCT ON determinism)
    if (orderBy.length > 0) {
      const orderClauses = orderBy.map((item: any) => {
        const field = typeof item === 'string' ? item : item.field;
        const direction = typeof item === 'string' ? 'ASC' : (item.direction || 'ASC').toUpperCase();
        return `"${this.sanitizeIdentifier(field)}" ${direction === 'DESC' ? 'DESC' : 'ASC'}`;
      });
      sql += ` ORDER BY ${distinctFields}, ${orderClauses.join(', ')}`;
    } else {
      // Default ordering by the distinct fields
      sql += ` ORDER BY ${distinctFields}`;
    }

    return sql;
  }

  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[] {
    // Deduplication doesn't change schema
    return [...inputSchema];
  }

  private sanitizeIdentifier(identifier: string): string {
    return identifier.replace(/[^a-zA-Z0-9_]/g, '');
  }
}
