import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { SequelizeMethod } from 'sequelize/types/utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { BasketProduct } from 'src/basket/basket-product.model';
import { CheckoutBasketProduct } from './checkout-basket-product.model';
import { Checkout } from './checkout.model';
import { Product } from 'src/product/product.model';
import { UsersService } from 'src/users/users.service';
import { BasketService } from 'src/basket/basket.service';
import { UsersModule } from 'src/users/users.module';
import { BasketModule } from 'src/basket/basket.module';

@Module({
  providers: [CheckoutService],
  controllers: [CheckoutController],
  imports:[
    SequelizeModule.forFeature([User, BasketProduct, CheckoutBasketProduct, Checkout, Product]),
    UsersModule,
    BasketModule
  ],
  exports: [
    CheckoutService
  ]
})
export class CheckoutModule {}
