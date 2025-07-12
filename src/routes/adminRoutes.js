const express = require('express');
const AdminController = require('../controllers/AdminController.js');

const router = express.Router();

router.get('/login', AdminController.showLoginForm);
router.post('/loginPost', AdminController.processLogin);

router.get('/dashboard', AdminController.dashboard);
router.get('/project/create', AdminController.showCreateProjectForm);
router.post('/project/create', AdminController.createProject);

// API 엔드포인트
router.get('/api/projects', AdminController.getAllProjectsApi);

module.exports = router;
