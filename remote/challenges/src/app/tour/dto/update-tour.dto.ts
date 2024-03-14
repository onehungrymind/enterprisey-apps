import { PartialType } from '@nestjs/swagger';
import { CreateTourDto } from './create-tour.dto';

export class UpdateTourDto extends PartialType(CreateTourDto) {}
