import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExportJobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  queryId: string;

  @Column({ default: 'csv' })
  format: string;

  @Column({ default: 'queued' })
  status: string;

  @Column({ type: 'integer', default: 0 })
  progress: number;

  @Column({ nullable: true })
  scheduleCron: string;

  @Column({ nullable: true })
  outputUrl: string;

  @Column({ default: '' })
  createdBy: string;

  @Column({ nullable: true })
  startedAt: string;

  @Column({ nullable: true })
  completedAt: string;

  @Column({ type: 'integer', nullable: true })
  fileSize: number;

  @Column({ type: 'integer', nullable: true })
  recordCount: number;

  @Column({ nullable: true })
  error: string;
}
