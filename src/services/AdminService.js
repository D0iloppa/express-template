const db = require('../db/dbClient');

const AdminService = {
  /**
   * 관리자 로그인 인증
   * @param {string} loginId - 로그인 ID
   * @param {string} authKey - 인증 키 (비밀번호)
   * @returns {Promise<Object|null>} - 인증된 관리자 정보 또는 null
   */
  authenticateAdmin: async (loginId, authKey) => {
    try {
      const query = `
        SELECT * FROM l0g1n_sys_admin lgnsa 
        WHERE login_id = $1 AND auth_key = $2
      `;
      
      const result = await db.query(query, [loginId, authKey]);
      
      if (result.rowCount > 0) {
        return result.rows[0];
      }
      
      return null;
    } catch (error) {
      console.error('AdminService.authenticateAdmin error:', error);
      throw error;
    }
  },

  /**
   * 모든 프로젝트 조회
   * @returns {Promise<Array>} - 프로젝트 목록
   */
  getAllProjects: async () => {
    try {
      const query = 'SELECT * FROM l0g1n_project ORDER BY created_at DESC';
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('AdminService.getAllProjects error:', error);
      throw error;
    }
  },

  /**
   * 상위 5개 프로젝트 조회
   * @returns {Promise<Array>} - 상위 5개 프로젝트 목록
   */
  getTopProjects: async () => {
    try {
      const query = 'SELECT * FROM l0g1n_project ORDER BY created_at DESC LIMIT 5';
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('AdminService.getTopProjects error:', error);
      throw error;
    }
  },

  /**
   * 프로젝트 생성
   * @param {string} projectCode - 프로젝트 코드
   * @param {string} projectName - 프로젝트 이름
   * @returns {Promise<Object>} - 생성된 프로젝트 정보
   */
  createProject: async (projectCode, projectName) => {
    try {
      const query = `
        INSERT INTO l0g1n_project (project_code, project_name) 
        VALUES ($1, $2) 
        RETURNING *
      `;
      
      const result = await db.query(query, [projectCode, projectName]);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.createProject error:', error);
      throw error;
    }
  },

  /**
   * 프로젝트 존재 여부 확인
   * @param {string} projectCode - 프로젝트 코드
   * @returns {Promise<boolean>} - 존재 여부
   */
  isProjectExists: async (projectCode) => {
    try {
      const query = 'SELECT COUNT(*) as count FROM l0g1n_project WHERE project_code = $1';
      const result = await db.query(query, [projectCode]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('AdminService.isProjectExists error:', error);
      throw error;
    }
  },

  /**
   * 관리자 로그인 시간 업데이트
   * @param {number} adminId - 관리자 ID
   * @returns {Promise<void>}
   */
  updateAdminLastLogin: async (adminId) => {
    try {
      const query = 'UPDATE l0g1n_sys_admin SET last_login_at = CURRENT_TIMESTAMP WHERE admin_id = $1';
      await db.query(query, [adminId]);
    } catch (error) {
      console.error('AdminService.updateAdminLastLogin error:', error);
      throw error;
    }
  },

  /**
   * 프로젝트별 계정 통계 조회
   * @param {number} projectId - 프로젝트 ID
   * @returns {Promise<Object>} - 계정 통계 정보
   */
  getProjectAccountStats: async (projectId) => {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_accounts,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_accounts,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_accounts
        FROM l0g1n_account 
        WHERE project_id = $1
      `;
      const result = await db.query(query, [projectId]);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.getProjectAccountStats error:', error);
      throw error;
    }
  },

  /**
   * 프로젝트별 계정 목록 조회
   * @param {number} projectId - 프로젝트 ID
   * @param {number} limit - 조회 개수 제한
   * @param {number} offset - 오프셋
   * @returns {Promise<Array>} - 계정 목록
   */
  getProjectAccounts: async (projectId, limit = 10, offset = 0) => {
    try {
      const query = `
        SELECT 
          la.account_id,
          la.account_type,
          la.status,
          la.created_at,
          lap.nickname,
          lap.extra_json
        FROM l0g1n_account la
        LEFT JOIN l0g1n_account_profile lap ON la.account_id = lap.account_id
        WHERE la.project_id = $1
        ORDER BY la.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await db.query(query, [projectId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('AdminService.getProjectAccounts error:', error);
      throw error;
    }
  },

  /**
   * 계정 인증 정보 조회
   * @param {number} accountId - 계정 ID
   * @returns {Promise<Array>} - 인증 정보 목록
   */
  getAccountAuthInfo: async (accountId) => {
    try {
      const query = `
        SELECT 
          auth_id,
          login_type,
          login_id,
          created_at,
          updated_at
        FROM l0g1n_account_auth
        WHERE account_id = $1
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [accountId]);
      return result.rows;
    } catch (error) {
      console.error('AdminService.getAccountAuthInfo error:', error);
      throw error;
    }
  },

  /**
   * 프로젝트 생성 (확장)
   * @param {string} projectCode - 프로젝트 코드
   * @param {string} projectName - 프로젝트 이름
   * @param {string} status - 프로젝트 상태
   * @returns {Promise<Object>} - 생성된 프로젝트 정보
   */
  createProjectExtended: async (projectCode, projectName, status = 'active') => {
    try {
      const query = `
        INSERT INTO l0g1n_project (project_code, project_name, status) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      
      const result = await db.query(query, [projectCode, projectName, status]);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.createProjectExtended error:', error);
      throw error;
    }
  },

  /**
   * 계정 생성
   * @param {number} projectId - 프로젝트 ID
   * @param {string} accountType - 계정 타입
   * @param {string} status - 계정 상태
   * @returns {Promise<Object>} - 생성된 계정 정보
   */
  createAccount: async (projectId, accountType, status = 'active') => {
    try {
      const query = `
        INSERT INTO l0g1n_account (project_id, account_type, status) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      
      const result = await db.query(query, [projectId, accountType, status]);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.createAccount error:', error);
      throw error;
    }
  },

  /**
   * 계정 인증 정보 추가
   * @param {number} accountId - 계정 ID
   * @param {string} loginType - 로그인 타입 (email, phone, social 등)
   * @param {string} loginId - 로그인 ID
   * @param {string} authKey - 인증 키 (비밀번호)
   * @returns {Promise<Object>} - 생성된 인증 정보
   */
  createAccountAuth: async (accountId, loginType, loginId, authKey) => {
    try {
      const query = `
        INSERT INTO l0g1n_account_auth (account_id, login_type, login_id, auth_key) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
      
      const result = await db.query(query, [accountId, loginType, loginId, authKey]);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.createAccountAuth error:', error);
      throw error;
    }
  },

  /**
   * 계정 프로필 정보 생성/업데이트
   * @param {number} accountId - 계정 ID
   * @param {string} nickname - 닉네임
   * @param {Object} extraJson - 추가 JSON 데이터
   * @returns {Promise<Object>} - 프로필 정보
   */
  upsertAccountProfile: async (accountId, nickname = null, extraJson = null) => {
    try {
      const query = `
        INSERT INTO l0g1n_account_profile (account_id, nickname, extra_json) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (account_id) 
        DO UPDATE SET 
          nickname = EXCLUDED.nickname,
          extra_json = EXCLUDED.extra_json
        RETURNING *
      `;
      
      const result = await db.query(query, [accountId, nickname, extraJson]);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.upsertAccountProfile error:', error);
      throw error;
    }
  },

  /**
   * 전체 통계 정보 조회
   * @returns {Promise<Object>} - 전체 통계 정보
   */
  getSystemStats: async () => {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM l0g1n_project WHERE status = 'active') as active_projects,
          (SELECT COUNT(*) FROM l0g1n_account WHERE status = 'active') as total_accounts,
          (SELECT COUNT(*) FROM l0g1n_sys_admin WHERE status = 'active') as active_admins,
          (SELECT COUNT(*) FROM l0g1n_account_auth) as total_auth_methods
      `;
      
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('AdminService.getSystemStats error:', error);
      throw error;
    }
  }
};

module.exports = AdminService; 