import { parse as csvParse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import {
  DataConnector,
  ConnectionTestResult,
  SchemaField,
  DataRow,
  FetchOptions,
} from './connector.interface';

export class FileConnector implements DataConnector {
  async testConnection(config: Record<string, string>): Promise<ConnectionTestResult> {
    const filePath = config.path || config.filePath;

    try {
      // Check if file exists and is readable
      await fs.promises.access(filePath, fs.constants.R_OK);

      const stats = await fs.promises.stat(filePath);

      if (!stats.isFile()) {
        return {
          success: false,
          error: 'Path is not a file',
        };
      }

      return {
        success: true,
        metadata: {
          fileName: path.basename(filePath),
          fileSize: stats.size,
          lastModified: stats.mtime.toISOString(),
        },
      };
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return {
          success: false,
          error: 'File not found',
        };
      }
      if (error.code === 'EACCES') {
        return {
          success: false,
          error: 'Permission denied',
        };
      }
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  async discoverSchema(config: Record<string, string>): Promise<SchemaField[]> {
    const filePath = config.path || config.filePath;
    const fileExt = path.extname(filePath).toLowerCase();

    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');

      if (fileExt === '.csv') {
        return this.discoverCsvSchema(content, config);
      } else if (fileExt === '.json') {
        return this.discoverJsonSchema(content);
      } else {
        throw new Error(`Unsupported file type: ${fileExt}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to discover schema: ${error.message}`);
    }
  }

  async fetchData(
    config: Record<string, string>,
    options: FetchOptions = {}
  ): Promise<DataRow[]> {
    const filePath = config.path || config.filePath;
    const fileExt = path.extname(filePath).toLowerCase();
    const limit = options.limit || Infinity;
    const offset = options.offset || 0;

    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      let data: DataRow[];

      if (fileExt === '.csv') {
        data = this.parseCsv(content, config);
      } else if (fileExt === '.json') {
        data = this.parseJson(content);
      } else {
        throw new Error(`Unsupported file type: ${fileExt}`);
      }

      // Apply offset and limit
      return data.slice(offset, offset + limit);
    } catch (error: any) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  private discoverCsvSchema(content: string, config: Record<string, string>): SchemaField[] {
    const delimiter = config.delimiter || ',';
    const records = csvParse(content, {
      columns: true,
      skip_empty_lines: true,
      delimiter,
      to: 10, // Only parse first 10 records for schema discovery
    });

    if (records.length === 0) {
      return [];
    }

    const firstRecord = records[0];
    const fields: SchemaField[] = [];

    for (const key of Object.keys(firstRecord)) {
      const sampleValues: string[] = [];
      let hasNull = false;
      let inferredType: SchemaField['type'] = 'string';

      for (let i = 0; i < Math.min(3, records.length); i++) {
        const value = records[i][key];
        if (value === '' || value === null || value === undefined) {
          hasNull = true;
        } else {
          sampleValues.push(String(value).substring(0, 100));
        }
      }

      // Infer type from all sample values
      const allValues = records.map((r: DataRow) => r[key]).filter((v: string) => v !== '' && v !== null);
      if (allValues.length > 0) {
        inferredType = this.inferTypeFromValues(allValues);
      }

      fields.push({
        name: key,
        type: inferredType,
        nullable: hasNull,
        sampleValues,
      });
    }

    return fields;
  }

  private discoverJsonSchema(content: string): SchemaField[] {
    const data = JSON.parse(content);
    const records = Array.isArray(data) ? data : [data];

    if (records.length === 0 || typeof records[0] !== 'object') {
      return [];
    }

    const firstRecord = records[0];
    const fields: SchemaField[] = [];

    for (const [key, value] of Object.entries(firstRecord)) {
      const sampleValues: string[] = [];
      let hasNull = false;

      for (let i = 0; i < Math.min(3, records.length); i++) {
        const sampleVal = records[i][key];
        if (sampleVal === null || sampleVal === undefined) {
          hasNull = true;
        } else {
          sampleValues.push(JSON.stringify(sampleVal).substring(0, 100));
        }
      }

      fields.push({
        name: key,
        type: this.inferType(value),
        nullable: hasNull,
        sampleValues,
      });
    }

    return fields;
  }

  private parseCsv(content: string, config: Record<string, string>): DataRow[] {
    const delimiter = config.delimiter || ',';
    return csvParse(content, {
      columns: true,
      skip_empty_lines: true,
      delimiter,
      cast: true, // Automatically cast to numbers/booleans
    });
  }

  private parseJson(content: string): DataRow[] {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  }

  private inferType(value: any): SchemaField['type'] {
    if (value === null || value === undefined) return 'string';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'object') return 'object';

    // Check if it's a date string
    if (typeof value === 'string') {
      const datePatterns = [
        /^\d{4}-\d{2}-\d{2}$/,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      ];
      if (datePatterns.some((p) => p.test(value))) {
        return 'date';
      }
    }

    return 'string';
  }

  private inferTypeFromValues(values: any[]): SchemaField['type'] {
    // Check if all values are numbers
    const allNumbers = values.every((v) => !isNaN(parseFloat(v)) && isFinite(v));
    if (allNumbers) return 'number';

    // Check if all values are booleans
    const boolStrings = ['true', 'false', '1', '0', 'yes', 'no'];
    const allBooleans = values.every((v) =>
      boolStrings.includes(String(v).toLowerCase())
    );
    if (allBooleans) return 'boolean';

    // Check if all values look like dates
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
    ];
    const allDates = values.every((v) =>
      datePatterns.some((p) => p.test(String(v)))
    );
    if (allDates) return 'date';

    return 'string';
  }
}
