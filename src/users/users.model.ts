import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Basket } from "src/basket/basket.model";
import { Checkout } from "src/checkout/checkout.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Shop } from "src/shop/shop.model";

interface UserCreationAttrs{
    email: string;
    username: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    username: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.STRING, allowNull: true})
    number: string;

    @Column({type: DataType.STRING, allowNull: true})
    address: string;

    @ApiProperty({example: 'ID магазина, указывается в случае, если юзер является работником магазина', description: 'Толстовки'})
    @ForeignKey(() => Shop)
    @Column({type: DataType.INTEGER})
    shopId: number;

    // принадлежит одному
    @BelongsTo(() => Shop)
    shop: Shop;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    // имеет один
    @HasOne(() => Basket)
    basket: Basket;

    @HasMany(() => Checkout)
    checkouts: Checkout[]
}