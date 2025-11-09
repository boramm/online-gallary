import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

// 스팸 방지를 위한 인메모리 저장소
interface SpamTracker {
  count: number;
  firstRequest: Date;
}

@Injectable()
export class CommentsService {
  // IP별 댓글 작성 추적
  private readonly spamTracker = new Map<string, SpamTracker>();

  constructor(private readonly prisma: PrismaService) {
    // 1시간마다 오래된 추적 데이터 정리
    setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      for (const [ip, tracker] of this.spamTracker.entries()) {
        if (tracker.firstRequest < oneHourAgo) {
          this.spamTracker.delete(ip);
        }
      }
    }, 60 * 60 * 1000);
  }

  /**
   * 스팸 체크: 같은 IP에서 1분 내 3개 이상 댓글 작성 방지
   */
  checkSpam(ip: string): void {
    const now = new Date();
    const tracker = this.spamTracker.get(ip);

    if (!tracker) {
      // 첫 댓글
      this.spamTracker.set(ip, { count: 1, firstRequest: now });
      return;
    }

    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    if (tracker.firstRequest < oneMinuteAgo) {
      // 1분 이상 지났으면 리셋
      this.spamTracker.set(ip, { count: 1, firstRequest: now });
      return;
    }

    // 1분 내에 3개 이상이면 에러
    if (tracker.count >= 3) {
      throw new BadRequestException(
        '너무 많은 댓글을 작성하셨습니다. 1분 후에 다시 시도해주세요.',
      );
    }

    // 카운트 증가
    tracker.count += 1;
  }

  /**
   * 댓글 생성
   */
  async create(createCommentDto: CreateCommentDto, ip: string) {
    // 스팸 체크
    this.checkSpam(ip);

    // 사진 존재 여부 확인
    const photo = await this.prisma.photo.findUnique({
      where: { id: createCommentDto.photoId },
    });

    if (!photo) {
      throw new NotFoundException('사진을 찾을 수 없습니다.');
    }

    // 댓글 생성
    return this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  /**
   * 특정 사진의 모든 댓글 조회
   */
  async findByPhotoId(photoId: string) {
    return this.prisma.comment.findMany({
      where: { photoId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 특정 댓글 조회
   */
  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comment;
  }

  /**
   * 댓글 수정
   */
  async update(id: string, updateCommentDto: UpdateCommentDto) {
    // 댓글 존재 여부 확인
    await this.findOne(id);

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  /**
   * 댓글 삭제
   */
  async remove(id: string) {
    // 댓글 존재 여부 확인
    await this.findOne(id);

    return this.prisma.comment.delete({
      where: { id },
    });
  }

  /**
   * 특정 사진의 댓글 수 조회
   */
  async countByPhotoId(photoId: string): Promise<number> {
    return this.prisma.comment.count({
      where: { photoId },
    });
  }
}

