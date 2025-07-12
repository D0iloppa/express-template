const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./util/swagger');

const authRoutes = require('./routes/authRoutes');        
const dbClient = require('./db/dbClient');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ View 엔진 설정 (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ EJS Layout 미들웨어 등록
app.use(expressLayouts);
app.set('layout', 'layout'); // views/layout.ejs가 기본 레이아웃 파일로 사용됨



// ✅ 정적 파일 서빙 (예: CSS, JS, 이미지 등)
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.baseUrl = req.baseUrl || '';
    next();
  });

// ✅ JSON + URL 인코딩 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger UI
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'L0G1N API Document', // ✅ 탭 제목 (브라우저 title)
    })
  );



// ✅ 루트 페이지 (index.ejs 렌더링)
app.get('/', (req, res) => {
  res.render('index', {
    title: 'l0g1n 시스템',
    timestamp: new Date().toISOString(),
  });
});



// ✅ 헬스체크
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ✅ API 라우터 등록 (/login, /logout 등)
app.use('/api', authRoutes); // or `/api`, if you want separation



// ✅ admin 라우터 등록 (/login, /logout 등)
const session = require('express-session');
const adminRoutes = require('./routes/adminRoutes');

app.use(session({
  secret: 'keyboard cat', resave: false, saveUninitialized: true
}));

app.use('/admin', adminRoutes);




// ✅ 404 핸들러 (HTML 기반으로 전환 가능)
app.use('*', (req, res) => {
  res.status(404).render('error', {
    code: 404,
    message: '요청하신 경로를 찾을 수 없습니다.',
    path: req.originalUrl,
    layout: false  // 레이아웃 사용 안함
  });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📘 Swagger 문서: http://localhost:${PORT}/docs`);
});
