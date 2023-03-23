import { ApiProperty } from "@nestjs/swagger";
import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany } from "sequelize-typescript";
import { BasketProduct } from "src/basket/basket-product.model";
import { Basket } from "src/basket/basket.model";
import { Shop } from "src/shop/shop.model";
import { SubCategory } from "src/subcategory/subcategory.model";

interface ColorCreationAttr{
    color: string;
}

@Table({tableName: 'colors'})
export class Color extends Model<Color, ColorCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Белый', description: 'Цвет'})
    @Column({type: DataType.STRING, allowNull: false})
    color: string;

    @BelongsToMany(() => Color, () => BasketProduct)
    basketProduct: BasketProduct[];
}
