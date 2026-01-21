import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}