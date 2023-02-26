import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/product/product.model";
import { Basket } from "./basket.model";

interface BasketProductCreationAttr{
    count: number;
    basketId: number;
    productId: number;
}


@Table({tableName: 'basket_products', createdAt: false, updatedAt: false})
export class BasketProduct extends Model<BasketProduct, BasketProductCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '3', description: 'Количество единиц этого товара в корзине'})
    @Column({type: DataType.INTEGER})
    count: number;

    @ApiProperty({example: '1', description: 'ID корзины'})
    @ForeignKey(() => Basket)
    @Column({type: DataType.INTEGER})
    basketId: number;

    @ApiProperty({example: '2', description: 'ID товара (но вообще сюда формируется JSON представление объекта по его ID)'})
    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;
}
