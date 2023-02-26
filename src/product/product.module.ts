import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Basket } from 'src/basket/basket.model';
import { BasketModule } from 'src/basket/basket.module';
import { Category } from 'src/categories/categories.model';
import { FilesModule } from 'src/files/files.module';
import { SubcategoryModule } from 'src/subcategory/subcategory.module';
import { UsersModule } from 'src/users/users.module';
import { ProductController } from './product.controller';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    SequelizeModule.forFeature([Product, Category, Basket]),
    FilesModule,
    SubcategoryModule,
    forwardRef(() => UsersModule),
    // BasketModule,
    forwardRef(() => BasketModule)
  ],
  exports: [
    ProductService
  ]
})
export class ProductModule {}
