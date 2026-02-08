import { StepHandler, TransformStep, SchemaField } from './handler.interface';

export class SortHandler implements StepHandler {
  generateSQL(step: TransformStep, inputCTE: string): string {
    const orderBy = step.config.orderBy || step.config.fields || [];

    if (orderBy.length === 0) {
      return `SELECT * FROM ${inputCTE}`;
    }

    const orderClauses: string[] = [];

    for (const item of orderBy) {
      const field = typeof item === 'string' ? item : item.field;
      const direction = typeof item === 'string' ? 'ASC' : (item.direction || 'ASC').toUpperCase();
      const nulls = typeof item === 'string' ? '' : item.nulls;

      const sanitizedField = this.sanitizeIdentifier(field);
      const sanitizedDirection = direction === 'DESC' ? 'DESC' : 'ASC';

      let clause = `"${sanitizedField}" ${sanitizedDirection}`;

      if (nulls === 'first') {
        clause += ' NULLS FIRST';
      } else if (nulls === 'last') {
        clause += ' NULLS LAST';
      }

      orderClauses.push(clause);
    }

    return `SELECT * FROM ${inputCTE} ORDER BY ${orderClauses.join(', ')}`;
  }

  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[] {
    // Sort doesn't change schema
    return [...inputSchema];
  }

  private sanitizeIdentifier(identifier: string): string {
    return identifier.replace(/[^a-zA-Z0-9_]/g, '');
  }
}
