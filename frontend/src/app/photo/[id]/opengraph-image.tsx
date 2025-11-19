import { ImageResponse } from "next/og";

// 동적 Open Graph 이미지 생성
export const runtime = "edge";
export const alt = "사진 상세보기";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  try {
    // API에서 사진 정보 가져오기
    const photo = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/photos/${params.id}`
    ).then((res) => res.json());

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)",
            padding: "40px",
          }}
        >
          {/* 이미지 */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              style={{
                width: "60%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            
            {/* 정보 패널 */}
            <div
              style={{
                width: "40%",
                height: "100%",
                background: "white",
                padding: "48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* 부서 배지 */}
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  background: "#1E40AF",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {photo.departmentName}
              </div>

              {/* 제목 */}
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {photo.title}
              </div>

              {/* 통계 */}
              <div
                style={{
                  display: "flex",
                  gap: "32px",
                  fontSize: "24px",
                  color: "#666",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  ❤️ {photo.likeCount}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  👁️ {photo.viewCount}
                </div>
              </div>

              {/* 로고 */}
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1E40AF",
                }}
              >
                시선이 있는날
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    // 에러 시 기본 이미지
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)",
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          시선이 있는날
        </div>
      ),
      {
        ...size,
      }
    );
  }
}

