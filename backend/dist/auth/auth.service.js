var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.usersService.findByEmailWithPassword(dto.email);
        if (!user) {
            throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password_hash);
        if (!isMatch) {
            throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        if (!user.is_email_verified) {
            throw new ForbiddenException('กรุณายืนยันอีเมลก่อน');
        }
        if (!user.is_approved) {
            throw new ForbiddenException('กรุณารอการยืนยันจากผู้ดูแลระบบ');
        }
        if (!user.is_active) {
            throw new ForbiddenException('ขออภัย บัญชีของคุณถูกระงับการช้งาน');
        }
        const payload = { sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            },
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map