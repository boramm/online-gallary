import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  /**
   * 사진 업로드
   * POST /photos
   * Content-Type: multipart/form-data
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.photosService.create(createPhotoDto, file);
  }

  /**
   * 실제 사용된 부서명 목록 조회
   * GET /photos/departments
   */
  @Get('departments')
  async getDepartments() {
    return this.photosService.getDepartments();
  }

  /**
   * 모든 사진 조회 (페이지네이션)
   * GET /photos?page=1&limit=20&departmentName=기획팀
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('departmentName') departmentName?: string,
  ) {
    return this.photosService.findAll(page, limit, departmentName);
  }

  /**
   * 특정 사진 조회
   * GET /photos/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  /**
   * 사진 정보 수정
   * PATCH /photos/:id
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  /**
   * 사진 삭제
   * DELETE /photos/:id
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }

  /**
   * 좋아요 토글
   * POST /photos/:id/like
   * Body: { isLiked: boolean }
   */
  @Post(':id/like')
  async like(@Param('id') id: string, @Body('isLiked') isLiked: boolean) {
    return this.photosService.toggleLike(id, isLiked);
  }

  /**
   * 관리자 추천 토글
   * POST /photos/:id/top-pick
   */
  @Post(':id/top-pick')
  async toggleTopPick(@Param('id') id: string) {
    return this.photosService.toggleTopPick(id);
  }
}
