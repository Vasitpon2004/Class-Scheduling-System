import type { Relation } from 'typeorm';
import { UserRole } from '../enums/user-role.enum.js';
import { StudyPlan } from '../enums/study-plan.enum.js';
import { Major } from '../../faculties/entities/major.entity.js';
export declare class User {
    id: number;
    first_name: string;
    last_name: string;
    user_code: string | null;
    email: string;
    password_hash: string;
    role: UserRole;
    major: Relation<Major> | null;
    year: number | null;
    study_plan: StudyPlan | null;
    is_email_verified: boolean;
    is_approved: boolean;
    is_active: boolean;
    discord_id: string | null;
    discord_in_server: boolean;
    created_at: Date;
}
