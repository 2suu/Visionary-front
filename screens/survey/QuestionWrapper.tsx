// screens/presurvey/components/QuestionWrapper.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRIMARY = '#4E41FF';
const INSET = 40;   // ← 타이틀/본문 동일 좌우 여백(필요 시 프로젝트 공통값과 맞춰 조정)

type Props = {
  title: string;
  progressText: string;   // "1/47"
  progressPct: number;    // 0~100 (표시는 텍스트만)
  children: React.ReactNode;
  disabled?: boolean;
  onNext: () => void;
  paddingHorizontal?: number;
  backgroundColor?: string;
};

export default function QuestionWrapper({
  title, progressText, progressPct, children, disabled = false, onNext,
}: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      {/* 상단 영역(타이틀 + 여백) */}
      <View style={styles.headerSpace} />
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* 본문 영역(타이틀과 동일 INSET) */}
      <View style={styles.body}>
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={[styles.bodyContent, styles.innerPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>

      {/* 진행도: 가로 중앙 */}
      <Text style={styles.progressText}>{progressText}</Text>

      {/* 확인 버튼 */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onNext}
        disabled={disabled}
        style={[styles.cta, disabled && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText}>확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF', // ← Q44와 동일 배경으로 고정
    paddingHorizontal: 0,       // ← 이중 여백 방지 (모든 여백은 INSET로 통일)
    paddingBottom: 20,
  },
  headerSpace: { height: 8 },

  // 타이틀/본문이 공유하는 좌우 패딩 래퍼
  inner: {
    paddingHorizontal: INSET,
  },
  innerPadding: {
    paddingHorizontal: INSET,
    paddingBottom: 100, // 버튼(52) + 여유
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginTop: 30,
    marginBottom: 8,
    textAlign: 'left',  // 여러 줄일 때도 왼쪽 정렬 유지
    lineHeight: 22,
  },

  body: { flex: 1 },
  bodyScroll: { flex: 1 },
  bodyContent: {
    alignItems: 'stretch',
  },

  // 진행도: 가로 중앙
  progressText: {
    alignSelf: 'center',
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },

  // 인트로 startBtn과 매칭
  cta: {
    alignSelf: 'center',
    width: '93%',
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    // Elevation (Android)
    elevation: 3,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
