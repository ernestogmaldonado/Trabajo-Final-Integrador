import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Task } from './task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'ACTIVO' })
  status: string;

  @Column({ name: 'client_id', nullable: true })
  clientId: number | null;

  @ManyToOne(() => Client, (c) => c.projects, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client | null;

  @OneToMany(() => Task, (t) => t.project)
  tasks: Task[];
}
