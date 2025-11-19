import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface CloudinaryUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  /**
   * 이미지를 Cloudinary에 업로드하고 원본 및 썸네일 URL 반환
   * @param file - 업로드할 파일 버퍼
   * @param folder - Cloudinary 폴더명
   */
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'gallery',
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          // 원본 이미지 최대 2000px로 제한
          transformation: [
            {
              width: 2000,
              height: 2000,
              crop: 'limit',
              quality: 'auto:good',
              fetch_format: 'auto', // WebP 자동 변환
            },
          ],
          // 썸네일 eager 생성 (400px)
          eager: [
            {
              width: 400,
              height: 400,
              crop: 'limit',
              quality: 'auto:eco',
              fetch_format: 'webp',
            },
          ],
          eager_async: false, // 동기적으로 썸네일 생성
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            const thumbnailUrl =
              result.eager && result.eager[0]
                ? result.eager[0].secure_url
                : result.secure_url;

            resolve({
              originalUrl: result.secure_url,
              thumbnailUrl: thumbnailUrl,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Cloudinary에서 이미지 삭제
   * @param publicId - Cloudinary public ID
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
      throw error;
    }
  }

  /**
   * 여러 이미지를 한 번에 삭제
   * @param publicIds - Cloudinary public ID 배열
   */
  async deleteImages(publicIds: string[]): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      console.error('Failed to delete images from Cloudinary:', error);
      throw error;
    }
  }
}

