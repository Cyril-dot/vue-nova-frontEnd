// utils/projectsApi.js
// Project-specific API methods wrapping the centralized apiService

import { apiRequest, TokenService } from './apiService.js';

export const ProjectsAPI = {
  /**
   * Get all projects with optional filters
   * @param {Object} options - Query options
   * @param {string} options.status - Filter by status (ACTIVE, COMPLETED, PLANNING, IN_PROGRESS, ARCHIVED)
   * @param {boolean} options.includeDocuments - Whether to include documents in response
   * @returns {Promise<Object>} Projects data
   */
  async getAllProjects({ status = '', includeDocuments = false } = {}) {
    const params = new URLSearchParams();

    // Only append status if it's not empty
    if (status && status.trim() !== '') {
      params.append('status', status);
      console.log('🔍 Filtering by status:', status);
    }

    // Only append includeDocuments when true — avoids sending includeDocuments=false
    // which some backends (Express, etc.) misread since any present param can be
    // treated as truthy, and it keeps the query string clean when not needed
    if (includeDocuments) {
      params.append('includeDocuments', 'true');
    }

    const queryString = params.toString();
    const url = `/projects${queryString ? '?' + queryString : ''}`;
    console.log('📡 API Request URL:', url);

    const response = await apiRequest(url, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to fetch projects');
    }

    return await response.json();
  },

  /**
   * Get a specific project by ID
   * @param {string} projectId - Project ID
   * @param {boolean} includeDocuments - Whether to include documents
   * @returns {Promise<Object>} Project data
   */
  async getProjectById(projectId, includeDocuments = true) {
    const params = new URLSearchParams({ includeDocuments });

    const response = await apiRequest(`/projects/${projectId}?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to fetch project');
    }

    return await response.json();
  },

  /**
   * Create a new project
   * Accepts either FormData (for file uploads) or JSON object
   * @param {FormData|Object} projectData - Project data
   * @returns {Promise<Object>} Created project data
   */
  async createProject(projectData) {
    // Support both FormData and JSON objects
    const body = projectData instanceof FormData
      ? projectData
      : JSON.stringify(projectData);

    const response = await apiRequest('/projects', {
      method: 'POST',
      body: body
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to create project');
    }

    return await response.json();
  },

  /**
   * Update an existing project
   * Accepts either FormData (for file uploads) or JSON object
   * @param {string} projectId - Project ID
   * @param {FormData|Object} projectData - Updated project data
   * @returns {Promise<Object>} Updated project data
   */
  async updateProject(projectId, projectData) {
    // Support both FormData and JSON objects
    const body = projectData instanceof FormData
      ? projectData
      : JSON.stringify(projectData);

    const response = await apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: body
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to update project');
    }

    return await response.json();
  },

  /**
   * Delete a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteProject(projectId) {
    const response = await apiRequest(`/projects/${projectId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to delete project');
    }

    return await response.json();
  },

  /**
   * Search projects by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Object>} Search results
   */
  async searchProjects(keyword) {
    const params = new URLSearchParams({ keyword });

    const response = await apiRequest(`/projects/search?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to search projects');
    }

    return await response.json();
  },

  /**
   * Upload documents to a project
   * @param {string} projectId - Project ID
   * @param {FormData} formData - Documents as FormData
   * @returns {Promise<Object>} Uploaded documents data
   */
  async uploadDocuments(projectId, formData) {
    const response = await apiRequest(`/projects/${projectId}/documents`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to upload documents');
    }

    return await response.json();
  },

  /**
   * Get documents for a project
   * @param {string} projectId - Project ID
   * @param {string} type - Optional document type filter
   * @returns {Promise<Object>} Documents data
   */
  async getProjectDocuments(projectId, type = '') {
    const params = type ? new URLSearchParams({ type }) : '';

    const response = await apiRequest(`/projects/${projectId}/documents${params ? '?' + params : ''}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to fetch documents');
    }

    return await response.json();
  },

  /**
   * Download a document
   * @param {string} documentId - Document ID
   * @returns {Promise<Blob>} Document blob
   */
  async downloadDocument(documentId) {
    const response = await apiRequest(`/projects/documents/${documentId}/download`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return await response.blob();
  },

  /**
   * View a document inline (returns blob for preview)
   * @param {string} documentId - Document ID
   * @returns {Promise<Blob>} Document blob
   */
  async viewDocument(documentId) {
    const response = await apiRequest(`/projects/documents/${documentId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to view document');
    }

    return await response.blob();
  },

  /**
   * Delete a document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteDocument(documentId) {
    const response = await apiRequest(`/projects/documents/${documentId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to delete document');
    }

    return await response.json();
  }
};

export default ProjectsAPI;