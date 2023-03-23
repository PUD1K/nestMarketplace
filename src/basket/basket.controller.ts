import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasketProduct } from './basket-product.model';
import { BasketService } from './basket.service';
import { ClearBasketDto } from './dto/clear-basket.dto';

@Controller('basket')
export class BasketController {

    constructor(private basketSerivce: BasketService){}

    @ApiOperation({summary: 'Получение корзины'})
    @ApiResponse({status: 200, type: BasketProduct})
    @Get('/:username')
    getBasketByEmail(@Param('username') username: string){
        return this.basketSerivce.getBasketInfoByUsername(username);
    }

    @ApiOperation({summary: 'Получение количества товаров в корзине'})
    @ApiResponse({status: 200, type: Number})
    @Get('/count/:email')
    getCountProductsInBasket(@Param('email') email: string){
        return this.basketSerivce.getBasketCount(email);
    }

    
    @ApiOperation({summary: 'Получение количества товаров в корзине'})
    @ApiResponse({status: 200, type: Number})
    @Post('/clear')
    clearBasket(@Body() dto: ClearBasketDto){
        return this.basketSerivce.clearBasket(dto);
    }
}
