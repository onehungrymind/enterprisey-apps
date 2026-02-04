import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { SourcesService } from './sources.service';
import { SchemasService } from '../schemas/schemas.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@proto/guards/remote-auth';

@Controller('sources')
export class SourcesController {
  constructor(
    private readonly sourcesService: SourcesService,
    private readonly schemasService: SchemasService,
  ) {}

  @Post()
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() source: DataSourceEntity): Promise<DataSourceEntity> {
    return this.sourcesService.create(source);
  }

  @Get()
  findAll(): Promise<DataSourceEntity[]> {
    return this.sourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DataSourceEntity> {
    return this.sourcesService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() source: DataSourceEntity) {
    return this.sourcesService.update(source);
  }

  @Delete(':id')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.sourcesService.remove(id);
  }

  @Post(':id/test-connection')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  testConnection(@Param('id') id: string) {
    return this.sourcesService.testConnection(id);
  }

  @Post(':id/sync')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  sync(@Param('id') id: string) {
    return this.sourcesService.sync(id);
  }

  @Get(':id/schema')
  getSchema(@Param('id') id: string) {
    return this.schemasService.findBySourceId(id);
  }
}
