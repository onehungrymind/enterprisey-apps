import {
  DataConnector,
  ConnectionTestResult,
  SchemaField,
  DataRow,
  FetchOptions,
} from './connector.interface';

export class RestApiConnector implements DataConnector {
  async testConnection(config: Record<string, string>): Promise<ConnectionTestResult> {
    const url = config.url || config.endpoint;
    const method = config.method || 'GET';
    const headers = this.parseHeaders(config.headers);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), parseInt(config.timeout || '10000', 10));

      const response = await fetch(url, {
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        metadata: {
          statusCode: response.status,
          contentType: response.headers.get('content-type'),
          testedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Connection timed out',
        };
      }
      return {
        success: false,
        error: error.message || 'Unknown connection error',
      };
    }
  }

  async discoverSchema(config: Record<string, string>): Promise<SchemaField[]> {
    const url = config.url || config.endpoint;
    const method = config.method || 'GET';
    const headers = this.parseHeaders(config.headers);

    try {
      const response = await fetch(url, { method, headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const sampleObject = Array.isArray(data) ? data[0] : data;

      if (!sampleObject || typeof sampleObject !== 'object') {
        return [];
      }

      return this.inferSchemaFromObject(sampleObject, data);
    } catch (error: any) {
      throw new Error(`Failed to discover schema: ${error.message}`);
    }
  }

  async fetchData(
    config: Record<string, string>,
    options: FetchOptions = {}
  ): Promise<DataRow[]> {
    let url = config.url || config.endpoint;
    const method = config.method || 'GET';
    const headers = this.parseHeaders(config.headers);
    const dataPath = config.dataPath; // JSONPath-like expression for nested data

    // Add pagination parameters to URL if provided
    if (options.limit || options.offset) {
      const urlObj = new URL(url);
      if (options.limit) {
        urlObj.searchParams.set(config.limitParam || 'limit', options.limit.toString());
      }
      if (options.offset) {
        urlObj.searchParams.set(config.offsetParam || 'offset', options.offset.toString());
      }
      url = urlObj.toString();
    }

    try {
      const response = await fetch(url, { method, headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();

      // Navigate to nested data if dataPath is provided
      if (dataPath) {
        const pathParts = dataPath.split('.');
        for (const part of pathParts) {
          if (data && typeof data === 'object') {
            data = data[part];
          } else {
            break;
          }
        }
      }

      // Ensure we return an array
      if (!Array.isArray(data)) {
        data = [data];
      }

      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  private parseHeaders(headersStr?: string): Record<string, string> {
    if (!headersStr) return {};

    try {
      return JSON.parse(headersStr);
    } catch {
      // Try parsing as key:value pairs separated by newlines
      const headers: Record<string, string> = {};
      const lines = headersStr.split('\n');
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          headers[key.trim()] = valueParts.join(':').trim();
        }
      }
      return headers;
    }
  }

  private inferSchemaFromObject(obj: Record<string, any>, fullData: any): SchemaField[] {
    const fields: SchemaField[] = [];
    const dataArray = Array.isArray(fullData) ? fullData : [fullData];

    for (const [key, value] of Object.entries(obj)) {
      // Collect sample values from the data
      const sampleValues: string[] = [];
      for (let i = 0; i < Math.min(3, dataArray.length); i++) {
        const sampleVal = dataArray[i]?.[key];
        if (sampleVal !== undefined && sampleVal !== null) {
          sampleValues.push(String(sampleVal).substring(0, 100));
        }
      }

      // Check if any value is null/undefined in the data
      const hasNull = dataArray.some((item) => item[key] === null || item[key] === undefined);

      fields.push({
        name: key,
        type: this.inferType(value),
        nullable: hasNull,
        sampleValues,
      });
    }

    return fields;
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
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO 8601
      ];
      if (datePatterns.some((p) => p.test(value))) {
        return 'date';
      }
    }

    return 'string';
  }
}
