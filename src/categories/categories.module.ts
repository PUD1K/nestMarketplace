import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';
import { Product } from 'src/product/product.model';
import { Shop } from 'src/shop/shop.model';
import { ShopModule } from 'src/shop/shop.module';
import { CategoryShop } from './categories-shop.model';
import { CategoriesController } from './categories.controller';
import { Category } from './categories.model';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Shop, Product, Category, CategoryShop]),
    FilesModule,
    ShopModule
  ],
  exports: [
    CategoriesService
  ]
})
export class CategoriesModule {}
