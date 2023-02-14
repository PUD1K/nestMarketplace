import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/product/product.model";
import { Basket } from "./basket.model";

@Table({tableName: 'basket_products', createdAt: false, updatedAt: false})
export class BasketProduct extends Model<BasketProduct>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.INTEGER})
    count: number;

    @ForeignKey(() => Basket)
    @Column({type: DataType.INTEGER})
    basketId: number;

    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;
}
