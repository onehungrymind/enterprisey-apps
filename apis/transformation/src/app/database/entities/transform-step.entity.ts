import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PipelineEntity } from './pipeline.entity';

@Entity()
export class TransformStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pipelineId: string;

  @Column({ default: 0 })
  order: number;

  @Column()
  type: string;

  @Column({ type: 'simple-json', default: '{}' })
  config: Record<string, any>;

  @Column({ type: 'simple-json', default: '[]' })
  inputSchema: { name: string; type: string; nullable: boolean; sampleValues: string[] }[];

  @Column({ type: 'simple-json', default: '[]' })
  outputSchema: { name: string; type: string; nullable: boolean; sampleValues: string[] }[];

  @ManyToOne(() => PipelineEntity, (pipeline) => pipeline.steps)
  @JoinColumn({ name: 'pipelineId' })
  pipeline: PipelineEntity;
}
