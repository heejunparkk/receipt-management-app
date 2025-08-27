# Receipt Management App

영수증을 촬영하고 관리하는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **스타일링**: CSS
- **개발 도구**: ESLint

## 주요 기능

- 🧾 영수증 이미지 업로드/촬영
- 📊 영수증 정보 추출 및 저장
- 📂 카테고리별 분류 및 검색
- 📈 월별/연도별 지출 분석
- 💾 영수증 이미지 저장 및 관리

## 개발 환경 설정

### 필수 요구사항

- Node.js (18.0 이상)
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:

```bash
npm install
```

2. 개발 서버 실행:

```bash
npm run dev
```

3. 브라우저에서 http://localhost:5173 접속

### 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드된 파일 미리보기:

```bash
npm run preview
```

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 검사
- `npm run preview` - 빌드된 파일 미리보기

## 프로젝트 구조

```
receipt-management-app/
├── public/          # 정적 파일
├── src/            # 소스 코드
│   ├── components/ # React 컴포넌트
│   ├── hooks/      # 커스텀 훅
│   ├── types/      # TypeScript 타입 정의
│   ├── utils/      # 유틸리티 함수
│   └── main.tsx    # 애플리케이션 진입점
├── dist/           # 빌드 출력
└── ...
```

## 개발 가이드

### PWA 기능 추가 예정

이 앱은 Progressive Web App(PWA)으로 확장하여 모바일에서도 네이티브 앱처럼 사용할 수 있도록 계획되어 있습니다.

### 향후 추가 기능

- 카메라 API 연동
- 이미지 OCR 처리
- 로컬 스토리지 및 클라우드 동기화
- 오프라인 지원
- 푸시 알림

## 라이센스

MIT License
