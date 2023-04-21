import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';
import { BindWithUserDto } from './dto/bind-with-user.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

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

    @ApiOperation({summary: 'Связать магазин с пользователем'})
    @ApiResponse({status: 200, type: Shop})
    @Post('/bind_with_user')
    bindShopWithUser(@Body() dto: BindWithUserDto){
        return this.shopService.bindWithUser(dto);
    }

    @ApiOperation({summary: 'Получить магазин по slug'})
    @ApiResponse({status: 200, type: Shop})
    @Get('/by_slug/:slug')
    getByName(@Param('slug') slug: string){
        return this.shopService.getShopBySlug(slug);
    }

    @ApiOperation({summary: 'Связать магазин с пользователем'})
    @ApiResponse({status: 200, type: Shop})
    @Post('/search_manager')
    searchManager(@Body() dto: BindWithUserDto){
        return this.shopService.searchManager(dto);
    }

    @ApiOperation({summary: 'Получение всех магазинов'})
    @ApiResponse({status: 200, type: Shop})
    @Get('')
    getAllShops(){
        return this.shopService.getAllShops();
    }

    @ApiOperation({summary: 'Обновление магазина'})
    @ApiResponse({status: 200, type: Shop})
    @Put()
    @UseInterceptors(FileInterceptor('image'))
    updateShop(@Body() dto: UpdateShopDto,
                @UploadedFile() image){
        return this.shopService.updateShop(dto, image);
    }
}
