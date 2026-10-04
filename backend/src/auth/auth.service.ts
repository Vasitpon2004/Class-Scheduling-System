import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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
}
