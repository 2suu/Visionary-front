// screens/survey/components/QuestionWrapper.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRIMARY = '#4E41FF';
const INSET = 40; // 타이틀/본문 동일 좌우 여백

type Props = {
  title: string;
  progressText: string;     // "1/47"
  progressPct: number;      // 0~100 (표시는 텍스트만)
  children: React.ReactNode;
  disabled?: boolean;
  onNext: () => void;
  // 🔹 presurvey 기준 여백
  topPadding?: number;      // 기본 140
  gapAfterTitle?: number;   // 기본 24
};

export default function QuestionWrapper({
  title,
  progressText,
  progressPct,
  children,
  disabled = false,
  onNext,
  topPadding = 140,      // ✅ presurvey 기준
  gapAfterTitle = 24,    // ✅ presurvey 기준
}: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      {/* 상단 여백(상태바 보정) */}
      <View style={styles.headerSpace} />

      {/* 타이틀 */}
      <View style={styles.inner}>
        <Text
          style={[styles.title, { marginTop: topPadding, marginBottom: gapAfterTitle }]}
          allowFontScaling={false}
        >
          {title}
        </Text>
      </View>

      {/* 본문 */}
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

      {/* 진행도 */}
      <Text style={styles.progressText} allowFontScaling={false}>{progressText}</Text>

      {/* 확인 버튼 (presurvey와 완전 동일) */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onNext}
        disabled={disabled}
        style={[styles.cta, disabled && styles.ctaDisabled]}
      >
        <Text style={styles.ctaText} allowFontScaling={false}>확인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0, // 이중 여백 방지
    paddingBottom: 20,
  },
  headerSpace: { height: 8 },

  inner: { paddingHorizontal: INSET },
  innerPadding: {
    paddingHorizontal: INSET,
    paddingBottom: 100, // 버튼(52) + 여유
  },

  // ✅ presurvey와 동일 타이포
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'left',
    lineHeight: 26,
    paddingLeft: 0, // presurvey question과 동일 좌측 패딩 감
  },

  body: { flex: 1 },
  bodyScroll: { flex: 1 },
  bodyContent: { alignItems: 'stretch' },

  progressText: {
    alignSelf: 'center',
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },

  // ✅ presurvey 버튼과 완전 동일
  cta: {
    alignSelf: 'center',
    width: '93%',
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 20,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    // Android elevation
    elevation: 3,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: 'white', fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 16 },
});
