import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Location } from '../location/location.entity';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Workspace{
  
@PrimaryGeneratedColumn()
id: number;

//Назва
@Column()
name: string

//Тип type: 'hot-desk', 'dedicated-desk', 'meeting-room'
@Column()
  type: string;
  
//Ціна
@Column()
  price: number;

//Статус
@Column({ default: true })
  isAvailable: boolean;

//Звязок з локацією
@ManyToOne(() => Location, (location) => location.workspaces, { onDelete: 'CASCADE' })
  location: Location;
  
@OneToMany(() => Booking, (booking) => booking.workspace) bookings: Booking[];
}