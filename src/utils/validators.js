/**
 * validators.js - 입력값 유효성 검사 모듈 (SRP)
 *
 * 각 필드별 검증 규칙을 독립적으로 관리하며,
 * 새로운 필드 추가 시 validateField 맵에 규칙을 등록하면 확장 가능 (OCP).
 */

/** 필드별 최대 길이 제한 (DoS/스팸 방지) */
const MAX_LENGTHS = {
  sender: 20,
  receiver: 20,
  content: 1000,
  password: 4,
};

/** 개별 필드 검증 함수 맵 (OCP: 새 필드 추가 시 여기에 등록) */
const fieldValidators = {
  sender: (value) => {
    if (!value.trim()) return '보내는 사람 이름을 입력해 주세요.';
    if ([...value.trim()].length > MAX_LENGTHS.sender)
      return `이름은 ${MAX_LENGTHS.sender}자 이내로 입력해 주세요.`;
    return null;
  },

  receiver: (value) => {
    if (!value.trim()) return '받는 사람 이름을 입력해 주세요.';
    if ([...value.trim()].length > MAX_LENGTHS.receiver)
      return `이름은 ${MAX_LENGTHS.receiver}자 이내로 입력해 주세요.`;
    return null;
  },

  content: (value) => {
    if (!value.trim()) return '편지 내용을 입력해 주세요.';
    const length = [...value.trim()].length;
    if (length < 10) return '편지 내용은 최소 10자 이상 입력해 주세요.';
    if (length > MAX_LENGTHS.content)
      return `편지 내용은 ${MAX_LENGTHS.content}자 이내로 입력해 주세요.`;
    return null;
  },

  password: (value) => {
    if (!value) return '비밀번호를 입력해 주세요.';
    if (!/^\d{4}$/.test(value)) return '비밀번호는 숫자 4자리로 입력해 주세요.';
    return null;
  },
};

/**
 * 단일 필드 검증
 * @param {string} fieldName - 필드명
 * @param {string} value - 검증할 값
 * @returns {string|null} 에러 메시지 또는 null(통과)
 */
export function validateField(fieldName, value) {
  const validator = fieldValidators[fieldName];
  if (!validator) return null;
  return validator(value);
}

/**
 * 전체 폼 데이터 검증
 * @param {Object} formData - { sender, receiver, content, password }
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateForm(formData) {
  const errors = {};
  let isValid = true;

  for (const [field, value] of Object.entries(formData)) {
    const error = validateField(field, value);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

export { MAX_LENGTHS };
