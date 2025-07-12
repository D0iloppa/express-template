# Express Boilerplate Template

Express.js 기반 웹 애플리케이션 개발을 위한 보일러플레이트 템플릿입니다.

Express.js boilerplate template for web application development.

## 🚀 Features / 주요 기능

- **Express.js** - Node.js 웹 프레임워크
- **EJS Template Engine** - 서버사이드 렌더링
- **Express Session** - 세션 관리
- **Swagger UI** - API 문서화 (`/docs`)
- **PostgreSQL** - 데이터베이스 연결 (pg)
- **Nodemon** - 개발 시 자동 재시작
- **Admin Panel** - 관리자 페이지
- **Health Check** - 서버 상태 확인

## 📁 Project Structure / 프로젝트 구조

```
express-template/
├── src/
│   ├── controllers/     # 컨트롤러 (비즈니스 로직)
│   ├── routes/         # 라우터 정의
│   ├── views/          # EJS 템플릿 파일
│   ├── public/         # 정적 파일 (CSS, JS, 이미지)
│   ├── services/       # 서비스 레이어
│   ├── util/           # 유틸리티 함수
│   ├── db/             # 데이터베이스 관련
│   └── app.js          # 메인 애플리케이션 파일
├── dev_startup.sh      # 개발 서버 시작 스크립트
├── dev_shutdown.sh     # 개발 서버 종료 스크립트
├── package.json        # 프로젝트 의존성
└── nodemon.json        # Nodemon 설정
```

## ⚙️ Installation / 설치

### Prerequisites / 사전 요구사항

- Node.js (v14 이상)
- npm 또는 yarn
- PostgreSQL (선택사항)

### Setup / 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/D0iloppa/express-template
   cd express-template
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정** (선택사항)
   ```bash
   # .env 파일 생성
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

## 🚀 Quick Start / 빠른 시작

### Development Mode / 개발 모드

**방법 1: npm 스크립트 사용**
```bash
npm run dev
```

**방법 2: 개발 스크립트 사용**
```bash
# 서버 시작
./dev_startup.sh

# 서버 종료
./dev_shutdown.sh
```

### Production Mode / 프로덕션 모드
```bash
npm start
```

## 📖 API Documentation / API 문서

서버 실행 후 다음 URL에서 Swagger 문서를 확인할 수 있습니다:

- **Swagger UI**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

## 🛣️ Available Routes / 사용 가능한 라우트

### Public Routes / 공개 라우트
- `GET /` - 메인 페이지
- `GET /health` - 서버 상태 확인

### API Routes / API 라우트
- `POST /api/login` - 로그인
- `POST /api/logout` - 로그아웃

### Admin Routes / 관리자 라우트
- `GET /admin` - 관리자 대시보드
- `GET /admin/login` - 관리자 로그인 페이지

## 🛠️ Development / 개발

### 파일 구조 설명

- **`src/app.js`** - Express 애플리케이션 메인 파일
- **`src/routes/`** - 라우터 정의
- **`src/controllers/`** - 컨트롤러 (비즈니스 로직)
- **`src/views/`** - EJS 템플릿 파일
- **`src/public/`** - 정적 파일 (CSS, JS, 이미지)

### 새로운 라우트 추가

1. **라우터 파일 생성** (`src/routes/exampleRoutes.js`)
2. **컨트롤러 파일 생성** (`src/controllers/ExampleController.js`)
3. **app.js에 라우터 등록**

```javascript
const exampleRoutes = require('./routes/exampleRoutes');
app.use('/example', exampleRoutes);
```

## 📝 Scripts / 스크립트

```json
{
  "start": "node src/app.js",        // 프로덕션 실행
  "dev": "nodemon --legacy-watch src/app.js"  // 개발 모드
}
```

## ⚙️ Configuration / 설정

### Nodemon 설정 (`nodemon.json`)
```json
{
  "watch": ["src"],
  "ext": "js,json,ejs",
  "ignore": ["node_modules", "logs"]
}
```

### 개발 스크립트
- **`dev_startup.sh`** - 개발 서버 시작 (백그라운드 실행)
- **`dev_shutdown.sh`** - 개발 서버 종료

## 🐛 Troubleshooting / 문제 해결

### 일반적인 문제

1. **포트가 이미 사용 중인 경우**
   ```bash
   # 포트 확인
   lsof -i :3000
   
   # 프로세스 종료
   kill -9 <PID>
   ```

2. **의존성 문제**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **로그 확인**
   ```bash
   tail -f logs/dev-server.log
   ```

## 📄 License / 라이선스

ISC License

## 👨‍💻 Author / 작성자

D0IL

---

**Note**: 이 템플릿은 Express.js 기반 웹 애플리케이션 개발을 위한 기본 구조를 제공합니다. 프로젝트 요구사항에 맞게 수정하여 사용하세요.

**참고**: This template provides a basic structure for Express.js web application development. Modify it according to your project requirements. 