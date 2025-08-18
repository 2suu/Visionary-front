// screens/survey/Intro.tsx
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const PRIMARY = '#4E41FF';

export default function SurveyIntro() {
  const start = useCallback(() => {
    router.push({ pathname: '/survey/q/[no]', params: { no: '1' } });
  }, []);

  const { width } = useWindowDimensions(); // ★ 이모지 크기 반응형
  const emojiSize = Math.max(72, Math.min(100, Math.floor(width * 0.22))); // ★ 72~100 사이

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 여백 최소화 + 아래 요소들로 세로 중앙 느낌 강화 */}
      <View style={styles.headerSpace} />

      {/* 타이틀 */}
      <Text style={styles.title} allowFontScaling={false}>‘나’와 맞는 직무를 찾아볼까?</Text>
      <Text style={styles.subtitle} allowFontScaling={false}>총 47문항 · 약 5~7분 ⏱️</Text>

      <View style={styles.illustBox}>
        <Image
          source={require('../../assets/images/find.png')}
          style={styles.illust}
          resizeMode="contain"
        />
      </View>

      {/* 체크 포인트 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>이렇게 진행돼요</Text>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet} allowFontScaling={false}>-</Text>
          <Text style={styles.bulletText} allowFontScaling={false}>1~44: 5점 척도(전혀 아니다 ~ 매우 그렇다)</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet} allowFontScaling={false}>-</Text>
          <Text style={styles.bulletText} allowFontScaling={false}>45: 흥미 분야 / 46: 희망 연봉 / 47: 우선순위 정하기</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet} allowFontScaling={false}>-</Text>
          <Text style={styles.bulletText} allowFontScaling={false}>마지막에 한꺼번에 확인·수정 후 제출</Text>
        </View>
      </View>

      {/* 시작 버튼 */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={start}
        activeOpacity={0.95}
        hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} // ★ 터치 여유
      >
        <Text style={styles.startText} allowFontScaling={false}>검사 시작하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerSpace: { height: 24 }, // ★ 살짝 줄여 위쪽이 덜 비도록
title: {
    fontSize: 25,
    fontWeight: '700',
    marginTop: 140,
    marginBottom: 20, // 제목과 이미지 사이 여백
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
  },
  emojiBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  emoji: {
    // fontSize는 런타임에서 계산
  },

  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F5F7FF', // ★ 톤 살짝 밝게
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 'auto',       // ★ 아래 버튼과 균형
    borderWidth: StyleSheet.hairlineWidth, // ★ 미세한 테두리
    borderColor: '#E6E8FF',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, paddingLeft: 6,  color: '#333' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { width: 18, textAlign: 'center', color: '#444', fontSize: 16, lineHeight: 20, marginTop: -1 },
  bulletText: { flex: 1, fontSize: 14, color: '#444' },

 startBtn: {
  width: '93%',
  height: 52,             // QuestionWrapper와 동일 (고정 높이)
  borderRadius: 14,
  backgroundColor: PRIMARY,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
  marginBottom: 20,       // 동일한 하단 여백
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
  alignSelf: 'center',
},
startText: {
  color: 'white',
  fontSize: 16,           // 동일
  fontWeight: '700',
  textAlign: 'center',
  lineHeight: 16,         // 동일
},

  helper: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 10,
    textAlign: 'center',
  },
  illustBox: {
  width: '100%',
  alignItems: 'center',   // 가운데 정렬
  marginVertical: 16,     // 위아래 간격
},
illust: {
  width: 220,
  height: 220,
},


});
