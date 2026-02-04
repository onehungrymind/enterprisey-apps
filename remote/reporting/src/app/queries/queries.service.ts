import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { ReportQuery } from '../database/entities/report-query.entity';

@Injectable()
export class QueriesService {
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

  async execute(id: string): Promise<any> {
    const query = await this.queriesRepository.findOneBy({ id });
    if (!query) throw new NotFoundException();

    return {
      columns: ['month', 'total_revenue', 'count'],
      rows: [
        { month: '2025-01', total_revenue: 50000, count: 150 },
        { month: '2025-02', total_revenue: 62000, count: 180 },
        { month: '2025-03', total_revenue: 48000, count: 130 },
      ],
      totalRows: 3,
      executedAt: new Date().toISOString(),
    };
  }
}
