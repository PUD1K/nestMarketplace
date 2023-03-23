import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from "sequelize-typescript";
import { Color } from "src/references/color/color.model";
import { Product } from "src/product/product.model";
import { Size } from "src/references/size/size.model";
import { Checkout } from "./checkout.model";
import { BasketProduct } from "src/basket/basket-product.model";

interface CheckoutBasketProductCreationAttr{
    basketProductId: number;
    checkoutId: number;
}


@Table({tableName: 'checkout_basket_products', createdAt: false, updatedAt: false})
export class CheckoutBasketProduct extends Model<CheckoutBasketProduct, CheckoutBasketProduct>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description: 'ID basketProduct'})
    @ForeignKey(() => BasketProduct)
    @Column({type: DataType.INTEGER})
    basketProductId: number;

    @ApiProperty({example: '2', description: 'ID заказа'})
    @ForeignKey(() => Checkout)
    @Column({type: DataType.INTEGER})
    checkoutId: number;

    @BelongsTo(() => BasketProduct)
    basketProduct: BasketProduct
}
