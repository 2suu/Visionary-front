// screens/CareerRecommendationsScreen.tsx
import React, { memo } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ---- Design Tokens ---- //
const COLOR = {
  bg: "#FFFFFF",
  text: "#111111",
  sub: "#6A6A76",
  primary: "#4E41FF",
  card: "#FFFFFF",
  divider: "#EEEFF3",
  shadow: "#000000",
  cardBorder: "#F0F0F0",
};

const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

const SPACE = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  page: 16,
};

// ---- Types ---- //
export type JobItem = {
  id: string | number;
  title: string;
  category?: string;
  description: string;
  iconEmoji?: string;
  iconUri?: string;
  skills?: string[];
  expectedSalary?: string;
};

export type CareerRecommendationsProps = {
  userName?: string;
  items: JobItem[];
  onPressItem?: (item: JobItem) => void;
  onBack?: () => void;
};

// ---- Badge ---- //
const Badge = memo(function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge} accessibilityRole="text">
      <Text style={styles.badgeText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
});

// ---- SkillBadge ---- //
const SkillBadge = memo(function SkillBadge({ skill }: { skill: string }) {
  return (
    <View style={styles.skillBadge}>
      <Text style={styles.skillBadgeText}>{skill}</Text>
    </View>
  );
});

// ---- IconBubble ---- //
const IconBubble = memo(function IconBubble({
  iconEmoji,
  iconUri,
}: {
  iconEmoji?: string;
  iconUri?: string;
}) {
  return (
    <View style={styles.iconBubble}>
      {iconUri ? (
        <Image
          source={{ uri: iconUri }}
          style={styles.iconImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.iconEmoji} accessibilityLabel={iconEmoji || "아이콘"}>
          {iconEmoji || "💼"}
        </Text>
      )}
    </View>
  );
});

// ---- JobCard ---- //
const JobCard = memo(function JobCard({
  item,
  onPress,
  isSelected,
}: {
  item: JobItem;
  onPress?: (item: JobItem) => void;
  isSelected?: boolean;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSelected ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSelected, animatedHeight]);

  const getCardStyle = () => {
    if (isSelected) {
      return styles.cardSelected;
    }
    if (isHovered) {
      return styles.cardHovered;
    }
    if (isPressed) {
      return styles.cardPressed;
    }
    return {};
  };

  const expandedHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60], // 확장될 높이값
  });

  const expandedOpacity = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.card,
        getCardStyle(),
      ]}
    >
      <IconBubble iconEmoji={item.iconEmoji} iconUri={item.iconUri} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        
        <Animated.View 
          style={[
            styles.expandedContent,
            {
              height: expandedHeight,
              opacity: expandedOpacity,
            }
          ]}
        >
          {item.skills && item.skills.length > 0 && (
            <View style={styles.skillsSection}>
              <View style={styles.skillsList}>
                {item.skills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
});

// ---- SectionHeader ---- //
const SectionHeader = memo(function SectionHeader({
  onBack,
}: {
  onBack?: () => void;
}) {
  return (
    <View style={styles.headerWrap}>
      <TouchableOpacity
        onPress={onBack}
        accessibilityRole="button"
        style={styles.backBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backChevron}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>진로 추천</Text>
    </View>
  );
});

// ---- Card List ---- //
const CardList = memo(function CardList({
  items,
  onPressItem,
  selectedItemId,
}: {
  items: JobItem[];
  onPressItem?: (i: JobItem) => void;
  selectedItemId?: string | number | null;
}) {
  return (
    <View style={styles.cardList}>
      {items.map((item, index) => (
        <View
          key={`job-${item.id}`}
          style={[
            styles.cardWrapper,
            index === items.length - 1 && styles.lastCardWrapper
          ]}
        >
          <JobCard 
            item={item} 
            onPress={onPressItem}
            isSelected={selectedItemId === item.id}
          />
        </View>
      ))}
    </View>
  );
});

// ---- Screen ---- //
export default function CareerRecommendationsScreen(
  props: Partial<CareerRecommendationsProps>
) {
  const userName = props.userName ?? "헬로샌디";
  const [selectedItemId, setSelectedItemId] = React.useState<string | number | null>(null);

  const defaultData: JobItem[] = [
    {
      id: "job-1",
      category: "프론트엔드 개발자",
      title: "프론트엔드 개발자",
      description: "웹/모바일 UI 개발 및 성능 최적화",
      iconEmoji: "👨‍💻",
      skills: ["문제 해결", "협업", "Javascript", "평균 3,200 만원"],
      expectedSalary: "평균 3,200 만원",
    },
    {
      id: "job-2",
      category: "UI/UX 디자이너",
      title: "UI/UX 디자이너",
      description: "사용자 공감 능력과 창의성을 활용하여 UI/UX 디자이너가 되어보세요",
      iconEmoji: "🎨",
      skills: ["디자인 사고", "사용자 리서치", "Figma", "평균 2,800 만원"],
      expectedSalary: "평균 2,800 만원",
    },
    {
      id: "job-3",
      category: "프로덕트 매니저",
      title: "프로덕트 매니저",
      description: "리더십과 소통 능력을 발휘하여 프로덕트 매니저가 되어보세요",
      iconEmoji: "📋",
      skills: ["리더십", "기획력", "데이터 분석", "평균 4,500 만원"],
      expectedSalary: "평균 4,500 만원",
    },
    {
      id: "job-4",
      category: "데이터 분석가",
      title: "데이터 분석가",
      description: "데이터 기반 의사결정을 돕는 데이터 분석가에 도전해보세요!",
      iconEmoji: "📊",
      skills: ["통계학", "Python", "SQL", "평균 3,800 만원"],
      expectedSalary: "평균 3,800 만원",
    },
    {
      id: "job-5",
      category: "백엔드 개발자",
      title: "백엔드 개발자",
      description: "안정적이고 확장 가능한 서버 시스템을 구축하는 백엔드 개발자가 되어보세요",
      iconEmoji: "⚙️",
      skills: ["서버 개발", "데이터베이스", "API 설계", "평균 3,600 만원"],
      expectedSalary: "평균 3,600 만원",
    },
  ];

  const data: JobItem[] = (props.items && props.items.length >= 5) ? props.items : defaultData;

  const handlePress = (item: JobItem) => {
    // 이미 선택된 카드를 다시 클릭하면 선택 해제
    if (selectedItemId === item.id) {
      setSelectedItemId(null);
      console.log("Selection cleared");
    } else {
      setSelectedItemId(item.id);
      console.log("Selected:", item.title, "ID:", item.id);
    }
    props.onPressItem?.(item);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <SectionHeader onBack={props.onBack} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBlock}>
          <Text style={styles.h1} numberOfLines={1} adjustsFontSizeToFit={true}>
            {selectedItemId 
              ? "이 직무로 로드맵을 만들까요?" 
              : `${userName} 님에게 이 직무들을 추천해요`
            }
          </Text>
        </View>

        <CardList 
          items={data} 
          onPressItem={handlePress} 
          selectedItemId={selectedItemId}
        />
        
        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              !selectedItemId && styles.confirmButtonDisabled
            ]}
            onPress={() => {
              if (selectedItemId) {
                console.log("로드맵 생성:", selectedItemId);
                // 여기에 로드맵 생성 로직 추가
              }
            }}
            disabled={!selectedItemId}
          >
            <Text style={[
              styles.confirmButtonText,
              !selectedItemId && styles.confirmButtonTextDisabled
            ]}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- Styles ---- //
