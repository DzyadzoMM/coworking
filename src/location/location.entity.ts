import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  
@PrimaryGeneratedColumn()
id: number;

//Назва
@Column()
name: string

//Адреса
@Column()
  address: string;

//Опис
@Column({ type: 'text', nullable: true })
  description: string;

//Фото
@Column({ nullable: true })
image: string; 
}