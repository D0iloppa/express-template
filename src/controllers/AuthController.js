const AuthService = require('../services/AuthService');

/**
 * @openapi
 * /login:
 *   get:
 *     summary: 로그인 페이지 렌더링
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: 로그인 폼 HTML 페이지
 */
exports.showLoginForm = (req, res) => {
    res.render('login');
  };
  
  /**
   * @openapi
   * /login:
   *   post:
   *     summary: 로그인 처리
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               login_id:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: 로그인 성공
   *       401:
   *         description: 인증 실패
   */
  exports.processLogin = async (req, res) => {
    // 로그인 처리 로직
  };
  
  /**
   * @openapi
   * /logout:
   *   post:
   *     summary: 로그아웃
   *     tags:
   *       - Auth
   *     responses:
   *       200:
   *         description: 로그아웃 성공
   */
  exports.logout = (req, res) => {
    res.json({ success: true });
  };
  
