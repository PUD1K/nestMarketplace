import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './shop.model';
import { translit } from 'src/middleware/translit';
import { UsersService } from 'src/users/users.service';
import { BindWithUserDto } from './dto/bind-with-user.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { RolesService } from 'src/roles/roles.service';
import { Category } from 'src/categories/categories.model';
import { SubCategory } from 'src/subcategory/subcategory.model';
import { Product } from 'src/product/product.model';
import { User } from 'src/users/users.model';

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
        const shop = await this.shopRepository.findOne({where: {slug}, 
            include: [{
                model: Category,
                include: [{
                    model: SubCategory
                }],
            }, {
                model: Product,
            }, {
                model: User
            }]
        });
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
        this.userService.addRole({userId: user.id, value: 'MANAGER'})
        user.shopId = shop.id;
        user.save()
        return shop;
    }

    async addShop(dto: BindWithUserDto){
        const user = await this.userService.getUserByUsername(dto.username);
        const shop = await this.getShopBySlug(dto.shopSlug);
        this.userService.addRole({userId: user.id, value: 'MANAGER'})
        user.shopId = shop.id;
        user.save()
        return shop;
    }
    
    async bindWithUserThroughtShop(username: string, shopId: number){
        const user = await this.userService.getUserByUsername(username);
        user.shopId = shopId;
        user.save()
    }

    async updateShop(dto: UpdateShopDto, image: any){
        const shop = await this.getShopBySlug(dto.shopSlug);
        shop.name = dto.name;
        shop.description = dto.description;
        if(image){
            const fileName = await this.fileService.createFile(image);
            shop.image = fileName;
            console.log(shop.image)
        }
        const usernamesArr = JSON.parse(dto.usernamesArr)
        for(const username of usernamesArr){
            await this.bindWithUserThroughtShop(username, shop.id);
        }
        shop.save()
        return shop;
    }
} 
