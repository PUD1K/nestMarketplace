import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BasketService } from 'src/basket/basket.service';
import { Category } from 'src/categories/categories.model';
import { FilesService } from 'src/files/files.service';
import { Shop } from 'src/shop/shop.model';
import { SubCategory } from 'src/subcategory/subcategory.model';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { UsersService } from 'src/users/users.service';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
    
    constructor(@InjectModel(Product) private productRepository: typeof Product,
                private fileService: FilesService,
                private subcategoryService: SubcategoryService,
                @Inject(forwardRef(() => BasketService)) private basketService: BasketService,
                @Inject(forwardRef(() => UsersService)) private userService: UsersService) {}

    async create(dto: CreateProductDto, image: any){
        const candidate = await this.getProductByArticle(dto.article);
        if(!candidate){
            const fileName = await this.fileService.createFile(image);
            const subCategory = await this.subcategoryService.getSubcategoryByName(dto.subcategoryName);
            delete dto['subcategoryName'];
            const product = await this.productRepository.create({...dto, subCategoryId: Number(subCategory.id),image: fileName});
            return product;
        }
        throw new HttpException('Товар с таким наименованием уже существует', HttpStatus.FORBIDDEN);
    }

    async getProductByPk(pk: number){
        const product = await this.productRepository.findByPk(pk);
        return product;
    }

    async addToBasket(dto: AddToBasketDto){
        const product = await this.getProductByArticle(dto.article);
        const user = await this.userService.getUserByEmail(dto.email);
        const addToBasket = await this.basketService.addToBasket(product.id, user.id, Number(dto.count));
        return addToBasket;
    }

    async removeToBasket(dto: AddToBasketDto){
        const product = await this.getProductByArticle(dto.article);
        const user = await this.userService.getUserByEmail(dto.email);
        const removeToBasket = await this.basketService.removeToBasket(product.id, user.id, Number(dto.count));
        return removeToBasket;
    }


    async getProductByArticle(article: string){
        const product = await this.productRepository.findOne({
            where: {
                article
            }, 
            include: [{
                model: SubCategory,
                include: [{
                    model: Category,
                    include: [{
                        model: Shop
                    }] 
                }]
            }]
        });
        return product;
    }

    async deleteProduct(article: string){
        await this.productRepository.destroy({where: {article}});
        return {message: `Товар с артикулом ${article} успешно удален`}
    }
}

