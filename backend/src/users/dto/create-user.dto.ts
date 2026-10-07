import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsEnum,
    IsInt,
    MaxLength,
    MinLength,
    Min,
    Max,
    Matches,
    ValidateIf,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum.js'; 
import { StudyPlan } from '../enums/study-plan.enum.js';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    last_name: string;
    
    @ValidateIf((o) => 
        o.role === UserRole.NISIT || 
        o.role === UserRole.PROFESSOR ||
        o.user_code !== undefined,
    )
    @IsNotEmpty({ message: 'ต้องระบุรหัสประจำตัว' })
    @IsString()
    @MaxLength(20)
    user_code?: string;

    @IsEmail()
    @MaxLength(150)
    @Matches(/@ku\.th$/, { message: 'ต้องเป็นอีเมล @ku.th เท่านั้น' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' })
    @MaxLength(16, { message: 'รหัสผ่านยาวได้ไม่เกิน 16 ตัวอักษร' })
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @ValidateIf((o) => o.role === UserRole.NISIT || o.major_id !== undefined)
    @IsInt()
    @Min(1)
    major_id?: number;

    @ValidateIf((o) => o.role === UserRole.NISIT)
    @IsInt()
    @Min(1)
    @Max(8)
    year?: number;

    @ValidateIf((o) => o.role === UserRole.NISIT)
    @IsEnum(StudyPlan)
    study_plan?: StudyPlan;

}