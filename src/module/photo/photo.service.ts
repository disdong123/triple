import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PhotoRepository } from '@src/module/photo/repositories/photo.repository';

@Injectable()
export class PhotoService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly photoRepository: PhotoRepository) {}

  /**
   * 이미 존재하는지 확인합니다.
   * @param ids
   */
  async checkPhotoByIds(ids: string[]): Promise<void> {
    const photos = await this.photoRepository.repository.findByIds(ids);

    if (photos && photos.length) {
      this.logger.error(`exPhotoIds: ${JSON.stringify(photos)}`);
      throw new HttpException(
        `이미 존재하는 photo id 입니다. ids: ${JSON.stringify(ids)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 삭제된 사진들 중에 존재하는 ID 가 있는지 확인합니다.
   * @param ids
   */
  async checkDeletedPhotoByIds(ids: string[]): Promise<void> {
    const photos = await this.photoRepository.repository.findByIds(ids, {
      where: {
        isDeleted: true,
      },
    });

    if (photos && photos.length) {
      this.logger.error(`exPhotoIds: ${JSON.stringify(photos)}`);
      throw new HttpException(
        `삭제된 photo 에 이미 존재하는 photo id 입니다. ids: ${JSON.stringify(
          ids,
        )}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
