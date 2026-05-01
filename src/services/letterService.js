/**
 * letterService.js - Firestore 편지 CRUD 서비스 (SRP + DIP)
 *
 * UI 컴포넌트가 Firestore SDK에 직접 의존하지 않도록
 * 데이터 액세스 로직을 추상화합니다 (의존성 역전 원칙).
 * Firestore를 다른 DB로 교체하더라도 이 파일만 수정하면 됩니다.
 */

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { nanoid } from 'nanoid';

/** nanoid 길이 설정 (URL용 짧은 ID) */
const NANO_ID_LENGTH = 10;

/** Firestore 컬렉션명 */
const COLLECTION_NAME = 'letters';

/**
 * 비밀번호를 SHA-256으로 해싱 (보안: 평문 저장 방지)
 * Web Crypto API 사용 — 추가 라이브러리 불필요
 * @param {string} password - 평문 비밀번호
 * @returns {Promise<string>} 해시된 비밀번호 (hex)
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 새 편지를 Firestore에 저장
 * @param {Object} letterData - { sender, receiver, content, password }
 * @returns {Promise<string>} 생성된 편지 ID
 * @throws {Error} Firestore 저장 실패 시
 */
export async function createLetter(letterData) {
  const id = nanoid(NANO_ID_LENGTH);

  // 비밀번호 해싱 (평문 저장 방지)
  const hashedPassword = await hashPassword(letterData.password);

  const letterDoc = {
    id,
    sender: letterData.sender,
    receiver: letterData.receiver,
    content: letterData.content,
    password: hashedPassword,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, COLLECTION_NAME, id), letterDoc);
  return id;
}

/**
 * ID로 편지 데이터 조회
 * @param {string} id - 편지 ID
 * @returns {Promise<Object|null>} 편지 데이터 또는 null
 */
export async function getLetterById(id) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  // 비밀번호 해시는 클라이언트에 반환하지 않음 (보안)
  const { password, ...safeData } = data;
  return safeData;
}
