import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { PipelineEntity } from '../database/entities/pipeline.entity';
import { PipelineRunEntity } from '../database/entities/pipeline-run.entity';
import { StepsService } from '../steps/steps.service';

@Injectable()
export class PipelinesService {
  constructor(
    @Inject('PIPELINE_REPOSITORY')
    private pipelinesRepository: Repository<PipelineEntity>,
    @Inject('PIPELINE_RUN_REPOSITORY')
    private runsRepository: Repository<PipelineRunEntity>,
    private stepsService: StepsService,
  ) {}

  async findAll(): Promise<PipelineEntity[]> {
    return await this.pipelinesRepository.find();
  }

  async findOne(id: string): Promise<PipelineEntity | undefined> {
    return await this.pipelinesRepository.findOneBy({ id });
  }

  async get(id: string): Promise<PipelineEntity> {
    const pipeline = await this.pipelinesRepository.findOneBy({ id });
    if (!pipeline) throw new NotFoundException();
    return pipeline;
  }

  async create(pipeline: PipelineEntity): Promise<PipelineEntity> {
    return await this.pipelinesRepository.save(pipeline);
  }

  async update(pipeline: PipelineEntity): Promise<PipelineEntity> {
    return await this.pipelinesRepository.save(pipeline);
  }

  async remove(id: string): Promise<DeleteResult> {
    const pipeline = await this.pipelinesRepository.findOneBy({ id });
    if (!pipeline) throw new NotFoundException();
    return await this.pipelinesRepository.delete(id);
  }

  async run(id: string): Promise<PipelineRunEntity> {
    const pipeline = await this.get(id);

    const run = new PipelineRunEntity();
    run.pipelineId = pipeline.id;
    run.status = 'running';
    run.startedAt = new Date().toISOString();
    run.recordsProcessed = 0;
    run.errors = [];

    const savedRun = await this.runsRepository.save(run);

    // Simulate async processing
    setTimeout(async () => {
      const success = Math.random() > 0.2;
      savedRun.status = success ? 'completed' : 'failed';
      savedRun.completedAt = new Date().toISOString();
      savedRun.recordsProcessed = success ? Math.floor(Math.random() * 10000) + 100 : 0;
      if (!success) {
        savedRun.errors = [`Pipeline run failed at step ${Math.floor(Math.random() * 3) + 1}`];
      }
      await this.runsRepository.save(savedRun);

      // Update pipeline lastRunAt
      pipeline.lastRunAt = new Date().toISOString();
      if (!success) {
        pipeline.status = 'error';
      }
      await this.pipelinesRepository.save(pipeline);
    }, 2000);

    return savedRun;
  }

  async preview(id: string): Promise<{ name: string; type: string; nullable: boolean; sampleValues: string[] }[]> {
    const pipeline = await this.get(id);
    const steps = await this.stepsService.findByPipelineId(pipeline.id);

    if (!steps || steps.length === 0) {
      // Fetch source schema from ingress service
      const ingressUrl = process.env.INGRESS_API_URL || 'http://localhost:3100/api';
      try {
        const res = await fetch(`${ingressUrl}/schemas?sourceId=${pipeline.sourceId}`);
        const schemas = await res.json();
        if (schemas && schemas.length > 0) {
          return schemas[0].fields;
        }
      } catch (_) {
        // fallback to empty schema
      }
      return [];
    }

    // Chain step transforms: return the outputSchema of the last step
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    return sortedSteps[sortedSteps.length - 1].outputSchema || [];
  }

  async getRuns(id: string): Promise<PipelineRunEntity[]> {
    await this.get(id); // ensure pipeline exists
    return await this.runsRepository.find({ where: { pipelineId: id } });
  }
}
