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

@Entity('otp_verify')
export class OtpVerify {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Relation<User>;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'varchar', length: 6 })
    otp_code: string;

    @Column({ type: 'smallint', default: 0 })
    attempts: number;

    @Column({ type: 'boolean', default: false })
    is_used: boolean;

    @Column({ type: 'timestamp' })
    expires_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}