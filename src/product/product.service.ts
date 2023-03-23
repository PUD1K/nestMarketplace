import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BasketService } from 'src/basket/basket.service';
import { Category } from 'src/categories/categories.model';
import { FilesService } from 'src/files/files.service';
import { Color } from 'src/references/color/color.model';
import { ColorService } from 'src/references/color/color.service';
import { Size } from 'src/references/size/size.model';
import { SizeService } from 'src/references/size/size.service';
import { Shop } from 'src/shop/shop.model';
import { SubCategory } from 'src/subcategory/subcategory.model';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { UsersService } from 'src/users/users.service';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { RemoveFromBasketDto } from './dto/remove-to-basket';
import { Product } from './product.model';

@Injectable()
export class ProductService {
    
    constructor(@InjectModel(Product) private productRepository: typeof Product,
                private colorService: ColorService,
                private sizeService: SizeService,  
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
        throw new HttpException('Товар с таким артикулом уже существует', HttpStatus.FORBIDDEN);
    }

    async getProductByPk(pk: number){
        const product = await this.productRepository.findByPk(pk, {include: [{model: SubCategory}, {model: Shop}]});
        return product;
    }

    async getProductsBySubcategorySlug(subCategorySlug: string){
        const subcategory = await this.subcategoryService.getSubcategoryBySlug(subCategorySlug);
        if(subcategory){
            const products = await this.productRepository.findAll({where: {subCategoryId: subcategory.id}, include: {all: true}});
            return products;
        }
        throw new HttpException('Товары в этой подкатегории отсутствуют', HttpStatus.FORBIDDEN);
    }

    async getAllProducts(){
        const product = await this.productRepository.findAll({
            include: [{
                model: SubCategory,
                include: [{
                    model: Category,
                    include: [{
                        model: Shop
                    }] 
                }]
            }, {
                model: Shop
            }]
        });
        return product;
    }

    async addToBasket(dto: AddToBasketDto){
        const product = await this.getProductByArticle(dto.article);
        const user = await this.userService.getUserByUsername(dto.username);
        const color = await this.colorService.getColor(dto.color);
        const size =  await this.sizeService.getSize(dto.size);
        const addToBasket = await this.basketService.addToBasket(product.id, user.id, Number(dto.count), size.id, color.id);
        return addToBasket;
    }

    async setCountProductInBasket(dto: AddToBasketDto){
        const product = await this.getProductByArticle(dto.article);
        const user = await this.userService.getUserByUsername(dto.username);
        const color = await this.colorService.getColor(dto.color);
        const size =  await this.sizeService.getSize(dto.size);
        const setCountProductInBasket = await this.basketService.setCount(product.id, user.id, Number(dto.count), size.id, color.id);
        return setCountProductInBasket;
    }

    async removeToBasket(dto: AddToBasketDto){
        const product = await this.getProductByArticle(dto.article);
        const user = await this.userService.getUserByUsername(dto.username);
        const removeToBasket = await this.basketService.removeToBasket(product.id, user.id, Number(dto.count));
        return removeToBasket;
    }

    async removeFromBasket(dto: RemoveFromBasketDto){
        const product = await this.getProductByArticle(dto.article);
        const user = await this.userService.getUserByUsername(dto.username);
        const color = await this.colorService.getColor(dto.color);
        const size =  await this.sizeService.getSize(dto.size);
        const removeToBasket = await this.basketService.removeFromBasket(product.id, user.id, size.id, color.id);
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
            },{
                model: Shop
            }]
        });
        return product;
    }

    async deleteProduct(article: string){
        await this.productRepository.destroy({where: {article}});
        return {message: `Товар с артикулом ${article} успешно удален`}
    }
}

