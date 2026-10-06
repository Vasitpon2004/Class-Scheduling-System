import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { LogAction } from '../enums/log-action.enum.js';
export declare class SystemLog {
    id: number;
    action: LogAction;
    actor: Relation<User> | null;
    actor_user_id: number | null;
    target_user_id: number | null;
    detail: string | null;
    created_at: Date;
}
