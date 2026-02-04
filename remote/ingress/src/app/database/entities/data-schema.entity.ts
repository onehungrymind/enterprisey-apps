import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DataSchemaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sourceId: string;

  @Column({ type: 'simple-json', default: '[]' })
  fields: { name: string; type: string; nullable: boolean; sampleValues: string[] }[];

  @Column()
  discoveredAt: string;

  @Column({ default: 1 })
  version: number;
}
