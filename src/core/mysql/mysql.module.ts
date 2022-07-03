import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DbName } from '@src/core/mysql/db-name';
import { EntityManager } from 'typeorm';
import { DataService } from '@src/common/typeorm/seed-data.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const mysqlHost = configService.get<string>('MYSQL_HOST', 'localhost');
        const mysqlPort = configService.get<number>('MYSQL_PORT', 3306);
        const mysqlUser = configService.get<string>('MYSQL_USER', 'root');
        const mysqlUserPassword = configService.get<string>(
          'MYSQL_USER_PASSWORD',
          '',
        );

        const mysqlName = configService.get<string>('MYSQL_NAME', 'ex');

        return {
          // dbms 유형s
          type: 'mysql',
          name: DbName.EX,
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          // entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
          namingStrategy: new SnakeNamingStrategy(),
          synchronize:
            // false,
            configService.get<string>('MYSQL_SYNC', 'false') === 'true',
          // debug: true,
          host: mysqlHost,
          port: mysqlPort,
          username: mysqlUser,
          password: mysqlUserPassword,
          database: mysqlName,
          logging:
            configService.get<string>('APP_ENV') === 'test'
              ? ['error']
              : // ? ['query', 'error']
                ['query', 'log', 'info', 'error'],
        };
      },
    }),
  ],
  providers: [DataService],
})
export class MysqlModule implements OnModuleInit {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly dataService: DataService,
  ) {}

  /**
   * Module 이 초기화되면 database connection 연결을 확인합니다.
   */
  async onModuleInit(): Promise<void> {
    this.logger.debug(`MysqlModule init`);

    // await this.dataService.init();
  }
}
