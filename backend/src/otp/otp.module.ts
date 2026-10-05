import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpVerify } from './entities/otp-verify.entity.js';
import { OtpService } from './otp.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([OtpVerify])],
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule{}
