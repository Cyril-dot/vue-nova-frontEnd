// utils/apiService.js
// Centralized API service for handling authentication and API calls
// ✅ FIXED: Integrated OAuth token capture and TokenService management

const API_BASE_URL = 'https://nova-test-yihm.onrender.com/api';

// ✅ Token Management Service
export const TokenService = {
  /**
   * Get access token from storage
   * Checks sessionStorage first (faster), falls back to localStorage
   */
  getAccessToken() {
    console.log('TokenService.getAccessToken() called');
    
    // Check sessionStorage first (faster and more reliable for same-session)
    let token = sessionStorage.getItem('accessToken');
    if (token) {
      console.log('✅ Access token found in sessionStorage (length:', token.length, ')');
      return token;
    }
    
    // Fall back to localStorage
    token = localStorage.getItem('accessToken');
    
    // If found in localStorage but not sessionStorage, sync them
    if (token) {
      console.log('✅ Access token found in localStorage, syncing to sessionStorage');
      sessionStorage.setItem('accessToken', token);
      return token;
    }
    
    console.warn('⚠️ No access token found in either storage');
    return null;
  },

  /**
   * Get refresh token from storage
   * Checks sessionStorage first, falls back to localStorage
   */
  getRefreshToken() {
    console.log('TokenService.getRefreshToken() called');
    
    // Check sessionStorage first
    let token = sessionStorage.getItem('refreshToken');
    if (token) {
      console.log('✅ Refresh token found in sessionStorage (length:', token.length, ')');
      return token;
    }
    
    // Fall back to localStorage
    token = localStorage.getItem('refreshToken');
    
    // Sync to sessionStorage if found
    if (token) {
      console.log('✅ Refresh token found in localStorage, syncing to sessionStorage');
      sessionStorage.setItem('refreshToken', token);
      return token;
    }
    
    console.warn('⚠️ No refresh token found in either storage');
    return null;
  },

  /**
   * Save tokens to BOTH localStorage and sessionStorage
   * Dispatches event for other components to listen
   */
  setTokens(accessToken, refreshToken) {
    console.log('🔐 TokenService.setTokens() called');
    console.log('- Access Token length:', accessToken ? accessToken.length : 0);
    console.log('- Refresh Token length:', refreshToken ? refreshToken.length : 0);
    
    try {
      // Save access token to BOTH storages
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('accessToken', accessToken);
        console.log('✅ Access token saved to both storages');
      }
      
      // Save refresh token to BOTH storages
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        console.log('✅ Refresh token saved to both storages');
      }
      
      // Verify tokens were saved
      const savedAccessToken = localStorage.getItem('accessToken');
      const sessionAccessToken = sessionStorage.getItem('accessToken');
      
      if (!savedAccessToken || !sessionAccessToken) {
        throw new Error('Failed to verify token save');
      }
      
      console.log('✅✅✅ All tokens saved successfully ✅✅✅');
      
      // Emit event for components listening
      window.dispatchEvent(new Event('auth-token-updated'));
      console.log('📡 Dispatched auth-token-updated event');
      
    } catch (error) {
      console.error('❌ Error saving tokens:', error);
      throw error;
    }
  },

  /**
   * Clear all tokens from both storages
   * Dispatches logout event
   */
  clearTokens() {
    console.log('🔓 TokenService.clearTokens() called');
    
    // Clear from BOTH storages
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    
    console.log('✅ All tokens cleared');
    
    // Dispatch logout event
    window.dispatchEvent(new Event('auth-logout'));
    console.log('📡 Dispatched auth-logout event');
  },

  /**
   * Check if user is authenticated (has valid access token)
   */
  isAuthenticated() {
    const token = this.getAccessToken();
    const isAuth = !!token;
    console.log('TokenService.isAuthenticated():', isAuth);
    return isAuth;
  }
};

