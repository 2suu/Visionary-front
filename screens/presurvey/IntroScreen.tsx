// screens/presurvey/IntroScreen.tsx
import { router } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IntroScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpace} />
      <Text style={styles.title}>‘나'는 누구일까?</Text>

      <Image
        source={require('../../assets/images/who.png')}
        style={styles.illust}
      />

      <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/presurvey/age')}>
        <Text style={styles.startText}>시작해보자</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const PRIMARY = '#4E41FF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' },
  headerSpace: { height: 32 },
  title: { fontSize: 20, fontWeight: '700', marginTop: 8, marginBottom: 12 },
  illust: { width: 220, height: 220, resizeMode: 'contain', marginTop: 8, marginBottom: 'auto' },
  startBtn: {
    width: '100%',
    height: 52,         // ⬅︎ 추가
    borderRadius: 14,   // ⬅︎ 통일
    backgroundColor: '#4E41FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  startText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

