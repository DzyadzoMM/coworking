import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Workspace } from '../workspaces/workspace.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: 'active' }) // active, cancelled, completed
  status: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.bookings)
  workspace: Workspace;
}
