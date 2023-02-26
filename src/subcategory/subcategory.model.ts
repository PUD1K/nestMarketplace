import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, ForeignKey, HasMany, Table, BelongsTo } from "sequelize-typescript";
import { Category } from "src/categories/categories.model";
import { Product } from "src/product/product.model";

interface SubCategoryCreationAttr{
    name: string;
    description: string;
    image: string;
    slug: string;
    categoryId: number;
}


@Table({tableName: 'subcategories'})
export class SubCategory extends Model<SubCategory, SubCategoryCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Толстовки', description: 'Имя'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;
    
    @ApiProperty({example: 'tolstovki', description: 'Слаг'})
    @Column({type: DataType.STRING, allowNull: false})
    slug: string;

    @ApiProperty({example: 'Подкатегория толстовок', description: 'Описание'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example: 'tolstovki.jpg', description: 'Изображение'})
    @Column({type: DataType.STRING})
    image: string;

    @ApiProperty({example: 'ID связанной категории', description: 'Толстовки'})
    @ForeignKey(() => Category)
    @Column({type: DataType.INTEGER})
    categoryId: number;

    @BelongsTo(() => Category)
    Category: Category;

    @HasMany(() => Product)
    products: Product[]
}
