import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Size } from './size.model';
import { SizeService } from './size.service';

@Module({
  providers: [SizeService],
  imports: [
    SequelizeModule.forFeature([Size])
  ],
  exports: [
    SizeService
  ]
})
export class SizeModule {}
