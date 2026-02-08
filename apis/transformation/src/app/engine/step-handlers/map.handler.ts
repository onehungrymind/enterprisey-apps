import { StepHandler, TransformStep, SchemaField } from './handler.interface';

export class MapHandler implements StepHandler {
  generateSQL(step: TransformStep, inputCTE: string): string {
    const mappings = step.config.mappings || [];
    const keepExisting = step.config.keepExisting !== false;

    // Build SELECT clause
    const selectClauses: string[] = [];

    // If keeping existing fields, add them first
    if (keepExisting) {
      selectClauses.push('*');
    }

    // Add mapped/computed fields
    for (const mapping of mappings) {
      const expression = mapping.expression || mapping.value;
      const alias = mapping.alias || mapping.name;

      if (expression && alias) {
        // Override existing field if using *
        if (keepExisting) {
          // We need to explicitly select the computed field after *
          selectClauses.push(`${this.sanitizeExpression(expression)} AS "${alias}"`);
        } else {
          selectClauses.push(`${this.sanitizeExpression(expression)} AS "${alias}"`);
        }
      }
    }

    // If no mappings and not keeping existing, just select all
    if (selectClauses.length === 0) {
      selectClauses.push('*');
    }

    return `SELECT ${selectClauses.join(', ')} FROM ${inputCTE}`;
  }

  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[] {
    const mappings = step.config.mappings || [];
    const keepExisting = step.config.keepExisting !== false;

    const outputFields: SchemaField[] = keepExisting ? [...inputSchema] : [];

    for (const mapping of mappings) {
      const alias = mapping.alias || mapping.name;
      const type = mapping.type || 'string';

      if (alias) {
        // Check if field already exists
        const existingIndex = outputFields.findIndex((f) => f.name === alias);

        const newField: SchemaField = {
          name: alias,
          type: type,
          nullable: mapping.nullable ?? true,
          sampleValues: [],
        };

        if (existingIndex >= 0) {
          outputFields[existingIndex] = newField;
        } else {
          outputFields.push(newField);
        }
      }
    }

    return outputFields;
  }

  private sanitizeExpression(expression: string): string {
    // Basic sanitization
    const dangerous = /;|--|\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|\bTRUNCATE\b/gi;

    if (dangerous.test(expression)) {
      throw new Error('Invalid expression: contains prohibited SQL keywords');
    }

    return expression;
  }
}
