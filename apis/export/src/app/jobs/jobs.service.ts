import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import { ExportJobEntity } from '../database/entities/export-job.entity';

@Injectable()
export class JobsService {
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
    setTimeout(async () => {
      const job = await this.jobsRepository.findOneBy({ id: jobId });
      if (!job || job.status === 'cancelled') return;

      job.status = 'processing';
      job.startedAt = new Date().toISOString();
      await this.jobsRepository.save(job);

      this.incrementProgress(jobId);
    }, 500);
  }

  private incrementProgress(jobId: string): void {
    setTimeout(async () => {
      const job = await this.jobsRepository.findOneBy({ id: jobId });
      if (!job || job.status === 'cancelled') return;

      const increment = Math.floor(Math.random() * 11) + 10; // 10-20
      job.progress = Math.min(job.progress + increment, 100);

      if (job.progress >= 100) {
        job.progress = 100;
        job.status = 'completed';
        job.completedAt = new Date().toISOString();
        job.outputUrl = `/exports/${job.name.replace(/\s+/g, '-').toLowerCase()}.${job.format}`;
        job.fileSize = Math.floor(Math.random() * 10485760) + 1024;
        job.recordCount = Math.floor(Math.random() * 500000) + 100;
        await this.jobsRepository.save(job);
      } else {
        await this.jobsRepository.save(job);
        this.incrementProgress(jobId);
      }
    }, 500);
  }
}
