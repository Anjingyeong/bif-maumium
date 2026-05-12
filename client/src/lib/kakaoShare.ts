/**
 * 카카오톡 공유 유틸리티
 * Kakao JavaScript SDK v2 사용
 * 앱 키 없이도 URL 공유(sendScrap)는 동작하지만,
 * 커스텀 메시지(sendDefault)는 JavaScript 앱 키가 필요합니다.
 * 여기서는 앱 키 없이도 동작하는 URL 공유 방식을 사용합니다.
 */

declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 SDK 초기화 (앱 키 없이 URL 공유는 불가 → 링크 공유 방식 사용)
// 실제 서비스 시 https://developers.kakao.com 에서 앱 등록 후 키 발급 필요
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY || "";

export function initKakao(): boolean {
  if (typeof window === "undefined" || !window.Kakao) return false;
  if (window.Kakao.isInitialized()) return true;
  if (!KAKAO_APP_KEY) return false;
  try {
    window.Kakao.init(KAKAO_APP_KEY);
    return window.Kakao.isInitialized();
  } catch {
    return false;
  }
}

export interface KakaoShareParams {
  title: string;
  description: string;
  imageUrl?: string;
  webUrl: string;
  mobileWebUrl: string;
}

/**
 * 카카오톡 커스텀 메시지 공유 (앱 키 필요)
 * 앱 키가 없으면 카카오 링크 공유 페이지로 fallback
 */
export function shareToKakao(params: KakaoShareParams): void {
  const kakaoInitialized = initKakao();

  if (kakaoInitialized && window.Kakao?.Share) {
    // SDK 방식 (앱 키 있을 때)
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl || "https://bif-screening.manus.space/og-image.png",
        link: {
          mobileWebUrl: params.mobileWebUrl,
          webUrl: params.webUrl,
        },
      },
      buttons: [
        {
          title: "나도 검사해보기",
          link: {
            mobileWebUrl: params.mobileWebUrl,
            webUrl: params.webUrl,
          },
        },
      ],
    });
  } else {
    // Fallback: 카카오 링크 공유 URL 방식 (앱 키 불필요)
    const shareUrl = `https://story.kakao.com/share?url=${encodeURIComponent(params.webUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=500");
  }
}

/**
 * 결과 공유용 텍스트 생성
 */
export function buildShareText(
  type: "adult" | "child",
  levelTitle: string,
  score: number,
  maxScore: number
): { title: string; description: string } {
  const pct = Math.round((score / maxScore) * 100);
  if (type === "adult") {
    return {
      title: `마음이음 인지 기능 선별검사 결과: ${levelTitle}`,
      description: `마음이음에서 인지 기능 선별검사를 해봤어요. 나도 나의 인지 스타일이 궁금하다면 직접 확인해보세요!`,
    };
  } else {
    return {
      title: `마음이음 아동 인지 발달 선별검사 결과: ${levelTitle}`,
      description: `마음이음에서 아이의 인지 발달 선별검사를 해봤어요. 우리 아이의 성장이 궁금하다면 직접 확인해보세요!`,
    };
  }
}
