import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';
import { Comment } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {

    constructor(@InjectModel(Comment) private commentRepository: typeof Comment,
                private userService: UsersService,
                private productService: ProductService) {}

    async createComment(dto: CreateCommentDto){
        const user = await this.userService.getUserByUsername(dto.username);
        const product = await this.productService.getProductByArticle(dto.productArticle);
        const comment = await this.commentRepository.create({
            dignites: dto.dignites, 
            disadvantages: dto.disadvantages, 
            comment: dto.comment, 
            score: dto.score, 
            productId: product.id, 
            userId: user.id, 
        })

        const commentsCount = product.comments.length + 1;
        const totalRating = product.comments.reduce((acc, comm) => Number(acc) + Number(comm.score), Number(comment.score)) / commentsCount;
        
        product.totalRating = Number(totalRating.toFixed(2));
        product.commentsCount = commentsCount;
        product.save();

        console.log(totalRating);
        console.log(commentsCount)
        console.log(comment.score)

        console.log(product.totalRating);
        console.log(product.commentsCount)

        return comment;
    }
}
