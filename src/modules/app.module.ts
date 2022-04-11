import { Module, ValidationPipe } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication,module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../guard/roles.guard';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload'),
    }),
    AuthenticationModule,
    UserModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
