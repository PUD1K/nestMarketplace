import { ApiProperty } from "@nestjs/swagger";
import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany } from "sequelize-typescript";
import { BasketProduct } from "src/basket/basket-product.model";
import { Basket } from "src/basket/basket.model";
import { Shop } from "src/shop/shop.model";
import { SubCategory } from "src/subcategory/subcategory.model";

interface SizeCreationAttr{
    size: string;
}

@Table({tableName: 'sizes'})
export class Size extends Model<Size, SizeCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'M', description: 'Размер'})
    @Column({type: DataType.STRING, allowNull: false})
    size: string;

    @BelongsToMany(() => Size, () => BasketProduct)
    basketProduct: BasketProduct[];
}
