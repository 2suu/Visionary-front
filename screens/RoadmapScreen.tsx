import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/*************************
 * Design Tokens
 *************************/
const COLOR = {
  bg: '#F5F5F5',
  text: '#111111',
  sub: '#6A6A76',
  primary: '#4E41FF',
  card: '#FFFFFF',
  divider: '#EEEFF3',
  shadow: '#000000',
};

const RADIUS = { xs: 6, sm: 10, md: 14, lg: 18, xl: 22, pill: 999 } as const;
const SPACE = { xxs: 4, xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;

/*************************
 * Types
 *************************/
export type RoadmapItem = { id: string; text: string; done?: boolean };
export type RoadmapSection = { id: string; title: string; items: RoadmapItem[] };

/*************************
 * Mock Data
 *************************/
const INITIAL_SECTIONS: RoadmapSection[] = [
  {
    id: 'sec-1',
    title: '1. 관련 학과 진학',
    items: [
      { id: '1-1', text: '공학·자연계열 선택(수학·과학 중심)', done: true },
      { id: '1-2', text: '정보·컴퓨터·웹 프로그래밍 기초 수강', done: true },
      { id: '1-3', text: '컴퓨터공학, 소프트웨어 관련 학과 진학', done: false },
    ],
  },
  {
    id: 'sec-2',
    title: '2. 코딩 기초 학습',
    items: [
      { id: '2-1', text: '인프런·생활코딩·패스트캠퍼스 강의 수강', done: true },
      { id: '2-2', text: '유튜브 "나도코딩", "생활코딩" 학습', done: false },
      { id: '2-3', text: 'HTML/CSS 기초 태그 & 속성 연습', done: false },
    ],
  },
  {
    id: 'sec-3',
    title: '3. 자바스크립트 입문',
    items: [
      { id: '3-1', text: 'JS 문법(변수, 조건문, 반복문) 익히기' },
      { id: '3-2', text: 'DOM 조작 & 이벤트 핸들링 실습' },
      { id: '3-3', text: 'ES6+ 문법(화살표함수, 모듈 등) 이해' },
    ],
  },
  {
    id: 'sec-4',
    title: '4. 프레임워크 학습 (React 중심)',
    items: [
      { id: '4-1', text: 'React 기초(컴포넌트, Props, State)' },
      { id: '4-2', text: 'React Hooks, 라우팅, 상태관리' },
      { id: '4-3', text: '미니 프로젝트 제작(예: Todo 앱)' },
    ],
  },
  {
    id: 'sec-5',
    title: '5. 협업·툴·프로젝트 경험',
    items: [
      { id: '5-1', text: 'Git/GitHub 사용법, 브랜치 전략 이해' },
      { id: '5-2', text: 'Vite, ESLint, Prettier, Figma 등 툴 익히기' },
      { id: '5-3', text: '팀 프로젝트 참여(디자인·백엔드와 협업)' },
    ],
  },
  {
    id: 'sec-6',
    title: '6. 취업 준비 및 실전',
    items: [
      { id: '6-1', text: '코딩 테스트 대비(프로그래머스 등)' },
      { id: '6-2', text: '개인 포트폴리오 웹사이트 제작' },
      { id: '6-3', text: '이력서·GitHub 레포지토리 정리' },
    ],
  },
];

/*************************
 * UI Atoms
 *************************/
const BulletItemComponent = ({ 
  label, 
  done, 
  onToggle 
}: { 
  label: string; 
  done?: boolean; 
  onToggle?: () => void 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const bulletStyle = [
    styles.bulletRow,
    isPressed && styles.bulletRowPressed,
    isHovered && styles.bulletRowHovered,
  ];

  const touchableProps = Platform.OS === 'web' ? {
    accessibilityRole: "checkbox" as const,
    accessibilityState: { checked: !!done },
    onPress: onToggle,
    onPressIn: () => setIsPressed(true),
    onPressOut: () => setIsPressed(false),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    activeOpacity: 0.9,
  } : {
    accessibilityRole: "checkbox" as const,
    accessibilityState: { checked: !!done },
    onPress: onToggle,
    onPressIn: () => setIsPressed(true),
    onPressOut: () => setIsPressed(false),
    activeOpacity: 0.9,
  };
  
  return (
    <TouchableOpacity {...touchableProps} style={bulletStyle}>
      <View style={[styles.check, done && styles.checkOn]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.bulletText, done && styles.bulletDone]}>{label}</Text>
    </TouchableOpacity>
  );
};

BulletItemComponent.displayName = 'BulletItem';
const BulletItem = memo(BulletItemComponent);

/*************************
 * Section Card
 *************************/
const SectionCardComponent = ({
  section,
  onToggleItem,
}: {
  section: RoadmapSection;
  onToggleItem: (sectionId: string, itemId: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const animatedHeight = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const progress = useMemo(() => {
    const total = section.items.length || 1;
    const done = section.items.filter((i) => i.done).length;
    return (done / total) * 100;
  }, [section.items]);

  // 진행률 변경 시 애니메이션
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);

  const toggleOpen = useCallback(() => {
    const toValue = open ? 0 : 1;
    const rotationValue = open ? 1 : 0;
    
    setOpen(!open);
    
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotation, {
        toValue: rotationValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, animatedHeight, animatedOpacity, animatedRotation]);

  const cardStyle = [
    styles.card,
    isPressed && styles.cardPressed,
    isHovered && styles.cardHovered,
  ];

  const touchableProps = Platform.OS === 'web' ? {
    onPress: toggleOpen,
    onPressIn: () => setIsPressed(true),
    onPressOut: () => setIsPressed(false),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    activeOpacity: 0.9,
  } : {
    onPress: toggleOpen,
    onPressIn: () => setIsPressed(true),
    onPressOut: () => setIsPressed(false),
    activeOpacity: 0.9,
  };

  const rotateInterpolate = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const progressWidthInterpolate = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={cardStyle}>
      <TouchableOpacity {...touchableProps}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Animated.Text 
            accessibilityRole="text" 
            style={[
              styles.chevron,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            ⌄
          </Animated.Text>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.cardBodyContainer,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000], // 충분히 큰 값
            }),
            opacity: animatedOpacity,
          },
        ]}
      >
        <View style={styles.cardBody}>
          {section.items.map((it) => (
            <BulletItem
              key={it.id}
              label={it.text}
              done={!!it.done}
              onToggle={() => onToggleItem(section.id, it.id)}
            />
          ))}

          <View style={styles.progressRow}> 
            <View style={styles.progressHeader}>
              <Text style={styles.progressCaption}>진행률</Text>
              <Text style={styles.progressLabel}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressWrap}>
              <Animated.View style={[
                styles.progressBar, 
                { width: progressWidthInterpolate }
              ]} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

