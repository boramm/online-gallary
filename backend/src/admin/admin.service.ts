import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 관리자 비밀번호 검증
   */
  verifyPassword(password: string): boolean {
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    return password === adminPassword;
  }
}

