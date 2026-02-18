<!-- MeetingsDashboard.vue -->
<template>
  <div class="md-wrap">

    <!-- ════════════════════════════════════════
         TOP NAV
    ════════════════════════════════════════ -->
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

    <!-- ════════════════════════════════════════
         MAIN CONTENT
    ════════════════════════════════════════ -->
    <main class="md-main">

      <!-- Loading -->
      <div v-if="loading" class="md-state-panel">
        <div class="md-spinner"></div>
        <p class="md-state-text">Loading meetings…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="md-state-panel">
        <div class="md-state-icon md-state-icon--red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p class="md-state-text">{{ error }}</p>
        <button class="md-btn md-btn--primary" @click="fetchMeetingsData">Try again</button>
      </div>

      <!-- Dashboard -->
      <div v-else class="md-content">

        <!-- ── Stats row ── -->
        <div class="md-stats-row">

          <div class="md-stat" @click="setFilter('all')">
            <div class="md-stat-icon md-stat-icon--blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
            </div>
            <div class="md-stat-body">
              <span class="md-stat-label">Total meetings</span>
              <span class="md-stat-val">{{ stats.totalMeetings }}</span>
              <span class="md-stat-sub">{{ stats.scheduled }} scheduled · {{ stats.completed }} completed</span>
            </div>
          </div>

          <div class="md-stat" :class="{ 'md-stat--live': stats.activeNow > 0 }">
            <div class="md-stat-icon md-stat-icon--red">
              <span v-if="stats.activeNow > 0" class="md-live-ring"></span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
            </div>
            <div class="md-stat-body">
              <div class="md-stat-label-row">
                <span class="md-stat-label">Active now</span>
                <span v-if="stats.activeNow > 0" class="md-live-chip">LIVE</span>
              </div>
              <span class="md-stat-val">{{ stats.activeNow }}</span>
              <span class="md-stat-sub">
                {{ stats.activeNow > 0 ? `${stats.totalParticipants} participants online` : 'No active meetings' }}
              </span>
            </div>
          </div>

          <div class="md-stat">
            <div class="md-stat-icon md-stat-icon--green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="16" r="2" fill="currentColor" stroke="none"/></svg>
            </div>
            <div class="md-stat-body">
              <span class="md-stat-label">Upcoming</span>
              <span class="md-stat-val">{{ stats.upcomingThisWeek }}</span>
              <span class="md-stat-sub">{{ stats.upcomingToday }} today · {{ stats.upcomingTomorrow }} tomorrow</span>
            </div>
          </div>

          <div class="md-stat">
            <div class="md-stat-icon md-stat-icon--amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="md-stat-body">
              <span class="md-stat-label">Participants</span>
              <span class="md-stat-val">{{ stats.totalUniqueParticipants }}</span>
              <span class="md-stat-sub">Avg {{ stats.averageParticipants }} per meeting</span>
            </div>
          </div>

        </div><!-- /md-stats-row -->

        <!-- ── Filter tabs ── -->
        <div class="md-filters">
          <div class="md-filter-tabs">
            <button
              v-for="tab in filterTabs"
              :key="tab.value"
              class="md-tab"
              :class="{ 'md-tab--active': activeFilter === tab.value }"
              @click="setFilter(tab.value)"
            >
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
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  class="md-sort-opt"
                  :class="{ 'md-sort-opt--active': currentSort.value === opt.value }"
                  @click="setSortOption(opt)"
                >
                  <svg v-if="currentSort.value === opt.value" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span v-else style="width:13px;display:inline-block"></span>
                  {{ opt.label }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- ── Body grid: list + sidebar ── -->
        <div class="md-body-grid">

          <!-- Left: active + meeting cards -->
          <div class="md-left-col">

            <!-- ══ Active meetings banner ══ -->
            <div v-if="activeMeetings.length > 0" class="md-panel md-active-panel">
              <div class="md-panel-hdr">
                <h2 class="md-panel-title">Active meetings</h2>
                <span class="md-live-badge">
                  <span class="md-live-dot"></span>
                  LIVE
                </span>
              </div>
              <div class="md-panel-body">
                <div class="md-active-list">
                  <div v-for="m in activeMeetings" :key="m.id" class="md-active-row">
                    <div class="md-active-pulse-wrap">
                      <span class="md-active-pulse"></span>
                    </div>
                    <div class="md-active-info">
                      <div class="md-active-top">
                        <span class="md-active-title">{{ m.title }}</span>
                        <code class="md-active-code">{{ m.meetingCode }}</code>
                      </div>
                      <div class="md-active-meta">
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {{ getRelativeTime(m.actualStartTime) }}
                        </span>
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {{ m.currentParticipants }}/{{ m.maxParticipants }}
                        </span>
                      </div>
                    </div>
                    <!-- Active row action buttons -->
                    <div class="md-active-actions">
                      <button class="md-join-now-btn" @click="joinActiveMeeting(m.meetingCode)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Join
                      </button>
                      <button class="md-restart-btn-sm" @click="promptRestart(m)" title="Restart meeting">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                        Restart
                      </button>
                      <button class="md-end-btn-sm" @click="promptEnd(m)" title="End meeting for everyone">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                        End
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ══ Meeting cards panel ══ -->
            <div class="md-panel md-list-panel">
              <div class="md-panel-hdr">
                <h2 class="md-panel-title">{{ getFilterTitle() }}</h2>
              </div>
              <div class="md-panel-body">

                <!-- Empty state -->
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

                <!-- Card grid -->
                <div v-else class="md-card-grid">
                  <div v-for="m in filteredMeetings" :key="m.id" class="md-mcard">

                    <div class="md-mcard-top">
                      <span class="md-status-chip" :class="`md-status--${getStatusClass(m.status)}`">
                        <span v-if="m.status === 'ACTIVE'" class="md-status-dot"></span>
                        {{ getStatusLabel(m.status) }}
                      </span>
                      <button class="md-menu-btn" @click="toggleMeetingMenu(m.id)" title="Options">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                      </button>
                    </div>

                    <div class="md-mcard-body">
                      <h3 class="md-mcard-title">{{ m.title }}</h3>
                      <p v-if="m.description" class="md-mcard-desc">{{ m.description }}</p>

                      <div class="md-mcard-code" @click="copyMeetingCode(m.meetingCode)" title="Click to copy">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <code>{{ m.meetingCode }}</code>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="md-copy-icon"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </div>

                      <div class="md-mcard-meta">
                        <span class="md-meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {{ formatMeetingTime(m) }}
                        </span>
                        <span class="md-meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {{ m.currentParticipants }}/{{ m.maxParticipants }}
                        </span>
                        <span v-if="m.allowGuests" class="md-meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                          Guests allowed
                        </span>
                      </div>

                      <div class="md-mcard-features">
                        <span v-if="m.videoEnabled" class="md-feat">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                          Video
                        </span>
                        <span v-if="m.audioEnabled" class="md-feat">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                          Audio
                        </span>
                        <span v-if="m.screenShareEnabled" class="md-feat">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                          Share
                        </span>
                        <span v-if="m.chatEnabled" class="md-feat">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Chat
                        </span>
                      </div>
                    </div>

                    <div class="md-mcard-foot">
                      <div class="md-host">
                        <div class="md-host-av">{{ getHostInitials(m.hostName) }}</div>
                        <div class="md-host-info">
                          <span class="md-host-lbl">Host</span>
                          <span class="md-host-name">{{ m.hostName }}</span>
                        </div>
                      </div>

                      <div class="md-mcard-actions">
                        <!-- Join / Start -->
                        <button
                          v-if="m.status === 'SCHEDULED' || m.status === 'ACTIVE'"
                          class="md-btn-join"
                          @click="joinMeetingWithCode(m.meetingCode)"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          {{ m.status === 'ACTIVE' ? 'Join now' : 'Start' }}
                        </button>

                        <!-- Restart — only for ACTIVE meetings -->
                        <button
                          v-if="m.status === 'ACTIVE'"
                          class="md-btn-restart"
                          @click="promptRestart(m)"
                          title="Restart meeting"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                          Restart
                        </button>

                        <!-- End — for ACTIVE or SCHEDULED meetings -->
                        <button
                          v-if="m.status === 'ACTIVE' || m.status === 'SCHEDULED'"
                          class="md-btn-end"
                          @click="promptEnd(m)"
                          title="End this meeting"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                          End
                        </button>

                        <button class="md-btn-details" @click="viewMeetingDetails(m.id)">Details</button>
                      </div>
                    </div>

                  </div>
                </div><!-- /md-card-grid -->

              </div>
            </div><!-- /md-list-panel -->

          </div><!-- /md-left-col -->

          <!-- Right: stats sidebar -->
          <aside class="md-sidebar">
            <div class="md-panel">
              <div class="md-panel-hdr">
                <h2 class="md-panel-title">Statistics</h2>
              </div>
              <div class="md-panel-body">

                <div class="md-sidebar-stats">
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--blue">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ stats.totalMeetings }}</span>
                      <span class="md-ss-lbl">Total meetings</span>
                    </div>
                  </div>
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--green">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ formatDuration(stats.totalDuration) }}</span>
                      <span class="md-ss-lbl">Total duration</span>
                    </div>
                  </div>
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--amber">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ stats.totalUniqueParticipants }}</span>
                      <span class="md-ss-lbl">Unique participants</span>
                    </div>
                  </div>
                  <div class="md-ss-item">
                    <div class="md-ss-icon md-ss-icon--purple">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    </div>
                    <div class="md-ss-body">
                      <span class="md-ss-val">{{ stats.meetingsThisMonth }}</span>
                      <span class="md-ss-lbl">This month</span>
                    </div>
                  </div>
                </div>

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
                    <span class="md-qs-lbl">Avg. duration</span>
                    <span class="md-qs-val">{{ formatDuration(stats.averageDuration) }}</span>
                  </div>
                  <div class="md-qs-row">
                    <span class="md-qs-lbl">Avg. participants</span>
                    <span class="md-qs-val">{{ stats.averageParticipants }}</span>
                  </div>
                  <div class="md-qs-row">
                    <span class="md-qs-lbl">Completion rate</span>
                    <span class="md-qs-val">{{ stats.completionRate }}%</span>
                  </div>
                </div>

              </div>
            </div>
          </aside>

        </div><!-- /md-body-grid -->
      </div><!-- /md-content -->
    </main>

    <!-- ════════════════════════════════════════
         END MEETING MODAL
    ════════════════════════════════════════ -->
    <transition name="md-modal-fx">
      <div v-if="modal.show && modal.type === 'end'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--red">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
          </div>
          <h2 class="md-modal-title">End "{{ modal.meeting?.title }}"?</h2>
          <p class="md-modal-body">
            This will permanently end the meeting for all participants and mark it as completed.
            You can restart it afterwards if needed.
          </p>
          <div class="md-modal-actions">
            <button class="md-modal-btn md-modal-btn--ghost" @click="closeModal" :disabled="modal.loading">Cancel</button>
            <button class="md-modal-btn md-modal-btn--danger" @click="confirmEnd" :disabled="modal.loading">
              <span v-if="modal.loading" class="md-modal-spinner"></span>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              End for everyone
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ════════════════════════════════════════
         RESTART MEETING MODAL
    ════════════════════════════════════════ -->
    <transition name="md-modal-fx">
      <div v-if="modal.show && modal.type === 'restart'" class="md-modal-overlay" @click.self="closeModal">
        <div class="md-modal">
          <div class="md-modal-icon md-modal-icon--orange">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          </div>
          <h2 class="md-modal-title">Restart "{{ modal.meeting?.title }}"?</h2>
          <p class="md-modal-body">
            All current participants will be disconnected and the meeting will restart fresh.
            The meeting code stays the same so participants can rejoin.
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

    <!-- ── Toast ── -->
    <transition name="md-toast-fx">
      <div v-if="toast.show" class="md-toast" :class="'md-toast--' + toast.type">
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

  </div>
</template>

<script>
import { TokenService, apiRequest } from '@/utils/apiService';

const API_BASE = 'https://nova-test-ctne.onrender.com/api';

export default {
  name: 'MeetingsDashboard',
  data() {
    return {
      loading: true,
      error: null,

      allMeetings: [],
      activeMeetings: [],

      stats: {
        totalMeetings: 0, scheduled: 0, completed: 0, cancelled: 0,
        activeNow: 0, totalParticipants: 0,
        upcomingThisWeek: 0, upcomingToday: 0, upcomingTomorrow: 0,
        totalUniqueParticipants: 0, averageParticipants: 0,
        totalDuration: 0, averageDuration: 0,
        meetingsThisMonth: 0, completionRate: 0,
      },

      activityData: [],

      activeFilter: 'all',
      filterTabs: [
        { label: 'All',       value: 'all',       count: 0 },
        { label: 'Scheduled', value: 'scheduled', count: 0 },
        { label: 'Completed', value: 'completed', count: 0 },
        { label: 'Cancelled', value: 'cancelled', count: 0 },
      ],

      showSortMenu: false,
      currentSort: { label: 'Most recent', value: 'recent' },
      sortOptions: [
        { label: 'Most recent',     value: 'recent' },
        { label: 'Oldest first',    value: 'oldest' },
        { label: 'Title A→Z',       value: 'title-asc' },
        { label: 'Title Z→A',       value: 'title-desc' },
        { label: 'By participants', value: 'participants' },
      ],

      // ── Modal state ──────────────────────────
      modal: {
        show: false,
        type: null,       // 'end' | 'restart'
        meeting: null,
        loading: false,
      },

      toast: { show: false, message: '', type: 'success' },
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
    token()           { return TokenService.getAccessToken(); },

    filteredMeetings() {
      let list = [...this.allMeetings];

      if (this.activeFilter !== 'all') {
        list = list.filter(m => {
          const status = m.status.toLowerCase();
          if (this.activeFilter === 'completed') return status === 'ended';
          return status === this.activeFilter;
        });
      }

      list.sort((a, b) => {
        switch (this.currentSort.value) {
          case 'recent':       return new Date(b.createdAt)        - new Date(a.createdAt);
          case 'oldest':       return new Date(a.createdAt)        - new Date(b.createdAt);
          case 'title-asc':    return a.title.localeCompare(b.title);
          case 'title-desc':   return b.title.localeCompare(a.title);
          case 'participants': return b.currentParticipants        - a.currentParticipants;
          default: return 0;
        }
      });
      return list;
    },
  },

  methods: {
    // ── Normalise raw backend object ─────────────────────────
    normalizeM(raw) {
      let hostName = raw.hostName || raw.host_name || '';
      if (!hostName && raw.host && typeof raw.host === 'object') {
        const h = raw.host;
        const first = h.firstName || h.first_name || '';
        const last  = h.lastName  || h.last_name  || '';
        hostName = [first, last].filter(Boolean).join(' ').trim()
                   || h.username || h.email || 'Unknown';
      }
      if (!hostName) hostName = 'Unknown';

      let currentParticipants = raw.currentParticipants ?? raw.current_participants ?? 0;
      if (Array.isArray(raw.participants)) currentParticipants = raw.participants.length;

      const meetingCode        = raw.meetingCode        || raw.meeting_code        || '';
      const maxParticipants    = raw.maxParticipants    ?? raw.max_participants    ?? 0;
      const scheduledStartTime = raw.scheduledStartTime || raw.scheduled_start_time|| null;
      const actualStartTime    = raw.actualStartTime    || raw.actual_start_time   || null;
      const endTime            = raw.endTime            || raw.end_time            || null;
      const createdAt          = raw.createdAt          || raw.created_at          || new Date().toISOString();
      const allowGuests        = raw.allowGuests        ?? raw.allow_guests        ?? false;
      const videoEnabled       = raw.videoEnabled       ?? raw.video_enabled       ?? false;
      const audioEnabled       = raw.audioEnabled       ?? raw.audio_enabled       ?? false;
      const screenShareEnabled = raw.screenShareEnabled ?? raw.screen_share_enabled?? false;
      const chatEnabled        = raw.chatEnabled        ?? raw.chat_enabled        ?? false;

      let status = (raw.status || 'UNKNOWN').toUpperCase();
      if (status === 'COMPLETED') status = 'ENDED';

      return {
        id: raw.id, title: raw.title || 'Untitled', description: raw.description || '',
        status, meetingCode, maxParticipants, currentParticipants,
        scheduledStartTime, actualStartTime, endTime, createdAt,
        allowGuests, videoEnabled, audioEnabled, screenShareEnabled, chatEnabled,
        hostName,
        participants:      raw.participants      || [],
        participantEmails: raw.participantEmails || raw.participant_emails || [],
      };
    },

    // ── Data ─────────────────────────────────────────────────
    async fetchMeetingsData() {
      this.loading = true;
      this.error   = null;
      try {
        if (!TokenService.getAccessToken()) { this.$router.push('/auth'); return; }

        const res  = await apiRequest('/meetings/my-meetings', { method: 'GET' });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const body = await res.json();
        let raw = [];
        if (Array.isArray(body))               raw = body;
        else if (Array.isArray(body.data))     raw = body.data;
        else if (body.data?.meetings)          raw = body.data.meetings;
        else if (Array.isArray(body.meetings)) raw = body.meetings;
        else if (body.data && typeof body.data === 'object') raw = [body.data];

        this.allMeetings = raw.map(m => this.normalizeM(m));
        this.processActiveMeetings();
        this.calculateStatistics();
        this.updateFilterCounts();
        this.generateActivityData();
      } catch (e) {
        console.error('[MeetingsDashboard] fetch error:', e);
        this.error = 'Failed to load meetings. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    processActiveMeetings() {
      this.activeMeetings = this.allMeetings.filter(m => m.status === 'ACTIVE');
    },

    calculateStatistics() {
      const all = this.allMeetings;
      const now = new Date();

      this.stats.totalMeetings = all.length;
      this.stats.scheduled     = all.filter(m => m.status === 'SCHEDULED').length;
      this.stats.completed     = all.filter(m => m.status === 'ENDED').length;
      this.stats.cancelled     = all.filter(m => m.status === 'CANCELLED').length;
      this.stats.activeNow     = this.activeMeetings.length;
      this.stats.totalParticipants = this.activeMeetings.reduce((s, m) => s + (m.currentParticipants || 0), 0);

      const unique = new Set();
      all.forEach(m => {
        if (Array.isArray(m.participants)) m.participants.forEach(p => unique.add(p.email || p.displayName || p.id || JSON.stringify(p)));
        if (Array.isArray(m.participantEmails)) m.participantEmails.forEach(e => unique.add(e));
      });
      this.stats.totalUniqueParticipants = unique.size > 0 ? unique.size : all.reduce((s, m) => s + (m.currentParticipants || 0), 0);

      const totalP = all.reduce((s, m) => s + (m.currentParticipants || 0), 0);
      this.stats.averageParticipants = all.length > 0 ? Math.round(totalP / all.length) : 0;

      const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek  = new Date(now); nextWeek.setDate(nextWeek.getDate() + 7);
      const sched = all.filter(m => m.status === 'SCHEDULED');
      this.stats.upcomingToday    = sched.filter(m => m.scheduledStartTime && new Date(m.scheduledStartTime).toDateString() === now.toDateString()).length;
      this.stats.upcomingTomorrow = sched.filter(m => m.scheduledStartTime && new Date(m.scheduledStartTime).toDateString() === tomorrow.toDateString()).length;
      this.stats.upcomingThisWeek = sched.filter(m => { if (!m.scheduledStartTime) return false; const d = new Date(m.scheduledStartTime); return d >= now && d <= nextWeek; }).length;

      let totalDur = 0, durCount = 0;
      all.forEach(m => { if (m.actualStartTime && m.endTime) { const diff = (new Date(m.endTime) - new Date(m.actualStartTime)) / 60000; if (diff > 0) { totalDur += diff; durCount++; } } });
      this.stats.totalDuration   = Math.round(totalDur);
      this.stats.averageDuration = durCount > 0 ? Math.round(totalDur / durCount) : 0;
      this.stats.meetingsThisMonth = all.filter(m => { const d = new Date(m.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
      const everStarted = this.stats.completed + this.stats.cancelled + this.stats.activeNow;
      this.stats.completionRate = everStarted > 0 ? Math.round((this.stats.completed / everStarted) * 100) : 0;
    },

    updateFilterCounts() {
      this.filterTabs.forEach(t => {
        if (t.value === 'all')            t.count = this.allMeetings.length;
        else if (t.value === 'completed') t.count = this.allMeetings.filter(m => m.status === 'ENDED').length;
        else                              t.count = this.allMeetings.filter(m => m.status.toLowerCase() === t.value).length;
      });
    },

    generateActivityData() {
      const days   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const counts = new Array(7).fill(0);
      this.allMeetings.forEach(m => { const idx = (new Date(m.createdAt).getDay() + 6) % 7; counts[idx]++; });
      const maxCount = Math.max(...counts, 1);
      this.activityData = days.map((label, i) => ({ label, count: counts[i], percentage: Math.max((counts[i] / maxCount) * 100, counts[i] > 0 ? 8 : 3) }));
    },

    // ── UI ───────────────────────────────────────────────────
    setFilter(v)       { this.activeFilter = v; },
    toggleSortMenu()   { this.showSortMenu = !this.showSortMenu; },
    setSortOption(opt) { this.currentSort = opt; this.showSortMenu = false; },

    getFilterTitle()      { return (this.filterTabs.find(t => t.value === this.activeFilter) || {}).label || 'Meetings'; },
    getEmptyStateMessage() {
      const map = { scheduled: 'No scheduled meetings.', completed: 'No completed meetings yet.', cancelled: 'No cancelled meetings.' };
      return map[this.activeFilter] || 'No meetings yet. Create your first!';
    },

    // ── Navigation ───────────────────────────────────────────
    createMeeting() {
      sessionStorage.removeItem('nova_meeting_code');
      this.$router.push({ path: '/meeting', query: { create: 'true' } });
    },
    joinMeeting()              { this.$router.push({ path: '/join-meeting' }); },
    joinActiveMeeting(code)    { sessionStorage.setItem('nova_meeting_code', code); this.$router.push({ path: '/meeting' }); },
    joinMeetingWithCode(code)  { sessionStorage.setItem('nova_meeting_code', code); this.$router.push({ path: '/meeting' }); },
    viewMeetingDetails(id) {
      const m = this.allMeetings.find(m => m.id === id);
      if (m) { sessionStorage.setItem('nova_meeting_code', m.meetingCode); this.$router.push({ path: '/meeting' }); }
    },
    toggleMeetingMenu(id) { console.log('Menu:', id); },

    copyMeetingCode(code) {
      navigator.clipboard.writeText(code)
        .then(()  => this.showToast('Code copied!', 'success'))
        .catch(()  => this.showToast('Failed to copy', 'error'));
    },

    // ══════════════════════════════════════════
    //  END MEETING
    // ══════════════════════════════════════════
    promptEnd(meeting) {
      this.modal = { show: true, type: 'end', meeting, loading: false };
    },

    async confirmEnd() {
      this.modal.loading = true;
      const code = this.modal.meeting.meetingCode;
      try {
        await fetch(`${API_BASE}/meetings/end/${code}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type':  'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        // Update local state immediately — don't wait for a full refetch
        const m = this.allMeetings.find(m => m.meetingCode === code);
        if (m) { m.status = 'ENDED'; m.endTime = new Date().toISOString(); }
        this.processActiveMeetings();
        this.calculateStatistics();
        this.updateFilterCounts();
        this.showToast(`"${this.modal.meeting.title}" ended successfully.`, 'success');
      } catch (err) {
        console.error('End meeting error:', err);
        this.showToast('Failed to end meeting — please try again.', 'error');
      } finally {
        this.modal.loading = false;
        this.closeModal();
        // Full refresh to sync with server
        setTimeout(() => this.fetchMeetingsData(), 1200);
      }
    },

    // ══════════════════════════════════════════
    //  RESTART MEETING
    // ══════════════════════════════════════════
    promptRestart(meeting) {
      this.modal = { show: true, type: 'restart', meeting, loading: false };
    },

    async confirmRestart() {
      this.modal.loading = true;
      const code = this.modal.meeting.meetingCode;
      try {
        // 1. End the current session
        await fetch(`${API_BASE}/meetings/end/${code}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
        }).catch(() => {});

        // 2. Start a fresh session
        await fetch(`${API_BASE}/meetings/start/${code}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
        });

        this.showToast(`"${this.modal.meeting.title}" restarted! Participants can rejoin.`, 'success');
      } catch (err) {
        console.error('Restart meeting error:', err);
        this.showToast('Failed to restart meeting — please try again.', 'error');
      } finally {
        this.modal.loading = false;
        this.closeModal();
        setTimeout(() => this.fetchMeetingsData(), 1200);
      }
    },

    closeModal() {
      this.modal = { show: false, type: null, meeting: null, loading: false };
    },

    // ── Helpers ──────────────────────────────────────────────
    getStatusClass(s) { return ({ ACTIVE: 'live', SCHEDULED: 'scheduled', ENDED: 'completed', CANCELLED: 'cancelled' })[s] || ''; },
    getStatusLabel(s) { return ({ ACTIVE: 'Live', SCHEDULED: 'Scheduled', ENDED: 'Completed', CANCELLED: 'Cancelled' })[s] || s; },
    getHostInitials(n) {
      if (!n) return '?';
      const p = n.trim().split(/\s+/);
      return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : n[0].toUpperCase();
    },
    formatMeetingTime(m) {
      if (m.status === 'ACTIVE')    return `Started ${this.getRelativeTime(m.actualStartTime)}`;
      if (m.status === 'SCHEDULED') return this.formatDate(m.scheduledStartTime);
      if (m.status === 'ENDED')     return `Ended ${this.getRelativeTime(m.endTime)}`;
      return 'Not started';
    },
    formatDate(ds) {
      if (!ds) return '';
      return new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    },
    getRelativeTime(ds) {
      if (!ds) return '';
      const d = Math.floor((Date.now() - new Date(ds)) / 1000);
      if (d < 60)     return 'just now';
      if (d < 3600)   return `${Math.floor(d / 60)}m ago`;
      if (d < 86400)  return `${Math.floor(d / 3600)}h ago`;
      if (d < 604800) return `${Math.floor(d / 86400)}d ago`;
      return `${Math.floor(d / 604800)}w ago`;
    },
    formatDuration(m) {
      if (!m || m < 1) return '—';
      if (m < 60) return `${m}m`;
      const h = Math.floor(m / 60), r = m % 60;
      return r > 0 ? `${h}h ${r}m` : `${h}h`;
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
  --md-blue:      #4a90e2;
  --md-blue-dk:   #2c6fbd;
  --md-blue-soft: #e8f2fc;
  --md-blue-mid:  #c9dff5;
  --md-blue-glow: rgba(74, 144, 226, 0.22);
  --md-ink:       #0d1b36;
  --md-ink-s:     #2d3748;
  --md-ink-m:     #64748b;
  --md-white:     #ffffff;
  --md-border:    #e2ecf6;
  --md-bg:        #f8fafc;
  --md-purple:    #8b5cf6;
  --md-green:     #10b981;
  --md-orange:    #f59e0b;
  --md-red:       #ef4444;
  --md-surf:      #ffffff;
  --md-surf2:     #f0f6fd;
  --md-surf3:     #e8f2fc;
  --md-shadow-sm: 0 1px 3px rgba(13, 27, 54, 0.08);
  --md-shadow-md: 0 4px 12px rgba(13, 27, 54, 0.10);
  --md-shadow-lg: 0 10px 28px rgba(13, 27, 54, 0.12);
  --md-r: 12px;

  font-family: 'Manrope', system-ui, sans-serif;
  background: var(--md-bg);
  color: var(--md-ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.md-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

/* NAV */
.md-nav { height: 64px; flex-shrink: 0; background: var(--md-white); border-bottom: 1px solid var(--md-border); position: sticky; top: 0; z-index: 100; box-shadow: var(--md-shadow-sm); }
.md-nav-inner { height: 100%; max-width: 1600px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; }
.md-nav-left, .md-nav-right { display: flex; align-items: center; gap: 14px; }
.md-back { display: flex; align-items: center; gap: 7px; color: var(--md-ink-m); text-decoration: none; font-size: 13px; font-weight: 600; padding: 7px 12px; border-radius: var(--md-r); transition: all .15s; }
.md-back:hover { background: var(--md-blue-soft); color: var(--md-blue); }
.md-nav-divider { width: 1px; height: 22px; background: var(--md-border); }
.md-page-id    { display: flex; align-items: center; gap: 12px; }
.md-brand      { display: flex; align-items: center; gap: 8px; }
.md-brand svg  { border-radius: 8px; box-shadow: var(--md-shadow-sm); }
.md-brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--md-ink); }
.md-page-meta  { display: flex; flex-direction: column; gap: 1px; padding-left: 12px; border-left: 1px solid var(--md-border); }
.md-page-title { font-size: 14px; font-weight: 700; color: var(--md-ink); line-height: 1.2; }
.md-page-sub   { font-size: 11px; color: var(--md-ink-m); font-weight: 500; }
.md-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: var(--md-r); font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all .18s; }
.md-btn--ghost { background: transparent; border: 1.5px solid var(--md-border); color: var(--md-ink-m); }
.md-btn--ghost:hover { border-color: var(--md-blue); color: var(--md-blue); background: var(--md-blue-soft); }
.md-btn--primary { background: var(--md-blue); color: var(--md-white); box-shadow: 0 2px 10px var(--md-blue-glow); }
.md-btn--primary:hover { background: var(--md-blue-dk); transform: translateY(-1px); box-shadow: 0 4px 16px var(--md-blue-glow); }

/* MAIN */
.md-main { flex: 1; max-width: 1600px; margin: 0 auto; padding: 28px; width: 100%; }
.md-state-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 380px; gap: 16px; background: var(--md-white); border: 1px solid var(--md-border); border-radius: 16px; padding: 48px; box-shadow: var(--md-shadow-sm); }
.md-state-text { font-size: 15px; color: var(--md-ink-m); font-weight: 600; }
.md-spinner { width: 40px; height: 40px; border: 3px solid var(--md-blue-mid); border-top-color: var(--md-blue); border-radius: 50%; animation: md-spin .75s linear infinite; }
@keyframes md-spin { to { transform: rotate(360deg); } }
.md-state-icon { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.md-state-icon--red { background: rgba(239,68,68,0.1); color: var(--md-red); border: 1px solid rgba(239,68,68,0.2); }
.md-content { display: flex; flex-direction: column; gap: 20px; }

/* STATS ROW */
.md-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.md-stat { background: var(--md-white); border: 1px solid var(--md-border); border-radius: 14px; padding: 18px 20px; display: flex; align-items: flex-start; gap: 14px; cursor: default; transition: border-color .15s, box-shadow .15s, transform .15s; box-shadow: var(--md-shadow-sm); }
.md-stat:hover { border-color: var(--md-blue-mid); box-shadow: var(--md-shadow-md); transform: translateY(-1px); }
.md-stat--live { border-color: rgba(239,68,68,0.3); }
.md-stat-icon { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; }
.md-stat-icon--blue  { background: var(--md-blue-soft); color: var(--md-blue); }
.md-stat-icon--red   { background: rgba(239,68,68,0.10); color: var(--md-red); }
.md-stat-icon--green { background: rgba(16,185,129,0.12); color: var(--md-green); }
.md-stat-icon--amber { background: rgba(245,158,11,0.12); color: var(--md-orange); }
.md-live-ring { position: absolute; inset: -5px; border-radius: 50%; border: 2px solid rgba(239,68,68,0.35); animation: md-ring-pulse 2s ease-out infinite; }
@keyframes md-ring-pulse { 0% { opacity:.8; transform:scale(1); } 100% { opacity:0; transform:scale(1.6); } }
.md-stat-body      { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.md-stat-label-row { display: flex; align-items: center; gap: 8px; }
.md-stat-label { font-size: 12px; font-weight: 700; color: var(--md-ink-m); letter-spacing: .2px; text-transform: uppercase; }
.md-stat-val   { font-family: 'Space Grotesk', sans-serif; font-size: 30px; font-weight: 700; color: var(--md-ink); line-height: 1.1; }
.md-stat-sub   { font-size: 11px; color: var(--md-ink-m); font-weight: 500; }
.md-live-chip { font-size: 9px; font-weight: 800; letter-spacing: .6px; padding: 2px 6px; border-radius: 4px; background: rgba(239,68,68,0.10); color: var(--md-red); border: 1px solid rgba(239,68,68,0.25); animation: md-blink 2s ease-in-out infinite; }
@keyframes md-blink { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }

/* FILTER BAR */
.md-filters { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.md-filter-tabs { display: flex; gap: 4px; background: var(--md-white); border: 1px solid var(--md-border); border-radius: 12px; padding: 4px; box-shadow: var(--md-shadow-sm); }
.md-tab { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border: none; background: transparent; color: var(--md-ink-m); font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all .15s; }
.md-tab:hover { color: var(--md-blue); background: var(--md-blue-soft); }
.md-tab--active { background: var(--md-blue); color: var(--md-white); box-shadow: 0 2px 8px var(--md-blue-glow); }
.md-tab--active:hover { background: var(--md-blue); }
.md-tab-count { min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.25); }
.md-tab:not(.md-tab--active) .md-tab-count { background: var(--md-blue-soft); color: var(--md-blue); }
.md-sort-wrap { position: relative; }
.md-sort-btn { display: flex; align-items: center; gap: 7px; padding: 8px 14px; background: var(--md-white); border: 1px solid var(--md-border); border-radius: var(--md-r); color: var(--md-ink-m); font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; box-shadow: var(--md-shadow-sm); }
.md-sort-btn:hover { border-color: var(--md-blue); color: var(--md-blue); background: var(--md-blue-soft); }
.md-sort-menu { position: absolute; top: calc(100% + 6px); right: 0; min-width: 190px; background: var(--md-white); border: 1px solid var(--md-border); border-radius: 12px; box-shadow: var(--md-shadow-lg); padding: 6px; z-index: 50; }
.md-sort-opt { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; border: none; background: transparent; border-radius: 8px; color: var(--md-ink-m); font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .12s; }
.md-sort-opt:hover   { background: var(--md-blue-soft); color: var(--md-blue); }
.md-sort-opt--active { color: var(--md-blue); background: var(--md-blue-soft); }
.md-drop-enter-active, .md-drop-leave-active { transition: opacity .15s, transform .15s; }
.md-drop-enter-from, .md-drop-leave-to { opacity: 0; transform: translateY(-6px); }

/* BODY GRID */
.md-body-grid { display: grid; grid-template-columns: 1fr 300px; gap: 18px; }
.md-left-col  { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.md-panel { background: var(--md-white); border: 1px solid var(--md-border); border-radius: 16px; overflow: hidden; box-shadow: var(--md-shadow-sm); }
.md-panel-hdr { padding: 18px 22px; border-bottom: 1px solid var(--md-border); display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to right, var(--md-white), var(--md-surf2)); }
.md-panel-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--md-ink); }
.md-panel-body  { padding: 20px 22px; }
.md-active-panel { border-color: rgba(239,68,68,0.25); }
.md-live-badge { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; letter-spacing: .5px; padding: 4px 10px; border-radius: 20px; background: rgba(239,68,68,0.10); border: 1px solid rgba(239,68,68,0.25); color: var(--md-red); }
.md-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--md-red); animation: md-blink 2s ease-in-out infinite; }
.md-active-list { display: flex; flex-direction: column; gap: 10px; }

/* Active row */
.md-active-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; background: var(--md-surf2); border: 1px solid var(--md-border); border-left: 3px solid var(--md-red); transition: background .15s, box-shadow .15s; flex-wrap: wrap; }
.md-active-row:hover { background: var(--md-blue-soft); box-shadow: var(--md-shadow-sm); }
.md-active-pulse-wrap { position: relative; width: 10px; height: 10px; flex-shrink: 0; }
.md-active-pulse { position: absolute; inset: 0; border-radius: 50%; background: var(--md-red); }
.md-active-pulse::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 2px solid var(--md-red); animation: md-ring-pulse 1.8s ease-out infinite; }
.md-active-info  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.md-active-top   { display: flex; align-items: center; gap: 10px; }
.md-active-title { font-size: 14px; font-weight: 700; color: var(--md-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-active-code  { font-family: 'Space Grotesk', monospace; font-size: 11px; color: var(--md-blue); background: var(--md-blue-soft); padding: 3px 8px; border-radius: 5px; border: 1px solid var(--md-blue-mid); white-space: nowrap; flex-shrink: 0; }
.md-active-meta  { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.md-active-meta span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--md-ink-m); font-weight: 600; }

/* Active row action group */
.md-active-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.md-join-now-btn {
  display: flex; align-items: center; gap: 5px; padding: 7px 13px;
  background: var(--md-blue); color: var(--md-white); border: none; border-radius: 8px;
  font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap;
  box-shadow: 0 2px 8px var(--md-blue-glow); transition: all .15s;
}
.md-join-now-btn:hover { background: var(--md-blue-dk); transform: translateY(-1px); }

.md-restart-btn-sm {
  display: flex; align-items: center; gap: 5px; padding: 7px 11px;
  background: rgba(245,158,11,0.12); color: #d97706;
  border: 1.5px solid rgba(245,158,11,0.35);
  border-radius: 8px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; transition: all .15s;
}
.md-restart-btn-sm:hover { background: rgba(245,158,11,0.22); border-color: var(--md-orange); }

.md-end-btn-sm {
  display: flex; align-items: center; gap: 5px; padding: 7px 11px;
  background: rgba(239,68,68,0.10); color: var(--md-red);
  border: 1.5px solid rgba(239,68,68,0.3);
  border-radius: 8px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; transition: all .15s;
}
.md-end-btn-sm:hover { background: var(--md-red); color: var(--md-white); border-color: var(--md-red); }

/* MEETING CARDS */
.md-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
.md-mcard { background: var(--md-white); border: 1px solid var(--md-border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: border-color .15s, box-shadow .15s, transform .15s; box-shadow: var(--md-shadow-sm); }
.md-mcard:hover { border-color: var(--md-blue-mid); box-shadow: var(--md-shadow-lg); transform: translateY(-2px); }
.md-mcard-top { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; }
.md-status-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 800; letter-spacing: .5px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
.md-status--live      { background: rgba(239,68,68,0.10); color: var(--md-red);   border: 1px solid rgba(239,68,68,0.25); }
.md-status--scheduled { background: var(--md-blue-soft);  color: var(--md-blue);  border: 1px solid var(--md-blue-mid); }
.md-status--completed { background: rgba(16,185,129,0.10); color: var(--md-green); border: 1px solid rgba(16,185,129,0.25); }
.md-status--cancelled { background: var(--md-surf2);       color: var(--md-ink-m); border: 1px solid var(--md-border); }
.md-status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--md-red); animation: md-blink 2s ease-in-out infinite; }
.md-menu-btn { width: 30px; height: 30px; border-radius: 8px; border: none; background: transparent; color: var(--md-ink-m); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .12s; }
.md-menu-btn:hover { background: var(--md-blue-soft); color: var(--md-blue); }
.md-mcard-body { padding: 0 16px 14px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.md-mcard-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: var(--md-ink); line-height: 1.3; }
.md-mcard-desc  { font-size: 13px; color: var(--md-ink-m); line-height: 1.5; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.md-mcard-code { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; padding: 7px 11px; background: var(--md-blue-soft); border: 1px solid var(--md-blue-mid); border-radius: 8px; cursor: pointer; transition: border-color .15s, background .15s; }
.md-mcard-code:hover { border-color: var(--md-blue); background: var(--md-blue-mid); }
.md-mcard-code code { font-family: 'Space Grotesk', monospace; font-size: 12px; color: var(--md-blue-dk); font-weight: 600; letter-spacing: .5px; }
.md-copy-icon { color: var(--md-ink-m); opacity: 0; transition: opacity .15s; }
.md-mcard-code:hover .md-copy-icon { opacity: 1; }
.md-mcard-meta { display: flex; flex-wrap: wrap; gap: 8px 14px; }
.md-meta-item  { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--md-ink-m); font-weight: 600; }
.md-meta-item svg { flex-shrink: 0; color: var(--md-blue); }
.md-mcard-features { display: flex; flex-wrap: wrap; gap: 6px; }
.md-feat { display: flex; align-items: center; gap: 4px; padding: 3px 9px; background: var(--md-surf2); border: 1px solid var(--md-border); border-radius: 6px; font-size: 11px; font-weight: 600; color: var(--md-ink-m); }
.md-feat svg { color: var(--md-blue); }
.md-mcard-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px; border-top: 1px solid var(--md-border); background: var(--md-surf2); flex-wrap: wrap; }
.md-host { display: flex; align-items: center; gap: 9px; min-width: 0; flex: 1; }
.md-host-av { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--md-blue), var(--md-blue-dk)); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: var(--md-white); box-shadow: 0 2px 8px var(--md-blue-glow); }
.md-host-info  { display: flex; flex-direction: column; min-width: 0; }
.md-host-lbl   { font-size: 10px; font-weight: 700; color: var(--md-ink-m); text-transform: uppercase; letter-spacing: .4px; }
.md-host-name  { font-size: 13px; font-weight: 600; color: var(--md-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-mcard-actions { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }

/* Card action buttons */
.md-btn-join {
  display: flex; align-items: center; gap: 5px; padding: 7px 13px;
  background: var(--md-blue); color: var(--md-white); border: none; border-radius: 8px;
  font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; transition: all .15s; box-shadow: 0 2px 8px var(--md-blue-glow);
}
.md-btn-join:hover { background: var(--md-blue-dk); transform: translateY(-1px); }

.md-btn-restart {
  display: flex; align-items: center; gap: 4px; padding: 7px 11px;
  background: rgba(245,158,11,0.10); color: #d97706;
  border: 1.5px solid rgba(245,158,11,0.35);
  border-radius: 8px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; transition: all .15s;
}
.md-btn-restart:hover { background: rgba(245,158,11,0.2); border-color: var(--md-orange); }

.md-btn-end {
  display: flex; align-items: center; gap: 4px; padding: 7px 11px;
  background: rgba(239,68,68,0.08); color: var(--md-red);
  border: 1.5px solid rgba(239,68,68,0.28);
  border-radius: 8px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; transition: all .15s;
}
.md-btn-end:hover { background: var(--md-red); color: var(--md-white); border-color: var(--md-red); }

.md-btn-details { padding: 7px 14px; background: transparent; border: 1.5px solid var(--md-border); border-radius: 8px; color: var(--md-ink-m); font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; }
.md-btn-details:hover { border-color: var(--md-blue); color: var(--md-blue); background: var(--md-blue-soft); }

/* EMPTY STATE */
.md-empty { display: flex; flex-direction: column; align-items: center; padding: 64px 24px; text-align: center; gap: 12px; }
.md-empty-icon { width: 72px; height: 72px; border-radius: 50%; background: var(--md-blue-soft); border: 1.5px solid var(--md-blue-mid); display: flex; align-items: center; justify-content: center; color: var(--md-blue); }
.md-empty-msg { font-size: 15px; font-weight: 600; color: var(--md-ink-m); }
.md-empty-actions { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }

/* SIDEBAR */
.md-sidebar { position: sticky; top: 82px; align-self: flex-start; }
.md-sidebar-stats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.md-ss-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--md-surf2); border-radius: 10px; border: 1px solid var(--md-border); transition: background .15s, border-color .15s; }
.md-ss-item:hover { background: var(--md-blue-soft); border-color: var(--md-blue-mid); }
.md-ss-icon { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.md-ss-icon--blue   { background: var(--md-blue-soft);        color: var(--md-blue); }
.md-ss-icon--green  { background: rgba(16,185,129,0.12);      color: var(--md-green); }
.md-ss-icon--amber  { background: rgba(245,158,11,0.12);      color: var(--md-orange); }
.md-ss-icon--purple { background: rgba(139,92,246,0.12);      color: #8b5cf6; }
.md-ss-body { display: flex; flex-direction: column; }
.md-ss-val  { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--md-ink); line-height: 1.1; }
.md-ss-lbl  { font-size: 11px; color: var(--md-ink-m); font-weight: 600; margin-top: 2px; }
.md-chart-section { border-top: 1px solid var(--md-border); padding-top: 20px; margin-top: 4px; }
.md-chart-title   { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: var(--md-ink); margin-bottom: 14px; }
.md-chart { display: flex; align-items: flex-end; justify-content: space-between; gap: 5px; height: 90px; padding: 10px; background: var(--md-surf2); border-radius: 10px; border: 1px solid var(--md-border); }
.md-chart-col    { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
.md-chart-track  { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.md-chart-bar    { width: 100%; border-radius: 4px 4px 0 0; min-height: 3px; background: linear-gradient(180deg, var(--md-blue) 0%, var(--md-blue-dk) 100%); opacity: 0.65; transition: opacity .2s; }
.md-chart-col:hover .md-chart-bar { opacity: 1; }
.md-chart-lbl    { font-size: 9px; font-weight: 700; color: var(--md-ink-m); text-transform: uppercase; letter-spacing: .3px; }
.md-quick-stats { border-top: 1px solid var(--md-border); padding-top: 18px; margin-top: 18px; display: flex; flex-direction: column; gap: 8px; }
.md-qs-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: var(--md-surf2); border-radius: 8px; border: 1px solid var(--md-border); transition: background .15s; }
.md-qs-row:hover { background: var(--md-blue-soft); }
.md-qs-lbl { font-size: 12px; font-weight: 600; color: var(--md-ink-m); }
.md-qs-val { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: var(--md-ink); }

/* ════════════════════════════════════════
   MODALS
════════════════════════════════════════ */
.md-modal-overlay {
  position: fixed; inset: 0; z-index: 5000;
  background: rgba(13,27,54,.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.md-modal {
  background: var(--md-white);
  border: 1px solid var(--md-border);
  border-radius: 20px;
  padding: 40px 36px 32px;
  width: 100%; max-width: 430px;
  text-align: center;
  box-shadow: 0 24px 80px rgba(13,27,54,.18);
  animation: md-modal-in .22s cubic-bezier(.34,1.56,.64,1);
}
@keyframes md-modal-in { from { opacity:0; transform:translateY(18px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.md-modal-fx-enter-active, .md-modal-fx-leave-active { transition: opacity .18s; }
.md-modal-fx-enter-from, .md-modal-fx-leave-to { opacity: 0; }

.md-modal-icon {
  width: 68px; height: 68px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 22px;
}
.md-modal-icon--red    { background: rgba(239,68,68,.12);  color: var(--md-red);    border: 1.5px solid rgba(239,68,68,.3); }
.md-modal-icon--orange { background: rgba(245,158,11,.12); color: #d97706;          border: 1.5px solid rgba(245,158,11,.35); }

.md-modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 21px; font-weight: 700; color: var(--md-ink); margin-bottom: 12px; line-height: 1.3; }
.md-modal-body  { font-size: 14px; color: var(--md-ink-m); line-height: 1.65; margin-bottom: 28px; font-weight: 500; }

.md-modal-actions { display: flex; gap: 10px; justify-content: center; }
.md-modal-btn {
  flex: 1; max-width: 190px; padding: 12px 20px; border-radius: 10px;
  font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center; gap: 7px;
}
.md-modal-btn--ghost  { background: transparent; border: 1.5px solid var(--md-border); color: var(--md-ink-m); }
.md-modal-btn--ghost:hover:not(:disabled) { border-color: var(--md-ink-m); color: var(--md-ink); }
.md-modal-btn--danger {
  background: var(--md-red); border: none; color: var(--md-white);
  box-shadow: 0 2px 12px rgba(239,68,68,.3);
}
.md-modal-btn--danger:hover:not(:disabled) { background: #dc2626; box-shadow: 0 4px 18px rgba(239,68,68,.4); }
.md-modal-btn--orange {
  background: var(--md-orange); border: none; color: var(--md-white);
  box-shadow: 0 2px 12px rgba(245,158,11,.3);
}
.md-modal-btn--orange:hover:not(:disabled) { background: #d97706; box-shadow: 0 4px 18px rgba(245,158,11,.4); }
.md-modal-btn:disabled { opacity: .55; cursor: not-allowed; }

.md-modal-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: md-spin .65s linear infinite;
}

/* TOAST */
.md-toast { position: fixed; bottom: 28px; right: 28px; z-index: 6000; display: flex; align-items: center; gap: 10px; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; box-shadow: var(--md-shadow-lg); pointer-events: none; }
.md-toast--success { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: var(--md-green); }
.md-toast--error   { background: rgba(239,68,68,0.10);  border: 1px solid rgba(239,68,68,0.25); color: var(--md-red); }
.md-toast-fx-enter-active, .md-toast-fx-leave-active { transition: opacity .2s, transform .2s; }
.md-toast-fx-enter-from  { opacity: 0; transform: translateY(14px); }
.md-toast-fx-leave-to    { opacity: 0; transform: translateY(14px); }

/* RESPONSIVE */
@media (max-width: 1280px) { .md-body-grid { grid-template-columns: 1fr 280px; } }
@media (max-width: 1024px) { .md-body-grid { grid-template-columns: 1fr; } .md-sidebar { position: static; } .md-stats-row { grid-template-columns: repeat(2, 1fr); } .md-card-grid { grid-template-columns: 1fr; } }
@media (max-width: 640px) {
  .md-nav-inner { padding: 0 16px; }
  .md-page-meta { display: none; }
  .md-main { padding: 16px; }
  .md-stats-row { grid-template-columns: 1fr 1fr; gap: 10px; }
  .md-stat-val { font-size: 24px; }
  .md-filter-tabs { overflow-x: auto; }
  .md-card-grid { grid-template-columns: 1fr; }
  .md-active-actions { width: 100%; justify-content: flex-end; }
  .md-mcard-actions { width: 100%; }
  .md-empty-actions { flex-direction: column; width: 100%; }
  .md-modal { padding: 30px 20px 24px; }
  .md-modal-actions { flex-direction: column; }
  .md-modal-btn { max-width: 100%; }
}
@media (max-width: 480px) { .md-stats-row { grid-template-columns: 1fr; } }
</style>