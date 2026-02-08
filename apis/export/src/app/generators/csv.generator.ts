import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import { FileGenerator, QueryResult, GeneratorResult } from './generator.interface';

export class CsvGenerator implements FileGenerator {
  async generate(data: QueryResult, outputPath: string): Promise<GeneratorResult> {
    // Ensure output directory exists
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    await fs.promises.mkdir(dir, { recursive: true });

    if (data.rows.length === 0) {
      // Write empty file with headers
      await fs.promises.writeFile(outputPath, data.columns.join(',') + '\n');
      const stats = await fs.promises.stat(outputPath);
      return {
        fileSize: stats.size,
        recordCount: 0,
        outputPath,
      };
    }

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: data.columns.map((col) => ({ id: col, title: col })),
    });

    // Write records
    await csvWriter.writeRecords(data.rows);

    const stats = await fs.promises.stat(outputPath);

    return {
      fileSize: stats.size,
      recordCount: data.rows.length,
      outputPath,
    };
  }

  getExtension(): string {
    return 'csv';
  }

  getMimeType(): string {
    return 'text/csv';
  }
}
