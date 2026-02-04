import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { Widget } from '../database/entities/widget.entity';

@Injectable()
export class WidgetsService {
  constructor(
    @Inject('WIDGET_REPOSITORY')
    private widgetsRepository: Repository<Widget>,
  ) {}

  async findAll(): Promise<Widget[]> {
    return await this.widgetsRepository.find();
  }

  async findByDashboardId(dashboardId: string): Promise<Widget[]> {
    return await this.widgetsRepository.findBy({ dashboardId });
  }

  async findOne(id: string): Promise<Widget | undefined> {
    return await this.widgetsRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Widget> {
    const widget = await this.widgetsRepository.findOneBy({ id });
    if (!widget) throw new NotFoundException();
    return widget;
  }

  async create(widget: Widget): Promise<Widget> {
    return await this.widgetsRepository.save(widget);
  }

  async update(widget: Widget): Promise<Widget> {
    return await this.widgetsRepository.save(widget);
  }

  async remove(id: string): Promise<DeleteResult> {
    const widget = await this.widgetsRepository.findOneBy({ id });
    if (!widget) throw new NotFoundException();
    return await this.widgetsRepository.delete(id);
  }
}
