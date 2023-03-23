import {Module} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import {SequelizeModule} from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ShopModule } from './shop/shop.module';
import { ProductModule } from './product/product.module';
import { BasketModule } from './basket/basket.module';
import { CategoriesModule } from './categories/categories.module';
import { User } from './users/users.model';
import { Shop } from './shop/shop.model';
import { Role } from './roles/roles.model';
import { Category } from './categories/categories.model';
import { Basket } from './basket/basket.model';
import { BasketProduct } from './basket/basket-product.model';
import { UserRoles } from './roles/user-roles.model';
import { Product } from './product/product.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SubcategoryModule } from './subcategory/subcategory.module';
import * as path from 'path';
import { SubCategory } from './subcategory/subcategory.model';
import { CategoryShop } from './categories/categories-shop.model';
import { Color } from './references/color/color.model';
import { Size } from './references/size/size.model';
import { ColorModule } from './references/color/color.module';
import { SizeModule } from './references/size/size.module';
import { CheckoutModule } from './checkout/checkout.module';
import { Checkout } from './checkout/checkout.model';
import { CheckoutBasketProduct } from './checkout/checkout-basket-product.model';

@Module({
    imports:[
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..','static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Shop, UserRoles, Role, Product, Category, Basket, BasketProduct, SubCategory, CategoryShop, Color, Size, Checkout, CheckoutBasketProduct],
            autoLoadModels: true
          }),
        UsersModule,
        RolesModule,
        AuthModule,
        FilesModule,
        ShopModule,
        ProductModule,
        BasketModule,
        CategoriesModule,
        SubcategoryModule,
        ColorModule,
        SizeModule,
        CheckoutModule,
    ],
    controllers: [RolesController]
})
export class AppModule {}