<template>
  <div class="md-shell">

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <aside class="md-sidebar">
      <div class="md-sb-brand">
        <div class="md-sb-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span class="md-sb-brand-name">Nova<span class="md-sb-accent">Meet</span></span>
      </div>

      <nav class="md-sb-nav">
        <div class="md-sb-section">OVERVIEW</div>
        <button class="md-sb-item md-sb-item--active">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
          Meetings
          <span v-if="activeMeetings.length" class="md-sb-badge md-sb-badge--red">{{ activeMeetings.length }}</span>
        </button>
        <button class="md-sb-item" @click="$router.push('/dashboard')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </button>
      </nav>

      <div class="md-sb-bottom">
        <div class="md-sb-stats-mini">
          <div class="md-sb-stat">
            <span class="md-sb-stat-val">{{ allMeetings.length }}</span>
            <span class="md-sb-stat-lbl">Rooms</span>
          </div>
          <div class="md-sb-divider-v"></div>
          <div class="md-sb-stat">
            <span class="md-sb-stat-val md-sb-stat-val--live">{{ activeMeetings.length }}</span>
            <span class="md-sb-stat-lbl">Live</span>
          </div>
          <div class="md-sb-divider-v"></div>
          <div class="md-sb-stat">
            <span class="md-sb-stat-val">{{ privateCount }}</span>
            <span class="md-sb-stat-lbl">Private</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ── Main area ────────────────────────────────────────────────────── -->
    <div class="md-main">

      <!-- Top header -->
      <header class="md-header">
        <div class="md-header-left">
          <h1 class="md-page-title">Video Meetings</h1>
          <p class="md-page-sub">Manage rooms, monitor activity, launch calls</p>
        </div>
        <div class="md-header-right">
          <button class="md-ghost-btn" @click="$router.push('/meetings/join')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            Join meeting
          </button>
          <button class="md-primary-btn" @click="createMeeting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New meeting
          </button>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="md-state-screen">
        <div class="md-state-loader">
          <div class="md-loader-ring"></div>
          <p class="md-state-msg">Loading your meetings…</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="md-state-screen">
        <div class="md-state-box md-state-box--error">
          <div class="md-state-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p class="md-state-msg">{{ error }}</p>
          <button class="md-primary-btn" @click="fetchMeetingsData">Try again</button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="md-content">

        <!-- ── KPI strip ───────────────────────────────────────────────── -->
        <div class="md-kpi-strip">
          <div class="md-kpi">
            <div class="md-kpi-icon md-kpi-icon--blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
            </div>
            <div class="md-kpi-body">
              <span class="md-kpi-num">{{ allMeetings.length }}</span>
              <span class="md-kpi-lbl">Total rooms</span>
            </div>
          </div>
          <div class="md-kpi" :class="{ 'md-kpi--live': activeMeetings.length }">
            <div class="md-kpi-icon md-kpi-icon--red">
              <span v-if="activeMeetings.length" class="md-kpi-pulse"></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
            </div>
            <div class="md-kpi-body">
              <span class="md-kpi-num">{{ activeMeetings.length }}</span>
              <span class="md-kpi-lbl">Live now</span>
            </div>
          </div>
          <div class="md-kpi">
            <div class="md-kpi-icon md-kpi-icon--purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div class="md-kpi-body">
              <span class="md-kpi-num">{{ privateCount }}</span>
              <span class="md-kpi-lbl">Private</span>
            </div>
          </div>
          <div class="md-kpi">
            <div class="md-kpi-icon md-kpi-icon--amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div class="md-kpi-body">
              <span class="md-kpi-num">{{ recentCount }}</span>
              <span class="md-kpi-lbl">This week</span>
            </div>
          </div>
        </div>

        <!-- ── Active meetings banner ─────────────────────────────────── -->
        <div v-if="activeMeetings.length" class="md-live-banner">
          <div class="md-live-banner-hdr">
            <div class="md-live-dot-wrap"><span class="md-live-dot"></span></div>
            <span class="md-live-banner-title">{{ activeMeetings.length }} Active meeting{{ activeMeetings.length > 1 ? 's' : '' }}</span>
          </div>
          <div class="md-live-list">
            <div v-for="m in activeMeetings" :key="m.name" class="md-live-row">
              <div class="md-live-pulse"></div>
              <div class="md-live-info">
                <span class="md-live-name">{{ m.name }}</span>
                <span class="md-live-meta">{{ getRelativeTime(m.created_at) }} · {{ m.privacy || 'public' }}</span>
              </div>
              <div class="md-live-actions">
                <button class="md-live-join-btn" @click="joinMeetingWithCode(m.name)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Join
                </button>
                <button class="md-live-end-btn" @click="promptEnd(m)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                  End
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Toolbar ────────────────────────────────────────────────── -->
        <div class="md-toolbar">
          <div class="md-tab-group">
            <button v-for="tab in tabs" :key="tab.value"
              class="md-tab" :class="{ 'md-tab--active': activeFilter === tab.value }"
              @click="activeFilter = tab.value">
              {{ tab.label }}
              <span class="md-tab-count" :class="{ 'md-tab-count--active': activeFilter === tab.value }">{{ tab.count }}</span>
            </button>
          </div>
          <div class="md-toolbar-right">
            <div class="md-search-wrap">
              <svg class="md-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input class="md-search-input" v-model="search" placeholder="Search rooms…" />
            </div>
            <button class="md-refresh-btn" @click="fetchMeetingsData" :class="{ 'md-refresh-btn--spin': loading }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
            </button>
          </div>
        </div>

        <!-- ── Room grid ──────────────────────────────────────────────── -->
        <div v-if="filteredMeetings.length === 0" class="md-empty">
          <div class="md-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
          </div>
          <p class="md-empty-title">No meetings found</p>
          <p class="md-empty-sub">Create your first meeting to get started.</p>
          <button class="md-primary-btn" @click="createMeeting">Create meeting</button>
        </div>

        <div v-else class="md-room-grid">
          <div v-for="m in filteredMeetings" :key="m.name" class="md-room-card" :class="{ 'md-room-card--live': isRoomActive(m) }">

            <div class="md-room-card-top">
              <div class="md-room-status-row">
                <span class="md-status-pill" :class="isRoomActive(m) ? 'md-status-pill--live' : m.privacy === 'private' ? 'md-status-pill--private' : 'md-status-pill--public'">
                  <span v-if="isRoomActive(m)" class="md-status-blink"></span>
                  {{ isRoomActive(m) ? 'Live' : m.privacy === 'private' ? 'Private' : 'Public' }}
                </span>
                <span class="md-room-time">{{ formatRoomTime(m) }}</span>
              </div>
              <h3 class="md-room-title">{{ m.name }}</h3>
              <div class="md-room-code-row" @click="copyCode(m.name)" title="Copy room code">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                <code class="md-room-code">{{ m.name }}</code>
              </div>
            </div>

            <div class="md-room-card-foot">
              <button class="md-card-join-btn" @click="joinMeetingWithCode(m.name)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Join
              </button>
              <button class="md-card-icon-btn md-card-icon-btn--amber" @click="promptRestart(m)" title="Restart">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
              </button>
              <button class="md-card-icon-btn md-card-icon-btn--red" @click="promptEnd(m)" title="Delete">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── End Modal ────────────────────────────────────────────────────── -->
    <transition name="md-modal">
      <div v-if="modal.show && modal.type === 'end'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h2 class="md-modal-title">Delete "{{ modal.meeting?.name }}"?</h2>
          <p class="md-modal-body">This room will be permanently removed and all participants disconnected.</p>
          <div class="md-modal-actions">
            <button class="md-ghost-btn" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-danger-btn" @click="confirmEnd" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-btn-spinner"></span>
              Delete room
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── Restart Modal ────────────────────────────────────────────────── -->
    <transition name="md-modal">
      <div v-if="modal.show && modal.type === 'restart'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
          </div>
          <h2 class="md-modal-title">Restart "{{ modal.meeting?.name }}"?</h2>
          <p class="md-modal-body">The room will be deleted then re-created. Participants can rejoin with the same code.</p>
          <div class="md-modal-actions">
            <button class="md-ghost-btn" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-amber-btn" @click="confirmRestart" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-btn-spinner"></span>
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
      loading: true,
      error: null,
      allMeetings: [],
      activeMeetings: [],
      activeFilter: 'all',
      search: '',
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
      const all     = this.allMeetings.length;
      const priv    = this.privateCount;
      const pub     = all - priv;
      const live    = this.activeMeetings.length;
      return [
        { label: 'All',     value: 'all',     count: all },
        { label: 'Live',    value: 'live',    count: live },
        { label: 'Public',  value: 'public',  count: pub },
        { label: 'Private', value: 'private', count: priv },
      ];
    },
    filteredMeetings() {
      let list = [...this.allMeetings];
      if (this.activeFilter === 'live')    list = list.filter(m => m.active === true);
      if (this.activeFilter === 'public')  list = list.filter(m => m.privacy !== 'private');
      if (this.activeFilter === 'private') list = list.filter(m => m.privacy === 'private');
      if (this.search) {
        const q = this.search.toLowerCase();
        list = list.filter(m => (m.name || '').toLowerCase().includes(q));
      }
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    },
  },
  methods: {
    async fetchMeetingsData() {
      this.loading = true; this.error = null;
      try {
        if (!TokenService.getAccessToken()) { this.$router.push('/auth'); return; }
        const res  = await apiRequest('/meetings?limit=100', { method: 'GET' });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const body = await res.json();
        let raw = Array.isArray(body) ? body : (body.data || body.rooms || []);
        this.allMeetings    = raw;
        this.activeMeetings = raw.filter(m => m.active === true);
      } catch (e) {
        console.error('[MeetingsDashboard]', e);
        this.error = 'Failed to load meetings. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    isRoomActive(m)    { return m.active === true; },
    formatRoomTime(m)  { return m.created_at ? this.getRelativeTime(m.created_at) : ''; },

    createMeeting()    { sessionStorage.removeItem('nova_meeting_code'); this.$router.push({ path: '/meeting', query: { create: 'true' } }); },

    joinMeetingWithCode(code) {
      MeetingSession.setMeetingCode(code);
      MeetingSession.setIsHost(false);
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
        this.allMeetings    = this.allMeetings.filter(m => m.name !== code);
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
      if (d < 60)    return 'just now';
      if (d < 3600)  return `${Math.floor(d/60)}m ago`;
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
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

.md-shell {
  --md-bg:     #0a0c10;
  --md-surf:   #111318;
  --md-surf2:  #181c24;
  --md-surf3:  #1e2230;
  --md-bd:     rgba(255,255,255,.07);
  --md-bd2:    rgba(255,255,255,.11);
  --md-blue:   #3b8eea;
  --md-blg:    rgba(59,142,234,.25);
  --md-green:  #22c55e;
  --md-red:    #ef4444;
  --md-amber:  #f59e0b;
  --md-purple: #8b5cf6;
  --md-text:   #e6eaf2;
  --md-t2:     #8892a4;
  --md-t3:     #525c6e;
  --md-r:      10px;
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--md-bg);
  color: var(--md-text);
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px 1fr;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Sidebar ──────────────────────────────────────────────── */
.md-sidebar {
  background: var(--md-surf); border-right: 1px solid var(--md-bd);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh; overflow-y: auto;
}
.md-sb-brand {
  display: flex; align-items: center; gap: 9px;
  padding: 20px 18px 18px; border-bottom: 1px solid var(--md-bd);
}
.md-sb-logo {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg,#3b8eea,#5b6df8);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px var(--md-blg); flex-shrink: 0;
}
.md-sb-brand-name { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:var(--md-text); }
.md-sb-accent { color:var(--md-blue); }

.md-sb-nav { flex:1; padding:14px 10px; display:flex; flex-direction:column; gap:2px; }
.md-sb-section { font-size:10px; font-weight:700; letter-spacing:1.5px; color:var(--md-t3); text-transform:uppercase; padding:8px 10px 4px; }
.md-sb-item {
  display:flex; align-items:center; gap:9px;
  padding:9px 12px; border-radius:8px;
  background:transparent; border:none;
  color:var(--md-t2); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
  cursor:pointer; transition:all .15s; text-align:left; width:100%;
}
.md-sb-item:hover { background:var(--md-surf2); color:var(--md-text); }
.md-sb-item--active { background:rgba(59,142,234,.1); border:1px solid rgba(59,142,234,.2); color:var(--md-blue); font-weight:600; }
.md-sb-badge {
  margin-left:auto; min-width:18px; height:18px; padding:0 5px; border-radius:9px;
  font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;
}
.md-sb-badge--red { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.25); color:#f87171; }

.md-sb-bottom { padding:14px 10px; border-top:1px solid var(--md-bd); }
.md-sb-stats-mini { display:flex; align-items:center; justify-content:space-around; background:var(--md-surf2); border:1px solid var(--md-bd2); border-radius:var(--md-r); padding:12px; }
.md-sb-stat { display:flex; flex-direction:column; align-items:center; gap:2px; }
.md-sb-stat-val { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--md-text); }
.md-sb-stat-val--live { color:var(--md-red); }
.md-sb-stat-lbl { font-size:10px; color:var(--md-t3); font-weight:500; letter-spacing:.3px; }
.md-sb-divider-v { width:1px; height:28px; background:var(--md-bd2); }

/* ── Main ────────────────────────────────────────────────── */
.md-main { display:flex; flex-direction:column; min-height:100vh; overflow-y:auto; }

/* ── Header ──────────────────────────────────────────────── */
.md-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:24px 28px; border-bottom:1px solid var(--md-bd);
  background:rgba(10,12,16,.8); backdrop-filter:blur(10px);
  position:sticky; top:0; z-index:20;
}
.md-page-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--md-text); margin-bottom:3px; }
.md-page-sub { font-size:13px; color:var(--md-t2); }
.md-header-right { display:flex; align-items:center; gap:10px; }

