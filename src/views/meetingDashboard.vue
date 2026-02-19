<!-- MeetingsDashboard.vue — Aligned to MeetingController -->
<!--
  Endpoints used:
    GET    /api/meetings?limit=N&room=X       → meeting history
    DELETE /api/meetings/{code}               → end / delete meeting
    POST   /api/meetings/create  (restart)    → recreate room after end
    GET    /api/meetings/{code}/presence      → live participant list
    POST   /api/meetings/{code}/eject         → eject participants
    POST   /api/meetings/{code}/recording/start
    POST   /api/meetings/{code}/recording/stop
-->
<template>
  <div class="md-wrap">

    <!-- ── Nav ─────────────────────────────────────────────────────────────── -->
    <nav class="md-nav">
      <div class="md-nav-inner">
        <div class="md-nav-left">
          <router-link to="/dashboard" class="md-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Dashboard
          </router-link>
          <div class="md-nav-divider"></div>
          <div class="md-page-id">
            <div class="md-brand">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#4a90e2"/>
                <path d="M20 16L26 11V21L20 16Z" fill="white"/>
                <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
              </svg>
              <span class="md-brand-name">Nova</span>
            </div>
            <div class="md-page-meta">
              <span class="md-page-title">Video Meetings</span>
              <span class="md-page-sub">Manage your conferencing</span>
            </div>
          </div>
        </div>
        <div class="md-nav-right">
          <button class="md-btn md-btn--ghost" @click="joinMeeting">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Join meeting
          </button>
          <button class="md-btn md-btn--primary" @click="createMeeting">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New meeting
          </button>
        </div>
      </div>
    </nav>

    <!-- ── Main ──────────────────────────────────────────────────────────────── -->
    <main class="md-main">

      <div v-if="loading" class="md-state-panel">
        <div class="md-spinner"></div>
        <p class="md-state-text">Loading meetings…</p>
      </div>

      <div v-else-if="error" class="md-state-panel">
        <div class="md-state-icon md-state-icon--red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p class="md-state-text">{{ error }}</p>
        <button class="md-btn md-btn--primary" @click="fetchMeetingsData">Try again</button>
      </div>

      <div v-else class="md-content">

        <!-- ── Stats row ── -->
        <div class="md-stats-row">
          <div class="md-stat">
            <div class="md-stat-icon md-stat-icon--blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
            </div>
            <div class="md-stat-body">
              <span class="md-stat-label">Total meetings</span>
              <span class="md-stat-val">{{ allMeetings.length }}</span>
              <span class="md-stat-sub">All time</span>
            </div>
          </div>

          <div class="md-stat" :class="{ 'md-stat--live': activeMeetings.length > 0 }">
            <div class="md-stat-icon md-stat-icon--red">
              <span v-if="activeMeetings.length > 0" class="md-live-ring"></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
            </div>
            <div class="md-stat-body">
              <div class="md-stat-label-row">
                <span class="md-stat-label">Active now</span>
                <span v-if="activeMeetings.length > 0" class="md-live-chip">LIVE</span>
              </div>
              <span class="md-stat-val">{{ activeMeetings.length }}</span>
              <span class="md-stat-sub">{{ activeMeetings.length > 0 ? 'Meetings in progress' : 'No active meetings' }}</span>
            </div>
          </div>

          <div class="md-stat">
            <div class="md-stat-icon md-stat-icon--green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="md-stat-body">
              <span class="md-stat-label">Rooms created</span>
              <span class="md-stat-val">{{ allMeetings.length }}</span>
              <span class="md-stat-sub">Via Daily.co</span>
            </div>
          </div>

          <div class="md-stat">
            <div class="md-stat-icon md-stat-icon--amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div class="md-stat-body">
              <span class="md-stat-label">Recent activity</span>
              <span class="md-stat-val">{{ recentCount }}</span>
              <span class="md-stat-sub">Last 7 days</span>
            </div>
          </div>
        </div>

        <!-- ── Filter + Sort bar ── -->
        <div class="md-filters">
          <div class="md-filter-tabs">
            <button v-for="tab in filterTabs" :key="tab.value" class="md-tab" :class="{ 'md-tab--active': activeFilter === tab.value }" @click="setFilter(tab.value)">
              {{ tab.label }}
              <span v-if="tab.count > 0" class="md-tab-count">{{ tab.count }}</span>
            </button>
          </div>
          <div class="md-sort-wrap" ref="sortWrap">
            <button class="md-sort-btn" @click="toggleSortMenu">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
              {{ currentSort.label }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <transition name="md-drop">
              <div v-if="showSortMenu" class="md-sort-menu">
                <button v-for="opt in sortOptions" :key="opt.value" class="md-sort-opt" :class="{ 'md-sort-opt--active': currentSort.value === opt.value }" @click="setSortOption(opt)">
                  <svg v-if="currentSort.value === opt.value" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span v-else style="width:13px;display:inline-block"></span>
                  {{ opt.label }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- ── Body: list + sidebar ── -->
        <div class="md-body-grid">
          <div class="md-left-col">

            <!-- Active meetings banner -->
            <div v-if="activeMeetings.length > 0" class="md-panel md-active-panel">
              <div class="md-panel-hdr">
                <h2 class="md-panel-title">Active meetings</h2>
                <span class="md-live-badge"><span class="md-live-dot"></span>LIVE</span>
              </div>
              <div class="md-panel-body">
                <div class="md-active-list">
                  <div v-for="m in activeMeetings" :key="m.id" class="md-active-row">
                    <div class="md-active-pulse-wrap"><span class="md-active-pulse"></span></div>
                    <div class="md-active-info">
                      <div class="md-active-top">
                        <span class="md-active-title">{{ m.name }}</span>
                        <code class="md-active-code">{{ m.name }}</code>
                      </div>
                      <div class="md-active-meta">
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {{ getRelativeTime(m.created_at) }}
                        </span>
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {{ m.privacy || 'public' }}
                        </span>
                      </div>
                    </div>
                    <div class="md-active-actions">
                      <button class="md-join-now-btn" @click="joinMeetingWithCode(m.name)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Join
                      </button>
                      <button class="md-restart-btn-sm" @click="promptRestart(m)" title="Restart">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                        Restart
                      </button>
                      <button class="md-end-btn-sm" @click="promptEnd(m)" title="End meeting">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                        End
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Meeting cards panel -->
            <div class="md-panel md-list-panel">
              <div class="md-panel-hdr">
                <h2 class="md-panel-title">{{ getFilterTitle() }}</h2>
                <button class="md-refresh-btn" @click="fetchMeetingsData" :disabled="loading">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                  Refresh
                </button>
              </div>
              <div class="md-panel-body">

                <div v-if="filteredMeetings.length === 0" class="md-empty">
                  <div class="md-empty-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
                  </div>
                  <p class="md-empty-msg">{{ getEmptyStateMessage() }}</p>
                  <div class="md-empty-actions">
                    <button class="md-btn md-btn--primary" @click="createMeeting">New meeting</button>
                    <button class="md-btn md-btn--ghost" @click="joinMeeting">Join instead</button>
                  </div>
                </div>

                <div v-else class="md-card-grid">
                  <!-- Each card = one Daily room returned by GET /api/meetings -->
                  <div v-for="m in filteredMeetings" :key="m.id || m.name" class="md-mcard">
                    <div class="md-mcard-top">
                      <span class="md-status-chip" :class="getRoomStatusClass(m)">
                        <span v-if="isRoomActive(m)" class="md-status-dot"></span>
                        {{ getRoomStatusLabel(m) }}
                      </span>
                      <div class="md-mcard-topright">
                        <span class="md-privacy-chip" :class="m.privacy === 'private' ? 'md-privacy--private' : 'md-privacy--public'">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          {{ m.privacy || 'public' }}
                        </span>
                      </div>
                    </div>

                    <div class="md-mcard-body">
                      <h3 class="md-mcard-title">{{ m.name }}</h3>

                      <div class="md-mcard-code" @click="copyCode(m.name)" title="Click to copy">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <code>{{ m.name }}</code>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="md-copy-icon"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </div>

                      <div class="md-mcard-meta">
                        <span class="md-meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {{ formatRoomTime(m) }}
                        </span>
                        <span class="md-meta-item" v-if="m.url">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          <a :href="m.url" target="_blank" class="md-room-link">Open in Daily</a>
                        </span>
                      </div>
                    </div>

                    <div class="md-mcard-foot">
                      <div class="md-mcard-actions">
                        <button class="md-btn-join" @click="joinMeetingWithCode(m.name)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Join
                        </button>
                        <button class="md-btn-restart" @click="promptRestart(m)">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                          Restart
                        </button>
                        <button class="md-btn-end" @click="promptEnd(m)">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="md-sidebar">
            <div class="md-panel">
              <div class="md-panel-hdr"><h2 class="md-panel-title">Statistics</h2></div>
              <div class="md-panel-body">
                <div class="md-sidebar-stats">
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--blue">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ allMeetings.length }}</span>
                      <span class="md-ss-lbl">Total rooms</span>
                    </div>
                  </div>
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--red">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ activeMeetings.length }}</span>
                      <span class="md-ss-lbl">Active now</span>
                    </div>
                  </div>
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--purple">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ privateCount }}</span>
                      <span class="md-ss-lbl">Private rooms</span>
                    </div>
                  </div>
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--amber">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ recentCount }}</span>
                      <span class="md-ss-lbl">Last 7 days</span>
                    </div>
                  </div>
                </div>

                <!-- Activity chart -->
                <div class="md-chart-section">
                  <h3 class="md-chart-title">Meeting activity</h3>
                  <div class="md-chart">
                    <div v-for="(day, i) in activityData" :key="i" class="md-chart-col">
                      <div class="md-chart-track">
                        <div class="md-chart-bar" :style="{ height: day.percentage + '%' }"></div>
                      </div>
                      <span class="md-chart-lbl">{{ day.label }}</span>
                    </div>
                  </div>
                </div>

                <div class="md-quick-stats">
                  <div class="md-qs-row">
                    <span class="md-qs-lbl">Public rooms</span>
                    <span class="md-qs-val">{{ allMeetings.length - privateCount }}</span>
                  </div>
                  <div class="md-qs-row">
                    <span class="md-qs-lbl">Private rooms</span>
                    <span class="md-qs-val">{{ privateCount }}</span>
                  </div>
                  <div class="md-qs-row">
                    <span class="md-qs-lbl">Active rate</span>
                    <span class="md-qs-val">{{ allMeetings.length ? Math.round((activeMeetings.length / allMeetings.length) * 100) : 0 }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <!-- ── End Meeting Modal ─────────────────────────────────────────────────── -->
    <transition name="md-modal-fx">
      <div v-if="modal.show && modal.type === 'end'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--red">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h2 class="md-modal-title">Delete "{{ modal.meeting?.name }}"?</h2>
          <p class="md-modal-body">
            This calls <code>DELETE /api/meetings/{{ modal.meeting?.name }}</code> — the Daily room will be permanently removed and all participants disconnected.
          </p>
          <div class="md-modal-actions">
            <button class="md-modal-btn md-modal-btn--ghost" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-modal-btn md-modal-btn--danger" @click="confirmEnd" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-modal-spinner"></span>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              Delete for everyone
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── Restart Meeting Modal ──────────────────────────────────────────────── -->
    <transition name="md-modal-fx">
      <div v-if="modal.show && modal.type === 'restart'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--orange">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          </div>
          <h2 class="md-modal-title">Restart "{{ modal.meeting?.name }}"?</h2>
          <p class="md-modal-body">
            The room will be deleted then recreated with the same name. Participants can rejoin using the same code.
          </p>
          <div class="md-modal-actions">
            <button class="md-modal-btn md-modal-btn--ghost" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-modal-btn md-modal-btn--orange" @click="confirmRestart" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-modal-spinner"></span>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
              Restart meeting
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="md-toast-fx">
      <div v-if="toast.show" class="md-toast" :class="'md-toast--' + toast.type">
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<!-- MeetingsDashboard.vue — Jitsi aligned -->
<!-- Only the <script> section changes significantly; template & styles are identical to your original -->
<script>
import { TokenService, apiRequest } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

export default {
  name: 'MeetingsDashboard',

  data() {
    return {
      loading: true,
      error:   null,
      allMeetings:    [],
      activeMeetings: [],
      activityData:   [],

      activeFilter: 'all',
      filterTabs:   [
        { label: 'All',     value: 'all',     count: 0 },
        { label: 'Private', value: 'private', count: 0 },
        { label: 'Public',  value: 'public',  count: 0 },
      ],

      showSortMenu: false,
      currentSort: { label: 'Most recent', value: 'recent' },
      sortOptions: [
        { label: 'Most recent',  value: 'recent' },
        { label: 'Oldest first', value: 'oldest' },
        { label: 'Name A→Z',     value: 'name-asc' },
        { label: 'Name Z→A',     value: 'name-desc' },
      ],

      modal: { show: false, type: null, meeting: null, loading: false },
      toast: { show: false, message: '', type: 'success' },
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },

    filteredMeetings() {
      let list = [...this.allMeetings];
      if (this.activeFilter === 'private') list = list.filter(m => m.privacy === 'private');
      else if (this.activeFilter === 'public') list = list.filter(m => m.privacy !== 'private');
      list.sort((a, b) => {
        switch (this.currentSort.value) {
          case 'recent':   return new Date(b.created_at || 0) - new Date(a.created_at || 0);
          case 'oldest':   return new Date(a.created_at || 0) - new Date(b.created_at || 0);
          case 'name-asc': return (a.name || '').localeCompare(b.name || '');
          case 'name-desc':return (b.name || '').localeCompare(a.name || '');
          default: return 0;
        }
      });
      return list;
    },

    privateCount() { return this.allMeetings.filter(m => m.privacy === 'private').length; },

    recentCount() {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return this.allMeetings.filter(m => m.created_at && new Date(m.created_at) > cutoff).length;
    },
  },

  methods: {

    async fetchMeetingsData() {
      this.loading = true;
      this.error   = null;
      try {
        if (!TokenService.getAccessToken()) { this.$router.push('/auth'); return; }

        const res  = await apiRequest('/meetings?limit=100', { method: 'GET' });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const body = await res.json();

        // Handle both array and wrapped responses
        let raw = [];
        if (Array.isArray(body))            raw = body;
        else if (Array.isArray(body.data))  raw = body.data;
        else if (Array.isArray(body.rooms)) raw = body.rooms;

        this.allMeetings    = raw;
        this.activeMeetings = raw.filter(m => m.active === true);
        this.updateFilterCounts();
        this.generateActivityData();

      } catch (e) {
        console.error('[MeetingsDashboard] fetch error:', e);
        this.error = 'Failed to load meetings. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    updateFilterCounts() {
      this.filterTabs.forEach(t => {
        if (t.value === 'all')     t.count = this.allMeetings.length;
        if (t.value === 'private') t.count = this.privateCount;
        if (t.value === 'public')  t.count = this.allMeetings.length - this.privateCount;
      });
    },

    generateActivityData() {
      const days   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const counts = new Array(7).fill(0);
      this.allMeetings.forEach(m => {
        if (!m.created_at) return;
        const idx = (new Date(m.created_at).getDay() + 6) % 7;
        counts[idx]++;
      });
      const maxCount = Math.max(...counts, 1);
      this.activityData = days.map((label, i) => ({
        label, count: counts[i],
        percentage: Math.max((counts[i] / maxCount) * 100, counts[i] > 0 ? 8 : 3),
      }));
    },

    isRoomActive(m)       { return m.active === true; },
    getRoomStatusClass(m) { return this.isRoomActive(m) ? 'md-status--live' : m.privacy === 'private' ? 'md-status--private' : 'md-status--public'; },
    getRoomStatusLabel(m) { return this.isRoomActive(m) ? 'Live' : m.privacy === 'private' ? 'Private' : 'Public'; },
    formatRoomTime(m)     { return m.created_at ? `Created ${this.getRelativeTime(m.created_at)}` : 'Unknown date'; },

    setFilter(v)       { this.activeFilter = v; },
    toggleSortMenu()   { this.showSortMenu = !this.showSortMenu; },
    setSortOption(opt) { this.currentSort = opt; this.showSortMenu = false; },
    getFilterTitle()   { return (this.filterTabs.find(t => t.value === this.activeFilter) || {}).label || 'Meetings'; },
    getEmptyStateMessage() {
      const map = { private: 'No private rooms.', public: 'No public rooms.' };
      return map[this.activeFilter] || 'No meetings yet. Create your first!';
    },

    createMeeting() {
      sessionStorage.removeItem('nova_meeting_code');
      this.$router.push({ path: '/meeting', query: { create: 'true' } });
    },
    joinMeeting()             { this.$router.push({ path: '/join-meeting' }); },
    joinMeetingWithCode(code) {
      MeetingSession.setMeetingCode(code);
      MeetingSession.setIsHost(false);
      this.$router.push({ path: '/meeting' });
    },

    copyCode(code) {
      navigator.clipboard.writeText(code)
        .then(() => this.showToast('Code copied!', 'success'))
        .catch(() => this.showToast('Failed to copy', 'error'));
    },

    promptEnd(meeting)     { this.modal = { show: true, type: 'end',     meeting, loading: false }; },
    promptRestart(meeting) { this.modal = { show: true, type: 'restart', meeting, loading: false }; },

    async confirmEnd() {
      this.modal.loading = true;
      const code = this.modal.meeting.name;
      try {
        const res = await apiRequest(`/meetings/${encodeURIComponent(code)}`, { method: 'DELETE' });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message || `Delete failed (HTTP ${res.status})`);
        }
        this.allMeetings    = this.allMeetings.filter(m => m.name !== code);
        this.activeMeetings = this.activeMeetings.filter(m => m.name !== code);
        this.updateFilterCounts();
        this.showToast(`"${code}" deleted.`, 'success');
      } catch (err) {
        this.showToast('Failed to delete: ' + err.message, 'error');
      } finally {
        this.modal.loading = false;
        this.closeModal();
      }
    },

    async confirmRestart() {
      this.modal.loading = true;
      const m    = this.modal.meeting;
      const name = m.name;
      try {
        await apiRequest(`/meetings/${encodeURIComponent(name)}`, { method: 'DELETE' }).catch(() => {});
        await apiRequest('/meetings/create', {
          method: 'POST',
          body: JSON.stringify({ roomName: name, private: m.privacy === 'private' }),
        });
        this.showToast(`"${name}" restarted!`, 'success');
        setTimeout(() => this.fetchMeetingsData(), 800);
      } catch (err) {
        this.showToast('Failed to restart: ' + err.message, 'error');
      } finally {
        this.modal.loading = false;
        this.closeModal();
      }
    },

    closeModal() { this.modal = { show: false, type: null, meeting: null, loading: false }; },

    getRelativeTime(ds) {
      if (!ds) return '';
      const d = Math.floor((Date.now() - new Date(ds)) / 1000);
      if (d < 60)     return 'just now';
      if (d < 3600)   return `${Math.floor(d / 60)}m ago`;
      if (d < 86400)  return `${Math.floor(d / 3600)}h ago`;
      if (d < 604800) return `${Math.floor(d / 86400)}d ago`;
      return `${Math.floor(d / 604800)}w ago`;
    },

    showToast(msg, type = 'success') {
      this.toast = { show: true, message: msg, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    },
  },

  mounted() {
    if (!this.isAuthenticated) { this.$router.push('/auth'); return; }
    document.addEventListener('click', e => {
      if (this.$refs.sortWrap && !this.$refs.sortWrap.contains(e.target)) this.showSortMenu = false;
    });
    this.fetchMeetingsData();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

.md-wrap {
  --md-blue:#4a90e2;--md-blue-dk:#2c6fbd;--md-blue-soft:#e8f2fc;--md-blue-mid:#c9dff5;
  --md-blue-glow:rgba(74,144,226,.22);--md-ink:#0d1b36;--md-ink-s:#2d3748;--md-ink-m:#64748b;
  --md-white:#ffffff;--md-border:#e2ecf6;--md-bg:#f8fafc;--md-purple:#8b5cf6;
  --md-green:#10b981;--md-orange:#f59e0b;--md-red:#ef4444;
  --md-surf:#ffffff;--md-surf2:#f0f6fd;
  --md-shadow-sm:0 1px 3px rgba(13,27,54,.08);--md-shadow-md:0 4px 12px rgba(13,27,54,.10);
  --md-shadow-lg:0 10px 28px rgba(13,27,54,.12);--md-r:12px;
  font-family:'Manrope',system-ui,sans-serif;background:var(--md-bg);color:var(--md-ink);
  min-height:100vh;display:flex;flex-direction:column;
}
.md-wrap * { box-sizing:border-box;margin:0;padding:0; }

/* Nav */
.md-nav{height:64px;flex-shrink:0;background:var(--md-white);border-bottom:1px solid var(--md-border);position:sticky;top:0;z-index:100;box-shadow:var(--md-shadow-sm)}
.md-nav-inner{height:100%;max-width:1600px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between}
.md-nav-left,.md-nav-right{display:flex;align-items:center;gap:14px}
.md-back{display:flex;align-items:center;gap:7px;color:var(--md-ink-m);text-decoration:none;font-size:13px;font-weight:600;padding:7px 12px;border-radius:var(--md-r);transition:all .15s}
.md-back:hover{background:var(--md-blue-soft);color:var(--md-blue)}
.md-nav-divider{width:1px;height:22px;background:var(--md-border)}
.md-page-id{display:flex;align-items:center;gap:12px}
.md-brand{display:flex;align-items:center;gap:8px}
.md-brand svg{border-radius:8px;box-shadow:var(--md-shadow-sm)}
.md-brand-name{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:var(--md-ink)}
.md-page-meta{display:flex;flex-direction:column;gap:1px;padding-left:12px;border-left:1px solid var(--md-border)}
.md-page-title{font-size:14px;font-weight:700;color:var(--md-ink);line-height:1.2}
.md-page-sub{font-size:11px;color:var(--md-ink-m);font-weight:500}
.md-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:var(--md-r);font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .18s}
.md-btn--ghost{background:transparent;border:1.5px solid var(--md-border);color:var(--md-ink-m)}
.md-btn--ghost:hover{border-color:var(--md-blue);color:var(--md-blue);background:var(--md-blue-soft)}
.md-btn--primary{background:var(--md-blue);color:var(--md-white);box-shadow:0 2px 10px var(--md-blue-glow)}
.md-btn--primary:hover{background:var(--md-blue-dk);transform:translateY(-1px)}

/* Main */
.md-main{flex:1;max-width:1600px;margin:0 auto;padding:28px;width:100%}
.md-state-panel{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:380px;gap:16px;background:var(--md-white);border:1px solid var(--md-border);border-radius:16px;padding:48px;box-shadow:var(--md-shadow-sm)}
.md-state-text{font-size:15px;color:var(--md-ink-m);font-weight:600}
.md-spinner{width:40px;height:40px;border:3px solid var(--md-blue-mid);border-top-color:var(--md-blue);border-radius:50%;animation:md-spin .75s linear infinite}
@keyframes md-spin{to{transform:rotate(360deg)}}
.md-state-icon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.md-state-icon--red{background:rgba(239,68,68,0.1);color:var(--md-red);border:1px solid rgba(239,68,68,0.2)}
.md-content{display:flex;flex-direction:column;gap:20px}

/* Stats */
.md-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.md-stat{background:var(--md-white);border:1px solid var(--md-border);border-radius:14px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;transition:border-color .15s,box-shadow .15s,transform .15s;box-shadow:var(--md-shadow-sm)}
.md-stat:hover{border-color:var(--md-blue-mid);box-shadow:var(--md-shadow-md);transform:translateY(-1px)}
.md-stat--live{border-color:rgba(239,68,68,.3)}
.md-stat-icon{width:44px;height:44px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative}
.md-stat-icon--blue{background:var(--md-blue-soft);color:var(--md-blue)}
.md-stat-icon--red{background:rgba(239,68,68,.10);color:var(--md-red)}
.md-stat-icon--green{background:rgba(16,185,129,.12);color:var(--md-green)}
.md-stat-icon--amber{background:rgba(245,158,11,.12);color:var(--md-orange)}
.md-live-ring{position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(239,68,68,.35);animation:md-ring-pulse 2s ease-out infinite}
@keyframes md-ring-pulse{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.6)}}
.md-stat-body{flex:1;display:flex;flex-direction:column;gap:3px}
.md-stat-label-row{display:flex;align-items:center;gap:8px}
.md-stat-label{font-size:12px;font-weight:700;color:var(--md-ink-m);letter-spacing:.2px;text-transform:uppercase}
.md-stat-val{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:700;color:var(--md-ink);line-height:1.1}
.md-stat-sub{font-size:11px;color:var(--md-ink-m);font-weight:500}
.md-live-chip{font-size:9px;font-weight:800;letter-spacing:.6px;padding:2px 6px;border-radius:4px;background:rgba(239,68,68,.10);color:var(--md-red);border:1px solid rgba(239,68,68,.25);animation:md-blink 2s ease-in-out infinite}
@keyframes md-blink{0%,100%{opacity:1}50%{opacity:.5}}

/* Filters */
.md-filters{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.md-filter-tabs{display:flex;gap:4px;background:var(--md-white);border:1px solid var(--md-border);border-radius:12px;padding:4px;box-shadow:var(--md-shadow-sm)}
.md-tab{display:flex;align-items:center;gap:7px;padding:8px 16px;border:none;background:transparent;color:var(--md-ink-m);font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;border-radius:8px;cursor:pointer;transition:all .15s}
.md-tab:hover{color:var(--md-blue);background:var(--md-blue-soft)}
.md-tab--active{background:var(--md-blue);color:var(--md-white);box-shadow:0 2px 8px var(--md-blue-glow)}
.md-tab-count{min-width:18px;height:18px;padding:0 5px;border-radius:9px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.25)}
.md-tab:not(.md-tab--active) .md-tab-count{background:var(--md-blue-soft);color:var(--md-blue)}
.md-sort-wrap{position:relative}
.md-sort-btn{display:flex;align-items:center;gap:7px;padding:8px 14px;background:var(--md-white);border:1px solid var(--md-border);border-radius:var(--md-r);color:var(--md-ink-m);font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;box-shadow:var(--md-shadow-sm)}
.md-sort-btn:hover{border-color:var(--md-blue);color:var(--md-blue);background:var(--md-blue-soft)}
.md-sort-menu{position:absolute;top:calc(100% + 6px);right:0;min-width:190px;background:var(--md-white);border:1px solid var(--md-border);border-radius:12px;box-shadow:var(--md-shadow-lg);padding:6px;z-index:50}
.md-sort-opt{display:flex;align-items:center;gap:8px;width:100%;padding:9px 12px;border:none;background:transparent;border-radius:8px;color:var(--md-ink-m);font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .12s}
.md-sort-opt:hover{background:var(--md-blue-soft);color:var(--md-blue)}
.md-sort-opt--active{color:var(--md-blue);background:var(--md-blue-soft)}
.md-drop-enter-active,.md-drop-leave-active{transition:opacity .15s,transform .15s}
.md-drop-enter-from,.md-drop-leave-to{opacity:0;transform:translateY(-6px)}

/* Body grid */
.md-body-grid{display:grid;grid-template-columns:1fr 300px;gap:18px}
.md-left-col{display:flex;flex-direction:column;gap:18px;min-width:0}
.md-panel{background:var(--md-white);border:1px solid var(--md-border);border-radius:16px;overflow:hidden;box-shadow:var(--md-shadow-sm)}
.md-panel-hdr{padding:18px 22px;border-bottom:1px solid var(--md-border);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to right,var(--md-white),var(--md-surf2))}
.md-panel-title{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:var(--md-ink)}
.md-panel-body{padding:20px 22px}
.md-active-panel{border-color:rgba(239,68,68,.25)}
.md-live-badge{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:800;letter-spacing:.5px;padding:4px 10px;border-radius:20px;background:rgba(239,68,68,.10);border:1px solid rgba(239,68,68,.25);color:var(--md-red)}
.md-live-dot{width:6px;height:6px;border-radius:50%;background:var(--md-red);animation:md-blink 2s ease-in-out infinite}
.md-active-list{display:flex;flex-direction:column;gap:10px}
.md-active-row{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:12px;background:var(--md-surf2);border:1px solid var(--md-border);border-left:3px solid var(--md-red);flex-wrap:wrap;transition:background .15s}
.md-active-row:hover{background:var(--md-blue-soft)}
.md-active-pulse-wrap{position:relative;width:10px;height:10px;flex-shrink:0}
.md-active-pulse{position:absolute;inset:0;border-radius:50%;background:var(--md-red)}
.md-active-pulse::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:2px solid var(--md-red);animation:md-ring-pulse 1.8s ease-out infinite}
.md-active-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}
.md-active-top{display:flex;align-items:center;gap:10px}
.md-active-title{font-size:14px;font-weight:700;color:var(--md-ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.md-active-code{font-family:'Space Grotesk',monospace;font-size:11px;color:var(--md-blue);background:var(--md-blue-soft);padding:3px 8px;border-radius:5px;border:1px solid var(--md-blue-mid);white-space:nowrap;flex-shrink:0}
.md-active-meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.md-active-meta span{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--md-ink-m);font-weight:600}
.md-active-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.md-join-now-btn{display:flex;align-items:center;gap:5px;padding:7px 13px;background:var(--md-blue);color:var(--md-white);border:none;border-radius:8px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px var(--md-blue-glow);transition:all .15s}
.md-join-now-btn:hover{background:var(--md-blue-dk);transform:translateY(-1px)}
.md-restart-btn-sm{display:flex;align-items:center;gap:5px;padding:7px 11px;background:rgba(245,158,11,.12);color:#d97706;border:1.5px solid rgba(245,158,11,.35);border-radius:8px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.md-restart-btn-sm:hover{background:rgba(245,158,11,.22)}
.md-end-btn-sm{display:flex;align-items:center;gap:5px;padding:7px 11px;background:rgba(239,68,68,.10);color:var(--md-red);border:1.5px solid rgba(239,68,68,.3);border-radius:8px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.md-end-btn-sm:hover{background:var(--md-red);color:var(--md-white);border-color:var(--md-red)}
.md-refresh-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;background:transparent;border:1px solid var(--md-border);border-radius:8px;color:var(--md-ink-m);font-family:'Manrope',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.md-refresh-btn:hover{border-color:var(--md-blue);color:var(--md-blue)}
.md-refresh-btn:disabled{opacity:.4;cursor:not-allowed}

/* Cards */
.md-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
.md-mcard{background:var(--md-white);border:1px solid var(--md-border);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .15s,box-shadow .15s,transform .15s;box-shadow:var(--md-shadow-sm)}
.md-mcard:hover{border-color:var(--md-blue-mid);box-shadow:var(--md-shadow-lg);transform:translateY(-2px)}
.md-mcard-top{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px}
.md-mcard-topright{display:flex;align-items:center;gap:6px}
.md-status-chip{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:800;letter-spacing:.5px;padding:4px 10px;border-radius:20px;text-transform:uppercase}
.md-status--live{background:rgba(239,68,68,.10);color:var(--md-red);border:1px solid rgba(239,68,68,.25)}
.md-status--private{background:rgba(139,92,246,.10);color:var(--md-purple);border:1px solid rgba(139,92,246,.25)}
.md-status--public{background:rgba(16,185,129,.10);color:var(--md-green);border:1px solid rgba(16,185,129,.25)}
.md-status-dot{width:5px;height:5px;border-radius:50%;background:var(--md-red);animation:md-blink 2s ease-in-out infinite}
.md-privacy-chip{display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:700;padding:3px 8px;border-radius:12px;text-transform:uppercase;letter-spacing:.3px}
.md-privacy--private{background:rgba(139,92,246,.08);color:var(--md-purple);border:1px solid rgba(139,92,246,.2)}
.md-privacy--public{background:rgba(16,185,129,.08);color:var(--md-green);border:1px solid rgba(16,185,129,.2)}
.md-mcard-body{padding:0 16px 14px;flex:1;display:flex;flex-direction:column;gap:10px}
.md-mcard-title{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:var(--md-ink);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.md-mcard-code{display:inline-flex;align-items:center;gap:7px;align-self:flex-start;padding:7px 11px;background:var(--md-blue-soft);border:1px solid var(--md-blue-mid);border-radius:8px;cursor:pointer;transition:border-color .15s,background .15s}
.md-mcard-code:hover{border-color:var(--md-blue);background:var(--md-blue-mid)}
.md-mcard-code code{font-family:'Space Grotesk',monospace;font-size:12px;color:var(--md-blue-dk);font-weight:600;letter-spacing:.5px}
.md-copy-icon{color:var(--md-ink-m);opacity:0;transition:opacity .15s}
.md-mcard-code:hover .md-copy-icon{opacity:1}
.md-mcard-meta{display:flex;flex-wrap:wrap;gap:8px 14px}
.md-meta-item{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--md-ink-m);font-weight:600}
.md-meta-item svg{flex-shrink:0;color:var(--md-blue)}
.md-room-link{color:var(--md-blue);text-decoration:none;font-size:12px;font-weight:600}
.md-room-link:hover{text-decoration:underline}
.md-mcard-foot{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:12px 16px;border-top:1px solid var(--md-border);background:var(--md-surf2)}
.md-mcard-actions{display:flex;gap:6px;flex-wrap:wrap}
.md-btn-join{display:flex;align-items:center;gap:5px;padding:7px 13px;background:var(--md-blue);color:var(--md-white);border:none;border-radius:8px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px var(--md-blue-glow);transition:all .15s}
.md-btn-join:hover{background:var(--md-blue-dk);transform:translateY(-1px)}
.md-btn-restart{display:flex;align-items:center;gap:4px;padding:7px 11px;background:rgba(245,158,11,.10);color:#d97706;border:1.5px solid rgba(245,158,11,.35);border-radius:8px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.md-btn-restart:hover{background:rgba(245,158,11,.2);border-color:var(--md-orange)}
.md-btn-end{display:flex;align-items:center;gap:4px;padding:7px 11px;background:rgba(239,68,68,.08);color:var(--md-red);border:1.5px solid rgba(239,68,68,.28);border-radius:8px;font-family:'Manrope',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.md-btn-end:hover{background:var(--md-red);color:var(--md-white);border-color:var(--md-red)}

/* Empty state */
.md-empty{display:flex;flex-direction:column;align-items:center;padding:64px 24px;text-align:center;gap:12px}
.md-empty-icon{width:72px;height:72px;border-radius:50%;background:var(--md-blue-soft);border:1.5px solid var(--md-blue-mid);display:flex;align-items:center;justify-content:center;color:var(--md-blue)}
.md-empty-msg{font-size:15px;font-weight:600;color:var(--md-ink-m)}
.md-empty-actions{display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:center}

/* Sidebar */
.md-sidebar{position:sticky;top:82px;align-self:flex-start}
.md-sidebar-stats{display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
.md-ss-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--md-surf2);border-radius:10px;border:1px solid var(--md-border);transition:background .15s,border-color .15s}
.md-ss-item:hover{background:var(--md-blue-soft);border-color:var(--md-blue-mid)}
.md-ss-icon{width:36px;height:36px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.md-ss-icon--blue{background:var(--md-blue-soft);color:var(--md-blue)}
.md-ss-icon--red{background:rgba(239,68,68,.12);color:var(--md-red)}
.md-ss-icon--amber{background:rgba(245,158,11,.12);color:var(--md-orange)}
.md-ss-icon--purple{background:rgba(139,92,246,.12);color:var(--md-purple)}
.md-ss-body{display:flex;flex-direction:column}
.md-ss-val{font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;color:var(--md-ink);line-height:1.1}
.md-ss-lbl{font-size:11px;color:var(--md-ink-m);font-weight:600;margin-top:2px}
.md-chart-section{border-top:1px solid var(--md-border);padding-top:20px;margin-top:4px}
.md-chart-title{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:700;color:var(--md-ink);margin-bottom:14px}
.md-chart{display:flex;align-items:flex-end;justify-content:space-between;gap:5px;height:90px;padding:10px;background:var(--md-surf2);border-radius:10px;border:1px solid var(--md-border)}
.md-chart-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%}
.md-chart-track{flex:1;width:100%;display:flex;align-items:flex-end}
.md-chart-bar{width:100%;border-radius:4px 4px 0 0;min-height:3px;background:linear-gradient(180deg,var(--md-blue) 0%,var(--md-blue-dk) 100%);opacity:.65;transition:opacity .2s}
.md-chart-col:hover .md-chart-bar{opacity:1}
.md-chart-lbl{font-size:9px;font-weight:700;color:var(--md-ink-m);text-transform:uppercase;letter-spacing:.3px}
.md-quick-stats{border-top:1px solid var(--md-border);padding-top:18px;margin-top:18px;display:flex;flex-direction:column;gap:8px}
.md-qs-row{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--md-surf2);border-radius:8px;border:1px solid var(--md-border);transition:background .15s}
.md-qs-row:hover{background:var(--md-blue-soft)}
.md-qs-lbl{font-size:12px;font-weight:600;color:var(--md-ink-m)}
.md-qs-val{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;color:var(--md-ink)}

/* Modals */
.md-modal-overlay{position:fixed;inset:0;z-index:5000;background:rgba(13,27,54,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px}
.md-modal{background:var(--md-white);border:1px solid var(--md-border);border-radius:20px;padding:40px 36px 32px;width:100%;max-width:430px;text-align:center;box-shadow:0 24px 80px rgba(13,27,54,.18);animation:md-modal-in .22s cubic-bezier(.34,1.56,.64,1)}
@keyframes md-modal-in{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.md-modal-fx-enter-active,.md-modal-fx-leave-active{transition:opacity .18s}
.md-modal-fx-enter-from,.md-modal-fx-leave-to{opacity:0}
.md-modal-icon{width:68px;height:68px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 22px}
.md-modal-icon--red{background:rgba(239,68,68,.12);color:var(--md-red);border:1.5px solid rgba(239,68,68,.3)}
.md-modal-icon--orange{background:rgba(245,158,11,.12);color:#d97706;border:1.5px solid rgba(245,158,11,.35)}
.md-modal-title{font-family:'Space Grotesk',sans-serif;font-size:21px;font-weight:700;color:var(--md-ink);margin-bottom:12px;line-height:1.3}
.md-modal-body{font-size:14px;color:var(--md-ink-m);line-height:1.65;margin-bottom:28px;font-weight:500}
.md-modal-body code{font-family:'Space Grotesk',monospace;font-size:12px;background:var(--md-surf2);padding:2px 6px;border-radius:4px;color:var(--md-blue-dk)}
.md-modal-actions{display:flex;gap:10px;justify-content:center}
.md-modal-btn{flex:1;max-width:190px;padding:12px 20px;border-radius:10px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.md-modal-btn--ghost{background:transparent;border:1.5px solid var(--md-border);color:var(--md-ink-m)}
.md-modal-btn--ghost:hover:not(:disabled){border-color:var(--md-ink-m);color:var(--md-ink)}
.md-modal-btn--danger{background:var(--md-red);border:none;color:var(--md-white);box-shadow:0 2px 12px rgba(239,68,68,.3)}
.md-modal-btn--danger:hover:not(:disabled){background:#dc2626}
.md-modal-btn--orange{background:var(--md-orange);border:none;color:var(--md-white);box-shadow:0 2px 12px rgba(245,158,11,.3)}
.md-modal-btn--orange:hover:not(:disabled){background:#d97706}
.md-modal-btn:disabled{opacity:.55;cursor:not-allowed}
.md-modal-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:md-spin .65s linear infinite}

/* Toast */
.md-toast{position:fixed;bottom:28px;right:28px;z-index:6000;display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:700;box-shadow:var(--md-shadow-lg);pointer-events:none}
.md-toast--success{background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.3);color:var(--md-green)}
.md-toast--error{background:rgba(239,68,68,.10);border:1px solid rgba(239,68,68,.25);color:var(--md-red)}
.md-toast-fx-enter-active,.md-toast-fx-leave-active{transition:opacity .2s,transform .2s}
.md-toast-fx-enter-from{opacity:0;transform:translateY(14px)}
.md-toast-fx-leave-to{opacity:0;transform:translateY(14px)}

/* Responsive */
@media(max-width:1280px){.md-body-grid{grid-template-columns:1fr 280px}}
@media(max-width:1024px){.md-body-grid{grid-template-columns:1fr}.md-sidebar{position:static}.md-stats-row{grid-template-columns:repeat(2,1fr)}.md-card-grid{grid-template-columns:1fr}}
@media(max-width:640px){
  .md-nav-inner{padding:0 16px}
  .md-page-meta{display:none}
  .md-main{padding:16px}
  .md-stats-row{grid-template-columns:1fr 1fr;gap:10px}
  .md-stat-val{font-size:24px}
  .md-active-actions{width:100%;justify-content:flex-end}
  .md-modal{padding:30px 20px 24px}
  .md-modal-actions{flex-direction:column}
  .md-modal-btn{max-width:100%}
}
@media(max-width:480px){.md-stats-row{grid-template-columns:1fr}}
</style>