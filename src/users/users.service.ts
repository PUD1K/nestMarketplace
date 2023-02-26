import { Injectable, HttpStatus, HttpException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BasketService } from 'src/basket/basket.service';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService,
               @Inject(forwardRef(() => BasketService)) private basketService: BasketService) {}

    async createUser(dto: CreateUserDto){
        const user = await this.userRepository.create(dto);
        const basket = await this.basketService.create({userId: user.id});
        const role = await this.roleService.getRoleByValue("ADMIN");
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return user;
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByEmail(email: string){
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    async addRole(dto: AddRoleDto){
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        const roleExist = await user.$count('roles');
        if(user && role){
            await user.$add('roles', role.id);
            return dto;
        }
        throw new HttpException('Пользователь не найден', HttpStatus.FORBIDDEN);
    }
}
