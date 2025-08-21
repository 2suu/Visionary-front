import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
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
        contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
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
                {/* 설문조사하기 */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push('/presurvey/intro')}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  activeOpacity={0.9}
                >
                  <Image source={require('../assets/images/compass.png')} style={styles.icon} />
                  <Text style={styles.buttonText}>설문조사하기</Text>
                </TouchableOpacity>

                {/* 설문조사결과 */}
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.9}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  onPress={() => router.push('/result' as Href)}
                  accessibilityRole="button"
                >
                  <Image source={require('../assets/images/light.png')} style={styles.icon} />
                  <Text style={styles.buttonText}>설문조사결과</Text>
                </TouchableOpacity>

                {/* 마이 로드맵 */}
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.9}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  onPress={() => router.push('/career-recommendations' as Href)}
                  accessibilityRole="button"
                >
                  <Image source={require('../assets/images/map.png')} style={styles.icon} />
                  <Text style={styles.buttonText}>맞춤형직업추천</Text>
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

          <TouchableOpacity
            style={styles.roadmapCard}
            activeOpacity={0.9}
            onPress={() => router.push('/my-roadmap')}
          >
            <Image source={require('../assets/images/front.png')} style={styles.roadmapImage} />
            <View style={styles.roadmapTextBox}>
              <Text style={styles.roadmapStep}>💡 first RoadMap</Text>
              <Text style={styles.roadmapTitle}>      프론트엔드 개발자가 되려면</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.roadmapCard, { marginTop: 16 }]} activeOpacity={0.9}>
            <Image source={require('../assets/images/back.png')} style={styles.roadmapImage} />
            <View style={styles.roadmapTextBox}>
              <Text style={styles.roadmapStep}>💡 Second RoadMap</Text>
              <Text style={styles.roadmapTitle}>      백엔드 개발자가 되려면</Text>
            </View>
          </TouchableOpacity>

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
    tintColor: '#333',
  },

  heroContainer: {
    alignItems: 'center',
    marginTop: 0,
  },

  heroCircle: {
    width: 320,       // ← 3개 버튼 위해 살짝 키움
    height: 320,
    borderRadius: 160,
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
    transform: [{ translateX: 15 }],
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
    textAlign: 'left',
    alignSelf: 'flex-start',
  },

  roadmapTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
});
