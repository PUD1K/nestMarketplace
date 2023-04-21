import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from 'src/product/product.service';
import { Color } from 'src/references/color/color.model';
import { Size } from 'src/references/size/size.model';
import { UsersService } from 'src/users/users.service';
import { BasketProduct } from './basket-product.model';
import { Basket } from './basket.model';
import { ClearBasketDto } from './dto/clear-basket.dto';
import { CreateBasketDto } from './dto/create-basket.dto';

@Injectable()
export class BasketService {

    constructor(@InjectModel(Basket) private basketRepository: typeof Basket,
                @InjectModel(BasketProduct) private basketProductRepository: typeof BasketProduct,
                @Inject(forwardRef(() => ProductService)) private productService: ProductService,
                @Inject(forwardRef(() => UsersService)) private userService: UsersService) {}

    async create(dto: CreateBasketDto){
        const basket = await this.basketRepository.create(dto);
        return basket;
    }

    async addToBasket(productId: number, userId: number, count: number, sizeId: number, colorId: number){
        const basket = await this.getBasketByUserId(userId);
        let where:Partial<{ productId: number; basketId: number; sizeId?: number; colorId?: number }> = {productId, basketId: basket.id}
        if(sizeId){
            where = {...where, sizeId}
        }
        if(colorId){
            where = {...where, colorId}
        }

        let candidateBasketProduct = await this.basketProductRepository.findOne({
            where: where, 
            include: [
            { model: Color },
            { model: Size }]
        });
        if(!candidateBasketProduct){
            const newBasketProduct = await this.basketProductRepository.create({productId, basketId: basket.id, count, sizeId, colorId});
            return newBasketProduct;
        }
        candidateBasketProduct.count += count;
        await candidateBasketProduct.save();
        return candidateBasketProduct;
    }

    async setCount(productId: number, userId: number, count: number, sizeId: number, colorId: number){
        const basket = await this.getBasketByUserId(userId);
        let candidateBasketProduct = await this.basketProductRepository.findOne({
            where: {productId, basketId: basket.id, sizeId, colorId}, 
            include: [
            { model: Color },
            { model: Size }]
        });
        if(!candidateBasketProduct){
            throw new HttpException('Товар уже отсутствует в корзине', HttpStatus.FORBIDDEN)
        }
        candidateBasketProduct.count = count;
        await candidateBasketProduct.save();
        return candidateBasketProduct;
    }

    async clearBasket(dto: ClearBasketDto){
        const basket = await this.getBasketByUsername(dto.username)
        const basketProducts = await this.basketProductRepository.findAll({where: {basketId: basket.id}});
        for(let basketProduct of basketProducts){
            basketProduct.basketId = null;
            await basketProduct.save();
        }
        return basketProducts
    }

    async removeToBasket(productId: number, userId: number, count: number){
        const basket = await this.getBasketByUserId(userId);
        let candidateBasketProduct = await this.basketProductRepository.findOne({where: {productId, basketId: basket.id}});
        if(!candidateBasketProduct){
            throw new HttpException('Такой товар в корзине отсутствует', HttpStatus.FORBIDDEN);
        }
        if(candidateBasketProduct.count <= count){
            await this.basketProductRepository.destroy({where: {productId, basketId: basket.id}});
            return {message: 'Товар успешно удален из корзины'}
        }
        candidateBasketProduct.count -= count;
        candidateBasketProduct.save()
        return candidateBasketProduct;
    }

    async removeFromBasket(productId: number, userId: number, sizeId: number, colorId: number){
        const basket = await this.getBasketByUserId(userId);
        let candidateBasketProduct = await this.basketProductRepository.findOne({where: {productId, basketId: basket.id}});
        if(!candidateBasketProduct){
            throw new HttpException('Такой товар в корзине отсутствует', HttpStatus.FORBIDDEN);
        }
        await this.basketProductRepository.destroy({where: {productId, basketId: basket.id, sizeId, colorId}});
        return {message: 'Товар успешно удален из корзины'}
    }

    async getBasketInfoByEmail(email: string){
        const basket = await this.getBasketByEmail(email);
        const basketInfo = await this.basketProductRepository.findAll({
            where: {basketId: basket.id},
            include: [
                { model: Color },
                { model: Size }
            ]
        });
        let products = []
        // формируем объект, подгружая в product информацию о товаре
        for (var i = 0; i < basketInfo.length; i++){
            let product = await this.productService.getProductByPk(basketInfo[i].productId);
            products.push({...basketInfo[i].dataValues, product: product});
        }
        return products;
    }

    async getBasketInfoByUsername(username: string){
        const basket = await this.getBasketByUsername(username);
        const basketInfo = await this.basketProductRepository.findAll({
            where: {basketId: basket.id},
            include: [
                { model: Color },
                { model: Size }
            ]
        });
        return this.getProductsListInBasket(basketInfo);
    }

    async getBasketCount(email: string){
        const basket = await this.getBasketByEmail(email);
        const basketInfo = await this.basketProductRepository.findAll({where: {basketId: basket.id}});
        const countProductsInBasket = basketInfo.reduce((acc, cur) => acc + cur.count, 0);
        return countProductsInBasket;
    }

    async getBasketByUserId(userId: number){
        const basket = await this.basketRepository.findOne({where: {userId}, include: {all: true}});
        return basket;
    }

    async getBasketByEmail(email: string){
        const user = await this.userService.getUserByEmail(email);
        const basket = await this.getBasketByUserId(user.id);
        return basket;
    }

    async getBasketByUsername(username: string){
        const user = await this.userService.getUserByUsername(username);
        const basket = await this.getBasketByUserId(user.id);
        return basket;
    }


    async getPriceProductByBasketProductId(basketProductId: number){
        const basketProduct = await this.basketProductRepository.findByPk(basketProductId);
        const product = await this.productService.getProductByPk(basketProduct.productId);
        return product.price;
    }

    async getProductsListInBasket(basketInfo: BasketProduct[]){
        let products = []
        for (let i = 0; i < basketInfo.length; i++){
            let product = await this.productService.getProductByPk(basketInfo[i].productId);
            products.push({...basketInfo[i].dataValues, product: product});
        }
        delete products['baskets'];
        return products;
    }
}
