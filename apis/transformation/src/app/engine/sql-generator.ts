import {
  StepHandler,
  TransformStep,
  SchemaField,
  FilterHandler,
  MapHandler,
  AggregateHandler,
  JoinHandler,
  SortHandler,
  DeduplicateHandler,
} from './step-handlers';

export interface SQLGenerationResult {
  sql: string;
  outputSchema: SchemaField[];
  stepQueries: { stepId: string; cte: string; sql: string }[];
}

export class SQLGenerator {
  private handlers: Map<string, StepHandler>;

  constructor() {
    this.handlers = new Map<string, StepHandler>();
    this.handlers.set('filter', new FilterHandler());
    this.handlers.set('map', new MapHandler());
    this.handlers.set('aggregate', new AggregateHandler());
    this.handlers.set('join', new JoinHandler());
    this.handlers.set('sort', new SortHandler());
    this.handlers.set('deduplicate', new DeduplicateHandler());
  }

  /**
   * Compile a pipeline into a single SQL query using CTEs
   */
  compile(
    pipelineId: string,
    sourceId: string,
    steps: TransformStep[],
    sourceSchema: SchemaField[]
  ): SQLGenerationResult {
    if (steps.length === 0) {
      return {
        sql: `SELECT * FROM ingress_${this.sanitizeIdentifier(sourceId)}`,
        outputSchema: sourceSchema,
        stepQueries: [],
      };
    }

    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    const stepQueries: { stepId: string; cte: string; sql: string }[] = [];
    let currentSchema = sourceSchema;

    // Build the CTE chain
    let sql = `WITH source_data AS (SELECT * FROM ingress_${this.sanitizeIdentifier(sourceId)})`;

    for (let i = 0; i < sortedSteps.length; i++) {
      const step = sortedSteps[i];
      const inputCTE = i === 0 ? 'source_data' : `step_${i}`;
      const outputCTE = `step_${i + 1}`;

      const handler = this.getHandler(step.type);
      const stepSQL = handler.generateSQL(step, inputCTE);
      currentSchema = handler.computeOutputSchema(step, currentSchema);

      sql += `, ${outputCTE} AS (${stepSQL})`;

      stepQueries.push({
        stepId: step.id,
        cte: outputCTE,
        sql: stepSQL,
      });
    }

    // Final SELECT from the last step
    sql += ` SELECT * FROM step_${sortedSteps.length}`;

    return {
      sql,
      outputSchema: currentSchema,
      stepQueries,
    };
  }

  /**
   * Get the handler for a step type
   */
  getHandler(stepType: string): StepHandler {
    const handler = this.handlers.get(stepType.toLowerCase());
    if (!handler) {
      throw new Error(`No handler for step type: ${stepType}`);
    }
    return handler;
  }

  /**
   * Register a custom handler
   */
  registerHandler(stepType: string, handler: StepHandler): void {
    this.handlers.set(stepType.toLowerCase(), handler);
  }

  private sanitizeIdentifier(identifier: string): string {
    return identifier.replace(/[^a-zA-Z0-9_]/g, '');
  }
}
