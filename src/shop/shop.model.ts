import { Model, Column, DataType, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { Category } from "src/categories/categories.model";

interface ShopCreationAttr{
    name: string;
    description: string;
    image: string;
}


@Table({tableName: 'shop'})
export class Shop extends Model<Shop, ShopCreationAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.STRING})
    image: string;

    @HasMany(() => Category)
    category: Category[]
}
