// utils/tasksApi.js
// Task-specific API methods wrapping the centralized apiService

import { apiRequest } from './apiService.js';

export const TasksAPI = {
  // ==================== USER TASKS ====================
  
  /**
   * Create a new user task
   * @param {Object} taskData - Task creation data
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description
   * @param {string} taskData.priority - Task priority (HIGH, MEDIUM, LOW)
   * @param {string} taskData.status - Task status (PENDING, IN_PROGRESS, COMPLETED)
   * @param {string} taskData.dueDate - Due date (YYYY-MM-DD)
   * @returns {Promise<Object>} Created task data
   */
  async createUserTask(taskData) {
    console.log('📝 Creating user task:', taskData);
    
    const response = await apiRequest('/tasks/create/user', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }

    return await response.json();
  },

  /**
   * Get all user tasks
   * @returns {Promise<Array>} List of user tasks
   */
  async getAllUserTasks() {
    console.log('📋 Fetching all user tasks');
    
    const response = await apiRequest('/tasks/user/all', {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch tasks');
    }

    return await response.json();
  },

  /**
   * Get a specific user task by ID
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Task data
   */
  async getUserTaskById(taskId) {
    console.log('🔍 Fetching user task:', taskId);
    
    const response = await apiRequest(`/tasks/user/${taskId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch task');
    }

    return await response.json();
  },

  /**
   * Get user tasks by status
   * @param {string} status - Task status (PENDING, IN_PROGRESS, COMPLETED, OVERDUE)
   * @returns {Promise<Array>} Filtered tasks
   */
  async getUserTasksByStatus(status) {
    console.log('📊 Fetching user tasks by status:', status);
    
    const response = await apiRequest(`/tasks/user/status/${status}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch tasks by status');
    }

    return await response.json();
  },

  /**
   * Search user tasks by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} Matching tasks
   */
  async searchUserTasks(keyword) {
    console.log('🔍 Searching user tasks:', keyword);
    
    const params = new URLSearchParams({ keyword });
    
    const response = await apiRequest(`/tasks/user/search?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search tasks');
    }

    return await response.json();
  },

  /**
   * Update a user task
   * @param {string} taskId - Task ID
   * @param {Object} updateData - Updated task data
   * @returns {Promise<Object>} Updated task data
   */
  async updateUserTask(taskId, updateData) {
    console.log('✏️ Updating user task:', taskId, updateData);
    
    const response = await apiRequest(`/tasks/user/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task');
    }

    return await response.json();
  },

  /**
   * Delete a user task
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteUserTask(taskId) {
    console.log('🗑️ Deleting user task:', taskId);
    
    const response = await apiRequest(`/tasks/user/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete task');
    }

    return await response.json();
  },

  // ==================== PROJECT TASKS ====================

  /**
   * Create a new project task
   * @param {string} projectId - Project ID
   * @param {Object} taskData - Task creation data
   * @returns {Promise<Object>} Created task data
   */
  async createProjectTask(projectId, taskData) {
    console.log('📝 Creating project task:', projectId, taskData);
    
    const response = await apiRequest(`/tasks/create/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project task');
    }

    return await response.json();
  },

  /**
   * Get all tasks for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} List of project tasks
   */
  async getAllProjectTasks(projectId) {
    console.log('📋 Fetching all project tasks:', projectId);
    
    const response = await apiRequest(`/tasks/project/${projectId}/all`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch project tasks');
    }

    return await response.json();
  },

  /**
   * Get a specific project task by ID
   * @param {string} projectId - Project ID
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Task data
   */
  async getProjectTaskById(projectId, taskId) {
    console.log('🔍 Fetching project task:', projectId, taskId);
    
    const response = await apiRequest(`/tasks/project/${projectId}/${taskId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch project task');
    }

    return await response.json();
  },

  /**
   * Get project tasks by status
   * @param {string} projectId - Project ID
   * @param {string} status - Task status
   * @returns {Promise<Array>} Filtered tasks
   */
  async getProjectTasksByStatus(projectId, status) {
    console.log('📊 Fetching project tasks by status:', projectId, status);
    
    const response = await apiRequest(`/tasks/project/${projectId}/status/${status}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch project tasks by status');
    }

    return await response.json();
  },

  /**
   * Search project tasks by keyword
   * @param {string} projectId - Project ID
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} Matching tasks
   */
  async searchProjectTasks(projectId, keyword) {
    console.log('🔍 Searching project tasks:', projectId, keyword);
    
    const params = new URLSearchParams({ keyword });
    
    const response = await apiRequest(`/tasks/project/${projectId}/search?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search project tasks');
    }

    return await response.json();
  },

  /**
   * Update a project task
   * @param {string} projectId - Project ID
   * @param {string} taskId - Task ID
   * @param {Object} updateData - Updated task data
   * @returns {Promise<Object>} Updated task data
   */
  async updateProjectTask(projectId, taskId, updateData) {
    console.log('✏️ Updating project task:', projectId, taskId, updateData);
    
    const response = await apiRequest(`/tasks/project/${projectId}/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project task');
    }

    return await response.json();
  },

  /**
   * Delete a project task
   * @param {string} projectId - Project ID
   * @param {string} taskId - Task ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteProjectTask(projectId, taskId) {
    console.log('🗑️ Deleting project task:', projectId, taskId);
    
    const response = await apiRequest(`/tasks/project/${projectId}/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete project task');
    }

    return await response.json();
  }
};

export default TasksAPI;