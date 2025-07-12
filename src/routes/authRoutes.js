const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();



// 시스템 관리자 로그인

// 



router.get('/login', AuthController.showLoginForm);       // 로그인 폼
router.post('/login', AuthController.processLogin);       // 로그인 처리
router.post('/logout', AuthController.logout);            // 로그아웃 처리

module.exports = router;