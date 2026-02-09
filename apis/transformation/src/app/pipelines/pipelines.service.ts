import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { PipelineEntity } from '../database/entities/pipeline.entity';
import { PipelineRunEntity } from '../database/entities/pipeline-run.entity';
import { StepsService } from '../steps/steps.service';
import { PipelineExecutor } from '../engine';

@Injectable()
export class PipelinesService {
  private readonly logger = new Logger(PipelinesService.name);
  private readonly executor = new PipelineExecutor();

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
    const steps = await this.stepsService.findByPipelineId(pipeline.id);

    const run = new PipelineRunEntity();
    run.pipelineId = pipeline.id;
    run.status = 'running';
    run.startedAt = new Date().toISOString();
    run.recordsProcessed = 0;
    run.errors = [];

    const savedRun = await this.runsRepository.save(run);

    // Execute pipeline asynchronously
    this.executePipeline(pipeline, steps || [], savedRun).catch((err) => {
      this.logger.error(`Pipeline execution error: ${err.message}`);
    });

    return savedRun;
  }

  private async executePipeline(
    pipeline: PipelineEntity,
    steps: any[],
    run: PipelineRunEntity
  ): Promise<void> {
    try {
      const result = await this.executor.execute(
        pipeline.id,
        pipeline.sourceId,
        steps.map((s) => ({
          id: s.id,
          pipelineId: s.pipelineId,
          order: s.order,
          type: s.type,
          config: s.config,
          inputSchema: s.inputSchema,
          outputSchema: s.outputSchema,
        }))
      );

      run.status = result.success ? 'completed' : 'failed';
      run.completedAt = new Date().toISOString();
      run.recordsProcessed = result.recordsProcessed;

      if (!result.success) {
        run.errors = [result.error || 'Unknown error'];
        pipeline.status = 'error';
      } else {
        pipeline.status = 'active';
      }

      pipeline.lastRunAt = new Date().toISOString();

      await this.runsRepository.save(run);
      await this.pipelinesRepository.save(pipeline);

      this.logger.log(
        `Pipeline ${pipeline.id} execution ${result.success ? 'completed' : 'failed'}: ` +
        `${result.recordsProcessed} records in ${result.executionTimeMs}ms`
      );
    } catch (error: any) {
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      run.errors = [error.message];
      pipeline.status = 'error';
      pipeline.lastRunAt = new Date().toISOString();

      await this.runsRepository.save(run);
      await this.pipelinesRepository.save(pipeline);
    }
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

  async getRun(runId: string): Promise<PipelineRunEntity> {
    const run = await this.runsRepository.findOneBy({ id: runId });
    if (!run) throw new NotFoundException('Run not found');
    return run;
  }
}
