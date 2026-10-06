var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { Major } from '../faculties/entities/major.entity.js';
import { Logger } from '@nestjs/common';
import { OtpService } from '../otp/otp.service.js';
let UsersService = UsersService_1 = class UsersService {
    userRepository;
    majorRepository;
    otpService;
    logger = new Logger(UsersService_1.name);
    constructor(userRepository, majorRepository, otpService) {
        this.userRepository = userRepository;
        this.majorRepository = majorRepository;
        this.otpService = otpService;
    }
    async findAll() {
        return this.userRepository.find();
    }
    async create(dto) {
        if (dto.role === UserRole.ADMIN) {
            throw new BadRequestException('ไม่สามารถสมัครด้วยบทบาทแอดมินได้');
        }
        if (dto.role !== UserRole.NISIT && (dto.year !== undefined || dto.study_plan !== undefined)) {
            throw new BadRequestException('เฉพาะนิสิตเท่านั้นที่ระบุชั้นปีและแผนการเรียนได้');
        }
        if (dto.major_id !== undefined) {
            const major = await this.majorRepository.findOne({ where: { id: dto.major_id } });
            if (!major)
                throw new BadRequestException('ไม่พบสาขาวิชาที่ระบุ');
        }
        const existing = await this.userRepository.findOne({
            where: { email: dto.email },
        });
        if (existing)
            throw new ConflictException('อีเมลนี้ถูกใช้แล้ว');
        const hash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            password_hash: hash,
            role: dto.role,
            is_approved: dto.role === UserRole.NISIT,
            year: dto.year ?? null,
            study_plan: dto.study_plan ?? null,
            user_code: dto.user_code ?? null,
            major: dto.major_id ? { id: dto.major_id } : null,
        });
        const saved = await this.userRepository.save(user);
        try {
            await this.otpService.createForUser(saved.id);
        }
        catch (error) {
            this.logger.error('สร้าง OTP ไม่สำเร็จ สำหรับผู้ใช้งาน ' + saved.id, error);
        }
        const { password_hash, ...result } = saved;
        return result;
    }
    async findByEmailWithPassword(email) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password_hash')
            .where('user.email = :email', { email })
            .getOne();
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async markEmailVerified(userId) {
        await this.userRepository.update(userId, { is_email_verified: true });
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: { major: { faculty: true } },
        });
    }
};
UsersService = UsersService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __param(1, InjectRepository(Major)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        OtpService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map