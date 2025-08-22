# 📱 Visionary Front

AI 기반 진로 추천 및 로드맵 제공 애플리케이션의 프론트엔드 프로젝트입니다.  
React Native + Expo 기반으로 구현되었으며, 설문을 통해 사용자의 성향을 분석하고 맞춤형 진로를 추천합니다.

---

## 📋 기술 스택

- **Frontend**: React Native (Expo)
- **State Management**: Context API
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


3. **프로젝트 폴더로 이동**

   ```bash
   cd Visionary-front
   ```

---

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

---

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 후 **API 서버 주소** 입력:

```env
EXPO_PUBLIC_API_BASE=http://localhost:8080
```

---

### 4. 실행하기

```bash
npx expo start
```

네트워크 이슈가 있을 경우 터널 모드 실행:

```bash
npx expo start --tunnel
```

---

### 5. 빌드하기 (선택 사항)

* **Android APK 빌드**

  ```bash
  eas build -p android
  ```

* **iOS 빌드**

  ```bash
  eas build -p ios
  ```

---

## 📂 프로젝트 구조

```bash
Visionary-front/
 ├── app/                # Expo Router 기반 라우팅
 │   ├── (tabs)/         # 홈, 마이페이지 등 탭 화면
 │   └── signup/         # 회원가입 관련 화면
 ├── screens/            # 주요 화면 컴포넌트
 │   ├── presurvey/      # 사전 설문
 │   └── survey/         # 메인 설문
 ├── components/         # 재사용 가능한 UI 컴포넌트
 ├── assets/             # 이미지, 아이콘 등 정적 파일
 ├── package.json
 └── README.md
```

---

## 🔑 주요 기능

* 회원가입 & 로그인 (JWT 인증)
* 사전 설문 (기본 정보, 대인관계, 감정/스트레스)
* 메인 설문 (성격 Big5, RIASEC 흥미유형)
* 설문 결과 확인 (요약 + 진로 추천 + 로드맵)

---

## 🛠️ 개발자 가이드

* 코드 스타일: **ESLint + Prettier**
* 상태 관리: **Context API**
* API 호출: `fetch` 기반, 인증 필요 시 `accessToken` 포함
* 환경 변수 관리: `.env` → `process.env.EXPO_PUBLIC_API_BASE`

---

## 📄 라이선스

본 프로젝트는 내부 학술제 프로젝트용으로 제작되었으며, 외부 배포용이 아닙니다.



