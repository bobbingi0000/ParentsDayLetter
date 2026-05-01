/**
 * sanitize.js - 입력값 정화 모듈 (SRP)
 *
 * XSS(Cross-Site Scripting) 공격을 방지하기 위해
 * 사용자 입력에서 위험한 HTML 태그/스크립트를 제거합니다.
 */

/** HTML 특수문자를 이스케이프 처리 */
const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

/**
 * HTML 특수문자를 이스케이프하여 XSS 방지
 * @param {string} str - 정화할 문자열
 * @returns {string} 이스케이프된 안전한 문자열
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

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
  // 줄바꿈을 임시 토큰으로 치환 → 이스케이프 → 복원
  return escapeHtml(str.trim());
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
