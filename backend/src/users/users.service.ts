import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { Major } from '../faculties/entities/major.entity.js';
import { Logger } from '@nestjs/common';
import { OtpService } from '../otp/otp.service.js';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Major)
        private majorRepository: Repository<Major>,
        private readonly otpService: OtpService,
    ){}

    async findAll() {
        return this.userRepository.find();
    }


    async create(dto: CreateUserDto){
        if (dto.role === UserRole.ADMIN){
            throw new BadRequestException('ไม่สามารถสมัครด้วยบทบาทแอดมินได้')
        }
        if (dto.role !== UserRole.NISIT && (dto.year !== undefined || dto.study_plan !== undefined)){
            throw new BadRequestException('เฉพาะนิสิตเท่านั้นที่ระบุชั้นปีและแผนการเรียนได้')
        }
        if (dto.major_id !== undefined) {
            const major = await this.majorRepository.findOne({ where: { id: dto.major_id } });
            if (!major) throw new BadRequestException('ไม่พบสาขาวิชาที่ระบุ');
        }
        const existing = await this.userRepository.findOne({
            where: { email: dto.email },
        });
        if (existing) throw new ConflictException('อีเมลนี้ถูกใช้แล้ว');

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

        try{
            await this.otpService.createForUser(saved.id);
        } catch (error) {
            this.logger.error('สร้าง OTP ไม่สำเร็จ สำหรับผู้ใช้งาน ' + saved.id , error);
        }

        const { password_hash, ...result } = saved;
        return result;
    }
    //ใช้สำหรับ Login
    async findByEmailWithPassword(email: string){
        return this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password_hash')
        .where('user.email = :email', { email })
        .getOne();
    }

    async findByEmail(email: string){
        return this.userRepository.findOne({ where: { email } });
    }

    async markEmailVerified(userId: number): Promise<void>{
        await this.userRepository.update(userId, { is_email_verified: true });
    }
}
