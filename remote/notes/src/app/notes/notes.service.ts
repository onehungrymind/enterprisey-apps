import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { Note } from '../database/entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @Inject('NOTE_REPOSITORY')
    private notesRepository: Repository<Note>
  ) {}

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.find();
  }

  async findOne(id: string): Promise<Note | undefined> {
    return await this.notesRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) throw new NotFoundException();
    return note;
  }

  async create(note: Note): Promise<Note> {
    return await this.notesRepository.save(note);
  }

  async update(note: Note): Promise<Note> {
    return await this.notesRepository.save(note);
  }

  async remove(id: string): Promise<DeleteResult> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) throw new NotFoundException();
    return await this.notesRepository.delete(id);
  }
}
