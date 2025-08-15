import api from './client';

// 요청 바디가 한글 키일 때의 타입(선택)
export type VerificationReqKorean = {
  이름: string;
  주민등록번호: string; // "YYMMDD-X"
  통신사: 'SKT' | 'KT' | 'LGU+' | '알뜰폰';
  전화번호: string;     // "010-0000-0000"
};

// 인증코드 검증
export function verifyAuthCode(payload: {
  고유Id: string;
  인증번호: string; // 숫자 6자리
}) {
  return api.post('/api/auth/verify', payload);
}

export async function requestVerificationKorean(payload: VerificationReqKorean) {
  // 엔드포인트는 백엔드에 맞춰 수정(예: '/api/auth/verify')
  return api.post('/api/auth/request', payload);
}