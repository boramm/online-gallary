import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PhotosModule } from './photos/photos.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, PhotosModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
