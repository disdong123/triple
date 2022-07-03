import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from '@src/module/review/review.service';
import { TransactionService } from '@src/common/typeorm/transaction.service';
import { ReviewEntity } from '@src/module/review/entities/review.entity';
import { PointLogEntity } from '@src/module/point/entities/point-log.entity';
import { ReviewRepository } from '@src/module/review/repositories/review.repository';
import { PointLogRepository } from '@src/module/point/repositories/point-log.repository';
import { PhotoEntity } from '@src/module/photo/entities/photo.entity';
import { PhotoRepository } from '@src/module/photo/repositories/photo.repository';
import { PhotoModule } from '@src/module/photo/photo.module';
import { ReviewHelper } from '@src/module/review/review.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ReviewEntity, PointLogEntity, PhotoEntity],
      // 'ex',
    ),
    PhotoModule,
  ],
  providers: [
    ReviewHelper,
    ReviewService,
    TransactionService,
    ReviewRepository,
    PointLogRepository,
    PhotoRepository,
  ],
  exports: [ReviewService, ReviewHelper],
})
export class ReviewModule {}
