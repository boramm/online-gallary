import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  content?: string;
}

