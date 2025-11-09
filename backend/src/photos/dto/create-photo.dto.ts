import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty({ message: '부서명은 필수입니다.' })
  departmentName: string;

  @IsString()
  @IsNotEmpty({ message: '제목은 필수입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '설명은 필수입니다.' })
  @MaxLength(100, { message: '설명은 최대 100자까지 입력 가능합니다.' })
  description: string;

  @IsOptional()
  @IsString()
  uploadDate?: string; // EXIF에서 추출된 날짜 (ISO 형식)
}

