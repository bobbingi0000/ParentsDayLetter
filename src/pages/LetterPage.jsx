/**
 * =====================================================================
 * LetterPage.jsx — 편지 열람 페이지
 * =====================================================================
 *
 * 📌 이 페이지가 언제 열리나요?
 *   부모님이 공유 링크를 클릭했을 때 열리는 페이지입니다.
 *   URL 예시: /letter/abc123XYZ
 *
 * 📌 이 파일의 역할
 *   Firestore에서 편지 데이터를 가져와 감성적으로 표시합니다.
 *   데이터 조회 로직은 src/hooks/useLetter.js 에 있습니다.
 *
 * 📌 애니메이션 순서 (타임라인)
 *   0.0초 : 카네이션 이미지 fade-in + scale (1.2초 동안)
 *   0.6초 : 카네이션 뒤 글로우 효과 등장
 *   0.6초 : "사랑하는 OOO께" 텍스트 등장
 *   0.8초 : 편지 카드 슬라이드업
 *   1.2초 : 편지 본문 텍스트 등장
 *   1.6초 : "OOO 드림" 서명 등장
 *   2.0초 : 하단 안내 + "나도 편지 쓰기" 링크 등장
 *   + 꽃잎 파티클 5개가 무한 반복으로 떠다님
 *
 * 📌 디자인 수정 가이드
 *   - 카네이션 이미지 크기 → w-40 h-40 (160px) 수정
 *   - 편지 카드 최대 너비  → max-w-lg (512px) 수정
 *   - 편지 본문 폰트 크기  → text-base sm:text-lg 수정
 *   - 상단 색상 라인        → h-1 bg-gradient-to-r 수정
 *   - 꽃잎 수/크기/위치    → petalPositions 배열 수정
 * =====================================================================
 */

import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLetter } from '../hooks/useLetter';

/* ─────────────────────────────────────────────────────
   꽃잎 파티클 설정
   ─────────────────────────────────────────────────────
   편지 로드 성공 시 화면 주변에 떠다니는 분홍 원형 파티클입니다.
   각 객체의 의미:
     x      : 화면 왼쪽에서의 거리 (%)
     y      : 화면 위에서의 거리 (%)
     rotate : 회전 각도
     delay  : 등장 딜레이 (초)
     size   : 원 크기 (px)

   ✏️ 파티클을 없애려면: 아래 <AnimatePresence> 블록 전체 삭제
   ✏️ 파티클 추가: 객체를 하나 더 추가하세요
   ✏️ 크기 조절: size 값 변경
   ✏️ 색상 변경: rounded-full bg-primary-light/40 → bg-accent/40
   ───────────────────────────────────────────────────── */
const petalPositions = [
  { x: '-10%', y: '20%', rotate: 45, delay: 1.2, size: 10 }, // 왼쪽 중간
  { x: '85%', y: '15%', rotate: -30, delay: 1.5, size: 8 }, // 오른쪽 위
  { x: '75%', y: '70%', rotate: 60, delay: 1.8, size: 12 }, // 오른쪽 아래
  { x: '5%', y: '65%', rotate: -45, delay: 2.0, size: 9 }, // 왼쪽 아래
  { x: '50%', y: '10%', rotate: 20, delay: 1.3, size: 7 }, // 상단 가운데
];

/* ─────────────────────────────────────────────────────
   애니메이션 variants
   ─────────────────────────────────────────────────────
   ✏️ duration 값을 줄이면 더 빠르게, 늘리면 더 느리게
   ✏️ ease 옵션: 'easeOut', 'easeIn', 'easeInOut', 'linear'
   ───────────────────────────────────────────────────── */

/**
 * 카네이션 이미지 애니메이션
 * scale: 0.3 → 1 (작게 시작해서 원래 크기로)
 * y: 40 → 0 (40px 아래에서 위로 올라옴)
 * ease: cubic-bezier 커스텀 (자연스러운 감속)
 */
const carnationVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.2,               // ✏️ 애니메이션 시간 (초)
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier
    },
  },
};

/**
 * 편지 카드 애니메이션
 * delay: 0.8초 후 등장 (카네이션보다 늦게)
 */
const letterCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,  // ✏️ 슬라이드업 시간
      delay: 0.8,     // ✏️ 등장 딜레이 (카네이션 이후)
      ease: 'easeOut',
    },
  },
};

/**
 * 텍스트 순차 등장 애니메이션
 * custom={딜레이초}로 각 텍스트마다 다른 딜레이 설정
 * 사용: custom={0.6} → 0.6초 후 등장
 */
