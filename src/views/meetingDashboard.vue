<template>
  <div class="md-shell">

    <!-- Sidebar -->
    <aside class="md-sidebar">
      <div class="md-sb-top">
        <div class="md-sb-brand">
          <div class="md-sb-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="md-sb-name">Nova<span class="md-sb-accent">Meet</span></span>
        </div>

        <nav class="md-sb-nav">
          <div class="md-nav-section">NAVIGATION</div>
          <button class="md-nav-item md-nav-item--active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
            Meetings
            <span v-if="activeMeetings.length" class="md-nav-badge">{{ activeMeetings.length }}</span>
          </button>
          <button class="md-nav-item" @click="$router.push('/dashboard')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
        </nav>
      </div>

      <div class="md-sb-footer">
        <div class="md-sb-stats">
          <div class="md-stat">
            <span class="md-stat-val">{{ allMeetings.length }}</span>
            <span class="md-stat-lbl">Total</span>
          </div>
          <div class="md-stat-sep"></div>
          <div class="md-stat">
            <span class="md-stat-val md-stat-val--live">{{ activeMeetings.length }}</span>
            <span class="md-stat-lbl">Live</span>
          </div>
          <div class="md-stat-sep"></div>
          <div class="md-stat">
            <span class="md-stat-val">{{ privateCount }}</span>
            <span class="md-stat-lbl">Private</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="md-main">

      <!-- Header -->
      <header class="md-header">
        <div class="md-header-left">
          <h1 class="md-page-title">Video Meetings</h1>
          <p class="md-page-sub">Manage your rooms and monitor live activity</p>
        </div>
        <div class="md-header-actions">
          <button class="md-btn-ghost" @click="$router.push('/meetings/join')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            Join meeting
          </button>
          <button class="md-btn-primary" @click="createMeeting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New meeting
          </button>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="md-center">
        <div class="md-loader-wrap">
          <div class="md-loader-ring"></div>
          <p class="md-loader-text">Loading your meetings…</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="md-center">
        <div class="md-error-box">
          <div class="md-error-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p class="md-error-text">{{ error }}</p>
          <button class="md-btn-primary" @click="fetchMeetingsData">Try again</button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="md-content">

        <!-- KPI strip -->
        <div class="md-kpi-grid">
          <div class="md-kpi">
            <div class="md-kpi-icon md-kpi-icon--blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
            </div>
            <div>
              <div class="md-kpi-num">{{ allMeetings.length }}</div>
              <div class="md-kpi-lbl">Total Rooms</div>
            </div>
          </div>
          <div class="md-kpi" :class="{ 'md-kpi--live': activeMeetings.length }">
            <div class="md-kpi-icon md-kpi-icon--red">
              <span v-if="activeMeetings.length" class="md-kpi-ring"></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
            </div>
            <div>
              <div class="md-kpi-num">{{ activeMeetings.length }}</div>
              <div class="md-kpi-lbl">Live Now</div>
            </div>
          </div>
          <div class="md-kpi">
            <div class="md-kpi-icon md-kpi-icon--purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <div class="md-kpi-num">{{ privateCount }}</div>
              <div class="md-kpi-lbl">Private Rooms</div>
            </div>
          </div>
          <div class="md-kpi">
            <div class="md-kpi-icon md-kpi-icon--orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div>
              <div class="md-kpi-num">{{ recentCount }}</div>
              <div class="md-kpi-lbl">This Week</div>
            </div>
          </div>
        </div>

        <!-- Active rooms banner -->
        <div v-if="activeMeetings.length" class="md-live-banner">
          <div class="md-live-banner-hd">
            <div class="md-live-indicator">
              <span class="md-live-dot"></span>
              {{ activeMeetings.length }} Active Meeting{{ activeMeetings.length > 1 ? 's' : '' }}
            </div>
          </div>
          <div class="md-live-list">
            <div v-for="m in activeMeetings" :key="m.name" class="md-live-row">
              <span class="md-live-pulse"></span>
              <div class="md-live-info">
                <span class="md-live-name">{{ m.name }}</span>
                <span class="md-live-meta">{{ getRelativeTime(m.created_at) }} · {{ m.privacy || 'public' }}</span>
              </div>
              <div class="md-live-btns">
                <button class="md-live-join" @click="joinMeetingWithCode(m.name)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Join
                </button>
                <button class="md-live-end" @click="promptEnd(m)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                  End
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="md-toolbar">
          <div class="md-tabs">
            <button v-for="tab in tabs" :key="tab.value"
              class="md-tab" :class="{ 'md-tab--active': activeFilter === tab.value }"
              @click="activeFilter = tab.value">
              {{ tab.label }}
              <span class="md-tab-count" :class="{ 'md-tab-count--on': activeFilter === tab.value }">{{ tab.count }}</span>
            </button>
          </div>
          <div class="md-toolbar-right">
            <div class="md-search">
              <svg class="md-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input class="md-search-input" v-model="search" placeholder="Search rooms…" />
            </div>
            <button class="md-refresh" @click="fetchMeetingsData" :class="{ 'md-refresh--spin': loading }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="filteredMeetings.length === 0" class="md-empty">
          <div class="md-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
          </div>
          <p class="md-empty-title">No meetings found</p>
          <p class="md-empty-sub">Create your first meeting to get started.</p>
          <button class="md-btn-primary" @click="createMeeting">Create meeting</button>
        </div>

        <!-- Room grid -->
        <div v-else class="md-room-grid">
          <div v-for="m in filteredMeetings" :key="m.name" class="md-room-card" :class="{ 'md-room-card--live': isRoomActive(m) }">
            <div class="md-room-top">
              <div class="md-room-status-row">
                <span class="md-room-pill" :class="isRoomActive(m) ? 'md-room-pill--live' : m.privacy === 'private' ? 'md-room-pill--private' : 'md-room-pill--public'">
                  <span v-if="isRoomActive(m)" class="md-pill-blink"></span>
                  {{ isRoomActive(m) ? 'Live' : m.privacy === 'private' ? 'Private' : 'Public' }}
                </span>
                <span class="md-room-time">{{ formatRoomTime(m) }}</span>
              </div>
              <h3 class="md-room-name">{{ m.name }}</h3>
              <div class="md-room-code-row" @click="copyCode(m.name)" title="Copy room code">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                <code class="md-room-code">{{ m.name }}</code>
              </div>
            </div>
            <div class="md-room-foot">
              <button class="md-room-join" @click="joinMeetingWithCode(m.name)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Join
              </button>
              <button class="md-room-icon-btn md-room-icon-btn--amber" @click="promptRestart(m)" title="Restart">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
              </button>
              <button class="md-room-icon-btn md-room-icon-btn--red" @click="promptEnd(m)" title="Delete">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- End Modal -->
    <transition name="md-modal">
      <div v-if="modal.show && modal.type === 'end'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          </div>
          <h2 class="md-modal-title">Delete "{{ modal.meeting?.name }}"?</h2>
          <p class="md-modal-body">This room will be permanently removed and all participants disconnected.</p>
          <div class="md-modal-actions">
            <button class="md-btn-ghost" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-btn-danger" @click="confirmEnd" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-spinner"></span>
              Delete room
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Restart Modal -->
    <transition name="md-modal">
      <div v-if="modal.show && modal.type === 'restart'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
          </div>
          <h2 class="md-modal-title">Restart "{{ modal.meeting?.name }}"?</h2>
          <p class="md-modal-body">The room will be deleted then re-created. Participants can rejoin with the same code.</p>
          <div class="md-modal-actions">
            <button class="md-btn-ghost" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-btn-amber" @click="confirmRestart" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-spinner"></span>
              Restart meeting
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="md-toast">
      <div v-if="toast.show" class="md-toast" :class="'md-toast--' + toast.type">
        <svg v-if="toast.type === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { TokenService, apiRequest } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

