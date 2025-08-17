// screens/presurvey/ConfirmScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES, useSurvey } from '../../screens/presurvey/survey-context';

const PRIMARY = '#4E41FF';

// ✅ 타입 안전 (괄호 필수)
type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// 왼쪽(아이콘+라벨) 고정 폭: 이 값만 조절하면 전체 정렬이 같이 움직여요.
const LABEL_COL_WIDTH = 120;

type RowBase = {
  icon: string;
  label: string;
  kind?: 'single' | 'pair' | 'emotion';
};

type RowSingle = RowBase & {
  kind?: 'single';
  value: string;
  route?: RoutePath;
};

type RowPair = RowBase & {
  kind: 'pair';
  value: string;
  route?: RoutePath;
  value2: string;
  route2?: RoutePath;
};

type RowEmotion = RowBase & {
  kind: 'emotion';
  moodLabel?: string;
  mood: string;
  moodRoute?: RoutePath;
  stressLabel?: string;
  stress: string;
  stressRoute?: RoutePath;
};

type Row = RowSingle | RowPair | RowEmotion;

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const CTA_HEIGHT = 52;
  const { data, formatExperience } = useSurvey();

  const expText = useMemo(() => {
    if (data.hasExperience === false) return '없음';
    if (data.hasExperience && (!data.experiences || data.experiences.length === 0)) {
      return '경력 있음 (상세 미입력)';
    }
    return (data.experiences || []).map(formatExperience).join(' / ');
  }, [data.hasExperience, data.experiences, formatExperience]);

  const rows: Row[] = useMemo(
    () => [
      { icon: '🎂', label: '나이', value: (data.age ? `${data.age}세` : '미입력'), route: ROUTES.age },
      { icon: '🚻', label: '성별', value: data.gender ?? '미입력', route: ROUTES.gender },
      { icon: '🎓', label: '학력', value: data.education ?? '미입력', route: ROUTES.education },

      {
        icon: '💼',
        label: '경력',
        value: expText || '미입력',
        route: data.hasExperience ? ROUTES.experienceDetail : ROUTES.experience,
      },

      // 💰 경제적상황: 2줄(저축/생활비) + 각 줄 개별 ✏️
      {
        icon: '💰',
        label: '경제적상황',
        kind: 'pair',
        value: data.savingShort ?? '미입력',
        route: ROUTES.economySaving,
        value2: data.spendingShort ?? '미입력',
        route2: ROUTES.economySpending,
      },

      // 대인관계
      { icon: '👥', label: '대인관계', value: data.relationFreq ?? '미입력', route: ROUTES.relationship },
      { icon: '🤝', label: '관계 스타일', value: data.relationStyle ?? '미입력', route: ROUTES.relationship },

      // 🧠 정서: 감정기복/스트레스 (각 줄 개별 ✏️)
      {
        icon: '💖',
        label: '정서',
        kind: 'emotion',
        moodLabel: '감정기복',
        mood: data.moodShort ?? '미입력',
        moodRoute: ROUTES.mood,
        stressLabel: '스트레스',
        stress: data.stressShort ?? '미입력',
        stressRoute: ROUTES.stress,
      },
    ],
    [data, expText]
  );

  const goEdit = (route?: RoutePath) => {
    if (!route) return;
    router.push({ pathname: route, params: { from: 'confirm' } });
  };

  const onConfirm = () => {
    // TODO: 추후 서버 저장 연결 예정
    router.replace('/survey/intro');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: 64 + insets.top,
            paddingBottom: 20 + insets.bottom + CTA_HEIGHT + 16,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>‘나’는 누굴까?</Text>
        <Text style={styles.sub}>아래 정보가 나와 맞는지 확인해 주세요.</Text>

        <View style={styles.card}>
          {rows.map((r, idx) => {
            const divider = idx !== rows.length - 1 && styles.rowDivider;

            // 🧠 정서 (2줄 + 각 줄 개별 ✏️)
            if (r.kind === 'emotion') {
              const moodLabel = r.moodLabel ?? '감정기복';
              const stressLabel = r.stressLabel ?? '스트레스';
              return (
                <View key={`${r.label}-${idx}`} style={[styles.row, divider]}>
                  <View style={styles.leftCol}>
                    <Text style={styles.icon}>{r.icon}</Text>
                    <Text style={styles.label}>{r.label}</Text>
                  </View>

                  <View style={styles.rightBlockRow}>
                    <View style={styles.rightCol}>
                      <View style={styles.multiLineRow}>
                        <Text style={styles.subKey}>{moodLabel}</Text>
                        <TouchableOpacity onPress={() => goEdit(r.moodRoute)} activeOpacity={0.85} style={styles.valueFlex}>
                          <Text style={styles.valueLeft} numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false}>
                            {r.mood}
                          </Text>
                        </TouchableOpacity>

                        {/* ✏️ 감정기복 전용 */}
                        <TouchableOpacity
                          onPress={() => goEdit(r.moodRoute)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.editInline}
                        >
                          <Ionicons name="pencil" size={16} color="#8A8AA0" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.multiLineRow}>
                        <Text style={styles.subKey}>{stressLabel}</Text>
                        <TouchableOpacity onPress={() => goEdit(r.stressRoute)} activeOpacity={0.85} style={styles.valueFlex}>
                          <Text style={styles.valueLeft} numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false}>
                            {r.stress}
                          </Text>
                        </TouchableOpacity>

                        {/* ✏️ 스트레스 전용 */}
                        <TouchableOpacity
                          onPress={() => goEdit(r.stressRoute)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.editInline}
                        >
                          <Ionicons name="pencil" size={16} color="#8A8AA0" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            // 💰 경제적상황 (2줄 + 각 줄 개별 ✏️)
            if (r.kind === 'pair') {
              return (
                <View key={`${r.label}-${idx}`} style={[styles.row, divider]}>
                  <TouchableOpacity style={styles.leftCol} activeOpacity={0.85} onPress={() => goEdit(r.route)}>
                    <Text style={styles.icon}>{r.icon}</Text>
                    <Text style={styles.label}>{r.label}</Text>
                  </TouchableOpacity>

                  <View style={styles.rightBlockRow}>
                    <View style={styles.rightCol}>
                      <View style={styles.multiLineRow}>
                        <Text style={styles.subKey}>저축</Text>
                        <TouchableOpacity onPress={() => goEdit(r.route)} activeOpacity={0.85} style={styles.valueFlex}>
                          <Text style={styles.valueLeft} numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false}>
                            {r.value}
                          </Text>
                        </TouchableOpacity>

                        {/* ✏️ 저축 전용 */}
                        <TouchableOpacity
                          onPress={() => goEdit(r.route)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.editInline}
                        >
                          <Ionicons name="pencil" size={16} color="#8A8AA0" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.multiLineRow}>
                        <Text style={styles.subKey}>생활비</Text>
                        <TouchableOpacity onPress={() => goEdit(r.route2)} activeOpacity={0.85} style={styles.valueFlex}>
                          <Text style={styles.valueLeft} numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false}>
                            {r.value2}
                          </Text>
                        </TouchableOpacity>

                        {/* ✏️ 생활비 전용 */}
                        <TouchableOpacity
                          onPress={() => goEdit(r.route2)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.editInline}
                        >
                          <Ionicons name="pencil" size={16} color="#8A8AA0" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            // 일반 1줄 (나이/성별/학력/경력/대인관계/관계 스타일)
            return (
              <View key={`${r.label}-${idx}`} style={[styles.row, divider]}>
                <TouchableOpacity style={styles.leftCol} activeOpacity={0.85} onPress={() => goEdit(r.route)}>
                  <Text style={styles.icon}>{r.icon}</Text>
                  <Text style={styles.label}>{r.label}</Text>
                </TouchableOpacity>

                {/* 오른쪽도 블록 레이아웃로 통일 → 정렬 일관성 */}
                <View style={styles.rightBlockRow}>
                  <View style={styles.rightCol}>
                    <View style={styles.singleLineRow}>
                      <TouchableOpacity onPress={() => goEdit(r.route)} activeOpacity={0.85} style={styles.valueFlex}>
                        <Text style={styles.valueLeft} numberOfLines={1} ellipsizeMode="tail" allowFontScaling={false}>
                          {r.value}
                        </Text>
                      </TouchableOpacity>

                      {/* ✏️ 단일 값 전용 */}
                      <TouchableOpacity
                        onPress={() => goEdit(r.route)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={styles.editInline}
                      >
                        <Ionicons name="pencil" size={16} color="#8A8AA0" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.hint}>수정을 원하는 부분이 있다면 ✍️ 항목을 눌러주세요.</Text>
      </ScrollView>

      <TouchableOpacity
        style={[styles.cta, { bottom: 20 + insets.bottom }]}
        onPress={onConfirm}
        activeOpacity={0.95}
      >
        <Text style={styles.ctaText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },

  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    paddingLeft: 8,
  },
  sub: {
    marginTop: 6,
    color: '#6A6A76',
    alignSelf: 'stretch',
    paddingLeft: 8,
  },

  card: {
    marginTop: 30,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E5ED',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // 리스트 아이템
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F1F6' },

  // ⬅️ 고정 폭 왼쪽 컬럼: 아이콘+라벨
  leftCol: {
    width: LABEL_COL_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  icon: { fontSize: 16, lineHeight: 18 },
  label: { flexShrink: 1 },

  // ➡️ 오른쪽(값 영역) - 블록 레이아웃 공통
  rightBlockRow: { flex: 1, flexDirection: 'row', alignItems: 'stretch', minWidth: 0 },
  rightCol: { flex: 1, minWidth: 0, gap: 4 },

  // 2줄(경제/정서) 각 라인
  multiLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    minWidth: 0,
  },
  // 1줄(일반) 전용
  singleLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  // 서브 키(저축/생활비/감정기복/스트레스)
  subKey: { fontSize: 13, color: '#6A6A76', marginRight: 6, minWidth: 56, lineHeight: 18 },

  // 값
  valueFlex: { flex: 1, alignItems: 'flex-start', minWidth: 0 },
  valueLeft: {
    fontSize: 14,
    color: '#111',
    textAlign: 'left',       // ← 왼쪽 정렬 통일
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 각 줄 끝 ✏️
  editInline: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  hint: { marginTop: 90, textAlign: 'center', color: '#8A8AA0', fontSize: 12 },

  // 하단 CTA
  cta: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: { color: 'white', fontSize: 16, fontWeight: '800' },
});
