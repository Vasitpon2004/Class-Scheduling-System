import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Major } from './major.entity.js';

@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  faculty_name: string;

  @OneToMany(() => Major, (major) => major.faculty)
  majors: Relation<Major[]>;
}
