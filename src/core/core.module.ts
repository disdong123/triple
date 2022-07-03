import { Module } from '@nestjs/common';
import { MysqlModule } from '@src/core/mysql/mysql.module';
import { ConfigurationModule } from '@src/core/config/configuration.module';
import { DayjsModule } from '@src/core/dayjs/dayjs.module';

@Module({
  imports: [ConfigurationModule, MysqlModule, DayjsModule],
  providers: [],
})
export class CoreModule {}
