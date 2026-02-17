<!-- TeamWorkspaceHub.vue — Role-aware team workspace hub -->
<!-- Uses same API as Teams.vue: apiRequest('/v1/dashboard/teams/joined') -->
<!-- Team fields from API: teamId, teamName, myRole ('ADMIN'|'MEMBER'), description, memberCount -->
<template>
  <div class="hub-root">
    <!-- Header -->
    <header class="hub-header">
      <div class="hub-header__inner">
        <div class="hub-brand">
          <div class="hub-brand__icon">
            <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <rect x="8" y="8" width="26" height="26" rx="3" stroke="white" stroke-width="2"/>
              <path d="M21 13v16M13 21h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="hub-brand__text">
            <span class="hub-brand__name">NovaSpace</span>
            <span class="hub-brand__sub">Team WorkSpace</span>
          </div>
        </div>
        <div class="hub-header__center">
          <div class="hub-breadcrumb">
            <router-link to="/dashboard" class="hub-breadcrumb__item">Dashboard</router-link>
            <span class="hub-breadcrumb__sep">›</span>
            <span class="hub-breadcrumb__item hub-breadcrumb__item--active">Team WorkSpace</span>
          </div>
        </div>
        <div class="hub-header__actions">
          <router-link to="/dashboard" class="hub-btn hub-btn--ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main -->
    <div class="hub-body">
      <!-- Hero -->
      <div class="hub-hero">
        <div class="hub-hero__badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
          {{ teams.length }} team{{ teams.length !== 1 ? 's' : '' }} found
        </div>
        <h1 class="hub-hero__title">Team WorkSpace Hub</h1>
        <p class="hub-hero__sub">Select a team to browse, contribute, or manage workspaces based on your role</p>
        <div class="hub-legend">
          <div class="hub-legend__item">
            <span class="hub-badge hub-badge--admin">Admin</span>
            <span>Create &amp; manage workspaces, approve contributions</span>
          </div>
          <div class="hub-legend__divider"></div>
          <div class="hub-legend__item">
            <span class="hub-badge hub-badge--member">Member</span>
            <span>Browse workspaces &amp; submit contributions</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingTeams" class="hub-loading">
        <div class="hub-spinner"></div>
        <p>Loading your teams…</p>
      </div>

      <!-- No teams -->
      <div v-else-if="teams.length === 0" class="hub-empty">
        <div class="hub-empty__icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/></svg>
        </div>
        <h3>No Teams Found</h3>
        <p>You're not a member of any team yet. Ask someone to invite you or create a team.</p>
        <router-link to="/teams" class="hub-btn hub-btn--primary">Go to Teams</router-link>
      </div>

      <!-- Teams content -->
      <div v-else class="hub-section">
        <!-- Search & filter -->
        <div class="hub-controls">
          <div class="hub-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input v-model="searchQuery" type="text" placeholder="Search teams…" class="hub-search__input" />
            <span v-if="searchQuery" class="hub-search__clear" @click="searchQuery = ''">✕</span>
          </div>
          <div class="hub-filter-tabs">
            <button :class="['hub-filter-tab', { active: roleFilter === 'all' }]" @click="roleFilter = 'all'">All</button>
            <button :class="['hub-filter-tab hub-filter-tab--admin', { active: roleFilter === 'admin' }]" @click="roleFilter = 'admin'">Admin Only</button>
            <button :class="['hub-filter-tab hub-filter-tab--member', { active: roleFilter === 'member' }]" @click="roleFilter = 'member'">Member Only</button>
          </div>
        </div>

        <!-- Summary bar -->
        <div class="hub-summary">
          <div class="hub-summary__stat">
            <span class="hub-summary__num hub-summary__num--admin">{{ adminTeams.length }}</span>
            <span class="hub-summary__label">Admin Teams</span>
          </div>
          <div class="hub-summary__divider"></div>
          <div class="hub-summary__stat">
            <span class="hub-summary__num hub-summary__num--member">{{ memberTeams.length }}</span>
            <span class="hub-summary__label">Member Teams</span>
          </div>
          <div class="hub-summary__divider"></div>
          <div class="hub-summary__stat">
            <span class="hub-summary__num">{{ teams.length }}</span>
            <span class="hub-summary__label">Total</span>
          </div>
        </div>

        <!-- No search results -->
        <div v-if="filteredTeams.length === 0" class="hub-no-results">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <p>No teams match your search</p>
        </div>

        <!-- ── ADMIN TEAMS ── -->
        <template v-if="roleFilter !== 'member' && visibleAdminTeams.length > 0">
          <div class="hub-section-header">
            <div class="hub-section-header__left">
              <div class="hub-section-icon hub-section-icon--admin">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div>
                <h2 class="hub-section-title">Teams You Admin</h2>
                <p class="hub-section-sub">Full access — create workspaces, approve contributions</p>
              </div>
            </div>
            <span class="hub-section-count hub-section-count--admin">{{ visibleAdminTeams.length }}</span>
          </div>

          <div class="hub-team-grid">
            <div
              v-for="team in visibleAdminTeams"
              :key="team.teamId"
              :class="['hub-team-card hub-team-card--admin', { 'hub-team-card--selected': selectedTeam && selectedTeam.teamId === team.teamId }]"
              @click="selectedTeam = team; showActionPanel = true"
            >
              <div class="hub-team-card__glow hub-team-card__glow--admin"></div>
              <div class="hub-team-card__top">
                <div class="hub-team-avatar hub-team-avatar--admin">{{ (team.teamName || 'T')[0].toUpperCase() }}</div>
                <div class="hub-team-card__role-badge hub-team-card__role-badge--admin">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Admin
                </div>
              </div>
              <div class="hub-team-card__body">
                <h3 class="hub-team-card__name">{{ team.teamName }}</h3>
                <p class="hub-team-card__desc">{{ team.description || 'Manage this team\'s workspaces' }}</p>
              </div>
              <div class="hub-team-card__members-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
                {{ team.memberCount || 0 }} {{ team.memberCount === 1 ? 'member' : 'members' }}
              </div>
              <div class="hub-team-card__capabilities">
                <span class="hub-cap hub-cap--green">✓ Browse</span>
                <span class="hub-cap hub-cap--green">✓ Contribute</span>
                <span class="hub-cap hub-cap--amber">✓ Admin Panel</span>
              </div>
              <div class="hub-team-card__actions">
                <button class="hub-action-btn hub-action-btn--browse" @click.stop="goTo('browse', team)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Browse
                </button>
                <button class="hub-action-btn hub-action-btn--contribute" @click.stop="goTo('contribute', team)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Contribute
                </button>
                <button class="hub-action-btn hub-action-btn--admin" @click.stop="goTo('admin', team)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/></svg>
                  Admin Panel
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- ── MEMBER TEAMS ── -->
        <template v-if="roleFilter !== 'admin' && visibleMemberTeams.length > 0">
          <div class="hub-section-header" :style="visibleAdminTeams.length > 0 && roleFilter !== 'member' ? { marginTop: '36px' } : {}">
            <div class="hub-section-header__left">
              <div class="hub-section-icon hub-section-icon--member">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <h2 class="hub-section-title">Teams You're a Member Of</h2>
                <p class="hub-section-sub">Browse workspaces and submit contributions for review</p>
              </div>
            </div>
            <span class="hub-section-count hub-section-count--member">{{ visibleMemberTeams.length }}</span>
          </div>

          <div class="hub-team-grid">
            <div
              v-for="team in visibleMemberTeams"
              :key="team.teamId"
              :class="['hub-team-card hub-team-card--member', { 'hub-team-card--selected': selectedTeam && selectedTeam.teamId === team.teamId }]"
              @click="selectedTeam = team; showActionPanel = true"
            >
              <div class="hub-team-card__glow hub-team-card__glow--member"></div>
              <div class="hub-team-card__top">
                <div class="hub-team-avatar hub-team-avatar--member">{{ (team.teamName || 'T')[0].toUpperCase() }}</div>
                <div class="hub-team-card__role-badge hub-team-card__role-badge--member">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  Member
                </div>
              </div>
              <div class="hub-team-card__body">
                <h3 class="hub-team-card__name">{{ team.teamName }}</h3>
                <p class="hub-team-card__desc">{{ team.description || 'Browse and contribute to workspaces' }}</p>
              </div>
              <div class="hub-team-card__members-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
                {{ team.memberCount || 0 }} {{ team.memberCount === 1 ? 'member' : 'members' }}
              </div>
              <div class="hub-team-card__capabilities">
                <span class="hub-cap hub-cap--green">✓ Browse</span>
                <span class="hub-cap hub-cap--green">✓ Contribute</span>
                <span class="hub-cap hub-cap--muted">✗ Admin Panel</span>
              </div>
              <div class="hub-team-card__actions">
                <button class="hub-action-btn hub-action-btn--browse" @click.stop="goTo('browse', team)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Browse
                </button>
                <button class="hub-action-btn hub-action-btn--contribute" @click.stop="goTo('contribute', team)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Contribute
                </button>
                <button class="hub-action-btn hub-action-btn--disabled" disabled title="Admin access required">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  No Access
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Floating Action Panel -->
    <transition name="panel-slide">
      <div v-if="showActionPanel && selectedTeam" class="hub-action-panel">
        <div class="hub-action-panel__header">
          <div class="hub-action-panel__team">
            <div :class="['hub-action-panel__avatar', selectedTeam.myRole === 'ADMIN' ? 'avatar--admin' : 'avatar--member']">
              {{ (selectedTeam.teamName || 'T')[0].toUpperCase() }}
            </div>
            <div>
              <h4>{{ selectedTeam.teamName }}</h4>
              <span :class="['hub-panel-role', selectedTeam.myRole === 'ADMIN' ? 'hub-panel-role--admin' : 'hub-panel-role--member']">
                {{ selectedTeam.myRole === 'ADMIN' ? '★ Admin' : '● Member' }}
              </span>
            </div>
          </div>
          <button class="hub-panel-close" @click="showActionPanel = false; selectedTeam = null">✕</button>
        </div>
        <div class="hub-action-panel__body">
          <p class="hub-action-panel__prompt">Where would you like to go?</p>
          <button class="hub-panel-action" @click="goTo('browse', selectedTeam)">
            <div class="hub-panel-action__icon hub-panel-action__icon--browse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="hub-panel-action__text">
              <span class="hub-panel-action__label">Browse Workspaces</span>
              <span class="hub-panel-action__desc">View all shared workspaces</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="hub-panel-action" @click="goTo('contribute', selectedTeam)">
            <div class="hub-panel-action__icon hub-panel-action__icon--contribute">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="hub-panel-action__text">
              <span class="hub-panel-action__label">Submit Contribution</span>
              <span class="hub-panel-action__desc">Contribute code or content for review</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button
            :class="['hub-panel-action', { 'hub-panel-action--locked': selectedTeam.myRole !== 'ADMIN' }]"
            @click="selectedTeam.myRole === 'ADMIN' ? goTo('admin', selectedTeam) : null"
            :disabled="selectedTeam.myRole !== 'ADMIN'"
          >
            <div :class="['hub-panel-action__icon', selectedTeam.myRole === 'ADMIN' ? 'hub-panel-action__icon--admin' : 'hub-panel-action__icon--locked']">
              <svg v-if="selectedTeam.myRole === 'ADMIN'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="hub-panel-action__text">
              <span class="hub-panel-action__label">Admin Panel</span>
              <span class="hub-panel-action__desc">{{ selectedTeam.myRole === 'ADMIN' ? 'Manage workspaces & approvals' : 'Requires admin role' }}</span>
            </div>
            <svg v-if="selectedTeam.myRole === 'ADMIN'" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </transition>
    <div v-if="showActionPanel" class="hub-backdrop" @click="showActionPanel = false; selectedTeam = null"></div>
  </div>
