var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemLog } from './entities/system-log.entity.js';
let SystemLogsService = class SystemLogsService {
    SystemLogRepository;
    constructor(SystemLogRepository) {
        this.SystemLogRepository = SystemLogRepository;
    }
    async record(params) {
        const log = this.SystemLogRepository.create({
            action: params.action,
            actor_user_id: params.actor_user_id,
            target_user_id: params.target_user_id ?? null,
            detail: params.detail ?? null,
        });
        await this.SystemLogRepository.save(log);
    }
};
SystemLogsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(SystemLog)),
    __metadata("design:paramtypes", [Repository])
], SystemLogsService);
export { SystemLogsService };
//# sourceMappingURL=system-logs.service.js.map