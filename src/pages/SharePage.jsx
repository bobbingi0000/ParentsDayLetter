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
 *   - 체크마크 색상  → from-success to-success/80 (success 색을 @theme에서 변경)
 *   - 카드 스타일    → rounded-3xl, shadow-xl (WritePage와 동일하게 통일됨)
 *   - 복사 버튼 색   → from-primary to-primary-dark (복사 전) / bg-success (복사 후)
 *   - 안내 문구 수정 → ShareGuideItem의 icon, text props 수정
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
   ─────────────────────────────────────────────────────
   containerVariants : 자식 요소들이 staggerChildren 간격으로 순서대로 나타남
   itemVariants      : 각 항목이 아래에서 위로 fade-in
   checkmarkVariants : 체크마크 원이 스프링 효과로 튀어오름
   ───────────────────────────────────────────────────── */

/** 전체 컨테이너 — 자식이 0.12초 간격으로 순서대로 등장 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,  // ✏️ 항목 간 등장 간격 (초)
      delayChildren: 0.1,     // ✏️ 첫 항목 등장까지 딜레이
    },
  },
};

/** 개별 항목 — 아래에서 위로 올라오며 나타남 */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * 체크마크 원 — 스프링 효과로 튀어오름
 * stiffness : 스프링 강도 (높을수록 빠르고 탱탱함)
 * damping   : 감쇠 (낮을수록 더 많이 튕김)
 * ✏️ 더 부드럽게: stiffness: 100, damping: 20
 * ✏️ 더 탱탱하게: stiffness: 400, damping: 10
 */
const checkmarkVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
  },
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

      {/*
       * 🎨 배경 장식
       * WritePage와 다른 색상 조합: 초록(success)과 분홍(primary-light)
       * ✏️ 없애고 싶으면 이 <div> 전체 삭제
       */}
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
        {/*
         * ✅ 성공 체크마크 원
         * w-20 h-20          : 원 크기 80px. ✏️ 크게: w-24 h-24
         * rounded-full       : 완전한 원
         * bg-gradient-to-br  : 오른쪽 아래 방향 그라디언트
         * from-success       : 밝은 초록 → success/80 (80% 불투명 초록)
         * shadow-success/25  : 초록 그림자 (25% 투명도)
         *
         * ✏️ 초록 체크 대신 분홍으로: from-primary to-primary-dark
         */}
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
              {/* SVG path가 서서히 그려지는 애니메이션 (pathLength 0→1) */}
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

        {/*
         * 🃏 메인 카드
         * WritePage 카드와 동일한 스타일 (rounded-3xl shadow-xl)
         */}
        <motion.div
          className="bg-bg-card rounded-3xl shadow-xl border border-border-soft/60 overflow-hidden"
          variants={itemVariants}
        >
          {/* ── 카드 헤더 ── */}
          <div className="px-6 pt-6 pb-4 text-center">
            <motion.h1
              className="text-2xl font-bold font-serif text-text-main"
              variants={itemVariants}
            >
              편지가 완성되었어요! 💌  {/* ✏️ 제목 텍스트 */}
            </motion.h1>
            <motion.p
              className="text-sm text-text-sub mt-2 leading-relaxed"
              variants={itemVariants}
            >
              아래 링크를 부모님께 보내드리면<br />
              따뜻한 마음이 전달됩니다.  {/* ✏️ 부제목 텍스트 */}
            </motion.p>
          </div>

          {/*
           * 🔗 편지 링크 표시 영역
           * readOnly         : 직접 수정 불가 (읽기 전용)
           * font-mono        : 고정폭 폰트 (URL이 깔끔하게 보임)
           * pr-12            : 오른쪽에 아이콘 공간 확보 (48px)
           * onClick select() : 클릭 시 전체 URL 자동 선택
           */}
          <motion.div className="px-6 pb-2" variants={itemVariants}>
            <label
              htmlFor="share-url"
              className="block text-xs font-medium text-text-light mb-2 uppercase tracking-wider"
            >
              편지 링크  {/* ✏️ 라벨 텍스트 */}
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
              {/* 우측 링크 아이콘 */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <LinkIcon />
              </div>
            </div>
          </motion.div>

          {/*
           * 📋 링크 복사 버튼
           * 복사 전: 분홍 그라디언트 배경 + "링크 복사하기"
           * 복사 후: 초록 배경 + "복사 완료!" (2.5초 후 자동으로 원래대로)
           *
           * ✏️ 버튼 높이: py-3.5 → py-4 (더 크게)
           * ✏️ 버튼 모서리: rounded-2xl → rounded-xl (덜 둥글게)
           */}
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
                  복사 완료!  {/* ✏️ 복사 후 텍스트 */}
                </>
              ) : (
                <>
                  <CopyIcon />
                  링크 복사하기  {/* ✏️ 복사 전 텍스트 */}
                </>
              )}
            </motion.button>

            {/* 복사 실패 시 에러 메시지 (Clipboard API 미지원 브라우저 등) */}
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

          {/* ── 구분선 ── */}
          <div className="mx-6 border-t border-border-soft/60" />

          {/*
           * 💬 공유 안내 항목 3개
           * 아이콘(emoji) + 설명 텍스트 형태입니다.
           * ✏️ 항목 추가: <ShareGuideItem icon="🎁" text="새로운 안내" /> 추가
           * ✏️ 항목 삭제: 해당 <ShareGuideItem .../> 줄 삭제
           * ✏️ 간격: gap-3 → gap-4 (항목 사이 간격)
           * ✏️ 위아래 패딩: py-5 → py-6
           */}
          <motion.div
            className="px-6 py-5 flex flex-col gap-3"
            variants={itemVariants}
          >
            <ShareGuideItem
              icon="💬"
              text="카카오톡이나 문자로 링크를 보내보세요."  /* ✏️ */
            />
            <ShareGuideItem
              icon="🔒"
              text="편지는 안전하게 보관됩니다."  /* ✏️ */
            />
            <ShareGuideItem
              icon="🌷"
              text="부모님이 링크를 열면 카네이션과 함께 편지를 읽을 수 있어요."  /* ✏️ */
            />
          </motion.div>
        </motion.div>

        {/*
         * 🔗 하단 네비게이션 링크
         * 편지 미리보기: /letter/:id로 이동 (받는 사람이 보는 화면)
         * 새로운 편지 쓰기: / 홈으로 이동
         *
         * ✏️ 링크를 없애고 싶으면 해당 <Link> 태그 삭제
         */}
        <motion.div
          className="flex flex-col items-center gap-3 mt-6"
          variants={itemVariants}
        >
          <Link
            to={`/letter/${id}`}
            className="text-sm text-primary hover:text-primary-dark font-medium
              transition-colors duration-200 underline underline-offset-4 decoration-primary/30
              hover:decoration-primary"
          >
            내 편지 미리보기 →  {/* ✏️ 링크 텍스트 */}
          </Link>

          <Link
            to="/"
            className="text-xs text-text-light hover:text-text-sub transition-colors duration-200"
          >
            새로운 편지 쓰기  {/* ✏️ 링크 텍스트 */}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   공유 안내 항목 컴포넌트
   ─────────────────────────────────────────────────────
   icon : 이모지 (왼쪽에 고정 크기로 표시)
   text : 설명 텍스트
   ───────────────────────────────────────────────────── */
function ShareGuideItem({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      {/* 아이콘: flex-shrink-0으로 텍스트가 길어도 찌그러지지 않음 */}
      <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
        {icon}
      </span>
      {/* 설명 텍스트: leading-relaxed로 줄 간격 넉넉하게 */}
      <p className="text-sm text-text-sub leading-relaxed">{text}</p>
    </div>
  );
}

/* ─── 아이콘 컴포넌트들 (SVG) ─── */

/** 링크 아이콘 — URL 입력창 우측에 표시 */
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

/** 복사 아이콘 — 복사 버튼에 표시 (복사 전 상태) */
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

/** 체크 아이콘 — 복사 버튼에 표시 (복사 후 상태) */
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
