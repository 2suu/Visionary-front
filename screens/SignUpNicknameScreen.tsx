import { Ionicons } from '@expo/vector-icons';
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
// import axios from 'axios'; // 🔓 백엔드 연결 시 주석 해제
import { useSignUpStore } from '../stores/useSignUpStore';

// ⚙️ 개발 단계: 서버 없이 모의 응답 사용
const USE_MOCK = true;

const SignUpNicknameScreen: React.FC = () => {
  const router = useRouter();
  const { setField } = useSignUpStore();

  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // null=미확인, true=사용가능, false=중복

  const checkNickname = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      if (USE_MOCK) {
        // 나중에 연결 시: USE_MOCK=false로 바꾸고 axios 임포트 주석 해제 → 엔드포인트만 넣으면 끝.
        // 🧪 모의 로직: 'admin', 'test', 'manager'는 중복 처리, 그 외는 사용 가능
        const blocked = ['admin', 'test', 'manager'];
        const exists = blocked.includes(trimmed.toLowerCase());
        await new Promise((r) => setTimeout(r, 600)); // 로딩 느낌
        if (exists) {
          setIsAvailable(false);
          Alert.alert('중복된 닉네임입니다', '다른 닉네임을 입력해주세요.');
        } else {
          setIsAvailable(true);
          Alert.alert('사용 가능한 닉네임입니다.');
        }
      } else {
        // 🔗 실제 API 연결 시 사용
        // const res = await axios.post('http://YOUR_BACKEND_HOST/api/auth/nickname/exists', {
        //   nickname: trimmed,
        // });
        // const exists = Boolean(res.data?.exists);
        // if (exists) {
        //   setIsAvailable(false);
        //   Alert.alert('중복된 닉네임입니다', '다른 닉네임을 입력해주세요.');
        // } else {
        //   setIsAvailable(true);
        //   Alert.alert('사용 가능한 닉네임입니다.');
        // }
      }
    } catch (e) {
      console.error(e);
      setIsAvailable(null);
      Alert.alert('오류', '닉네임 확인 중 문제가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!isAvailable) {
      Alert.alert('알림', '닉네임 중복확인을 해주세요.');
      return;
    }
    setField('nickname', nickname.trim());
    router.push('/signup-id');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>안녕하세요!</Text>
        <Text style={styles.subtitle}>사용할 닉네임을 알려주세요</Text>
      </View>

      {/* 입력 + 중복확인 버튼 한 줄 */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="닉네임"
          placeholderTextColor="#aaa"
          value={nickname}
          onChangeText={(t) => {
            setNickname(t);
            setIsAvailable(null); // 입력 변경 시 상태 초기화
          }}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
        />
        <TouchableOpacity
          style={[styles.checkButton, loading && styles.buttonDisabled]}
          onPress={checkNickname}
          disabled={loading}
        >
          <Text style={styles.checkButtonText}>{loading ? '확인중...' : '중복확인'}</Text>
        </TouchableOpacity>
      </View>

      {/* 상태 메시지 */}
      {isAvailable === false && (
        <Text style={styles.error}>이미 사용 중인 닉네임입니다.</Text>
      )}
      {isAvailable === true && (
        <Text style={styles.success}>사용 가능한 닉네임입니다.</Text>
      )}

      <TouchableOpacity
        style={[styles.button, (!isAvailable || loading) && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!isAvailable || loading}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignUpNicknameScreen;

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
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'SUIT-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'SUIT-Regular',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'SUIT-Regular',
  },
  checkButton: {
    backgroundColor: '#4E41FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SUIT-Bold',
  },
  error: {
    color: '#E5484D',
    fontSize: 13,
    marginTop: 8,
  },
  success: {
    color: '#4E41FF',
    fontSize: 13,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#4E41FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'SUIT-Bold',
  },
});
