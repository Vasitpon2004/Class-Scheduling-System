import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { OtpService } from '../otp/otp.service.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly otpService;
    constructor(usersService: UsersService, jwtService: JwtService, otpService: OtpService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            role: import("../users/enums/user-role.enum.js").UserRole;
        };
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<import("../users/entities/user.entity.js").User>;
}
