import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
export declare class OtpVerify {
    id: number;
    user: Relation<User>;
    user_id: number;
    otp_code: string;
    attempts: number;
    is_used: boolean;
    expires_at: Date;
    created_at: Date;
}
