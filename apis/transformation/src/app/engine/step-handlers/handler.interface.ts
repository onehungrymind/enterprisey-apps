export interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  sampleValues: string[];
}

export interface TransformStep {
  id: string;
  pipelineId: string;
  order: number;
  type: string;
  config: Record<string, any>;
  inputSchema: SchemaField[];
  outputSchema: SchemaField[];
}

export interface StepHandler {
  /**
   * Generate SQL for this transformation step
   * @param step The step configuration
   * @param inputCTE The name of the input CTE or table
   * @returns SQL query string
   */
  generateSQL(step: TransformStep, inputCTE: string): string;

  /**
   * Compute the output schema based on the input schema and step config
   * @param step The step configuration
   * @param inputSchema The input schema fields
   * @returns Output schema fields
   */
  computeOutputSchema(step: TransformStep, inputSchema: SchemaField[]): SchemaField[];
}