/* Buttons */
.md-primary-btn {
  display:inline-flex; align-items:center; gap:7px;
  padding:9px 18px; background:var(--md-blue); color:#fff;
  border:none; border-radius:var(--md-r);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
  cursor:pointer; transition:all .15s; box-shadow:0 4px 14px var(--md-blg);
}
.md-primary-btn:hover { background:#2464c4; transform:translateY(-1px); }

.md-ghost-btn {
  display:inline-flex; align-items:center; gap:7px;
  padding:9px 16px; background:transparent; border:1px solid var(--md-bd2);
  border-radius:var(--md-r); color:var(--md-t2);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s;
}
.md-ghost-btn:hover { border-color:var(--md-blue); color:var(--md-text); }

.md-danger-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 20px; background:var(--md-red); color:#fff;
  border:none; border-radius:var(--md-r);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
  cursor:pointer; transition:all .15s; box-shadow:0 4px 14px rgba(239,68,68,.3);
}
.md-danger-btn:hover:not(:disabled) { background:#dc2626; }
.md-danger-btn:disabled { opacity:.55; cursor:not-allowed; }

.md-amber-btn {
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 20px; background:var(--md-amber); color:#000;
  border:none; border-radius:var(--md-r);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
  cursor:pointer; transition:all .15s;
}
.md-amber-btn:disabled { opacity:.55; cursor:not-allowed; }

.md-btn-spinner {
  display:inline-block; width:13px; height:13px;
  border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
  border-radius:50%; animation:md-spin .65s linear infinite;
}
@keyframes md-spin { to { transform:rotate(360deg); } }

/* ── State screens ───────────────────────────────────────── */
.md-state-screen { flex:1; display:flex; align-items:center; justify-content:center; padding:48px; }
.md-state-loader { display:flex; flex-direction:column; align-items:center; gap:16px; }
.md-loader-ring { width:48px; height:48px; border-radius:50%; border:3px solid rgba(59,142,234,.15); border-top-color:var(--md-blue); animation:md-spin .8s linear infinite; }
.md-state-msg { font-size:14px; color:var(--md-t2); font-weight:500; }
.md-state-box { display:flex; flex-direction:column; align-items:center; gap:14px; padding:48px; border-radius:20px; text-align:center; }
.md-state-box--error { background:rgba(239,68,68,.05); border:1px solid rgba(239,68,68,.15); }
.md-state-icon { width:56px; height:56px; border-radius:50%; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); display:flex; align-items:center; justify-content:center; color:#f87171; }

/* ── Content ─────────────────────────────────────────────── */
.md-content { flex:1; padding:24px 28px; display:flex; flex-direction:column; gap:20px; }

/* KPI strip */
.md-kpi-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.md-kpi {
  display:flex; align-items:center; gap:14px;
  padding:16px 18px; background:var(--md-surf); border:1px solid var(--md-bd2);
  border-radius:14px; transition:all .15s; box-shadow:0 2px 8px rgba(0,0,0,.2);
}
.md-kpi:hover { border-color:rgba(59,142,234,.2); transform:translateY(-1px); }
.md-kpi--live { border-color:rgba(239,68,68,.2); }
.md-kpi-icon {
  width:42px; height:42px; border-radius:11px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; position:relative;
}
.md-kpi-icon--blue   { background:rgba(59,142,234,.12); color:var(--md-blue); }
.md-kpi-icon--red    { background:rgba(239,68,68,.12);  color:var(--md-red);  }
.md-kpi-icon--purple { background:rgba(139,92,246,.12); color:var(--md-purple);}
.md-kpi-icon--amber  { background:rgba(245,158,11,.12); color:var(--md-amber); }
.md-kpi-pulse { position:absolute; inset:-4px; border-radius:50%; border:2px solid rgba(239,68,68,.3); animation:md-ring 2s ease-out infinite; }
@keyframes md-ring { 0%{opacity:.8;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
.md-kpi-body { display:flex; flex-direction:column; gap:2px; }
.md-kpi-num { font-family:'Syne',sans-serif; font-size:26px; font-weight:700; color:var(--md-text); line-height:1; }
.md-kpi-lbl { font-size:11px; color:var(--md-t2); font-weight:500; text-transform:uppercase; letter-spacing:.3px; }

/* Live banner */
.md-live-banner { background:rgba(239,68,68,.04); border:1px solid rgba(239,68,68,.15); border-radius:14px; overflow:hidden; }
.md-live-banner-hdr { display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid rgba(239,68,68,.1); }
.md-live-dot-wrap { width:20px; height:20px; border-radius:50%; background:rgba(239,68,68,.1); display:flex; align-items:center; justify-content:center; }
.md-live-dot { width:7px; height:7px; border-radius:50%; background:var(--md-red); animation:md-blink 2s ease-in-out infinite; }
@keyframes md-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.md-live-banner-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--md-text); }
.md-live-list { display:flex; flex-direction:column; }
.md-live-row { display:flex; align-items:center; gap:14px; padding:12px 18px; border-bottom:1px solid var(--md-bd); }
.md-live-row:last-child { border-bottom:none; }
.md-live-pulse { width:8px; height:8px; border-radius:50%; background:var(--md-red); flex-shrink:0; animation:md-blink 1.5s ease-in-out infinite; }
.md-live-info { flex:1; }
.md-live-name { font-size:14px; font-weight:600; color:var(--md-text); display:block; }
.md-live-meta { font-size:11px; color:var(--md-t2); }
.md-live-actions { display:flex; gap:6px; }
.md-live-join-btn {
  display:flex; align-items:center; gap:5px; padding:6px 12px;
  background:var(--md-blue); color:#fff; border:none; border-radius:7px;
  font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s;
}
.md-live-join-btn:hover { background:#2464c4; }
.md-live-end-btn {
  display:flex; align-items:center; gap:5px; padding:6px 10px;
  background:rgba(239,68,68,.08); color:#f87171; border:1px solid rgba(239,68,68,.25); border-radius:7px;
  font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s;
}
.md-live-end-btn:hover { background:var(--md-red); color:#fff; border-color:var(--md-red); }

/* Toolbar */
.md-toolbar { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
.md-tab-group { display:flex; gap:2px; background:var(--md-surf); border:1px solid var(--md-bd2); border-radius:10px; padding:3px; }
.md-tab {
  display:flex; align-items:center; gap:7px; padding:7px 14px;
  border:none; background:transparent; border-radius:7px;
  color:var(--md-t2); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s;
}
.md-tab:hover { color:var(--md-text); background:var(--md-surf2); }
.md-tab--active { background:rgba(59,142,234,.12); color:var(--md-blue); font-weight:600; border:1px solid rgba(59,142,234,.2); }
.md-tab-count {
  min-width:18px; height:18px; padding:0 5px; border-radius:9px;
  font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;
  background:var(--md-surf2); color:var(--md-t2);
}
.md-tab-count--active { background:rgba(59,142,234,.15); color:var(--md-blue); }
.md-toolbar-right { display:flex; align-items:center; gap:8px; }
.md-search-wrap { position:relative; }
.md-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--md-t3); pointer-events:none; }
.md-search-input {
  padding:8px 11px 8px 32px; background:var(--md-surf); border:1px solid var(--md-bd2);
  border-radius:var(--md-r); color:var(--md-text); font-family:'DM Sans',sans-serif; font-size:13px;
  width:200px; transition:all .15s;
}
.md-search-input::placeholder { color:var(--md-t3); }
.md-search-input:focus { outline:none; border-color:var(--md-blue); width:240px; }
.md-refresh-btn {
  width:34px; height:34px; border-radius:var(--md-r);
  background:var(--md-surf); border:1px solid var(--md-bd2);
  display:flex; align-items:center; justify-content:center; color:var(--md-t2);
  cursor:pointer; transition:all .15s;
}
.md-refresh-btn:hover { border-color:var(--md-blue); color:var(--md-blue); }
.md-refresh-btn--spin svg { animation:md-spin .8s linear infinite; }

/* Empty */
.md-empty {
  display:flex; flex-direction:column; align-items:center; gap:12px;
  padding:64px 20px; text-align:center;
}
.md-empty-icon { width:64px; height:64px; border-radius:50%; background:var(--md-surf); border:1px solid var(--md-bd2); display:flex; align-items:center; justify-content:center; color:var(--md-t2); }
.md-empty-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--md-text); }
.md-empty-sub { font-size:14px; color:var(--md-t2); }

