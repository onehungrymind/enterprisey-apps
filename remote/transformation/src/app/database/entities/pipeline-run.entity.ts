import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PipelineRunEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pipelineId: string;

  @Column({ default: 'running' })
  status: string;

  @Column()
  startedAt: string;

  @Column({ nullable: true })
  completedAt: string;

  @Column({ default: 0 })
  recordsProcessed: number;

  @Column({ type: 'simple-json', default: '[]' })
  errors: string[];
}
