import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { Dashboard } from '../database/entities/dashboard.entity';

@Injectable()
export class DashboardsService {
  constructor(
    @Inject('DASHBOARD_REPOSITORY')
    private dashboardsRepository: Repository<Dashboard>,
  ) {}

  async findAll(): Promise<Dashboard[]> {
    return await this.dashboardsRepository.find();
  }

  async findOne(id: string): Promise<Dashboard | undefined> {
    return await this.dashboardsRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Dashboard> {
    const dashboard = await this.dashboardsRepository.findOneBy({ id });
    if (!dashboard) throw new NotFoundException();
    return dashboard;
  }

  async create(dashboard: Dashboard): Promise<Dashboard> {
    return await this.dashboardsRepository.save(dashboard);
  }

  async update(dashboard: Dashboard): Promise<Dashboard> {
    return await this.dashboardsRepository.save(dashboard);
  }

  async remove(id: string): Promise<DeleteResult> {
    const dashboard = await this.dashboardsRepository.findOneBy({ id });
    if (!dashboard) throw new NotFoundException();
    return await this.dashboardsRepository.delete(id);
  }
}
