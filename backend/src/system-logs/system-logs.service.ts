import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemLog } from './entities/system-log.entity.js';
import { LogAction } from './enums/log-action.enum.js';

//ใช้สำหรับบันทึกประวัติการใช้งานลง db
@Injectable()
export class SystemLogsService {
    constructor(
        @InjectRepository(SystemLog)
        private systemLogRepository: Repository<SystemLog>
    ){}

    //Function สำหรับบันทึก Log โดยรับพารามิเตอร์เป็น Object
    async record(params: {
        action: LogAction;
        actor_user_id: number | null;
        target_user_id?: number | null;
        detail?: string | null;
    }): Promise<void> {
        //สร้างinstanceของ SystemLog ขึ้นในหน่วยความจำโดยใช้ค่าจาก params ที่ส่งเข้ามา มาจัดสร้าง
        const log = this.systemLogRepository.create({
            action: params.action,
            actor_user_id: params.actor_user_id,
            target_user_id: params.target_user_id ?? null, //ใช้เช็คว่าใน params มีการส่งข้อมูลนี้มาหรือไม่
            detail: params.detail ?? null, //ใช้เช็คว่าใน params มีการส่งข้อมูลนี้มาหรือไม่
        });
        //นำวัตถุ Log ที่สร้างเสร็จบันทึกลง db จริง ๆ แบบ Async โดยจะส่งผลลัพธ์กลับเป็น void
        await this.systemLogRepository.save(log);
    }
}
