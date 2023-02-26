import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from 'src/product/product.service';
import { UsersService } from 'src/users/users.service';
import { BasketProduct } from './basket-product.model';
import { Basket } from './basket.model';
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

    async addToBasket(productId: number, userId: number, count: number){
        const basket = await this.getBasketByUserId(userId);
        let candidateBasketProduct = await this.basketProductRepository.findOne({where: {productId, basketId: basket.id}});
        if(!candidateBasketProduct){
            const BasketProduct = await this.basketProductRepository.create({productId, basketId: basket.id, count})
            return BasketProduct
        }
        candidateBasketProduct.count += count;
        candidateBasketProduct.save()
        return candidateBasketProduct;
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

    async getBasketInfoByEmail(email: string){
        const basket = await this.getBasketByEmail(email);
        const basketInfo = await this.basketProductRepository.findAll({where: {basketId: basket.id}});
        let products = []
        // формируем объект, подгружая в product информацию о товаре
        for (var i = 0; i < basketInfo.length; i++){
            let product = await this.productService.getProductByPk(basketInfo[i].productId);
            products.push({...basketInfo[i].dataValues, product: product});
        }
        return products;
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
}
