import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { ReportQuery } from '../database/entities/report-query.entity';
import { QueryExecutor, QueryResult } from '../engine';

@Injectable()
export class QueriesService {
  private readonly logger = new Logger(QueriesService.name);
  private readonly queryExecutor = new QueryExecutor();

  constructor(
    @Inject('REPORT_QUERY_REPOSITORY')
    private queriesRepository: Repository<ReportQuery>,
  ) {}

  async findAll(): Promise<ReportQuery[]> {
    return await this.queriesRepository.find();
  }

  async findOne(id: string): Promise<ReportQuery | undefined> {
    return await this.queriesRepository.findOneBy({ id });
  }

  async get(id: string): Promise<ReportQuery> {
    const query = await this.queriesRepository.findOneBy({ id });
    if (!query) throw new NotFoundException();
    return query;
  }

  async create(query: ReportQuery): Promise<ReportQuery> {
    return await this.queriesRepository.save(query);
  }

  async update(query: ReportQuery): Promise<ReportQuery> {
    return await this.queriesRepository.save(query);
  }

  async remove(id: string): Promise<DeleteResult> {
    const query = await this.queriesRepository.findOneBy({ id });
    if (!query) throw new NotFoundException();
    return await this.queriesRepository.delete(id);
  }

  async execute(id: string): Promise<QueryResult> {
    const query = await this.queriesRepository.findOneBy({ id });
    if (!query) throw new NotFoundException();

    this.logger.log(`Executing query ${id}: ${query.name}`);

    // Check cache
    if (query.cachedAt && query.cacheDuration) {
      const cacheExpiry = new Date(query.cachedAt).getTime() + query.cacheDuration * 1000;
      if (Date.now() < cacheExpiry) {
        this.logger.log(`Returning cached result for query ${id}`);
        // In production, return cached data from a cache store
      }
    }

    const result = await this.queryExecutor.execute({
      id: query.id,
      name: query.name,
      pipelineId: query.pipelineId,
      aggregation: query.aggregation || { groupBy: [], metrics: [] },
      filters: query.filters || [],
    });

    // Update cache timestamp
    query.cachedAt = new Date().toISOString();
    await this.queriesRepository.save(query);

    return result;
  }

  /**
   * Get the generated SQL for a query (for debugging/preview)
   */
  async getSQL(id: string): Promise<string> {
    const query = await this.queriesRepository.findOneBy({ id });
    if (!query) throw new NotFoundException();

    return this.queryExecutor.generateSQL({
      id: query.id,
      name: query.name,
      pipelineId: query.pipelineId,
      aggregation: query.aggregation || { groupBy: [], metrics: [] },
      filters: query.filters || [],
    });
  }
}
