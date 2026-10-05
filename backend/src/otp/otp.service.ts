import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'node:crypto';
import { OtpVerify } from './entities/otp-verify.entity.js';

@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);
    constructor(
        @InjectRepository(OtpVerify)
        private otpRepository: Repository<OtpVerify>
    ){}
    
    async createForUser(userId: number): Promise<string> {
        await this.otpRepository.update(
            { user_id: userId, is_used: false},
            { is_used: true},
        );
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

    async verify(userId: number, code: string): Promise<void>{
        const otp = await this.otpRepository.findOne({
            where: { user_id: userId, is_used: false },
            order: { id: 'DESC' },
        });

        if(!otp){
            throw new BadRequestException('ไม่พบรหัสยืนยันที่ใช้งานได้ กรุณาขอรหัสใหม่');
        }

        if(otp.expires_at < new Date()){
            throw new BadRequestException('รหัสยืนยันหมดอายุแล้ว กรุณาขอรหัสใหม่');
        }

        if(otp.attempts >= 5){
            throw new BadRequestException('กรอกรหัสผิดเกินกำหนด กรุณาขอรหัสใหม่');
        }

        if (otp.otp_code !== code){
            otp.attempts = otp.attempts + 1;
            await this.otpRepository.save(otp);
            throw new BadRequestException(`รหัสยืนยันไม่ถูกต้อง เหลืออีก ${5 - otp.attempts} ครั้ง`);
        }
        otp.is_used = true;
        await this.otpRepository.save(otp);
    }
}
