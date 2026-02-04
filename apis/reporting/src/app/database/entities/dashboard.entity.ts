import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  widgets: any[];

  @Column({ type: 'simple-json', nullable: true })
  filters: any[];

  @Column()
  createdBy: string;

  @Column({ default: false })
  isPublic: boolean;
}
