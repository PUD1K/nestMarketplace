import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {

    constructor(private commentService: CommentService) {}

    @ApiOperation({summary: 'Создание товара'})
    @ApiResponse({status: 200, type: Comment})
    @Post()
    createProduct(@Body() dto: CreateCommentDto){
        return this.commentService.createComment(dto);
    }
}
