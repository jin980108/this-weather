# 🌤️ 날씨 앱 프로젝트 세팅 가이드

## 📋 사전 요구사항

1. **Node.js 설치** (버전 16 이상 권장)
   - [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드
   - 설치 후 터미널에서 `node --version`과 `npm --version`으로 설치 확인

2. **Git 설치** (프로젝트 클론용)
   - [Git 공식 사이트](https://git-scm.com/)에서 다운로드

## 🚀 1단계: 프로젝트 클론 및 기본 설정

```bash
# 1. 프로젝트 클론
git clone [your-repository-url]
cd weatherapp-kjcho

# 2. 메인 프로젝트 의존성 설치
npm install

# 3. 프록시 서버 의존성 설치
cd proxy-server
npm install
cd ..
```

## 🔧 2단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# YouTube API 키 (선택사항 - 없으면 기본값 사용)
YOUTUBE_API_KEY=your_youtube_api_key_here

# 네이버 API 키 (이미 코드에 하드코딩되어 있음)
# NAVER_CLIENT_ID=HGLf2YIWfX7xbWIZUo2X
# NAVER_CLIENT_SECRET=z63MupdZrV
```

**YouTube API 키 발급 방법:**
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. YouTube Data API v3 활성화
4. 사용자 인증 정보 → API 키 생성
5. 생성된 키를 `.env` 파일에 추가

## 📦 3단계: 필요한 패키지들

프로젝트에서 사용하는 주요 패키지들:

**메인 프로젝트 (`package.json`):**
- React 18.3.1
- React Router DOM 6.30.1
- Axios 1.10.0 (API 통신)
- Bootstrap 5.3.7 (UI 프레임워크)
- React Bootstrap 2.10.10
- Leaflet 1.9.4 (지도)
- React Leaflet 5.0.0
- Lottie React 2.4.1 (애니메이션)
- React Icons 5.5.0
- Zustand 5.0.6 (상태 관리)
- Recharts 3.0.2 (차트)
- React Spinners 0.17.0

**프록시 서버 (`proxy-server/package.json`):**
- Express 5.1.0
- Node Fetch 3.3.2

**루트 레벨 프록시 서버들:**
- Express 5.1.0
- Axios 1.10.0
- CORS 2.8.5
- Dotenv 17.0.1

## 🖥️ 4단계: 서버 실행

### Windows 환경:
```bash
# 1. 프록시 서버들 시작 (배치 파일 사용)
start-servers.bat

# 2. 새 터미널에서 React 앱 시작
npm start
```

### macOS/Linux 환경:
```bash
# 1. 프록시 서버들 시작 (쉘 스크립트 사용)
chmod +x start-servers.sh
./start-servers.sh

# 2. 새 터미널에서 React 앱 시작
npm start
```

### 수동으로 서버 실행하는 경우:
```bash
# 터미널 1: 네이버 뉴스 프록시 서버
node naver-news-proxy.js

# 터미널 2: YouTube API 프록시 서버
node youtube-api-proxy.js

# 터미널 3: React 앱
npm start
```

## 🌐 5단계: 접속 확인

모든 서버가 정상적으로 실행되면 다음 주소들로 접속할 수 있습니다:

- **React 앱**: http://localhost:3000
- **네이버 뉴스 프록시**: http://localhost:5000
- **YouTube API 프록시**: http://localhost:5001

## 🔍 6단계: 문제 해결

**자주 발생하는 문제들:**

1. **포트 충돌**
   ```bash
   # Windows에서 포트 사용 중인 프로세스 확인
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   netstat -ano | findstr :5001
   
   # macOS/Linux에서 포트 사용 중인 프로세스 확인
   lsof -i :3000
   lsof -i :5000
   lsof -i :5001
   ```

2. **의존성 설치 실패**
   ```bash
   # node_modules 삭제 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API 키 오류**
   - `.env` 파일이 프로젝트 루트에 있는지 확인
   - API 키가 올바르게 설정되었는지 확인
   - YouTube API 할당량 초과 시 Mock 데이터가 자동으로 제공됨

## 📁 7단계: 프로젝트 구조 확인

```
weatherapp-kjcho/
├── src/
│   ├── component/          # React 컴포넌트들
│   ├── store/             # Zustand 상태 관리
│   └── image/             # 이미지 및 애니메이션 파일들
├── proxy-server/          # Express 프록시 서버
├── public/                # 정적 파일들
├── naver-news-proxy.js    # 네이버 뉴스 API 프록시
├── youtube-api-proxy.js   # YouTube API 프록시
├── start-servers.bat      # Windows 서버 시작 스크립트
├── start-servers.sh       # macOS/Linux 서버 시작 스크립트
└── package.json           # 메인 프로젝트 의존성
```

## 🚀 8단계: 개발 시작

모든 설정이 완료되면 다음 명령어로 개발을 시작할 수 있습니다:

```bash
# 개발 모드로 실행
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

## 📝 추가 참고사항

- 모든 API 키는 보안을 위해 `.env` 파일에 저장하고 `.gitignore`에 포함되어 있습니다
- YouTube API 할당량이 초과되면 자동으로 Mock 데이터가 제공됩니다
- 네이버 뉴스 API는 하드코딩된 키를 사용하므로 별도 설정이 필요하지 않습니다
- 프로젝트는 Create React App으로 생성되었으며, 표준 React 개발 환경을 따릅니다

---

**이제 다른 컴퓨터에서도 동일한 환경으로 프로젝트를 실행할 수 있습니다!** 