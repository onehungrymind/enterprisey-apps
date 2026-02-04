import { Test, TestingModule } from '@nestjs/testing';
import { mockEmptyNote, mockNote } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';
import { Note } from '../database/entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;
  const note = { ...mockNote } as Note;
  const emptyNote = { ...mockEmptyNote } as Note;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NotesService,
        {
          provide: 'NOTE_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();
    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('create()', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(note);
    const result = await controller.create(emptyNote);
    expect(result).toStrictEqual(note);
  });
  it('findAll()', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([note]);
    const result = await controller.findAll();
    expect(result).toStrictEqual([note]);
  });
  it('findOne()', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(note);
    const result = await service.findOne(note.id);
    expect(result).toStrictEqual(note);
  });
  it('update()', async () => {
    jest.spyOn(service, 'update').mockResolvedValueOnce(note);
    const result = await controller.update(note.id, note);
    expect(result).toStrictEqual(note);
  });
  it('remove()', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce({} as DeleteResult);
    const result = await controller.remove(note.id);
    expect(result).toStrictEqual({});
  });
});
