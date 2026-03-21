// utils/meetingSession.js  — Jitsi Meet backend

import { TokenService } from '@/utils/apiService';

const BACKEND_API = 'https://nova-test-yihm.onrender.com/api';

function headers(requiresAuth = true) {
  const jwt = TokenService.getAccessToken();
  const h   = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' };
  if (jwt) h['Authorization'] = `Bearer ${jwt}`;
  else if (requiresAuth) console.warn('⚠️ [MeetingSession] No JWT for authenticated call');
  return h;
}

export const MeetingSession = {

  // ── Meeting code ──────────────────────────────────────────────────────────
  setMeetingCode(code)  { sessionStorage.setItem('nova_meeting_code', code); },
  getMeetingCode()      { return sessionStorage.getItem('nova_meeting_code'); },
  clearMeetingCode()    { sessionStorage.removeItem('nova_meeting_code'); },

  // ── Host flag ─────────────────────────────────────────────────────────────
  setIsHost(v)          { sessionStorage.setItem('nova_is_host', v ? 'true' : 'false'); },
  isHost()              { return sessionStorage.getItem('nova_is_host') === 'true'; },
  clearIsHost()         { sessionStorage.removeItem('nova_is_host'); },

  // ── Guest user ────────────────────────────────────────────────────────────
  setGuestUser(name, email = null) {
    sessionStorage.setItem('nova_user', JSON.stringify({ name, email, isGuest: true, id: null }));
  },
  getUser() {
    try { const r = sessionStorage.getItem('nova_user'); return r ? JSON.parse(r) : null; } catch { return null; }
  },
  clearUser()   { sessionStorage.removeItem('nova_user'); },
  isGuestUser() { return !!(this.getUser()?.isGuest); },

  // ── Jitsi room cache ──────────────────────────────────────────────────────
  setJitsiRoom(roomUrl, roomName) {
    if (roomUrl)  sessionStorage.setItem('nova_jitsi_room', roomUrl);
    if (roomName) sessionStorage.setItem('nova_jitsi_name', roomName);
  },
  getJitsiRoom() {
    return {
      roomUrl:  sessionStorage.getItem('nova_jitsi_room') || null,
      roomName: sessionStorage.getItem('nova_jitsi_name') || null,
    };
  },
  setJitsiToken(t)  { if (t) sessionStorage.setItem('nova_jitsi_token', t); },
  getJitsiToken()   { return sessionStorage.getItem('nova_jitsi_token') || null; },
  clearJitsiRoom()  {
    sessionStorage.removeItem('nova_jitsi_room');
    sessionStorage.removeItem('nova_jitsi_name');
    sessionStorage.removeItem('nova_jitsi_token');
  },

  // ── Fetch token ───────────────────────────────────────────────────────────
  async fetchMeetingToken(meetingCode, isOwner = false) {
    try {
      const isAuth = TokenService.isAuthenticated();
      let url, body;

      if (isAuth) {
        url  = `${BACKEND_API}/meetings/${encodeURIComponent(meetingCode)}/token`;
        body = JSON.stringify({ isOwner });
        console.log('🔑 [MeetingSession] Fetching auth token:', url);
      } else {
        const guest       = this.getUser();
        const displayName = guest?.name || 'Guest';
        url  = `${BACKEND_API}/meetings/join/guest`;
        body = JSON.stringify({ roomCode: meetingCode, displayName });
        console.log('🔑 [MeetingSession] Fetching guest token:', url);
      }

      const res  = await fetch(url, { method: 'POST', headers: headers(isAuth), body });
      const data = await res.json();

      if (!res.ok) {
        console.warn('⚠️ [MeetingSession] Token error:', data.message || res.status);
        return null;
      }

      // data: { token, roomUrl, roomName, isModerator/isOwner }
      this.setJitsiRoom(data.roomUrl, data.roomName);
      if (data.token) this.setJitsiToken(data.token);

      console.log('✅ [MeetingSession] Token received:', data);
      return data;

    } catch (err) {
      console.error('❌ [MeetingSession] fetchMeetingToken error:', err.message);
      return null;
    }
  },

  // ── Validate room code ────────────────────────────────────────────────────
  async validateMeetingCode(code) {
    try {
      const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (res.status === 404) return { valid: false, meeting: null, message: 'Meeting not found.' };
      const data = await res.json();
      return { valid: res.ok, meeting: res.ok ? data : null, message: res.ok ? null : (data.message || 'Unknown error') };
    } catch {
      return { valid: false, meeting: null, message: 'Could not reach server.' };
    }
  },

  // ── Create meeting ────────────────────────────────────────────────────────
  async createMeeting(roomName, isPrivate = false) {
    const res  = await fetch(`${BACKEND_API}/meetings/create`, {
      method:  'POST',
      headers: headers(true),
      body:    JSON.stringify({ roomName, private: isPrivate }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || `Create failed (HTTP ${res.status})`);
    return data; // { name, url, privacy, created_at, domain }
  },

  // ── End / delete meeting ──────────────────────────────────────────────────
  async endMeeting(code) {
    try {
      const res = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}`, {
        method: 'DELETE', headers: headers(true),
      });
      return res.ok;
    } catch (err) {
      console.error('❌ [MeetingSession] endMeeting error:', err.message);
      return false;
    }
  },

  // ── Restart meeting ───────────────────────────────────────────────────────
  async restartMeeting(code) {
    await this.endMeeting(code).catch(() => {});
    return this.createMeeting(code, false);
  },

  // ── Presence ──────────────────────────────────────────────────────────────
  async getPresence(code) {
    try {
      const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/presence`, { headers: headers(true) });
      return await res.json();
    } catch { return {}; }
  },

  // ── Eject ─────────────────────────────────────────────────────────────────
  async ejectParticipants(code, participantIds) {
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/eject`, {
      method: 'POST', headers: headers(true), body: JSON.stringify({ participantIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Eject failed');
    return data;
  },

  // ── Message ───────────────────────────────────────────────────────────────
  async sendMessage(code, messageData, recipient = null) {
    const body = { data: messageData };
    if (recipient) body.recipient = recipient;
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/message`, {
      method: 'POST', headers: headers(true), body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Message send failed');
    return data;
  },

  // ── Recording ─────────────────────────────────────────────────────────────
  async startRecording(code) {
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/recording/start`, { method: 'POST', headers: headers(true) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Start recording failed');
    return data;
  },
  async stopRecording(code) {
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/recording/stop`, { method: 'POST', headers: headers(true) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Stop recording failed');
    return data;
  },

  // ── Meeting history ───────────────────────────────────────────────────────
  async listMeetings(limit = 50, room = null) {
    const params = new URLSearchParams({ limit });
    if (room) params.set('room', room);
    try {
      const res  = await fetch(`${BACKEND_API}/meetings?${params}`, { headers: headers(true) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'List failed');
      return Array.isArray(data) ? data : (data.data || []);
    } catch (err) {
      console.error('❌ [MeetingSession] listMeetings error:', err.message);
      return [];
    }
  },

  // ── Utilities ─────────────────────────────────────────────────────────────
  canJoinMeeting() { return TokenService.isAuthenticated() || this.getUser() !== null; },

  getUserDisplayName() {
    const user = this.getUser();
    if (user?.name)  return user.name;
    if (user?.email) return user.email.split('@')[0];
    const token = TokenService.getAccessToken();
    if (token) {
      try {
        const p = JSON.parse(atob(token.split('.')[1]));
        return p.name || p.firstName || p.sub?.split('@')[0] || 'User';
      } catch { return 'User'; }
    }
    return 'Guest';
  },

  getUserInitials() {
    const name  = this.getUserDisplayName();
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.charAt(0).toUpperCase();
  },

  saveRecentMeeting(code, title) {
    try {
      const recent   = JSON.parse(sessionStorage.getItem('nova_recent') || '[]');
      const filtered = recent.filter(r => r.code !== code);
      filtered.unshift({ code, title, date: new Date().toLocaleDateString(), timestamp: Date.now() });
      sessionStorage.setItem('nova_recent', JSON.stringify(filtered.slice(0, 10)));
    } catch (err) { console.error('saveRecentMeeting error:', err); }
  },

  getRecentMeetings() {
    try { return JSON.parse(sessionStorage.getItem('nova_recent') || '[]'); } catch { return []; }
  },

  clearMeetingData() {
    this.clearMeetingCode();
    this.clearIsHost();
    this.clearJitsiRoom();
    sessionStorage.removeItem('nova_meeting_title');
  },

  clearAll() {
    this.clearMeetingData();
    this.clearUser();
    sessionStorage.removeItem('nova_recent');
  },
};

export default MeetingSession;