// ✅ API Request Helper - Supports both JSON and FormData
export const apiRequest = async (endpoint, options = {}) => {
  const token = TokenService.getAccessToken();
  
  // Check if token exists for authenticated endpoints
  if (!token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/oauth2')) {
    console.warn('⚠️ No access token available for authenticated request to:', endpoint);
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

  console.log(`📡 API Request: ${config.method || 'GET'} ${API_BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle token expiration - logout and redirect
    if (response.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Token may be expired');
      TokenService.clearTokens();
      
      // Only redirect if not already on auth page
      if (window.location.pathname !== '/auth') {
        console.log('🔄 Redirecting to /auth');
        window.location.href = '/auth';
      }
      
      throw new Error('Session expired. Please login again.');
    }

    return response;
  } catch (error) {
    console.error('❌ API Request Error:', error);
    throw error;
  }
};

// ✅ Authentication API
export const AuthAPI = {
  /**
   * Register new user account
   * @param {FormData} formData - User registration data
   */
  async register(formData) {
    console.log('📝 AuthAPI.register() called');
    
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
      console.error('❌ Registration failed:', data);
      throw new Error(data.error || data.message || 'Registration failed');
    }

    console.log('✅ Registration successful');
    return data;
  },

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login(email, password) {
    console.log('🔐 AuthAPI.login() called for:', email);
    
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Login failed:', data);
      throw new Error(data.error || data.message || 'Login failed');
    }

    console.log('✅ Login successful');
    return data;
  },

  /**
   * Verify MFA code
   * @param {string} email - User email
   * @param {string} mfaCode - 6-digit MFA code
   */
  async verifyMfa(email, mfaCode) {
    console.log('🛡️ AuthAPI.verifyMfa() called for:', email);
    
    const response = await apiRequest(
      `/auth/verify-mfa?email=${encodeURIComponent(email)}&mfaCode=${mfaCode}`,
      {
        method: 'POST'
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ MFA verification failed:', data);
      throw new Error(data.error || data.message || 'MFA verification failed');
    }

    console.log('✅ MFA verification successful');
    return data;
  },

  /**
   * Logout user (clear tokens)
   */
  async logout() {
    console.log('🔓 AuthAPI.logout() called');
    TokenService.clearTokens();
    // No backend logout endpoint needed - just clear local tokens
  }
};

// ✅ User API - for authenticated requests
export const UserAPI = {
  /**
   * Get current user profile
   */
  async getProfile() {
    console.log('👤 UserAPI.getProfile() called');
    
    const response = await apiRequest('/auth/me', {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to fetch profile:', error);
      throw new Error(error.error || error.message || 'Failed to fetch profile');
    }
    
    const data = await response.json();
    console.log('✅ Profile fetched successfully');
    return data;
  },

  /**
   * Update user profile
   * @param {FormData|Object} userData - User data to update
   */
  async updateProfile(userData) {
    console.log('✏️ UserAPI.updateProfile() called');
    
    // userData can be either FormData or JSON object
    const response = await apiRequest('/auth/me', {
      method: 'PUT',
      body: userData instanceof FormData ? userData : JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to update profile:', error);
      throw new Error(error.error || error.message || 'Failed to update profile');
    }
    
    const data = await response.json();
    console.log('✅ Profile updated successfully');
    return data;
  },

  /**
   * Get user profile image
   */
  async getProfileImage() {
    console.log('🖼️ UserAPI.getProfileImage() called');
    
    const response = await apiRequest('/auth/me/profile-image', {
      method: 'GET'
    });
    
    if (!response.ok) {
      console.error('❌ Failed to fetch profile image');
      throw new Error('Failed to fetch profile image');
    }
    
    console.log('✅ Profile image fetched successfully');
    return await response.blob();
  },

  /**
   * Delete user profile image
   */
  async deleteProfileImage() {
    console.log('🗑️ UserAPI.deleteProfileImage() called');
    
    const response = await apiRequest('/auth/me/profile-image', {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to delete profile image:', error);
      throw new Error(error.error || error.message || 'Failed to delete profile image');
    }
    
    const data = await response.json();
    console.log('✅ Profile image deleted successfully');
    return data;
  },

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   */
  async changePassword(oldPassword, newPassword, confirmPassword) {
    console.log('🔑 UserAPI.changePassword() called');
    
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
      console.error('❌ Failed to change password:', error);
      throw new Error(error.error || error.message || 'Failed to change password');
    }
    
    const message = await response.text();
    console.log('✅ Password changed successfully');
    return message;
  }
};

// ✅ Dashboard API
export const DashboardAPI = {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    console.log('📊 DashboardAPI.getStats() called');
    
    try {
      const response = await apiRequest('/dashboard/stats', {
        method: 'GET'
      });
      
      if (!response.ok) {
        console.warn('⚠️ Dashboard stats endpoint not available, using defaults');
        return {
          totalProjects: 0,
          completedProjects: 0,
          inProgressProjects: 0,
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0
        };
      }
      
      const data = await response.json();
      console.log('✅ Dashboard stats fetched successfully');
      return data;
    } catch (error) {
      console.warn('⚠️ Error fetching dashboard stats, using defaults:', error.message);
      return {
        totalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
      };
    }
  }
};

// ✅ MFA API
export const MFAAPI = {
  /**
   * Enable MFA for user
   */
  async enableMfa() {
    console.log('🛡️ MFAAPI.enableMfa() called');
    
    const response = await apiRequest('/auth/enable-mfa', {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to enable MFA:', error);
      throw new Error(error.error || error.message || 'Failed to enable MFA');
    }
    
    const data = await response.json();
    console.log('✅ MFA enabled successfully');
    return data;
  },

  /**
   * Disable MFA for user
   */
  async disableMfa() {
    console.log('🔓 MFAAPI.disableMfa() called');
    
    const response = await apiRequest('/auth/disable-mfa', {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to disable MFA:', error);
      throw new Error(error.error || error.message || 'Failed to disable MFA');
    }
    
    const message = await response.text();
    console.log('✅ MFA disabled successfully');
    return message;
  },

  /**
   * View MFA code for user
   * @param {string} email - User email
   */
  async viewMfaCode(email) {
    console.log('👁️ MFAAPI.viewMfaCode() called for:', email);
    
    const response = await apiRequest(`/auth/mfa-code?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to get MFA code:', error);
      throw new Error(error.error || error.message || 'Failed to get MFA code');
    }
    
    const data = await response.json();
    console.log('✅ MFA code retrieved successfully');
    return data;
  },

  /**
   * Generate MFA keys for user
   * @param {string} email - User email
   */
  async generateMfaKeys(email) {
    console.log('🔑 MFAAPI.generateMfaKeys() called for:', email);
    
    const response = await apiRequest(`/auth/generate-mfa?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to generate MFA keys:', error);
      throw new Error(error.error || error.message || 'Failed to generate MFA keys');
    }
    
    const data = await response.json();
    console.log('✅ MFA keys generated successfully');
    return data;
  },

  /**
   * View MFA details for user
   * @param {string} email - User email
   */
  async viewMfa(email) {
    console.log('👁️ MFAAPI.viewMfa() called for:', email);
    
    const response = await apiRequest(`/auth/view-mfa?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to view MFA details:', error);
      throw new Error(error.error || error.message || 'Failed to view MFA details');
    }
    
    const data = await response.json();
    console.log('✅ MFA details retrieved successfully');
    return data;
  }
};

// ✅ Export base URL for direct use if needed
export { API_BASE_URL };

// ✅ Default export - all services in one object
export default {
  TokenService,
  AuthAPI,
  UserAPI,
  DashboardAPI,
  MFAAPI,
  apiRequest,
  API_BASE_URL
};
