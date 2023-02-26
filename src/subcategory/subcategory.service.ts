import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoriesService } from 'src/categories/categories.service';
import { FilesService } from 'src/files/files.service';
import { translit } from 'src/middleware/translit';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { SubCategory } from './subcategory.model';

@Injectable()
export class SubcategoryService {
    
    constructor(@InjectModel(SubCategory) private subcategoryRepository: typeof SubCategory,
                private categoryService: CategoriesService,
                private fileService: FilesService) {}

    async createSubcategory(dto: CreateSubcategoryDto, image: any){
        const candidate = await this.getSubcategoryByName(dto.name);
        if(!candidate){
            const category = await this.categoryService.getCategoryByName(String(dto.categoryName));
            delete dto['categoryName'];
            const fileName = await this.fileService.createFile(image);
            const subcategory = await this.subcategoryRepository.create({...dto, slug: translit(dto.name), image: fileName, categoryId: Number(category.id)});
            return subcategory;
        }
        throw new HttpException('Такая подкатегория уже существует', HttpStatus.FORBIDDEN);
    }

    async getSubcategoryByName(name: string){
        const subcategory = await this.subcategoryRepository.findOne({where: {name}});
        return subcategory;
    }

    async getSubcategoryBySlug(slug: string){
        const subcategory = await this.subcategoryRepository.findOne({where: {slug}, include: {all: true}});
        return subcategory;
    }
}
