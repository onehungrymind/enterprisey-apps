import * as fs from 'fs';
import { FileGenerator, QueryResult, GeneratorResult } from './generator.interface';

export class JsonGenerator implements FileGenerator {
  async generate(data: QueryResult, outputPath: string): Promise<GeneratorResult> {
    // Ensure output directory exists
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    await fs.promises.mkdir(dir, { recursive: true });

    // Write JSON with pretty formatting
    const content = JSON.stringify(
      {
        metadata: {
          columns: data.columns,
          totalRows: data.totalRows,
          exportedAt: new Date().toISOString(),
        },
        data: data.rows,
      },
      null,
      2
    );

    await fs.promises.writeFile(outputPath, content);

    const stats = await fs.promises.stat(outputPath);

    return {
      fileSize: stats.size,
      recordCount: data.rows.length,
      outputPath,
    };
  }

  getExtension(): string {
    return 'json';
  }

  getMimeType(): string {
    return 'application/json';
  }
}
