// app/signup-verify.tsx (파일명은 현재 네 구조에 맞게 유지)
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { requestVerificationKorean } from '../api/auth';
import { useSignUp } from '../screens/signup-context';

export default function SignUpVerifyScreen() {
  const router = useRouter();
  const { setField } = useSignUp();

  const [name, setName] = useState('');
  const [rrn, setRrn] = useState('');       // "######-#"
  const [tel, setTel] = useState('');       // "010-0000-0000"
  const [carrier, setCarrier] = useState('');
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
  const telValid  = useMemo(() => /^\d{3}-\d{3,4}-\d{4}$/.test(tel), [tel]);
  const carrierValid = useMemo(() => !!carrier, [carrier]);
  const canSubmit = nameValid && rrnValid && telValid && carrierValid && !loading;

  const handleNext = async () => {
    if (!canSubmit) {
      Alert.alert('알림', '입력값을 다시 확인해주세요.');
      return;
    }

    // Context 저장 (다음 화면 가드용)
    setField('name', name.trim());
    setField('rrn7', rrn);
    setField('phone', tel);
    setField('carrier', carrier as any);

    const payload = {
      이름: name.trim(),
      주민등록번호: rrn,
      통신사: carrier as 'SKT' | 'KT' | 'LGU+' | '알뜰폰',
      전화번호: tel,
    } as const;

    try {
      setLoading(true);
      console.log('[VERIFY-REQUEST][REQ]', payload);

      const res = await requestVerificationKorean(payload);
      const status = res?.status;
      const body = res?.data;

      console.log('[VERIFY-REQUEST][RES]', { status, body });

      // 서버 응답 예: { 응답코드: 200, 응답메세지: "인증번호가 전송되었습니다.", 고유Id: "abc123..." }
      const ok = body?.응답코드 === 200 || body?.응답코드 === '200' || status === 200;
      const txId = body?.고유Id || body?.txId || body?.transactionId;

      if (ok && txId) {
        // ✅ 키 통일: transactionId 로 저장 (verify-code 화면과 일치)
        setField('transactionId', String(txId));
        Alert.alert('안내', body?.응답메세지 ?? '인증번호가 전송되었습니다.');
        router.push('/signup-verify-code');
      } else {
        Alert.alert('본인인증 요청 실패', body?.응답메세지 ?? '다시 시도해 주세요.');
      }
    } catch (e: any) {
      console.log('[VERIFY-REQUEST][ERROR]', e?.response?.data ?? e?.message);
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
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>본인 확인을 위해 정보를 입력해주세요</Text>

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
            maxLength={8} // "######-#"
          />
          {!rrnValid && !!rrn && <Text style={styles.err}>형식: 6자리-1</Text>}

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={carrier}
              onValueChange={(value) => setCarrier(value)}
              style={styles.picker}
              dropdownIconColor="#4E41FF"
            >
              <Picker.Item label="통신사 선택" value="" />
              <Picker.Item label="SKT" value="SKT" />
              <Picker.Item label="KT" value="KT" />
              <Picker.Item label="LGU+" value="LGU+" />
              <Picker.Item label="알뜰폰" value="알뜰폰" />
            </Picker>
          </View>
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
            maxLength={13} // 000-0000-0000
          />
          {!telValid && !!tel && <Text style={styles.err}>형식: 010-0000-0000</Text>}

          <TouchableOpacity
            style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!canSubmit || loading}
          >
            <Text style={styles.buttonText}>{loading ? '요청 중…' : '인증번호 받기'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, backgroundColor: '#fff' },
  kav: { flex: 1 },
  content: { flex: 1, paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 18, marginBottom: 30, fontWeight: 'bold', fontFamily: 'SUIT-Bold', color: '#000' },
  input: {
    borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 16,
    paddingVertical: 12, marginBottom: 8, fontFamily: 'SUIT-Regular', color: '#000',
  },
  pickerWrapper: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 8 },
  picker: { fontSize: 16, color: '#000' },
  button: {
    backgroundColor: '#4E41FF', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: 'SUIT-Bold' },
  err: { color: '#E5484D', fontSize: 12, marginBottom: 16 },
});
