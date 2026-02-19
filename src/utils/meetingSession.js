// utils/meetingSession.js
// Session manager aligned to MeetingController endpoints:
//
//  PUBLIC
//    GET  /api/meetings/{code}                   → room info (lobby)
//    GET  /api/meetings/validate/{token}          → validate daily token
//    POST /api/meetings/join/guest               → guest join + token
//      body: { roomCode, displayName }
//
//  AUTHENTICATED
//    POST   /api/meetings/create                 → create room
//      body: { roomName, private }
//    POST   /api/meetings/{code}/token           → get Daily token
//      body: { isOwner }
//    DELETE /api/meetings/{code}                 → end / delete room
//    GET    /api/meetings/{code}/presence        → live participants
//    GET    /api/meetings?limit=N&room=X         → meeting history
//    POST   /api/meetings/{code}/eject           → eject participants
//      body: { participantIds: [] }
//    POST   /api/meetings/{code}/message         → in-call message
//      body: { data, recipient }
//    POST   /api/meetings/{code}/recording/start → start recording
//    POST   /api/meetings/{code}/recording/stop  → stop recording
//
//  NOTE: Backend returns objects DIRECTLY via ResponseEntity.ok(object).
//        There is NO { success, data, message } wrapper — read fields from
//        the parsed JSON root, not from data.data.

import { TokenService } from '@/utils/apiService';

const BACKEND_API = 'https://nova-test-ctne.onrender.com/api';

