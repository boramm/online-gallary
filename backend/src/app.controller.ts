import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: '온라인 갤러리 API',
    };
  }

  @Get('test/departments')
  async testDepartments() {
    const departments = await this.prisma.department.findMany();
    return {
      message: '부서 목록 조회 성공',
      count: departments.length,
      data: departments,
    };
  }

  @Get('test/photos')
  async testPhotos() {
    const photos = await this.prisma.photo.findMany({
      include: {
        comments: true,
      },
      orderBy: {
        uploadDate: 'desc',
      },
      take: 5,
    });
    return {
      message: '사진 목록 조회 성공 (최근 5개)',
      count: photos.length,
      data: photos,
    };
  }
}
