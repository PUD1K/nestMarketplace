import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './shop.model';
import { translit } from 'src/middleware/translit';

@Injectable()
export class ShopService {

    constructor(@InjectModel(Shop) private shopRepository: typeof Shop,
                private fileService: FilesService) {}

    async createShop(dto: CreateShopDto, image: any){
        const candidate = await this.getShopByName(dto.name);
        if(!candidate){
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

    async getShopBySlug(slug: string){
        const shop = await this.shopRepository.findOne({where: {slug}, include: {all: true}});
        return shop;
    }
} 
