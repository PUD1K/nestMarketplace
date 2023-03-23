import { ApiProperty } from "@nestjs/swagger";
import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany } from "sequelize-typescript";
import { BasketProduct } from "src/basket/basket-product.model";
import { Basket } from "src/basket/basket.model";
import { Shop } from "src/shop/shop.model";
import { SubCategory } from "src/subcategory/subcategory.model";

interface ProductCreationAttr{
    name: string;
    description: string;
    image: string;
    manufacturer: string;
    subCategoryId: number;
    shopId: number,

    acrticle: string;
    count: string;
    price: string;
    volume: string;
    sctructure: string;
    color: string;
    size: string;
    material: string;
    country: string;
    configuration: string;
    cpu: string;
    gpu: string;
    ram: string;
    matrix: string;
    diagonal: string;
}

@Table({tableName: 'products'})
export class Product extends Model<Product, ProductCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Худи THE BEST', description: 'Наименование'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: 'Качественное худи', description: 'Описание'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example: 'ТВОЕ', description: 'Фирма производитель'})
    @Column({type: DataType.STRING, allowNull: false})
    manufacturer: string;

    @ApiProperty({example: '100', description: 'Количество товара на складе'})
    @Column({type: DataType.STRING, allowNull: true})
    count: string;

    // >> описание свойств
    // артикул, в то же время slug
    @ApiProperty({example: '1234', description: 'Артикул'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    article: string;

    // стоимость
    @ApiProperty({example: '4000', description: 'Стоимость'})
    @Column({type: DataType.NUMBER, unique: true, allowNull: false})
    price: string;

    // для косметики
    // объем
    @ApiProperty({example: 'null', description: 'Объем'})
    @Column({type: DataType.STRING, allowNull: true})
    volume: string;

    // состав
    @ApiProperty({example: 'null', description: 'Состав'})
    @Column({type: DataType.STRING, allowNull: true})
    sctructure: string;

    // цвет
    @ApiProperty({example: 'Оранжевый', description: 'Цвет'})
    @Column({type: DataType.STRING, allowNull: true})
    color: string;

    // для одежды
    // размер
    @ApiProperty({example: 'M', description: 'Размер'})
    @Column({type: DataType.STRING, allowNull: true})
    size: string;

    // материал
    @ApiProperty({example: 'Хлопок', description: 'Материал'})
    @Column({type: DataType.STRING, allowNull: true})
    material: string;

    // страна производитель
    @ApiProperty({example: 'Россия', description: 'Страна производитель'})
    @Column({type: DataType.STRING, allowNull: true})
    country: string;

    // для украшений и посуды
    // комплектация
    @ApiProperty({example: 'Упаковка', description: 'Комплектация'})
    @Column({type: DataType.STRING, allowNull: true})
    configuration: string;


    // для техники
    // процессор
    @ApiProperty({example: 'null', description: 'Gроцессор'})
    @Column({type: DataType.STRING, allowNull: true})
    cpu: string;

    // видеокарта
    @ApiProperty({example: 'null', description: 'Dидеокарта'})
    @Column({type: DataType.STRING, allowNull: true})
    gpu: string;

    // оперативная память
    @ApiProperty({example: 'null', description: 'Jперативная память'})
    @Column({type: DataType.STRING, allowNull: true})
    ram: string;

    // матрица монитора
    @ApiProperty({example: 'null', description: 'Матрица монитора'})
    @Column({type: DataType.STRING, allowNull: true})
    matrix: string;

    // диагональ монитора
    @ApiProperty({example: 'null', description: 'Диагональ монитора'})
    @Column({type: DataType.STRING, allowNull: true})
    diagonal: string;
    // << описание свойств

    @ApiProperty({example: 'tolstovka.jpg', description: 'Изображение товара'})
    @Column({type: DataType.STRING})
    image: string;

    @ApiProperty({example: '1', description: 'ID подкатегории'})
    @ForeignKey(() => SubCategory)
    @Column({type: DataType.INTEGER})
    subCategoryId: number;

    @BelongsTo(() => SubCategory)
    subCategory: SubCategory;

    @ApiProperty({example: '1', description: 'ID магазина'})
    @ForeignKey(() => Shop)
    @Column({type: DataType.INTEGER})
    shopId: number;

    @BelongsTo(() => Shop)
    shop: Shop;

    @BelongsToMany(() => Basket, () => BasketProduct)
    baskets: Basket[];
}
