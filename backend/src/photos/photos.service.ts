import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { extractExifData } from '../common/utils/exif-extractor';

@Injectable()
export class PhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  /**
   * 사진 업로드 및 생성
   */
  async create(createPhotoDto: CreatePhotoDto, file: Express.Multer.File) {
    // 1. EXIF 데이터 추출
    const exifData = await extractExifData(file.buffer);
    console.log('📸 EXIF 데이터:', exifData);

    // 2. Cloudinary에 업로드
    const uploadResult = await this.cloudinary.uploadImage(file, 'gallery');

    // 3. 데이터베이스에 저장
    const photo = await this.prisma.photo.create({
      data: {
        departmentName: createPhotoDto.departmentName,
        title: createPhotoDto.title,
        description: createPhotoDto.description,
        imageUrl: uploadResult.originalUrl,
        uploadDate:
          exifData?.dateTaken ||
          (createPhotoDto.uploadDate
            ? new Date(createPhotoDto.uploadDate)
            : new Date()),
      },
    });

    return {
      success: true,
      message: '사진이 성공적으로 업로드되었습니다.',
      data: {
        ...photo,
        thumbnailUrl: uploadResult.thumbnailUrl,
        exifData: exifData,
      },
    };
  }

  /**
   * 실제 사용된 부서명 목록 조회
   */
  async getDepartments() {
    const departments = await this.prisma.photo.findMany({
      select: {
        departmentName: true,
      },
      distinct: ['departmentName'],
      orderBy: {
        departmentName: 'asc',
      },
    });

    return {
      success: true,
      data: departments.map(d => d.departmentName),
    };
  }

  /**
   * 모든 사진 조회 (페이지네이션)
   */
  async findAll(page: number = 1, limit: number = 20, departmentName?: string) {
    const skip = (page - 1) * limit;

    const where = departmentName ? { departmentName } : {};

    const [photos, total] = await Promise.all([
      this.prisma.photo.findMany({
        where,
        include: {
          comments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: {
          uploadDate: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.photo.count({ where }),
    ]);

    return {
      success: true,
      data: photos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 특정 사진 조회
   */
  async findOne(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.prisma.photo.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return {
      success: true,
      data: photo,
    };
  }

  /**
   * 사진 정보 수정
   */
  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.prisma.photo.findUnique({ where: { id } });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다.');
    }

    const updatedPhoto = await this.prisma.photo.update({
      where: { id },
      data: updatePhotoDto,
    });

    return {
      success: true,
      message: '사진 정보가 수정되었습니다.',
      data: updatedPhoto,
    };
  }

  /**
   * 사진 삭제
   */
  async remove(id: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id } });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다.');
    }

    // Cloudinary에서 이미지 삭제 (선택적)
    // const publicId = this.extractPublicId(photo.imageUrl);
    // if (publicId) {
    //   await this.cloudinary.deleteImage(publicId);
    // }

    await this.prisma.photo.delete({ where: { id } });

    return {
      success: true,
      message: '사진이 삭제되었습니다.',
    };
  }

  /**
   * 좋아요 토글 (증가/감소)
   */
  async toggleLike(id: string, isLiked: boolean) {
    const photo = await this.prisma.photo.findUnique({ where: { id } });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다.');
    }

    // 좋아요 추가 또는 취소
    const updatedPhoto = await this.prisma.photo.update({
      where: { id },
      data: {
        likeCount: {
          [isLiked ? 'increment' : 'decrement']: 1,
        },
      },
    });

    return {
      success: true,
      data: {
        likeCount: updatedPhoto.likeCount,
        isLiked,
      },
    };
  }

  /**
   * 관리자 추천 토글
   */
  async toggleTopPick(id: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id } });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다.');
    }

    const updatedPhoto = await this.prisma.photo.update({
      where: { id },
      data: { isTopPick: !photo.isTopPick },
    });

    return {
      success: true,
      message: `관리자 추천이 ${updatedPhoto.isTopPick ? '활성화' : '비활성화'}되었습니다.`,
      data: { isTopPick: updatedPhoto.isTopPick },
    };
  }

  /**
   * URL에서 Cloudinary Public ID 추출
   */
  private extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\./);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}
