/**
 * LetterPage.jsx - 편지 열람 페이지 (SRP: 순수 UI 렌더링)
 *
 * 부모님이 공유 링크를 열었을 때 보시는 페이지입니다.
 * Framer Motion으로 카네이션이 부드럽게 나타나고,
 * 이어서 편지 내용이 감성적으로 표시됩니다.
 *
 * 데이터 조회 로직은 useLetter 훅에 위임합니다 (DIP).
 */

import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLetter } from '../hooks/useLetter';

/* ─────────────────────────────────────────
   Framer Motion 애니메이션 variants
   ───────────────────────────────────────── */

/** 꽃잎이 흩날리는 파티클 위치 (장식용) */
const petalPositions = [
  { x: '-10%', y: '20%', rotate: 45, delay: 1.2, size: 10 },
  { x: '85%', y: '15%', rotate: -30, delay: 1.5, size: 8 },
  { x: '75%', y: '70%', rotate: 60, delay: 1.8, size: 12 },
  { x: '5%', y: '65%', rotate: -45, delay: 2.0, size: 9 },
  { x: '50%', y: '10%', rotate: 20, delay: 1.3, size: 7 },
];

const carnationVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const letterCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.8,
      ease: 'easeOut',
    },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0 },
  visible: (delay) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
};

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 2.0, ease: 'easeOut' },
  },
};

function LetterPage() {
  const { id } = useParams();
  const { letter, status, error } = useLetter(id);

  return (
    <div className="min-h-dvh bg-bg-warm relative overflow-hidden">
      {/* 배경 장식 그라디언트 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-accent/5 to-transparent" />
        <div className="absolute top-1/3 -right-24 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-16 w-56 h-56 bg-accent/8 rounded-full blur-3xl" />
      </div>

      {/* 떨어지는 꽃잎 장식 */}
      <AnimatePresence>
        {status === 'success' &&
          petalPositions.map((petal, i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none z-0"
              style={{ left: petal.x, top: petal.y }}
              initial={{ opacity: 0, y: -20, rotate: 0 }}
              animate={{
                opacity: [0, 0.5, 0.3],
                y: ['-20px', '30px', '60px'],
                rotate: [0, petal.rotate, petal.rotate * 1.5],
              }}
              transition={{
                duration: 4,
                delay: petal.delay,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              <div
                className="rounded-full bg-primary-light/40"
                style={{
                  width: petal.size,
                  height: petal.size,
                }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-4 py-10">
        {status === 'loading' && <LoadingSkeleton />}
        {(status === 'error' || status === 'not-found') && (
          <ErrorState message={error} />
        )}
        {status === 'success' && letter && <LetterContent letter={letter} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   편지 내용 표시 컴포넌트 (SRP)
   ───────────────────────────────────────── */

function LetterContent({ letter }) {
  return (
    <div className="w-full max-w-lg">
      {/* 카네이션 이미지 — 핵심 애니메이션 */}
      <motion.div
        className="flex justify-center mb-8"
        variants={carnationVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          {/* 카네이션 뒤 글로우 효과 */}
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-125"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <img
            src="/carnation.png"
            alt="카네이션"
            className="relative w-40 h-40 object-contain drop-shadow-lg"
          />
        </div>
      </motion.div>

      {/* 받는 사람 호칭 */}
      <motion.p
        className="text-center text-lg text-primary font-serif font-semibold mb-4"
        custom={0.6}
        variants={textRevealVariants}
        initial="hidden"
        animate="visible"
      >
        사랑하는 {letter.receiver}께
      </motion.p>

      {/* 편지 카드 */}
      <motion.div
        className="bg-bg-card/90 backdrop-blur-sm rounded-3xl shadow-xl
          border border-border-soft/60 overflow-hidden"
        variants={letterCardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 카드 상단 장식 라인 */}
        <div className="h-1 bg-gradient-to-r from-primary-light via-primary to-primary-light" />

        {/* 편지 본문 */}
        <div className="px-7 py-8 sm:px-10 sm:py-10">
          <motion.div
            className="font-serif text-base sm:text-lg leading-loose text-text-main
              whitespace-pre-wrap break-words"
            custom={1.2}
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
          >
            {letter.content}
          </motion.div>

          {/* 보낸 사람 서명 */}
          <motion.div
            className="mt-8 pt-6 border-t border-border-soft/50 text-right"
            custom={1.6}
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base font-serif text-text-sub">
              {letter.sender} 드림
            </p>
            {letter.createdAt && (
              <p className="text-xs text-text-light mt-1.5">
                {formatDate(letter.createdAt)}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* 하단 안내 */}
      <motion.div
        className="mt-8 text-center"
        variants={footerVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="text-sm text-text-light mb-4">
          소중한 마음이 전달되었습니다 🌷
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-primary/70
            hover:text-primary font-medium transition-colors duration-200"
        >
          <HeartIcon />
          나도 편지 쓰기
        </Link>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   로딩 스켈레톤 (SRP)
   ───────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-lg animate-pulse">
      {/* 카네이션 스켈레톤 */}
      <div className="flex justify-center mb-8">
        <div className="w-36 h-36 bg-primary-light/20 rounded-full" />
      </div>
      {/* 호칭 스켈레톤 */}
      <div className="flex justify-center mb-4">
        <div className="w-40 h-6 bg-border-soft/50 rounded-lg" />
      </div>
      {/* 카드 스켈레톤 */}
      <div className="bg-bg-card/80 rounded-3xl shadow-lg border border-border-soft/40 p-8">
        <div className="space-y-3">
          <div className="h-4 bg-border-soft/40 rounded w-full" />
          <div className="h-4 bg-border-soft/40 rounded w-11/12" />
          <div className="h-4 bg-border-soft/40 rounded w-10/12" />
          <div className="h-4 bg-border-soft/40 rounded w-full" />
          <div className="h-4 bg-border-soft/40 rounded w-8/12" />
        </div>
        <div className="mt-8 pt-6 border-t border-border-soft/30 flex justify-end">
          <div className="w-24 h-5 bg-border-soft/40 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   에러/Not Found 상태 (SRP)
   ───────────────────────────────────────── */

function ErrorState({ message }) {
  return (
    <motion.div
      className="w-full max-w-sm text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-6xl mb-4">💌</div>
      <h2 className="text-xl font-bold font-serif text-text-main mb-2">
        편지를 찾을 수 없어요
      </h2>
      <p className="text-sm text-text-sub mb-6 leading-relaxed">
        {message || '링크가 올바른지 확인해 주세요.'}
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-dark
          text-white rounded-2xl font-medium text-sm shadow-lg shadow-primary/20
          hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        새 편지 쓰기
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   유틸리티 함수 & 아이콘 (SRP)
   ───────────────────────────────────────── */

/** Firestore Timestamp를 읽기 좋은 날짜 형식으로 변환 */
function formatDate(timestamp) {
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

/** 하트 아이콘 */
function HeartIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
        2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81
        14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4
        6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

export default LetterPage;
