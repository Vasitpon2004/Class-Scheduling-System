import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { Major } from '../faculties/entities/major.entity.js';
import { Logger } from '@nestjs/common';
import { OtpService } from '../otp/otp.service.js';
import { SystemLogsService } from '../system-logs/system-logs.service.js';
import { LogAction } from '../system-logs/enums/log-action.enum.js';

@Injectable()
export class UsersService {
    //ประกาษตัวแปรสำหรับบันทึก Log โดยใช้ Logger ซึ่งสามารถใช้ได้ภายในคลาส UsersService เท่านั้น
    //readonly คือทำให้ไม่สามารถเขียนทับหรือเปลี่ยนค่าได้
    private readonly logger = new Logger(UsersService.name);
    //เป็นตัวเชื่อมต่อระบบ ใช้รับเครื่องมือเข้ามาใช้งานในคลาส
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Major)
        private majorRepository: Repository<Major>,
        private readonly otpService: OtpService,
        private readonly systemLogsService: SystemLogsService,
    ){}

    //Function สำหรับดึงข้อมูลผู้ใช้งานทั้งหมดใน DB
    async findAll() {
        return this.userRepository.find();
    }

    //Function สมัครสมาชิกของระบบ
    async create(dto: CreateUserDto){
        //เช็คว่าสมัครใน Role Admin หรือไม่
        if (dto.role === UserRole.ADMIN){
            throw new BadRequestException('ไม่สามารถสมัครด้วยบทบาทแอดมินได้')
        }
        //เช็คว่าผู้สมัครเลือก Role อื่นที่ไม่ใช่นิสิตหรือไม่
        if (dto.role !== UserRole.NISIT && (dto.year !== undefined || dto.study_plan !== undefined)){
            throw new BadRequestException('เฉพาะนิสิตเท่านั้นที่ระบุชั้นปีและแผนการเรียนได้')
        }
        //ตรวจสอบformatข้อมูล user_code ของอาจารย์
        if(dto.role === UserRole.PROFESSOR){
            //นำรหัสที่ได้ไปทำให้เป็นตัวพิมพ์ใหญ่
            dto.user_code = dto.user_code!.toUpperCase();
            //ใช้ตรวจสอบรูปแบบตัวอักษร
            //^[A-Z] = ต้องขึ้นต้นด้วยตัวอักษรพิมพ์ใหญ่1ตัว
            //\d{4}$ = ต้องตามด้วยตัวเลข 4 ตัว 0-9 ได้
            //.test(...) = คืนค่า true หากตรง format
            //แต่ใน if นี้มี ! อยู่หน้านั่นหมายถึงว่า หากเช็คแล้วไม่ตรง format จะให้เขา if นี้
            if(!/^[A-Z]\d{4}$/.test(dto.user_code)){
                throw new BadRequestException(
                    'รหัสประจำตัวอาจารย์ต้องเป็นตัวอักษรภาษาอังกฤษ 1 ตัว ตามด้วยตัวเลข 4 หลัก เช่น Q1234',
                );
            }
        }
        //เช็คสาขาว่ามีจริงหรือไม่ หากระบุรหัสสาขามาระบบจะไปค้นหาในตาราง Major เพื่อเช็คว่ามีจริงหรือไม่
        if (dto.major_id !== undefined) {
            const major = await this.majorRepository.findOne({ where: { id: dto.major_id } });
            if (!major) throw new BadRequestException('ไม่พบสาขาวิชาที่ระบุ');
        }
        //ใช้ตรวจสอบอีเมลซ้ำ โดยระบบจะค้นหาตาราง User ว่ามีอีเมลนี้แล้วหรือยัง ถ้ามีจะไม่สามารถสมัครได้
        const existing = await this.userRepository.findOne({
            where: { email: dto.email },
        });
        if (existing) throw new ConflictException('อีเมลนี้ถูกใช้แล้ว');

        //การนำรหัสผ่านมาทำการ hash ด้วย bcrypt
        const hash = await bcrypt.hash(dto.password, 10);

        //การเตรียมข้อมูลก่อนบันทึกลง DB
        const user = this.userRepository.create({
            first_name: dto.first_name, //นำข้อมูลที่ผู้ใช้กรอกจากหน้าบ้านเข้ามาใน dto แล้วนำไปเก็บใน DB
            last_name: dto.last_name,
            email: dto.email,
            password_hash: hash,
            role: dto.role,
            is_approved: dto.role === UserRole.NISIT, //นำข้อมูลที่ผู้ใช้กรอกจากหน้าบ้านมาทำเหมือนเดิม แต่จะเช็ค role ก่อน ถ้าเป็นนิสิตจะให้ค่า is_approved เป็น true แต่ถ้าเป็นอาจารย์จะเป็น false
            year: dto.year ?? null, //นำชั้นปีจากที่ผู้ใช้กรอกจากหน้าบ้านมา โดยจะเช็คก่อนถ้าหน้าบ้านไม่ได้ส่งค่าชั้นปีมาจะให้ใส่ค่า null แทน
            study_plan: dto.study_plan ?? null,
            user_code: dto.user_code ?? null,
            major: dto.major_id ? { id: dto.major_id } : null, //นำข้อมูล major_id ที่ผู้ใช้กรอกมาจากหน้าบ้านนำไปเช็คกับ DB แล้วดึงมา แต่ถ้าไม่มีการส่งรหัสมาจะใส่ค่า null แทน
        });

        const saved = await this.userRepository.save(user);

        //ใช้ในการเจนรหัส OTP เพื่อให้ผู้ใช้คนนี้ไปยืนยันตัวตน
        try{
            await this.otpService.createForUser(saved.id);
        } catch (error) {
            this.logger.error('สร้าง OTP ไม่สำเร็จ สำหรับผู้ใช้งาน ' + saved.id , error);
        }

        //เป็นการซ่อนรหัสผ่าน โดยจะแยก password_hash ออกมาและเก็บส่วนที่เหลือไว้ในตัวแปร result เช่น ID, ชื่อ,นามสกุล, อีเมล ฯลฯ
        const { password_hash, ...result } = saved;
        return result;
    }
    //Function สำหรับค้นหาข้อมูลผู้ใช้งานด้วยอีเมล โดยให้ดึงรหัสผ่านที่เข้ารหัสแล้วมาจาก DB
    async findByEmailWithPassword(email: string){
        //คืนค่าผลลัพธ์ที่ได้
        return this.userRepository
        .createQueryBuilder('user')//ใช้งานQuery โดยกำหนดให้ตั้งชื่อย่อของ users เป็น user เพื่อไว้ใช้อ้างอิง
        .addSelect('user.password_hash')//เลือกดึงข้อมูล password_hash ออกมาด้วย
        .where('user.email = :email', { email })//ให้ไปค้นหาที่column email 
        .getOne();//จะส่งผลลัพธ์กลับมาเพียง 1 รายการเท่านั้น
    }

    //Function สำหรับค้นหาผู้ใช้จากอีเมล โดยไม่เอารหัสผ่านมาด้วย
    async findByEmail(email: string){
        return this.userRepository.findOne({ where: { email } });
    }

    //Function สำหรับอัปเดตสถานะ is_email_verified ให้กลายเป็น true
    async markEmailVerified(userId: number): Promise<void>{
        await this.userRepository.update(userId, { is_email_verified: true });
    }

    //Function สำหรับค้นหาข้อมูลผู้ใช้จาก DB ด้วย ID โดยระบุดึงข้อมูลของ major ที่พ่วงกันมาด้วย
    async findById(id: number) {
        return this.userRepository.findOne({
            where: { id }, //ค้นจาก Row ที่มี Column id ตรงกับค่า id ที่ส่งเข้ามาใน function
            relations: { major: { faculty: true } }, //ดึงข้อมูล major/faculty ออกมาพร้อมกันด้วย
        });
    }

    //Function สำหรับอนุมัติบัญชีผู้ใช้งานที่เป็นอาจารย์
    //ประกาศ Function approveProfessor ที่รับ id,actorUserId และกำหนดให้คืนค่ากลับไปเป็น Obj ที่มีโครงสร้างเป็นตาราง
    async approveProfessor(id: number, actorUserId: number): Promise<{ message: string }> {
        //ใช้หา user โดยจะหาที่แถวที่มี id ตรงกับ id ที่ส่งเข้ามาแล้วนำข้อมูลทั้งหมดเก็บใน user
        const user = await this.userRepository.findOne({ where: { id } });

        //กรณีไม่เจอผู้ใช้งาน
        if(!user){
            throw new NotFoundException('ไม่พบผู้ใช้งานที่ระบุ');
        }
        //กรณีผู้ใช้คนนั้นไม่ใช่อาจารย์
        if(user.role !== UserRole.PROFESSOR){
            throw new BadRequestException('ผู้ใช้งานนี้ไม่ใช่อาจารย์ จึงไม่ต้องอนุมัติ');
        }
        //กรณีเช็คเงื่อนไขว่าอาจารย์คนนี้ได้รับการอนุมัติไปแล้วหรือยัง
        if(user.is_approved){
            throw new BadRequestException('บัญชีนี้ได้รับการอนุมัติไปแล้ว');
        }

        //บันทึกข้อมูลกิจกรรมไปที่ log
        await this.systemLogsService.record({
            action: LogAction.APPROVE_PROFESSOR,
            actor_user_id: actorUserId, //บันทึก id แอดมินที่เป็นคนกด
            target_user_id: id, //บันทึก id ของอาจารย์ที่ถูกกระทำ
            detail: `อนุมัติอาจารย์ ${user.email} (${user.first_name} ${user.last_name})`,
        });

        //update ข้อมูลลง db
        await this.userRepository.update(id, { is_approved: true });
        return { message: `อนุมัติบัญชีอาจารย์ ${user.email} เรียบร้อยแล้ว` };
    }

    //Function สำหรับปฎิเสธคำขอสมัครสมาชิกของอาจารย์
    async rejectProfessor(id: number, actorUserId: number,reason: string): Promise<{ message: string }>{
        const user = await this.userRepository.findOne({ where: { id } });

        if(!user){
            throw new NotFoundException('ไม่พบผู้ใช้งานที่ระบุ');
        }
        if(user.role !== UserRole.PROFESSOR){
            throw new BadRequestException('ผู้ใช้งานนี้ไม่ใช่อาจารย์ จึงไม่มีคำขอให้ปฏิเสธ');
        }
        if(user.is_approved){
            throw new BadRequestException('บัญชีนี้ได้รับการอนุมัติไปแล้ว ไม่สามารถปฏิเสธได้');
        }

        //เรียกใช้งาน systemLogsService เพื่อบันทึกกิจกรรมลง DB
        await this.systemLogsService.record({
            action: LogAction.REJECT_PROFESSOR, //ระบุประเภทกิจกรรมว่าเป็นการปฏิเสธคำขออาจารย์
            actor_user_id: actorUserId,//บันทึกไอดีของแอดมินที่เป็นคนกดปฏิเสธ
            target_user_id: null,//ใส่ค่าเป็น null เพราะ target_user_id กำลังจะถูกลบ จึงไม่ผูก FK ของ target ไว้เพื่อป้องกันไม่ให้เกิด error
            detail: `ปฏิเสธคำขอ ${user.email} (${user.first_name} ${user.last_name}) เหตุผล: ${reason}`,
        });

        //สั่งลบข้อมูลของผู้ใช้งาน id นี้ออกจาก User ใน DB
        await this.userRepository.delete(id);

        return{ message: `ปฏิเสธคำขอของ ${user.email} และลบบัญชีเรียบร้อยแล้ว` };
    }
}
