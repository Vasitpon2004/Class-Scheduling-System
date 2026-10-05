var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsString, Matches } from "class-validator";
export class VerifyOtpDto {
    email;
    otp_code;
}
__decorate([
    IsEmail(),
    Matches(/@ku\.th$/, { message: 'ต้องเป็นอีเมล @ku.th เท่านั้น' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    IsString(),
    Matches(/^\d{6}$/, { message: 'รหัสยืนยันต้องเป็นตัวเลข 6 หลัก' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp_code", void 0);
//# sourceMappingURL=verify-otp.dto.js.map