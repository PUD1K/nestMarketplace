import { Controller } from '@nestjs/common';
import { Delete, Get, Post } from '@nestjs/common/decorators';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { Body, Param, UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasketProduct } from 'src/basket/basket-product.model';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) {}

    @ApiOperation({summary: 'Создание товара'})
    @ApiResponse({status: 200, type: Product})
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createProduct(@Body() dto: CreateProductDto,
                  @UploadedFile() image){
        return this.productService.create(dto, image);
    }

    @ApiOperation({summary: 'Получение товара по артикулу'})
    @ApiResponse({status: 200, type: Product})
    @Get('/:article')
    getByArticle(@Param('article') article: string){
        return this.productService.getProductByArticle(article);
    }

    @ApiOperation({summary: 'Удаление товара по артиклю'})
    @ApiResponse({status: 200, type: Product})
    @Delete('delete/:article')
    deleteByArticle(@Param('article') article: string){
        return this.productService.deleteProduct(article);
    }

    // манипуляции с корзиной
    @ApiOperation({summary: 'Добавление n-единиц товара в корзину'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Post('/add_to_basket')
    addToBasket(@Body() dto: AddToBasketDto){
        return this.productService.addToBasket(dto);
    }

    @ApiOperation({summary: 'Удаление n-единиц товара из корзины'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Delete('/remove_to_basket')
    removeToBasket(@Body() dto: AddToBasketDto){
        return this.productService.removeToBasket(dto);
    }

}

