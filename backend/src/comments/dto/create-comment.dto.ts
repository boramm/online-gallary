import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  photoId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;
}

