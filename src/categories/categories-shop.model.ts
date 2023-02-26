import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Shop } from "src/shop/shop.model";
import { Category } from "./categories.model";

@Table({tableName: 'category_shop', createdAt: false, updatedAt: false})
export class CategoryShop extends Model<CategoryShop>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Category)
    @Column({type: DataType.INTEGER})
    categoryId: number;

    @ForeignKey(() => Shop)
    @Column({type: DataType.INTEGER})
    shopId: number;
}
