import { StepHandler, TransformStep, SchemaField } from './handler.interface';

export class FilterHandler implements StepHandler {
  generateSQL(step: TransformStep, inputCTE: string): string {
    const condition = step.config.condition || step.config.expression || 'true';

    // Sanitize the condition to prevent SQL injection
    // In production, use a proper SQL builder/parameterization
    const sanitizedCondition = this.sanitizeCondition(condition);

    return `SELECT * FROM ${inputCTE} WHERE ${sanitizedCondition}`;
  }

  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[] {
    // Filter doesn't change schema, just the data
    return [...inputSchema];
  }

  private sanitizeCondition(condition: string): string {
    // Basic sanitization - in production use parameterized queries
    // Remove dangerous patterns while allowing common SQL operators
    const dangerous = /;|--|\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|\bTRUNCATE\b/gi;

    if (dangerous.test(condition)) {
      throw new Error('Invalid condition: contains prohibited SQL keywords');
    }

    return condition;
  }
}
