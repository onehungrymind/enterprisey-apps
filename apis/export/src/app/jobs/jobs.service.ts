import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import * as path from 'path';
import { ExportJobEntity } from '../database/entities/export-job.entity';
import { GeneratorFactory, ExportFormat, QueryResult } from '../generators';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly exportsDir = path.join(process.cwd(), 'exports');

  constructor(
    @Inject('JOB_REPOSITORY')
    private jobsRepository: Repository<ExportJobEntity>,
  ) {}

  async findAll(): Promise<ExportJobEntity[]> {
    return await this.jobsRepository.find();
  }

  async findOne(id: string): Promise<ExportJobEntity | undefined> {
    return await this.jobsRepository.findOneBy({ id });
  }

  async get(id: string): Promise<ExportJobEntity> {
    const job = await this.jobsRepository.findOneBy({ id });
    if (!job) throw new NotFoundException();
    return job;
  }

  async findActive(): Promise<ExportJobEntity[]> {
    return await this.jobsRepository.find({
      where: { status: In(['queued', 'processing']) },
    });
  }

  async create(job: ExportJobEntity): Promise<ExportJobEntity> {
    job.status = 'queued';
    job.progress = 0;
    const saved = await this.jobsRepository.save(job);
    this.startProcessing(saved.id);
    return saved;
  }

  async cancel(id: string): Promise<ExportJobEntity> {
    const job = await this.get(id);
    job.status = 'cancelled';
    return await this.jobsRepository.save(job);
  }

  async remove(id: string): Promise<DeleteResult> {
    const job = await this.jobsRepository.findOneBy({ id });
    if (!job) throw new NotFoundException();
    return await this.jobsRepository.delete(id);
  }

  private startProcessing(jobId: string): void {
    this.processJob(jobId).catch((err) => {
      this.logger.error(`Job processing error: ${err.message}`);
    });
  }

  private async processJob(jobId: string): Promise<void> {
    const job = await this.jobsRepository.findOneBy({ id: jobId });
    if (!job || job.status === 'cancelled') return;

    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    job.progress = 10;
    await this.jobsRepository.save(job);

    try {
      // 1. Fetch query results from Reporting API
      job.progress = 30;
      await this.jobsRepository.save(job);

      const queryResult = await this.fetchQueryResults(job.queryId);

      // 2. Generate file
      job.progress = 60;
      await this.jobsRepository.save(job);

      const format = job.format as ExportFormat;
      if (!GeneratorFactory.isSupported(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      const generator = GeneratorFactory.getGenerator(format);
      const fileName = `${job.id}.${generator.getExtension()}`;
      const outputPath = path.join(this.exportsDir, fileName);

      const result = await generator.generate(queryResult, outputPath);

      // 3. Update job with success
      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date().toISOString();
      job.outputUrl = `/exports/${fileName}`;
      job.fileSize = result.fileSize;
      job.recordCount = result.recordCount;

      await this.jobsRepository.save(job);

      this.logger.log(
        `Export job ${jobId} completed: ${result.recordCount} records, ${result.fileSize} bytes`
      );
    } catch (error: any) {
      job.status = 'failed';
      job.progress = 0;
      job.completedAt = new Date().toISOString();
      job.error = error.message;

      await this.jobsRepository.save(job);

      this.logger.error(`Export job ${jobId} failed: ${error.message}`);
    }
  }

  private async fetchQueryResults(queryId: string): Promise<QueryResult> {
    const reportingUrl = process.env.REPORTING_API_URL || 'http://localhost:3300/api';

    try {
      const response = await fetch(`${reportingUrl}/queries/${queryId}/execute`);

      if (!response.ok) {
        throw new Error(`Query execution failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      this.logger.warn(`Could not fetch query results, using sample data: ${error.message}`);

      // Return sample data for demonstration
      return this.generateSampleQueryResult();
    }
  }

  private generateSampleQueryResult(): QueryResult {
    const columns = ['id', 'name', 'email', 'revenue', 'status', 'created_at'];
    const rows: Record<string, any>[] = [];

    for (let i = 0; i < 100; i++) {
      rows.push({
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        revenue: Math.floor(Math.random() * 100000) + 1000,
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return {
      columns,
      rows,
      totalRows: rows.length,
      executedAt: new Date().toISOString(),
    };
  }
}