// ─── Shared fetch helper ──────────────────────────────────────────────────────
function headers(requiresAuth = true) {
  const jwt = TokenService.getAccessToken();
  const h   = {
    'Content-Type':               'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (jwt) h['Authorization'] = `Bearer ${jwt}`;
  else if (requiresAuth) console.warn('⚠️ [MeetingSession] No JWT for authenticated call');
  return h;
}

export const MeetingSession = {

  // ═══════════════════════════════════════════════════════
  //  MEETING CODE
  // ═══════════════════════════════════════════════════════

  setMeetingCode(code)  { sessionStorage.setItem('nova_meeting_code', code); },
  getMeetingCode()      { return sessionStorage.getItem('nova_meeting_code'); },
  clearMeetingCode()    { sessionStorage.removeItem('nova_meeting_code'); },

  // ═══════════════════════════════════════════════════════
  //  HOST FLAG
  // ═══════════════════════════════════════════════════════

  setIsHost(v)          { sessionStorage.setItem('nova_is_host', v ? 'true' : 'false'); },
  isHost()              { return sessionStorage.getItem('nova_is_host') === 'true'; },
  clearIsHost()         { sessionStorage.removeItem('nova_is_host'); },

  // ═══════════════════════════════════════════════════════
  //  GUEST USER
  // ═══════════════════════════════════════════════════════

  setGuestUser(name, email = null) {
    sessionStorage.setItem('nova_user', JSON.stringify({ name, email, isGuest: true, id: null }));
  },

  getUser() {
    try {
      const raw = sessionStorage.getItem('nova_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  clearUser()     { sessionStorage.removeItem('nova_user'); },
  isGuestUser()   { return !!(this.getUser()?.isGuest); },

  // ═══════════════════════════════════════════════════════
  //  DAILY ROOM CACHE
  // ═══════════════════════════════════════════════════════

  setDailyRoom(roomUrl, roomName) {
    if (roomUrl)  sessionStorage.setItem('nova_daily_room', roomUrl);
    if (roomName) sessionStorage.setItem('nova_daily_name', roomName);
  },

  getDailyRoom() {
    return {
      roomUrl:  sessionStorage.getItem('nova_daily_room') || null,
      roomName: sessionStorage.getItem('nova_daily_name') || null,
    };
  },

  setDailyToken(t)   { if (t) sessionStorage.setItem('nova_daily_token', t); },
  getDailyToken()    { return sessionStorage.getItem('nova_daily_token') || null; },

  clearDailyRoom() {
    sessionStorage.removeItem('nova_daily_room');
    sessionStorage.removeItem('nova_daily_name');
    sessionStorage.removeItem('nova_daily_token');
  },

  // ═══════════════════════════════════════════════════════
  //  FETCH DAILY TOKEN
  //
  //  Authenticated → POST /api/meetings/{code}/token
  //    body: { isOwner }
  //    response: { token, roomUrl, roomName, isOwner }   ← direct, no wrapper
  //
  //  Guest → POST /api/meetings/join/guest
  //    body: { roomCode, displayName }
  //    response: { token, roomUrl, roomName }             ← direct, no wrapper
  // ═══════════════════════════════════════════════════════

  async fetchDailyToken(meetingCode, isOwner = false) {
    try {
      const isAuth = TokenService.isAuthenticated();

      let url, body;

      if (isAuth) {
        // ── Authenticated: POST /api/meetings/{code}/token ──
        url  = `${BACKEND_API}/meetings/${encodeURIComponent(meetingCode)}/token`;
        body = JSON.stringify({ isOwner });
        console.log('🔑 [MeetingSession] Fetching auth token:', url);
      } else {
        // ── Guest: POST /api/meetings/join/guest ────────────
        const guest       = this.getUser();
        const displayName = guest?.name || 'Guest';
        url  = `${BACKEND_API}/meetings/join/guest`;
        body = JSON.stringify({ roomCode: meetingCode, displayName });
        console.log('🔑 [MeetingSession] Fetching guest token:', url, '| name:', displayName);
      }

      const res  = await fetch(url, { method: 'POST', headers: headers(isAuth), body });

      // Backend returns the object directly — no { success, data } wrapper
      const data = await res.json();

      if (!res.ok) {
        console.warn('⚠️ [MeetingSession] Token error:', data.message || data.error || res.status);
        return null;
      }

      // data IS the token object: { token, roomUrl, roomName, isOwner }
      const td = data;

      if (!td.roomUrl) {
        console.error('❌ [MeetingSession] Token response missing roomUrl:', td);
        return null;
      }

      // Cache for quick reconnect
      this.setDailyRoom(td.roomUrl, td.roomName);
      if (td.token) this.setDailyToken(td.token);

      console.log('✅ [MeetingSession] Token received:', isAuth ? '(auth)' : '(guest)', td);
      return td; // { token, roomUrl, roomName, isOwner }

    } catch (err) {
      console.error('❌ [MeetingSession] fetchDailyToken error:', err.message);
      return null;
    }
  },

  // ═══════════════════════════════════════════════════════
  //  VALIDATE MEETING CODE
  //  GET /api/meetings/{code}  (public)
  //  Response: { name, url, privacy, created_at }  ← direct, no wrapper
  // ═══════════════════════════════════════════════════════

  async validateMeetingCode(code) {
    try {
      const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      // 404 → room does not exist
      if (res.status === 404) {
        return { valid: false, meeting: null, message: 'Meeting not found.' };
      }

      // Backend returns safe fields directly: { name, url, privacy, created_at }
      const data = await res.json();
      return {
        valid:   res.ok,
        meeting: res.ok ? data : null,
        message: res.ok ? null : (data.message || data.error || 'Unknown error'),
      };
    } catch {
      return { valid: false, meeting: null, message: 'Could not reach server.' };
    }
  },

  // ═══════════════════════════════════════════════════════
  //  JOIN MEETING (backend registration)
  //  Delegates to fetchDailyToken for both auth + guest flows.
  // ═══════════════════════════════════════════════════════

  async joinMeeting(meetingCode) {
    return this.fetchDailyToken(meetingCode, false);
  },

  // ═══════════════════════════════════════════════════════
  //  CREATE MEETING
  //  POST /api/meetings/create
  //  body: { roomName, private }
  //  Response: full Daily room object { name, url, privacy, created_at, ... }
  //            returned DIRECTLY — no { success, data } wrapper
  // ═══════════════════════════════════════════════════════

  async createMeeting(roomName, isPrivate = false) {
    const res  = await fetch(`${BACKEND_API}/meetings/create`, {
      method:  'POST',
      headers: headers(true),
      body:    JSON.stringify({ roomName, private: isPrivate }),
    });

    // Backend returns the Daily room object directly
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || `Create failed (HTTP ${res.status})`);
    }

    // data IS the room: { name, url, privacy, created_at, ... }
    if (!data.name) {
      console.warn('⚠️ [MeetingSession] createMeeting response missing "name":', data);
    }

    return data;
  },

  // ═══════════════════════════════════════════════════════
  //  END / DELETE MEETING
  //  DELETE /api/meetings/{code}
  //  Response: { deleted: true, name: "..." }  ← direct, no wrapper
  // ═══════════════════════════════════════════════════════

  async endMeeting(code) {
    try {
      const res = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}`, {
        method:  'DELETE',
        headers: headers(true),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('⚠️ [MeetingSession] End meeting returned:', res.status, err);
      }
      return res.ok;
    } catch (err) {
      console.error('❌ [MeetingSession] endMeeting error:', err.message);
      return false;
    }
  },

  // ═══════════════════════════════════════════════════════
  //  RESTART MEETING
  //  No dedicated restart endpoint — end then create fresh room
  //  with same name. Returns new room data.
  // ═══════════════════════════════════════════════════════

  async restartMeeting(code) {
    await this.endMeeting(code).catch(() => {});
    return this.createMeeting(code, false);
  },

  // ═══════════════════════════════════════════════════════
  //  PRESENCE
  //  GET /api/meetings/{code}/presence
  //  Response: presence object (Daily API passthrough)
  // ═══════════════════════════════════════════════════════

  async getPresence(code) {
    try {
      const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/presence`, {
        headers: headers(true),
      });
      const data = await res.json();
      // Daily presence shape: { data: [...] } or similar — return as-is
      return data || [];
    } catch { return []; }
  },

  // ═══════════════════════════════════════════════════════
  //  EJECT PARTICIPANTS
  //  POST /api/meetings/{code}/eject
  //  body: { participantIds: string[] }
  //  Response: { ejected: N }  ← direct, no wrapper
  // ═══════════════════════════════════════════════════════

  async ejectParticipants(code, participantIds) {
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/eject`, {
      method:  'POST',
      headers: headers(true),
      body:    JSON.stringify({ participantIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Eject failed');
    return data; // { ejected: N }
  },

  // ═══════════════════════════════════════════════════════
  //  IN-CALL MESSAGE
  //  POST /api/meetings/{code}/message
  //  body: { data: object, recipient?: string }
  //  Response: { sent: true }  ← direct, no wrapper
  // ═══════════════════════════════════════════════════════

  async sendMessage(code, messageData, recipient = null) {
    const body = { data: messageData };
    if (recipient) body.recipient = recipient;
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/message`, {
      method:  'POST',
      headers: headers(true),
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Message send failed');
    return data; // { sent: true }
  },

  // ═══════════════════════════════════════════════════════
  //  RECORDING
  //  POST /api/meetings/{code}/recording/start
  //  Response: { recording: "started", room: "..." }  ← direct
  //
  //  POST /api/meetings/{code}/recording/stop
  //  Response: { recording: "stopped", room: "..." }  ← direct
  // ═══════════════════════════════════════════════════════

  async startRecording(code) {
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/recording/start`, {
      method:  'POST',
      headers: headers(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Start recording failed');
    return data; // { recording: "started", room: "..." }
  },

  async stopRecording(code) {
    const res  = await fetch(`${BACKEND_API}/meetings/${encodeURIComponent(code)}/recording/stop`, {
      method:  'POST',
      headers: headers(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Stop recording failed');
    return data; // { recording: "stopped", room: "..." }
  },

  // ═══════════════════════════════════════════════════════
  //  MEETING HISTORY
  //  GET /api/meetings?limit=N&room=X
  //  Response: Daily meetings object (passthrough)
  // ═══════════════════════════════════════════════════════

  async listMeetings(limit = 50, room = null) {
    const params = new URLSearchParams({ limit });
    if (room) params.set('room', room);
    try {
      const res  = await fetch(`${BACKEND_API}/meetings?${params}`, { headers: headers(true) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'List failed');
      // Daily returns { total_count, data: [...] } — handle both shapes
      return Array.isArray(data) ? data : (data.data || data.meetings || []);
    } catch (err) {
      console.error('❌ [MeetingSession] listMeetings error:', err.message);
      return [];
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
  // ═══════════════════════════════════════════════════════

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
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.charAt(0).toUpperCase();
  },

  // ═══════════════════════════════════════════════════════
  //  RECENT MEETINGS
  // ═══════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════
  //  CLEANUP
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