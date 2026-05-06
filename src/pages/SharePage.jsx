/**
 * =====================================================================
 * SharePage.jsx — 공유 완료 페이지
 * =====================================================================
 *
 * 📌 이 페이지가 언제 열리나요?
 *   편지 작성 완료 후 자동으로 이동되는 페이지입니다.
 *   URL 예시: /share/abc123XYZ
 *
 * 📌 이 파일의 역할
 *   완성된 편지의 열람 링크를 표시하고 클립보드 복사를 제공합니다.
 *   클립보드 로직은 src/hooks/useClipboard.js에 있습니다.
 *
 * 📌 디자인 수정 가이드
 *   - SharePage.png 디자인 시안과 동일하게 구성
 *   - 상단 편지 아이콘 (heart + lettericon)
 *   - 손글씨체 제목
 *   - 편지 링크 영역 (둥근 테두리)
 *   - outline 스타일 복사 버튼
 *   - heartdot 불릿 안내 항목
 *   - 하단 미리보기/새 편지 링크
 * =====================================================================
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClipboard } from '../hooks/useClipboard';

/**
 * 편지 열람 URL 생성
 * window.location.origin = 현재 도메인 (예: https://example.com)
 * 결과 예시: https://example.com/letter/abc123XYZ
 */
function buildLetterUrl(id) {
  return `${window.location.origin}/letter/${id}`;
}

/* ─────────────────────────────────────────────────────
   애니메이션 설정 (Framer Motion)
   ───────────────────────────────────────────────────── */

/** 페이지 전체가 아래에서 위로 올라오는 애니메이션 */
const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/** 각 항목이 순서대로 나타나는 애니메이션 */
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      duration: 0.45,
      ease: 'easeOut',
    },
  }),
};

/* ─────────────────────────────────────────────────────
   메인 컴포넌트
   ───────────────────────────────────────────────────── */
function SharePage() {
  // URL에서 편지 ID 추출 (예: /share/abc123 → id = 'abc123')
  const { id } = useParams();
  const letterUrl = buildLetterUrl(id);

  // 클립보드 복사 기능 (useClipboard.js에서 관리)
  const { isCopied, copyError, copyToClipboard } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(letterUrl);
  };

  return (
    /*
     * 📐 페이지 전체 레이아웃
     * WritePage와 동일한 구조: 화면 가운데 정렬, 따뜻한 배경색
     */
    <div className="min-h-dvh bg-bg-warm flex items-center justify-center px-4 py-8">

      {/* 🎨 배경 장식 */}
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
        {/*
         * 🌸 상단 편지 아이콘 (heart + lettericon)
         * WritePage와 동일한 아이콘 조합 사용
         */}
        <motion.div
          className="flex justify-center items-end gap-3 mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img src="/heart.svg" alt="하트" className="w-[20px] h-[20px] object-contain -translate-y-5 -rotate-25" />
          <img src="/lettericon.svg" alt="편지봉투" className="w-[50px] h-[50px] object-contain" />
        </motion.div>

        {/*
         * 📝 제목 — 손글씨체, 큰 텍스트
         */}
        <motion.h1
          className="text-[35px] font-normal font-serif text-text-main text-center"
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '30px' }}
        >
          편지가 완성되었어요!
        </motion.h1>

        {/*
         * 🔗 편지 링크 영역
         */}
        <motion.div
          className="w-full flex flex-col items-center"
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '2px' }}
        >
          <p className="text-[18px] text-text-main mb-1">편지 링크:</p>
          <div className="relative w-full max-w-[330px] h-[50px]">
            {/* urlarea.svg 배경 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url('/urlarea.svg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <input
              id="share-url"
              type="text"
              readOnly
              value={letterUrl}
              className="relative z-10 w-full h-full px-4
                bg-transparent text-[16px] text-center text-text-sub
                select-all cursor-text focus:outline-none"
              onClick={(e) => e.target.select()}
            />
          </div>
        </motion.div>

        {/*
         * 📋 링크 복사 버튼
         */}
        <motion.div
          className="w-full flex flex-col items-center"
          custom={2}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{
            marginTop: '-4px',
            marginBottom: '28px'
          }}
        >
          <motion.button
            type="button"
            onClick={handleCopy}
            disabled={isCopied}
            className={`
              relative w-full max-w-[330px] h-[32px] font-normal text-[18px]
              transition-all duration-300 cursor-pointer
              flex items-center justify-center gap-2
              ${isCopied
                ? 'text-success'
                : 'text-text-main hover:text-primary active:scale-[0.98]'
              }
            `}
            whileTap={!isCopied ? { scale: 0.98 } : {}}
          >
            {/* urlarea.svg 버튼 프레임 배경 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: '#FFD2D2',
                borderRadius: '20px',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {isCopied ? (
                <>
                  <CheckIcon />
                  복사 완료!
                </>
              ) : (
                <>
                  <img src="/copysign.svg" alt="" className="w-[18px] h-[18px]" aria-hidden="true" />
                  링크 복사하기
                </>
              )}
            </span>
          </motion.button>

          {/* 복사 실패 시 에러 메시지 */}
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

        {/*
         * 💬 안내 항목 — heartdot 불릿 사용
         */}
        <motion.div
          className="w-full flex flex-col items-center gap-1.5 text-text-main"
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '16px' }}
        >
          <ShareGuideItem
            text="카카오톡이나 문자로 링크를 보내보세요."
          />
          <ShareGuideItem
            text="편지는 안전하게 보관되었다 한 달 후 삭제 예정입니다."
          />
          <ShareGuideItem
            text="부모님께서 링크를 열면 카네이션과 함께 편지를 읽을 수 있어요."
          />
        </motion.div>

        {/*
         * 🔗 하단 네비게이션 링크
         */}
        <motion.div
          className="flex flex-col items-center gap-2"
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Link
            to={`/letter/${id}`}
            className="text-[14px] text-primary hover:text-primary-dark font-medium
              transition-colors duration-200 underline underline-offset-4 decoration-primary/30
              hover:decoration-primary"
            style={{ marginBottom: '-4px' }}
          >
            내 편지 미리보기 →
          </Link>

          <Link
            to="/"
            className="text-[12px] text-text-light hover:text-text-sub transition-colors duration-200"
          >
            새로운 편지 쓰기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   공유 안내 항목 컴포넌트 — heartdot 아이콘 사용
   ───────────────────────────────────────────────────── */
function ShareGuideItem({ text }) {
  return (
    <div className="flex items-start gap-2">
      {/* heartdot 아이콘 (SVG 이미지) */}
      <img
        src="/heartdot.svg"
        alt=""
        className="w-[14px] h-[14px] object-contain flex-shrink-0 mt-[5px]"
        aria-hidden="true"
      />
      <p className="text-[13px] text-text-main leading-relaxed">{text}</p>
    </div>
  );
}

/* ─── 아이콘 컴포넌트 (SVG) ─── */

/** 체크 아이콘 — 복사 버튼에 표시 (복사 후 상태) */
function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
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
