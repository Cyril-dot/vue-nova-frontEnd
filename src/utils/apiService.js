// utils/apiService.js
// Centralized API service for handling authentication and API calls

const API_BASE_URL = 'https://nova-test-ctne.onrender.com/api';

// Token Management
export const TokenService = {
  getAccessToken() {
    // Check sessionStorage first (faster and more reliable for same-session)
    let token = sessionStorage.getItem('accessToken');
    if (token) return token;
    
    // Fall back to localStorage
    token = localStorage.getItem('accessToken');
    
    // If found in localStorage but not sessionStorage, sync them
    if (token) {
      sessionStorage.setItem('accessToken', token);
    }
    
    return token;
  },

  getRefreshToken() {
    // Check sessionStorage first
    let token = sessionStorage.getItem('refreshToken');
    if (token) return token;
    
    // Fall back to localStorage
    token = localStorage.getItem('refreshToken');
    
    // Sync to sessionStorage if found
    if (token) {
      sessionStorage.setItem('refreshToken', token);
    }
    
    return token;
  },

  setTokens(accessToken, refreshToken) {
    // Save to BOTH storages
    localStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('accessToken', accessToken);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('refreshToken', refreshToken);
    }
    
    // Emit event for components listening
    window.dispatchEvent(new Event('auth-token-updated'));
    
    console.log('TokenService: Tokens saved to both storages');
  },

  clearTokens() {
    // Clear from BOTH storages
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    
    window.dispatchEvent(new Event('auth-logout'));
    
    console.log('TokenService: All tokens cleared');
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    const isAuth = !!token;
    console.log('TokenService.isAuthenticated():', isAuth, 'Token length:', token ? token.length : 0);
    return isAuth;
  }
};

// API Request Helper - Supports both JSON and FormData
export const apiRequest = async (endpoint, options = {}) => {
  const token = TokenService.getAccessToken();
  
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle token expiration - logout and redirect
    if (response.status === 401) {
      console.warn('Authentication failed - token may be expired. Logging out...');
      TokenService.clearTokens();
      
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

// Authentication API
export const AuthAPI = {
  async register(formData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true'
        // No Content-Type - let browser set it for FormData
      },
      body: formData // FormData object
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Registration failed');
    }

    return data;
  },

  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Login failed');
    }

    return data;
  },

  async verifyMfa(email, mfaCode) {
    const response = await apiRequest(
      `/auth/verify-mfa?email=${encodeURIComponent(email)}&mfaCode=${mfaCode}`,
      {
        method: 'POST'
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'MFA verification failed');
    }

    return data;
  },

  async logout() {
    TokenService.clearTokens();
    // No backend logout endpoint needed - just clear local tokens
  }
};

// User API - for authenticated requests
export const UserAPI = {
  async getProfile() {
    const response = await apiRequest('/auth/me', {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to fetch profile');
    }
    
    return await response.json();
  },

  async updateProfile(userData) {
    // userData can be either FormData or JSON object
    const response = await apiRequest('/auth/me', {
      method: 'PUT',
      body: userData instanceof FormData ? userData : JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to update profile');
    }
    
    return await response.json();
  },

  async getProfileImage() {
    const response = await apiRequest('/auth/me/profile-image', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile image');
    }
    
    return await response.blob();
  },

  async deleteProfileImage() {
    const response = await apiRequest('/auth/me/profile-image', {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to delete profile image');
    }
    
    return await response.json();
  },

  async changePassword(oldPassword, newPassword, confirmPassword) {
    const response = await apiRequest('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({
        oldPassword,
        newPassword,
        confirmPassword
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to change password');
    }
    
    return await response.text();
  }
};

// Dashboard API
export const DashboardAPI = {
  async getStats() {
    const response = await apiRequest('/dashboard/stats', {
      method: 'GET'
    });
    
    if (!response.ok) {
      // Return default values if endpoint not implemented yet
      console.warn('Dashboard stats endpoint not available, using defaults');
      return {
        totalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
      };
    }
    
    return await response.json();
  }
};

// MFA API
export const MFAAPI = {
  async enableMfa() {
    const response = await apiRequest('/auth/enable-mfa', {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to enable MFA');
    }
    
    return await response.json();
  },

  async disableMfa() {
    const response = await apiRequest('/auth/disable-mfa', {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to disable MFA');
    }
    
    return await response.text();
  },

  async viewMfaCode(email) {
    const response = await apiRequest(`/auth/mfa-code?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to get MFA code');
    }
    
    return await response.json();
  },

  async generateMfaKeys(email) {
    const response = await apiRequest(`/auth/generate-mfa?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to generate MFA keys');
    }
    
    return await response.json();
  },

  async viewMfa(email) {
    const response = await apiRequest(`/auth/view-mfa?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to view MFA details');
    }
    
    return await response.json();
  }
};

// Export base URL for direct use if needed
export { API_BASE_URL };

// Default export
export default {
  TokenService,
  AuthAPI,
  UserAPI,
  DashboardAPI,
  MFAAPI,
  apiRequest,
  API_BASE_URL
};