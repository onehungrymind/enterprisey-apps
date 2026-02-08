export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  nullable: boolean;
  sampleValues: string[];
}

export interface FetchOptions {
  limit?: number;
  offset?: number;
  filter?: Record<string, any>;
}

export interface DataRow {
  [key: string]: any;
}

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface DataConnector {
  /**
   * Test the connection to the data source
   */
  testConnection(config: Record<string, string>): Promise<ConnectionTestResult>;

  /**
   * Discover the schema of the data source
   */
  discoverSchema(config: Record<string, string>): Promise<SchemaField[]>;

  /**
   * Fetch data from the source
   */
  fetchData(config: Record<string, string>, options?: FetchOptions): Promise<DataRow[]>;
}

export type ConnectorType = 'database' | 'rest_api' | 'csv_file' | 'webhook';
