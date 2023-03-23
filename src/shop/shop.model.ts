import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, ForeignKey, HasMany, Table, BelongsToMany } from "sequelize-typescript";
import { CategoryShop } from "src/categories/categories-shop.model";
import { Category } from "src/categories/categories.model";
import { Product } from "src/product/product.model";

interface ShopCreationAttr{
    name: string;
    description: string;
    image: string;
    slug: string;
}


@Table({tableName: 'shop'})
export class Shop extends Model<Shop, ShopCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'LianaShop', description: 'Наименование'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @ApiProperty({example: 'lianashop', description: 'Слаг магазина'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    slug: string

    @ApiProperty({example: 'LianaShop - лучший магазин!', description: 'Описание'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example: 'lianashop.jpg', description: 'Изображение'})
    @Column({type: DataType.STRING})
    image: string;

    @BelongsToMany(() => Category, () => CategoryShop)
    categories: Category[];

    @HasMany(() => Product)
    products: Product[]
}
