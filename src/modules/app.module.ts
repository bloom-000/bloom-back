import { Module, ValidationPipe } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../guard/permission.guard';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { DeliveryAddressModule } from './delivery-address/delivery-address.module';
import { CreditCardModule } from './credit-card/credit-card.module';
import { OrderModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticsModule } from './statistics/statistics.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { environment } from '../environment';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload'),
    }),
    MailerModule.forRoot({
      transport: {
        host: environment.emailHost,
        secure: false,
        auth: {
          user: environment.emailUser,
          pass: environment.emailPassword,
        },
      },
      defaults: {
        from: '<sendgrid_from_email_address>',
      },
      template: {
        dir: join(__dirname, '../templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    ScheduleModule.forRoot(),
    AuthenticationModule,
    UserModule,
    CategoryModule,
    ProductModule,
    RoleModule,
    PermissionModule,
    DeliveryAddressModule,
    CreditCardModule,
    OrderModule,
    StatisticsModule,
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
      useClass: PermissionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
