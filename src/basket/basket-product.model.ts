import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, Table } from "sequelize-typescript";
import { Color } from "src/references/color/color.model";
import { Product } from "src/product/product.model";
import { Basket } from "./basket.model";
import { Size } from "src/references/size/size.model";
import { CheckoutBasketProduct } from "src/checkout/checkout-basket-product.model";

interface BasketProductCreationAttr{
    count: number;
    basketId: number;
    productId: number;
    sizeId: number;
    colorId: number;
}


@Table({tableName: 'basket_products', createdAt: false, updatedAt: false})
export class BasketProduct extends Model<BasketProduct, BasketProductCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '3', description: 'Количество единиц этого товара в корзине'})
    @Column({type: DataType.INTEGER})
    count: number;

    @ApiProperty({example: 'M', description: 'Размер одежды'})
    @ForeignKey(() => Size)
    @Column({type: DataType.INTEGER})
    sizeId: number;

    @BelongsTo(() => Size)
    Size: Size;

    @ApiProperty({example: 'Белый', description: 'Цвет'})
    @ForeignKey(() => Color)
    @Column({type: DataType.INTEGER})
    colorId: number;

    @BelongsTo(() => Color)
    color: Color;

    @HasMany(() => CheckoutBasketProduct)
    CheckoutBasketProducts: CheckoutBasketProduct[]

    @Index(['basketId', 'productId'])
    @ApiProperty({example: '1', description: 'ID корзины'})
    @ForeignKey(() => Basket)
    @Column({type: DataType.INTEGER})
    basketId: number;

    @ApiProperty({example: '2', description: 'ID товара (но вообще сюда формируется JSON представление объекта по его ID)'})
    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;

    @BelongsTo(() => Product)
    product: Product;
}