const textRevealVariants = {
  hidden: { opacity: 0 },
  visible: (delay) => ({
    opacity: 1,
    transition: { duration: 0.6, delay }, // ✏️ 텍스트 fade-in 시간
  }),
};

/** 하단 안내 영역 애니메이션 (맨 마지막에 등장) */
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 2.0,   // ✏️ 모든 것이 나타난 후 마지막으로 등장
      ease: 'easeOut',
    },
  },
};

/* ─────────────────────────────────────────────────────
   메인 컴포넌트
   ───────────────────────────────────────────────────── */
function LetterPage() {
  // URL에서 편지 ID 추출
  const { id } = useParams();

  // Firestore에서 편지 데이터 조회
  // status: 'idle' | 'loading' | 'success' | 'error' | 'not-found'
  const { letter, status, error } = useLetter(id);

  return (
    /*
     * 📐 페이지 전체 래퍼
     * relative overflow-hidden : 꽃잎 파티클이 화면 밖으로 나가지 않게
     */
    <div className="min-h-dvh bg-bg-warm relative overflow-hidden">

      {/*
       * 🎨 배경 장식 그라디언트
       * 상단: 위에서 아래로 연한 분홍 그라디언트
       * 하단: 아래에서 위로 연한 골드 그라디언트
       * 옆: 두 개의 블러 원 (오른쪽 위, 왼쪽 아래)
       *
       * ✏️ 없애고 싶으면 이 <div> 전체 삭제
       * ✏️ 색상 변경: from-primary/5 → from-accent/5
       */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-accent/5 to-transparent" />
        <div className="absolute top-1/3 -right-24 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-16 w-56 h-56 bg-accent/8 rounded-full blur-3xl" />
      </div>

      {/*
       * 🌸 꽃잎 파티클 애니메이션
       * AnimatePresence : 조건부 렌더링 요소에 exit 애니메이션 적용 가능
       * status === 'success' 일 때만 표시됩니다.
       *
       * 각 파티클:
       * - opacity: 0 → 0.5 → 0.3 (나타났다 살짝 흐려짐)
       * - y: 위아래로 움직임 (reverse로 왔다갔다)
       * - rotate: 회전
       * - repeat: Infinity → 무한 반복
       */}
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
                duration: 4,                // ✏️ 파티클 한 사이클 시간
                delay: petal.delay,
                repeat: Infinity,
                repeatType: 'reverse',      // 왔다갔다
                ease: 'easeInOut',
              }}
            >
              {/*
               * 파티클 원형 요소
               * ✏️ 색상: bg-primary-light/40 → bg-accent/40 (골드빛)
               * ✏️ 모양: rounded-full(원) → rounded-lg(사각)
               */}
              <div
                className="rounded-full bg-primary-light/40"
                style={{ width: petal.size, height: petal.size }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {/*
       * 📌 메인 콘텐츠 영역
       * z-10 : 배경 장식(z-0)과 파티클(z-0) 위에 표시
       * px-4 py-10 : 좌우 16px, 위아래 40px 패딩
       *
       * 상태별로 다른 컴포넌트 렌더링:
       * - loading   → 로딩 스켈레톤 (회색 플레이스홀더)
       * - error     → 에러 메시지 + 새 편지 쓰기 버튼
       * - not-found → 에러 메시지 (편지를 찾을 수 없음)
       * - success   → 실제 편지 내용
       */}
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

/* ─────────────────────────────────────────────────────
   편지 내용 컴포넌트
   ─────────────────────────────────────────────────────
   편지 로드 성공 시 표시되는 핵심 컴포넌트입니다.
   ───────────────────────────────────────────────────── */
function LetterContent({ letter }) {
  return (
    <div className="w-full max-w-md flex flex-col items-center">

      {/*
       * 🌹 카네이션 아이콘 (WritePage와 동일한 스타일)
       */}
      <motion.div
        className="flex justify-center mb-2 translate-x-3"
        variants={carnationVariants}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: '4px' }}
      >
        <img src="/carnation.svg" alt="카네이션" className="w-[70px] h-[70px] object-contain" />
      </motion.div>

      {/*
       * 💌 받는 사람 호칭 텍스트
       * "사랑하는 OO께" — WritePage 제목과 동일한 스타일
       */}
      <motion.p
        className="text-center text-[35px] font-normal text-text-main mb-6"
        custom={0.6}
        variants={textRevealVariants}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: '20px' }}
      >
        사랑하는 {letter.receiver}께
      </motion.p>


      <div className="w-full max-w-[330px] mx-auto">
        {/*
       * 📝 편지 본문 — WritePage의 letterarea와 동일한 크기/디자인
       * w-full max-w-[330px] h-[352px] : WritePage textarea와 동일
       * letterarea.svg 배경 사용
       */}
        <motion.div
          className="w-full flex justify-center"
          variants={letterCardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-full max-w-[330px] mx-auto h-[352px]">
            {/* 배경 레이어 */}
            <div className="absolute inset-0 bg-[#FFFEFB] rounded-[10px]" />

            {/* letterarea.svg 테두리 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url('/letterarea.svg')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* 편지 본문 텍스트 */}
            <motion.div
              className="relative z-10 w-full h-full overflow-y-auto text-[18px] leading-loose text-text-main whitespace-pre-wrap break-words"
              style={{ padding: '20px' }}
              custom={1.2}
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
            >
              {letter.content}
            </motion.div>
          </div>
        </motion.div>

        {/*
       * ✍️ 보낸 사람 서명 + 날짜 (오른쪽 정렬)
       */}
        <motion.div
          className="w-full max-w-[330px] mx-auto text-right"
          custom={1.6}
          variants={textRevealVariants}
          initial="hidden"
          animate="visible"
          style={{
            marginTop: '4px',
            marginBottom: '8px'
          }}
        >
          {letter.createdAt && (
            <p className="text-[18px] text-text-main">
              {formatDate(letter.createdAt)}
            </p>
          )}
          <div className="flex items-center justify-end gap-1">
            <span className="inline-block min-w-[70px] px-4 py-0.5 rounded-full bg-secondary text-[18px] text-center text-text-main">
              {letter.sender}
            </span>
            <span className="text-[18px] text-text-main">올림</span>
          </div>
        </motion.div>

        {/*
       * 🌷 하단 "나도 편지 쓰기" 링크
       */}
        <motion.div
          className="mt-8 text-center"
          variants={footerVariants}
          initial="hidden"
          animate="visible"
        >
          <Link
            to="/"
            className="text-[14px] text-primary hover:text-primary-dark font-medium
            transition-colors duration-200 underline underline-offset-4 decoration-primary/30
            hover:decoration-primary"
          >
            나도 편지 쓰기 →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   로딩 스켈레톤 컴포넌트
   ─────────────────────────────────────────────────────
   Firestore에서 데이터를 가져오는 동안 표시되는
   회색 플레이스홀더 UI입니다.
   animate-pulse : Tailwind 기본 맥박 애니메이션 (밝아졌다 어두워졌다)

   ✏️ 로딩 시간이 너무 짧아서 잘 안 보인다면:
   브라우저 네트워크 탭에서 "Slow 3G"로 시뮬레이션해보세요.
   ───────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="w-full max-w-lg animate-pulse">
      {/* 카네이션 이미지 자리 */}
      <div className="flex justify-center mb-8">
        <div className="w-36 h-36 bg-primary-light/20 rounded-full" />
      </div>
      {/* 호칭 텍스트 자리 */}
      <div className="flex justify-center mb-4">
        <div className="w-40 h-6 bg-border-soft/50 rounded-lg" />
      </div>
      {/* 편지 카드 자리 */}
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

/* ─────────────────────────────────────────────────────
   에러 / 편지 없음 상태 컴포넌트
   ─────────────────────────────────────────────────────
   편지 ID가 잘못되었거나 Firestore 오류 시 표시됩니다.
   ───────────────────────────────────────────────────── */
function ErrorState({ message }) {
  return (
    <motion.div
      className="w-full max-w-sm text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-6xl mb-4">💌</div>  {/* ✏️ 이모지 */}
      <h2 className="text-xl font-bold font-serif text-text-main mb-2">
        편지를 찾을 수 없어요  {/* ✏️ 에러 제목 */}
      </h2>
      <p className="text-sm text-text-sub mb-6 leading-relaxed">
        {message || '링크가 올바른지 확인해 주세요.'}  {/* ✏️ 기본 에러 메시지 */}
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-dark
          text-white rounded-2xl font-medium text-sm shadow-lg shadow-primary/20
          hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        새 편지 쓰기  {/* ✏️ 버튼 텍스트 */}
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   유틸리티 함수
   ───────────────────────────────────────────────────── */

/**
 * Firestore Timestamp를 한국어 날짜 문자열로 변환
 * 결과 예시: "2026년 5월 8일"
 *
 * ✏️ 형식 변경 예시:
 *   year:'2-digit' → '26년'
 *   month:'2-digit' → '05월'
 *   day:'2-digit'  → '08일'
 *   시간 추가: hour:'numeric', minute:'numeric'
 */
function formatDate(timestamp) {
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return ''; // 날짜 파싱 실패 시 빈 문자열
  }
}

/** 하트 아이콘 — "나도 편지 쓰기" 링크 옆에 표시 */
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
