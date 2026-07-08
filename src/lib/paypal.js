// ============================================================
// PayPal Configuration — @paypal/react-paypal-js 기반 (JavaScript 버전)
// ============================================================

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture',
};

// ── 상품 정의 ──
export const PAYPAL_PRODUCTS = [
  {
    id: 'physicalup-premium-report-usd',
    name: 'Physical UP 333 Premium Growth Analysis Report',
    description: 'InBody analysis + BioCode tailored diet & workout solutions',
    price: '25.00',
    currency: 'USD',
  }
];
