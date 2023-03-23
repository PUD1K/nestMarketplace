import { BelongsTo, BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Basket } from "src/basket/basket.model";
import { Checkout } from "src/checkout/checkout.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

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

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasOne(() => Basket)
    basket: Basket;

    @HasMany(() => Checkout)
    checkouts: Checkout[]
}