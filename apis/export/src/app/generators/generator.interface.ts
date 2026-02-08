export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  executedAt: string;
}

export interface GeneratorResult {
  fileSize: number;
  recordCount: number;
  outputPath: string;
}

export interface FileGenerator {
  /**
   * Generate a file from query results
   * @param data Query result data
   * @param outputPath Path to write the file
   * @returns Generator result with file info
   */
  generate(data: QueryResult, outputPath: string): Promise<GeneratorResult>;

  /**
   * Get the file extension for this generator
   */
  getExtension(): string;

  /**
   * Get the MIME type for this generator
   */
  getMimeType(): string;
}
