import { IsString, IsNotEmpty, MaxLength } from "class-validator";

//ใช้สำหรับตรวจสอบความถูกต้องที่หน้าบ้านส่งข้อมูลมาเมื่อกดปฎิเสธบัญชีอาจารย์
export class RejectProfessorDto {
    @IsString() //ต้องเป็น string เท่านั้น
    @IsNotEmpty({ message: 'ต้องระบุเหตุผลที่ปฎิเสธ' }) //ห้ามเป็นค่าว่าง
    @MaxLength(500) //ต้องมีความยาวไม่เกิน 500 ตัวอักษร
    reason: string;
}