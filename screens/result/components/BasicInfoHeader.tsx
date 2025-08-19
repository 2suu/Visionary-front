import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = { name?: string; age: string; gender: string; edu: string; career: string };

export default function BasicInfoHeader({ name='하이하이', age, gender, edu, career }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.grid2}>
        <InfoBox icon="🎂" label=" 나이" value={age} />
        <InfoBox icon="🧑" label=" 성별" value={gender} />
        <InfoBox icon="🎓" label=" 최종 학력" value={edu} />
        <InfoBox icon="💼" label=" 경력" value={career} />
      </View>
    </View>
  );
}

function InfoBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={{ fontSize: 28, marginRight: 8 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', borderRadius:14, padding:16,
          shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  title:{ fontSize:18, fontWeight:'800', marginBottom:12 },
  grid2:{ flexDirection:'row', flexWrap:'wrap', columnGap:12, rowGap:12 },
  infoBox:{
  width:'47%',
  backgroundColor:'#FAFAFE',
  borderRadius:14,
  padding:14,
  elevation:1,
  flexDirection:'row',      // ← 가로 배치
  alignItems:'center',      // ← 세로 중앙 정렬
},
    infoRight:{
    alignItems:'flex-end'         // label + value를 오른쪽 정렬
  },
  infoLabel:{ marginTop:6, color:'#6A6A76', fontSize:12 },
  infoValue:{ fontSize:16, fontWeight:'700', marginTop:2 },
});
