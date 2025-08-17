// screens/presurvey/components/QuestionWrapper.tsx
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  question?: string;
  children: ReactNode;
  onNext: () => void;
  error?: string | null;
  nextLabel?: string;
  gapAfterQuestion?: number;
  topPadding?: number;   // 질문 상단 여백
};

export default function QuestionWrapper({
  question,
  children,
  onNext,
  error,
  nextLabel = '다음',
  gapAfterQuestion = 16,
  topPadding = 90,       // ← 기본값 90
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!!question && (
          <Text
            style={[styles.question, { marginTop: topPadding, marginBottom: gapAfterQuestion }]}
            allowFontScaling={false}
          >
            {question}
          </Text>
        )}

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>

      {!!error && <Text style={styles.error} allowFontScaling={false}>{error}</Text>}

      <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.9}>
        <Text style={styles.nextText} allowFontScaling={false}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY = '#4E41FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
  },

  question: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    paddingLeft: 8, 
  },

  bodyScroll: { flex: 1 },
  bodyContent: {
    paddingBottom: 100, // 버튼 공간 확보
    alignItems: 'stretch',
  },

  error: { color: '#E53935', marginBottom: 8, textAlign: 'center' },

  nextBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'center',
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
});
