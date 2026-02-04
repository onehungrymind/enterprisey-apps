import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dashboardId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  queryId: string;

  @Column({ type: 'simple-json', nullable: true })
  config: any;

  @Column({ type: 'simple-json', nullable: true })
  position: { x: number; y: number; w: number; h: number };
}
