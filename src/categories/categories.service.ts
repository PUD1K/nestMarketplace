import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { translit } from 'src/middleware/translit';
import { ShopService } from 'src/shop/shop.service';
import { Category } from './categories.model';
import { AddShopDto } from './dto/add-shop.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesForShop } from './dto/get-categories-for-shop.dto';

@Injectable()
export class CategoriesService {

    constructor(@InjectModel(Category) private categoryRepository: typeof Category,
        private fileService: FilesService,
        private shopService: ShopService) { }

    async createCategory(dto: CreateCategoryDto, image: any) {
        const candidate = await this.getCategoryByName(dto.name);
        if (!candidate) {
            const fileName = await this.fileService.createFile(image);
            const category = await this.categoryRepository.create({ ...dto, slug: translit(dto.name), image: fileName });
            return category;
        }
        throw new HttpException('Такая категория уже существует', HttpStatus.FORBIDDEN)
    }

    async getCategoryByName(name: string) {
        const category = await this.categoryRepository.findOne({ where: { name } });
        return category;
    }

    async getCategoryBySlug(slug: string) {
        const category = await this.categoryRepository.findOne({ where: { slug }, include: { all: true } });
        return category;
    }

    async getAllCategories(){
        const categories = await this.categoryRepository.findAll({include: {all: true}});
        return categories;
    }

    async getFreeCategoriesForShop(dto: GetCategoriesForShop){
        const categories = await this.categoryRepository.findAll();
        const categoriesInShop: string[] = JSON.parse(dto.categories);
        const freeCategories = categories.filter(category => !categoriesInShop.includes(category.name))
        return freeCategories;
    }

    async addCategoryToShop(dto: AddShopDto) {
        console.log(dto);
        const shop = await this.shopService.getShopByName(dto.shopName);
        const category = await this.getCategoryByName(dto.categoryName);

        const existShopInCategory = await category.$has('shops', shop.id)
        if (shop && category) {
            if (existShopInCategory) {
                await category.$add('shop', shop.id);
                return category;
            }
            await category.$set('shops', [shop.id]);
            return category;
        }

        throw new HttpException('Такого магазина или категории не существует', HttpStatus.FORBIDDEN)
    }
}