</template>

<script>
import { apiRequest } from '@/utils/apiService';

export default {
  name: 'TeamWorkspaceHub',
  data() {
    return {
      teams: [],
      loadingTeams: false,
      searchQuery: '',
      roleFilter: 'all',
      selectedTeam: null,
      showActionPanel: false,
    };
  },
  computed: {
    adminTeams() {
      return this.teams.filter(t => t.myRole === 'ADMIN');
    },
    memberTeams() {
      return this.teams.filter(t => t.myRole !== 'ADMIN');
    },
    filteredTeams() {
      let list = [...this.teams];
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(t =>
          (t.teamName || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
        );
      }
      if (this.roleFilter === 'admin') list = list.filter(t => t.myRole === 'ADMIN');
      if (this.roleFilter === 'member') list = list.filter(t => t.myRole !== 'ADMIN');
      return list;
    },
    visibleAdminTeams() {
      return this.filteredTeams.filter(t => t.myRole === 'ADMIN');
    },
    visibleMemberTeams() {
      return this.filteredTeams.filter(t => t.myRole !== 'ADMIN');
    },
  },
  methods: {
    async loadTeams() {
      try {
        this.loadingTeams = true;
        // ✅ Exact same API call as Teams.vue
        const response = await apiRequest('/v1/dashboard/teams/joined', { method: 'GET' });
        const data = await response.json();
        this.teams = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error('Failed to load teams:', e);
        this.teams = [];
      } finally {
        this.loadingTeams = false;
      }
    },
    goTo(destination, team) {
      // Save team so workspace pages can auto-select it on load
      sessionStorage.setItem('selectedTeamId', team.teamId);
      sessionStorage.setItem('selectedTeam', JSON.stringify(team));

      if (destination === 'browse') {
        this.$router.push('/team-workspace-browse');
      } else if (destination === 'contribute') {
        this.$router.push('/team-workspace-members');
      } else if (destination === 'admin') {
        this.$router.push('/team-workspace-admin');
      }
    },
  },
  async mounted() {
    await this.loadTeams();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');
.hub-root{--ink:#0f172a;--ink-2:#475569;--ink-3:#94a3b8;--ink-4:#cbd5e1;--border:#e2e8f0;--border-2:#f1f5f9;--bg:#f8fafc;--bg-2:#f1f5f9;--white:#ffffff;--primary:#6366f1;--primary-dk:#4f46e5;--primary-lt:#818cf8;--primary-soft:#eef2ff;--green:#10b981;--green-soft:#d1fae5;--green-dk:#059669;--red:#ef4444;--red-soft:#fee2e2;--amber:#f59e0b;--amber-soft:#fef3c7;--amber-dk:#d97706;--shadow-xs:0 1px 2px rgba(15,23,42,0.05);--shadow-sm:0 1px 4px rgba(15,23,42,0.08),0 0 0 1px rgba(15,23,42,0.03);--shadow-md:0 4px 16px rgba(15,23,42,0.10),0 1px 4px rgba(15,23,42,0.05);--shadow-lg:0 12px 32px rgba(15,23,42,0.13),0 2px 8px rgba(15,23,42,0.07);--shadow-xl:0 24px 48px rgba(15,23,42,0.15),0 4px 12px rgba(15,23,42,0.08);--r-sm:6px;--r:10px;--r-md:14px;--r-lg:18px;--r-xl:24px;--ease:cubic-bezier(0.22,1,0.36,1);min-height:100vh;background:var(--bg);font-family:'DM Sans',system-ui,sans-serif;font-size:14px;color:var(--ink);-webkit-font-smoothing:antialiased;}
.hub-root*{box-sizing:border-box;margin:0;padding:0;}
.hub-header{background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);height:60px;position:sticky;top:0;z-index:200;}
.hub-header__inner{height:100%;padding:0 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.hub-brand{display:flex;align-items:center;gap:10px;flex-shrink:0;user-select:none;}
.hub-brand__icon{display:flex;filter:drop-shadow(0 2px 8px rgba(99,102,241,0.28));}
.hub-brand__text{display:flex;flex-direction:column;line-height:1.2;}
.hub-brand__name{font-size:15px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;letter-spacing:-0.3px;}
.hub-brand__sub{font-size:10px;font-weight:600;color:var(--ink-3);}
.hub-breadcrumb{display:flex;align-items:center;gap:6px;font-size:13px;}
.hub-breadcrumb__item{color:var(--ink-3);text-decoration:none;font-weight:500;transition:color 0.15s;}
.hub-breadcrumb__item:hover{color:var(--primary);}
.hub-breadcrumb__item--active{color:var(--ink);font-weight:700;}
.hub-breadcrumb__sep{color:var(--ink-4);}
.hub-btn{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 16px;border-radius:var(--r);font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s var(--ease);border:none;outline:none;white-space:nowrap;text-decoration:none;}
.hub-btn--ghost{background:var(--white);border:1px solid var(--border);color:var(--ink-2);box-shadow:var(--shadow-xs);}
.hub-btn--ghost:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-soft);}
.hub-btn--primary{background:var(--primary);color:var(--white);}
.hub-btn--primary:hover{background:var(--primary-dk);transform:translateY(-1px);}
.hub-body{max-width:1200px;margin:0 auto;padding:40px 28px 80px;}
.hub-hero{text-align:center;margin-bottom:40px;}
.hub-hero__badge{display:inline-flex;align-items:center;gap:7px;background:var(--primary-soft);border:1px solid rgba(99,102,241,0.2);border-radius:999px;padding:5px 16px;font-size:12px;font-weight:700;color:var(--primary);margin-bottom:16px;}
.hub-hero__title{font-size:40px;font-weight:900;color:var(--ink);font-family:'Fraunces',serif;letter-spacing:-1px;line-height:1.1;margin-bottom:10px;}
.hub-hero__sub{font-size:16px;color:var(--ink-2);max-width:480px;margin:0 auto 24px;line-height:1.6;}
.hub-legend{display:inline-flex;align-items:center;gap:16px;background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);padding:10px 20px;font-size:12px;color:var(--ink-2);box-shadow:var(--shadow-xs);}
.hub-legend__item{display:flex;align-items:center;gap:8px;}
.hub-legend__divider{width:1px;height:18px;background:var(--border);}
.hub-badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:999px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;}
.hub-badge--admin{background:var(--amber-soft);color:#92400e;}
.hub-badge--member{background:var(--primary-soft);color:var(--primary);}
.hub-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;gap:16px;color:var(--ink-3);}
.hub-loading p{font-size:14px;}
.hub-spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 0.65s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.hub-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:340px;gap:14px;text-align:center;background:var(--white);border:1px dashed var(--border);border-radius:var(--r-xl);padding:60px;}
.hub-empty__icon{width:80px;height:80px;background:var(--bg-2);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;color:var(--ink-3);margin-bottom:8px;}
.hub-empty h3{font-size:20px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;}
.hub-empty p{font-size:14px;color:var(--ink-2);max-width:280px;line-height:1.6;}
.hub-controls{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap;}
.hub-search{flex:1;max-width:380px;position:relative;display:flex;align-items:center;}
.hub-search>svg{position:absolute;left:12px;color:var(--ink-3);pointer-events:none;}
.hub-search__input{width:100%;height:40px;padding:0 34px 0 40px;border:1px solid var(--border);border-radius:var(--r);font-size:13px;font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink);outline:none;transition:all 0.2s;box-shadow:var(--shadow-xs);}
.hub-search__input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.12);}
.hub-search__input::placeholder{color:var(--ink-4);}
.hub-search__clear{position:absolute;right:11px;color:var(--ink-3);font-size:11px;cursor:pointer;}
.hub-filter-tabs{display:flex;gap:4px;}
.hub-filter-tab{padding:7px 14px;border-radius:var(--r);border:1px solid var(--border);background:var(--white);color:var(--ink-2);font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;}
.hub-filter-tab:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-soft);}
.hub-filter-tab.active{background:var(--primary);color:var(--white);border-color:var(--primary);}
.hub-filter-tab--admin.active{background:var(--amber);border-color:var(--amber);}
.hub-summary{display:flex;align-items:center;background:var(--white);border:1px solid var(--border);border-radius:var(--r-md);padding:14px 24px;margin-bottom:28px;box-shadow:var(--shadow-xs);}
.hub-summary__stat{display:flex;align-items:center;gap:10px;flex:1;justify-content:center;}
.hub-summary__num{font-size:24px;font-weight:900;color:var(--ink);font-family:'Fraunces',serif;}
.hub-summary__num--admin{color:var(--amber-dk);}
.hub-summary__num--member{color:var(--primary);}
.hub-summary__label{font-size:12px;color:var(--ink-2);font-weight:600;}
.hub-summary__divider{width:1px;height:32px;background:var(--border);}
.hub-no-results{display:flex;align-items:center;gap:10px;justify-content:center;padding:40px;color:var(--ink-3);font-size:14px;}
.hub-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.hub-section-header__left{display:flex;align-items:center;gap:12px;}
.hub-section-icon{width:36px;height:36px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;}
.hub-section-icon--admin{background:var(--amber-soft);color:#92400e;}
.hub-section-icon--member{background:var(--primary-soft);color:var(--primary);}
.hub-section-title{font-size:18px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;margin-bottom:2px;}
.hub-section-sub{font-size:12px;color:var(--ink-3);}
.hub-section-count{font-size:13px;font-weight:800;padding:4px 12px;border-radius:999px;}
.hub-section-count--admin{background:var(--amber-soft);color:#92400e;}
.hub-section-count--member{background:var(--primary-soft);color:var(--primary);}
.hub-team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-bottom:8px;}
.hub-team-card{background:var(--white);border:1.5px solid var(--border);border-radius:var(--r-lg);padding:22px;cursor:pointer;transition:all 0.25s var(--ease);display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden;box-shadow:var(--shadow-xs);}
.hub-team-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);}
.hub-team-card--admin:hover,.hub-team-card--admin.hub-team-card--selected{border-color:rgba(245,158,11,0.4);}
.hub-team-card--member:hover,.hub-team-card--member.hub-team-card--selected{border-color:rgba(99,102,241,0.4);}
.hub-team-card__glow{position:absolute;top:0;left:0;right:0;height:3px;opacity:0;transition:opacity 0.25s;}
.hub-team-card:hover .hub-team-card__glow,.hub-team-card--selected .hub-team-card__glow{opacity:1;}
.hub-team-card__glow--admin{background:linear-gradient(90deg,var(--amber),#f97316);}
.hub-team-card__glow--member{background:linear-gradient(90deg,var(--primary),var(--primary-lt));}
.hub-team-card__top{display:flex;align-items:center;justify-content:space-between;}
.hub-team-avatar{width:44px;height:44px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;font-family:'Fraunces',serif;flex-shrink:0;}
.hub-team-avatar--admin{background:var(--amber-soft);color:#92400e;}
.hub-team-avatar--member{background:var(--primary-soft);color:var(--primary);}
.hub-team-card__role-badge{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;}
.hub-team-card__role-badge--admin{background:var(--amber-soft);color:#92400e;}
.hub-team-card__role-badge--member{background:var(--primary-soft);color:var(--primary);}
.hub-team-card__body{flex:1;}
.hub-team-card__name{font-size:16px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;margin-bottom:5px;line-height:1.25;}
.hub-team-card__desc{font-size:12px;color:var(--ink-2);line-height:1.5;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.hub-team-card__members-row{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink-3);}
.hub-team-card__capabilities{display:flex;gap:6px;flex-wrap:wrap;}
.hub-cap{font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;}
.hub-cap--green{background:var(--green-soft);color:var(--green-dk);}
.hub-cap--amber{background:var(--amber-soft);color:#92400e;}
.hub-cap--muted{background:var(--bg-2);color:var(--ink-4);}
.hub-team-card__actions{display:flex;gap:6px;}
.hub-action-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;height:32px;padding:0 10px;border-radius:var(--r);border:none;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;}
.hub-action-btn--browse{background:var(--primary-soft);color:var(--primary);}
.hub-action-btn--browse:hover{background:var(--primary);color:var(--white);}
.hub-action-btn--contribute{background:var(--green-soft);color:var(--green-dk);}
.hub-action-btn--contribute:hover{background:var(--green);color:var(--white);}
.hub-action-btn--admin{background:var(--amber-soft);color:#92400e;}
.hub-action-btn--admin:hover{background:var(--amber);color:var(--white);}
.hub-action-btn--disabled{background:var(--bg-2);color:var(--ink-4);cursor:not-allowed;opacity:0.7;}
.hub-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.3);backdrop-filter:blur(2px);z-index:300;}
.hub-action-panel{position:fixed;bottom:28px;right:28px;background:var(--white);border:1px solid var(--border);border-radius:var(--r-xl);box-shadow:var(--shadow-xl);z-index:400;width:340px;overflow:hidden;}
.hub-action-panel__header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 16px;border-bottom:1px solid var(--border-2);}
.hub-action-panel__team{display:flex;align-items:center;gap:12px;}
.hub-action-panel__avatar{width:40px;height:40px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;font-family:'Fraunces',serif;flex-shrink:0;}
.hub-action-panel__avatar.avatar--admin{background:var(--amber-soft);color:#92400e;}
.hub-action-panel__avatar.avatar--member{background:var(--primary-soft);color:var(--primary);}
.hub-action-panel__team h4{font-size:14px;font-weight:800;color:var(--ink);margin-bottom:3px;}
.hub-panel-role{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;}
.hub-panel-role--admin{color:#92400e;}
.hub-panel-role--member{color:var(--primary);}
.hub-panel-close{width:28px;height:28px;border-radius:50%;border:none;background:var(--bg-2);color:var(--ink-3);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.hub-panel-close:hover{background:var(--red-soft);color:var(--red);}
.hub-action-panel__body{padding:12px;display:flex;flex-direction:column;gap:6px;}
.hub-action-panel__prompt{font-size:11px;font-weight:700;color:var(--ink-3);text-transform:uppercase;letter-spacing:0.7px;padding:4px 8px;}
.hub-panel-action{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--r-md);border:1px solid transparent;background:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;text-align:left;width:100%;}
.hub-panel-action:not(:disabled):hover{background:var(--bg-2);border-color:var(--border);}
.hub-panel-action--locked{opacity:0.5;cursor:not-allowed;}
.hub-panel-action__icon{width:36px;height:36px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.hub-panel-action__icon--browse{background:var(--primary-soft);color:var(--primary);}
.hub-panel-action__icon--contribute{background:var(--green-soft);color:var(--green-dk);}
.hub-panel-action__icon--admin{background:var(--amber-soft);color:#92400e;}
.hub-panel-action__icon--locked{background:var(--bg-2);color:var(--ink-4);}
.hub-panel-action__text{flex:1;}
.hub-panel-action__label{display:block;font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px;}
.hub-panel-action__desc{display:block;font-size:11px;color:var(--ink-3);}
.hub-panel-action>svg:last-child{color:var(--ink-3);flex-shrink:0;}
.panel-slide-enter-active,.panel-slide-leave-active{transition:all 0.3s var(--ease);}
.panel-slide-enter-from,.panel-slide-leave-to{opacity:0;transform:translateY(16px) scale(0.97);}
@media(max-width:768px){.hub-body{padding:24px 16px 80px;}.hub-hero__title{font-size:28px;}.hub-team-grid{grid-template-columns:1fr;}.hub-controls{flex-direction:column;align-items:stretch;}.hub-search{max-width:100%;}.hub-action-panel{left:16px;right:16px;bottom:16px;width:auto;}.hub-legend{flex-direction:column;gap:8px;}.hub-legend__divider{width:100%;height:1px;}}
</style>