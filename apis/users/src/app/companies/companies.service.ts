import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Company } from '../database/entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject('COMPANY_REPOSITORY')
    private companiesRepository: Repository<Company>
  ) {}

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find();
  }

  async findOne(id: string): Promise<Company | undefined> {
    return await this.companiesRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOneBy({ id });
    if (!company) throw new NotFoundException();
    return company;
  }

  async create(company: Company): Promise<Company> {
    return await this.companiesRepository.save(company);
  }

  async update(company: Company): Promise<Company> {
    const existing = await this.companiesRepository.findOneBy({ id: company.id });
    if (!existing) throw new NotFoundException();
    return await this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<DeleteResult> {
    const company = await this.companiesRepository.findOneBy({ id });
    if (!company) throw new NotFoundException();
    return await this.companiesRepository.delete(id);
  }
}
