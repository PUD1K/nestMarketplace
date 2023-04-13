import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './shop.model';
import { translit } from 'src/middleware/translit';
import { UsersService } from 'src/users/users.service';
import { BindWithUserDto } from './dto/bind-with-user.dto';

@Injectable()
export class ShopService {

    constructor(@InjectModel(Shop) private shopRepository: typeof Shop,
                private fileService: FilesService,
                @Inject(forwardRef(() => UsersService)) private userService: UsersService
                ) {}

    async createShop(dto: CreateShopDto, image: any){
        const candidate = await this.getShopByName(dto.name);
        if(!candidate){
            console.log(image)
            const fileName = await this.fileService.createFile(image);
            const shop = await this.shopRepository.create({...dto, slug: translit(dto.name), image: fileName});
            return shop;
        }
        throw new HttpException('Магазин с таким названием уже существует', HttpStatus.FORBIDDEN);
    }

    async getShopByName(name: string){
        const shop = await this.shopRepository.findOne({where: {name}});
        return shop
    }

    async getAllShops(){
        const shop = await this.shopRepository.findAll({include: {all: true}});
        return shop
    }

    async getShopBySlug(slug: string){
        const shop = await this.shopRepository.findOne({where: {slug}, include: {all: true}});
        return shop;
    }

    
    async searchManager(dto: BindWithUserDto){
        const user = await this.userService.getUserByUsername(dto.username);
        const shop = await this.getShopBySlug(dto.shopSlug);
        if(user){
            return user.shopId !== shop.id
        }
        return false
    }

    async bindWithUser(dto: BindWithUserDto){
        const user = await this.userService.getUserByUsername(dto.username);
        const shop = await this.getShopBySlug(dto.shopSlug);
        user.shopId = shop.id;
        user.save()
        return shop;
    }
} 
