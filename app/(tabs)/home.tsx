import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heading}>Planning your future</Text>
        <Image source={require('../../assets/images/character.png')} style={styles.character} />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>‘나’ 탐색하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>진로 설계하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>오늘의 명언</Text>
        <Text style={styles.quote}>
          “내일의 꿈은 오늘의 결정에서 시작된다.”{'\n'}- 존 맥스웰
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  character: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4E41FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  buttonText: {
    color: '#4E41FF',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quote: {
    backgroundColor: '#f5f5ff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#4E41FF',
    borderWidth: 1,
    color: '#333',
    fontSize: 14,
  },
});
