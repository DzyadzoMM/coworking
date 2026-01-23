import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  telegramId: string | null;

  @Column({ type: 'varchar', nullable: true })
  telegramToken: string | null;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  hashedRefreshToken: string | null;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
