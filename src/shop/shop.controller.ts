import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {

    constructor(private shopService: ShopService) {}

    @ApiOperation({summary: 'Создание магазина'})
    @ApiResponse({status: 200, type: Shop})
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: CreateShopDto,
            @UploadedFile() image){
        return this.shopService.createShop(dto, image);
    }

    @ApiOperation({summary: 'Поиск магазина по slug'})
    @ApiResponse({status: 200, type: Shop})
    @Get('/by_slug/:slug')
    getByName(@Param('slug') slug: string){
        return this.shopService.getShopBySlug(slug);
    }

    @ApiOperation({summary: 'Получение всех магазинов'})
    @ApiResponse({status: 200, type: Shop})
    @Get('')
    getAllShops(){
        return this.shopService.getAllShops();
    }
}
