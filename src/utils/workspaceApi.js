// utils/workspaceApi.js
// User Workspace API — maps to UserWorkSpaceController (/api/v1/user/workspace/*)

const API = 'https://nova-test-yihm.onrender.com/api';

// ── Token ────────────────────────────────────────────────────
const getAccessToken = () => {
  let token = sessionStorage.getItem('accessToken');
  if (token) return token;
  token = localStorage.getItem('accessToken');
  if (token) sessionStorage.setItem('accessToken', token);
  return token;
};

// ── Core fetch ───────────────────────────────────────────────
const apiRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const isFormData = options.body instanceof FormData;

  const headers = {
    'ngrok-skip-browser-warning': 'true',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    if (window.location.pathname !== '/auth') window.location.href = '/auth';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

// ── Error parser ─────────────────────────────────────────────
async function parseError(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json.message || json.error || text || 'Unexpected error';
  } catch {
    return text || 'Unexpected error';
  }
}

// ── WorkSpace API ─────────────────────────────────────────────
const WorkSpaceAPI = {

  /**
   * POST /api/v1/user/workspace/create
   * formData: { title, description, docType }
   */
  async createWorkspace(formData) {
    const response = await apiRequest('/v1/user/workspace/create', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.title,
        description: formData.description || '',
      }),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * POST /api/v1/user/workspace/template/{docId}?docType={docType}
   */
  async createTemplate(docId, docType) {
    const response = await apiRequest(
      `/v1/user/workspace/template/${docId}?docType=${docType}`,
      { method: 'POST' }
    );
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * GET /api/v1/user/workspace/view/{docId}
   */
  async viewWorkspace(docId) {
    const response = await apiRequest(`/v1/user/workspace/view/${docId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * PUT /api/v1/user/workspace/work/{docId}
   * Replaces content
   */
  async workInWorkspace(docId, content) {
    const response = await apiRequest(`/v1/user/workspace/work/${docId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * PATCH /api/v1/user/workspace/continue/{docId}
   * Appends content
   */
  async continueWork(docId, content) {
    const response = await apiRequest(`/v1/user/workspace/continue/${docId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * DELETE /api/v1/user/workspace/delete/{docId}
   */
  async deleteWorkspace(docId) {
    const response = await apiRequest(`/v1/user/workspace/delete/${docId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.text();
  },

  /**
   * GET /api/v1/user/workspace/download/{docId}
   * Returns blob
   */
  async downloadWorkspace(docId) {
    const response = await apiRequest(`/v1/user/workspace/download/${docId}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.blob();
  },

  /**
   * GET /api/v1/user/workspace/download-all
   * Returns blob (ZIP)
   */
  async downloadAllWorkspaces() {
    const response = await apiRequest('/v1/user/workspace/download-all', {
      method: 'GET',
    });
    if (response.status === 204) throw new Error('No workspaces to download');
    if (!response.ok) throw new Error(await parseError(response));
    return response.blob();
  },

  /**
   * GET /api/v1/user/workspace/recent
   */
  async getRecentWorkspaces() {
    const response = await apiRequest('/v1/user/workspace/recent', {
      method: 'GET',
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * GET /api/v1/user/workspace/recently-accessed
   */
  async getRecentlyAccessedWorkspaces() {
    const response = await apiRequest('/v1/user/workspace/recently-accessed', {
      method: 'GET',
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * GET /api/v1/user/workspace/by-type?docType={docType}
   */
  async getWorkspacesByType(docType) {
    const response = await apiRequest(`/v1/user/workspace/by-type?docType=${docType}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * GET /api/v1/user/workspace/search?keyword={keyword}
   */
  async searchWorkspaces(keyword) {
    const response = await apiRequest(
      `/v1/user/workspace/search?keyword=${encodeURIComponent(keyword)}`,
      { method: 'GET' }
    );
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  },

  /**
   * Trigger browser file download from a blob
   */
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default WorkSpaceAPI;
