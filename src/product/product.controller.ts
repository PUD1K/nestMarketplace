import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { Body, UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createProduct(@Body() dto: CreateProductDto,
                  @UploadedFile() image){
        return this.productService.create(dto, image);
    }
}

