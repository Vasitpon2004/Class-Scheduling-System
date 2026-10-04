import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service.js';
import { FacultiesController } from './faculties.controller.js';
import { Major } from './entities/major.entity.js';
import { Faculty } from './entities/faculty.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, Major])],
  providers: [FacultiesService],
  controllers: [FacultiesController],
})
export class FacultiesModule {}
