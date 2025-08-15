// screens/survey/Intro.tsx
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRIMARY = '#4E41FF';

export default function SurveyIntro() {
  const start = useCallback(() => {
    router.push({ pathname: '/survey/q/[no]', params: { no: '1' } });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpace} />

      {/* 타이틀 */}
      <Text style={styles.title}>‘나’와 맞는 직무를 찾아볼까?</Text>
      <Text style={styles.subtitle}>
        총 47문항 · 약 5~7분 ⏱️
      </Text>

      {/* 일러스트/이모지 영역 */}
      <View style={styles.emojiBox}>
        <Text style={styles.emoji}>🔍</Text>
      </View>

      {/* 체크 포인트 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>이렇게 진행돼요</Text>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>1~44: 5점 척도(전혀 아니다 ~ 매우 그렇다)</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>45: 흥미 분야 / 46: 희망 연봉 / 47: 우선순위 정하기</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>마지막에 한꺼번에 확인·수정 후 제출</Text>
        </View>
      </View>

      {/* 시작 버튼 */}
      <TouchableOpacity style={styles.startBtn} onPress={start} activeOpacity={0.95}>
        <Text style={styles.startText}>검사 시작하기</Text>
      </TouchableOpacity>

      {/* 하단 도움말 */}
      <Text style={styles.helper}>중간에 앱을 닫아도 진행 상황은 저장돼요.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  headerSpace: { height: 32 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 6, marginBottom: 8, textAlign: 'center' },
  emojiBox: { width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 12 },
  emoji: { fontSize: 92 },

  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F7F7FF',
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 'auto',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#333' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { width: 18, textAlign: 'center', color: '#444', fontSize: 16, lineHeight: 20, marginTop: -1 },
  bulletText: { flex: 1, fontSize: 13, color: '#444' },

  startBtn: {
    width: '93%',
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  startText: { color: 'white', fontSize: 16, fontWeight: '700' },

  helper: { fontSize: 12, color: '#8A8A8A', marginTop: 10, textAlign: 'center' },
});
