import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserRole } from './enums/user-role.enum.js';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    findAll(): Promise<import("./entities/user.entity.js").User[]>;
    create(dto: CreateUserDto): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        user_code: string | null;
        email: string;
        role: UserRole;
        major: import("typeorm").Relation<import("../faculties/entities/major.entity.js").Major> | null;
        year: number | null;
        study_plan: import("./enums/study-plan.enum.js").StudyPlan | null;
        is_email_verified: boolean;
        is_approved: boolean;
        is_active: boolean;
        discord_id: string | null;
        discord_in_server: boolean;
        created_at: Date;
    }>;
}
