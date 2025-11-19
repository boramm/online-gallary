import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '온라인 갤러리 API에 오신 것을 환영합니다! 🎨';
  }
}
