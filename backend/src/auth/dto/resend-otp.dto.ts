import { IsEmail, Matches } from "class-validator";

export class ResendOtpDto{
    @IsEmail()
    @Matches(/@ku\.th$/, { message: 'ต้องเป็นอีเมล @ku.th เท่านั้น' })
    email: string;
}