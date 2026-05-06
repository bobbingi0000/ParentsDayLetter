/**
 * sanitize.js - 입력값 정화 모듈 (SRP)
 *
 * 사용자 입력의 공백 정리 및 기본 정화를 담당합니다.
 * React는 JSX 렌더링 시 자동으로 HTML을 이스케이프하므로,
 * 별도의 escapeHtml 처리는 불필요합니다.
 */

/**
 * 문자열 앞뒤 공백 제거 + 연속 공백 정리
 * @param {string} str - 정리할 문자열
 * @returns {string} 정리된 문자열
 */
export function normalizeWhitespace(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * 편지 내용 전용 정화 (줄바꿈은 보존)
 * @param {string} str - 편지 내용
 * @returns {string} 정화된 편지 내용
 */
export function sanitizeContent(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

/**
 * 폼 데이터 전체를 정화
 * @param {Object} formData - { sender, receiver, content, password }
 * @returns {Object} 정화된 데이터
 */
export function sanitizeFormData(formData) {
  return {
    sender: normalizeWhitespace(formData.sender),
    receiver: normalizeWhitespace(formData.receiver),
    content: sanitizeContent(formData.content),
    password: formData.password.trim(),
  };
}
