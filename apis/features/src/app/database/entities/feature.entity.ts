import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  remote_uri: string;

  @Column()
  api_uri: string;

  @Column()
  slug: string;

  @Column()
  healthy: boolean;
}
