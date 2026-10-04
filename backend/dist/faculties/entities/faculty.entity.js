var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Major } from './major.entity.js';
let Faculty = class Faculty {
    id;
    faculty_name;
    majors;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Faculty.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Faculty.prototype, "faculty_name", void 0);
__decorate([
    OneToMany(() => Major, (major) => major.faculty),
    __metadata("design:type", Object)
], Faculty.prototype, "majors", void 0);
Faculty = __decorate([
    Entity('faculties')
], Faculty);
export { Faculty };
//# sourceMappingURL=faculty.entity.js.map