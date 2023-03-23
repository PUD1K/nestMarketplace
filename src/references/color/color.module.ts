import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Color } from './color.model';
import { ColorService } from './color.service';

@Module({
  providers: [ColorService],
  imports: [
    SequelizeModule.forFeature([Color]),
  ],
  exports: [
    ColorService
  ]
})
export class ColorModule {}
