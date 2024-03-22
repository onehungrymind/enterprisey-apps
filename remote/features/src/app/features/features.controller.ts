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
import { Feature } from '../database/entities/feature.entity';
import { FeaturesService } from './features.service';
import { JwtAuthGuard, Roles } from '@proto/guards/remote-auth';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  create(@Body() feature: Feature): Promise<Feature> {
    return this.featuresService.create(feature);
  }

  @Get()
  @Roles(['tester'])
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Feature[]> {
    return this.featuresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Feature> {
    return this.featuresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() feature: Feature) {
    return this.featuresService.update(feature);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featuresService.remove(id);
  }
}
