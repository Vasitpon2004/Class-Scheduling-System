var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsInt, IsOptional, MaxLength, MinLength, Min, Max, Matches, } from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum.js';
import { StudyPlan } from '../../users/enums/study-plan.enum.js';
export class CreateUserDto {
    first_name;
    last_name;
    user_code;
    email;
    password;
    role;
    major_id;
    year;
    study_plan;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "first_name", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "last_name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(20),
    __metadata("design:type", String)
], CreateUserDto.prototype, "user_code", void 0);
__decorate([
    IsEmail(),
    Matches(/@ku\.th$/, { message: 'ต้องเป็นอีเมล @ku.th เท่านั้น' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    IsString(),
    MinLength(8, { message: 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    IsEnum(UserRole),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "major_id", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(8),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "year", void 0);
__decorate([
    IsOptional(),
    IsEnum(StudyPlan),
    __metadata("design:type", String)
], CreateUserDto.prototype, "study_plan", void 0);
//# sourceMappingURL=create-user.dto.js.map