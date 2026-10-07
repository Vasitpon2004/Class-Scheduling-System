import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Major } from '../faculties/entities/major.entity.js';
import { OtpModule } from '../otp/otp.module.js';
import { SystemLogsModule } from '../system-logs/system-logs.module.js';

@Module({
  //เพื่อให้ UsersService สามารถดึงข้อมูลเข้า-ออก หรือ query ข้อมูลออกจาก db User/Major ได้
  imports: [TypeOrmModule.forFeature([User, Major]),
  OtpModule, //เพื่อให้ UsersModule สามารถเรียกใช้งาน OTP ได้
  SystemLogsModule, //เพื่อให้ UsersModule สามารถเรียกใช้งาน Log ได้
  ],
  providers: [UsersService], //เพื่อเรียกใช้งานใน Controller หรือ แชร์ให้Moduleอื่นได้
  controllers: [UsersController], //ทำหน้าทีเป็น Rounting คอยรับ Request จากหน้าบ้านแล้วส่งให้ UsersService ทำงานต่อ
  exports: [UsersService], //เพื่อให้moduleอื่นสามารถ import ไปใช้งานได้
})
export class UsersModule {}
