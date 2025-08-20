import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  danger: '#FF4757',
  success: '#2ED573',
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
];

/*************************
 * Add Item Modal
 *************************/
const AddItemModal = ({ 
  visible, 
  onClose, 
  onAdd,
  sectionId 
}: { 
  visible: boolean; 
  onClose: () => void; 
  onAdd: (sectionId: string, text: string) => void;
  sectionId: string;
}) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(sectionId, text.trim());
      setText('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>새 항목 추가</Text>
          <TextInput
            style={styles.textInput}
            placeholder="할 일을 입력하세요"
            value={text}
            onChangeText={setText}
            autoFocus
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/*************************
 * Edit Item Modal
 *************************/
const EditItemModal = ({ 
  visible, 
  onClose, 
  onSave,
  onDelete,
  item
}: { 
  visible: boolean; 
  onClose: () => void; 
  onSave: (itemId: string, newText: string) => void;
  onDelete: (itemId: string) => void;
  item: RoadmapItem | null;
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (item) {
      setText(item.text);
    }
  }, [item]);

  const handleSave = () => {
    if (text.trim() && item) {
      onSave(item.id, text.trim());
      onClose();
    }
  };

  const handleDelete = () => {
    if (item) {
      Alert.alert(
        '삭제 확인',
        '이 항목을 삭제하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '삭제', 
            style: 'destructive',
            onPress: () => {
              onDelete(item.id);
              onClose();
            }
          },
        ]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>항목 수정</Text>
          <TextInput
            style={styles.textInput}
            placeholder="할 일을 입력하세요"
            value={text}
            onChangeText={setText}
            autoFocus
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/*************************
 * Add Section Modal
 *************************/
const AddSectionModal = ({ 
  visible, 
  onClose, 
  onAdd 
}: { 
  visible: boolean; 
  onClose: () => void; 
  onAdd: (title: string) => void;
}) => {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>새 섹션 추가</Text>
          <TextInput
            style={styles.textInput}
            placeholder="섹션 제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/*************************
 * UI Atoms
 *************************/
const BulletItemComponent = ({ 
  label, 
  done, 
  onToggle,
  onEdit
}: { 
  label: string; 
  done?: boolean; 
  onToggle?: () => void;
  onEdit?: () => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const bulletStyle = [
    styles.bulletRow,
    isPressed && styles.bulletRowPressed,
    isHovered && styles.bulletRowHovered,
  ];

  const handleLongPress = () => {
    onEdit?.();
  };

  const touchableProps = Platform.OS === 'web' ? {
    accessibilityRole: "checkbox" as const,
    accessibilityState: { checked: !!done },
    onPress: onToggle,
    onLongPress: handleLongPress,
    onPressIn: () => setIsPressed(true),
    onPressOut: () => setIsPressed(false),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    activeOpacity: 0.9,
  } : {
    accessibilityRole: "checkbox" as const,
    accessibilityState: { checked: !!done },
    onPress: onToggle,
    onLongPress: handleLongPress,
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
      <TouchableOpacity style={styles.editIcon} onPress={onEdit}>
        <Text style={styles.editIconText}>⋯</Text>
      </TouchableOpacity>
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
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDeleteSection,
}: {
  section: RoadmapSection;
  onToggleItem: (sectionId: string, itemId: string) => void;
  onAddItem: (sectionId: string) => void;
  onEditItem: (sectionId: string, item: RoadmapItem) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onDeleteSection: (sectionId: string) => void;
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

  const handleDeleteSection = () => {
    Alert.alert(
      '섹션 삭제',
      '이 섹션과 모든 항목을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => onDeleteSection(section.id)
        },
      ]
    );
  };

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
      <View style={styles.sectionHeaderContainer}>
        <TouchableOpacity {...touchableProps} style={styles.sectionHeaderMain}>
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
        </TouchableOpacity>
        <View style={styles.sectionActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onAddItem(section.id)}
          >
            <Text style={styles.actionButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteActionButton} 
            onPress={handleDeleteSection}
          >
            <Text style={styles.deleteActionButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={[
          styles.cardBodyContainer,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000],
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
              onEdit={() => onEditItem(section.id, it)}
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
const MyRoadmapScreenComponent: React.FC = () => {
  const [sections, setSections] = useState<RoadmapSection[]>(INITIAL_SECTIONS);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'my-roadmap'>('my-roadmap');
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [addSectionModalVisible, setAddSectionModalVisible] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);

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

  const onAddItem = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    setAddItemModalVisible(true);
  }, []);

  const onEditItem = useCallback((sectionId: string, item: RoadmapItem) => {
    setSelectedSectionId(sectionId);
    setSelectedItem(item);
    setEditItemModalVisible(true);
  }, []);

  const handleAddItem = useCallback((sectionId: string, text: string) => {
    const newItem: RoadmapItem = {
      id: `${sectionId}-${Date.now()}`,
      text,
      done: false,
    };

    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: [...sec.items, newItem],
        };
      })
    );
  }, []);

  const handleEditItem = useCallback((itemId: string, newText: string) => {
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        items: sec.items.map((it) => 
          it.id === itemId ? { ...it, text: newText } : it
        ),
      }))
    );
  }, []);

  const handleDeleteItem = useCallback((sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.filter((it) => it.id !== itemId),
        };
      })
    );
  }, []);

  const handleAddSection = useCallback((title: string) => {
    const newSection: RoadmapSection = {
      id: `sec-${Date.now()}`,
      title,
      items: [],
    };

    setSections((prev) => [...prev, newSection]);
  }, []);

  const handleDeleteSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
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
        <Text style={styles.title}>나의 프론트엔드 로드맵</Text>
        <TouchableOpacity 
          style={styles.addSectionButton}
          onPress={() => setAddSectionModalVisible(true)}
        >
          <Text style={styles.addSectionButtonText}>+ 섹션 추가</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <SectionCard 
            key={section.id} 
            section={section} 
            onToggleItem={onToggleItem}
            onAddItem={onAddItem}
            onEditItem={onEditItem}
            onDeleteItem={handleDeleteItem}
            onDeleteSection={handleDeleteSection}
          />
        ))}

        <View style={{ height: 36 }} />
      </ScrollView>

      {/* Modals */}
      <AddItemModal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        onAdd={handleAddItem}
        sectionId={selectedSectionId}
      />

      <EditItemModal
        visible={editItemModalVisible}
        onClose={() => setEditItemModalVisible(false)}
        onSave={handleEditItem}
        onDelete={(itemId) => handleDeleteItem(selectedSectionId, itemId)}
        item={selectedItem}
      />

      <AddSectionModal
        visible={addSectionModalVisible}
        onClose={() => setAddSectionModalVisible(false)}
        onAdd={handleAddSection}
      />
    </SafeAreaView>
  );
};

MyRoadmapScreenComponent.displayName = 'MyRoadmapScreen';
const MyRoadmapScreen = memo(MyRoadmapScreenComponent);

export default MyRoadmapScreen;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md,
    backgroundColor: COLOR.bg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.text,
    flex: 1,
  },
  addSectionButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
  },
  addSectionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.text,
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: COLOR.sub,
    lineHeight: 16,
    textAlign: 'center',
    minWidth: 20,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    marginLeft: SPACE.sm,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLOR.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  deleteActionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLOR.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
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
  editIcon: {
    padding: SPACE.xs,
    marginLeft: SPACE.xs,
  },
  editIconText: {
    fontSize: 16,
    color: COLOR.sub,
    fontWeight: '700',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACE.lg,
  },
  modalContent: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.lg,
    padding: SPACE.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.text,
    marginBottom: SPACE.lg,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLOR.divider,
    borderRadius: RADIUS.sm,
    padding: SPACE.md,
    fontSize: 16,
    color: COLOR.text,
    marginBottom: SPACE.lg,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: SPACE.sm,
  },
  cancelButton: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLOR.divider,
  },
  cancelButtonText: {
    color: COLOR.sub,
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.primary,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.success,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.danger,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});