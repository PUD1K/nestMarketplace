import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, ForeignKey, HasMany, Table, BelongsToMany, BelongsTo } from "sequelize-typescript";
import { BasketProduct } from "src/basket/basket-product.model";
import { Product } from "src/product/product.model";
import { Shop } from "src/shop/shop.model";
import { SubCategory } from "src/subcategory/subcategory.model";
import { User } from "src/users/users.model";
import { CheckoutBasketProduct } from "./checkout-basket-product.model";

interface CheckoutCreationAttr{
    address: string;
    userId: number;
    number: number;
    totalSum: number;
}

@Table({tableName: 'checkout'})
export class Checkout extends Model<Checkout, CheckoutCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1000', description: 'Общая сумма в рублях'})
    @Column({type: DataType.INTEGER, allowNull: false})
    totalSum: number;

    @ApiProperty({example: 'г. Москва, ул. Пушкина, д.100', description: 'Адрес, куда должен быть доставлен заказ'})
    @Column({type: DataType.STRING, allowNull: false})
    address: string;

    @ApiProperty({example: '3', description: 'Номер заказа'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    number: number;

    @ApiProperty({example: '1', description: 'ID пользователя'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    user: User

    @BelongsToMany(() => BasketProduct, () => CheckoutBasketProduct)
    BasketProducts: BasketProduct[]

    @HasMany(() => CheckoutBasketProduct)
    CheckoutBasketProducts: CheckoutBasketProduct[]
}
