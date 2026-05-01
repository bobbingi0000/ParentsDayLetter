/**
 * useClipboard.js - 클립보드 복사 커스텀 훅 (SRP)
 *
 * 클립보드 복사 로직과 성공/실패 상태를 캡슐화합니다.
 * SharePage 외에도 클립보드 복사가 필요한 곳에서 재사용 가능합니다 (OCP).
 */

import { useState, useCallback, useRef } from 'react';

/**
 * 클립보드 복사 기능 훅
 * @param {number} resetDelay - 복사 완료 상태 초기화 딜레이 (ms)
 * @returns {Object} { isCopied, copyError, copyToClipboard }
 */
export function useClipboard(resetDelay = 2500) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(null);
  const timerRef = useRef(null);

  const copyToClipboard = useCallback(async (text) => {
    setCopyError(null);

    // 이전 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      // Clipboard API 지원 여부 확인
      if (!navigator.clipboard) {
        throw new Error('클립보드 API를 지원하지 않는 브라우저입니다.');
      }

      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // 일정 시간 후 복사 상태 초기화
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
        timerRef.current = null;
      }, resetDelay);
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      setCopyError('복사에 실패했습니다. 직접 복사해 주세요.');
      setIsCopied(false);
    }
  }, [resetDelay]);

  return { isCopied, copyError, copyToClipboard };
}
