import api from './client';

export type VerificationReq = {
  name: string;
  identificationNumber: string; // 공백 포함 → 반드시 따옴표!
  carrier: 'SKT' | 'KT' | 'LGU+' | '알뜰폰';
  phoneNumber: string;
};

// 인증코드 검증 (이건 그대로)
export function verifyAuthCode(payload: {
  고유Id: string;
  인증번호: string; // 숫자 6자리
}) {
  return api.post('/api/auth/verify', payload);
}

// 본인인증 요청
export async function requestVerificationKorean(payload: VerificationReq) {
  // 엔드포인트는 백엔드에 맞게 조정
  return api.post('/api/auth/request', payload);
}
