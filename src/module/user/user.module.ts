import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/module/user/entities/user.entity';
import { UserController } from '@src/module/user/user.controller';
import { UserService } from '@src/module/user/user.service';
import { UserRepository } from '@src/module/user/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
