import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
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

               {/* ✅ ‘나’ 탐색하기 → presurvey/intro 로 이동 */}
              <TouchableOpacity 
                style={styles.button}
                onPress={() => router.push('/presurvey/intro')}
                >
                <Image
                  source={require('../assets/images/compass.png')}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>‘나’ 탐색하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Image
                  source={require('../assets/images/map.png')}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>진로 설계하기</Text>
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
        <Text style={styles.sectionTitle}>오늘의 명언</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>“내일의 꿈은 오늘의 결정에서 시작된다.”</Text>
          <Text style={styles.quoteAuthor}>- 존 맥스웰</Text>
        </View>
      </View>

      {/* 📍 로드맵 확인하기 */}
      <View style={styles.roadmapContainer}>
        <Text style={styles.sectionTitle}>로드맵 확인하기</Text>
        <TouchableOpacity style={styles.roadmapCard}>
          <Image
            source={require('../assets/images/roadmap.png')}
            style={styles.roadmapImage}
          />
          <View style={styles.roadmapTextBox}>
            <Text style={styles.roadmapStep}>💡 Step 1</Text>
            <Text style={styles.roadmapTitle}>프론트엔드 개발자가 되려면?</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
    backgroundColor: '#F5F5F5',
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 40,
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
    fontSize: 18,
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
  },
  button: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingVertical: 6,    // ⬇️ 줄임
  paddingHorizontal: 12, // ⬇️ 줄임
  borderRadius: 10,      // 조금 더 작게
  marginTop: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 3,
},

icon: {
  width: 18,   // 줄임
  height: 18,
  marginRight: 6,
  resizeMode: 'contain',
},

buttonText: {
  fontSize: 13,   // ⬇️ 줄임
  fontWeight: '500',
  color: '#333',
},
 character: {
  width: 130,   // 기존보다 더 큼 (ex. 90 → 130)
  height: 130,
  resizeMode: 'contain',
},
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
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
  },
  roadmapStep: {
    fontSize: 13,
    color: '#4E41FF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roadmapTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
