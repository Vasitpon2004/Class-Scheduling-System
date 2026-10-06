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
import { LogAction } from '../enums/log-action.enum.js';
let SystemLog = class SystemLog {
    id;
    action;
    actor;
    actor_user_id;
    target_user_id;
    detail;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SystemLog.prototype, "id", void 0);
__decorate([
    Column({ type: 'enum', enum: LogAction }),
    __metadata("design:type", String)
], SystemLog.prototype, "action", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true }),
    JoinColumn({ name: 'actor_user_id' }),
    __metadata("design:type", Object)
], SystemLog.prototype, "actor", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SystemLog.prototype, "actor_user_id", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], SystemLog.prototype, "target_user_id", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SystemLog.prototype, "detail", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SystemLog.prototype, "created_at", void 0);
SystemLog = __decorate([
    Entity('system_logs')
], SystemLog);
export { SystemLog };
//# sourceMappingURL=system-log.entity.js.map