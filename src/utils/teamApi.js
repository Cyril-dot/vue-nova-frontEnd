// utils/teamApi.js
// Standalone API service for team-based operations
// NO DEPENDENCIES on apiService.js

// ==================== CONFIGURATION ====================
const API = 'https://nova-test-ctne.onrender.com/api';  // ✅ your Render backend

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
  
  // Check if token exists for authenticated endpoints
  if (!token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    console.warn('No access token available for authenticated request');
    throw new Error('Not authenticated');
  }
  
  // Detect if body is FormData
  const isFormData = options.body instanceof FormData;
  
  // Build headers intelligently
  const defaultHeaders = {
    'ngrok-skip-browser-warning': 'true',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  // Only add Content-Type for non-FormData requests
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

  // Remove Content-Type if it was explicitly set to undefined (for FormData override)
  if (config.headers['Content-Type'] === undefined) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API}${endpoint}`, config);  // ✅
    
    // Handle token expiration - logout and redirect
    if (response.status === 401) {
      console.warn('Authentication failed - token may be expired. Logging out...');
      
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      // Only redirect if not already on auth page
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

// ==================== SHARED UTILITY ====================
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

// ==================== ENDPOINT BASE PATHS ====================
const TEAM = '/v1/team';      // → /v1/team (API_BASE_URL already has /api)
const DASH = '/v1/dashboard'; // → /v1/dashboard (API_BASE_URL already has /api)

// ==================== DASHBOARD STATS API ====================
export const DashboardAPI = {

  // GET /api/v1/dashboard/stats
  async getStats() {
    const response = await apiRequest(`${DASH}/stats`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/projects
  async getProjectSummaries() {
    const response = await apiRequest(`${DASH}/projects`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/projects/overdue
  async getOverdueProjects() {
    const response = await apiRequest(`${DASH}/projects/overdue`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/tasks
  async getTaskSummaries() {
    const response = await apiRequest(`${DASH}/tasks`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/tasks/overdue
  async getOverdueTasks() {
    const response = await apiRequest(`${DASH}/tasks/overdue`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== TEAM MANAGEMENT API ====================
export const TeamManagementAPI = {

  // POST /api/v1/dashboard/users/search
  async searchUsers(searchRequest) {
    const response = await apiRequest(
      `${DASH}/users/search`,
      jsonRequestOptions('POST', searchRequest)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // POST /api/v1/dashboard/teams
  async createTeam(createTeamRequest) {
    const response = await apiRequest(
      `${DASH}/teams`,
      jsonRequestOptions('POST', createTeamRequest)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // POST /api/v1/dashboard/teams/{teamId}/members
  async addMember(teamId, addTeamRequest) {
    const response = await apiRequest(
      `${DASH}/teams/${teamId}/members`,
      jsonRequestOptions('POST', addTeamRequest)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/teams/{teamId}/members
  async getTeamMembers(teamId) {
    const response = await apiRequest(`${DASH}/teams/${teamId}/members`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/teams/{teamId}/members/details
  async getTeamMembersWithRole(teamId) {
    const response = await apiRequest(`${DASH}/teams/${teamId}/members/details`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // DELETE /api/v1/dashboard/teams/{teamId}/members/{memberId}
  async removeMember(teamId, memberId) {
    const response = await apiRequest(`${DASH}/teams/${teamId}/members/${memberId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // DELETE /api/v1/dashboard/teams/{teamId}
  async deleteTeam(teamId) {
    const response = await apiRequest(`${DASH}/teams/${teamId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/teams/joined
  async getJoinedTeams() {
    const response = await apiRequest(`${DASH}/teams/joined`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/dashboard/teams/count
  async getTeamsCount() {
    const response = await apiRequest(`${DASH}/teams/count`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // PATCH /api/v1/dashboard/teams/{teamId}/members/{memberId}/role?role={role}
  async updateMemberRole(teamId, memberId, role) {
    const response = await apiRequest(
      `${DASH}/teams/${teamId}/members/${memberId}/role?role=${role}`,
      { method: 'PATCH' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== TEAM PROJECT API ====================
export const TeamProjectAPI = {

  // POST /api/v1/team/{teamId}/projects
  async createProject(teamId, formData) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // PUT /api/v1/team/{teamId}/projects/{projectId}
  async updateProject(teamId, projectId, formData) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}`, {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/{projectId}
  async getProject(teamId, projectId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/projects
  async getAllProjects() {
    const response = await apiRequest(`${TEAM}/projects`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // DELETE /api/v1/team/{teamId}/projects/{projectId}
  async deleteProject(teamId, projectId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/summary
  async getProjectSummary(teamId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/summary`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/count
  async getProjectCount(teamId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/count`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/count/status/{status}
  async getProjectCountByStatus(teamId, status) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/count/status/${status}`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/overdue
  async getOverdueProjects(teamId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/overdue`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== DOCUMENT API ====================
export const TeamDocumentAPI = {

  // POST /api/v1/team/{teamId}/projects/{projectId}/documents
  async uploadDocuments(teamId, projectId, formData) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}/documents`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/{projectId}/documents
  async getProjectDocuments(teamId, projectId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}/documents`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/documents
  async getAllDocuments() {
    const response = await apiRequest(`${TEAM}/documents`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // DELETE /api/v1/team/{teamId}/projects/{projectId}/documents/{documentId}
  async deleteDocument(teamId, projectId, documentId) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/projects/${projectId}/documents/${documentId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== TASK API ====================
export const TeamTaskAPI = {

  // POST /api/v1/team/{teamId}/projects/{projectId}/tasks
  async createTask(teamId, projectId, taskData) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/projects/${projectId}/tasks`,
      jsonRequestOptions('POST', taskData)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // PUT /api/v1/team/{teamId}/tasks/{taskId}
  async updateTask(teamId, taskId, taskData) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/tasks/${taskId}`,
      jsonRequestOptions('PUT', taskData)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // DELETE /api/v1/team/{teamId}/tasks/{taskId}
  async deleteTask(teamId, taskId) {
    const response = await apiRequest(`${TEAM}/${teamId}/tasks/${taskId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/{projectId}/tasks
  async getProjectTasks(teamId, projectId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}/tasks`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/tasks/my-tasks
  async getMyTasks(teamId) {
    const response = await apiRequest(`${TEAM}/${teamId}/tasks/my-tasks`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/tasks/overdue
  async getOverdueTasks(teamId) {
    const response = await apiRequest(`${TEAM}/${teamId}/tasks/overdue`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== REMINDER API ====================
export const TeamReminderAPI = {

  // POST /api/v1/team/{teamId}/reminders
  async createReminder(teamId, reminderData) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/reminders`,
      jsonRequestOptions('POST', reminderData)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // PUT /api/v1/team/{teamId}/reminders/{reminderId}
  async updateReminder(teamId, reminderId, reminderData) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/reminders/${reminderId}`,
      jsonRequestOptions('PUT', reminderData)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // DELETE /api/v1/team/{teamId}/reminders/{reminderId}
  async deleteReminder(teamId, reminderId) {
    const response = await apiRequest(`${TEAM}/${teamId}/reminders/${reminderId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/reminders
  async getUserReminders(teamId) {
    const response = await apiRequest(`${TEAM}/${teamId}/reminders`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/projects/{projectId}/reminders
  async getProjectReminders(teamId, projectId) {
    const response = await apiRequest(`${TEAM}/${teamId}/projects/${projectId}/reminders`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // GET /api/v1/team/{teamId}/tasks/{taskId}/reminders
  async getTaskReminders(teamId, taskId) {
    const response = await apiRequest(`${TEAM}/${teamId}/tasks/${taskId}/reminders`, { method: 'GET' });
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== MESSAGING API ====================
export const TeamMessagingAPI = {

  // POST /api/v1/team/{teamId}/messages/send
  async sendTeamMessage(teamId, messageData) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/messages/send`,
      jsonRequestOptions('POST', messageData)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  },

  // POST /api/v1/team/{teamId}/projects/{projectId}/send-update
  async sendProjectUpdate(teamId, projectId, updateData) {
    const response = await apiRequest(
      `${TEAM}/${teamId}/projects/${projectId}/send-update`,
      jsonRequestOptions('POST', updateData)
    );
    if (!response.ok) throw new Error(await parseErrorResponse(response));
    return response.json();
  }
};

// ==================== HELPER FUNCTIONS ====================

export function createProjectFormData(projectData) {
  const formData = new FormData();
  formData.append('title', projectData.title);
  formData.append('description', projectData.description);
  formData.append('startDate', projectData.startDate);
  formData.append('endDate', projectData.endDate);
  if (projectData.status) formData.append('status', projectData.status);
  if (projectData.documents?.length > 0) {
    projectData.documents.forEach(file => formData.append('documents', file));
  }
  if (projectData.documentDescription) {
    formData.append('documentDescription', projectData.documentDescription);
  }
  return formData;
}

export function createDocumentFormData(files, description) {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  if (description) formData.append('description', description);
  return formData;
}

export function formatDateForAPI(date) {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateTimeForAPI(datetime) {
  if (!datetime) return null;
  return new Date(datetime).toISOString();
}

export function calculateDaysRemaining(dueDate) {
  if (!dueDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

export function getPriorityColor(priority) {
  return { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#f97316', URGENT: '#ef4444' }[priority] || '#64748b';
}

export function getTaskStatusColor(status) {
  return { TODO: '#64748b', IN_PROGRESS: '#3b82f6', IN_REVIEW: '#f59e0b', DONE: '#10b981' }[status] || '#64748b';
}

export function getProjectStatusColor(status) {
  return { ACTIVE: '#3b82f6', COMPLETED: '#10b981', ON_HOLD: '#f59e0b', CANCELLED: '#ef4444' }[status] || '#64748b';
}

export function getDocumentTypeIcon(docType) {
  return { PDF: '📄', WORD: '📝', POWERPOINT: '📊', EXCEL: '📈' }[docType] || '📎';
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function isValidDocumentType(file) {
  return [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ].includes(file.type);
}

export function isValidFileSize(file) {
  return file.size <= 50 * 1024 * 1024; // 50MB
}

// ==================== DEFAULT EXPORT ====================
export default {
  DashboardAPI,
  TeamManagementAPI,
  TeamProjectAPI,
  TeamDocumentAPI,
  TeamTaskAPI,
  TeamReminderAPI,
  TeamMessagingAPI,
  createProjectFormData,
  createDocumentFormData,
  formatDateForAPI,
  formatDateTimeForAPI,
  calculateDaysRemaining,
  getPriorityColor,
  getTaskStatusColor,
  getProjectStatusColor,
  getDocumentTypeIcon,
  formatFileSize,
  isValidDocumentType,
  isValidFileSize
};