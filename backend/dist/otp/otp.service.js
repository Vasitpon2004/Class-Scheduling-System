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
var OtpService_1;
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'node:crypto';
import { OtpVerify } from './entities/otp-verify.entity.js';
let OtpService = OtpService_1 = class OtpService {
    otpRepository;
    logger = new Logger(OtpService_1.name);
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    async createForUser(userId) {
        await this.otpRepository.update({ user_id: userId, is_used: false }, { is_used: true });
        const code = randomInt(100000, 1000000).toString();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const otp = this.otpRepository.create({
            user_id: userId,
            otp_code: code,
            expires_at: expires_at,
        });
        await this.otpRepository.save(otp);
        this.logger.log('OTP for user ' + userId + ': ' + code);
        return code;
    }
    async verify(userId, code) {
        const otp = await this.otpRepository.findOne({
            where: { user_id: userId, is_used: false },
            order: { id: 'DESC' },
        });
        if (!otp) {
            throw new BadRequestException('ไม่พบรหัสยืนยันที่ใช้งานได้ กรุณาขอรหัสใหม่');
        }
        if (otp.expires_at < new Date()) {
            throw new BadRequestException('รหัสยืนยันหมดอายุแล้ว กรุณาขอรหัสใหม่');
        }
        if (otp.attempts >= 5) {
            throw new BadRequestException('กรอกรหัสผิดเกินกำหนด กรุณาขอรหัสใหม่');
        }
        if (otp.otp_code !== code) {
            otp.attempts = otp.attempts + 1;
            await this.otpRepository.save(otp);
            throw new BadRequestException(`รหัสยืนยันไม่ถูกต้อง เหลืออีก ${5 - otp.attempts} ครั้ง`);
        }
        otp.is_used = true;
        await this.otpRepository.save(otp);
    }
};
OtpService = OtpService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(OtpVerify)),
    __metadata("design:paramtypes", [Repository])
], OtpService);
export { OtpService };
//# sourceMappingURL=otp.service.js.map