/* Room grid */
.md-room-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:12px; }
.md-room-card {
  background:var(--md-surf); border:1px solid var(--md-bd2); border-radius:14px;
  display:flex; flex-direction:column; overflow:hidden;
  transition:all .18s; box-shadow:0 2px 8px rgba(0,0,0,.2);
}
.md-room-card:hover { border-color:rgba(59,142,234,.25); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.3); }
.md-room-card--live { border-color:rgba(239,68,68,.2); }
.md-room-card-top { padding:18px 18px 14px; flex:1; display:flex; flex-direction:column; gap:10px; }
.md-room-status-row { display:flex; align-items:center; justify-content:space-between; }
.md-status-pill {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 9px; border-radius:20px;
  font-size:10px; font-weight:700; letter-spacing:.5px; text-transform:uppercase;
}
.md-status-pill--live    { background:rgba(239,68,68,.1);  border:1px solid rgba(239,68,68,.2);  color:#f87171; }
.md-status-pill--public  { background:rgba(34,197,94,.08); border:1px solid rgba(34,197,94,.2);  color:#4ade80; }
.md-status-pill--private { background:rgba(139,92,246,.1); border:1px solid rgba(139,92,246,.2); color:#c4b5fd; }
.md-status-blink { width:5px; height:5px; border-radius:50%; background:var(--md-red); animation:md-blink 2s ease-in-out infinite; }
.md-room-time { font-size:11px; color:var(--md-t3); }
.md-room-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:var(--md-text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.md-room-code-row {
  display:inline-flex; align-items:center; gap:7px; align-self:flex-start;
  padding:6px 10px; background:var(--md-surf2); border:1px solid var(--md-bd2);
  border-radius:7px; cursor:pointer; transition:all .15s;
}
.md-room-code-row:hover { border-color:var(--md-blue); }
.md-room-code { font-family:'DM Mono','Courier New',monospace; font-size:12px; color:#8ab4f8; font-weight:500; letter-spacing:.5px; }
.md-room-card-foot { display:flex; align-items:center; gap:6px; padding:12px 14px; border-top:1px solid var(--md-bd); background:rgba(0,0,0,.15); }
.md-card-join-btn {
  display:flex; align-items:center; gap:5px; padding:7px 14px;
  background:var(--md-blue); color:#fff; border:none; border-radius:7px;
  font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s;
  box-shadow:0 2px 10px var(--md-blg);
}
.md-card-join-btn:hover { background:#2464c4; }
.md-card-icon-btn {
  width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center;
  border:1px solid; cursor:pointer; transition:all .15s;
}
.md-card-icon-btn--amber { background:rgba(245,158,11,.08); border-color:rgba(245,158,11,.25); color:#fbbf24; }
.md-card-icon-btn--amber:hover { background:rgba(245,158,11,.18); }
.md-card-icon-btn--red { background:rgba(239,68,68,.08); border-color:rgba(239,68,68,.25); color:#f87171; }
.md-card-icon-btn--red:hover { background:var(--md-red); color:#fff; border-color:var(--md-red); }

/* Modal */
.md-modal-overlay { position:fixed; inset:0; z-index:5000; background:rgba(0,0,0,.8); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; }
.md-modal { background:var(--md-surf); border:1px solid var(--md-bd2); border-radius:20px; padding:36px; max-width:400px; width:100%; text-align:center; box-shadow:0 40px 100px rgba(0,0,0,.7); }
.md-modal-icon { width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
.md-modal-icon--red   { background:rgba(239,68,68,.12); border:1.5px solid rgba(239,68,68,.25); color:#f87171; }
.md-modal-icon--amber { background:rgba(245,158,11,.12); border:1.5px solid rgba(245,158,11,.25); color:#fbbf24; }
.md-modal-title { font-family:'Syne',sans-serif; font-size:19px; font-weight:700; color:var(--md-text); margin-bottom:10px; }
.md-modal-body { font-size:14px; color:var(--md-t2); line-height:1.65; margin-bottom:24px; }
.md-modal-actions { display:flex; gap:10px; justify-content:center; }
.md-modal-enter-active { animation:md-pop .2s cubic-bezier(.34,1.56,.64,1); }
.md-modal-leave-active { animation:md-pop .15s reverse ease-in; }
@keyframes md-pop { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }

/* Toast */
.md-toast { position:fixed; bottom:24px; right:24px; z-index:9000; display:flex; align-items:center; gap:9px; padding:11px 18px; border-radius:12px; font-size:13px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.4); pointer-events:none; }
.md-toast--success { background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.2); color:#4ade80; }
.md-toast--error   { background:rgba(239,68,68,.1);  border:1px solid rgba(239,68,68,.2);  color:#f87171; }
.md-toast-enter-active, .md-toast-leave-active { transition:opacity .2s, transform .2s; }
.md-toast-enter-from { opacity:0; transform:translateY(10px); }
.md-toast-leave-to { opacity:0; }

/* Responsive */
@media (max-width:1024px) { .md-shell { grid-template-columns:1fr; } .md-sidebar { display:none; } }
@media (max-width:768px) { .md-kpi-strip { grid-template-columns:repeat(2,1fr); } .md-content { padding:16px; } .md-header { padding:16px; } }
@media (max-width:480px) { .md-kpi-strip { grid-template-columns:1fr; } }
</style>