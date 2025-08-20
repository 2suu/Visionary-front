// app/signup-verify.tsx
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { requestVerificationKorean } from '../api/auth';
import { useSignUp } from '../screens/signup-context';

const PRIMARY = '#4E41FF';
const GRAY = '#A3A3A3';
const INSET = 40; // QuestionWrapper와 동일한 좌우 여백
const CARRIERS = ['SKT', 'KT', 'LGU+', '알뜰폰'] as const;
type Carrier = typeof CARRIERS[number];

export default function SignUpVerifyScreen() {
  const router = useRouter();
  const { setField } = useSignUp();

  const [name, setName] = useState('');
  const [rrn, setRrn] = useState('');       // "######-#"
  const [tel, setTel] = useState('');       // "010-0000-0000"
  const [carrier, setCarrier] = useState<Carrier | ''>('');
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef<TextInput>(null);

  const formatRRN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 7);
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6, 7)}`;
  };
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const rrnValid  = useMemo(() => /^\d{6}-\d{1}$/.test(rrn), [rrn]);
  const telValid  = useMemo(() => /^010-\d{4}-\d{4}$/.test(tel), [tel]);
  const carrierValid = useMemo(() => !!carrier, [carrier]);
  const canSubmit = nameValid && rrnValid && telValid && carrierValid && !loading;

  const handleNext = async () => {
    if (!canSubmit) {
      Alert.alert('알림', '입력값을 다시 확인해주세요.');
      return;
    }
    setField('name', name.trim());
    setField('rrn7', rrn);
    setField('phone', tel);
    setField('carrier', carrier as any);

   // ✅ 타입에 맞는 payload
  const payload = {
    name: name.trim(),
    identificationNumber: rrn, // 공백 있는 키는 따옴표 필수
    carrier: carrier as 'SKT' | 'KT' | 'LGU+' | '알뜰폰',
    phoneNumber: tel,
};

    try {
      setLoading(true);
      const res = await requestVerificationKorean(payload);
      const status = res?.status;
      const body = res?.data;

      const ok = body?.응답코드 === 200 || body?.응답코드 === '200' || status === 200;
      const txId = body?.고유Id || body?.txId || body?.transactionId;

      if (ok && txId) {
        setField('transactionId', String(txId));
        Alert.alert('안내', body?.응답메세지 ?? '인증번호가 전송되었습니다.');
        router.push('/signup-verify-code');
      } else {
        Alert.alert('본인인증 요청 실패', body?.응답메세지 ?? '다시 시도해 주세요.');
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.응답메세지 ??
        e?.response?.data?.message ??
        e?.message ??
        '네트워크 오류';
      Alert.alert('본인인증 요청 실패', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.content}>

              {/* ⬇️ 질문(타이틀) — QuestionWrapper와 동일한 타이포 */}
              <Text
                style={styles.title}
                allowFontScaling={false}
              >
                본인 확인을 위해 정보를 입력해주세요
              </Text>

              <TextInput
                style={styles.input}
                placeholder="이름"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#aaa"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />
              {!nameValid && !!name && <Text style={styles.err}>이름을 2자 이상 입력하세요.</Text>}

              <TextInput
                style={styles.input}
                placeholder="주민등록번호 (예: 010509-4)"
                value={rrn}
                onChangeText={(text) => setRrn(formatRRN(text))}
                keyboardType="number-pad"
                placeholderTextColor="#aaa"
                returnKeyType="next"
                maxLength={8}
              />
              {!rrnValid && !!rrn && <Text style={styles.err}>형식: 6자리-1</Text>}

              <Text style={styles.label}>통신사</Text>
              <CarrierSelect value={carrier} onChange={setCarrier} />
              {!carrierValid && <Text style={styles.err}>통신사를 선택하세요.</Text>}

              <TextInput
                ref={phoneRef}
                style={styles.input}
                placeholder="전화번호 (예: 010-1234-5678)"
                value={tel}
                onChangeText={(text) => setTel(formatPhone(text))}
                keyboardType="phone-pad"
                placeholderTextColor="#aaa"
                returnKeyType="done"
                maxLength={13}
              />
              {!telValid && !!tel && <Text style={styles.err}>형식: 010-0000-0000</Text>}
            </View>
          </ScrollView>

          {/* ⬇️ 버튼 모양 — QuestionWrapper의 cta 스타일을 그대로 적용 */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.95}
              style={[styles.cta, (!canSubmit || loading) && styles.ctaDisabled]}
              onPress={handleNext}
              disabled={!canSubmit || loading}
            >
              <Text style={styles.ctaText} allowFontScaling={false}>
                {loading ? '요청 중…' : '인증번호 받기'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ───────────── 통신사 선택 ───────────── */
function CarrierSelect({
  value,
  onChange,
}: {
  value: Carrier | '';
  onChange: (c: Carrier) => void;
}) {
  const [open, setOpen] = useState(false);

  const openPicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['취소', ...CARRIERS], cancelButtonIndex: 0 },
        (idx) => {
          if (idx > 0) onChange(CARRIERS[idx - 1]);
        }
      );
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.selectBtn} onPress={openPicker}>
        <Text style={[styles.selectText, !value && { color: GRAY }]}>
          {value || '통신사 선택'}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {CARRIERS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  onChange(c);
                  setOpen(false);
                }}
                style={styles.modalRow}
              >
                <Text style={styles.modalText}>{c}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={[styles.modalRow, { borderTopWidth: 1, borderColor: '#eee' }]}
            >
              <Text style={[styles.modalText, { color: GRAY }]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ───────────── 스타일 ───────────── */
const styles = StyleSheet.create({
  kav: { flex: 1 },
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },

  // QuestionWrapper와 비슷하게: 살짝 아래에서 시작 + 좌우 INSET 40
  content: { paddingTop: 72, paddingHorizontal: INSET, paddingBottom: 24 },

  backButton: { marginBottom: 20 },

  // ⬇️ 질문(타이틀) — QuestionWrapper 타이포
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    lineHeight: 26,
    marginBottom: 24,
    // QuestionWrapper에서는 paddingLeft 0, 동일 유지
  },

  label: { fontSize: 13, color: '#6A6A76', marginBottom: 6, marginTop: 8 },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 20,
    fontFamily: 'SUIT-Regular',
    color: '#000',
  },

  // 통신사 버튼(1줄)
  selectBtn: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E6E6EF',
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#F7F7FB',
    marginBottom: 20,
  },
  selectText: { fontSize: 16, color: '#111' },

  // ⬇️ 버튼 모양을 QuestionWrapper의 cta에 맞춤
  footer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
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
  ctaText: { color: 'white', fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 16 },

  err: { color: '#E5484D', fontSize: 12, marginBottom: 14 },

  // ANDROID 모달
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  modalRow: { paddingVertical: 14, paddingHorizontal: 18 },
  modalText: { fontSize: 16, color: '#111' },
});
