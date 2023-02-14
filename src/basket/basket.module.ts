import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/product/product.model';
import { User } from 'src/users/users.model';
import { BasketProduct } from './basket-product.model';
import { BasketController } from './basket.controller';
import { Basket } from './basket.model';
import { BasketService } from './basket.service';

@Module({
  controllers: [BasketController],
  providers: [BasketService],
  imports: [
    SequelizeModule.forFeature([User, Basket, Product, BasketProduct]),
  ],
})
export class BasketModule {}
