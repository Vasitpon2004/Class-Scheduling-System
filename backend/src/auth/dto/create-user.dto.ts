import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    MaxLength,
    MinLength,
    Min,
    Max,
    Matches,
} from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum.js'; 
import { StudyPlan } from '../../users/enums/study-plan.enum.js';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    last_name: string;
    
    @IsOptional()
    @IsString()
    @MaxLength(20)
    user_code?: string;

    @IsEmail()
    @Matches(/@ku\.th$/, { message: 'ต้องเป็นอีเมล @ku.th เท่านั้น' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' })
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsInt()
    @Min(1)
    major_id?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(8)
    year?: number;

    @IsOptional()
    @IsEnum(StudyPlan)
    study_plan?: StudyPlan;

}