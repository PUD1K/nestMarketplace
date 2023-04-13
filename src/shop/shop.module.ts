import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryShop } from 'src/categories/categories-shop.model';
import { Category } from 'src/categories/categories.model';
import { CategoriesModule } from 'src/categories/categories.module';
import { FilesModule } from 'src/files/files.module';
import { ShopController } from './shop.controller';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [
    SequelizeModule.forFeature([Shop, Category, CategoryShop, User]),
    FilesModule,
    forwardRef(() => UsersModule)
  ],
  exports:[
    ShopService
  ]
})
export class ShopModule {}
