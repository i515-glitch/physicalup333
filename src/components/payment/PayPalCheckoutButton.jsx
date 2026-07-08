// ============================================================
// PayPal 결제 버튼 컴포넌트 (JavaScript + SDK 동적 로드 버전)
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { PAYPAL_CONFIG } from '../../lib/paypal';

const PayPalCheckoutButton = ({ product, onSuccess, onError, onCancel }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.paypal) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&currency=${PAYPAL_CONFIG.currency}`;
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => onError?.('PayPal SDK 로드 실패');
    document.head.appendChild(script);
  }, [onError]);

  useEffect(() => {
    if (!sdkLoaded || !window.paypal || !containerRef.current) return;

    // 컨테이너를 비워 중복 렌더링 방지
    containerRef.current.innerHTML = '';

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 50,
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: product.description,
              custom_id: product.id,
              amount: {
                currency_code: product.currency,
                value: product.price,
              },
            },
          ],
        });
      },
      onApprove: async (data, actions) => {
        const details = await actions.order.capture();
        onSuccess(details);
      },
      onError: (err) => {
        console.error('[PayPal] Error:', err);
        onError?.(err);
      },
      onCancel: () => {
        onCancel?.();
      },
    }).render(containerRef.current);
  }, [sdkLoaded, product, onSuccess, onError, onCancel]);

  return (
    <div style={{ width: '100%', minHeight: '50px' }}>
      {!sdkLoaded && <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>PayPal 로딩 중...</div>}
      <div ref={containerRef} />
    </div>
  );
};

export default PayPalCheckoutButton;
