import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  completed: boolean;

  @Column()
  repo_url: string;

  @Column()
  comment: string;

  @Column()
  user_id: string;
}
