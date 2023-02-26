import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryShop } from 'src/categories/categories-shop.model';
import { Category } from 'src/categories/categories.model';
import { CategoriesModule } from 'src/categories/categories.module';
import { FilesModule } from 'src/files/files.module';
import { ShopController } from './shop.controller';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [
    SequelizeModule.forFeature([Shop, Category, CategoryShop]),
    FilesModule
  ],
  exports:[
    ShopService
  ]
})
export class ShopModule {}
