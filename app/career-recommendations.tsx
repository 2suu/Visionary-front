// app/(routes)/career-recommendations.tsx
import CareerRecommendationsScreen from '../screens/CareerRecommendationsScreen';

export default function Page() {
  return (
    <CareerRecommendationsScreen
      userName="헬로샌디"
      items={[
        { id: 1, category: '프론트엔드 개발자', title: '프론트엔드 개발자', description: '창의성과 이타성으로 사용자 경험을 중시하는 FE 개발자가 되어보세요!', iconEmoji: '👨‍💻' },
        { id: 2, category: 'UI/UX 디자이너', title: 'UI/UX 디자이너', description: '사용자 공감 능력과 창의성을 활용하여 UI/UX 디자이너가 되어보세요', iconEmoji: '🧑‍🎨' },
        // ...
      ]}
      onPressItem={(item) => {/* 네비게이트 or 상세 */}}
      onBack={() => {/* router.back() 등 */}}
    />
  );
}
