import { Client, types } from 'pg';
import {
  DataConnector,
  ConnectionTestResult,
  SchemaField,
  DataRow,
  FetchOptions,
} from './connector.interface';

// Prevent pg from parsing dates as Date objects
types.setTypeParser(1082, (val) => val); // date
types.setTypeParser(1114, (val) => val); // timestamp without timezone
types.setTypeParser(1184, (val) => val); // timestamp with timezone

export class PostgresConnector implements DataConnector {
  async testConnection(config: Record<string, string>): Promise<ConnectionTestResult> {
    const client = this.createClient(config);

    try {
      await client.connect();
      const result = await client.query('SELECT 1 as connected, version() as version');
      await client.end();

      return {
        success: true,
        metadata: {
          version: result.rows[0]?.version,
          connectedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown connection error',
      };
    }
  }

  async discoverSchema(config: Record<string, string>): Promise<SchemaField[]> {
    const client = this.createClient(config);
    const tableName = config.table || 'public';
    const schemaName = config.schema || 'public';

    try {
      await client.connect();

      // Get column information from information_schema
      const columnsResult = await client.query(
        `SELECT
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = $1
          AND table_name = $2
        ORDER BY ordinal_position`,
        [schemaName, tableName]
      );

      // Get sample values for each column
      const fields: SchemaField[] = [];

      for (const column of columnsResult.rows) {
        const sampleResult = await client.query(
          `SELECT DISTINCT "${column.column_name}"::text
           FROM "${schemaName}"."${tableName}"
           WHERE "${column.column_name}" IS NOT NULL
           LIMIT 3`
        );

        fields.push({
          name: column.column_name,
          type: this.mapPostgresType(column.data_type),
          nullable: column.is_nullable === 'YES',
          sampleValues: sampleResult.rows.map((r) => r[column.column_name]),
        });
      }

      await client.end();
      return fields;
    } catch (error: any) {
      if (client) await client.end().catch(() => {});
      throw new Error(`Failed to discover schema: ${error.message}`);
    }
  }

  async fetchData(
    config: Record<string, string>,
    options: FetchOptions = {}
  ): Promise<DataRow[]> {
    const client = this.createClient(config);
    const tableName = config.table;
    const schemaName = config.schema || 'public';
    const limit = options.limit || 1000;
    const offset = options.offset || 0;

    try {
      await client.connect();

      let query = `SELECT * FROM "${schemaName}"."${tableName}"`;

      // Add filter conditions if provided
      const params: any[] = [];
      if (options.filter && Object.keys(options.filter).length > 0) {
        const conditions = Object.entries(options.filter).map(([key, value], index) => {
          params.push(value);
          return `"${key}" = $${index + 1}`;
        });
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(query, params);
      await client.end();

      return result.rows;
    } catch (error: any) {
      if (client) await client.end().catch(() => {});
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  private createClient(config: Record<string, string>): Client {
    return new Client({
      host: config.host || 'localhost',
      port: parseInt(config.port || '5432', 10),
      database: config.database,
      user: config.user || config.username,
      password: config.password,
      ssl: config.ssl === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: parseInt(config.timeout || '10000', 10),
    });
  }

  private mapPostgresType(pgType: string): SchemaField['type'] {
    const typeMap: Record<string, SchemaField['type']> = {
      // String types
      'character varying': 'string',
      varchar: 'string',
      character: 'string',
      char: 'string',
      text: 'string',
      uuid: 'string',
      // Number types
      integer: 'number',
      bigint: 'number',
      smallint: 'number',
      numeric: 'number',
      decimal: 'number',
      real: 'number',
      'double precision': 'number',
      // Boolean
      boolean: 'boolean',
      // Date types
      date: 'date',
      'timestamp without time zone': 'date',
      'timestamp with time zone': 'date',
      time: 'date',
      // Complex types
      jsonb: 'object',
      json: 'object',
      ARRAY: 'array',
    };

    return typeMap[pgType.toLowerCase()] || 'string';
  }
}
