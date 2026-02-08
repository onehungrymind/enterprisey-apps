import {
  DataConnector,
  ConnectionTestResult,
  SchemaField,
  DataRow,
  FetchOptions,
} from './connector.interface';

/**
 * Webhook connector - passive connector that receives data via HTTP POST
 * The testConnection verifies the webhook endpoint is configured correctly
 * Schema is inferred from received webhook payloads
 */
export class WebhookConnector implements DataConnector {
  // In-memory storage for received webhook events (in production, use a database)
  private static webhookEvents: Map<string, DataRow[]> = new Map();
  private static webhookSchemas: Map<string, SchemaField[]> = new Map();

  async testConnection(config: Record<string, string>): Promise<ConnectionTestResult> {
    const sourceId = config.sourceId;
    const secret = config.secret;

    if (!sourceId) {
      return {
        success: false,
        error: 'Source ID is required for webhook configuration',
      };
    }

    // Webhook is always "connected" since it's a passive receiver
    // The test just validates configuration
    const webhookUrl = config.webhookUrl || `/api/webhooks/${sourceId}`;

    return {
      success: true,
      metadata: {
        webhookUrl,
        hasSecret: !!secret,
        configuredAt: new Date().toISOString(),
      },
    };
  }

  async discoverSchema(config: Record<string, string>): Promise<SchemaField[]> {
    const sourceId = config.sourceId;

    // Return cached schema if available
    if (WebhookConnector.webhookSchemas.has(sourceId)) {
      return WebhookConnector.webhookSchemas.get(sourceId)!;
    }

    // If no events received yet, return empty schema
    const events = WebhookConnector.webhookEvents.get(sourceId) || [];
    if (events.length === 0) {
      return [];
    }

    // Infer schema from received events
    const schema = this.inferSchemaFromEvents(events);
    WebhookConnector.webhookSchemas.set(sourceId, schema);

    return schema;
  }

  async fetchData(
    config: Record<string, string>,
    options: FetchOptions = {}
  ): Promise<DataRow[]> {
    const sourceId = config.sourceId;
    const events = WebhookConnector.webhookEvents.get(sourceId) || [];

    const limit = options.limit || events.length;
    const offset = options.offset || 0;

    return events.slice(offset, offset + limit);
  }

  /**
   * Store a webhook event (called by the webhook controller)
   */
  static storeEvent(sourceId: string, payload: DataRow): void {
    if (!WebhookConnector.webhookEvents.has(sourceId)) {
      WebhookConnector.webhookEvents.set(sourceId, []);
    }

    const events = WebhookConnector.webhookEvents.get(sourceId)!;
    events.push({
      ...payload,
      _receivedAt: new Date().toISOString(),
    });

    // Keep only last 10000 events in memory
    if (events.length > 10000) {
      events.shift();
    }

    // Clear cached schema so it gets re-inferred
    WebhookConnector.webhookSchemas.delete(sourceId);
  }

  /**
   * Get event count for a source
   */
  static getEventCount(sourceId: string): number {
    return WebhookConnector.webhookEvents.get(sourceId)?.length || 0;
  }

  /**
   * Clear events for a source
   */
  static clearEvents(sourceId: string): void {
    WebhookConnector.webhookEvents.delete(sourceId);
    WebhookConnector.webhookSchemas.delete(sourceId);
  }

  private inferSchemaFromEvents(events: DataRow[]): SchemaField[] {
    if (events.length === 0) return [];

    // Collect all unique keys from all events
    const allKeys = new Set<string>();
    for (const event of events) {
      Object.keys(event).forEach((key) => allKeys.add(key));
    }

    const fields: SchemaField[] = [];

    for (const key of allKeys) {
      const sampleValues: string[] = [];
      let hasNull = false;
      let inferredType: SchemaField['type'] = 'string';

      // Collect samples and check for nulls
      for (let i = 0; i < Math.min(5, events.length); i++) {
        const value = events[i][key];
        if (value === null || value === undefined) {
          hasNull = true;
        } else {
          sampleValues.push(JSON.stringify(value).substring(0, 100));
        }
      }

      // Infer type from first non-null value
      const firstValue = events.find((e) => e[key] !== null && e[key] !== undefined)?.[key];
      if (firstValue !== undefined) {
        inferredType = this.inferType(firstValue);
      }

      fields.push({
        name: key,
        type: inferredType,
        nullable: hasNull,
        sampleValues: sampleValues.slice(0, 3),
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
}
