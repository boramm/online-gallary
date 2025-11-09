import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 관리자 로그인
   * POST /admin/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('[AdminController] 로그인 요청 받음, 비밀번호:', password ? '***' : '없음');
    const isValid = this.adminService.verifyPassword(password);
    console.log('[AdminController] 비밀번호 검증 결과:', isValid);

    if (!isValid) {
      // 잘못된 비밀번호는 무시 (에러 던지지 않음)
      console.log('[AdminController] 잘못된 비밀번호, 실패 응답');
      return res.json({
        success: false,
        message: '잘못된 비밀번호입니다.',
      });
    }

    // httpOnly 쿠키 설정
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
    };
    
    // 프로덕션 환경에서 도메인 설정 (필요한 경우)
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.domain = '.syu.my'; // 서브도메인 포함
    }
    
    console.log('[AdminController] 쿠키 설정 옵션:', cookieOptions);
    res.cookie('admin_session', 'true', cookieOptions);

    console.log('[AdminController] 로그인 성공 응답');
    return res.json({
      success: true,
      message: '관리자 로그인 성공',
    });
  }

  /**
   * 관리자 로그아웃
   * POST /admin/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    // 쿠키 삭제
    res.clearCookie('admin_session');

    return res.json({
      success: true,
      message: '로그아웃 성공',
    });
  }

  /**
   * 관리자 인증 확인
   * GET /admin/verify
   */
  @Get('verify')
  verify(@Req() req: Request) {
    console.log('[AdminController] verify 요청 받음');
    console.log('[AdminController] 쿠키:', req.cookies);
    const isAdmin = req.cookies?.admin_session === 'true';
    console.log('[AdminController] isAdmin 결과:', isAdmin);

    if (!isAdmin) {
      return {
        success: false,
        isAdmin: false,
      };
    }

    return {
      success: true,
      isAdmin: true,
    };
  }
}

