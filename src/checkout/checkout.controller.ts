import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Checkout } from './checkout.model';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('checkout')
export class CheckoutController {

    constructor(private checkoutService: CheckoutService){}

    @ApiOperation({summary: 'Создание заказа'})
    @ApiResponse({status: 200, type: Checkout})
    @Post('')
    async createCheckout(@Body() dto: CreateCheckoutDto){
        return this.checkoutService.createCheckout(dto);
    }

    @ApiOperation({summary: 'Получение списка заказов'})
    @ApiResponse({status: 200, type: Checkout})
    @Get('by_slug/:username')
    async getCheckouts(@Param('username') username: string){
        return this.checkoutService.getAllCheckoutInfoTest(username);
    }

    @ApiOperation({summary: 'Получение списка заказов'})
    @ApiResponse({status: 200, type: Checkout})
    @Get('by_shop_slug/:shop')
    async getAll(@Param('shop') shop: string){
        return this.checkoutService.getAllForShop(shop);
    }
}
