// ============================================================
// 토스페이먼츠 Configuration (JavaScript 버전)
// ============================================================

export const TOSS_CONFIG = {
  clientKey: import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  customerKey: '', // 비회원은 빈 문자열
  // 결제 성공/실패 시 리다이렉트 URL
  successUrl: `${window.location.origin}/payment/toss/success`,
  failUrl: `${window.location.origin}/payment/toss/fail`,
};

// ── 상품 정의 ──
export const TOSS_PRODUCTS = [
  {
    id: 'physicalup-premium-report',
    name: '피지컬업 333 프리미엄 성장 분석 보고서',
    price: 29800,
    currency: 'KRW',
  }
];

// ── 주문 ID 생성 헬퍼 ──
export function generateOrderId() {
  const now = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `order_${now}_${random}`;
}
