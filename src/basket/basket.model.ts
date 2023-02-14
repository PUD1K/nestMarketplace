import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany } from "sequelize-typescript";
import { Category } from "src/categories/categories.model";
import { Product } from "src/product/product.model";
import { ProductProperties } from "src/property/product-properties.model";
import { Property } from "src/property/property.model";
import { User } from "src/users/users.model";
import { BasketProduct } from "./basket-product.model";

interface BasketCreationAttr{
    userId: string;
}


@Table({tableName: 'baskets'})
export class Basket extends Model<Basket, BasketCreationAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    user: User

    @BelongsToMany(() => Product, () => BasketProduct)
    products: Product[]
}
