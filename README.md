# 영수증 관리 앱 (Receipt Management App)

🧾 모던하고 세련된 영수증 관리 웹 애플리케이션입니다.

[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-38bdf8)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-646cff)](https://vitejs.dev/)

## ✨ 주요 특징

- 🎨 **모던 UI/UX**: Tailwind CSS v4 + shadcn/ui 기반의 세련된 디자인
- 🌊 **프리미엄 애니메이션**: 글래스모피즘과 마이크로 인터랙션
- 📱 **완전 반응형**: 모바일부터 데스크톱까지 완벽 지원
- ⚡ **최신 기술스택**: React 19 + TypeScript + Vite
- 🔍 **강력한 검색**: 실시간 검색 및 카테고리 필터링
- 💾 **로컬 저장소**: 브라우저 localStorage 기반 데이터 영속성

## 🛠️ 기술 스택

### Core

- **React**: 19.0.0 (최신 버전)
- **TypeScript**: 5.7.2
- **Vite**: 6.0.3 (번개같은 빌드 도구)

### UI & Styling

- **Tailwind CSS**: 4.1.12 (최신 v4 문법)
- **shadcn/ui**: 접근성 있는 컴포넌트 시스템
- **Radix UI**: 헤드리스 UI 프리미티브
- **Lucide React**: 아름다운 아이콘 라이브러리

### Development

- **ESLint**: 코드 품질 관리
- **Prettier**: 자동 코드 포맷팅 (Tailwind 클래스 정렬 포함)

## 🚀 빠른 시작

### 필수 요구사항

- **Node.js**: 18.0 이상
- **npm**: 9.0 이상

### 설치 및 실행

1. **레포지토리 클론**

```bash
git clone https://github.com/heejunparkk/receipt-management-app.git
cd receipt-management-app
```

2. **의존성 설치**

```bash
npm install
```

3. **개발 서버 실행**

```bash
npm run dev
```

4. **브라우저에서 접속**
   - 🌐 http://localhost:5173

## 📜 사용 가능한 스크립트

```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 코드 검사
npm run format       # Prettier 코드 포맷팅 (Tailwind 클래스 정렬)
npm run format:check # 포맷팅 상태 확인
```

## 🎯 현재 구현된 기능

- ✅ **영수증 목록 표시**: 카드 기반의 아름다운 그리드 레이아웃
- ✅ **실시간 검색**: 제목, 상점명, 설명 기반 즉시 검색
- ✅ **카테고리 필터**: 식비, 교통비, 의료비 등 카테고리별 필터링
- ✅ **정렬 기능**: 날짜순, 금액순 오름차순/내림차순
- ✅ **반응형 그리드**: 화면 크기에 따라 1-4열 자동 조정
- ✅ **데이터 영속성**: localStorage 기반 자동 저장
- ✅ **우아한 애니메이션**: 카드 호버, 스태거링, 글래스모피즘

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: `#6366f1` (Indigo 500)
- **Success**: `#059669` (Emerald 600)
- **Warning**: `#d97706` (Amber 600)
- **Destructive**: `#dc2626` (Red 600)

### 애니메이션

- **fade-in-up**: 부드러운 하단에서 상단으로 등장
- **scale-in**: 작은 크기에서 확대 등장
- **slide-in-right**: 우측에서 슬라이드 진입
- **shimmer**: 버튼 호버시 반짝이는 효과

## 📁 프로젝트 구조

```
receipt-management-app/
├── 📁 public/              # 정적 파일
├── 📁 src/                 # 소스 코드
│   ├── 📁 components/      # React 컴포넌트
│   │   ├── Header.tsx      # 상단 헤더
│   │   ├── ReceiptCard.tsx # 영수증 카드
│   │   ├── ReceiptList.tsx # 영수증 목록
│   │   └── 📁 ui/          # shadcn/ui 컴포넌트
│   ├── 📁 hooks/           # 커스텀 훅
│   │   └── useReceipts.ts  # 영수증 데이터 관리
│   ├── 📁 types/           # TypeScript 타입
│   │   └── receipt.ts      # 영수증 타입 정의
│   ├── 📁 utils/           # 유틸리티 함수
│   ├── 📁 lib/             # 라이브러리 설정
│   ├── App.tsx             # 메인 앱
│   ├── main.tsx            # 진입점
│   └── index.css           # 글로벌 스타일
├── 📄 DEVELOPMENT_LOG.md   # 개발 진행 상황
├── 📄 .prettierrc          # Prettier 설정
├── 📄 tailwind.config.js   # Tailwind 설정
└── 📄 package.json         # 프로젝트 설정
```

## 🔮 향후 개발 계획

### Phase 1 - 기본 CRUD (다음 우선순위)

- [ ] 영수증 추가 모달
- [ ] 영수증 편집 모달
- [ ] 영수증 상세보기 모달
- [ ] 이미지 업로드 기능

### Phase 2 - 데이터 관리

- [ ] 데이터 내보내기 (JSON/CSV)
- [ ] 데이터 가져오기
- [ ] 백업 및 복원 기능

### Phase 3 - 고급 기능

- [ ] 지출 통계 대시보드
- [ ] OCR 영수증 인식
- [ ] PWA 지원 (오프라인 사용)
- [ ] 다크 모드

## 🤝 기여하기

1. Fork 후 브랜치 생성
2. 기능 개발 및 테스트
3. Pull Request 생성

## 📄 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

**🔧 개발**: AI Assistant (GitHub Copilot)  
**📅 마지막 업데이트**: 2025년 8월 27일

> 💡 **팁**: 이 앱은 최신 React 19와 Tailwind CSS v4를 사용한 모던 웹 개발의 모범 사례를 보여줍니다!
