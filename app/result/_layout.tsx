// app/result/_layout.tsx
import { Slot, usePathname, useRouter, type Href } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BasicInfoHeader from '../../screens/result/components/BasicInfoHeader';

type StringHref = Extract<Href, string>;
const PRIMARY = '#4E41FF';

// ✅ 탭 목록 (라벨 + 경로)
const TABS: ReadonlyArray<{ label: string; path: StringHref }> = [
  { label: 'Big5',      path: '/result/big5' },
  { label: '흥미',      path: '/result/interest' },
  { label: '정서/대인', path: '/result/emotion' },
  { label: '종합결과',  path: '/result/values' },
];

// ✅ 각 탭 폭을 25%로 고정하기 위한 상수
//    → ITEM_PCT = "25%"
const COLS = TABS.length;
const ITEM_PCT: `${number}%` = `${100 / COLS}%`;

export default function ResultsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // 👉 실제 컨텍스트 값으로 교체 예정 (현재는 더미 데이터)
  const basic = useMemo(
    () => ({ age: '23세', gender: '남자', edu: '4년제 대학교 재학', career: '신입' }),
    []
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F6F6FA' }}
      contentContainerStyle={{ paddingBottom: 40 }}
      stickyHeaderIndices={[1]} // [1] index를 고정해서 헤더 스티키 처리
    >
      {/* [0] 기본정보 */}
      <View style={{ padding: 12 }}>
        <BasicInfoHeader {...basic} />
      </View>

      {/* [1] 탭바 */}
      {/* ❗ 현재 tabRow 스타일은 적용이 안 되고 있음 → tabBar 안에 감싸줘야 함 */}
      <View style={styles.tabBar}>
        <View style={styles.tabRow}>
          {TABS.map((t) => {
            const active = pathname?.startsWith(t.path);
            return (
              <TouchableOpacity
                key={t.label}
                // width: ITEM_PCT → 각 탭을 25% 고정폭으로
                // flex:1 을 주면 자동으로 균등 분배
                style={[styles.tabItem, { width: ITEM_PCT }]}
                onPress={() => router.replace(t.path as Href)}
                accessibilityRole="button"
                accessibilityState={{ selected: !!active }}
              >
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}
                  numberOfLines={1}      // 탭 라벨 줄바꿈 방지
                  ellipsizeMode="tail"   // 너무 길면 ... 처리
                >
                  {t.label}
                </Text>
                {/* 활성 탭 하단 보라색 인디케이터 */}
                {active && <View style={styles.ind} />}
              </TouchableOpacity>
            );
          })}
        </View>
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
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F5',
    zIndex: 10,
    elevation: 3,
  },
  // ✅ 탭들을 가로 한 줄로 나열
  tabRow: {
    flexDirection: 'row',  // 무조건 가로 배치
    flexWrap: 'nowrap',    // 줄바꿈 금지
    alignItems: 'flex-end',
    justifyContent: 'space-between', 
    // 👉 탭 간격을 조절하고 싶으면 여기서 변경
    // - 'space-between': 양 끝까지 벌림
    // - 'space-around': 양 옆에 여백
    // - 'center': 가운데 정렬
  },
  // ✅ 각 탭 아이템
  tabItem: {
    flex: 1,          // 균등 분배 (width 대신 flex 사용 가능)
    minWidth: 0,      // 긴 글자도 강제로 줄바꿈 안 하고 ... 처리
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: { fontSize: 13, color: '#9AA0A6', fontWeight: '700' },
  tabTextActive: { color: '#111' },
  ind: {
    marginTop: 6,
    height: 3,
    width: 28,
    backgroundColor: PRIMARY,
    borderRadius: 2,
  },
});