SectionCardComponent.displayName = 'SectionCard';
const SectionCard = memo(SectionCardComponent);

/*************************
 * Main Screen
 *************************/
const RoadmapScreenComponent: React.FC = () => {
  const [sections, setSections] = useState<RoadmapSection[]>(INITIAL_SECTIONS);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'my-roadmap'>('roadmap');

  const onToggleItem = useCallback((sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it)),
        };
      })
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userButton}>
              <View style={styles.userIcon}>
                <Text style={styles.userIconText}>👤</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'roadmap' && styles.activeTab]}
            onPress={() => setActiveTab('roadmap')}
          >
            <Text style={[styles.tabText, activeTab === 'roadmap' && styles.activeTabText]}>
              로드맵
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'my-roadmap' && styles.activeTab]}
            onPress={() => setActiveTab('my-roadmap')}
          >
            <Text style={[styles.tabText, activeTab === 'my-roadmap' && styles.activeTabText]}>
              나의 로드맵
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>프론트엔드 개발자 로드맵</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} onToggleItem={onToggleItem} />
        ))}

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

RoadmapScreenComponent.displayName = 'RoadmapScreen';
const RoadmapScreen = memo(RoadmapScreenComponent);

export default RoadmapScreen;

/*************************
 * Styles
 *************************/
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLOR.bg },
  topHeader: {
    backgroundColor: '#FFFFFF',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md,
  },
  menuButton: {
    padding: SPACE.xs,
  },
  menuIcon: {
    fontSize: 20,
    color: COLOR.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
  },
  notificationButton: {
    padding: SPACE.xs,
  },
  userButton: {
    padding: SPACE.xs,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconText: {
    fontSize: 16,
  },
  iconText: {
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACE.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLOR.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLOR.sub,
  },
  activeTabText: {
    color: COLOR.primary,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md,
    backgroundColor: COLOR.bg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.text,
  },
  scrollContent: {
    paddingHorizontal: SPACE.lg,
    paddingBottom: SPACE.xxl,
  },
  card: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.lg,
    marginBottom: SPACE.lg,
    shadowColor: COLOR.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardPressed: {
    backgroundColor: '#F8F9FF',
    borderColor: COLOR.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    transform: [{ scale: 0.995 }],
  },
  cardHovered: {
    backgroundColor: '#FAFBFF',
    borderColor: '#C4C4FF',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    transform: [{ scale: 1.002 }],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.text,
  },
  chevron: {
    fontSize: 16,
    color: COLOR.sub,
    lineHeight: 16,
    textAlign: 'center',
    minWidth: 20,
  },
  cardBodyContainer: {
    overflow: 'hidden',
  },
  cardBody: {
    marginTop: SPACE.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.xs,
    borderRadius: RADIUS.sm,
    marginHorizontal: -SPACE.xs,
  },
  bulletRowPressed: {
    backgroundColor: '#F0F0F5',
  },
  bulletRowHovered: {
    backgroundColor: '#F8F8FA',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLOR.divider,
    marginRight: SPACE.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: COLOR.text,
  },
  bulletDone: {
    textDecorationLine: 'line-through',
    color: COLOR.sub,
  },
  progressRow: {
    marginTop: SPACE.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE.xs,
  },
  progressCaption: {
    fontSize: 12,
    color: COLOR.sub,
  },
  progressWrap: {
    backgroundColor: COLOR.divider,
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLOR.primary,
    borderRadius: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: COLOR.sub,
    fontWeight: '600',
  },
});