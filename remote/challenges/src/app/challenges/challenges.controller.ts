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
import { Challenge } from '../database/entities/challenge.entity';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@proto/guards/remote-auth';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@Body() challenge: Challenge): Promise<Challenge> {
    return this.challengesService.create(challenge);
  }

  @Get()
  @Roles(['tester'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Challenge> {
    return this.challengesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() challenge: Challenge) {
    return this.challengesService.update(challenge);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesService.remove(id);
  }
}
