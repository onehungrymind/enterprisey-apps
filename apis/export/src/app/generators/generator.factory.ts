import { FileGenerator } from './generator.interface';
import { CsvGenerator } from './csv.generator';
import { JsonGenerator } from './json.generator';

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

export class GeneratorFactory {
  private static generators: Map<ExportFormat, FileGenerator> = new Map([
    ['csv', new CsvGenerator()],
    ['json', new JsonGenerator()],
  ]);

  /**
   * Get a generator for the specified format
   */
  static getGenerator(format: ExportFormat): FileGenerator {
    const generator = this.generators.get(format);
    if (!generator) {
      throw new Error(`Unsupported export format: ${format}. Supported formats: ${this.getSupportedFormats().join(', ')}`);
    }
    return generator;
  }

  /**
   * Check if a format is supported
   */
  static isSupported(format: string): format is ExportFormat {
    return this.generators.has(format as ExportFormat);
  }

  /**
   * Get list of supported formats
   */
  static getSupportedFormats(): ExportFormat[] {
    return Array.from(this.generators.keys());
  }

  /**
   * Register a custom generator
   */
  static registerGenerator(format: ExportFormat, generator: FileGenerator): void {
    this.generators.set(format, generator);
  }
}
