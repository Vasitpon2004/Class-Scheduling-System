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
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FacultiesService } from './faculties.service.js';
let FacultiesController = class FacultiesController {
    facultiesService;
    constructor(facultiesService) {
        this.facultiesService = facultiesService;
    }
    findAll() {
        return this.facultiesService.findAll();
    }
    findOne(id) {
        return this.facultiesService.findOne(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FacultiesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FacultiesController.prototype, "findOne", null);
FacultiesController = __decorate([
    Controller('faculties'),
    __metadata("design:paramtypes", [FacultiesService])
], FacultiesController);
export { FacultiesController };
//# sourceMappingURL=faculties.controller.js.map