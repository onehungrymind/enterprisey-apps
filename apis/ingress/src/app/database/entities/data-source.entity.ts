import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DataSourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'simple-json', default: '{}' })
  connectionConfig: Record<string, string>;

  @Column({ default: 'disconnected' })
  status: string;

  @Column({ nullable: true })
  lastSyncAt: string;

  @Column({ default: 'manual' })
  syncFrequency: string;

  @Column({ type: 'simple-json', default: '[]' })
  errorLog: string[];

  @Column({ default: '' })
  createdBy: string;
}
