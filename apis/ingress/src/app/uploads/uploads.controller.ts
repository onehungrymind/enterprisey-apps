import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Repository } from 'typeorm';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { SchemasService } from '../schemas/schemas.service';
import { parse as csvParse } from 'csv-parse/sync';
import * as path from 'path';
import * as fs from 'fs';
// Using a simple type for file upload since multer types can be complex with webpack
interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('uploads')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    @Inject('SOURCE_REPOSITORY')
    private sourcesRepository: Repository<DataSourceEntity>,
    private schemasService: SchemasService,
  ) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Upload a file for a specific source
   */
  @Post(':sourceId')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.csv', '.json'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`Unsupported file type: ${ext}`), false);
        }
      },
    })
  )
  async uploadFile(
    @Param('sourceId') sourceId: string,
    @UploadedFile() file: UploadedFileType,
  ): Promise<{
    success: boolean;
    fileName: string;
    fileSize: number;
    recordCount: number;
    schemaVersion: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Find the source
    const source = await this.sourcesRepository.findOneBy({ id: sourceId });

    if (!source) {
      throw new NotFoundException(`Source ${sourceId} not found`);
    }

    if (source.type !== 'csv_file') {
      throw new BadRequestException(`Source ${sourceId} is not a file source`);
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${sourceId}-${Date.now()}${ext}`;
    const filePath = path.join(this.uploadsDir, fileName);

    // Save file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Parse file to get record count
    let recordCount = 0;
    try {
      if (ext === '.csv') {
        const records = csvParse(file.buffer.toString(), {
          columns: true,
          skip_empty_lines: true,
        });
        recordCount = records.length;
      } else if (ext === '.json') {
        const data = JSON.parse(file.buffer.toString());
        recordCount = Array.isArray(data) ? data.length : 1;
      }
    } catch (error: any) {
      // Clean up uploaded file on parse error
      await fs.promises.unlink(filePath).catch(() => {});
      throw new BadRequestException(`Failed to parse file: ${error.message}`);
    }

    // Update source configuration
    const existingRecords = parseInt(source.connectionConfig?.recordsIngested || '0', 10);
    const schemaVersion = parseInt(source.connectionConfig?.schemaVersion || '0', 10) + 1;

    source.connectionConfig = {
      ...source.connectionConfig,
      path: filePath,
      filePath,
      originalFileName: file.originalname,
      fileSize: String(file.size),
      recordsIngested: String(existingRecords + recordCount),
      schemaVersion: String(schemaVersion),
      lastUploadAt: new Date().toISOString(),
    };
    source.lastSyncAt = new Date().toISOString();
    source.status = 'connected';

    await this.sourcesRepository.save(source);

    // Trigger schema discovery
    await this.schemasService.discoverSchema(sourceId);

    this.logger.log(
      `File uploaded for source ${sourceId}: ${file.originalname} (${recordCount} records)`
    );

    return {
      success: true,
      fileName: file.originalname,
      fileSize: file.size,
      recordCount,
      schemaVersion,
    };
  }
}
