import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity.js';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
  ) {}

  async findAll() {
    return this.facultyRepository.find({
      relations: { majors: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
      relations: { majors: true },
    });
    if (!faculty) {
      throw new NotFoundException(`ไม่พบคณะ id ${id}`);
    }
    return faculty;
  }
}
