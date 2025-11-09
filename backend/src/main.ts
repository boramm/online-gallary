import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 쿠키 파서 미들웨어 추가
  app.use(cookieParser());
  
  // CORS 활성화
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server is running on: http://localhost:${port}`);
}
bootstrap();
