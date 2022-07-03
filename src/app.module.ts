import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { HttpExceptionFilter } from '@src/common/filter/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { TypeormExceptionFilter } from '@src/common/filter/typeorm-exception.filter';
import { AllExceptionFilter } from '@src/common/filter/all-exception.filter';
import { EventModule } from '@src/module/event/event.module';
import { UserModule } from '@src/module/user/user.module';

@Module({
  imports: [CoreModule, EventModule, UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeormExceptionFilter,
    },
  ],
})
export class AppModule {}
