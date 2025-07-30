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
  const router = useRouter();
  const { nickname, userId, password, name, rrn, tel } = useLocalSearchParams<{
    nickname?: string;
    userId?: string;
    password?: string;
    name?: string;
    rrn?: string;
    tel?: string;
  }>();

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const toggleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setAgreeService(newValue);
    setAgreePrivacy(newValue);
  };

  const handleComplete = () => {
    if (!agreeService || !agreePrivacy) {
      Alert.alert('약관 동의 필요', '모든 필수 항목에 동의해주세요.');
      return;
    }

  // 회원가입 완료 화면으로 이동
    router.push({
      pathname: '/signup-complete',
      params: { nickname },
    });
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>약관에 동의해주세요</Text>

      <TouchableOpacity style={styles.row} onPress={toggleAgreeAll}>
        <Ionicons
          name={agreeAll ? 'checkbox' : 'square-outline'}
          size={24}
          color="#4E41FF"
        />
        <Text style={styles.agreeText}>모두 동의합니다</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          setAgreeService(!agreeService);
          setAgreeAll(false);
        }}
      >
        <Ionicons
          name={agreeService ? 'checkbox' : 'square-outline'}
          size={24}
          color="#4E41FF"
        />
        <Text style={styles.agreeText}>[필수] 서비스 이용 약관 동의</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          setAgreePrivacy(!agreePrivacy);
          setAgreeAll(false);
        }}
      >
        <Ionicons
          name={agreePrivacy ? 'checkbox' : 'square-outline'}
          size={24}
          color="#4E41FF"
        />
        <Text style={styles.agreeText}>[필수] 개인정보 수집 및 이용 동의</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          !(agreeService && agreePrivacy) && { backgroundColor: '#ccc' },
        ]}
        disabled={!(agreeService && agreePrivacy)}
        onPress={handleComplete}
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
    backgroundColor: '#4E41FF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'SUIT-Bold',
  },
});
