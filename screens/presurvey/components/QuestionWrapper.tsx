// screens/presurvey/components/QuestionWrapper.tsx
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  question?: string;
  children: ReactNode;
  onNext: () => void;
  error?: string | null;
  nextLabel?: string;
};

export default function QuestionWrapper({
  question,
  children,
  onNext,
  error,
  nextLabel = '다음',
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!!question && <Text style={styles.question}>{question}</Text>}

        {/* 👇 본문을 스크롤 가능하게 변경 */}
        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent} // 버튼 높이만큼 여유 공간 포함
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>

      {/* 에러 메시지 */}
      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.9}>
        <Text style={styles.nextText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY = '#4E41FF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  content: { flex: 1 },

  question: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 16, color: '#111' },

  // 👇 스크롤 영역 스타일
  bodyScroll: { flex: 1 },
  bodyContent: {
    paddingBottom: 100,   // ✅ 하단 버튼(52) + 간격 여유
    alignItems: 'stretch' // 리스트가 가로로 꽉 차도록
  },

  error: { color: '#E53935', marginBottom: 8, textAlign: 'center' },

  nextBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
