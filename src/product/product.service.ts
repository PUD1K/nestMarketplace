import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Order } from 'sequelize';
import { BasketService } from 'src/basket/basket.service';
import { Category } from 'src/categories/categories.model';
import { Comment } from 'src/comment/comment.model';
import { FilesService } from 'src/files/files.service';
import { Color } from 'src/references/color/color.model';
import { ColorService } from 'src/references/color/color.service';
import { Size } from 'src/references/size/size.model';
import { SizeService } from 'src/references/size/size.service';
import { Shop } from 'src/shop/shop.model';
import { SubCategory } from 'src/subcategory/subcategory.model';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { RemoveFromBasketDto } from './dto/remove-to-basket';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './product.model';
import { OrderItem } from 'sequelize'
import { ShopService } from 'src/shop/shop.service';

import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
    private readonly pageSize: number;

    constructor(@InjectModel(Product) private productRepository: typeof Product,
                private colorService: ColorService,
                private shopService: ShopService,
                private sizeService: SizeService,  
                private fileService: FilesService,
                private subcategoryService: SubcategoryService,      
                @Inject(forwardRef(() => BasketService)) private basketService: BasketService,
                @Inject(forwardRef(() => UsersService)) private userService: UsersService,
                private configService: ConfigService
                ) {
                    this.pageSize = configService.get<number>('PAGE_SIZE')
                }

    async create(dto: CreateProductDto, image: any){
        const candidate = await this.getProductByArticle(dto.article);
        if(!candidate){
            const fileName = await this.fileService.createFile(image);
            const subCategory = await this.subcategoryService.getSubcategoryByName(dto.subcategoryName);
            const shop = await this.shopService.getShopByName(dto.shopName);

            delete dto['subcategoryName'];

            const product = await this.productRepository.create({
                ...dto, 
                subCategoryId: Number(subCategory.id), 
                image: fileName, 
                shopId: shop.id,
                commentsCount: 0,
                totalRating: 0
            });
            return product;
        }
        throw new HttpException('Товар с таким артикулом уже существует', HttpStatus.FORBIDDEN);
    }

    async getProductByPk(pk: number){
        const product = await this.productRepository.findByPk(pk, {include: [{model: SubCategory}, {model: Shop}]});
        return product;
    }

    async getProductsBySubcategorySlug(subCategorySlug: string, page: number, sorting: string){
        if(!page)
            page = 1
        const offset = (page - 1) * this.pageSize;
        const limit = this.pageSize;

        const sort = this.defineSort(sorting);
        const subcategory = await this.subcategoryService.getSubcategoryBySlug(subCategorySlug);

        if(subcategory){
            const products = await this.productRepository.findAndCountAll({where: {subCategoryId: subcategory.id}, include: {all: true}, offset, limit, order: sort});
            const totalProducts = await this.productRepository.count({where: {subCategoryId: subcategory.id}});
            const totalPages = Math.ceil(totalProducts / limit) // общее количество страниц
            return {products: products.rows, totalPages, totalProducts}
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

    async searchByName(query: string, sorting: string, page: number){
        if(!page)
            page = 1
        const offset = (page - 1) * this.pageSize;
        const limit = this.pageSize;
        const sort = this.defineSort(sorting);

        const products = await this.productRepository.findAndCountAll({where: {
            [Op.or]: [
                {
                    name: {
                        [Op.iLike]: `${query}%`
                    },
                },
                {
                    article: {
                        [Op.iLike]: `${query}%`
                    }
                }
            ]},
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
            }],
            offset, limit, order: sort
        });
        const totalProducts = products.count; // общее количество товаров
        const totalPages = Math.ceil(totalProducts / limit) // общее количество страниц

        return {products: products.rows, totalPages, totalProducts}
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
            }, {
                model: Shop
            }, {
                model: Comment,
                include: [{
                    model: User
                }]
            }]
        });
        return product;
    }

    defineSort(sort: string): Order{
        let sortBody: Order =  []
        if(!sort)
            sort = 'popular'

        switch(sort){
            case 'popular':
                sortBody = [['commentsCount', 'DESC']]
                break
            case 'new':
                sortBody = [['createdAt', 'DESC']]
                break
            case 'price_asc':
                sortBody = [['price', 'ASC']]
                break
            case 'price_desc':
                sortBody = [['price', 'DESC']]
                break
            case 'rating':
                sortBody = [['totalRating', 'DESC']]
                break
        }


        return sortBody
    }

    async deleteProduct(article: string){
        await this.productRepository.destroy({where: {article}});
        return {message: `Товар с артикулом ${article} успешно удален`}
    }
}

