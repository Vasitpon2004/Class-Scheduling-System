import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { RejectProfessorDto } from './dto/reject-professor.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/jwt-user.interface.js';
import { UserRole } from './enums/user-role.enum.js';

//UserController ทำหน้าที่ในการรับและส่งข้อมูลที่เกี่ยวกับผู้ใช้งานทั้งหมดในระบบ
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @ApiBearerAuth()//บอกระบบ Swagger ว่า API เส้นนี้ต้องส่ง JWT Token มาด้วย
    @Roles([UserRole.ADMIN])//เฉพาะADMINเท่านั้น
    @UseGuards(JwtAuthGuard, RolesGuard)//กรองความปลอดภัย 2 ชั้น ชั้นแรกเช็คว่า login หรือยัง ชั้นสองเช็คว่าบทบาทตรงตามที่ระบุไหม
    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Post()//ใช้รับข้อมูลเข้ามาในระบบ
    //ประกาศfunction create โดยดึงข้อมูลจากหน้าบ้านส่งมาที่ @Body แล้วเก็บไว้ใน dto 
    create(@Body() dto: CreateUserDto){
        //ส่งข้อมูล dto ไปประมวลผลการสร้างสมาชิกใหม่ในfunction create() ของ UsersService
        return this.userService.create(dto);
    }

    @ApiBearerAuth()
    @Roles([UserRole.ADMIN])//กำหนดให้ADMINเท่านั้นที่มีสิทธิ์กดอนุมัติอาจารย์ได้
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/approve')
    @HttpCode(HttpStatus.OK)//สั่งให้เปลี่ยนการตอบกลับจาก 201 เป็น 200 แทน
    approveProfessor(
        @Param('id', ParseIntPipe) id: number,//ดึงค่า id จาก url ผ่าน @Param และบังคับส่งผ่าน ParseIntPipe เพื่อเปลี่ยนประเภทข้อมูลจาก string ให้เป็น number เพื่อนำไปเก็บในตัวแปร id
        @CurrentUser() user: JwtUser,//ใช้คำสั่งพิเศษดึงโปรไฟล์ของผู้ใช้งาน(แอดมิน)มาเก็บไว้ในตัวแปร user
    ){
        //ส่งข้อมูลไอดีอาจารย์และไอดีของแอดมินคนกระทำไปให้ function approveProfessor() ใน UsersService เพื่อปรับสถานะ
        return this.userService.approveProfessor(id, user.userId);
    }

    @ApiBearerAuth()
    @Roles([UserRole.ADMIN])//กำหนดให้ADMINเท่านั้นที่มีสิทธิ์กดปฎิเสธอาจารย์ได้
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':id/reject')
    @HttpCode(HttpStatus.OK)
    rejectProfessor(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RejectProfessorDto,//แกะข้อมูลreasonที่ปฎิเสธจากข้อความที่ADMINกรอกไว้มาเก็บไว้ที่ dto
        @CurrentUser() user: JwtUser,//ดึงข้อมูลของแอดมินที่กดปฎิเสธมาเก็บไว้ใน user
    ){
        //นำไอดีผู้สมัคร(อาจารย์), ไอดีแอดมิน, ข้อความเหตุผลการปฎิเสธ ส่งไปประมวลผล ลบและบันทึกประวัติการปฎิเสธใน UsersService  
        return this.userService.rejectProfessor(id, user.userId, dto.reason)
    }
}