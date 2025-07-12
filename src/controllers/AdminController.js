const AdminService = require('../services/AdminService');

const AdminController = {
  showLoginForm: (req, res) => {
    res.render('admin/login', { error: null, layout: 'layout' });
  },

  processLogin: async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // AdminService를 사용한 인증
      const admin = await AdminService.authenticateAdmin(username.trim(), password.trim());
      
      if (admin) {
        // 로그인 시간 업데이트
        await AdminService.updateAdminLastLogin(admin.admin_id);
        
        req.session.admin = true;
        req.session.adminInfo = admin;
        res.redirect('/admin/dashboard');
      } else {
        res.render('admin/login', { error: '로그인 실패: 잘못된 로그인 정보입니다.', layout: 'layout' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.render('admin/login', { error: '로그인 처리 중 오류가 발생했습니다.', layout: 'layout' });
    }
  },

  dashboard: async (req, res) => {
    if (!req.session.admin) return res.redirect('/admin/login');
    
    try {
      const [topProjects, systemStats] = await Promise.all([
        AdminService.getTopProjects(),
        AdminService.getSystemStats()
      ]);
      const adminInfo = req.session.adminInfo;
      res.render('admin/dashboard', { 
        projects: topProjects, 
        adminInfo,
        systemStats,
        totalProjects: systemStats.active_projects,
        error: null,
        layout: 'layout'
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.render('admin/dashboard', { 
        projects: [], 
        adminInfo: req.session.adminInfo,
        error: '프로젝트 목록을 불러오는 중 오류가 발생했습니다.',
        layout: 'layout'
      });
    }
  },

  showCreateProjectForm: (req, res) => {
    res.render('admin/project_create', { error: null, layout: 'layout' });
  },

  createProject: async (req, res) => {
    const { code, name } = req.body;
    
    try {
      // 프로젝트 코드 중복 확인
      const exists = await AdminService.isProjectExists(code);
      if (exists) {
        return res.render('admin/project_create', { error: '이미 존재하는 프로젝트 코드입니다.', layout: 'layout' });
      }
      
      // 프로젝트 생성
      await AdminService.createProject(code, name);
      res.render('admin/project_create', { 
        success: '프로젝트가 성공적으로 생성되었습니다!', 
        layout: 'layout' 
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.render('admin/project_create', { error: '프로젝트 생성 중 오류가 발생했습니다.', layout: 'layout' });
    }
  },

  // API: 전체 프로젝트 목록 조회 (모달용)
  getAllProjectsApi: async (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const projects = await AdminService.getAllProjects();
      res.json({ projects });
    } catch (error) {
      console.error('Get all projects API error:', error);
      res.status(500).json({ error: '프로젝트 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  },
};

module.exports = AdminController;
