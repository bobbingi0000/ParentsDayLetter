/**
 * =====================================================================
 * WritePage.jsx — 편지 작성 페이지
 * =====================================================================
 *
 * 📌 이 파일의 역할
 *   사용자가 편지를 작성하는 메인 입력 폼 페이지입니다.
 *   이 파일은 "어떻게 보여줄지(UI)"만 담당합니다.
 *
 * 📌 로직은 어디에?
 *   - 폼 상태관리 / 제출 로직 → src/hooks/useLetterForm.js
 *   - 유효성 검사 규칙        → src/utils/validators.js
 *   - XSS 방지 입력 정화     → src/utils/sanitize.js
 *   - Firestore 저장         → src/services/letterService.js
 *
 * 📌 디자인 수정 가이드
 *   - 전체 배경색    → className="... bg-bg-warm ..."  (index.css @theme에서 변경)
 *   - 카드 모양      → className="... rounded-3xl ..."  (rounded-2xl로 줄이면 덜 둥글어짐)
 *   - 카드 그림자    → className="... shadow-xl ..."    (shadow-lg: 작게, shadow-2xl: 크게)
 *   - 버튼 색상      → from-primary to-primary-dark     (@theme에서 primary 색 변경)
 *   - 이미지 크기    → className="w-28 h-28 ..."        (w-36 h-36으로 키울 수 있음)
 *   - 카드 최대 너비 → className="... max-w-md ..."     (max-w-lg로 넓히기 가능)
 * =====================================================================
 */

import { motion } from 'framer-motion';
import { useLetterForm } from '../hooks/useLetterForm';
import { MAX_LENGTHS } from '../utils/validators';

/* ─────────────────────────────────────────────────────
   애니메이션 설정 (Framer Motion)
   ─────────────────────────────────────────────────────
   ✏️ 애니메이션을 없애고 싶다면: initial/animate 속성을 삭제하세요.
   ✏️ 더 빠르게: duration 값을 줄이세요 (0.6 → 0.3)
   ✏️ 더 느리게: duration 값을 늘리세요 (0.6 → 1.0)
   ───────────────────────────────────────────────────── */

/** 페이지 전체가 아래에서 위로 올라오는 애니메이션 */
const pageVariants = {
  hidden: { opacity: 0, y: 30 }, // 시작: 투명 + 30px 아래
  visible: {
    opacity: 1,
    y: 0,                        // 끝: 불투명 + 원래 위치
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * 폼 각 항목이 순서대로 나타나는 애니메이션
 * custom={숫자} 로 딜레이를 조절합니다.
 * custom={0} → 즉시, custom={2} → 0.3초 후, custom={4} → 0.6초 후
 */
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i, // ✏️ 항목 간 간격: 0.15 → 더 빠르게 0.08, 더 느리게 0.25
      duration: 0.45,
      ease: 'easeOut',
    },
  }),
};

/* ─────────────────────────────────────────────────────
   메인 컴포넌트
   ───────────────────────────────────────────────────── */
