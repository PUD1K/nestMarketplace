import { ApiProperty } from "@nestjs/swagger";
import { Model, BelongsTo, Column, DataType, ForeignKey, Table, BelongsToMany } from "sequelize-typescript";
import { BasketProduct } from "src/basket/basket-product.model";
import { Basket } from "src/basket/basket.model";
import { Product } from "src/product/product.model";
import { Shop } from "src/shop/shop.model";
import { SubCategory } from "src/subcategory/subcategory.model";
import { User } from "src/users/users.model";

interface CommentCreationAttr{
    dignites: string;
    disadvantages: string;
    comment: string;
    score: number;
    productId: number;
    userId: number,
}

@Table({tableName: 'comment'})
export class Comment extends Model<Comment, CommentCreationAttr>{

    @ApiProperty({example: '1', description: 'Уникальный идентфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Худи THE BEST', description: 'Достоинства'})
    @Column({type: DataType.STRING, allowNull: false})
    dignites: string;

    @ApiProperty({example: 'Худи THE BEST', description: 'Недостатки'})
    @Column({type: DataType.STRING, allowNull: false})
    disadvantages: string;

    @ApiProperty({example: 'Худи THE BEST', description: 'Комментарий'})
    @Column({type: DataType.STRING, allowNull: false})
    comment: string;

    @ApiProperty({example: 'Худи THE BEST', description: 'Оценка'})
    @Column({type: DataType.STRING, allowNull: false})
    score: number;


    @ApiProperty({example: '1', description: 'ID товара'})
    @ForeignKey(() => Product)
    @Column({type: DataType.INTEGER})
    productId: number;

    @BelongsTo(() => Product)
    product: Product;

    @ApiProperty({example: '1', description: 'ID автора отзыва'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
