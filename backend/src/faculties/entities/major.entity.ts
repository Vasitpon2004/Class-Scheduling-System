import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Faculty } from './faculty.entity.js';

@Entity('majors')
export class Major {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  major_name: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.majors, { nullable: false })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Relation<Faculty>;
}
