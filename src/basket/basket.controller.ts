import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasketProduct } from './basket-product.model';
import { BasketService } from './basket.service';

@Controller('basket')
export class BasketController {

    constructor(private basketSerivce: BasketService){}

    @ApiOperation({summary: 'Получение корзины'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Get('/:email')
    getBasketByEmail(@Param('email') email: string){
        return this.basketSerivce.getBasketInfoByEmail(email);
    }

    @ApiOperation({summary: 'Получение количества товаров в корзине'})
    @ApiResponse({status: 200, type: Number})
    @Get('/count/:email')
    getCountProductsInBasket(@Param('email') email: string){
        return this.basketSerivce.getBasketCount(email);
    }
}
