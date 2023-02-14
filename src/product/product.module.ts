import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Basket } from 'src/basket/basket.model';
import { Category } from 'src/categories/categories.model';
import { FilesModule } from 'src/files/files.module';
import { ProductController } from './product.controller';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    SequelizeModule.forFeature([Product, Category, Basket]),
    FilesModule,
  ],
})
export class ProductModule {}
