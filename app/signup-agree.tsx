import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignUpAgreeScreen() {
  const [agreeAll, setAgreeAll] = useState(false);
  const [terms1, setTerms1] = useState(false); // 필수
  const [terms2, setTerms2] = useState(false); // 필수
  const [terms3, setTerms3] = useState(false); // 선택

  const router = useRouter();

  const {
    nickname,
    userId,
    password,
    name,
    rrn,
    tel,
  } = useLocalSearchParams<{
    nickname?: string;
    userId?: string;
    password?: string;
    name?: string;
    rrn?: string;
    tel?: string;
  }>();

  const handleToggleAll = () => {
    const newState = !agreeAll;
    setAgreeAll(newState);
    setTerms1(newState);
    setTerms2(newState);
    setTerms3(newState);
  };

  const handleConfirm = () => {
    if (!terms1 || !terms2) {
      Alert.alert('필수 약관 동의', '필수 약관에 동의해주세요.');
      return;
    }

    const isValid =
      nickname?.trim() &&
      userId?.trim() &&
      password?.trim() &&
      name?.trim() &&
      rrn?.trim() &&
      tel?.trim();

    if (!isValid) {
      Alert.alert('입력 오류', '회원가입 정보가 누락되었습니다.');
      return;
    }

    // 모든 회원가입 정보를 signup-complete로 전달
    router.push({
      pathname: '/signup-complete',
      params: {
        nickname,
        userId,
        password,
        name,
        rrn,
        tel,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>약관 동의</Text>

      <TouchableOpacity style={styles.checkboxRow} onPress={handleToggleAll}>
        <Ionicons
          name={agreeAll ? 'checkbox' : 'square-outline'}
          size={24}
          color={agreeAll ? '#4F46E5' : '#999'}
        />
        <Text style={styles.checkboxLabel}>모두 동의합니다</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setTerms1(!terms1)}
      >
        <Ionicons
          name={terms1 ? 'checkbox' : 'square-outline'}
          size={24}
          color={terms1 ? '#4F46E5' : '#999'}
        />
        <Text style={styles.checkboxLabel}>
          (필수) 서비스 이용약관 동의
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setTerms2(!terms2)}
      >
        <Ionicons
          name={terms2 ? 'checkbox' : 'square-outline'}
          size={24}
          color={terms2 ? '#4F46E5' : '#999'}
        />
        <Text style={styles.checkboxLabel}>
          (필수) 개인정보 처리방침 동의
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setTerms3(!terms3)}
      >
        <Ionicons
          name={terms3 ? 'checkbox' : 'square-outline'}
          size={24}
          color={terms3 ? '#4F46E5' : '#999'}
        />
        <Text style={styles.checkboxLabel}>
          (선택) 마케팅 정보 수신 동의
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>회원가입 완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
