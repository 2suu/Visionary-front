// screens/presurvey/IntroScreen.tsx
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ROUTES, useSurvey } from './survey-context';

const PRIMARY = '#4E41FF';

export default function IntroScreen() {
  const { data, setData } = useSurvey();

  // ✅ 이미 방문했다면 자동 스킵 (선택)
  useEffect(() => {
    if (data.introVisited) {
      router.replace(ROUTES.age);
    }
  }, [data.introVisited]);

  const onStart = () => {
    setData({ introVisited: true });
    router.push(ROUTES.age);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpace} />
      <Text style={styles.title}>‘나'는 누구일까?</Text>

      <Image
        source={require('../../assets/images/who.png')}
        style={styles.illust}
        resizeMode="contain"  // style.resizeMode 대신 prop 사용
      />

      <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.95}>
        <Text style={styles.startText}>시작해보자</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  headerSpace: { height: 32 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 8, marginBottom: 12 },
  illust: { width: 220, height: 220, marginTop: 8, marginBottom: 'auto' },
  startBtn: {
    width: '100%',
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
});
