import { Controller, Get, Param } from '@nestjs/common';
import { SchemasService } from './schemas.service';

@Controller('schemas')
export class SchemasController {
  constructor(private readonly schemasService: SchemasService) {}

  @Get()
  findAll() {
    return this.schemasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemasService.findOne(id);
  }
}
