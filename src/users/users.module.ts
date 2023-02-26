import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Basket } from 'src/basket/basket.model';
import { BasketModule } from 'src/basket/basket.module';
import { ProductModule } from 'src/product/product.module';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoles } from 'src/roles/user-roles.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Basket]),
    RolesModule,
    // forwardRef(() => ProductModule),
    forwardRef(() => BasketModule),
    forwardRef(() => AuthModule)
  ],
  exports: [
    UsersService 
  ]
})
export class UsersModule {}
