import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { JwtUser } from "./jwt-user.interface.js";

//ใช้สำหรับดึงข้อมูลผู้ใช้งานที่ผ่านการ Auth แล้วออกมาจาก Request ของ HTTP
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUser => {
        const request = ctx.switchToHttp().getRequest(); // แปลงบริบทเพื่อดึง HTTP Request ออกมา
        return request.user; // คืนข้อมูลผู้ใช้ออกมา
    }
)