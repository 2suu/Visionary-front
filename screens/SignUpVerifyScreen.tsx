import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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

  const handleNext = () => {
    if (!name.trim() || !rrn.trim() || !tel.trim() || !carrier.trim()) {
      Alert.alert('알림', '모든 정보를 입력해주세요!');
      return;
    }

    setField('name', name);
    setField('rrn', rrn);
    setField('tel', tel);
    setField('carrier', carrier);

    router.push('/signup-verify-code');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // 헤더 높이에 맞게 조정 가능
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
          />

          <TextInput
            style={styles.input}
            placeholder="주민등록번호 (예: 010509-4)"
            value={rrn}
            onChangeText={(text) => setRrn(formatRRN(text))}
            keyboardType="numeric"
            placeholderTextColor="#aaa"
            returnKeyType="next"
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
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>인증번호 받기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ScrollView 전체 컨테이너
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  // KAV 레이아웃
  kav: {
    flex: 1,
  },
  // 실제 화면 내용 컨테이너
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    color: '#000',
  },
  pickerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 24,
  },
  picker: {
    fontSize: 16,
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
