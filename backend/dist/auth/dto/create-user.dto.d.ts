import { UserRole } from '../../users/enums/user-role.enum.js';
import { StudyPlan } from '../../users/enums/study-plan.enum.js';
export declare class CreateUserDto {
    first_name: string;
    last_name: string;
    user_code?: string;
    email: string;
    password: string;
    role: UserRole;
    major_id?: number;
    year?: number;
    study_plan?: StudyPlan;
}
