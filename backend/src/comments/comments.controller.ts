import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 생성
   * POST /comments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    // 클라이언트 IP 가져오기
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown';

    return this.commentsService.create(createCommentDto, ip);
  }

  /**
   * 특정 사진의 모든 댓글 조회
   * GET /comments/photo/:photoId
   */
  @Get('photo/:photoId')
  findByPhotoId(@Param('photoId') photoId: string) {
    return this.commentsService.findByPhotoId(photoId);
  }

  /**
   * 특정 댓글 조회
   * GET /comments/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  /**
   * 댓글 수정
   * PATCH /comments/:id
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  /**
   * 댓글 삭제
   * DELETE /comments/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  /**
   * 특정 사진의 댓글 수 조회
   * GET /comments/photo/:photoId/count
   */
  @Get('photo/:photoId/count')
  countByPhotoId(@Param('photoId') photoId: string) {
    return this.commentsService.countByPhotoId(photoId);
  }
}

