// app/result/_layout.tsx
import { Slot, usePathname, useRouter, type Href } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BasicInfoHeader from '../../screens/result/components/BasicInfoHeader';

const PRIMARY = '#4E41FF';
type StringHref = Extract<Href, string>;

const TABS: ReadonlyArray<{ label: string; path: StringHref }> = [
  { label: 'Big5',      path: '/result/big5' },
  { label: '흥미',      path: '/result/interest' },
  { label: '정서/대인', path: '/result/emotion' },
  { label: '종합결과',    path: '/result/values' },
];

export default function ResultsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // 👉 실제 컨텍스트 값으로 교체
  const basic = useMemo(
    () => ({ age: '23세', gender: '남자', edu: '4년제 대학교 재학', career: '신입' }),
    []
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F6F6FA' }}
      contentContainerStyle={{ paddingBottom: 40 }}
      stickyHeaderIndices={[1]} // [0]=기본정보, [1]=탭바
    >
      {/* [0] 기본정보 헤더 */}
      <View style={{ padding: 12 }}>
        <BasicInfoHeader
          age={basic.age}
          gender={basic.gender}
          edu={basic.edu}
          career={basic.career}
        />
      </View>

      {/* [1] 탭바 */}
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = pathname?.startsWith(t.path); // ← 하위 경로에도 활성 유지
          return (
            <TouchableOpacity
              key={t.label}
              style={styles.tabItem}
              onPress={() => router.replace(t.path as Href)} // back stack 안쌓이게 replace
              accessibilityRole="button"
              accessibilityState={{ selected: !!active }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              {active && <View style={styles.ind} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* [2] 섹션 콘텐츠 */}
      <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
        <Slot />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F5',
    zIndex: 10,
    elevation: 3,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 13, color: '#9AA0A6', fontWeight: '700' },
  tabTextActive: { color: '#111' },
  ind: { height: 3, width: 24, marginTop: 6, backgroundColor: PRIMARY, borderRadius: 2 },
});
