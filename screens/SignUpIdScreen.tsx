// screens/SignUpIdScreen.tsx
// 백엔드 완성되면 USE_MOCK = false로 바꾸고 주석 해제

import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ✅ Context 사용
import { useSignUp } from './signup-context';

// const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:8080';

// ──────────────────────────────────────────────
// 유틸
const sanitize = (s: string) => s.trim();
// 예: 영문/숫자/._- 4~20자
const isValidUserId = (s: string) => /^[a-zA-Z0-9._-]{4,20}$/.test(s);
// const safeJson = (t: string) => { try { return JSON.parse(t); } catch { return null; } };
// ──────────────────────────────────────────────

// ⚙️ 개발 단계: 서버 없이 모의 응답 사용
const USE_MOCK = true;

const PRIMARY = '#4E41FF';
const INSET = 40;

export default function SignUpIdScreen() {
  const router = useRouter();
  const { data, setField } = useSignUp(); // { nickname, ... }
  const nickname = data.nickname;

  const [userId, setUserId] = useState('');
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [navigating, setNavigating] = useState(false);

  const trimmed = useMemo(() => sanitize(userId), [userId]);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!nickname) {
      Alert.alert('잘못된 접근', '닉네임이 없습니다.');
      router.replace('/signup-nickname');
    }
  }, []);

  // ✅ 아이디 중복확인 (모의 로직만 사용)
  const checkUserId = async () => {
    if (!isValidUserId(trimmed)) {
      Alert.alert('알림', '아이디는 영문/숫자/._- 조합 4~20자로 입력해주세요.');
      inputRef.current?.focus();
      return;
    }
    setChecking(true);
    try {
      if (USE_MOCK) {
        // 🧪 모의 로직: 아래 목록은 중복 처리, 그 외는 사용 가능
        const blocked = ['admin', 'root', 'test', 'manager'];
        await new Promise((r) => setTimeout(r, 500)); // 로딩 느낌
        const exists = blocked.includes(trimmed.toLowerCase());

        if (exists) {
          setIsAvailable(false);
          Alert.alert('이미 사용 중인 아이디입니다.');
        } else {
          setIsAvailable(true);
          Alert.alert('사용 가능한 아이디입니다.');
        }
      }

      // 🔗 실제 API 연동은 나중에 (백엔드 완성 후 주석 해제)
      /*
      const res = await fetch(
        `${API_BASE}/api/auth/check-id?id=${encodeURIComponent(trimmed)}`,
        { method: 'GET' }
      );
      const text = await res.text();
      const json: any = safeJson(text);

      const available =
        (json && typeof json.available === 'boolean' && json.available) ||
        (json && typeof json.exists === 'boolean' && json.exists === false);

      if (!res.ok) {
        const msg = (json && (json.message || json.error || json.msg)) || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      if (available === true) {
        setIsAvailable(true);
        Alert.alert('사용 가능한 아이디입니다.');
      } else if (available === false) {
        setIsAvailable(false);
        Alert.alert('이미 사용 중인 아이디입니다.');
      } else {
        setIsAvailable(null);
        Alert.alert('확인 필요', '응답 형식을 해석할 수 없어요. 백엔드 응답을 확인해주세요.');
        console.log('[CHECK-ID RAW]', text);
      }
      */
    } catch (e: any) {
      console.error('[ID CHECK ERROR]', e);
      setIsAvailable(null);
      Alert.alert('오류', e?.message ?? '아이디 확인 중 문제가 발생했어요.');
    } finally {
      setChecking(false);
    }
  };

  const handleConfirm = async () => {
    if (navigating) return;

    if (!isValidUserId(trimmed)) {
      Alert.alert('알림', '아이디는 영문/숫자/._- 조합 4~20자로 입력해주세요.');
      inputRef.current?.focus();
      return;
    }

    // ⬇️ 실제 운영에서는 중복확인 강제 권장 (지금은 API 없으므로 주석 유지)
    // if (isAvailable !== true) {
    //   Alert.alert('알림', '아이디 중복확인을 먼저 해주세요.');
    //   return;
    // }

    try {
      setNavigating(true);
      Keyboard.dismiss();
      setField('userId', trimmed);   // ✅ Context 저장
      router.push('/signup-password');
    } catch (e) {
      console.error('[NAV ERROR] /signup-password', e);
      Alert.alert('이동 실패', '다음을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setNavigating(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.content}>
            {/* (선택) 상단 뒤로가기 아이콘 — 필요 없으면 이 블록 삭제 */}
          
            {/* 타이틀 — QuestionWrapper 스타일 */}
            <Text style={styles.title} allowFontScaling={false}>아이디</Text>
            <Text style={styles.sub} allowFontScaling={false}>좋아요! 영문과 숫자를 섞어 아이디를 정해주세요</Text>

            {/* 입력 + 중복확인 한 줄 */}
            <View style={styles.row}>
              <TextInput
                ref={inputRef}
                style={[styles.input, { flex: 1 }]}
                placeholder="아이디 (영문/숫자/._- , 4~20자)"
                value={userId}
                onChangeText={(t) => {
                  setUserId(t);
                  setIsAvailable(null); // 입력 변경 시 상태 초기화
                }}
                placeholderTextColor="#A3A3A3"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={checkUserId}
                maxLength={20}
              />
              <TouchableOpacity
                style={[styles.checkButton, (checking) && { opacity: 0.6 }]}
                onPress={checkUserId}
                disabled={checking}
              >
                <Text style={styles.checkButtonText}>
                  {checking ? '확인중...' : '중복확인'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 상태 메시지 */}
            {isAvailable === false && <Text style={styles.error}>이미 사용 중인 아이디입니다.</Text>}
            {isAvailable === true && <Text style={styles.success}>사용 가능한 아이디입니다.</Text>}
          </View>
        </ScrollView>

        {/* CTA — QuestionWrapper와 동일 */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.95}
            style={[styles.cta, (checking || navigating) && styles.ctaDisabled]}
            onPress={handleConfirm}
            disabled={checking || navigating}
          >
            <Text style={styles.ctaText} allowFontScaling={false}>
              {navigating ? '이동중...' : '다음'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },

  // QuestionWrapper 기준: 아래서 시작 + 좌우 INSET 40
  content: { paddingTop: 72, paddingHorizontal: INSET, paddingBottom: 24 },

  backButton: { marginBottom: 20 },

  // 타이틀/서브 — QuestionWrapper 타이포
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    lineHeight: 26,
    marginBottom: 6,
  },
  sub: { fontSize: 13, color: '#6A6A76', marginBottom: 20 },

  // 입력 + 버튼
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    color: '#111',
  },
  checkButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  checkButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  error: { color: '#E5484D', fontSize: 13, marginTop: 6 },
  success: { color: PRIMARY, fontSize: 13, marginTop: 6 },

  // CTA (QuestionWrapper 동일)
  footer: { paddingVertical: 12, backgroundColor: '#fff' },
  cta: {
    alignSelf: 'center',
    width: '93%',
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    // Android elevation
    elevation: 3,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 16 },
});
