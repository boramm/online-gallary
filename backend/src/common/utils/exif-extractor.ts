import ExifReader from 'exifreader';

export interface ExifData {
  dateTaken?: Date;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  iso?: number;
  exposureTime?: string;
  width?: number;
  height?: number;
}

/**
 * 이미지 파일에서 EXIF 데이터를 추출합니다.
 * @param buffer - 이미지 파일 버퍼
 * @returns EXIF 데이터
 */
export async function extractExifData(
  buffer: Buffer,
): Promise<ExifData | null> {
  try {
    const tags = ExifReader.load(buffer);

    const exifData: ExifData = {};

    // 촬영 날짜 추출
    if (tags.DateTimeOriginal?.description) {
      exifData.dateTaken = parseExifDate(tags.DateTimeOriginal.description);
    } else if (tags.DateTime?.description) {
      exifData.dateTaken = parseExifDate(tags.DateTime.description);
    }

    // 카메라 정보
    if (tags.Make?.description && tags.Model?.description) {
      exifData.camera = `${tags.Make.description} ${tags.Model.description}`;
    }

    // 렌즈 정보
    if (tags.LensModel?.description) {
      exifData.lens = tags.LensModel.description;
    }

    // 초점 거리
    if (tags.FocalLength?.description) {
      exifData.focalLength = tags.FocalLength.description;
    }

    // 조리개
    if (tags.FNumber?.description) {
      exifData.aperture = `f/${tags.FNumber.description}`;
    }

    // ISO
    if (tags.ISOSpeedRatings?.description) {
      exifData.iso = parseInt(tags.ISOSpeedRatings.description);
    }

    // 노출 시간
    if (tags.ExposureTime?.description) {
      exifData.exposureTime = tags.ExposureTime.description;
    }

    // 이미지 크기
    if (tags['Image Width']?.value) {
      exifData.width = tags['Image Width'].value as number;
    }
    if (tags['Image Height']?.value) {
      exifData.height = tags['Image Height'].value as number;
    }

    return Object.keys(exifData).length > 0 ? exifData : null;
  } catch (error) {
    console.warn('EXIF 데이터 추출 실패:', error.message);
    return null;
  }
}

/**
 * EXIF 날짜 형식을 JavaScript Date 객체로 변환
 * @param exifDate - EXIF 날짜 문자열 (예: "2024:01:15 14:30:00")
 * @returns Date 객체
 */
function parseExifDate(exifDate: string): Date | undefined {
  try {
    // EXIF 날짜 형식: "YYYY:MM:DD HH:mm:ss"
    const [datePart, timePart] = exifDate.split(' ');
    const [year, month, day] = datePart.split(':');
    const [hour, minute, second] = timePart.split(':');

    return new Date(
      parseInt(year),
      parseInt(month) - 1, // 월은 0부터 시작
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );
  } catch (error) {
    console.warn('EXIF 날짜 파싱 실패:', error);
    return undefined;
  }
}

