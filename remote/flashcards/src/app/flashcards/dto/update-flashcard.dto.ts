import { PartialType } from '@nestjs/mapped-types';
import { CreateFlashcardDto } from './create-flashcard.dto';

export class UpdateFlashcardDto extends PartialType(CreateFlashcardDto) {}
