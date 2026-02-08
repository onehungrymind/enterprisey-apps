import { StepHandler, TransformStep, SchemaField } from './handler.interface';

export class JoinHandler implements StepHandler {
  generateSQL(step: TransformStep, inputCTE: string): string {
    const joinType = (step.config.joinType || 'INNER').toUpperCase();
    const rightTable = step.config.rightTable || step.config.rightSource;
    const leftKey = step.config.leftKey || step.config.on?.left;
    const rightKey = step.config.rightKey || step.config.on?.right;

    if (!rightTable || !leftKey || !rightKey) {
      throw new Error('Join requires rightTable, leftKey, and rightKey');
    }

    // Validate join type
    const allowedTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS'];
    if (!allowedTypes.includes(joinType)) {
      throw new Error(`Invalid join type: ${joinType}`);
    }

    const sanitizedRightTable = this.sanitizeIdentifier(rightTable);
    const sanitizedLeftKey = this.sanitizeIdentifier(leftKey);
    const sanitizedRightKey = this.sanitizeIdentifier(rightKey);

    return `SELECT ${inputCTE}.*, ${sanitizedRightTable}.* FROM ${inputCTE} ${joinType} JOIN ${sanitizedRightTable} ON ${inputCTE}."${sanitizedLeftKey}" = ${sanitizedRightTable}."${sanitizedRightKey}"`;
  }

  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[] {
    // In a real implementation, we'd fetch the right table's schema
    // For now, return input schema plus any configured additional fields
    const additionalFields = step.config.rightFields || [];
    const outputFields = [...inputSchema];

    for (const field of additionalFields) {
      outputFields.push({
        name: field.name,
        type: field.type || 'string',
        nullable: field.nullable ?? true,
        sampleValues: [],
      });
    }

    return outputFields;
  }

  private sanitizeIdentifier(identifier: string): string {
    return identifier.replace(/[^a-zA-Z0-9_]/g, '');
  }
}
