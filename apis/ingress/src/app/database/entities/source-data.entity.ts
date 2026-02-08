import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('source_data')
export class SourceDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sourceId: string;

  @Column({ type: 'text' })
  data: string; // JSON stringified row

  @Column({ nullable: true })
  batchId: string; // Groups records from the same sync

  @CreateDateColumn()
  ingestedAt: Date;
}
