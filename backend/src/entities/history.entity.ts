import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('history')
export class HistoryEntry {
  @PrimaryGeneratedColumn()
  id: number;

  // CLIENTE, PROYECTO o TAREA
  @Column()
  entity: string;

  @Column({ name: 'entity_id' })
  entityId: number;

  // ALTA, MODIFICACION, BAJA, ELIMINACION
  @Column()
  action: string;

  @Column()
  detail: string;

  @Column()
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
