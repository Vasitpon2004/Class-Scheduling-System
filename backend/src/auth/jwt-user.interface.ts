import { UserRole } from "../users/enums/user-role.enum.js";

//กำหนดโครงสร้างและชนิดข้อมูลของผู้ใช้งานที่ถูกแปลงจาก JWT
export interface JwtUser{
    userId: number; //กำหนดuserId เป็นตัวเลข
    role: UserRole; // กำหนดrole เป็นค่าของ UserRole เช่น นิสิต/อาจารย์/แอดมิน
}