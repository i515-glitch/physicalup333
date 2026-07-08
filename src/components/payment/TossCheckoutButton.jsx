// ============================================================
// 토스페이먼츠 결제 버튼 컴포넌트 (JavaScript 버전)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { TOSS_CONFIG, generateOrderId } from '../../lib/toss';

const TossCheckoutButton = ({
  product,
  customerEmail,
  customerName,
  customerKey,
  method = '카드',
  onPrepare,
  onError,
  className,
}) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  // 토스페이먼츠 SDK 로드
  useEffect(() => {
    if (window.TossPayments) {
      setSdkLoaded(true);
      return;
    }

    const existing = document.querySelector('script[src*="tosspayments"]');
    if (existing) {
      existing.addEventListener('load', () => setSdkLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => onError?.('토스페이먼츠 SDK 로드 실패');
    document.head.appendChild(script);
  }, [onError]);

  // 결제 요청
  const handlePayment = useCallback(async () => {
    if (!window.TossPayments || processing) return;

    setProcessing(true);

    try {
      const tossPayments = window.TossPayments(TOSS_CONFIG.clientKey);
      const orderId = generateOrderId();

      if (onPrepare) {
        await onPrepare(orderId);
      }

      await tossPayments.requestPayment(method, {
        amount: product.price,
        orderId,
        orderName: product.name,
        customerName: customerName || '고객',
        customerEmail: customerEmail || undefined,
        customerKey: customerKey || TOSS_CONFIG.customerKey || undefined,
        successUrl: TOSS_CONFIG.successUrl,
        failUrl: TOSS_CONFIG.failUrl,
      });
    } catch (error) {
      if (error.code === 'USER_CANCEL') {
        console.log('[Toss] 사용자 취소');
      } else {
        console.error('[Toss] Error:', error);
        onError?.(error);
      }
    } finally {
      setProcessing(false);
    }
  }, [product, customerEmail, customerName, customerKey, method, processing, onError]);

  return (
    <button
      onClick={handlePayment}
      disabled={!sdkLoaded || processing}
      style={{
        width: '100%',
        height: '50px',
        borderRadius: '10px',
        fontWeight: '700',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s',
        cursor: sdkLoaded && !processing ? 'pointer' : 'not-allowed',
        background: processing ? '#4f8ef7' : sdkLoaded ? '#0064FF' : '#64748b',
        color: '#ffffff',
        border: 'none',
        boxShadow: sdkLoaded && !processing ? '0 4px 15px rgba(0, 100, 255, 0.15)' : 'none',
      }}
      className={className}
    >
      {processing ? (
        <span>결제 처리 중...</span>
      ) : !sdkLoaded ? (
        <span>로딩 중...</span>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 9.5C22 5.91 19.09 3 15.5 3H8.5C4.91 3 2 5.91 2 9.5S4.91 16 8.5 16H10v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V16h2.5C19.09 16 22 13.09 22 9.5z"/>
          </svg>
          <span>{product.price.toLocaleString()}원 토스로 결제</span>
        </>
      )}
    </button>
  );
};

export default TossCheckoutButton;
