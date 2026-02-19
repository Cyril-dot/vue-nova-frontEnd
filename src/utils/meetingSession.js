// utils/meetingSession.js
// Vue-compatible session manager — updated to match MeetingController endpoints:
//   POST /api/meetings/daily-token         (authenticated)
//   POST /api/meetings/daily-token/guest   (guests — requires meetingCode + guestName)
//   POST /api/meetings/join                (authenticated)
//   POST /api/meetings/join/guest          (guests — requires meetingCode + guestName + guestEmail?)
//   POST /api/meetings/create
//   POST /api/meetings/start/:code
//   POST /api/meetings/end/:code
//   GET  /api/meetings/validate/:code

import { TokenService } from '@/utils/apiService';

const BACKEND_API = 'https://nova-test-ctne.onrender.com/api';

export const MeetingSession = {

  // ═══════════════════════════════════════════════════════
  //  MEETING CODE
  // ═══════════════════════════════════════════════════════

  setMeetingCode(code) {
    sessionStorage.setItem('nova_meeting_code', code);
  },

  getMeetingCode() {
    return sessionStorage.getItem('nova_meeting_code');
  },

  clearMeetingCode() {
    sessionStorage.removeItem('nova_meeting_code');
  },

  // ═══════════════════════════════════════════════════════
  //  HOST FLAG
  //  Tracks whether the current user created/started the
  //  meeting — used to show host-only controls (End, Restart)
  //  and to set is_owner=true in the Daily token request.
  // ═══════════════════════════════════════════════════════

  setIsHost(value) {
    sessionStorage.setItem('nova_is_host', value ? 'true' : 'false');
  },

  isHost() {
    return sessionStorage.getItem('nova_is_host') === 'true';
  },

  clearIsHost() {
    sessionStorage.removeItem('nova_is_host');
  },

  // ═══════════════════════════════════════════════════════
  //  GUEST USER
  //  Stored when a non-authenticated user joins via
  //  POST /api/meetings/join/guest or
  //  POST /api/meetings/daily-token/guest
  //  Fields: { name, email, isGuest: true, id: null }
  // ═══════════════════════════════════════════════════════

  setGuestUser(name, email = null) {
    const guestUser = {
      name,
      email,
      isGuest: true,
      id: null,
    };
    sessionStorage.setItem('nova_user', JSON.stringify(guestUser));
  },

  getUser() {
    try {
      const raw = sessionStorage.getItem('nova_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearUser() {
    sessionStorage.removeItem('nova_user');
  },

  /** Returns true if user is a guest (not JWT-authenticated) */
  isGuestUser() {
    const user = this.getUser();
    return !!(user?.isGuest);
  },

  // ═══════════════════════════════════════════════════════
  //  DAILY ROOM CACHE
  //  The backend returns { roomUrl, roomName } inside the
  //  DailyTokenResponseDTO. We cache these so Meeting.vue
  //  doesn't need to re-fetch on reconnect.
  // ═══════════════════════════════════════════════════════

  setDailyRoom(roomUrl, roomName) {
    if (roomUrl)  sessionStorage.setItem('nova_daily_room', roomUrl);
    if (roomName) sessionStorage.setItem('nova_daily_name', roomName);
  },

  getDailyRoom() {
    return {
      roomUrl:  sessionStorage.getItem('nova_daily_room')  || null,
      roomName: sessionStorage.getItem('nova_daily_name') || null,
    };
  },

  setDailyToken(token) {
    if (token) sessionStorage.setItem('nova_daily_token', token);
  },

  getDailyToken() {
    return sessionStorage.getItem('nova_daily_token') || null;
  },

  clearDailyRoom() {
    sessionStorage.removeItem('nova_daily_room');
    sessionStorage.removeItem('nova_daily_name');
    sessionStorage.removeItem('nova_daily_token');
  },

  // ═══════════════════════════════════════════════════════
  //  DAILY TOKEN FETCH
  //  Calls the backend instead of Daily's API directly so
  //  the API key never reaches the browser.
  //
  //  Authenticated → POST /api/meetings/daily-token
  //    body: { meetingCode }
  //
  //  Guest         → POST /api/meetings/daily-token/guest
  //    body: { meetingCode, guestName, guestEmail? }
  //
  //  Returns DailyTokenResponseDTO:
  //    { token, roomUrl, roomName, meetingCode, isOwner }
  // ═══════════════════════════════════════════════════════

  async fetchDailyToken(meetingCode) {
    try {
      const isAuth  = TokenService.isAuthenticated();
      const jwt     = TokenService.getAccessToken();
      const headers = {
        'Content-Type':               'application/json',
        'ngrok-skip-browser-warning': 'true',
      };
      if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

      let endpoint, body;

      if (isAuth) {
        // ── Authenticated path ──────────────────────────
        endpoint = `${BACKEND_API}/meetings/daily-token`;
        body     = JSON.stringify({ meetingCode });
      } else {
        // ── Guest path ──────────────────────────────────
        const guestUser  = this.getUser();
        const guestName  = guestUser?.name  || 'Guest';
        const guestEmail = guestUser?.email || null;

        endpoint = `${BACKEND_API}/meetings/daily-token/guest`;
        body     = JSON.stringify({ meetingCode, guestName, guestEmail });
      }

      const res  = await fetch(endpoint, { method: 'POST', headers, body });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        console.warn('⚠️ Daily token backend error:', data.message || res.status);
        return null;
      }

      const tokenData = data.data; // { token, roomUrl, roomName, meetingCode, isOwner }

      // Cache room info so Meeting.vue can reconnect without a new fetch
      this.setDailyRoom(tokenData.roomUrl, tokenData.roomName);
      if (tokenData.token) this.setDailyToken(tokenData.token);

      console.log('✅ Daily token received from backend:', isAuth ? '(authenticated)' : '(guest)');
      return tokenData;

    } catch (err) {
      console.warn('❌ fetchDailyToken error:', err.message);
      return null;
    }
  },

  // ═══════════════════════════════════════════════════════
  //  VALIDATE MEETING CODE
  //  Calls GET /api/meetings/validate/:code (public endpoint)
  //  before joining — lets the UI show a friendly error if the
  //  code is wrong instead of failing inside the Daily room.
  //
  //  Returns: { valid: boolean, meeting?: { title, status, ... } }
  // ═══════════════════════════════════════════════════════

  async validateMeetingCode(code) {
    try {
      const res  = await fetch(`${BACKEND_API}/meetings/validate/${encodeURIComponent(code)}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const data = await res.json();
      return {
        valid:   res.ok && data.success !== false,
        meeting: data.data || null,
        message: data.message || null,
      };
    } catch {
      return { valid: false, meeting: null, message: 'Could not reach server.' };
    }
  },

  // ═══════════════════════════════════════════════════════
  //  JOIN MEETING (backend registration)
  //  Records the participant in your DB before entering Daily.
  //
  //  Authenticated → POST /api/meetings/join
  //    body: { meetingCode }
  //
  //  Guest         → POST /api/meetings/join/guest
  //    body: { meetingCode, guestName, guestEmail? }
  // ═══════════════════════════════════════════════════════

  async joinMeeting(meetingCode) {
    try {
      const isAuth = TokenService.isAuthenticated();
      const jwt    = TokenService.getAccessToken();
      const headers = {
        'Content-Type':               'application/json',
        'ngrok-skip-browser-warning': 'true',
      };
      if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

      let endpoint, body;

      if (isAuth) {
        endpoint = `${BACKEND_API}/meetings/join`;
        body     = JSON.stringify({ meetingCode });
      } else {
        const guestUser  = this.getUser();
        const guestName  = guestUser?.name  || 'Guest';
        const guestEmail = guestUser?.email || null;
        endpoint = `${BACKEND_API}/meetings/join/guest`;
        body     = JSON.stringify({ meetingCode, guestName, guestEmail });
      }

      const res  = await fetch(endpoint, { method: 'POST', headers, body });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Join failed (HTTP ${res.status})`);
      }

      return data.data || data;
    } catch (err) {
      console.error('❌ joinMeeting error:', err.message);
      throw err;
    }
  },

  // ═══════════════════════════════════════════════════════
  //  CAN JOIN
  // ═══════════════════════════════════════════════════════

  canJoinMeeting() {
    return TokenService.isAuthenticated() || this.getUser() !== null;
  },

  // ═══════════════════════════════════════════════════════
  //  USER DISPLAY NAME
  //  Priority: sessionStorage guest name → JWT payload → fallback
  // ═══════════════════════════════════════════════════════

  getUserDisplayName() {
    const user = this.getUser();
    if (user?.name)  return user.name;
    if (user?.email) return user.email.split('@')[0];

    const token = TokenService.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name
          || payload.firstName
          || payload.sub?.split('@')[0]
          || 'User';
      } catch {
        return 'User';
      }
    }

    return 'Guest';
  },

  getUserInitials() {
    const name  = this.getUserDisplayName();
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  },

  // ═══════════════════════════════════════════════════════
  //  RECENT MEETINGS
  //  Stored in sessionStorage — survives navigation within tab.
  // ═══════════════════════════════════════════════════════

  saveRecentMeeting(code, title) {
    try {
      const recent   = JSON.parse(sessionStorage.getItem('nova_recent') || '[]');
      const filtered = recent.filter(r => r.code !== code); // deduplicate
      filtered.unshift({ code, title, date: new Date().toLocaleDateString(), timestamp: Date.now() });
      sessionStorage.setItem('nova_recent', JSON.stringify(filtered.slice(0, 10)));
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

  // ═══════════════════════════════════════════════════════
  //  CLEANUP
  //  clearMeetingData() — call when leaving a meeting.
  //    Clears code, host flag, Daily cache.
  //    Keeps nova_user + nova_recent (useful across meetings).
  //
  //  clearAll() — full reset (logout / new user).
  // ═══════════════════════════════════════════════════════

  clearMeetingData() {
    this.clearMeetingCode();
    this.clearIsHost();
    this.clearDailyRoom();
    sessionStorage.removeItem('nova_meeting_title');
  },

  clearAll() {
    this.clearMeetingData();
    this.clearUser();
    sessionStorage.removeItem('nova_recent');
  },
};

export default MeetingSession;