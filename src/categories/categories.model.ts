import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, ForeignKey, HasMany, Table, BelongsToMany } from "sequelize-typescript";
import { Product } from "src/product/product.model";
import { Shop } from "src/shop/shop.model";
import { SubCategory } from "src/subcategory/subcategory.model";
import { CategoryShop } from "./categories-shop.model";

interface CategoryCreationAttr{
    name: string;
    image: string;
    slug: string;
}


@Table({tableName: 'categories'})
export class Category extends Model<Category, CategoryCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Одежда', description: 'Наименование'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @ApiProperty({example: 'odezhda', description: 'Слаг'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    slug: string;

    @ApiProperty({example: 'odezhda.jpg', description: 'Изображение'})
    @Column({type: DataType.STRING})
    image: string;

    @BelongsToMany(() => Shop, () => CategoryShop)
    shops: Shop[];

    @HasMany(() => SubCategory)
    subCategories: SubCategory[]
}
