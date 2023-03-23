import { ApiProperty } from "@nestjs/swagger";
import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { Category } from "src/categories/categories.model";
import { CheckoutBasketProduct } from "src/checkout/checkout-basket-product.model";
import { Product } from "src/product/product.model";
import { SubCategory } from "src/subcategory/subcategory.model";
import { User } from "src/users/users.model";
import { BasketProduct } from "./basket-product.model";

interface BasketCreationAttr{
    userId: number;
}


@Table({tableName: 'baskets'})
export class Basket extends Model<Basket, BasketCreationAttr>{
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '1', description: 'ID пользователя'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    user: User

    @BelongsToMany(() => Product, () => BasketProduct)
    products: Product[]
}
