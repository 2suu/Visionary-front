// screens/SignUpAgreeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSignUp } from './signup-context'; // ✅ context만 사용

const PRIMARY = '#4E41FF';

export default function SignUpAgreeScreen() {
  const router = useRouter();
  const { data } = useSignUp(); // { nickname, userId, ... }
  const { nickname } = data; // 필요하면 헤더 등에 활용 가능

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const allRequiredAgreed = useMemo(
    () => agreeService && agreePrivacy,
    [agreeService, agreePrivacy]
  );

  const toggleAgreeAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeService(next);
    setAgreePrivacy(next);
  };

  const toggleService = () => {
    const next = !agreeService;
    setAgreeService(next);
    setAgreeAll(next && agreePrivacy);
  };

  const togglePrivacy = () => {
    const next = !agreePrivacy;
    setAgreePrivacy(next);
    setAgreeAll(next && agreeService);
  };

  const handleComplete = () => {
    if (!allRequiredAgreed) {
      Alert.alert('약관 동의 필요', '모든 필수 항목에 동의해주세요.');
      return;
    }
    // ✅ API 호출 없음. 완료 화면으로 이동만.
    router.push('/signup-complete');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>약관에 동의해주세요</Text>

      <TouchableOpacity style={styles.row} onPress={toggleAgreeAll} activeOpacity={0.8}>
        <Ionicons name={agreeAll ? 'checkbox' : 'square-outline'} size={24} color={PRIMARY} />
        <Text style={styles.agreeText}>모두 동의합니다</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.row} onPress={toggleService} activeOpacity={0.8}>
        <Ionicons name={agreeService ? 'checkbox' : 'square-outline'} size={24} color={PRIMARY} />
        <Text style={styles.agreeText}>[필수] 서비스 이용 약관 동의</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={togglePrivacy} activeOpacity={0.8}>
        <Ionicons name={agreePrivacy ? 'checkbox' : 'square-outline'} size={24} color={PRIMARY} />
        <Text style={styles.agreeText}>[필수] 개인정보 수집 및 이용 동의</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !allRequiredAgreed && styles.buttonDisabled]}
        disabled={!allRequiredAgreed}
        onPress={handleComplete}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>동의하고 회원가입 완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'SUIT-Bold',
    marginBottom: 30,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  agreeText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'SUIT-Regular',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  button: {
    marginTop: 40,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'SUIT-Bold',
  },
});
