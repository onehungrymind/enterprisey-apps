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
import { Company } from '../database/entities/company.entity';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@proto/lib/roles.guard';
import { Roles } from '@proto/lib/roles.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles(['admin', 'user', 'mentor', 'apprentice'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @Roles(['admin', 'user', 'mentor', 'apprentice'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Promise<Company> {
    return this.companiesService.get(id);
  }

  @Post()
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() company: Company): Promise<Company> {
    return this.companiesService.create(company);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() company: Company): Promise<Company> {
    return this.companiesService.update({ ...company, id });
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
