import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;

@Column({ unique: true })
email: string;

@Column({ nullable: true })
firstName: string


@Column({ type: 'varchar', nullable: true })
  telegramId: string | null;

@Column({ type: 'varchar', nullable: true })
  telegramToken: string | null;

@Column()
password: string; 

@OneToMany(() => Booking, (booking) => booking.user) bookings: Booking[];
}