export default {
  name: 'MeetingsDashboard',
  data() {
    return {
      loading: true, error: null, allMeetings: [], activeMeetings: [],
      activeFilter: 'all', search: '',
      modal: { show: false, type: null, meeting: null, loading: false },
      toast: { show: false, message: '', type: 'success' },
    };
  },
  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
    privateCount()    { return this.allMeetings.filter(m => m.privacy === 'private').length; },
    recentCount() {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return this.allMeetings.filter(m => m.created_at && new Date(m.created_at) > cutoff).length;
    },
    tabs() {
      const all = this.allMeetings.length;
      const priv = this.privateCount;
      return [
        { label: 'All',     value: 'all',     count: all },
        { label: 'Live',    value: 'live',    count: this.activeMeetings.length },
        { label: 'Public',  value: 'public',  count: all - priv },
        { label: 'Private', value: 'private', count: priv },
      ];
    },
    filteredMeetings() {
      let list = [...this.allMeetings];
      if (this.activeFilter === 'live')    list = list.filter(m => m.active === true);
      if (this.activeFilter === 'public')  list = list.filter(m => m.privacy !== 'private');
      if (this.activeFilter === 'private') list = list.filter(m => m.privacy === 'private');
      if (this.search) { const q = this.search.toLowerCase(); list = list.filter(m => (m.name || '').toLowerCase().includes(q)); }
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
  },
  methods: {
    async fetchMeetingsData() {
      this.loading = true; this.error = null;
      try {
        if (!TokenService.getAccessToken()) { this.$router.push('/auth'); return; }
        const res = await apiRequest('/meetings?limit=100', { method: 'GET' });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const body = await res.json();
        let raw = Array.isArray(body) ? body : (body.data || body.rooms || []);
        this.allMeetings = raw;
        this.activeMeetings = raw.filter(m => m.active === true);
      } catch (e) {
        console.error('[MeetingsDashboard]', e);
        this.error = 'Failed to load meetings. Please try again.';
      } finally { this.loading = false; }
    },

    isRoomActive(m)   { return m.active === true; },
    formatRoomTime(m) { return m.created_at ? this.getRelativeTime(m.created_at) : ''; },
    createMeeting()   { sessionStorage.removeItem('nova_meeting_code'); this.$router.push({ path: '/meeting', query: { create: 'true' } }); },

    joinMeetingWithCode(code) {
      MeetingSession.setMeetingCode(code); MeetingSession.setIsHost(false);
      this.$router.push('/meeting');
    },

    copyCode(code) {
      navigator.clipboard.writeText(code)
        .then(() => this.showToast('Code copied!', 'success'))
        .catch(() => this.showToast('Copy failed', 'error'));
    },

    promptEnd(m)     { this.modal = { show: true, type: 'end',     meeting: m, loading: false }; },
    promptRestart(m) { this.modal = { show: true, type: 'restart', meeting: m, loading: false }; },
    closeModal()     { this.modal = { show: false, type: null, meeting: null, loading: false }; },

    async confirmEnd() {
      this.modal.loading = true;
      const code = this.modal.meeting.name;
      try {
        const res = await apiRequest(`/meetings/${encodeURIComponent(code)}`, { method: 'DELETE' });
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || `Delete failed (${res.status})`); }
        this.allMeetings = this.allMeetings.filter(m => m.name !== code);
        this.activeMeetings = this.activeMeetings.filter(m => m.name !== code);
        this.showToast(`"${code}" deleted`, 'success');
      } catch (e) { this.showToast('Failed: ' + e.message, 'error'); }
      finally { this.modal.loading = false; this.closeModal(); }
    },

    async confirmRestart() {
      this.modal.loading = true;
      const m = this.modal.meeting;
      try {
        await apiRequest(`/meetings/${encodeURIComponent(m.name)}`, { method: 'DELETE' }).catch(() => {});
        await apiRequest('/meetings/create', { method: 'POST', body: JSON.stringify({ roomName: m.name, private: m.privacy === 'private' }) });
        this.showToast(`"${m.name}" restarted!`, 'success');
        setTimeout(() => this.fetchMeetingsData(), 600);
      } catch (e) { this.showToast('Failed: ' + e.message, 'error'); }
      finally { this.modal.loading = false; this.closeModal(); }
    },

    getRelativeTime(ds) {
      if (!ds) return '';
      const d = Math.floor((Date.now() - new Date(ds)) / 1000);
      if (d < 60) return 'just now';
      if (d < 3600) return `${Math.floor(d/60)}m ago`;
      if (d < 86400) return `${Math.floor(d/3600)}h ago`;
      return `${Math.floor(d/86400)}d ago`;
    },

    showToast(msg, type = 'success') {
      this.toast = { show: true, message: msg, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    },
  },
  mounted() {
    if (!this.isAuthenticated) { this.$router.push('/auth'); return; }
    this.fetchMeetingsData();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

.md-shell {
  --blue:      #4a90e2;
  --blue-dk:   #2c6fbd;
  --blue-soft: #e8f2fc;
  --blue-mid:  #c9dff5;
  --blue-glow: rgba(74,144,226,0.18);
  --ink:       #0d1b36;
  --ink-s:     #2d3748;
  --ink-m:     #64748b;
  --white:     #ffffff;
  --border:    #e2ecf6;
  --bg:        #f8fafc;
  --purple:    #8b5cf6;
  --purple-s:  #f5f3ff;
  --green:     #10b981;
  --red:       #ef4444;
  --orange:    #f59e0b;
  --font:      'Manrope', sans-serif;
  --fdisp:     'Space Grotesk', sans-serif;
  --r:         10px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.1);
  --sidebar-w: 240px;
  --bar-h:     64px;

  font-family: var(--font);
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  grid-template-rows: 1fr;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Sidebar ──────────────────────────── */
.md-sidebar {
  background: var(--white); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; justify-content: space-between;
  position: sticky; top: 0; height: 100vh; overflow-y: auto;
}
.md-sb-top { display: flex; flex-direction: column; }
.md-sb-brand { display: flex; align-items: center; gap: 10px; padding: 20px 18px 18px; border-bottom: 1px solid var(--border); }
.md-sb-logo { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, var(--blue), #6366f1); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px var(--blue-glow); flex-shrink: 0; }
.md-sb-name { font-family: var(--fdisp); font-size: 16px; font-weight: 700; color: var(--ink); }
.md-sb-accent { color: var(--blue); }

.md-sb-nav { padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
.md-nav-section { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: var(--ink-m); text-transform: uppercase; padding: 6px 8px 4px; }
.md-nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 12px; border-radius: 8px;
  background: transparent; border: none;
  color: var(--ink-m); font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s; text-align: left; width: 100%;
}
.md-nav-item:hover { background: var(--bg); color: var(--ink-s); }
.md-nav-item--active { background: var(--blue-soft); border: 1px solid var(--blue-mid); color: var(--blue); font-weight: 700; }
.md-nav-badge { margin-left: auto; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; font-size: 10px; font-weight: 800; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; display: flex; align-items: center; justify-content: center; }

.md-sb-footer { padding: 16px 12px; border-top: 1px solid var(--border); }
.md-sb-stats { display: flex; align-items: center; justify-content: space-around; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r); padding: 14px; }
.md-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.md-stat-val { font-family: var(--fdisp); font-size: 20px; font-weight: 700; color: var(--ink); }
.md-stat-val--live { color: var(--red); }
.md-stat-lbl { font-size: 10px; color: var(--ink-m); font-weight: 600; text-transform: uppercase; letter-spacing: .3px; }
.md-stat-sep { width: 1px; height: 30px; background: var(--border); }

/* ── Main ─────────────────────────────── */
.md-main { display: flex; flex-direction: column; min-height: 100vh; overflow-y: auto; }

.md-header {
  height: var(--bar-h); flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  background: var(--white); border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  position: sticky; top: 0; z-index: 20;
}
.md-page-title { font-family: var(--fdisp); font-size: 20px; font-weight: 700; color: var(--ink); }
.md-page-sub { font-size: 12px; color: var(--ink-m); margin-top: 2px; font-weight: 500; }
.md-header-actions { display: flex; align-items: center; gap: 10px; }

/* Buttons */
.md-btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; background: var(--blue); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .15s; box-shadow: 0 4px 12px var(--blue-glow);
}
.md-btn-primary:hover { background: var(--blue-dk); transform: translateY(-1px); }

