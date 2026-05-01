import { Routes, Route, Navigate } from 'react-router-dom';
import WritePage from './pages/WritePage';
import SharePage from './pages/SharePage';
import LetterPage from './pages/LetterPage';

function App() {
  return (
    <Routes>
      {/* 편지 작성 페이지 (홈) */}
      <Route path="/" element={<WritePage />} />

      {/* 공유 완료 페이지 - 편지 저장 후 공유 URL 표시 */}
      <Route path="/share/:id" element={<SharePage />} />

      {/* 편지 열람 페이지 - 받는 사람이 열어보는 페이지 */}
      <Route path="/letter/:id" element={<LetterPage />} />

      {/* 존재하지 않는 경로 → 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
