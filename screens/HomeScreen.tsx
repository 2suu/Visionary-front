import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const TOPBAR_H = 44;   // 상단바 높이
  const GAP = 8;        // 상단바와 콘텐츠 사이 여백

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* 시계(상태바) 아래로 바로 붙도록 */}
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* ⬆ 상단바 아이콘 3개 */}
      <View style={[styles.topBar, { top: insets.top + 4 }]}>
        <TouchableOpacity onPress={() => console.log('menu')}>
          <Image source={require('../assets/images/menu.png')} style={styles.topIcon} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={() => console.log('notification')}>
            <Image source={require('../assets/images/bell.png')} style={styles.topIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('profile')}>
            <Image source={require('../assets/images/user.png')} style={styles.topIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
          contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top }  // ← 여기만 추가/수정
        ]}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        {/* 🎯 히어로 영역 */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#4E41FF', '#9C7FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroCircle}
          >
            <Text style={styles.heroTitle}>Planning your future</Text>

            {/* ▶ 버튼 + 캐릭터 수평 정렬 */}
            <View style={styles.heroRow}>
              <View style={styles.buttonColumn}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push('/presurvey/intro')}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.9}
                >
                  <Image
                    source={require('../assets/images/compass.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>설문조사진행</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.9}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Image
                    source={require('../assets/images/map.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>설문결과확인</Text>
                </TouchableOpacity>
              </View>

              <Image
                source={require('../assets/images/character.png')}
                style={styles.character}
              />
            </View>
          </LinearGradient>
        </View>

        {/* 📝 오늘의 명언 */}
        <View style={styles.quoteContainer}>
          <Text style={styles.sectionTitle}>📝 오늘의 명언</Text>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>“내일의 꿈은 오늘의 결정에서 시작된다.”</Text>
            <Text style={styles.quoteAuthor}>- 존 맥스웰</Text>
          </View>
        </View>

        {/* 📍 로드맵 확인하기 */}
        <View style={styles.roadmapContainer}>
          <Text style={styles.sectionTitle}>📍 로드맵 확인하기</Text>
          <TouchableOpacity style={styles.roadmapCard} activeOpacity={0.9}>
            <Image
              source={require('../assets/images/front.png')}
              style={styles.roadmapImage}
            />
            <View style={styles.roadmapTextBox}>
              <Text style={styles.roadmapStep}>💡 first RoadMap</Text>
              <Text style={styles.roadmapTitle}>      프론트엔드 개발자가 되려면</Text>
            </View>
          </TouchableOpacity>

            {/* Step 2 */}
            <TouchableOpacity style={[styles.roadmapCard, { marginTop: 16 }]} activeOpacity={0.9}>
              <Image source={require('../assets/images/back.png')} style={styles.roadmapImage} />
              <View style={styles.roadmapTextBox}>
                <Text style={styles.roadmapStep}>💡 Second RoadMap</Text>
                <Text style={styles.roadmapTitle}>      백엔드 개발자가 되려면</Text>
              </View>
            </TouchableOpacity>

 {/* Step 2 */}
            <TouchableOpacity style={[styles.roadmapCard, { marginTop: 16 }]} activeOpacity={0.9}>
              <Image source={require('../assets/images/analysis.png')} style={styles.roadmapImage} />
              <View style={styles.roadmapTextBox}>
                <Text style={styles.roadmapStep}>💡 Third RoadMap</Text>
                <Text style={styles.roadmapTitle}>      데이터 분석가가 되려면</Text>
              </View>
            </TouchableOpacity>

          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 60,
    backgroundColor: '#F5F5F5',
  },

  /* 상단바 */
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 44,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#333', // 필요 시 아이콘 색상 통일
  },

  heroContainer: {
    alignItems: 'center',
    marginTop: 0,
  },

  heroCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonColumn: {
    marginRight: 1,
    justifyContent: 'center',
    transform: [{ translateX: 15 }],  // ← 오른쪽으로 8px 밀기
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },

  icon: {
    width: 18,
    height: 18,
    marginRight: 6,
    resizeMode: 'contain',
  },

  buttonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    alignItems: 'center'
  },

  character: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  quoteContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  quoteBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  quoteText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },

  quoteAuthor: {
    textAlign: 'right',
    fontSize: 13,
    color: '#777',
  },

  roadmapContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  roadmapCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  roadmapImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
  },

  roadmapTextBox: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  roadmapStep: {
    fontSize: 13,
    color: '#4E41FF',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',        // ⬅️ 왼쪽 정렬
    alignSelf: 'flex-start',  // ⬅️ 컨테이너 안에서도 왼쪽 시작
  },

  roadmapTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'left',        // ⬅️ 왼쪽 정렬
    alignSelf: 'flex-start',  // ⬅️ 컨테이너 안에서도 왼쪽 시작
  },
});
