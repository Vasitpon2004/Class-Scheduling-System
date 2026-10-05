import { IsEmail, IsString, Matches } from "class-validator";

export class VerifyOtpDto{

    @IsEmail()
    @Matches(/@ku\.th$/, { message: 'ต้องเป็นอีเมล @ku.th เท่านั้น' })
    email: string;

    @IsString()
    @Matches(/^\d{6}$/, { message: 'รหัสยืนยันต้องเป็นตัวเลข 6 หลัก' })
    otp_code: string;
}