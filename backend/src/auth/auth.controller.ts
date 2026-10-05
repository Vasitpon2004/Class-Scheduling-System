import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }

    // ใช้สำหรับตรวจสอบรหัส OTP 
    @Post('verify-otp')
    @HttpCode(HttpStatus.OK) // ตั้งค่าระบบว่า ถ้าทำสำเร็จให้ส่ง HTTP Status กลับไปเป็น 200 OK เพราะปกติ Nest จะส่ง 201 
    verifyOtp(@Body() dto: VerifyOtpDto){
        return this.authService.verifyOtp(dto); // ส่งข้อมูลไปให้ Function verifyOtp เพื่อนำไปประมวลผลต่อแล้วค่อยส่งผลลัพธ์ไปให้ผู้ใช้งานคนนั้น
    }

    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    resendOtp(@Body() dto: ResendOtpDto){
        return this.authService.resendOtp(dto);
    }
}
