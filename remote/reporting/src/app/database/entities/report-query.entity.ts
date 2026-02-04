import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportQuery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  pipelineId: string;

  @Column({ type: 'simple-json', nullable: true })
  aggregation: any;

  @Column({ type: 'simple-json', nullable: true })
  filters: any;

  @Column({ nullable: true })
  cachedAt: string;

  @Column({ nullable: true })
  cacheDuration: number;
}
