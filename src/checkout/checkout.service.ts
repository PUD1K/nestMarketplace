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


@Injectable()
export class CheckoutService {

    constructor(@InjectModel(Checkout) private checkoutRepository: typeof Checkout,
                @InjectModel(BasketProduct) private basketProductRepository: typeof BasketProduct,
                @InjectModel(CheckoutBasketProduct) private checkoutBasketProductRepository: typeof CheckoutBasketProduct,
                private usersService: UsersService,
                private basketService: BasketService) {}

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
}