const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLOR.bg 
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.bg,
  },
  scrollContent: {
    paddingHorizontal: SPACE.page,
    paddingBottom: SPACE.xxl,
  },
  headerWrap: {
    backgroundColor: COLOR.bg,
    paddingHorizontal: SPACE.page,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: SPACE.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACE.sm,
  },
  backChevron: { 
    fontSize: 24, 
    color: "#333", 
    fontWeight: "400",
    marginTop: -2 
  },
  headerTitle: { 
    fontSize: 18, 
    color: COLOR.text, 
    fontWeight: "600",
    flex: 1,
  },
  titleBlock: { 
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.xl,
  },
  h1: {
    fontSize: 18,
    lineHeight: 24,
    color: COLOR.text,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  cardList: {
    gap: SPACE.md,
  },
  cardWrapper: {
    // gap으로 처리하므로 별도 margin 불필요
  },
  lastCardWrapper: {
    // 마지막 카드도 gap으로 처리
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.card,
    padding: SPACE.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLOR.cardBorder,
    shadowColor: COLOR.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    transition: "all 0.2s ease-in-out",
  },
  cardHovered: {
    backgroundColor: "#EEF2FF",
    borderColor: "#A5B4FC",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowColor: COLOR.primary,
    transform: [{ scale: 1.03 }],
    elevation: 8,
  },
  cardPressed: {
    backgroundColor: "#F0F2FF",
    borderColor: COLOR.primary,
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    backgroundColor: "#F0F2FF",
    borderColor: COLOR.primary,
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowColor: COLOR.primary,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACE.md,
  },
  iconEmoji: { 
    fontSize: 24 
  },
  iconImage: { 
    width: "65%", 
    height: "65%" 
  },
  cardContent: {
    flex: 1,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
    backgroundColor: "#F0F2FF",
    borderRadius: RADIUS.xs,
    marginBottom: SPACE.xs,
  },
  badgeText: {
    fontSize: 11,
    color: COLOR.primary,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  cardTitle: {
    fontSize: 17,
    color: COLOR.text,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  cardDesc: { 
    fontSize: 14, 
    color: "#6B7280",
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  expandedContent: {
    marginTop: SPACE.md,
    overflow: 'hidden',
  },
  skillsSection: {
    // 섹션 스타일 제거
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACE.sm,
  },
  skillBadge: {
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs,
    backgroundColor: "#F0F2FF",
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLOR.primary,
  },
  skillBadgeText: {
    fontSize: 12,
    color: COLOR.primary,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  confirmButtonContainer: {
    marginTop: SPACE.xl,
    paddingBottom: SPACE.lg,
  },
  confirmButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: SPACE.lg,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLOR.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  confirmButtonTextDisabled: {
    color: "#9CA3AF",
  },
});
