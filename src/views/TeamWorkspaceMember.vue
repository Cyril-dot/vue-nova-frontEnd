<!-- TeamWorkspaceMember.vue — Member contribution page -->
<!-- Endpoints used:
     GET  /v1/team/workspace/all/{teamId}
     GET  /v1/team/workspace/view/{teamId}/{docId}
     POST /v1/team/workspace/contribute/{teamId}/{docId}
     GET  /v1/team/workspace/download/{teamId}/{docId}
     GET  /v1/team/workspace/download-all/{teamId}
-->
<template>
  <div class="ws-root">
    <!-- ══════════════ HEADER ══════════════ -->
    <header class="ws-header">
      <div class="ws-header__inner">
        <div class="ws-brand">
          <div class="ws-brand__icon">
            <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <rect x="8" y="8" width="26" height="26" rx="3" stroke="white" stroke-width="2"/>
              <path d="M21 13v16M13 21h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ws-brand__text">
            <span class="ws-brand__name">NovaSpace</span>
            <span class="ws-brand__sub">Contribute</span>
          </div>
        </div>

        <div class="ws-header__center">
          <template v-if="editorMode && activeWorkspace">
            <div class="ws-editor-breadcrumb">
              <button @click="exitEditor" class="ws-crumb-btn">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Workspaces
              </button>
              <span class="ws-crumb-sep">/</span>
              <span class="ws-crumb-cur">{{ activeWorkspace.title }}</span>
              <span class="ws-mode-pill" :class="editorTab === 'contribute' ? 'ws-mode-pill--green' : 'ws-mode-pill--view'">
                {{ editorTab === 'contribute' ? '✏️ Contributing' : '👁 Viewing' }}
              </span>
            </div>
          </template>
          <template v-else>
            <div class="ws-contrib-badge" v-if="selectedTeam">
              <span class="ws-pulse-dot"></span>
              Contributing to: <strong>{{ selectedTeam.teamName }}</strong>
            </div>
          </template>
        </div>

        <div class="ws-header__actions">
          <div class="ws-nav-tabs">
            <router-link to="/team-workspace" class="ws-nav-tab">Hub</router-link>
            <span class="ws-nav-tab ws-nav-tab--active">Contribute</span>
            <router-link to="/team-workspace-admin" class="ws-nav-tab ws-nav-tab--admin">Admin</router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- ══════════════ EDITOR MODE ══════════════ -->
    <div v-if="editorMode && activeWorkspace" class="ws-editor-shell">
      <!-- Editor Sidebar -->
      <aside class="ws-editor-sidebar">
        <button class="ws-back-btn" @click="exitEditor">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Back to Workspaces
        </button>

        <div class="ws-editor-meta">
          <div class="ws-type-pill" :style="{ background: typeColor(activeWorkspace.docType), color:'#fff' }">
            {{ activeWorkspace.docType || 'TEXT' }}
          </div>
          <h2 class="ws-editor-title">{{ activeWorkspace.title }}</h2>
          <p class="ws-editor-desc">{{ activeWorkspace.description || 'No description.' }}</p>
        </div>

        <div class="ws-section-label">Mode</div>
        <div class="ws-tab-group">
          <button :class="['ws-tab', { active: editorTab === 'view' }]" @click="editorTab = 'view'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            View Content
          </button>
          <button :class="['ws-tab ws-tab--green', { active: editorTab === 'contribute' }]" @click="editorTab = 'contribute'; contributionContent = ''">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Submit Contribution
          </button>
        </div>

        <div class="ws-section-label" style="margin-top:12px">Actions</div>
        <button class="ws-action-btn" @click="copyContent">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/></svg>
          {{ copied ? '✓ Copied!' : 'Copy Content' }}
        </button>
        <button class="ws-action-btn" @click="downloadWs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Download File
        </button>
      </aside>

      <!-- Editor Main -->
      <div class="ws-editor-main">
        <!-- View tab -->
        <div v-if="editorTab === 'view'" class="ws-view-pane">
          <div class="ws-code-block">
            <div class="ws-code-header">
              <div class="ws-mac-dots"><span></span><span></span><span></span></div>
              <span class="ws-code-lang">{{ (activeWorkspace.docType || 'text').toLowerCase() }}</span>
              <button class="ws-copy-btn" @click="copyContent">{{ copied ? '✓ Copied' : 'Copy' }}</button>
            </div>
            <div v-if="loadingContent" class="ws-center-spin"><div class="ws-spin ws-spin--light"></div></div>
            <pre v-else class="ws-code-pre"><code>{{ activeContent || '// No content yet. Be the first to contribute!' }}</code></pre>
          </div>
        </div>

        <!-- Contribute tab -->
        <div v-else class="ws-edit-pane">
          <div class="ws-edit-header">
            <div class="ws-edit-info ws-edit-info--green">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>
              Your contribution will be <strong>reviewed by an admin</strong> before being merged.
            </div>
          </div>
          <div class="ws-split">
            <div class="ws-split-panel ws-split-panel--input">
              <div class="ws-panel-label">
                <span>Your Contribution</span>
                <span class="ws-char-count">{{ contributionContent.length }} chars</span>
              </div>
              <textarea v-model="contributionContent" class="ws-textarea"
                :placeholder="`Write your ${activeWorkspace.docType || 'content'} contribution…\n\nAdmin will review before merging.`"
                spellcheck="false"></textarea>
              <div class="ws-contrib-footer">
                <span v-if="contribError" class="ws-err-msg">{{ contribError }}</span>
                <div class="ws-contrib-footer__actions">
                  <button class="ws-btn ws-btn--ghost ws-btn--sm" @click="contributionContent = ''" :disabled="!contributionContent">Clear</button>
                  <button class="ws-btn ws-btn--green" @click="submitContribution" :disabled="!contributionContent.trim() || submitting">
                    <svg v-if="!submitting" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    <div v-else class="ws-spin ws-spin--sm ws-spin--white"></div>
                    {{ submitting ? 'Submitting…' : 'Submit for Review' }}
                  </button>
                </div>
              </div>
            </div>
            <div class="ws-split-panel ws-split-panel--preview">
              <div class="ws-panel-label">
                <span>Current Document</span>
                <span class="ws-char-count">Preview</span>
              </div>
              <pre class="ws-preview-pre"><code>{{ activeContent || '// No content yet.' }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════ LIST / MAIN MODE ══════════════ -->
    <div v-else class="ws-layout">

      <!-- ── LEFT SIDEBAR ── -->
      <aside class="ws-sidebar">
        <nav class="ws-sidebar-nav">
          <div class="ws-sidebar-label">Navigation</div>
          <router-link to="/dashboard" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
            Dashboard
          </router-link>
          <router-link to="/teams" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
            Teams
          </router-link>
          <router-link to="/team-workspace" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Workspace Hub
          </router-link>
          <router-link to="/team-workspace-members" class="ws-sidebar-link ws-sidebar-link--active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Contribute
          </router-link>
          <router-link to="/team-workspace-admin" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/></svg>
            Admin Panel
          </router-link>
        </nav>

        <!-- Stats -->
        <div class="ws-sidebar-stats">
          <div class="ws-sidebar-stats__title">Workspace Stats</div>
          <div class="ws-sidebar-stats__grid">
            <div class="ws-stat-mini"><div class="ws-stat-mini__val">{{ teams.length }}</div><div class="ws-stat-mini__lbl">My Teams</div></div>
            <div class="ws-stat-mini"><div class="ws-stat-mini__val">{{ workspaces.length }}</div><div class="ws-stat-mini__lbl">Workspaces</div></div>
          </div>
        </div>

        <!-- Team selector -->
        <div class="ws-sidebar-section">
          <div class="ws-sidebar-label">Your Teams</div>
          <div v-if="loadingTeams" class="ws-spin-wrap"><div class="ws-spin ws-spin--sm"></div></div>
          <div v-else class="ws-team-list">
            <button v-for="t in teams" :key="t.teamId"
              :class="['ws-team-btn', { active: selectedTeam?.teamId === t.teamId }]"
              @click="selectTeam(t)">
              <div :class="['ws-team-ava', t.myRole === 'ADMIN' ? 'ws-team-ava--admin' : 'ws-team-ava--member']">
                {{ (t.teamName||'T')[0].toUpperCase() }}
              </div>
              <div class="ws-team-btn__body">
                <span class="ws-team-btn__name">{{ t.teamName }}</span>
                <span :class="['ws-team-btn__role', t.myRole === 'ADMIN' ? 'role-admin' : 'role-member']">{{ t.myRole }}</span>
              </div>
            </button>
            <div v-if="teams.length === 0" class="ws-sidebar-empty">No teams found</div>
          </div>
        </div>

        <!-- Workspace filter list -->
        <div v-if="workspaces.length > 0" class="ws-sidebar-section">
          <div class="ws-sidebar-label">Workspaces ({{ workspaces.length }})</div>
          <div class="ws-ws-filter-list">
            <button v-for="ws in workspaces" :key="ws.id"
              :class="['ws-ws-filter-item', { active: selectedWorkspace?.id === ws.id }]"
              @click="openWorkspace(ws)">
              <span class="ws-ws-filter-dot" :style="{ background: typeColor(ws.docType) }"></span>
              <span class="ws-ws-filter-name">{{ ws.title }}</span>
              <span v-if="selectedWorkspace?.id === ws.id" class="ws-ws-check">✓</span>
            </button>
          </div>
        </div>

        <!-- Contribution tips -->
        <div class="ws-tips">
          <div class="ws-sidebar-label">Tips</div>
          <div class="ws-tip">✓ View the current workspace before contributing</div>
          <div class="ws-tip">✓ Write clean, well-commented code</div>
          <div class="ws-tip">✓ Admin approves or rejects submissions</div>
        </div>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <main class="ws-main">
        <div v-if="!selectedTeam" class="ws-empty-state">
          <div class="ws-empty-state__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <h3>Select a Team</h3>
          <p>Choose a team from the sidebar to browse and contribute to workspaces.</p>
        </div>

        <div v-else-if="loading" class="ws-loading"><div class="ws-spin"></div><p>Loading workspaces…</p></div>

        <div v-else-if="workspaces.length === 0" class="ws-empty-state">
          <div class="ws-empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/></svg></div>
          <h3>No workspaces yet</h3>
          <p>This team has no workspaces. Ask an admin to create one.</p>
        </div>

        <template v-else>
          <div class="ws-page-head">
            <div>
              <h1 class="ws-page-title">{{ selectedTeam.teamName }}</h1>
              <p class="ws-page-sub">Browse workspaces and submit contributions for review</p>
            </div>
            <button class="ws-btn ws-btn--ghost" @click="downloadAll">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Download All
            </button>
          </div>

          <!-- How it works bar -->
          <div class="ws-howto">
            <div class="ws-howto__step"><div class="ws-howto__num">1</div><div><p class="ws-howto__t">Select Workspace</p><p class="ws-howto__s">Click a card below</p></div></div>
            <div class="ws-howto__arrow">→</div>
            <div class="ws-howto__step"><div class="ws-howto__num">2</div><div><p class="ws-howto__t">View &amp; Write</p><p class="ws-howto__s">Browse or contribute</p></div></div>
            <div class="ws-howto__arrow">→</div>
            <div class="ws-howto__step"><div class="ws-howto__num">3</div><div><p class="ws-howto__t">Submit for Review</p><p class="ws-howto__s">Admin approves/rejects</p></div></div>
          </div>

          <!-- Search + type filter -->
          <div class="ws-controls">
            <div class="ws-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Search workspaces…" class="ws-search-input" />
              <span v-if="searchQuery" @click="searchQuery = ''" class="ws-search-clear">✕</span>
            </div>
            <div class="ws-type-tabs">
              <button :class="['ws-type-tab', { active: typeFilter === '' }]" @click="typeFilter = ''">All</button>
              <button v-for="t in availableTypes" :key="t"
                :class="['ws-type-tab', { active: typeFilter === t }]"
                @click="typeFilter = t"
                :style="typeFilter === t ? { background: typeColor(t), color: '#fff', borderColor: typeColor(t) } : {}">
                {{ t }}
              </button>
            </div>
          </div>

          <!-- Workspace Grid -->
          <div class="ws-grid">
            <div v-for="ws in filteredWorkspaces" :key="ws.id" class="ws-card" @click="openWorkspace(ws)">
              <div class="ws-card__stripe" :style="{ background: typeColor(ws.docType) }"></div>
              <div class="ws-card__head">
                <div class="ws-type-chip" :style="{ background: typeBg(ws.docType), color: typeColor(ws.docType) }">{{ ws.docType || 'TEXT' }}</div>
              </div>
              <div class="ws-card__body">
                <h3 class="ws-card__title">{{ ws.title }}</h3>
                <p class="ws-card__desc">{{ ws.description || 'No description.' }}</p>
              </div>
              <div class="ws-card__actions">
                <button class="ws-pill-btn ws-pill-btn--view" @click.stop="openWorkspace(ws)">👁 View</button>
                <button class="ws-pill-btn ws-pill-btn--contribute" @click.stop="openContribute(ws)">✏️ Contribute</button>
                <button class="ws-pill-btn ws-pill-btn--dl" @click.stop="downloadSingle(ws.id)">⬇ Download</button>
              </div>
              <div class="ws-card__foot">
                <span class="ws-card__by">
                  <div class="ws-ava">{{ (ws.username||'A')[0].toUpperCase() }}</div>
                  {{ ws.username || 'Admin' }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </main>

      <!-- ── RIGHT SIDEBAR ── -->
      <aside class="ws-right-sidebar">
        <div class="ws-right-sidebar__head">
          <h3>Team Workspaces</h3>
          <p>{{ selectedTeam ? `${workspaces.length} available` : 'Select a team' }}</p>
        </div>

        <template v-if="selectedTeam && workspaces.length > 0">
          <div class="ws-right-ws-list">
            <div v-for="ws in workspaces.slice(0,10)" :key="ws.id+'-r'"
              :class="['ws-right-ws-item', { selected: selectedWorkspace?.id === ws.id }]"
              @click="openWorkspace(ws)">
              <div class="ws-right-ws-dot" :style="{ background: typeBg(ws.docType) }">
                <span :style="{ color: typeColor(ws.docType), fontSize:'8px', fontWeight:'800' }">{{ (ws.docType||'TXT').slice(0,3) }}</span>
              </div>
              <div class="ws-right-ws-info">
                <p class="ws-right-ws-name">{{ ws.title }}</p>
                <p class="ws-right-ws-type">{{ ws.docType || 'TEXT' }}</p>
              </div>
              <button class="ws-right-contribute-btn" @click.stop="openContribute(ws)" title="Contribute">+</button>
            </div>
          </div>
        </template>
        <div v-else class="ws-right-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>
          <p>{{ selectedTeam ? 'No workspaces' : 'No team selected' }}</p>
        </div>

        <div class="ws-right-sidebar__footer">
          <div class="ws-sidebar-label" style="margin-bottom:8px">Quick Actions</div>
          <router-link to="/team-workspace" class="ws-right-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Back to Hub
          </router-link>
          <router-link to="/team-workspace-admin" class="ws-right-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/></svg>
            Admin Panel
          </router-link>
          <button v-if="selectedTeam" class="ws-right-action" @click="downloadAll">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Download All
          </button>
        </div>
      </aside>
    </div>

    <!-- ══════════════ TOAST ══════════════ -->
    <transition name="toast">
      <div v-if="toast.show" :class="['ws-toast', `ws-toast--${toast.type}`]">
        <span class="ws-toast__icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { apiRequest } from '@/utils/apiService';
import { TeamWorkspaceAPI } from '@/utils/teamWorkspaceApi';

export default {
  name: 'TeamWorkspaceMember',
  data() {
    return {
      teams: [], selectedTeam: null, workspaces: [],
      selectedWorkspace: null, activeWorkspace: null, activeContent: '',
      editorMode: false, editorTab: 'view',
      contributionContent: '', contribError: '',
      searchQuery: '', typeFilter: '',
      loading: false, loadingTeams: false, loadingContent: false,
      submitting: false, copied: false,
      toast: { show: false, message: '', type: 'success' },
    };
  },

  computed: {
    availableTypes() {
      return [...new Set(this.workspaces.map(w => w.docType).filter(Boolean))];
    },
    filteredWorkspaces() {
      let list = [...this.workspaces];
      if (this.typeFilter) list = list.filter(w => w.docType === this.typeFilter);
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(w =>
          (w.title||'').toLowerCase().includes(q) ||
          (w.description||'').toLowerCase().includes(q)
        );
      }
      return list;
    },
  },

  methods: {
    async loadTeams() {
      try {
        this.loadingTeams = true;
        const res = await apiRequest('/v1/dashboard/teams/joined', { method: 'GET' });
        const data = await res.json();
        this.teams = Array.isArray(data) ? data : [];
        const saved = sessionStorage.getItem('selectedTeam');
        if (saved) {
          const t = JSON.parse(saved);
          const match = this.teams.find(tm => tm.teamId === t.teamId);
          if (match) { await this.selectTeam(match); return; }
        }
        if (this.teams.length > 0) await this.selectTeam(this.teams[0]);
      } catch (e) {
        this.showToast('Failed to load teams', 'error');
      } finally {
        this.loadingTeams = false;
      }
    },

    async selectTeam(team) {
      this.selectedTeam = team;
      sessionStorage.setItem('selectedTeam', JSON.stringify(team));
      this.selectedWorkspace = null; this.workspaces = [];
      await this.loadWorkspaces();
    },

    async loadWorkspaces() {
      if (!this.selectedTeam) return;
      try {
        this.loading = true;
        const data = await TeamWorkspaceAPI.getAllWorkspaces(this.selectedTeam.teamId);
        this.workspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load workspaces', 'error');
        this.workspaces = [];
      } finally {
        this.loading = false;
      }
    },

    async openWorkspace(ws) {
      this.activeWorkspace = ws; this.editorTab = 'view';
      this.contributionContent = ''; this.contribError = '';
      this.editorMode = true; this.selectedWorkspace = ws;
      await this.loadContent(ws);
    },

    async openContribute(ws) {
      this.activeWorkspace = ws; this.editorTab = 'contribute';
      this.contributionContent = ''; this.contribError = '';
      this.editorMode = true; this.selectedWorkspace = ws;
      await this.loadContent(ws);
    },

    async loadContent(ws) {
      try {
        this.loadingContent = true;
        const data = await TeamWorkspaceAPI.viewWorkspace(this.selectedTeam.teamId, ws.id);
        this.activeContent = data.content || '';
      } catch (e) {
        this.activeContent = '';
      } finally {
        this.loadingContent = false;
      }
    },

    exitEditor() {
      this.editorMode = false; this.activeWorkspace = null;
      this.activeContent = ''; this.contributionContent = ''; this.editorTab = 'view';
    },

    async submitContribution() {
      this.contribError = '';
      if (!this.contributionContent.trim()) { this.contribError = 'Content cannot be empty'; return; }
      if (this.contributionContent.trim().length < 10) { this.contribError = 'Must be at least 10 characters'; return; }
      try {
        this.submitting = true;
        await TeamWorkspaceAPI.submitContribution(
          this.selectedTeam.teamId,
          this.activeWorkspace.id,
          this.contributionContent
        );
        this.showToast('Contribution submitted! Awaiting admin review.', 'success');
        this.contributionContent = ''; this.editorTab = 'view';
      } catch (e) {
        this.showToast(e.message || 'Failed to submit contribution', 'error');
      } finally {
        this.submitting = false;
      }
    },

    async downloadSingle(id) {
      try { await TeamWorkspaceAPI.downloadWorkspace(this.selectedTeam.teamId, id); this.showToast('Download started', 'success'); }
      catch (e) { this.showToast('Download failed', 'error'); }
    },
    async downloadWs() { if (this.activeWorkspace) await this.downloadSingle(this.activeWorkspace.id); },
    async downloadAll() {
      try { await TeamWorkspaceAPI.downloadAllWorkspaces(this.selectedTeam.teamId); this.showToast('Download started', 'success'); }
      catch (e) { this.showToast(e.message || 'Download failed', 'error'); }
    },

    copyContent() {
      if (this.activeContent) {
        navigator.clipboard.writeText(this.activeContent);
        this.copied = true; setTimeout(() => { this.copied = false; }, 2000);
      }
    },

    typeColor(type) {
      const m = { HTML:'#f59e0b',CSS:'#3b82f6',JS:'#eab308',TYPESCRIPT:'#6366f1',PYTHON:'#10b981',JAVA:'#ef4444',C_PLUS_PLUS:'#8b5cf6',C_SHARP:'#a855f7',SQL:'#0891b2',MARKDOWN:'#64748b',TEXT:'#94a3b8' };
      return m[type] || '#6366f1';
    },
    typeBg(type) {
      const m = { HTML:'#fef3c7',CSS:'#dbeafe',JS:'#fef9c3',TYPESCRIPT:'#ede9fe',PYTHON:'#d1fae5',JAVA:'#fee2e2',C_PLUS_PLUS:'#ede9fe',C_SHARP:'#f3e8ff',SQL:'#cffafe',MARKDOWN:'#f1f5f9',TEXT:'#f8fafc' };
      return m[type] || '#f1f5f9';
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    },
  },

  async mounted() { await this.loadTeams(); },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

.ws-root {
  --ink: #0f172a; --ink2: #475569; --ink3: #94a3b8; --ink4: #cbd5e1;
  --border: #e2e8f0; --border2: #f1f5f9; --bg: #f8fafc; --bg2: #f1f5f9;
  --white: #fff;
  --primary: #6366f1; --primary-dk: #4f46e5; --primary-soft: #eef2ff;
  --green: #10b981; --green-soft: #d1fae5; --green-dk: #059669;
  --red: #ef4444; --red-soft: #fee2e2;
  --amber: #f59e0b; --amber-soft: #fef3c7;
  --sh-xs: 0 1px 2px rgba(15,23,42,.05); --sh-sm: 0 1px 4px rgba(15,23,42,.08);
  --sh-md: 0 4px 16px rgba(15,23,42,.10); --sh-lg: 0 12px 32px rgba(15,23,42,.13); --sh-xl: 0 24px 48px rgba(15,23,42,.15);
  --r: 10px; --r-sm: 6px; --r-md: 14px; --r-lg: 18px;
  --ease: cubic-bezier(.22,1,.36,1);
  min-height: 100vh; background: var(--bg);
  font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px;
  color: var(--ink); display: flex; flex-direction: column; -webkit-font-smoothing: antialiased;
}
.ws-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* Header */
.ws-header { background: rgba(255,255,255,.96); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); height: 58px; position: sticky; top: 0; z-index: 200; }
.ws-header__inner { height: 100%; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.ws-brand { display: flex; align-items: center; gap: 9px; flex-shrink: 0; user-select: none; }
.ws-brand__text { display: flex; flex-direction: column; line-height: 1.2; }
.ws-brand__name { font-size: 14px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; letter-spacing: -.3px; }
.ws-brand__sub { font-size: 9px; font-weight: 700; color: var(--green); text-transform: uppercase; letter-spacing: .4px; }
.ws-header__center { flex: 1; display: flex; justify-content: center; }
.ws-contrib-badge { display: flex; align-items: center; gap: 7px; background: var(--green-soft); border: 1px solid rgba(16,185,129,.2); border-radius: 999px; padding: 5px 14px; font-size: 11px; color: #065f46; }
.ws-pulse-dot { width: 7px; height: 7px; background: var(--green); border-radius: 50%; animation: _pulse 2s infinite; }
@keyframes _pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
.ws-editor-breadcrumb { display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 999px; padding: 5px 14px; }
.ws-crumb-btn { background: none; border: none; color: var(--green); font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: 'DM Sans', sans-serif; }
.ws-crumb-sep { color: var(--ink4); }
.ws-crumb-cur { font-size: 11px; font-weight: 700; color: var(--ink); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-mode-pill { padding: 2px 9px; border-radius: 999px; font-size: 9px; font-weight: 800; margin-left: 4px; }
.ws-mode-pill--view { background: var(--bg2); color: var(--ink3); }
.ws-mode-pill--green { background: var(--green-soft); color: var(--green-dk); }
.ws-header__actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ws-nav-tabs { display: flex; gap: 2px; background: var(--bg2); padding: 3px; border-radius: var(--r); border: 1px solid var(--border); }
.ws-nav-tab { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border: none; background: none; border-radius: 7px; font-size: 11px; font-weight: 600; color: var(--ink3); cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; transition: color .15s; }
.ws-nav-tab:hover { color: var(--ink); }
.ws-nav-tab--active { background: var(--green-soft); color: #065f46; }
.ws-nav-tab--admin { color: var(--amber) !important; }

/* Layout */
.ws-layout { display: grid; grid-template-columns: 224px 1fr 240px; height: calc(100vh - 58px); overflow: hidden; }

/* Left Sidebar */
.ws-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 18px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.ws-sidebar-label { font-size: 9px; font-weight: 800; color: var(--ink3); text-transform: uppercase; letter-spacing: .8px; padding: 0 6px 4px; }
.ws-sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
.ws-sidebar-link { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 10px; border-radius: var(--r); color: var(--ink2); font-size: 12px; font-weight: 500; text-decoration: none; transition: all .15s; }
.ws-sidebar-link:hover { background: var(--bg2); color: var(--ink); }
.ws-sidebar-link--active, .ws-sidebar-link.router-link-active { background: var(--green-soft); color: #065f46; font-weight: 700; box-shadow: inset 3px 0 0 var(--green); }
.ws-sidebar-stats { background: linear-gradient(140deg, var(--green) 0%, var(--green-dk) 100%); border-radius: var(--r-md); padding: 14px 12px; color: #fff; box-shadow: 0 4px 14px rgba(16,185,129,.3); }
.ws-sidebar-stats__title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; opacity: .8; margin-bottom: 10px; }
.ws-sidebar-stats__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.ws-stat-mini { text-align: center; background: rgba(255,255,255,.15); border-radius: var(--r); padding: 8px 4px; }
.ws-stat-mini__val { font-size: 22px; font-weight: 900; font-family: 'Fraunces', serif; line-height: 1; }
.ws-stat-mini__lbl { font-size: 9px; font-weight: 600; opacity: .8; }
.ws-sidebar-section { display: flex; flex-direction: column; gap: 4px; }
.ws-spin-wrap { display: flex; justify-content: center; padding: 10px; }
.ws-team-list { display: flex; flex-direction: column; gap: 3px; }
.ws-team-btn { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: var(--r); border: 1px solid transparent; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; text-align: left; width: 100%; transition: all .15s; }
.ws-team-btn:hover { background: var(--bg2); }
.ws-team-btn.active { background: var(--green-soft); border-color: rgba(16,185,129,.2); }
.ws-team-ava { width: 28px; height: 28px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
.ws-team-ava--member { background: var(--green-soft); color: #065f46; }
.ws-team-ava--admin { background: var(--amber-soft); color: #92400e; }
.ws-team-btn__body { flex: 1; min-width: 0; }
.ws-team-btn__name { font-size: 11px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }
.ws-team-btn__role { font-size: 9px; font-weight: 700; text-transform: uppercase; }
.role-member { color: var(--green); }
.role-admin { color: var(--amber); }
.ws-sidebar-empty { font-size: 11px; color: var(--ink3); text-align: center; padding: 10px; }
.ws-ws-filter-list { display: flex; flex-direction: column; gap: 1px; max-height: 180px; overflow-y: auto; }
.ws-ws-filter-item { display: flex; align-items: center; gap: 7px; padding: 5px 8px; border-radius: var(--r-sm); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--ink2); text-align: left; width: 100%; transition: all .15s; }
.ws-ws-filter-item:hover { background: var(--bg2); color: var(--ink); }
.ws-ws-filter-item.active { background: var(--green-soft); color: #065f46; font-weight: 600; }
.ws-ws-filter-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.ws-ws-filter-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-ws-check { color: var(--green); font-size: 10px; }
.ws-tips { display: flex; flex-direction: column; gap: 4px; padding: 10px; background: var(--bg2); border-radius: var(--r); }
.ws-tip { font-size: 10px; color: var(--ink2); line-height: 1.4; }

/* Main */
.ws-main { padding: 24px; overflow-y: auto; background: var(--bg); }
.ws-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 10px; color: var(--ink3); text-align: center; }
.ws-empty-state__icon { width: 64px; height: 64px; background: var(--green-soft); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; color: var(--green); margin-bottom: 6px; }
.ws-empty-state h3 { font-size: 17px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.ws-empty-state p { font-size: 13px; color: var(--ink2); max-width: 260px; line-height: 1.5; }
.ws-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; background: var(--white); border-radius: var(--r-md); border: 1px solid var(--border); gap: 12px; }
.ws-loading p { font-size: 13px; color: var(--ink2); }
.ws-page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.ws-page-title { font-size: 26px; font-weight: 900; color: var(--ink); font-family: 'Fraunces', serif; letter-spacing: -.5px; margin-bottom: 3px; }
.ws-page-sub { font-size: 13px; color: var(--ink2); }
.ws-howto { display: flex; align-items: center; gap: 10px; background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px 18px; margin-bottom: 18px; box-shadow: var(--sh-xs); flex-wrap: wrap; }
.ws-howto__step { display: flex; align-items: center; gap: 9px; }
.ws-howto__num { width: 26px; height: 26px; border-radius: 50%; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
.ws-howto__t { font-size: 11px; font-weight: 700; color: var(--ink); margin-bottom: 1px; }
.ws-howto__s { font-size: 10px; color: var(--ink3); }
.ws-howto__arrow { font-size: 14px; color: var(--ink4); }
.ws-controls { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.ws-search { flex: 1; max-width: 320px; position: relative; display: flex; align-items: center; }
.ws-search > svg { position: absolute; left: 11px; color: var(--ink3); pointer-events: none; }
.ws-search-input { width: 100%; height: 36px; padding: 0 28px 0 34px; border: 1px solid var(--border); border-radius: var(--r); font-size: 12px; font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); outline: none; transition: all .2s; box-shadow: var(--sh-xs); }
.ws-search-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
.ws-search-input::placeholder { color: var(--ink4); }
.ws-search-clear { position: absolute; right: 10px; color: var(--ink3); font-size: 10px; cursor: pointer; }
.ws-type-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.ws-type-tab { padding: 4px 11px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 10px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.ws-type-tab:hover { border-color: var(--green); color: var(--green); }
.ws-type-tab.active { background: var(--green); color: #fff; border-color: var(--green); }

/* Cards */
.ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 14px; }
.ws-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px; cursor: pointer; transition: all .22s var(--ease); display: flex; flex-direction: column; gap: 10px; position: relative; overflow: hidden; box-shadow: var(--sh-xs); }
.ws-card:hover { transform: translateY(-3px); box-shadow: var(--sh-lg); border-color: transparent; }
.ws-card__stripe { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.ws-card__head { display: flex; align-items: center; }
.ws-type-chip { padding: 3px 9px; border-radius: var(--r-sm); font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; font-family: 'DM Mono', monospace; }
.ws-card__body { flex: 1; min-width: 0; }
.ws-card__title { font-size: 14px; font-weight: 700; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-card__desc { font-size: 11px; color: var(--ink2); line-height: 1.5; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.ws-card__actions { display: flex; gap: 5px; }
.ws-pill-btn { display: flex; align-items: center; gap: 3px; padding: 4px 9px; border-radius: 999px; border: none; font-size: 10px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.ws-pill-btn--view { background: var(--bg2); color: var(--ink2); } .ws-pill-btn--view:hover { background: var(--ink); color: #fff; }
.ws-pill-btn--contribute { background: var(--green-soft); color: var(--green-dk); } .ws-pill-btn--contribute:hover { background: var(--green); color: #fff; }
.ws-pill-btn--dl { background: var(--primary-soft); color: var(--primary); } .ws-pill-btn--dl:hover { background: var(--primary); color: #fff; }
.ws-card__foot { display: flex; align-items: center; padding-top: 8px; border-top: 1px solid var(--border2); }
.ws-card__by { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--ink2); font-weight: 600; }
.ws-ava { width: 18px; height: 18px; border-radius: 50%; background: var(--green-soft); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 800; color: #065f46; }

/* Buttons */
.ws-btn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: var(--r); font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s var(--ease); border: none; outline: none; white-space: nowrap; text-decoration: none; }
.ws-btn:disabled { opacity: .5; cursor: not-allowed; }
.ws-btn--ghost { background: var(--white); border: 1px solid var(--border); color: var(--ink2); box-shadow: var(--sh-xs); }
.ws-btn--ghost:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-btn--green { background: var(--green); color: #fff; }
.ws-btn--green:hover:not(:disabled) { background: var(--green-dk); transform: translateY(-1px); }
.ws-btn--sm { height: 28px; padding: 0 10px; font-size: 11px; }

/* Spinners */
.ws-spin { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: _spin .65s linear infinite; }
.ws-spin--sm { width: 16px; height: 16px; border-width: 2px; }
.ws-spin--white { border-color: rgba(255,255,255,.3); border-top-color: #fff; }
.ws-spin--light { border-color: rgba(255,255,255,.2); border-top-color: rgba(255,255,255,.8); }
@keyframes _spin { to { transform: rotate(360deg); } }

/* Editor Shell */
.ws-editor-shell { display: grid; grid-template-columns: 248px 1fr; height: calc(100vh - 58px); overflow: hidden; }
.ws-editor-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 18px 13px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
.ws-back-btn { display: flex; align-items: center; gap: 6px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r); padding: 7px 13px; font-size: 11px; font-weight: 600; color: var(--ink2); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.ws-back-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-editor-meta .ws-type-pill { display: inline-flex; padding: 3px 9px; border-radius: var(--r-sm); font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; font-family: 'DM Mono', monospace; }
.ws-editor-title { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin: 7px 0 4px; line-height: 1.25; }
.ws-editor-desc { font-size: 11px; color: var(--ink2); line-height: 1.5; }
.ws-section-label { font-size: 9px; font-weight: 800; color: var(--ink3); text-transform: uppercase; letter-spacing: .8px; }
.ws-tab-group { display: flex; flex-direction: column; gap: 4px; }
.ws-tab { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; text-align: left; box-shadow: var(--sh-xs); }
.ws-tab:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-tab.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.ws-tab--green.active { background: var(--green); border-color: var(--green); }
.ws-action-btn { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; box-shadow: var(--sh-xs); }
.ws-action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-editor-main { overflow: hidden; display: flex; flex-direction: column; height: 100%; background: #0c1220; }
.ws-view-pane { flex: 1; overflow: auto; padding: 20px; }
.ws-center-spin { display: flex; justify-content: center; align-items: center; padding: 50px 0; }
.ws-code-block { border-radius: var(--r-md); overflow: hidden; background: #111827; border: 1px solid #1e2d3d; }
.ws-code-header { display: flex; align-items: center; gap: 9px; padding: 11px 16px; background: #1a2333; border-bottom: 1px solid #1e2d3d; }
.ws-mac-dots { display: flex; gap: 5px; }
.ws-mac-dots span { width: 10px; height: 10px; border-radius: 50%; }
.ws-mac-dots span:nth-child(1) { background: #ff5f57; } .ws-mac-dots span:nth-child(2) { background: #febc2e; } .ws-mac-dots span:nth-child(3) { background: #28c840; }
.ws-code-lang { font-size: 10px; font-weight: 600; color: #6b7fa3; font-family: 'DM Mono', monospace; flex: 1; }
.ws-copy-btn { padding: 3px 10px; background: #1e2d3d; border: 1px solid #2a3a4d; border-radius: var(--r-sm); font-size: 10px; color: #6b7fa3; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all .15s; }
.ws-copy-btn:hover { background: var(--green); color: #fff; border-color: var(--green); }
.ws-code-pre { padding: 20px; margin: 0; overflow-x: auto; }
.ws-code-pre code { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.7; color: #cdd6f4; white-space: pre; }
.ws-edit-pane { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.ws-edit-header { padding: 10px 18px; background: #1a2333; border-bottom: 1px solid #1e2d3d; }
.ws-edit-info--green { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #8a9abb; background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.18); padding: 7px 11px; border-radius: var(--r-sm); }
.ws-edit-info--green strong { color: #5eead4; }
.ws-split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
.ws-split-panel { display: flex; flex-direction: column; overflow: hidden; }
.ws-split-panel--input { border-right: 1px solid #1e2d3d; }
.ws-panel-label { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #1a2333; flex-shrink: 0; border-bottom: 1px solid #1e2d3d; }
.ws-panel-label > span:first-child { font-size: 10px; font-weight: 700; color: #6b7fa3; text-transform: uppercase; letter-spacing: .6px; }
.ws-char-count { font-size: 9px; color: #3d5570; }
.ws-textarea { flex: 1; resize: none; border: none; outline: none; background: #0c1220; color: #cdd6f4; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.7; padding: 20px; tab-size: 2; caret-color: var(--green); }
.ws-textarea::placeholder { color: #2a3a4d; }
.ws-contrib-footer { padding: 10px 16px; background: #1a2333; border-top: 1px solid #1e2d3d; display: flex; flex-direction: column; gap: 7px; }
.ws-contrib-footer__actions { display: flex; gap: 7px; justify-content: flex-end; }
.ws-err-msg { font-size: 10px; color: #f87171; font-weight: 600; }
.ws-preview-pre { flex: 1; margin: 0; overflow: auto; background: #0c1220; }
.ws-preview-pre code { display: block; font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.7; color: #44596b; padding: 20px; white-space: pre; }

/* Right Sidebar */
.ws-right-sidebar { background: var(--white); border-left: 1px solid var(--border); padding: 18px 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
.ws-right-sidebar__head { }
.ws-right-sidebar__head h3 { font-size: 13px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 2px; }
.ws-right-sidebar__head p { font-size: 10px; color: var(--ink3); }
.ws-right-ws-list { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.ws-right-ws-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: var(--r); cursor: pointer; transition: background .15s; border: 1px solid transparent; }
.ws-right-ws-item:hover { background: var(--bg2); }
.ws-right-ws-item.selected { background: var(--green-soft); border-color: rgba(16,185,129,.2); }
.ws-right-ws-dot { width: 30px; height: 30px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ws-right-ws-info { flex: 1; min-width: 0; }
.ws-right-ws-name { font-size: 11px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-right-ws-type { font-size: 9px; color: var(--ink3); }
.ws-right-contribute-btn { width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--border); background: none; color: var(--ink3); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all .15s; flex-shrink: 0; }
.ws-right-ws-item:hover .ws-right-contribute-btn { opacity: 1; }
.ws-right-contribute-btn:hover { background: var(--green-soft); color: var(--green-dk); border-color: var(--green); }
.ws-right-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px 0; gap: 8px; color: var(--ink3); }
.ws-right-empty p { font-size: 11px; }
.ws-right-sidebar__footer { margin-top: auto; border-top: 1px solid var(--border2); padding-top: 12px; display: flex; flex-direction: column; gap: 4px; }
.ws-right-action { width: 100%; display: flex; align-items: center; gap: 7px; padding: 8px 11px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; box-shadow: var(--sh-xs); text-decoration: none; }
.ws-right-action:hover { border-color: var(--green); color: var(--green-dk); background: var(--green-soft); }

/* Toast */
.ws-toast { position: fixed; bottom: 22px; right: 22px; display: flex; align-items: center; gap: 9px; padding: 11px 16px; background: var(--white); border-radius: var(--r-md); box-shadow: var(--sh-xl); font-size: 12px; font-weight: 600; z-index: 2000; border: 1px solid var(--border); min-width: 230px; }
.ws-toast__icon { width: 24px; height: 24px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px; font-weight: 800; }
.ws-toast--success { border-left: 3px solid var(--green); } .ws-toast--success .ws-toast__icon { background: var(--green-soft); color: var(--green); }
.ws-toast--error { border-left: 3px solid var(--red); } .ws-toast--error .ws-toast__icon { background: var(--red-soft); color: var(--red); }
.toast-enter-active, .toast-leave-active { transition: all .3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px) scale(.97); }

/* Responsive */
@media (max-width: 1200px) { .ws-layout { grid-template-columns: 210px 1fr; } .ws-right-sidebar { display: none; } .ws-editor-shell { grid-template-columns: 210px 1fr; } }
@media (max-width: 900px) { .ws-layout { grid-template-columns: 1fr; } .ws-sidebar { display: none; } .ws-editor-shell { grid-template-columns: 1fr; } .ws-editor-sidebar { display: none; } .ws-split { grid-template-columns: 1fr; } .ws-split-panel--input { border-right: none; border-bottom: 1px solid #1e2d3d; height: 50%; } }
@media (max-width: 640px) { .ws-grid { grid-template-columns: 1fr; } .ws-main { padding: 14px; } }
</style>