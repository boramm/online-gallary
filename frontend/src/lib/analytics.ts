// Google Analytics (선택사항)

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 사용 예시:
// event({
//   action: "photo_upload",
//   category: "engagement",
//   label: "department_name",
// });

// event({
//   action: "photo_like",
//   category: "engagement",
//   label: photo.id,
// });

