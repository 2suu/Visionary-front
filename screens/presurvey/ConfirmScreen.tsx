import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRIMARY = '#4E41FF';

const ROUTES = {
  age: '/presurvey/age',
  gender: '/presurvey/gender',
  education: '/presurvey/education',
  experienceDetail: '/presurvey/experience-detail',
  experience: '/presurvey/experience',
  economySaving: '/presurvey/economy-saving',
  economySpending: '/presurvey/economy-spending',
  relationship: '/presurvey/relationship',
  mood: '/presurvey/mood',
  stress: '/presurvey/stress',
} as const;
type RoutePath = typeof ROUTES[keyof typeof ROUTES];

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
  moodLabel?: string; // 기본: 감정기복
  mood: string;
  moodRoute?: RoutePath;
  stressLabel?: string; // 기본: 스트레스
  stress: string;
  stressRoute?: RoutePath;
};

type Row = RowSingle | RowPair | RowEmotion;

export default function ConfirmScreen() {
  // const { data } = usePreSurveyStore();

  // 🔧 임시데이터
  const data = {
    age: 25,
    gender: '남자',
    education: '대학교 졸업',
    hasExp: true,
    expFields: ['경력분야', '데이터분석 인턴'],
    expYears: '6개월',
    saving: '저축',
    spending: '조금써요',
    relationshipFreq: '보통',
    relationshipStyle: '깊고 좁게',
    mood: '스스로 잘 조절',
    stress: '혼자만의 시간',
  };

  const rows: Row[] = useMemo(
    () => [
      { icon: '🎂', label: '나이', value: `${data.age ?? '미입력'}세`, route: ROUTES.age },
      { icon: '🚻', label: '성별', value: data.gender ?? '미입력', route: ROUTES.gender },
      { icon: '🎓', label: '학력', value: data.education ?? '미입력', route: ROUTES.education },
      {
        icon: '💼',
        label: '경력',
        value: data.hasExp
          ? `${(data.expFields || []).join(' ')}  ${data.expYears ?? ''}`.trim()
          : '없음',
        route: data.hasExp ? ROUTES.experienceDetail : ROUTES.experience,
      },
      // 경제적상황: 한 줄에 두 값
      {
        icon: '💰',
        label: '경제적상황',
        kind: 'pair',
        value: data.saving ?? '미입력',
        route: ROUTES.economySaving,
        value2: data.spending ?? '미입력',
        route2: ROUTES.economySpending,
      },
      { icon: '👥', label: '대인관계', value: data.relationshipFreq ?? '미입력', route: ROUTES.relationship },
      { icon: '🤝', label: '관계 스타일', value: data.relationshipStyle ?? '미입력', route: ROUTES.relationship },
      // 정서: 두 줄(감정기복/스트레스) 각각 ✏️
      {
        icon: '🧠',
        label: '정서',
        kind: 'emotion',
        moodLabel: '감정기복',
        mood: data.mood ?? '미입력',
        moodRoute: ROUTES.mood,
        stressLabel: '스트레스',
        stress: data.stress ?? '미입력',
        stressRoute: ROUTES.stress,
      },
    ],
    [data]
  );

  const goEdit = (route?: RoutePath) => {
    if (!route) return;
    router.push({ pathname: route, params: { from: 'confirm' } });
  };

  const onConfirm = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>‘나’는 누굴까?</Text>
        <Text style={styles.sub}>아래 정보가 나와 맞는지 확인해 주세요.</Text>

        <View style={styles.card}>
          {rows.map((r, idx) => {
            const divider = idx !== rows.length - 1 && styles.rowDivider;

            // 🔹 emotion 전용 렌더
            if (r.kind === 'emotion') {
              const moodLabel = r.moodLabel ?? '감정기복';
              const stressLabel = r.stressLabel ?? '스트레스';
              return (
                <View key={`${r.label}-${idx}`} style={[styles.row, divider]}>
                  <View style={styles.left}>
                    <Text style={styles.icon}>{r.icon}</Text>
                    <Text style={styles.label}>{r.label}</Text>
                  </View>

                  <View style={styles.rightBlock}>
                    {/* 1행: 감정기복 */}
                    <View style={styles.multiLineRow}>
                      <Text style={styles.subKey}>{moodLabel}</Text>
                      <TouchableOpacity onPress={() => goEdit(r.moodRoute)} activeOpacity={0.85} style={styles.valueFlex}>
                        <Text style={styles.value} numberOfLines={1}>{r.mood}</Text>
                      </TouchableOpacity>
                      <View style={styles.editBox}>
                        <TouchableOpacity onPress={() => goEdit(r.moodRoute)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Ionicons name="pencil" size={16} color="#8A8AA0" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* 2행: 스트레스 */}
                    <View style={styles.multiLineRow}>
                      <Text style={styles.subKey}>{stressLabel}</Text>
                      <TouchableOpacity onPress={() => goEdit(r.stressRoute)} activeOpacity={0.85} style={styles.valueFlex}>
                        <Text style={styles.value} numberOfLines={1}>{r.stress}</Text>
                      </TouchableOpacity>
                      <View style={styles.editBox}>
                        <TouchableOpacity onPress={() => goEdit(r.stressRoute)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Ionicons name="pencil" size={16} color="#8A8AA0" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            // 🔹 pair(두 값) 렌더
            if (r.kind === 'pair') {
              return (
                <View key={`${r.label}-${idx}`} style={[styles.row, divider]}>
                  <TouchableOpacity style={styles.left} activeOpacity={0.85} onPress={() => goEdit(r.route)}>
                    <Text style={styles.icon}>{r.icon}</Text>
                    <Text style={styles.label}>{r.label}</Text>
                  </TouchableOpacity>

                  {/* 고정 레이아웃: 값 영역 flex, 연필 박스 고정폭 */}
                  <View style={styles.rightWrap}>
                    <View style={styles.valueRow}>
                      <TouchableOpacity onPress={() => goEdit(r.route)} activeOpacity={0.85}>
                        <Text style={styles.value} numberOfLines={1}>{r.value}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => goEdit(r.route2)} activeOpacity={0.85}>
                        <Text style={styles.value} numberOfLines={1}>{r.value2}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.editBox}>
                      <TouchableOpacity onPress={() => goEdit(r.route)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="pencil" size={16} color="#8A8AA0" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }

            // 🔹 기본 single 렌더
            return (
              <View key={`${r.label}-${idx}`} style={[styles.row, divider]}>
                <TouchableOpacity style={styles.left} activeOpacity={0.85} onPress={() => goEdit(r.route)}>
                  <Text style={styles.icon}>{r.icon}</Text>
                  <Text style={styles.label}>{r.label}</Text>
                </TouchableOpacity>

                <View style={styles.rightWrap}>
                  <View style={styles.valueRow}>
                    <TouchableOpacity onPress={() => goEdit(r.route)} activeOpacity={0.85}>
                      <Text style={styles.value} numberOfLines={1}>{r.value}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.editBox}>
                    <TouchableOpacity onPress={() => goEdit(r.route)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="pencil" size={16} color="#8A8AA0" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.hint}>수정을 원하는 부분이 있다면 ✍️ 항목을 눌러주세요.</Text>
        <View style={{ height: 88 }} />
      </ScrollView>

      <TouchableOpacity style={styles.cta} onPress={onConfirm} activeOpacity={0.95}>
        <Text style={styles.ctaText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },

  title: { fontSize: 20, fontWeight: '800', color: '#111' },
  sub: { marginTop: 6, color: '#6A6A76' },

  card: {
    marginTop: 16,
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

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F1F6' },

  left: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, paddingRight: 8 },
  icon: { fontSize: 16, lineHeight: 18 },
  label: { fontSize: 14, color: '#2A2A35', fontWeight: '600' },

  // ✅ 오른쪽 영역 정렬 고정: 값은 flex, 연필은 고정폭 박스
  rightWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', maxWidth: '58%' },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1, flexGrow: 1, justifyContent: 'flex-end' },
  value: { fontSize: 14, color: '#3A3A46', lineHeight: 18 },
  editBox: { width: 28, height: 28, marginLeft: 6, alignItems: 'center', justifyContent: 'center' },

  // ✅ 정서 전용 오른쪽 블록
  rightBlock: { flex: 1, maxWidth: '58%' },
  multiLineRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  subKey: { fontSize: 13, color: '#6A6A76', marginRight: 8, minWidth: 64, lineHeight: 18 },
  valueFlex: { flex: 1, alignItems: 'flex-end' },

  hint: { marginTop: 12, textAlign: 'center', color: '#8A8AA0', fontSize: 12 },

  cta: {
    position: 'absolute', left: 20, right: 20, bottom: 20,
    height: 52, borderRadius: 14, backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  ctaText: { color: 'white', fontSize: 16, fontWeight: '800' },
});
