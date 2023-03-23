import { Controller } from '@nestjs/common';
import { Delete, Get, Post } from '@nestjs/common/decorators';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { Body, Param, UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasketProduct } from 'src/basket/basket-product.model';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { RemoveFromBasketDto } from './dto/remove-to-basket';
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

    @ApiOperation({summary: 'Получение товара по слагу подкатегории'})
    @ApiResponse({status: 200, type: Product})
    @Get('/by_subcategory/:subcategoryslug')
    getBySubcategorySlug(@Param('subcategoryslug') subcategoryslug: string){
        return this.productService.getProductsBySubcategorySlug(subcategoryslug);
    }

    @ApiOperation({summary: 'Получить все товары'})
    @ApiResponse({status: 200, type: [Product]})
    @Get('')
    getAllProducts(){
        return this.productService.getAllProducts();
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

    @ApiOperation({summary: 'Изменить количество товара'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Post('/set_count_basket_product')
    setCountBasketProduct(@Body() dto: AddToBasketDto){
        return this.productService.setCountProductInBasket(dto);
    }

    @ApiOperation({summary: 'Удаление n-единиц товара из корзины'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Delete('/remove_to_basket')
    removeToBasket(@Body() dto: AddToBasketDto){
        return this.productService.removeToBasket(dto);
    }

    @ApiOperation({summary: 'Удаление товара из корзины'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Post('/remove_from_basket')
    removeFromBasket(@Body() dto: RemoveFromBasketDto){
        return this.productService.removeFromBasket(dto);
    }
}

