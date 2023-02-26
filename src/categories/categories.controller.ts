import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Category } from './categories.model';
import { CategoriesService } from './categories.service';
import { AddShopDto } from './dto/add-shop.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private categoryService: CategoriesService) {}

    @ApiOperation({summary: 'Создание категории'})
    @ApiResponse({status: 200, type: Category})
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: CreateCategoryDto,
            @UploadedFile() image){
        return this.categoryService.createCategory(dto, image);
    }

    @ApiOperation({summary: 'Связывание категории с магазином'})
    @ApiResponse({status: 200, type: Category})
    @Post('shop')
    addShop(@Body() dto: AddShopDto){
        return this.categoryService.addShop(dto);
    }

    @ApiOperation({summary: 'Получение категории по слагу'})
    @ApiResponse({status: 200, type: Category})
    @Get('/:slug')
    getByName(@Param('slug') slug: string){
        return this.categoryService.getCategoryBySlug(slug);
    }
}
