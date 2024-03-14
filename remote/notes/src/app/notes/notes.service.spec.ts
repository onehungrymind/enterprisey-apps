import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockEmptyNote, mockNote } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';

import { Note } from '../database/entities/note.entity';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;

  const note = { ...mockNote } as Note;
  const emptyNote = { ...mockEmptyNote } as Note;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: 'NOTE_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>('NOTE_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find() on service.findAll()', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([note]);

    const result = await service.findAll();

    expect(result).toStrictEqual([note]);
  });

  it('findOneBy() on service.findOne()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(note);

    const result = await service.findOne(note.id);

    expect(result).toStrictEqual(note);
  });

  it('findOneBy() on service.get()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(note);

    const result = await service.get(note.id);

    expect(result).toStrictEqual(note);
  });

  it('findOneBy() on service.get() error', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());

    await expect(service.get(note.id)).rejects.toThrow(NotFoundException);
  });

  it('save() on service.create()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(emptyNote);

    const result = await service.create(emptyNote);

    expect(result).toStrictEqual(emptyNote);
  });

  it('save() on service.update()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(note);

    const result = await service.update(note);

    expect(result).toStrictEqual(note);
  });

  it('delete() on service.remove()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(note);
    jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as DeleteResult);

    const result = await service.remove(note.id);

    expect(result).toStrictEqual({});
  });

  it('delete() on service.remove() error', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);

    await expect(service.remove(note.id)).rejects.toThrow(NotFoundException);
  });
});
