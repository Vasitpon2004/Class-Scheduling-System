import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { LogAction } from '../enums/log-action.enum.js';

//ใช้สำหรับการสร้างตารางเก็บข้อมูล Logs ของระบบ
@Entity('system_logs') // กำหนดให้classนี้mapกับตารางในdbที่ชื่อว่า system_logs
export class SystemLog{
    @PrimaryGeneratedColumn()
    id: number;

    //เก็บประเภทกิจกรรมภายในระบบโดยใช้ประเภทข้อมูลแบบ enum ที่ชื่อว่า LogAction
    @Column({ type: 'enum', enum: LogAction })
    action: LogAction;

    //เชื่อมไปยัง User เพื่อเอาชื่อผู้ทำรายการมาแสดง
    //nullable: true = เพราะว่าอาจเกิดกระทำเองของระบบ เช่น ยกเลิกนัดหมายอัตโนมัติ
    //เมื่อมีคนตอบรับไม่พอ หรือ ยืนยันการนัดหมาย หากคนตอบรับพอ
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'actor_user_id' })
    actor: Relation<User> | null;

    @Column({ type: 'int', nullable: true })
    actor_user_id: number | null;

    @Column({ type: 'int', nullable: true })
    target_user_id: number | null;

    @Column({ type: 'text', nullable: true })
    detail: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}