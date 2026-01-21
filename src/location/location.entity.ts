import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';

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

// Одна локація має багато робочих місць
  @OneToMany(() => Workspace, (workspace) => workspace.location)
  workspaces: Workspace[];
}