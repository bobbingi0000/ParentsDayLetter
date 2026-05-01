/**
 * useLetter.js - 편지 데이터 조회 커스텀 훅 (SRP)
 *
 * Firestore에서 편지 데이터를 가져오는 로직을 캡슐화합니다.
 * LetterPage가 데이터 로딩/에러/성공 상태를 쉽게 다룰 수 있도록 합니다.
 * 실제 Firestore 호출은 letterService에 위임합니다 (DIP).
 */

import { useState, useEffect } from 'react';
import { getLetterById } from '../services/letterService';

/**
 * @typedef {'idle'|'loading'|'success'|'error'|'not-found'} FetchStatus
 */

/**
 * 편지 데이터 조회 훅
 * @param {string} id - 편지 ID
 * @returns {{ letter: Object|null, status: FetchStatus, error: string|null }}
 */
export function useLetter(id) {
  const [letter, setLetter] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    // ID가 없으면 조회하지 않음
    if (!id) {
      setStatus('error');
      setError('편지 ID가 없습니다.');
      return;
    }

    let cancelled = false; // cleanup을 위한 플래그 (메모리 누수 방지)

    async function fetchLetter() {
      setStatus('loading');
      setError(null);

      try {
        const data = await getLetterById(id);

        if (cancelled) return;

        if (!data) {
          setStatus('not-found');
          setError('편지를 찾을 수 없습니다.');
        } else {
          setLetter(data);
          setStatus('success');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('편지 조회 실패:', err);
        setStatus('error');
        setError('편지를 불러오는 중 오류가 발생했습니다.');
      }
    }

    fetchLetter();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { letter, status, error };
}