.md-btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; background: transparent; border: 1.5px solid var(--border);
  border-radius: var(--r); color: var(--ink-m);
  font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.md-btn-ghost:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }

.md-btn-danger {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: var(--red); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.md-btn-danger:hover:not(:disabled) { background: #dc2626; }
.md-btn-danger:disabled { opacity: .55; cursor: not-allowed; }

.md-btn-amber {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; background: var(--orange); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.md-btn-amber:disabled { opacity: .55; cursor: not-allowed; }

.md-spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: md-spin .65s linear infinite; }
@keyframes md-spin { to { transform: rotate(360deg); } }

/* Center states */
.md-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px; }
.md-loader-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.md-loader-ring { width: 48px; height: 48px; border-radius: 50%; border: 3px solid var(--blue-mid); border-top-color: var(--blue); animation: md-spin .8s linear infinite; }
.md-loader-text { font-size: 14px; color: var(--ink-m); font-weight: 500; }
.md-error-box { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 48px; background: var(--white); border: 1px solid #fecaca; border-radius: 20px; text-align: center; box-shadow: var(--shadow-lg); }
.md-error-icon { width: 56px; height: 56px; border-radius: 50%; background: #fef2f2; border: 1px solid #fecaca; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.md-error-text { font-size: 14px; color: var(--ink-m); }

/* Content */
.md-content { flex: 1; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }

/* KPI */
.md-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.md-kpi {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 20px; background: var(--white); border: 1px solid var(--border);
  border-radius: 14px; transition: all .15s; box-shadow: var(--shadow-sm);
}
.md-kpi:hover { border-color: var(--blue-mid); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.md-kpi--live { border-color: #fecaca; }
.md-kpi-icon { width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; }
.md-kpi-icon--blue   { background: var(--blue-soft); color: var(--blue); }
.md-kpi-icon--red    { background: #fef2f2; color: var(--red); }
.md-kpi-icon--purple { background: var(--purple-s); color: var(--purple); }
.md-kpi-icon--orange { background: #fffbeb; color: var(--orange); }
.md-kpi-ring { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid rgba(239,68,68,.2); animation: md-ring 2s ease-out infinite; }
@keyframes md-ring { 0%{opacity:.8;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
.md-kpi-num { font-family: var(--fdisp); font-size: 26px; font-weight: 700; color: var(--ink); line-height: 1; }
.md-kpi-lbl { font-size: 11px; color: var(--ink-m); font-weight: 600; text-transform: uppercase; letter-spacing: .3px; margin-top: 2px; }

/* Live banner */
.md-live-banner { background: var(--white); border: 1.5px solid #fecaca; border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-sm); }
.md-live-banner-hd { padding: 14px 18px; border-bottom: 1px solid #fef2f2; background: #fef2f2; }
.md-live-indicator { display: flex; align-items: center; gap: 8px; font-family: var(--fdisp); font-size: 14px; font-weight: 700; color: #dc2626; }
.md-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); animation: md-blink 2s ease-in-out infinite; }
@keyframes md-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.md-live-list { display: flex; flex-direction: column; }
.md-live-row { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-bottom: 1px solid var(--border); }
.md-live-row:last-child { border-bottom: none; }
.md-live-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--red); flex-shrink: 0; animation: md-blink 1.5s ease-in-out infinite; }
.md-live-info { flex: 1; }
.md-live-name { font-size: 14px; font-weight: 700; color: var(--ink-s); display: block; }
.md-live-meta { font-size: 11px; color: var(--ink-m); font-weight: 500; }
.md-live-btns { display: flex; gap: 6px; }
.md-live-join { display: flex; align-items: center; gap: 5px; padding: 6px 14px; background: var(--blue); color: var(--white); border: none; border-radius: 7px; font-family: var(--font); font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; }
.md-live-join:hover { background: var(--blue-dk); }
.md-live-end { display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: #fef2f2; color: #dc2626; border: 1.5px solid #fecaca; border-radius: 7px; font-family: var(--font); font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; }
.md-live-end:hover { background: var(--red); color: var(--white); border-color: var(--red); }

/* Toolbar */
.md-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.md-tabs { display: flex; gap: 2px; background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 3px; box-shadow: var(--shadow-sm); }
.md-tab { display: flex; align-items: center; gap: 7px; padding: 7px 14px; border: none; background: transparent; border-radius: 7px; color: var(--ink-m); font-family: var(--font); font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; }
.md-tab:hover { color: var(--ink-s); background: var(--bg); }
.md-tab--active { background: var(--blue-soft); color: var(--blue); border: 1px solid var(--blue-mid); font-weight: 700; }
.md-tab-count { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; font-size: 10px; font-weight: 800; background: var(--bg); color: var(--ink-m); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }
.md-tab-count--on { background: rgba(74,144,226,.12); color: var(--blue); border-color: var(--blue-mid); }

.md-toolbar-right { display: flex; align-items: center; gap: 8px; }
.md-search { position: relative; }
.md-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--ink-m); pointer-events: none; }
.md-search-input { padding: 8px 10px 8px 30px; background: var(--white); border: 1px solid var(--border); border-radius: var(--r); color: var(--ink); font-family: var(--font); font-size: 13px; width: 200px; transition: all .15s; }
.md-search-input::placeholder { color: #a0aec0; }
.md-search-input:focus { outline: none; border-color: var(--blue); width: 240px; box-shadow: 0 0 0 2px var(--blue-glow); }
.md-refresh { width: 34px; height: 34px; border-radius: var(--r); background: var(--white); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--ink-m); cursor: pointer; transition: all .15s; }
.md-refresh:hover { border-color: var(--blue); color: var(--blue); }
.md-refresh--spin svg { animation: md-spin .8s linear infinite; }

/* Empty */
.md-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px 20px; text-align: center; }
.md-empty-icon { width: 68px; height: 68px; border-radius: 50%; background: var(--white); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--ink-m); box-shadow: var(--shadow-sm); }
.md-empty-title { font-family: var(--fdisp); font-size: 18px; font-weight: 700; color: var(--ink); }
.md-empty-sub { font-size: 14px; color: var(--ink-m); }

/* Room grid */
.md-room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.md-room-card {
  background: var(--white); border: 1.5px solid var(--border); border-radius: 14px;
  display: flex; flex-direction: column; overflow: hidden;
  transition: all .18s; box-shadow: var(--shadow-sm);
}
.md-room-card:hover { border-color: var(--blue-mid); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.md-room-card--live { border-color: #fecaca; }

.md-room-top { padding: 18px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.md-room-status-row { display: flex; align-items: center; justify-content: space-between; }
.md-room-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 10px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase;
}
.md-room-pill--live    { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
.md-room-pill--public  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #065f46; }
.md-room-pill--private { background: var(--purple-s); border: 1px solid #ddd6fe; color: #6d28d9; }
.md-pill-blink { width: 5px; height: 5px; border-radius: 50%; background: var(--red); animation: md-blink 2s ease-in-out infinite; }
.md-room-time { font-size: 11px; color: var(--ink-m); font-weight: 500; }
.md-room-name { font-family: var(--fdisp); font-size: 16px; font-weight: 700; color: var(--ink-s); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-room-code-row { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 5px 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all .15s; }
.md-room-code-row:hover { border-color: var(--blue); background: var(--blue-soft); }
.md-room-code { font-family: 'Courier New', monospace; font-size: 12px; color: var(--blue); font-weight: 700; letter-spacing: .5px; }

.md-room-foot { display: flex; align-items: center; gap: 6px; padding: 12px 14px; border-top: 1px solid var(--border); background: var(--bg); }
.md-room-join { display: flex; align-items: center; gap: 5px; padding: 7px 16px; background: var(--blue); color: var(--white); border: none; border-radius: 7px; font-family: var(--font); font-size: 12px; font-weight: 700; cursor: pointer; transition: all .15s; box-shadow: 0 2px 8px var(--blue-glow); }
.md-room-join:hover { background: var(--blue-dk); }
.md-room-icon-btn { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; border: 1.5px solid; cursor: pointer; transition: all .15s; }
.md-room-icon-btn--amber { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.md-room-icon-btn--amber:hover { background: var(--orange); color: var(--white); border-color: var(--orange); }
.md-room-icon-btn--red { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.md-room-icon-btn--red:hover { background: var(--red); color: var(--white); border-color: var(--red); }

/* Modal */
.md-modal-overlay { position: fixed; inset: 0; z-index: 5000; background: rgba(13,27,54,.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.md-modal { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 40px 36px 32px; max-width: 420px; width: 100%; text-align: center; box-shadow: var(--shadow-lg); }
.md-modal-icon { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.md-modal-icon--red   { background: #fef2f2; border: 1.5px solid #fecaca; color: #dc2626; }
.md-modal-icon--amber { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.md-modal-title { font-family: var(--fdisp); font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.md-modal-body { font-size: 14px; color: var(--ink-m); line-height: 1.65; margin-bottom: 24px; }
.md-modal-actions { display: flex; gap: 10px; justify-content: center; }

.md-modal-enter-active { animation: md-pop .2s cubic-bezier(.34,1.56,.64,1); }
.md-modal-leave-active { animation: md-pop .15s reverse ease-in; }
@keyframes md-pop { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

/* Toast */
.md-toast { position: fixed; bottom: 24px; right: 24px; z-index: 9000; display: flex; align-items: center; gap: 9px; padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; box-shadow: var(--shadow-lg); pointer-events: none; }
.md-toast--success { background: var(--white); border: 1.5px solid #6ee7b7; color: #065f46; }
.md-toast--error   { background: var(--white); border: 1.5px solid #fca5a5; color: #7f1d1d; }
.md-toast-enter-active, .md-toast-leave-active { transition: opacity .2s, transform .2s; }
.md-toast-enter-from { opacity: 0; transform: translateY(10px); }
.md-toast-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 1024px) { .md-shell { grid-template-columns: 1fr; } .md-sidebar { display: none; } }
@media (max-width: 768px) { .md-kpi-grid { grid-template-columns: repeat(2, 1fr); } .md-content { padding: 16px; } .md-header { padding: 0 16px; } }
@media (max-width: 480px) { .md-kpi-grid { grid-template-columns: 1fr; } }
</style>