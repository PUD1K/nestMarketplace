import { Model, Column, DataType, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { Product } from "src/product/product.model";
import { Shop } from "src/shop/shop.model";

interface CategoryCreationAttr{
    name: string;
    description: string;
    image: string;
    shopId: number;
}


@Table({tableName: 'categories'})
export class Category extends Model<Category, CategoryCreationAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.STRING})
    image: string;

    @ForeignKey(() => Shop)
    @Column({type: DataType.INTEGER})
    shopId: number;

    @HasMany(() => Product)
    products: Product[]
}
