import { Module } from '@nestjs/common';
import { PhotoService } from '@src/module/photo/photo.service';
import { PhotoRepository } from '@src/module/photo/repositories/photo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoEntity } from '@src/module/photo/entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  providers: [PhotoService, PhotoRepository],
  exports: [PhotoService],
})
export class PhotoModule {}
