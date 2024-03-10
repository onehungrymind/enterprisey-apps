import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  user_id: string;
}
