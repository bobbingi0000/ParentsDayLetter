/**
 * WritePage.jsx - 편지 작성 페이지 (SRP: 순수 UI 렌더링만 담당)
 *
 * 폼 로직은 useLetterForm 훅에, 검증은 validators에, 정화는 sanitize에 위임.
 * 이 컴포넌트는 오직 사용자 인터페이스 렌더링에만 집중합니다.
 */

import { motion } from 'framer-motion';
import { useLetterForm } from '../hooks/useLetterForm';
import { MAX_LENGTHS } from '../utils/validators';

/** Framer Motion 애니메이션 variants */
const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.45, ease: 'easeOut' },
  }),
};

function WritePage() {
  const {
    formData,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLetterForm();

  return (
    <div className="min-h-dvh bg-bg-warm flex items-center justify-center px-4 py-8">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-light/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 카네이션 이미지 헤더 */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img
            src="/carnation.png"
            alt="카네이션"
            className="w-28 h-28 object-contain drop-shadow-md"
          />
        </motion.div>

        {/* 카드 */}
        <div className="bg-bg-card rounded-3xl shadow-xl border border-border-soft/60 overflow-hidden">
          {/* 카드 헤더 */}
          <div className="bg-gradient-to-r from-primary/8 to-primary-light/10 px-6 pt-6 pb-4 text-center">
            <motion.h1
              className="text-2xl font-bold font-serif text-text-main"
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              부모님께 마음을 전하세요
            </motion.h1>
            <motion.p
              className="text-sm text-text-sub mt-1.5"
              custom={1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              따뜻한 한 마디가 가장 큰 선물이 됩니다 💐
            </motion.p>
          </div>

          {/* 폼 영역 */}
          <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-4">
            {/* 제출 에러 메시지 */}
            {submitError && (
              <motion.div
                className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-sm text-error text-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {submitError}
              </motion.div>
            )}

            {/* 보내는 사람 / 받는 사람 (2열 레이아웃) */}
            <motion.div
              className="grid grid-cols-2 gap-3 mb-3"
              custom={2}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <FormField
                id="field-sender"
                label="보내는 사람"
                name="sender"
                placeholder="이름"
                value={formData.sender}
                error={errors.sender}
                maxLength={MAX_LENGTHS.sender}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormField
                id="field-receiver"
                label="받는 사람"
                name="receiver"
                placeholder="이름"
                value={formData.receiver}
                error={errors.receiver}
                maxLength={MAX_LENGTHS.receiver}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </motion.div>

            {/* 편지 내용 */}
            <motion.div
              className="mb-3"
              custom={3}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="field-content"
                className="block text-sm font-medium text-text-main mb-1.5"
              >
                편지 내용
              </label>
              <textarea
                id="field-content"
                name="content"
                rows={6}
                placeholder="부모님께 전하고 싶은 말을 적어주세요..."
                value={formData.content}
                maxLength={MAX_LENGTHS.content}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`
                  w-full px-4 py-3 rounded-xl border text-sm font-serif
                  leading-relaxed resize-none
                  bg-bg-warm/50 text-text-main placeholder-text-light
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  ${errors.content ? 'border-error/50 ring-1 ring-error/20' : 'border-border-soft'}
                `}
              />
              <div className="flex justify-between mt-1">
                {errors.content ? (
                  <p className="text-xs text-error">{errors.content}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-light">
                  {formData.content.length}/{MAX_LENGTHS.content}
                </span>
              </div>
            </motion.div>

            {/* 비밀번호 */}
            <motion.div
              className="mb-6"
              custom={4}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="field-password"
                className="block text-sm font-medium text-text-main mb-1.5"
              >
                비밀번호
                <span className="text-text-light font-normal ml-1.5 text-xs">
                  (숫자 4자리)
                </span>
              </label>
              <input
                id="field-password"
                type="password"
                name="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="● ● ● ●"
                value={formData.password}
                maxLength={4}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`
                  w-full px-4 py-3 rounded-xl border text-sm text-center
                  tracking-[0.5em] font-mono
                  bg-bg-warm/50 text-text-main placeholder-text-light
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  ${errors.password ? 'border-error/50 ring-1 ring-error/20' : 'border-border-soft'}
                `}
              />
              {errors.password && (
                <p className="text-xs text-error mt-1">{errors.password}</p>
              )}
            </motion.div>

            {/* 완성하기 버튼 */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3.5 rounded-2xl text-white font-semibold text-base
                transition-all duration-300 cursor-pointer
                shadow-lg shadow-primary/20
                ${
                  isSubmitting
                    ? 'bg-primary-light cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
              custom={5}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  저장 중...
                </span>
              ) : (
                '💌 완성하기'
              )}
            </motion.button>
          </form>
        </div>

        {/* 하단 안내 */}
        <motion.p
          className="text-center text-xs text-text-light mt-4"
          custom={6}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          완성된 편지의 링크를 부모님께 보내드리세요 🌷
        </motion.p>
      </motion.div>
    </div>
  );
}

/** 재사용 가능한 폼 입력 필드 컴포넌트 (SRP) */
function FormField({ id, label, name, placeholder, value, error, maxLength, onChange, onBlur }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full px-4 py-3 rounded-xl border text-sm
          bg-bg-warm/50 text-text-main placeholder-text-light
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
          ${error ? 'border-error/50 ring-1 ring-error/20' : 'border-border-soft'}
        `}
      />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}

/** 로딩 스피너 컴포넌트 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default WritePage;
