# 📱 Visionary Front

AI 기반 진로 추천 및 로드맵 제공 애플리케이션의 프론트엔드 프로젝트입니다.  
React Native + Expo 기반으로 구현되었으며, 설문을 통해 사용자의 성향을 분석하고 맞춤형 진로를 추천합니다.

---

## 📋 기술 스택

- **Frontend**: React Native (Expo)
- **State Management**: Zustand, Context API
- **UI**: React Native Paper, Tailwind
- **API 연동**: Fetch 기반 REST API
- **배포**: Expo EAS Build

---

## 🚀 실행 방법 (Frontend)

### 1. 환경 준비
1. **Node.js** 설치 (권장: LTS 버전)  
   👉 [Node.js 공식 사이트](https://nodejs.org/)  
2. **Expo CLI** 설치  
   ```bash
   npm install -g expo-cli
3. 프로젝트 폴더로 이동
   cd Visionary-front

### 2. 의존성 설치
npm install
# 또는
yarn install

### 3. 환경 변수 설정
프로젝트 루트에 .env 파일 생성 후 API 서버 주소 입력:
EXPO_PUBLIC_API_BASE=http://localhost:8080

### 4. 실행하기
npx expo start
npx expo start--tunnel
   
