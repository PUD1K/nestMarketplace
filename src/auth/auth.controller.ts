import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { User } from 'src/users/users.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Авторизация и получение токена'})
    @ApiResponse({status: 200, type: User})
    @Post('/login')
    login(@Body() userDto: CreateUserDto){
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: 'Регистрация и получение токена'})
    @ApiResponse({status: 200, type: User})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto){
        return this.authService.registration(userDto);
    }

    @ApiOperation({summary: 'Регистрация и получение токена'})
    @ApiResponse({status: 200, type: User})
    @Post('/update_password')
    update_password(@Body() dto: UpdatePasswordDto){
        return this.authService.updatePassword(dto);
    }
}

