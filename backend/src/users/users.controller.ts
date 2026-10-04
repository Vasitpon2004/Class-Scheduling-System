import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from '../auth/dto/create-user.dto.js';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() dto: CreateUserDto){
        return this.userService.create(dto);
    }
}
