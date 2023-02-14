import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/categories/categories.model';
import { ShopController } from './shop.controller';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [
    SequelizeModule.forFeature([Shop, Category]),
  ],
})
export class ShopModule {}
