import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Major } from '../faculties/entities/major.entity.js';
import { OtpModule } from '../otp/otp.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Major]), OtpModule, ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
