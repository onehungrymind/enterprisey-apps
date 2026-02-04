import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { TransformStepEntity } from '../database/entities/transform-step.entity';

@Injectable()
export class StepsService {
  constructor(
    @Inject('STEP_REPOSITORY')
    private stepsRepository: Repository<TransformStepEntity>,
  ) {}

  async findAll(): Promise<TransformStepEntity[]> {
    return await this.stepsRepository.find();
  }

  async findOne(id: string): Promise<TransformStepEntity | undefined> {
    return await this.stepsRepository.findOneBy({ id });
  }

  async get(id: string): Promise<TransformStepEntity> {
    const step = await this.stepsRepository.findOneBy({ id });
    if (!step) throw new NotFoundException();
    return step;
  }

  async findByPipelineId(pipelineId: string): Promise<TransformStepEntity[]> {
    return await this.stepsRepository.find({
      where: { pipelineId },
      order: { order: 'ASC' },
    });
  }

  async create(step: TransformStepEntity): Promise<TransformStepEntity> {
    return await this.stepsRepository.save(step);
  }

  async update(step: TransformStepEntity): Promise<TransformStepEntity> {
    return await this.stepsRepository.save(step);
  }

  async remove(id: string): Promise<DeleteResult> {
    const step = await this.stepsRepository.findOneBy({ id });
    if (!step) throw new NotFoundException();
    return await this.stepsRepository.delete(id);
  }

  async reorder(id: string, newOrder: number): Promise<TransformStepEntity> {
    const step = await this.get(id);
    const pipelineSteps = await this.findByPipelineId(step.pipelineId);

    const oldOrder = step.order;

    // Shift other steps to make room
    for (const s of pipelineSteps) {
      if (s.id === step.id) continue;

      if (oldOrder < newOrder) {
        // Moving down: shift steps between old and new positions up
        if (s.order > oldOrder && s.order <= newOrder) {
          s.order = s.order - 1;
          await this.stepsRepository.save(s);
        }
      } else {
        // Moving up: shift steps between new and old positions down
        if (s.order >= newOrder && s.order < oldOrder) {
          s.order = s.order + 1;
          await this.stepsRepository.save(s);
        }
      }
    }

    step.order = newOrder;
    return await this.stepsRepository.save(step);
  }
}
