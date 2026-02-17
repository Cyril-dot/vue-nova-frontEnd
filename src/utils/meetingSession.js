// utils/meetingSession.js
// Vue-compatible wrapper for novaState.js functionality
// This bridges the vanilla JS session management with your Vue app

import { TokenService } from '@/utils/apiService';

export const MeetingSession = {
  // Meeting code management
  setMeetingCode(code) {
    sessionStorage.setItem('nova_meeting_code', code);
  },
  
  getMeetingCode() {
    return sessionStorage.getItem('nova_meeting_code');
  },
  
  clearMeetingCode() {
    sessionStorage.removeItem('nova_meeting_code');
  },
  
  // Guest user management (for non-authenticated users)
  setGuestUser(name, email = null) {
    const guestUser = {
      name,
      email,
      isGuest: true,
      id: null
    };
    sessionStorage.setItem('nova_user', JSON.stringify(guestUser));
  },
  
  getUser() {
    try {
      const userStr = sessionStorage.getItem('nova_user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  clearUser() {
    sessionStorage.removeItem('nova_user');
  },
  
  // Check if user can join meetings
  canJoinMeeting() {
    // Either authenticated OR has guest user info
    return TokenService.isAuthenticated() || this.getUser() !== null;
  },
  
  // Get user display name for meeting
  getUserDisplayName() {
    const user = this.getUser();
    if (user) {
      return user.name || user.email || 'Guest';
    }
    
    // Try to get from TokenService
    const token = TokenService.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name || payload.sub?.split('@')[0] || 'User';
      } catch {
        return 'User';
      }
    }
    
    return 'Guest';
  },
  
  // Get user initials for avatar
  getUserInitials() {
    const name = this.getUserDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  },
  
  // Save recent meeting
  saveRecentMeeting(code, title) {
    try {
      const recent = JSON.parse(sessionStorage.getItem('nova_recent') || '[]');
      recent.unshift({
        code,
        title,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      });
      // Keep only last 10
      sessionStorage.setItem('nova_recent', JSON.stringify(recent.slice(0, 10)));
    } catch (err) {
      console.error('Error saving recent meeting:', err);
    }
  },
  
  getRecentMeetings() {
    try {
      return JSON.parse(sessionStorage.getItem('nova_recent') || '[]');
    } catch {
      return [];
    }
  },
  
  // Clear all meeting-related data
  clearMeetingData() {
    this.clearMeetingCode();
    this.clearUser();
    sessionStorage.removeItem('nova_recent');
  }
};

export default MeetingSession;