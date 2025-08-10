import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';


import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { requestVerification } from '../api/auth';
import { useSignUpStore } from '../stores/useSignUpStore'; //Zustand import
export default function SignUpVerifyScreen() {
  const router = useRouter();
  const { setField } = useSignUpStore(); //Zustand setter

  const [name, setName] = useState('');
  const [rrn, setRrn] = useState('');
  const [tel, setTel] = useState('');
  const [carrier, setCarrier] = useState('');

  // 주민등록번호 포맷 (######-#)
  const formatRRN = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6, 7)}`;
  };

  // 전화번호 포맷 (010-1234-5678)
  const formatPhone = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  // handleNext 교체
const handleNext = async () => {
  if (!name.trim() || !rrn.trim() || !tel.trim() || !carrier.trim()) {
    Alert.alert('알림', '모든 정보를 입력해주세요!');
    return;
  }

  // 간단 유효성(예: 주민번호 7자리 형태, 전화번호 10~11자리)
  const rrnDigits = rrn.replace(/[^0-9]/g, '');
  const telDigits = tel.replace(/[^0-9]/g, '');
  if (rrnDigits.length < 7) {
    Alert.alert('알림', '주민등록번호 앞 7자리 형식으로 입력해주세요. (예: 010509-4)');
    return;
  }
  if (telDigits.length < 10 || telDigits.length > 11) {
    Alert.alert('알림', '전화번호를 정확히 입력해주세요.');
    return;
  }

  try {
    // 상태 저장(원본도 보관)
    setField('name', name);
    setField('rrn', rrn);
    setField('tel', tel);
    setField('carrier', carrier);

    // API 호출 (필요 시 하이픈 제거 여부는 백엔드 스펙에 맞춰 조정)
    const payload = {
      name: name.trim(),
      identificationNumber: rrn,         // ex) "030812-3"
      carrier: tel,             // ex) "010-1234-5678"
      phoneNumber: carrier,           // "SKT" | "KT" | "LGU+" | "알뜰폰"
    };

    console.log('📦 본인확인 요청 payload:', payload);
    const resp = await requestVerification(payload);

    // 예시 응답: { 응답코드, 응답메세지, 고유Id }
    console.log('📨 본인확인 응답:', resp);

    if (resp?.응답코드 === 200 && resp?.고유Id) {
      setField('transactionId', resp.고유Id);
      Alert.alert('인증번호 전송', resp.응답메세지 || '인증번호가 전송되었습니다.', [
        { text: '확인', onPress: () => router.push('/signup-verify-code') },
      ]);
    } else {
      Alert.alert('오류', resp?.응답메세지 || '본인확인 요청에 실패했습니다.');
    }
  } catch (e: any) {
    console.log('❌ 본인확인 요청 실패:', e?.response?.data || e.message);
    Alert.alert('오류', e?.response?.data?.message || '본인확인 요청에 실패했습니다.');
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
      />

      <TextInput
        style={styles.input}
        placeholder="주민등록번호 (예: 010509-4)"
        value={rrn}
        onChangeText={(text) => setRrn(formatRRN(text))}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />

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

      <TextInput
        style={styles.input}
        placeholder="전화번호 (예: 010-1234-5678)"
        value={tel}
        onChangeText={(text) => setTel(formatPhone(text))}
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>인증번호 받기</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    fontFamily: 'SUIT-Bold',
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 24,
    fontFamily: 'SUIT-Regular',
  },
  pickerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 24,
  },
  picker: {
    fontSize: 16,
    fontFamily: 'SUIT-Regular',
    color: '#000',
  },
  button: {
    backgroundColor: '#4E41FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SUIT-Bold',
  },
});
