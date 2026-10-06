import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLog } from './entities/system-log.entity.js';
import { SystemLogsService } from './system-logs.service.js';

@Module({
  //บอกให้รู้ว่าโมดูลนี้ใช้ system_logs เพื่อให้ใช้งานได้
  imports: [TypeOrmModule.forFeature([SystemLog])],
  //ทำให้สามารถใช้งานข้อมูลในคลาสอื่น ๆ ที่อยู่ภายในโมดูลนี้
  providers: [SystemLogsService],
  exports: [SystemLogsService],//สามารถให้โมดูลอื่นที่ import ไปสามารถยืมไปใช้งานได้
})
export class SystemLogsModule {}
