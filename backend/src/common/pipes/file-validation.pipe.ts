import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(
    maxSize: number = 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: string[] = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/webp',
    ],
  ) {
    this.maxSize = maxSize;
    this.allowedMimeTypes = allowedMimeTypes;
  }

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('파일이 필요합니다.');
    }

    // 파일 크기 검증
    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `파일 크기는 ${this.maxSize / (1024 * 1024)}MB를 초과할 수 없습니다.`,
      );
    }

    // MIME 타입 검증
    if (!this.allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `허용되지 않는 파일 형식입니다. 허용 형식: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    return value;
  }
}

