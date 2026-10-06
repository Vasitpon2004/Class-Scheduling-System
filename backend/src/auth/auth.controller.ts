import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './current-user.decorator.js';
import type { JwtUser } from './jwt-user.interface.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    // ใช้สำหรับตรวจสอบรหัส OTP 
    @Post('verify-otp')
    @HttpCode(HttpStatus.OK) // ตั้งค่าระบบว่า ถ้าทำสำเร็จให้ส่ง HTTP Status กลับไปเป็น 200 OK เพราะปกติ Nest จะส่ง 201 
    verifyOtp(@Body() dto: VerifyOtpDto){
        return this.authService.verifyOtp(dto); // ส่งข้อมูลไปให้ Function verifyOtp เพื่อนำไปประมวลผลต่อแล้วค่อยส่งผลลัพธ์ไปให้ผู้ใช้งานคนนั้น
    }

    @Throttle({ default: { limit: 1, ttl: 60000 } })
    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    resendOtp(@Body() dto: ResendOtpDto){
        return this.authService.resendOtp(dto);
    }

    //Functionสำหรับดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) //ตรวจสอบสิทธิ์ก่อนเข้าถึง API
    @Get('me')
    //ใช้ดึงข้อมูงผู้ใช้งานผ่านการถอดรหัสจาก JWT มาเก็บไว้ใน user 
    getProjile(@CurrentUser() user: JwtUser){
        //ส่งข้อมูลไปประมวลผลที่ authService เพื่อดึงข้อมูลเต็มจาก DB แล้วส่งกลับมา
        return this.authService.getProfile(user.userId);
    }

}
