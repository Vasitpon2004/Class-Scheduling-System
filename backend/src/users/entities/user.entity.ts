import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserRole } from '../enums/user-role.enum.js';
import { StudyPlan } from '../enums/study-plan.enum.js';
import { Major } from '../../faculties/entities/major.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  user_code: string | null;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToOne(() => Major, { nullable: true })
  @JoinColumn({ name: 'major_id' })
  major: Relation<Major> | null;

  @Column({ type: 'smallint', nullable: true })
  year: number | null;

  @Column({ type: 'enum', enum: StudyPlan, nullable: true })
  study_plan: StudyPlan | null;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_approved: boolean;

  @Column({ type: 'boolean', nullable: false, default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  discord_id: string | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  discord_in_server: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
