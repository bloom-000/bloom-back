import { Module, ValidationPipe } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication/authentication,module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AuthenticationModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
