import { Controller, Post, Body, Get, UseGuards, UsePipes, Param} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { UpdateUserInfoDto } from './dto/update-userInfo.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: 'Изменить данные пользователя по username'})
    @ApiResponse({status: 200, type: User})
    // @Roles('ADMIN')
    // @UseGuards(RolesGuard)
    @Post('/update_data')
    updateDataByUsername(@Body() dto: UpdateUserInfoDto){
        return this.userService.updateUserDataByUsername(dto);
    }

    @ApiOperation({summary: 'Получение списка пользователей'})
    @ApiResponse({status: 200, type: [User]})
    // @Roles('ADMIN')
    // @UseGuards(RolesGuard)
    @Get()
    getAll(){
        return this.userService.getAllUsers();
    }

    @ApiOperation({summary: 'Получить пользователя по username'})
    @ApiResponse({status: 200, type: User})
    // @Roles('ADMIN')
    // @UseGuards(RolesGuard)
    @Get('/:username')
    getByEmail(@Param('username') username: string){
        return this.userService.getUserByUsername(username);
    }

    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto){
        return this.userService.addRole(dto);
    }
}
