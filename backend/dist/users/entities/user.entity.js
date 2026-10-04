var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, } from 'typeorm';
import { UserRole } from '../enums/user-role.enum.js';
import { StudyPlan } from '../enums/study-plan.enum.js';
import { Major } from '../../faculties/entities/major.entity.js';
let User = class User {
    id;
    first_name;
    last_name;
    user_code;
    email;
    password_hash;
    role;
    major;
    year;
    study_plan;
    is_email_verified;
    is_approved;
    is_active;
    discord_id;
    discord_in_server;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    Column({ type: 'varchar', length: 20, unique: true, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "user_code", void 0);
__decorate([
    Column({ type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, select: false }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    Column({ type: 'enum', enum: UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    ManyToOne(() => Major, { nullable: true }),
    JoinColumn({ name: 'major_id' }),
    __metadata("design:type", Object)
], User.prototype, "major", void 0);
__decorate([
    Column({ type: 'smallint', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "year", void 0);
__decorate([
    Column({ type: 'enum', enum: StudyPlan, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "study_plan", void 0);
__decorate([
    Column({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_email_verified", void 0);
__decorate([
    Column({ type: 'boolean', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_approved", void 0);
__decorate([
    Column({ type: 'boolean', nullable: false, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, unique: true, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "discord_id", void 0);
__decorate([
    Column({ type: 'boolean', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "discord_in_server", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
//# sourceMappingURL=user.entity.js.map