function WritePage() {
  // 폼 상태 및 이벤트 핸들러를 훅에서 가져옵니다.
  const {
    formData,      // 현재 입력값 { sender, receiver, content, password }
    errors,        // 유효성 검사 에러 { sender: '에러메시지', ... }
    isSubmitting,  // 제출 중 여부 (true면 버튼 비활성화)
    submitError,   // 서버 저장 실패 에러 메시지
    handleChange,  // input onChange 핸들러
    handleBlur,    // input onBlur 핸들러 (포커스 아웃 시 검증)
    handleSubmit,  // form onSubmit 핸들러
  } = useLetterForm();

  return (
    /*
     * 📐 페이지 전체 레이아웃
     * min-h-dvh        : 화면 전체 높이
     * bg-bg-warm       : 배경색 (index.css @theme에서 수정)
     * flex items-center justify-center : 수직/수평 가운데 정렬
     * px-4 py-8        : 좌우 패딩 16px, 위아래 패딩 32px
     *                    ✏️ 모바일에서 더 여유있게: px-6
     */
    <div className="min-h-dvh bg-bg-warm flex items-center justify-center px-4 py-8">

      {/*
       * 🎨 배경 장식 (블러 원형 그라디언트)
       * fixed inset-0          : 화면 전체를 덮음
       * pointer-events-none    : 클릭 이벤트 통과 (클릭 방해 안 함)
       * overflow-hidden        : 원이 화면 밖으로 튀어나오지 않게
       *
       * ✏️ 배경 장식을 없애고 싶다면: 이 <div> 전체를 삭제하세요.
       * ✏️ 색상 변경: bg-primary-light/15 → /15가 투명도 (0~100)
       * ✏️ 크기 변경: w-64 h-64 → w-96 h-96
       */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 오른쪽 위 분홍 원 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-light/15 rounded-full blur-3xl" />
        {/* 왼쪽 아래 골드 원 */}
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/*
       * 📦 콘텐츠 래퍼
       * w-full max-w-md : 최대 너비 448px (모바일에서는 전체 너비)
       *                   ✏️ 더 넓게: max-w-lg (512px)
       * relative z-10   : 배경 장식(z-0) 위에 표시
       */}
      <motion.div
        className="w-full max-w-md relative z-10"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/*
         * 🌸 카네이션 이미지
         * mb-4           : 카드와의 간격 (아래 마진 16px)
         *                  ✏️ 간격 늘리기: mb-6 / mb-8
         * w-28 h-28      : 이미지 크기 112px x 112px
         *                  ✏️ 크게: w-36 h-36 / 작게: w-20 h-20
         * drop-shadow-md : 이미지 자체에 그림자 (카드 그림자와 다름)
         */}
        <motion.div
          className="flex justify-center items-end gap-3 mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img src="/carnation.svg" alt="카네이션" className="w-[70px] h-[70px] object-contain" />
          <img src="/heart.svg" alt="하트" className="w-[20px] h-[20px] object-contain mb-1 -translate-x-2" />
          <img src="/lettericon.svg" alt="편지봉투" className="w-[50px] h-[50px] object-contain" />
        </motion.div>

        {/*
         * 🃏 메인 카드
         * bg-bg-card     : 카드 배경 (흰색)
         * rounded-3xl    : 모서리 둥글기. 더 작게: rounded-2xl / rounded-xl
         * shadow-xl      : 그림자 크기. 더 크게: shadow-2xl / 없애기: shadow-none
         * border border-border-soft/60 : 연한 테두리 (60% 투명도)
         * overflow-hidden: 자식 요소가 카드 밖으로 나가지 않게 (상단 라인 등)
         */}
        <div className="w-full">

          {/*
           * 🎀 카드 헤더 (제목 영역)
           * bg-gradient-to-r from-primary/8 to-primary-light/10
           *   : 왼쪽에서 오른쪽으로 아주 연한 분홍 그라디언트
           *   ✏️ 단색으로 바꾸려면: bg-primary/5
           *   ✏️ 없애려면: bg-transparent
           * px-6 pt-6 pb-4: 좌우 24px, 위 24px, 아래 16px 패딩
           */}
          <div className="px-6 pt-6 pb-4 text-center">
            {/*
             * 제목 텍스트
             * text-2xl      : 폰트 크기 24px. ✏️ 크게: text-3xl / 작게: text-xl
             * font-bold     : 두께. ✏️ 일반: font-semibold / font-normal
             * font-serif    : 명조체 (Noto Serif KR)
             * text-text-main: 진한 갈색 (index.css @theme에서 변경)
             */}
            <motion.h1
              className="text-[35px] font-normal font-serif text-text-main"
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              style={{ marginBottom: '20px' }}
            >
              부모님께 마음을 전하세요  {/* ✏️ 제목 텍스트를 여기서 수정 */}
            </motion.h1>
          </div>

          {/* 폼 영역 시작 */}
          <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-2 flex flex-col items-center">

            {submitError && (
              <div className="mb-4 p-3 w-full max-w-[330px] bg-error/10 border border-error/20 rounded-xl text-sm text-error text-center">
                {submitError}
              </div>
            )}

            {/* 모든 요소를 편지지 영역(330px)에 고정시키기 위한 래퍼 */}
            <div className="w-full max-w-[330px] flex flex-col gap-3">

              {/* 1. 받는 사람 & 비밀번호 (한 줄에 나란히) */}
              <motion.div
                className="flex items-center justify-between w-full"
                custom={2} variants={itemVariants} initial="hidden" animate="visible"
              >
                {/* 받는 사람 */}
                <div className="flex items-center gap-2">
                  <label htmlFor="field-receiver" className="text-[18px] text-text-main whitespace-nowrap">
                    받는 사람:
                  </label>
                  <input
                    id="field-receiver" name="receiver" placeholder="이름"
                    value={formData.receiver}
                    onChange={handleChange} onBlur={handleBlur}
                    className="w-[70px] px-2 py-1 rounded-full bg-secondary text-[18px] text-center text-text-main placeholder-text-main/40 focus:outline-none"
                  />
                </div>

                {/* 비밀번호 */}
                <div className="flex items-center gap-2">
                  <label htmlFor="field-password" className="text-[18px] text-text-main whitespace-nowrap">
                    비밀번호:
                  </label>
                  <input
                    id="field-password" type="password" name="password" inputMode="numeric" autoComplete="new-password" placeholder="4자리수"
                    value={formData.password} maxLength={4}
                    onChange={handleChange} onBlur={handleBlur}
                    className="w-[70px] px-2 py-1 rounded-full bg-secondary text-[18px] text-center tracking-widest font-mono text-text-main placeholder-text-main/40 placeholder:font-sans placeholder:tracking-normal focus:outline-none"
                  />
                </div>
              </motion.div>

              {/* 2. 편지 내용 (테두리 둥근 텍스트 박스) */}
              <motion.div
                className="relative w-full h-[352px]"
                custom={3} variants={itemVariants} initial="hidden" animate="visible"
              >
                {/* 배경을 위한 레이어: 모서리가 날카롭게 튀어나오지 않게만 잡아줍니다 */}
                <div className="absolute inset-0 bg-[#FFFEFB] rounded-[10px]"></div>

                {/* 테두리 SVG 레이어: rounded 처리로 인해 잘리지(가려지지) 않도록 별도 레이어 배치 */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url('/letterarea.svg')`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>

                {/* 실제 텍스트 입력 영역 */}
                <textarea
                  id="field-content" name="content"
                  placeholder="전하고 싶은 말을 적어주세요."
                  value={formData.content}
                  onChange={handleChange} onBlur={handleBlur}
                  style={{ padding: '20px', paddingBottom: '36px' }}
                  className="relative z-10 w-full h-full bg-transparent text-[18px] leading-loose resize-none text-text-main placeholder-text-main/40 focus:outline-none"
                />

                {/* 글자 수 표시기 */}
                <div className="absolute bottom-3 right-5 z-20 text-[13px] text-text-main/40 pointer-events-none font-sans tracking-wide">
                  {[...formData.content].length} / {MAX_LENGTHS.content}
                </div>
              </motion.div>

              {/* 3. 보내는 사람 (오른쪽 아래) */}
              <motion.div
                className="flex items-center justify-end gap-2 w-full"
                custom={4} variants={itemVariants} initial="hidden" animate="visible"
              >
                <label htmlFor="field-sender" className="text-[18px] text-text-main whitespace-nowrap">
                  보내는 사람:
                </label>
                <input
                  id="field-sender" name="sender" placeholder="이름"
                  value={formData.sender}
                  onChange={handleChange} onBlur={handleBlur}
                  className="w-[70px] px-2 py-1 rounded-full bg-secondary text-[18px] text-center text-text-main placeholder-text-main/40 focus:outline-none"
                />
              </motion.div>

            </div>

            {/* 4. 완성하기 버튼 (하트 이미지 배경) */}
            <motion.div
              className="flex justify-center"
              style={{ marginTop: '10px' }}
              custom={5} variants={itemVariants} initial="hidden" animate="visible"
            >
              <button
                type="submit" disabled={isSubmitting}
                className="relative flex items-center justify-center w-[100px] h-[70px] hover:-translate-y-1 transition-transform cursor-pointer"
              >
                {/* 배경 하트 이미지 */}
                <img src="/hearticon.svg" alt="완성" className="absolute inset-0 w-full h-full object-contain" />

                {/* 버튼 텍스트 (위치는 mt-숫자 로 조절) */}
                <span className="relative z-10 text-[18px] text-text-main mt-2">
                  {isSubmitting ? '완성 중...' : '완성하기'}
                </span>
              </button>
            </motion.div>

          </form>
          {/* 폼 영역 끝 */}
        </div>

        {/*
         * 💬 카드 아래 안내 문구
         * text-xs text-text-light : 작고 연한 텍스트
         * mt-4                    : 카드와의 간격 16px
         */}
        <motion.p
          className="text-center text-[14px] text-text-light"
          custom={6}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          style={{ marginTop: '14px' }}
        >
          완성된 편지의 링크를 부모님께 보내드리세요 🌷  {/* ✏️ */}
        </motion.p>
      </motion.div>
    </div>
  );
}

export default WritePage;
