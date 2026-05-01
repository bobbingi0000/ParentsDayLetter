/**
 * SharePage.jsx - 공유 완료 페이지 (SRP: 순수 UI 렌더링)
 *
 * 편지 저장 완료 후 도착하는 페이지.
 * 생성된 편지의 열람 URL을 표시하고, 클립보드 복사 기능을 제공합니다.
 * 클립보드 로직은 useClipboard 훅에 위임합니다 (DIP).
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClipboard } from '../hooks/useClipboard';

/** 편지 열람 URL 생성 유틸 */
function buildLetterUrl(id) {
  return `${window.location.origin}/letter/${id}`;
}

/** Framer Motion 애니메이션 variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const checkmarkVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
  },
};

function SharePage() {
  const { id } = useParams();
  const letterUrl = buildLetterUrl(id);
  const { isCopied, copyError, copyToClipboard } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(letterUrl);
  };

  return (
    <div className="min-h-dvh bg-bg-warm flex items-center justify-center px-4 py-8">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-16 w-56 h-56 bg-success/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-primary-light/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 성공 체크마크 */}
        <motion.div
          className="flex justify-center mb-6"
          variants={checkmarkVariants}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg shadow-success/25">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* 카드 */}
        <motion.div
          className="bg-bg-card rounded-3xl shadow-xl border border-border-soft/60 overflow-hidden"
          variants={itemVariants}
        >
          {/* 헤더 */}
          <div className="px-6 pt-6 pb-4 text-center">
            <motion.h1
              className="text-2xl font-bold font-serif text-text-main"
              variants={itemVariants}
            >
              편지가 완성되었어요! 💌
            </motion.h1>
            <motion.p
              className="text-sm text-text-sub mt-2 leading-relaxed"
              variants={itemVariants}
            >
              아래 링크를 부모님께 보내드리면<br />
              따뜻한 마음이 전달됩니다.
            </motion.p>
          </div>

          {/* URL 표시 영역 */}
          <motion.div className="px-6 pb-2" variants={itemVariants}>
            <label
              htmlFor="share-url"
              className="block text-xs font-medium text-text-light mb-2 uppercase tracking-wider"
            >
              편지 링크
            </label>
            <div className="relative">
              <input
                id="share-url"
                type="text"
                readOnly
                value={letterUrl}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-border-soft
                  bg-bg-warm/60 text-sm text-text-main font-mono
                  select-all cursor-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                onClick={(e) => e.target.select()}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <LinkIcon />
              </div>
            </div>
          </motion.div>

          {/* 복사 버튼 */}
          <motion.div className="px-6 pb-6 pt-3" variants={itemVariants}>
            <motion.button
              type="button"
              onClick={handleCopy}
              disabled={isCopied}
              className={`
                w-full py-3.5 rounded-2xl font-semibold text-base
                transition-all duration-300 cursor-pointer
                flex items-center justify-center gap-2
                ${
                  isCopied
                    ? 'bg-success text-white shadow-lg shadow-success/20'
                    : 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
              whileTap={!isCopied ? { scale: 0.98 } : {}}
            >
              {isCopied ? (
                <>
                  <CheckIcon />
                  복사 완료!
                </>
              ) : (
                <>
                  <CopyIcon />
                  링크 복사하기
                </>
              )}
            </motion.button>

            {/* 복사 에러 메시지 */}
            {copyError && (
              <motion.p
                className="text-xs text-error text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {copyError}
              </motion.p>
            )}
          </motion.div>

          {/* 구분선 */}
          <div className="mx-6 border-t border-border-soft/60" />

          {/* 추가 안내 */}
          <motion.div
            className="px-6 py-5 flex flex-col gap-3"
            variants={itemVariants}
          >
            <ShareGuideItem
              icon="💬"
              text="카카오톡이나 문자로 링크를 보내보세요."
            />
            <ShareGuideItem
              icon="🔒"
              text="편지는 안전하게 보관됩니다."
            />
            <ShareGuideItem
              icon="🌷"
              text="부모님이 링크를 열면 카네이션과 함께 편지를 읽을 수 있어요."
            />
          </motion.div>
        </motion.div>

        {/* 하단 네비게이션 */}
        <motion.div
          className="flex flex-col items-center gap-3 mt-6"
          variants={itemVariants}
        >
          {/* 편지 미리보기 링크 */}
          <Link
            to={`/letter/${id}`}
            className="text-sm text-primary hover:text-primary-dark font-medium
              transition-colors duration-200 underline underline-offset-4 decoration-primary/30
              hover:decoration-primary"
          >
            내 편지 미리보기 →
          </Link>

          {/* 새 편지 쓰기 */}
          <Link
            to="/"
            className="text-xs text-text-light hover:text-text-sub transition-colors duration-200"
          >
            새로운 편지 쓰기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** 공유 안내 항목 컴포넌트 (SRP) */
function ShareGuideItem({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <p className="text-sm text-text-sub leading-relaxed">{text}</p>
    </div>
  );
}

/** 링크 아이콘 */
function LinkIcon() {
  return (
    <svg
      className="w-4 h-4 text-text-light"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

/** 복사 아이콘 */
function CopyIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

/** 체크 아이콘 */
function CheckIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default SharePage;
