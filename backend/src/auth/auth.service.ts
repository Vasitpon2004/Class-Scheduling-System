import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { OtpService } from '../otp/otp.service.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
    ){}

    async login(dto: LoginDto) {
        // หา user พร้อม hash password
        const user = await this.usersService.findByEmailWithPassword(dto.email);

        //กรณีหา user ไม่เจอ
        if(!user) {
            throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }

        // เทียบรหัสผ่าน
        const isMatch = await bcrypt.compare(dto.password, user.password_hash);
        if(!isMatch){
            throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }

        // ตรวจสถานะบัญชี
        if(!user.is_email_verified){
            throw new ForbiddenException('กรุณายืนยันอีเมลก่อน');
        }

        if(!user.is_approved){
            throw new ForbiddenException('กรุณารอการยืนยันจากผู้ดูแลระบบ');
        }

        if(!user.is_active){
            throw new ForbiddenException('ขออภัย บัญชีของคุณถูกระงับการช้งาน');
        }

        // ออก token ให้ผู้ใช้งาน
        const payload = { sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);

        return{
            access_token,
            user:{
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            },
        };
    }

    async verifyOtp(dto: VerifyOtpDto){
        const user = await this.usersService.findByEmail(dto.email);

        //ใช้เช็ค หากไม่พบผู้ใช้งานนี้
        if(!user){
            throw new BadRequestException('ไม่พบรหัสยืนยันที่ใช้งานได้ กรุณาขอรหัสใหม่');
        }
        
        //ใช้เช็ค คนที่บัญชีได้รับการยืนยันแล้ว
        if(user.is_email_verified){
            throw new BadRequestException('อีเมลนี้ได้รับการยืนยันแล้ว กรุณาเข้าสู่ระบบ');
        }

        //ตรวจสอบความถูกต้องของรหัส OTP ที่ผู้ใช้กรอกเข้ามา ถ้าไม่ถูกต้องจะโยน error ออกมาให้
        await this.otpService.verify(user.id, dto.otp_code);
        //ใช้สำหรับอัปเดตสถานะของผู้ใช้ที่ได้รับการยืนยันอีเมลแล้ว
        await this.usersService.markEmailVerified(user.id);
        return { message: 'ยืนยันอีเมลสำเร็จ' };
    }

    //ใช้สำหรับขอรหัส otp ใหม่
    async resendOtp(dto: ResendOtpDto){
        const user = await this.usersService.findByEmail(dto.email);

        if(user && !user.is_email_verified){
            await this.otpService.createForUser(user.id);
        }
        return { message: 'ระบบได้ส่งรหัสใหม่ไปทางอีเมลเรียบร้อยแล้ว' }
    }
}
