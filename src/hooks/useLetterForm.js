/**
 * useLetterForm.js - 편지 작성 폼 커스텀 훅 (SRP)
 *
 * 폼 상태 관리, 유효성 검사, 제출 로직을 캡슐화하여
 * UI 컴포넌트(WritePage)가 순수 렌더링에만 집중할 수 있도록 합니다.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateForm, validateField, MAX_LENGTHS } from '../utils/validators';
import { sanitizeFormData } from '../utils/sanitize';
import { createLetter } from '../services/letterService';

/** 폼 초기 상태 */
const INITIAL_FORM_STATE = {
  sender: '',
  receiver: '',
  content: '',
  password: '',
};

/**
 * 편지 작성 폼 상태 관리 훅
 * @returns {Object} 폼 상태, 핸들러, 상태 플래그
 */
export function useLetterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /** 필드 값 변경 핸들러 */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // password 필드: 숫자만 허용, 4자리 제한
    if (name === 'password') {
      const numericOnly = value.replace(/\D/g, '').slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: numericOnly }));
    } else {
      // 이모지 포함 실제 글자 수 체크
      if ([...value].length > MAX_LENGTHS[name]) return;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 기존 에러 메시지 제거 (사용자 재입력 시 즉시 피드백)
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  /** 필드 포커스 아웃 시 개별 검증 */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, []);

  /** 폼 제출 핸들러 */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. 유효성 검사
    const { isValid, errors: validationErrors } = validateForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      // 에러 메시지 중 첫 번째 것을 골라서 알림창으로 띄워줍니다.
      const firstError = Object.values(validationErrors)[0];
      if (firstError) alert(firstError);
      return;
    }

    // 2. 중복 제출 방지
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 3. 입력값 정화 (XSS 방지)
      const sanitizedData = sanitizeFormData(formData);

      // 4. Firestore에 저장
      const letterId = await createLetter(sanitizedData);

      // 5. 성공 → 공유 페이지로 이동
      navigate(`/share/${letterId}`);
    } catch (error) {
      console.error('편지 저장 실패:', error);
      setSubmitError('편지 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, navigate]);

  /** 폼 초기화 */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSubmitError(null);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
