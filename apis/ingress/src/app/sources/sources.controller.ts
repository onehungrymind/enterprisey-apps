import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { SourcesService } from './sources.service';
import { SchemasService } from '../schemas/schemas.service';
import { JwtAuthGuard } from '@proto/guards/remote-auth';

@Controller('sources')
export class SourcesController {
  constructor(
    private readonly sourcesService: SourcesService,
    private readonly schemasService: SchemasService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() source: DataSourceEntity) {
    return this.sourcesService.update(source);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.sourcesService.remove(id);
  }

  @Post(':id/test-connection')
  @UseGuards(JwtAuthGuard)
  testConnection(@Param('id') id: string) {
    return this.sourcesService.testConnection(id);
  }

  @Post(':id/sync')
  @UseGuards(JwtAuthGuard)
  sync(@Param('id') id: string) {
    return this.sourcesService.sync(id);
  }

  @Get(':id/schema')
  getSchema(@Param('id') id: string) {
    return this.schemasService.findBySourceId(id);
  }

  @Get(':id/data')
  getData(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.sourcesService.getSourceData(id, {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Delete(':id/data')
  @UseGuards(JwtAuthGuard)
  clearData(@Param('id') id: string) {
    return this.sourcesService.clearSourceData(id);
  }
}
