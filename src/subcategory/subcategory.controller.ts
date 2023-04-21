import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { SubCategory } from './subcategory.model';
import { SubcategoryService } from './subcategory.service';
import { GetSubCategoriesForShop } from './dto/get-subcategories-for-shop.dto';

@Controller('subcategory')
export class SubcategoryController {

    constructor(private subcategoryService: SubcategoryService) {}
    
    @ApiOperation({summary: 'Создание подкатегории'})
    @ApiResponse({status: 200, type: SubCategory})
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: CreateSubcategoryDto,
            @UploadedFile() image){
        return this.subcategoryService.createSubcategory(dto, image);
    }

    @ApiOperation({summary: 'Поиск подкатегории по слагу'})
    @ApiResponse({status: 200, type: SubCategory})
    @Get('/:slug')
    getBySlug(@Param('slug') slug: string){
        return this.subcategoryService.getSubcategoryBySlug(slug);
    }
    
    @ApiOperation({summary: 'Получить все подкатегории по категории'})
    @ApiResponse({status: 200, type: SubCategory})
    @Get('/by_category/:slug')
    getAllSubCategory(@Param('slug') slug: string){
        return this.subcategoryService.getSubcategoryByCategorySlug(slug);
    }

    @ApiOperation({summary: 'Получить все подкатегории которых нет в магазина'})
    @ApiResponse({status: 200, type: SubCategory})
    @Post('/for_shop')
    getSubcategoriesForShop(@Body() dto: GetSubCategoriesForShop){
        return this.subcategoryService.getFreeSubcategoriesForShop(dto);
    }
}
