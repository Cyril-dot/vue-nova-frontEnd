// utils/teamWorkspaceApi.js
// Team Workspace API Service

const API_BASE_URL = 'https://nova-test-ctne.onrender.com/api';

// ==================== TOKEN MANAGEMENT ====================
const getAccessToken = () => {
  let token = sessionStorage.getItem('accessToken');
  if (token) return token;
  
  token = localStorage.getItem('accessToken');
  if (token) {
    sessionStorage.setItem('accessToken', token);
  }
  
  return token;
};

// ==================== CORE REQUEST FUNCTION ====================
const apiRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  if (!token && !endpoint.includes('/auth/')) {
    console.warn('No access token available for authenticated request');
    throw new Error('Not authenticated');
  }
  
  const isFormData = options.body instanceof FormData;
  
  const defaultHeaders = {
    'ngrok-skip-browser-warning': 'true',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  if (config.headers['Content-Type'] === undefined) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      console.warn('Authentication failed - token may be expired. Logging out...');
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
      
      throw new Error('Session expired. Please login again.');
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================
async function parseErrorResponse(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json.error || json.message || text || 'An unexpected error occurred';
  } catch {
    return text || 'An unexpected error occurred';
  }
}

function jsonRequestOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

// ==================== TEAM WORKSPACE API ====================
export const TeamWorkspaceAPI = {

  // ==================== CREATE WORKSPACE (ADMIN ONLY) ====================
  
  /**
   * Create a new team workspace
   * POST /api/v1/team/workspace/create/{teamId}
   */
  async createWorkspace(teamId, workspaceData) {
    const response = await apiRequest(
      `/v1/team/workspace/create/${teamId}`,
      jsonRequestOptions('POST', {
        title: workspaceData.title,
        description: workspaceData.description
      })
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  /**
   * Create template for workspace
   * POST /api/v1/team/workspace/template/{teamId}/{docId}?docType={docType}
   */
  async createTemplate(teamId, docId, docType) {
    const response = await apiRequest(
      `/v1/team/workspace/template/${teamId}/${docId}?docType=${docType}`,
      { method: 'POST' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // ==================== CONTRIBUTIONS ====================

  /**
   * Submit contribution (Team members)
   * POST /api/v1/team/workspace/contribute/{teamId}/{docId}
   */
  async submitContribution(teamId, docId, content) {
    const response = await apiRequest(
      `/v1/team/workspace/contribute/${teamId}/${docId}`,
      jsonRequestOptions('POST', { content })
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  /**
   * Approve contribution (Admin only)
   * PATCH /api/v1/team/workspace/approve/{teamId}/{contributionId}
   */
  async approveContribution(teamId, contributionId) {
    const response = await apiRequest(
      `/v1/team/workspace/approve/${teamId}/${contributionId}`,
      { method: 'PATCH' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  /**
   * Reject contribution (Admin only)
   * PATCH /api/v1/team/workspace/reject/{teamId}/{contributionId}?reason={reason}
   */
  async rejectContribution(teamId, contributionId, reason) {
    const response = await apiRequest(
      `/v1/team/workspace/reject/${teamId}/${contributionId}?reason=${encodeURIComponent(reason)}`,
      { method: 'PATCH' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.text();
  },

  /**
   * View pending contributions (Admin only)
   * GET /api/v1/team/workspace/pending/{teamId}/{workspaceId}
   */
  async getPendingContributions(teamId, workspaceId) {
    const response = await apiRequest(
      `/v1/team/workspace/pending/${teamId}/${workspaceId}`,
      { method: 'GET' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // ==================== VIEW WORKSPACES (ALL MEMBERS) ====================

  /**
   * View specific team workspace
   * GET /api/v1/team/workspace/view/{teamId}/{docId}
   */
  async viewWorkspace(teamId, docId) {
    const response = await apiRequest(
      `/v1/team/workspace/view/${teamId}/${docId}`,
      { method: 'GET' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  /**
   * View all team workspaces
   * GET /api/v1/team/workspace/all/{teamId}
   */
  async getAllWorkspaces(teamId) {
    const response = await apiRequest(
      `/v1/team/workspace/all/${teamId}`,
      { method: 'GET' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  /**
   * View team workspaces by type
   * GET /api/v1/team/workspace/by-type/{teamId}?docType={docType}
   */
  async getWorkspacesByType(teamId, docType) {
    const response = await apiRequest(
      `/v1/team/workspace/by-type/${teamId}?docType=${docType}`,
      { method: 'GET' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // ==================== DOWNLOAD (ALL MEMBERS) ====================

  /**
   * Download team workspace
   * GET /api/v1/team/workspace/download/{teamId}/{docId}
   */
  async downloadWorkspace(teamId, docId) {
    const response = await apiRequest(
      `/v1/team/workspace/download/${teamId}/${docId}`,
      { method: 'GET' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'workspace-download';
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  },

  /**
   * Download all team workspaces as ZIP
   * GET /api/v1/team/workspace/download-all/{teamId}
   */
  async downloadAllWorkspaces(teamId) {
    const response = await apiRequest(
      `/v1/team/workspace/download-all/${teamId}`,
      { method: 'GET' }
    );
    
    if (response.status === 204) {
      throw new Error('No workspaces found to download');
    }
    
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `team_${teamId}_workspaces.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  },

  // ==================== DELETE (ADMIN ONLY) ====================

  /**
   * Delete team workspace (Admin only)
   * DELETE /api/v1/team/workspace/delete/{teamId}/{docId}
   */
  async deleteWorkspace(teamId, docId) {
    const response = await apiRequest(
      `/v1/team/workspace/delete/${teamId}/${docId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.text();
  }
};

// ==================== HELPER UTILITIES ====================

/**
 * Document type configuration
 */
export const DOC_TYPES = {
  HTML: { value: 'HTML', label: 'HTML', icon: '🌐', color: '#ef4444', ext: '.html' },
  JS: { value: 'JS', label: 'JavaScript', icon: '⚡', color: '#f59e0b', ext: '.js' },
  CSS: { value: 'CSS', label: 'CSS', icon: '🎨', color: '#6366f1', ext: '.css' },
  JAVA: { value: 'JAVA', label: 'Java', icon: '☕', color: '#dc2626', ext: '.java' },
  PYTHON: { value: 'PYTHON', label: 'Python', icon: '🐍', color: '#3b82f6', ext: '.py' },
  C_SHARP: { value: 'C_SHARP', label: 'C#', icon: '#️⃣', color: '#8b5cf6', ext: '.cs' },
  C_PLUS_PLUS: { value: 'C_PLUS_PLUS', label: 'C++', icon: '⚙️', color: '#0ea5e9', ext: '.cpp' },
  MARKDOWN: { value: 'MARKDOWN', label: 'Markdown', icon: '📝', color: '#10b981', ext: '.md' },
  TEXT: { value: 'TEXT', label: 'Text', icon: '📄', color: '#64748b', ext: '.txt' }
};

/**
 * Get all doc types as array
 */
export function getDocTypes() {
  return Object.values(DOC_TYPES);
}

/**
 * Get doc type config
 */
export function getDocTypeConfig(type) {
  return DOC_TYPES[type] || DOC_TYPES.TEXT;
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Validate workspace title
 */
export function validateWorkspaceTitle(title) {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  if (title.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }
  if (title.length > 100) {
    return { valid: false, error: 'Title must be less than 100 characters' };
  }
  return { valid: true };
}

/**
 * Validate workspace description
 */
export function validateWorkspaceDescription(description) {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }
  if (description.length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters' };
  }
  if (description.length > 500) {
    return { valid: false, error: 'Description must be less than 500 characters' };
  }
  return { valid: true };
}

/**
 * Validate contribution content
 */
export function validateContributionContent(content) {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Contribution content is required' };
  }
  if (content.length < 10) {
    return { valid: false, error: 'Contribution must be at least 10 characters' };
  }
  return { valid: true };
}

/**
 * Validate rejection reason
 */
export function validateRejectionReason(reason) {
  if (!reason || reason.trim().length === 0) {
    return { valid: false, error: 'Rejection reason is required' };
  }
  if (reason.length < 5) {
    return { valid: false, error: 'Reason must be at least 5 characters' };
  }
  return { valid: true };
}

// ==================== DEFAULT EXPORT ====================
export default {
  TeamWorkspaceAPI,
  DOC_TYPES,
  getDocTypes,
  getDocTypeConfig,
  formatDate,
  validateWorkspaceTitle,
  validateWorkspaceDescription,
  validateContributionContent,
  validateRejectionReason
};