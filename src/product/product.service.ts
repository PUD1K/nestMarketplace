import { Injectable } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
    
    constructor(@InjectModel(Product) private productRepository: typeof Product,
                private fileService: FilesService) {}

    async create(dto: CreateProductDto, image: any){
        const fileName = await this.fileService.createFile(image);
        const product = await this.productRepository.create({...dto, image: fileName});
        return product;
    }
}
