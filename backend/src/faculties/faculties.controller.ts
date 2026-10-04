import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FacultiesService } from './faculties.service.js';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facultiesService.findOne(id);
  }
}
