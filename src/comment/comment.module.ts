import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Product } from 'src/product/product.model';
import { UsersModule } from 'src/users/users.module';
import { Comment } from './comment.model';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [
    SequelizeModule.forFeature([Comment, Product, User]),
    UsersModule,
    ProductModule,
  ],
  exports:[
    CommentService
  ]
})
export class CommentModule {}
