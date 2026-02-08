import { DataConnector, ConnectorType } from './connector.interface';
import { PostgresConnector } from './postgres.connector';
import { RestApiConnector } from './rest-api.connector';
import { FileConnector } from './file.connector';
import { WebhookConnector } from './webhook.connector';

export class ConnectorFactory {
  private static connectors: Map<ConnectorType, DataConnector> = new Map();

  /**
   * Get a connector instance for the given type
   * Connectors are singletons for efficiency
   */
  static getConnector(type: ConnectorType): DataConnector {
    if (this.connectors.has(type)) {
      return this.connectors.get(type)!;
    }

    let connector: DataConnector;

    switch (type) {
      case 'database':
        connector = new PostgresConnector();
        break;
      case 'rest_api':
        connector = new RestApiConnector();
        break;
      case 'csv_file':
        connector = new FileConnector();
        break;
      case 'webhook':
        connector = new WebhookConnector();
        break;
      default:
        throw new Error(`Unknown connector type: ${type}`);
    }

    this.connectors.set(type, connector);
    return connector;
  }

  /**
   * Check if a connector type is supported
   */
  static isSupported(type: string): type is ConnectorType {
    return ['database', 'rest_api', 'csv_file', 'webhook'].includes(type);
  }
}
