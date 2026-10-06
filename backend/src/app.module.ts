import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FacultiesModule } from './faculties/faculties.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { OtpModule } from './otp/otp.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SystemLogsModule } from './system-logs/system-logs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      // เป็น Array
      throttlers: [
        { ttl: 60000, limit: 60 },
      ],
    }),
    
    // การตั้งค่า Rate Limiting ระยะเวลา 60 วินาที, จำนวนครั้ง 60 ครั้ง/นาที
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),

    FacultiesModule,

    UsersModule,

    AuthModule,

    OtpModule,

    SystemLogsModule,
  ],
  controllers: [AppController],
  // AppService(Basic Module), APP_GUARD tokenพิเศษ ใช้ผูก guard กับทุก Route, ThrottlerGuard ใช้ตรวจสอบจำนวนครั้งที่ผู้ใช้ส่ง Request
  providers: [AppService, {provide: APP_GUARD, useClass: ThrottlerGuard },],
})
export class AppModule {}
