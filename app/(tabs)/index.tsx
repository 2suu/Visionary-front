import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 상단 배너 */}
      <View style={styles.heroContainer}>
        <View style={styles.heroCircle}>
          <Text style={styles.heroText}>Planning your future</Text>
          <Image source={require('../../assets/images/character.png')} style={styles.character} />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>‘나’ 탐색하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>진로 설계하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 오늘의 명언 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>오늘의 명언</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.quote}>
            “내일의 꿈은 오늘의 결정에서 시작된다.”{"\n"}– 알버트 아인슈타인
          </Text>
        </View>
      </View>

      {/* 로드맵 확인하기 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>로드맵 확인하기</Text>
        <Image source={require('../../assets/images/roadmap.png')} style={styles.roadmapImage} />
        <Text style={styles.roadmapCaption}>프론트엔드 개발자가 되려면?</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heroContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  heroCircle: {
    backgroundColor: '#6C4CF2',
    borderRadius: 200,
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  heroText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  character: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  buttonGroup: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 6,
  },
  optionText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  quoteBox: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aab6ff',
    shadowColor: '#ccc',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  quote: {
    fontSize: 15,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  roadmapImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  roadmapCaption: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
});
