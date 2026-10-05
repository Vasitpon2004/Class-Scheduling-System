import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from './enums/user-role.enum.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Roles([UserRole.ADMIN])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Post()
    create(@Body() dto: CreateUserDto){
        return this.userService.create(dto);
    }

}