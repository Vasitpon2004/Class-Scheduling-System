import { CreateUserDto } from './dto/create-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { Major } from '../faculties/entities/major.entity.js';
import { OtpService } from '../otp/otp.service.js';
export declare class UsersService {
    private userRepository;
    private majorRepository;
    private readonly otpService;
    private readonly logger;
    constructor(userRepository: Repository<User>, majorRepository: Repository<Major>, otpService: OtpService);
    findAll(): Promise<User[]>;
    create(dto: CreateUserDto): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        user_code: string | null;
        email: string;
        role: UserRole;
        major: import("typeorm").Relation<Major> | null;
        year: number | null;
        study_plan: import("./enums/study-plan.enum.js").StudyPlan | null;
        is_email_verified: boolean;
        is_approved: boolean;
        is_active: boolean;
        discord_id: string | null;
        discord_in_server: boolean;
        created_at: Date;
    }>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    markEmailVerified(userId: number): Promise<void>;
}
