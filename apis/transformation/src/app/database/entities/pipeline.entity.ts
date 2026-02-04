import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TransformStepEntity } from './transform-step.entity';

@Entity()
export class PipelineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column()
  sourceId: string;

  @OneToMany(() => TransformStepEntity, (step) => step.pipeline, { eager: true })
  steps: TransformStepEntity[];

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  lastRunAt: string;

  @Column({ default: '' })
  createdBy: string;
}
