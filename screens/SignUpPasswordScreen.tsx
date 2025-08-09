import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useSignUpStore } from '../stores/useSignUpStore';

export default function SignUpPasswordScreen() {
  const router = useRouter();
  const { nickname, userId, setField } = useSignUpStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // 👁️ 비밀번호 표시/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!nickname || !userId) {
      Alert.alert('잘못된 접근', '닉네임 또는 아이디가 없습니다.');
      router.replace('/signup-nickname');
    }
  }, []);

  const rules = useMemo(() => {
    const lengthOK = password.length >= 8 && password.length <= 16;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isValid = lengthOK && hasLetter && hasNumber && hasSpecial;
    return { lengthOK, hasLetter, hasNumber, hasSpecial, isValid };
  }, [password]);

  const matchOK = useMemo(
    () => confirm.length > 0 && password === confirm,
    [password, confirm]
  );

  const handleNext = () => {
    if (!rules.isValid || !matchOK) {
      Alert.alert(
        '비밀번호를 확인해주세요',
        !rules.isValid
          ? '비밀번호는 8~16자이며, 영문/숫자/특수문자를 모두 포함해야 합니다.'
          : '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
      );
      return;
    }
    setField('password', password);
    router.push('/signup-agree');
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
        <Text style={styles.title}>마지막 단계예요!</Text>
        <Text style={styles.subtitle}>비밀번호를 설정해주세요</Text>
      </View>

      {/* 비밀번호 */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 (8~16자, 영문/숫자/특수문자 포함)"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* 비밀번호 확인 */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={setConfirm}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setShowConfirm((prev) => !prev)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showConfirm ? 'eye-off' : 'eye'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {confirm.length > 0 && !matchOK && (
        <Text style={styles.error}>비밀번호가 일치하지 않습니다.</Text>
      )}

      <View style={styles.ruleList}>
        <RuleItem ok={rules.lengthOK} label="8~16자" />
        <RuleItem ok={rules.hasLetter} label="영문 포함" />
        <RuleItem ok={rules.hasNumber} label="숫자 포함" />
        <RuleItem ok={rules.hasSpecial} label="특수문자 포함" />
        <RuleItem ok={matchOK} label="비밀번호 일치" />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!rules.isValid || !matchOK) && styles.buttonDisabled,
        ]}
        onPress={handleNext}
        disabled={!rules.isValid || !matchOK}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

function RuleItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={styles.ruleItem}>
      <Ionicons
        name={ok ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={ok ? '#4E41FF' : '#999'}
        style={{ marginRight: 6 }}
      />
      <Text style={[styles.ruleText, ok && styles.ruleTextOk]}>{label}</Text>
    </View>
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
  textContainer: {
    marginBottom: 28,
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
    marginTop: 6,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 40, // 👁️ 아이콘 공간
    fontFamily: 'SUIT-Regular',
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  error: {
    color: '#E5484D',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
    fontFamily: 'SUIT-Regular',
  },
  ruleList: {
    marginTop: 8,
    marginBottom: 24,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ruleText: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'SUIT-Regular',
  },
  ruleTextOk: {
    color: '#333',
    fontFamily: 'SUIT-Bold',
  },
  button: {
    backgroundColor: '#4E41FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
