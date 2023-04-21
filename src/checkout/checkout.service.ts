import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BasketProduct } from 'src/basket/basket-product.model';
import { Basket } from 'src/basket/basket.model';
import { BasketService } from 'src/basket/basket.service';
import { Product } from 'src/product/product.model';
import { Color } from 'src/references/color/color.model';
import { Size } from 'src/references/size/size.model';
import { UsersService } from 'src/users/users.service';
import { CheckoutBasketProduct } from './checkout-basket-product.model';
import { Checkout } from './checkout.model';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { ShopService } from 'src/shop/shop.service';
import { Shop } from 'src/shop/shop.model';
import { SubCategory } from 'src/subcategory/subcategory.model';
import { Category } from 'src/categories/categories.model';
import { SubcategoryService } from 'src/subcategory/subcategory.service';
import { check } from 'prettier';


@Injectable()
export class CheckoutService {

    constructor(@InjectModel(Checkout) private checkoutRepository: typeof Checkout,
                @InjectModel(BasketProduct) private basketProductRepository: typeof BasketProduct,
                @InjectModel(CheckoutBasketProduct) private checkoutBasketProductRepository: typeof CheckoutBasketProduct,
                private usersService: UsersService,
                private shopService: ShopService,
                private subCategoryService: SubcategoryService,
                private basketService: BasketService) {
                }
                

    async createCheckout(dto: CreateCheckoutDto){
        console.log(dto);
        const basketProductsId = dto.basketProductsId;
        const numberCheckout = await this.checkoutRepository.count({where: {userId: dto.userId}});
        
        if(!basketProductsId.length)
            throw new HttpException('Отсутствуют товары в корзине', HttpStatus.FORBIDDEN)

        const checkout = await this.checkoutRepository.create({address: dto.address, userId: dto.userId, number: numberCheckout+1, totalSum: 0});
        const checkoutId = checkout.id
        let totalSum = 0;
        for(const basketProductId of basketProductsId){
            const checkoutBasketProduct = await this.checkoutBasketProductRepository.create({basketProductId, checkoutId});
            const productPrice = await this.basketService.getPriceProductByBasketProductId(basketProductId);
            totalSum += Number(productPrice);
        }
        checkout.totalSum = totalSum;
        checkout.save();
        return {message: 'Заказ успешно создан!'};
    }

    async getAllCheckoutInfo(username: string){
        const user = await this.usersService.getUserByUsername(username);
        const checkouts = await this.getAllCheckout(user.id);

        let checkoutInfo = [];
        for(const checkout of checkouts){
            let basketProductsArr: BasketProduct[] = [];

            const checkoutBasketProducts = await this.checkoutBasketProductRepository.findAll({where: {checkoutId: checkout.id}});
            for(const checkoutBasketProduct of checkoutBasketProducts){
                const basketProduct = await this.basketProductRepository.findByPk(checkoutBasketProduct.id);
                basketProductsArr.push(basketProduct);
            }
            return basketProductsArr;
            const productsListInBasket = await this.basketService.getProductsListInBasket(basketProductsArr);
            checkoutInfo.push({...checkout.dataValues, products: productsListInBasket});
        }
    }

    async getAllCheckout(userId: number){
        const checkouts = await this.checkoutRepository.findAll({where: {userId}});
        return checkouts;
    }

    async getAllForShop(shopSlug: string){
        const shop = await this.shopService.getShopBySlug(shopSlug);
        const checkouts = await this.checkoutRepository.findAll({include: [{ 
            model: CheckoutBasketProduct, 
            attributes: ['id'],
                include: [{ 
                    model: BasketProduct, 
                    attributes: ['count'],
                        include: [ 
                            {model:Product, include: [{
                                model: Shop, where: {id: shop.id}
                                },
                                {
                                    model: SubCategory, include: [{
                                        model: Category
                                    }]
                                }]
                            }, 
                            {model:Color, attributes: ['color']}, 
                            {model: Size, attributes: ['size']} ] 
                        }]
                    }]
        });
        const cellsPerCategories = new Map();
        let basketProducts = checkouts.map(i => i.CheckoutBasketProducts).map(i => i.map(j => j.basketProduct));
        for(var i = 0; i < basketProducts.length; i++){
            const products = basketProducts[i];
            for (var j = 0; j < products.length; j++){
                const basketProduct = products[j];
                const subcategoryId = basketProduct.product.subCategory.id;
                const category = (await this.subCategoryService.getSubcategoryById(subcategoryId)).category;
                const cells: number = cellsPerCategories.get(category.name)
                cellsPerCategories.set(category.name, cells ? basketProduct.count + cells : basketProduct.count);
           }
        }

        const cellsPerMonths = new Map();
        for (var i = 0; i < checkouts.length; i++){
            const checkout = checkouts[i];
            const month = this.getRusMonth(String(checkout.createdAt).substring(4,7));
            for(var j = 0; j < checkout.CheckoutBasketProducts.length; j++){
                const basketProduct = checkout.CheckoutBasketProducts[j].basketProduct;
                const cells: number = cellsPerMonths.get(month);
                cellsPerMonths.set(month, cells ? basketProduct.count + cells : basketProduct.count);
            }
        }
        return {cellsPerCategories : this.replacerMapToObj(cellsPerCategories), cellsPerMonths: this.replacerMapToObj(cellsPerMonths)};
    }

    async getAllCheckoutInfoTest(username: string) {
        const user = await this.usersService.getUserByUsername(username);
        const checkouts = await this.checkoutRepository.findAll({
          where: { userId: user.id },
          include: [{ 
            model: CheckoutBasketProduct, 
            attributes: ['id'],
                include: [{ 
                    model: BasketProduct, 
                    attributes: ['count'],
                        include: [ 
                            {model:Product}, 
                            {model:Color, attributes: ['color']}, 
                            {model: Size, attributes: ['size']} ] 
                        }]
                    }]
        });

        return checkouts;
    }

    async getAllCheckoutInfoForShop(shopslug: string) {
        const user = await this.shopService.getShopBySlug(shopslug);
        const checkouts = await this.checkoutRepository.findAll({
          where: { userId: user.id },
          include: [{ 
            model: CheckoutBasketProduct, 
            attributes: ['id'],
                include: [{ 
                    model: BasketProduct, 
                    attributes: ['count'],
                        include: [ 
                            {model:Product}, 
                            {model:Color, attributes: ['color']}, 
                            {model: Size, attributes: ['size']} ] 
                        }]
                    }]
        });

        return checkouts;
    }

    replacerMapToObj(map: Map<any, any>) {
        let convertedObj = {};
        for (let [key, value] of map){
            convertedObj[key] = value;
        }
        return convertedObj;
    }

    getRusMonth(month: string){
        const months = {
            "Jan": "Январь",
            "Feb": "Февраль",
            "Mar": "Март",
            "Apr": "Апрель",
            "May": "Май",
            "Jun": "Июнь",
            "Jul": "Июль",
            "Aug": "Август",
            "Sep": "Сентябрь",
            "Oct": "Октябрь",
            "Nov": "Ноябрь",
            "Dec": "Декабрь",
        }

        return months[month] || null
    }
}
