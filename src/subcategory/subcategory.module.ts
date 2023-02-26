import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/categories/categories.model';
import { CategoriesModule } from 'src/categories/categories.module';
import { FilesModule } from 'src/files/files.module';
import { Product } from 'src/product/product.model';
import { ProductModule } from 'src/product/product.module';
import { SubcategoryController } from './subcategory.controller';
import { SubCategory } from './subcategory.model';
import { SubcategoryService } from './subcategory.service';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  imports: [
    SequelizeModule.forFeature([SubCategory, Product, Category]),
    CategoriesModule,
    FilesModule
  ], 
  exports: [
    SubcategoryService
  ]
})
export class SubcategoryModule {}
