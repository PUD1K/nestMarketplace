import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany } from "sequelize-typescript";
import { BasketProduct } from "src/basket/basket-product.model";
import { Basket } from "src/basket/basket.model";
import { Category } from "src/categories/categories.model";

interface ProductCreationAttr{
    name: string;
    description: string;
    image: string;
    properties: string[]; 
}


@Table({tableName: 'products'})
export class Product extends Model<Product, ProductCreationAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    // артикул
    @Column({type: DataType.STRING, allowNull: false})
    acticle: string;
    // >> описание свойств

    // для косметики
    // объем
    @Column({type: DataType.STRING, allowNull: true})
    volume: string;

    // состав
    @Column({type: DataType.STRING, allowNull: true})
    sctructure: string;

    // цвет
    @Column({type: DataType.STRING, allowNull: true})
    color: string;

    // для одежды
    // размер
    @Column({type: DataType.STRING, allowNull: true})
    size: string;

    // материал
    @Column({type: DataType.STRING, allowNull: true})
    material: string;

    // страна производитель
    @Column({type: DataType.STRING, allowNull: true})
    country: string;

    // для украшений и посуды
    // комплектация
    @Column({type: DataType.STRING, allowNull: true})
    configuration: string;


    // для техники
    // процессор
    @Column({type: DataType.STRING, allowNull: true})
    cpu: string;

    // видеокарта
    @Column({type: DataType.STRING, allowNull: true})
    gpu: string;

    // оперативная память
    @Column({type: DataType.STRING, allowNull: true})
    ram: string;

    // матрица монитора
    @Column({type: DataType.STRING, allowNull: true})
    matrix: string;

    // диагональ монитора
    @Column({type: DataType.STRING, allowNull: true})
    diagonal: string;
    // << описание свойств

    @Column({type: DataType.STRING})
    image: string;

    @ForeignKey(() => SubCategory)
    @Column({type: DataType.INTEGER})
    subCategoryId: number;

    @BelongsTo(() => SubCategory)
    subCategory: SubCategory;

    @BelongsToMany(() => Basket, () => BasketProduct)
    baskets: Basket[];
}
