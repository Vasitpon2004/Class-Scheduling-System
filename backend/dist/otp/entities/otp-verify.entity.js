var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
let OtpVerify = class OtpVerify {
    id;
    user;
    user_id;
    otp_code;
    attempts;
    is_used;
    expires_at;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OtpVerify.prototype, "id", void 0);
__decorate([
    ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", Object)
], OtpVerify.prototype, "user", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], OtpVerify.prototype, "user_id", void 0);
__decorate([
    Column({ type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], OtpVerify.prototype, "otp_code", void 0);
__decorate([
    Column({ type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], OtpVerify.prototype, "attempts", void 0);
__decorate([
    Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], OtpVerify.prototype, "is_used", void 0);
__decorate([
    Column({ type: 'timestamp' }),
    __metadata("design:type", Date)
], OtpVerify.prototype, "expires_at", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], OtpVerify.prototype, "created_at", void 0);
OtpVerify = __decorate([
    Entity('otp_verify')
], OtpVerify);
export { OtpVerify };
//# sourceMappingURL=otp-verify.entity.js.map