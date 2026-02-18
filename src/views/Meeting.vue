<!-- Meeting.vue — FULLY FIXED WEBRTC VERSION -->
<!--
  ROOT CAUSE FIXES:
    ✅ FIX 1: this.$set(this.peers, peerId, pc) — makes peers reactive so v-for renders tile divs
    ✅ FIX 2: injectRemoteVideo waits $nextTick so Vue tile div exists before injecting video
    ✅ FIX 3: pendingStreams cache — streams that arrive before tile is rendered get queued & flushed
    ✅ FIX 4: reinjectAllPeerVideos() — re-injects all streams after screen share layout switch
    ✅ FIX 5: isPresenting watcher re-attaches localVideo + flushes pending streams on layout change
    ✅ FIX 6: Screen share layout — all peers shown in sidebar with their camera feeds
    ✅ FIX 7: WS double-close race condition fixed
-->
<template>
  <div class="nv-root">

    <!-- ════════════════════ PHASE 1 — CREATE ════════════════════ -->
    <div v-if="view === 'create'" class="nv-create-wrap">
      <nav class="nv-cnav">
        <div class="nv-cbrand" @click="goToDashboard">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1a73e8"/>
            <path d="M20 16L26 11V21L20 16Z" fill="white"/>
            <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
          </svg>
          <span>Nova</span>
        </div>
        <button class="nv-cnav-back" @click="goToDashboard">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Dashboard
        </button>
      </nav>

      <main class="nv-cmain">
        <div class="nv-chead">
          <h1 class="nv-ctitle">New meeting</h1>
          <p class="nv-csub">Configure and launch your meeting instantly.</p>
        </div>
        <div class="nv-card">
          <div v-if="created.code" class="nv-success-banner">
            <div class="nv-success-check">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div class="nv-success-title">Meeting created!</div>
              <div class="nv-success-sub">Share this code with participants</div>
            </div>
            <div class="nv-code-pill" @click="copyCreatedCode" title="Click to copy">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {{ created.code }}
            </div>
          </div>

          <div v-if="!created.code" class="nv-form-body">
            <div class="nv-section-label">Meeting details</div>
            <div class="nv-field">
              <label class="nv-flabel">Title <span class="nv-req">*</span></label>
              <input class="nv-finput" v-model="form.title" type="text" placeholder="e.g. Weekly team standup" />
            </div>
            <div class="nv-field">
              <label class="nv-flabel">Description <span class="nv-opt">(optional)</span></label>
              <textarea class="nv-finput nv-ftextarea" v-model="form.description" placeholder="What's this meeting about?"></textarea>
            </div>
            <div class="nv-row2">
              <div class="nv-field">
                <label class="nv-flabel">Max participants</label>
                <input class="nv-finput" v-model.number="form.maxParticipants" type="number" min="2" max="500" />
              </div>
              <div class="nv-field">
                <label class="nv-flabel">Password <span class="nv-opt">(optional)</span></label>
                <input class="nv-finput" v-model="form.password" type="text" placeholder="Leave blank = open" />
              </div>
            </div>
            <div class="nv-section-label" style="margin-top:28px">Options</div>
            <div class="nv-toggle-list">
              <label class="nv-trow" v-for="opt in toggleOpts" :key="opt.key">
                <div>
                  <div class="nv-trow-label">{{ opt.label }}</div>
                  <div v-if="opt.sub" class="nv-trow-sub">{{ opt.sub }}</div>
                </div>
                <div class="nv-switch" :class="{ 'nv-switch--on': form[opt.key] }" @click="form[opt.key] = !form[opt.key]">
                  <div class="nv-switch-thumb"></div>
                </div>
              </label>
            </div>
            <button class="nv-btn-primary" @click="createMeeting" :disabled="creating">
              <span v-if="creating" class="nv-spinner"></span>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ creating ? 'Creating…' : 'Create meeting' }}
            </button>
            <div v-if="createError" class="nv-alert-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ createError }}
            </div>
          </div>

          <div v-if="created.code" class="nv-postcreate">
            <button class="nv-btn-primary nv-btn-go" @click="enterMeeting">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start meeting now
            </button>
            <button class="nv-btn-ghost" @click="goToDashboard">Back to dashboard</button>
          </div>
        </div>
      </main>
    </div>

    <!-- ════════════════════ PHASE 2 — MEETING ════════════════════ -->
    <div v-if="view === 'meeting'" class="nv-meet">

      <header class="nv-header">
        <div class="nv-hleft">
          <div class="nv-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a73e8"/>
              <path d="M20 16L26 11V21L20 16Z" fill="white"/>
              <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
            </svg>
            <span class="nv-brand-name">Nova</span>
            <span class="nv-live-pill"><span class="nv-live-dot"></span>LIVE</span>
          </div>
          <button class="nv-code-chip" @click="copyMeetingCode">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>{{ meetingCode }}</span>
          </button>
          <div class="nv-pcount">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {{ participantCount }}
          </div>
          <span v-if="isHost" class="nv-host-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Host
          </span>
        </div>
        <div class="nv-hright">
          <span class="nv-clock">{{ currentTime }}</span>
          <button class="nv-hbtn" :class="{ 'nv-hbtn--on': chatOpen }" @click="toggleChat">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Chat
            <span v-if="unreadCount > 0" class="nv-unread">{{ unreadCount }}</span>
          </button>
          <button class="nv-hbtn nv-hbtn--danger" @click="goBack">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
        </div>
      </header>

      <!-- ══ VIDEO GRID ══ -->
      <div class="nv-grid" :class="{ 'nv-grid--presenting': isPresenting }" ref="videosGrid">

        <!-- SCREEN SHARE LAYOUT -->
        <template v-if="isPresenting">
          <div class="nv-gmain">
            <!-- LOCAL screen share main view -->
            <div v-if="screenStream" class="nv-tile nv-tile--screen">
              <video ref="screenVideo" autoplay playsinline></video>
              <div class="nv-tilebar">
                <div class="nv-tilemeta">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  {{ userName }} · Presenting
                </div>
              </div>
            </div>
            <!-- REMOTE screen share main view -->
            <!-- ✅ FIX: unique key forces re-render; id used by injectRemoteVideo -->
            <div
              v-else-if="activePresenterId"
              :key="`main-${activePresenterId}`"
              class="nv-tile nv-tile--screen"
              :id="`nv-tile-${activePresenterId}`"
            >
              <div class="nv-nocam"><div class="nv-avatar">📺</div></div>
            </div>
          </div>

          <!-- SIDEBAR — your face + all peers (camera feeds) -->
          <div class="nv-gsidebar">
            <!-- Your face always visible -->
            <div class="nv-tile nv-tile--me">
              <video ref="localVideo" autoplay muted playsinline></video>
              <div class="nv-tilebar">
                <div class="nv-tilemeta"><span class="nv-you-dot"></span>You</div>
                <div class="nv-tilebadges">
                  <span v-if="!audioOn" class="nv-badge nv-badge--red">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </span>
                  <span v-if="!videoOn" class="nv-badge nv-badge--red">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </span>
                </div>
              </div>
              <div v-if="!videoOn" class="nv-nocam"><div class="nv-avatar">{{ userInitials }}</div></div>
            </div>

            <!-- ✅ All peers shown in sidebar — presenter uses 'cam-{id}' tile for their camera face -->
            <div
              v-for="pid in peerIds"
              :key="`sidebar-${pid}`"
              class="nv-tile"
              :id="activePresenterId === pid ? `nv-tile-cam-${pid}` : `nv-tile-${pid}`"
            >
              <div class="nv-nocam"><div class="nv-avatar nv-avatar--sm">{{ pid.slice(-2).toUpperCase() }}</div></div>
            </div>
          </div>
        </template>

        <!-- NORMAL GRID LAYOUT -->
        <template v-else>
          <div class="nv-tile nv-tile--me" id="nv-local">
            <video ref="localVideo" autoplay muted playsinline></video>
            <div class="nv-tilebar">
              <div class="nv-tilemeta"><span class="nv-you-dot"></span>{{ userName }} (you)</div>
              <div class="nv-tilebadges" id="nv-local-badges">
                <span v-if="!audioOn" class="nv-badge nv-badge--red">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </span>
                <span v-if="!videoOn" class="nv-badge nv-badge--red">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </span>
              </div>
            </div>
            <div v-if="!videoOn" class="nv-nocam"><div class="nv-avatar">{{ userInitials }}</div></div>
          </div>

          <!-- ✅ FIX: peerIds is a reactive computed from Object.keys(peers) -->
          <div
            v-for="pid in peerIds"
            :key="`grid-${pid}`"
            class="nv-tile"
            :id="`nv-tile-${pid}`"
          >
            <div class="nv-nocam"><div class="nv-avatar nv-avatar--sm">{{ pid.slice(-2).toUpperCase() }}</div></div>
          </div>
        </template>
      </div>

      <!-- Controls -->
      <div class="nv-controls">
        <div class="nv-ctrl-row">
          <div class="nv-cslot">
            <button class="nv-ctrl" :class="audioOn ? 'nv-ctrl--on' : 'nv-ctrl--off'" @click="toggleAudio">
              <svg v-if="audioOn" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8"/></svg>
            </button>
            <span class="nv-clabel">{{ audioOn ? 'Mute' : 'Unmute' }}</span>
          </div>
          <div class="nv-cslot">
            <button class="nv-ctrl" :class="videoOn ? 'nv-ctrl--on' : 'nv-ctrl--off'" @click="toggleVideo">
              <svg v-if="videoOn" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
            <span class="nv-clabel">{{ videoOn ? 'Stop video' : 'Start video' }}</span>
          </div>
          <div class="nv-cslot">
            <button class="nv-ctrl" :class="screenStream ? 'nv-ctrl--sharing' : 'nv-ctrl--on'" @click="toggleScreen">
              <svg v-if="!screenStream" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="8 10 12 6 16 10"/><line x1="12" y1="6" x2="12" y2="14"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            </button>
            <span class="nv-clabel">{{ screenStream ? 'Stop sharing' : 'Present' }}</span>
          </div>
          <div class="nv-cdivider"></div>
          <template v-if="isHost">
            <div class="nv-cslot">
              <button class="nv-ctrl nv-ctrl--restart" @click="restartMeeting" :disabled="restarting">
                <span v-if="restarting" class="nv-spinner nv-spinner--sm"></span>
                <svg v-else width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
              </button>
              <span class="nv-clabel">Restart</span>
            </div>
            <div class="nv-cslot">
              <button class="nv-ctrl nv-ctrl--end" @click="endMeeting" :disabled="ending">
                <span v-if="ending" class="nv-spinner nv-spinner--sm"></span>
                <svg v-else width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              </button>
              <span class="nv-clabel nv-clabel--orange">End</span>
            </div>
            <div class="nv-cdivider"></div>
          </template>
          <div class="nv-cslot">
            <button class="nv-ctrl nv-ctrl--leave" @click="leave">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c1.12.45 2.3.78 3.53.978a2 2 0 0 1 1.67 1.98V20a2 2 0 0 1-2 2h-1C7.82 22 2 16.18 2 9V8a2 2 0 0 1 2-2h3.5a2 2 0 0 1 1.98 1.67c.19 1.23.52 2.41.978 3.53a2 2 0 0 1-.45 2.11L10.68 13.31z"/><line x1="22" y1="2" x2="11" y2="13"/></svg>
            </button>
            <span class="nv-clabel nv-clabel--red">Leave</span>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <div class="nv-chat" :class="{ 'nv-chat--open': chatOpen }">
        <div class="nv-chdr">
          <div class="nv-chdr-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            In-call messages
          </div>
          <button class="nv-chdr-close" @click="toggleChat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="nv-cmsgs" ref="messagesContainer">
          <div v-if="messages.length === 0" class="nv-cempty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p>No messages yet</p>
          </div>
          <div v-for="msg in messages" :key="msg.id" class="nv-cmsg" :class="{ 'nv-cmsg--self': msg.isSelf }">
            <div class="nv-cmsg-who">{{ msg.sender }}{{ msg.isSelf ? ' (you)' : '' }}</div>
            <div class="nv-cmsg-body">{{ msg.text }}</div>
          </div>
        </div>
        <div class="nv-cfoot">
          <input class="nv-cinput" type="text" v-model="chatMessage" @keypress.enter="sendMessage" placeholder="Message everyone…" />
          <button class="nv-csend" @click="sendMessage" :disabled="!chatMessage.trim()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <!-- End Modal -->
      <div v-if="showEndModal" class="nv-modal-overlay" @click.self="showEndModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--red">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h2 class="nv-modal-title">End meeting for everyone?</h2>
          <p class="nv-modal-body">This will end the call for all participants and mark the meeting as completed.</p>
          <div class="nv-modal-actions">
            <button class="nv-modal-btn nv-modal-btn--ghost" @click="showEndModal = false">Cancel</button>
            <button class="nv-modal-btn nv-modal-btn--danger" @click="confirmEndMeeting" :disabled="ending">
              <span v-if="ending" class="nv-spinner nv-spinner--sm"></span>
              End for everyone
            </button>
          </div>
        </div>
      </div>

      <!-- Restart Modal -->
      <div v-if="showRestartModal" class="nv-modal-overlay" @click.self="showRestartModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--blue">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          </div>
          <h2 class="nv-modal-title">Restart this meeting?</h2>
          <p class="nv-modal-body">All current participants will be disconnected and the meeting will restart fresh.</p>
          <div class="nv-modal-actions">
            <button class="nv-modal-btn nv-modal-btn--ghost" @click="showRestartModal = false">Cancel</button>
            <button class="nv-modal-btn nv-modal-btn--primary" @click="confirmRestartMeeting" :disabled="restarting">
              <span v-if="restarting" class="nv-spinner nv-spinner--sm"></span>
              Restart meeting
            </button>
          </div>
        </div>
      </div>

      <transition name="nv-toast-fx">
        <div v-if="toastVisible" class="nv-toast" :class="toastType === 'error' ? 'nv-toast--error' : ''">
          <svg v-if="toastType !== 'error'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/></svg>
          {{ toastMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';

const API    = 'https://nova-test-ctne.onrender.com/api';
const WS_URL = 'wss://nova-test-ctne.onrender.com/ws/webrtc';

export default {
  name: 'Meeting',

  data() {
    return {
      view: 'create',
      form: {
        title: '', description: '', maxParticipants: 50, password: '',
        allowGuests: true, videoEnabled: true, audioEnabled: true,
        chatEnabled: true, screenShareEnabled: true,
      },
      toggleOpts: [
        { key: 'allowGuests',        label: 'Allow guests',       sub: 'Anyone can join without an account' },
        { key: 'videoEnabled',       label: 'Video on by default' },
        { key: 'audioEnabled',       label: 'Audio on by default' },
        { key: 'chatEnabled',        label: 'Enable chat' },
        { key: 'screenShareEnabled', label: 'Screen sharing' },
      ],
      creating: false, createError: '',
      created: { code: null, title: null },

      ws: null,
      peers: {},           // ✅ mutated only via this.$set / this.$delete
      pendingStreams: {},   // ✅ peerId → { stream, tileId } — flushed when tile renders
      localStream: null,
      screenStream: null,

      meetingCode: '',
      myPeerId: `peer_${Math.random().toString(36).substr(2, 9)}`,
      participantCount: 1,
      isHost: false,

      showEndModal: false, showRestartModal: false,
      ending: false, restarting: false,

      userName: 'Guest', userInitials: 'G',
      videoOn: true, audioOn: true,
      activePresenterId: null,

      chatOpen: false, chatMessage: '', messages: [], unreadCount: 0,
      toastVisible: false, toastMessage: '', toastType: 'success',
      currentTime: '', clockInterval: null,

      ICE_SERVERS: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
    token()           { return TokenService.getAccessToken(); },

    // ✅ FIX: reactive list — Vue tracks this when $set/$delete mutates peers
    peerIds() { return Object.keys(this.peers); },

    // ✅ single source of truth for layout
    isPresenting() { return !!(this.screenStream || this.activePresenterId); },
  },

  watch: {
    // ✅ FIX: re-attach video elements after layout switches (Vue re-renders refs)
    isPresenting() {
      this.$nextTick(() => {
        if (this.$refs.localVideo && this.localStream) {
          this.$refs.localVideo.srcObject = this.localStream;
        }
        if (this.$refs.screenVideo && this.screenStream) {
          this.$refs.screenVideo.srcObject = this.screenStream;
        }
        // Flush queued streams + re-inject all existing peer streams
        this.flushPendingStreams();
        this.reinjectAllPeerVideos();
      });
    },

    // ✅ FIX: new peer tile just rendered — flush any waiting streams
    peerIds() {
      this.$nextTick(() => this.flushPendingStreams());
    },
  },

  methods: {
    // ═══════════════════════════════════════════════════════
    //  CREATE
    // ═══════════════════════════════════════════════════════
    goToDashboard() {
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/join-meeting');
    },

    async createMeeting() {
      if (!this.form.title.trim()) { this.createError = 'Please enter a meeting title.'; return; }
      if (!this.token)             { this.createError = 'Session expired — please sign in again.'; return; }
      this.creating = true; this.createError = '';

      const pw = this.form.password.trim();
      const body = {
        title: this.form.title.trim(), description: this.form.description.trim() || null,
        maxParticipants: this.form.maxParticipants || 50, allowGuests: this.form.allowGuests,
        requiresPassword: pw.length > 0, password: pw || null,
        videoEnabled: this.form.videoEnabled, audioEnabled: this.form.audioEnabled,
        chatEnabled: this.form.chatEnabled, screenShareEnabled: this.form.screenShareEnabled,
        isPublic: false,
      };
      try {
        const res = await fetch(`${API}/meetings/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
          body: JSON.stringify(body),
        });
        let data; try { data = await res.json(); } catch { throw new Error(`HTTP ${res.status}`); }
        if (!res.ok || data.success === false) throw new Error(data.message || data.error || `HTTP ${res.status}`);

        const code = data?.data?.meetingCode || data?.data?.meeting_code || data?.data?.code
          || data?.data?.meeting?.meetingCode || data?.data?.meeting?.code
          || data?.meetingCode || data?.code || null;
        if (!code) throw new Error('No meeting code returned from server.');

        try {
          await fetch(`${API}/meetings/start/${code}`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
          });
        } catch (_) {}

        const recent = JSON.parse(sessionStorage.getItem('nova_recent') || '[]');
        recent.unshift({ code, title: body.title, date: new Date().toLocaleDateString() });
        sessionStorage.setItem('nova_recent', JSON.stringify(recent.slice(0, 10)));
        this.created = { code, title: body.title };
      } catch (err) {
        this.createError = err.message || 'Unexpected error.';
      } finally { this.creating = false; }
    },

    copyCreatedCode() {
      if (!this.created.code) return;
      navigator.clipboard.writeText(this.created.code).then(() => this.showToast('Code copied!'));
    },

    enterMeeting() {
      if (!this.created.code) return;
      sessionStorage.setItem('nova_meeting_code', this.created.code);
      this.meetingCode = this.created.code;
      this.isHost = true;
      this.view = 'meeting';
      this.$nextTick(() => this.initMeeting());
    },

    // ═══════════════════════════════════════════════════════
    //  INIT
    // ═══════════════════════════════════════════════════════
    updateClock() {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    async initMeeting() {
      if (!this.meetingCode) {
        this.meetingCode = this.$route?.params?.code || sessionStorage.getItem('nova_meeting_code');
      }
      if (!this.meetingCode) { this.$router.push('/join-meeting'); return; }

      const user = JSON.parse(sessionStorage.getItem('nova_user') || '{}');
      this.userName     = user.name || 'Guest';
      this.userInitials = this.userName.charAt(0).toUpperCase();

      if (!this.isHost) this.isHost = sessionStorage.getItem('nova_is_host') === 'true';
      if (this.isHost)  sessionStorage.setItem('nova_is_host', 'true');

      this.updateClock();
      this.clockInterval = setInterval(this.updateClock, 10000);

      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }, audio: true,
        });
        await this.$nextTick();
        if (this.$refs.localVideo) this.$refs.localVideo.srcObject = this.localStream;
      } catch (err) {
        console.warn('No camera/mic:', err.message);
        this.videoOn = false; this.audioOn = false;
      }

      this.connectWebSocket();
    },

    // ═══════════════════════════════════════════════════════
    //  WEBSOCKET
    // ═══════════════════════════════════════════════════════
    connectWebSocket() {
      const url = this.token ? `${WS_URL}?token=${this.token}` : WS_URL;
      this.ws = new WebSocket(url);
      this.ws.onopen    = () => this.sendWs({ type: 'JOIN' });
      this.ws.onmessage = async (e) => await this.handleWsMsg(JSON.parse(e.data));
      this.ws.onerror   = (e) => console.error('WS error', e);
      this.ws.onclose   = ()  => console.log('WS closed');
    },

    sendWs(obj) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        obj.meetingCode = this.meetingCode;
        obj.fromPeerId  = this.myPeerId;
        this.ws.send(JSON.stringify(obj));
      }
    },

    async handleWsMsg(msg) {
      switch (msg.type) {
        case 'PARTICIPANT_LIST':
          msg.data.peers.forEach(id => this.createPC(id, true));
          this.participantCount = msg.data.peers.length + 1;
          break;
        case 'JOIN':            this.participantCount++;                   break;
        case 'LEAVE':           this.peerLeave(msg.fromPeerId);            break;
        case 'OFFER':           await this.handleOffer(msg);               break;
        case 'ANSWER':          await this.handleAnswer(msg);              break;
        case 'ICE_CANDIDATE':   await this.handleICE(msg);                 break;
        case 'CHAT_MESSAGE':
          this.addMsg(msg.data.senderName, msg.data.message, false);
          if (!this.chatOpen) this.unreadCount++;
          break;
        case 'TOGGLE_VIDEO':
        case 'TOGGLE_AUDIO':    this.updatePeerBadge(msg);                break;
        case 'SCREEN_SHARE_START': this.remoteScreenStart(msg.fromPeerId); break;
        case 'SCREEN_SHARE_STOP':  this.remoteScreenStop(msg.fromPeerId);  break;
        case 'MEETING_ENDED':
          this.showToast('Meeting ended by host.', 'error');
          setTimeout(() => this.cleanupAndNavigate(), 1800);
          break;
        case 'MEETING_RESTARTED':
          this.showToast('Meeting restarted by host.');
          this.cleanupPeers();
          this.connectWebSocket();
          break;
      }
    },

    // ═══════════════════════════════════════════════════════
    //  WEBRTC — PEER CONNECTIONS
    // ═══════════════════════════════════════════════════════

    // ✅ FIX: this.$set makes peers reactive so v-for re-renders tile divs
    createPC(peerId, isInit) {
      if (this.peers[peerId]) return this.peers[peerId];

      const pc = new RTCPeerConnection(this.ICE_SERVERS);

      // ✅ Add all local tracks so remote peer can see/hear us
      if (this.localStream) {
        this.localStream.getTracks().forEach(t => pc.addTrack(t, this.localStream));
      }

      pc.ontrack = (e) => {
        console.log('🎥 ontrack from', peerId, e.streams);
        if (e.streams && e.streams[0]) {
          this.injectRemoteVideo(peerId, e.streams[0]);
        }
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) this.sendWs({ type: 'ICE_CANDIDATE', toPeerId: peerId, data: e.candidate });
      };

      pc.onconnectionstatechange = () => {
        console.log(`🔗 PC [${peerId.slice(-4)}]:`, pc.connectionState);
        if (['disconnected', 'failed'].includes(pc.connectionState)) this.peerLeave(peerId);
      };

      // ✅ $set — makes Vue aware of this new key so v-for picks it up
      this.$set(this.peers, peerId, pc);

      if (isInit) {
        // Wait for Vue to render the tile div, then create offer
        this.$nextTick(() => {
          pc.createOffer()
            .then(o => pc.setLocalDescription(o))
            .then(() => this.sendWs({ type: 'OFFER', toPeerId: peerId, data: pc.localDescription }))
            .catch(console.error);
        });
      }

      return pc;
    },

    async handleOffer(msg) {
      const id = msg.fromPeerId;
      const pc = this.peers[id] || this.createPC(id, false);
      // ✅ Wait for Vue to render this peer's tile before proceeding
      await this.$nextTick();
      await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      this.sendWs({ type: 'ANSWER', toPeerId: id, data: pc.localDescription });
    },

    async handleAnswer(msg) {
      const pc = this.peers[msg.fromPeerId];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
    },

    async handleICE(msg) {
      const pc = this.peers[msg.fromPeerId];
      if (pc) {
        try { await pc.addIceCandidate(new RTCIceCandidate(msg.data)); }
        catch (e) { console.warn('ICE error:', e); }
      }
    },

    // ═══════════════════════════════════════════════════════
    //  VIDEO INJECTION
    // ═══════════════════════════════════════════════════════

    // ✅ FIX: determines correct tile ID, waits for DOM, queues if not ready
    injectRemoteVideo(peerId, stream) {
      if (!stream) return;

      // During screen share: presenter's camera goes to sidebar tile 'cam-{pid}'
      // Everyone else goes to 'nv-tile-{pid}'
      const tileId = (this.activePresenterId === peerId && !this.screenStream)
        ? `nv-tile-cam-${peerId}`
        : `nv-tile-${peerId}`;

      const doInject = (id) => {
        const tile = document.getElementById(id);
        if (!tile) return false;

        // Remove placeholder
        tile.querySelectorAll('.nv-nocam').forEach(el => el.remove());

        let video = tile.querySelector('video');
        if (!video) {
          video = document.createElement('video');
          video.autoplay = true;
          video.playsinline = true;
          video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;position:absolute;top:0;left:0;';
          tile.appendChild(video);

          const bar    = document.createElement('div'); bar.className = 'nv-tilebar';
          const meta   = document.createElement('div'); meta.className = 'nv-tilemeta';
          meta.textContent = `Peer ${peerId.slice(-4).toUpperCase()}`;
          const badges = document.createElement('div'); badges.className = 'nv-tilebadges';
          badges.id = `nv-badges-${peerId}`;
          bar.append(meta, badges);
          tile.appendChild(bar);
        }

        video.srcObject = stream;
        video.play().catch(() => {});
        console.log(`✅ Video injected → #${id}`);
        return true;
      };

      // Try immediately
      if (doInject(tileId)) return;

      // ✅ Wait one tick (Vue may be mid-render)
      this.$nextTick(() => {
        if (doInject(tileId)) return;

        // ✅ Queue it — will be retried when peerIds changes or layout switches
        console.warn(`⏳ Queuing stream for ${peerId} (tile #${tileId} not in DOM yet)`);
        this.pendingStreams[peerId] = { stream, tileId };

        // ✅ Hard fallback — append tile to grid if Vue never renders it
        setTimeout(() => {
          if (!this.pendingStreams[peerId]) return; // already flushed
          delete this.pendingStreams[peerId];
          console.warn(`🆘 Hard fallback: manually creating tile for ${peerId}`);
          const grid = this.$refs.videosGrid;
          if (!grid) return;
          if (!document.getElementById(`nv-tile-${peerId}`)) {
            const w = document.createElement('div');
            w.className = 'nv-tile'; w.id = `nv-tile-${peerId}`;
            grid.appendChild(w);
          }
          doInject(`nv-tile-${peerId}`);
        }, 1000);
      });
    },

    // ✅ Re-inject any streams that were waiting for their tile to appear
    flushPendingStreams() {
      Object.entries(this.pendingStreams).forEach(([peerId, { stream, tileId }]) => {
        const tile = document.getElementById(tileId);
        if (tile) {
          delete this.pendingStreams[peerId];
          this.injectRemoteVideo(peerId, stream);
        }
      });
    },

    // ✅ Re-inject all peer streams (called after layout switches)
    reinjectAllPeerVideos() {
      Object.keys(this.peers).forEach(peerId => {
        const pc = this.peers[peerId];
        if (!pc) return;
        // Collect all remote video+audio tracks into one stream
        const tracks = pc.getReceivers()
          .map(r => r.track)
          .filter(Boolean);
        if (tracks.length > 0) {
          const stream = new MediaStream(tracks);
          this.injectRemoteVideo(peerId, stream);
        }
      });
    },

    peerLeave(id) {
      const pc = this.peers[id];
      if (pc) { pc.close(); this.$delete(this.peers, id); }
      document.getElementById(`nv-tile-${id}`)?.remove();
      document.getElementById(`nv-tile-cam-${id}`)?.remove();
      if (this.activePresenterId === id) this.remoteScreenStop(id);
      delete this.pendingStreams[id];
      this.participantCount = Math.max(1, this.participantCount - 1);
    },

    cleanupPeers() {
      Object.values(this.peers).forEach(pc => pc.close());
      this.peers = {};
      this.pendingStreams = {};
      this.participantCount = 1;
      this.activePresenterId = null;
    },

    updatePeerBadge(msg) {
      const box = document.getElementById(`nv-badges-${msg.fromPeerId}`);
      if (!box) return;
      const eid = `${msg.type === 'TOGGLE_AUDIO' ? 'nv-ai' : 'nv-vi'}-${msg.fromPeerId}`;
      let el = document.getElementById(eid);
      if (!msg.data.enabled) {
        if (!el) {
          el = document.createElement('span'); el.id = eid; el.className = 'nv-badge nv-badge--red';
          el.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
          box.appendChild(el);
        }
      } else { el?.remove(); }
    },

    // ═══════════════════════════════════════════════════════
    //  MEDIA CONTROLS
    // ═══════════════════════════════════════════════════════
    toggleAudio() {
      if (!this.localStream) return;
      this.audioOn = !this.audioOn;
      this.localStream.getAudioTracks().forEach(t => { t.enabled = this.audioOn; });
      this.sendWs({ type: 'TOGGLE_AUDIO', data: { enabled: this.audioOn } });
    },

    toggleVideo() {
      if (!this.localStream) return;
      this.videoOn = !this.videoOn;
      this.localStream.getVideoTracks().forEach(t => { t.enabled = this.videoOn; });
      this.sendWs({ type: 'TOGGLE_VIDEO', data: { enabled: this.videoOn } });
    },

    async toggleScreen() {
      if (this.screenStream) {
        // ─── STOP screen share ───
        this.screenStream.getTracks().forEach(t => t.stop());
        this.screenStream = null;

        // Restore camera track to all peers
        if (this.localStream) {
          const vt = this.localStream.getVideoTracks()[0];
          Object.values(this.peers).forEach(pc => {
            const sender = pc.getSenders().find(s => s.track?.kind === 'video');
            if (sender && vt) sender.replaceTrack(vt);
          });
        }
        this.sendWs({ type: 'SCREEN_SHARE_STOP' });

        // Re-attach local cam after grid layout reverts
        await this.$nextTick();
        if (this.$refs.localVideo && this.localStream) {
          this.$refs.localVideo.srcObject = this.localStream;
        }
        // Re-inject peer videos back into grid tiles
        this.reinjectAllPeerVideos();

      } else {
        // ─── START screen share ───
        try {
          this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const st = this.screenStream.getVideoTracks()[0];

          // Replace camera track with screen track for all peers
          Object.values(this.peers).forEach(pc => {
            const sender = pc.getSenders().find(s => s.track?.kind === 'video');
            if (sender) sender.replaceTrack(st);
          });

          // Attach to local preview elements after layout switches
          await this.$nextTick();
          if (this.$refs.screenVideo) this.$refs.screenVideo.srcObject = this.screenStream;
          if (this.$refs.localVideo && this.localStream) this.$refs.localVideo.srcObject = this.localStream;

          // Re-inject peer cameras into sidebar tiles
          this.reinjectAllPeerVideos();

          st.onended = () => this.toggleScreen();
          this.sendWs({ type: 'SCREEN_SHARE_START' });
        } catch (err) {
          console.error('Screen share error:', err);
        }
      }
    },

    remoteScreenStart(peerId) {
      this.activePresenterId = peerId;
      // Layout switches — after re-render, inject streams into new tile positions
      this.$nextTick(() => {
        this.reinjectAllPeerVideos();
        this.flushPendingStreams();
      });
    },

    remoteScreenStop(peerId) {
      if (this.activePresenterId === peerId) this.activePresenterId = null;
      // Layout reverts to grid — re-inject into grid tiles
      this.$nextTick(() => {
        this.reinjectAllPeerVideos();
      });
    },

    // ═══════════════════════════════════════════════════════
    //  HOST ACTIONS
    // ═══════════════════════════════════════════════════════
    endMeeting()     { this.showEndModal = true; },
    restartMeeting() { this.showRestartModal = true; },

    async confirmEndMeeting() {
      this.ending = true;
      try {
        await fetch(`${API}/meetings/end/${this.meetingCode}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        });
        this.sendWs({ type: 'MEETING_ENDED', data: { endedBy: this.userName } });
      } catch (err) { console.error('End meeting error:', err); }
      setTimeout(() => {
        this.ending = false; this.showEndModal = false;
        sessionStorage.removeItem('nova_is_host');
        sessionStorage.removeItem('nova_meeting_code');
        this.cleanupAndNavigate();
      }, 600);
    },

    async confirmRestartMeeting() {
      this.restarting = true;
      try {
        await fetch(`${API}/meetings/end/${this.meetingCode}`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        }).catch(() => {});
        await fetch(`${API}/meetings/start/${this.meetingCode}`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
        }).catch(() => {});

        this.sendWs({ type: 'MEETING_RESTARTED', data: { restartedBy: this.userName } });
        this.cleanupPeers();
        if (this.ws) { this.ws.onclose = null; this.ws.close(); this.ws = null; }

        this.showRestartModal = false; this.restarting = false;
        this.messages = [];
        this.showToast('Meeting restarted!');
        await this.$nextTick();
        this.connectWebSocket();
      } catch (err) {
        console.error('Restart error:', err);
        this.restarting = false;
        this.showToast('Failed to restart meeting.', 'error');
      }
    },

    // ═══════════════════════════════════════════════════════
    //  CHAT
    // ═══════════════════════════════════════════════════════
    toggleChat() {
      this.chatOpen = !this.chatOpen;
      if (this.chatOpen) this.unreadCount = 0;
    },

    sendMessage() {
      const text = this.chatMessage.trim(); if (!text) return;
      this.addMsg(this.userName, text, true);
      this.sendWs({ type: 'CHAT_MESSAGE', data: { message: text, senderName: this.userName, timestamp: Date.now() } });
      this.chatMessage = '';
    },

    addMsg(sender, text, isSelf) {
      this.messages.push({ id: Date.now() + Math.random(), sender, text, isSelf });
      this.$nextTick(() => { const c = this.$refs.messagesContainer; if (c) c.scrollTop = c.scrollHeight; });
    },

    // ═══════════════════════════════════════════════════════
    //  UTILITIES
    // ═══════════════════════════════════════════════════════
    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode).then(() => this.showToast('Code copied!'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg; this.toastType = type; this.toastVisible = true;
      setTimeout(() => { this.toastVisible = false; }, 2800);
    },

    goBack() {
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/join-meeting');
    },

    cleanupAndNavigate() {
      this.localStream?.getTracks().forEach(t => t.stop());
      this.screenStream?.getTracks().forEach(t => t.stop());
      Object.values(this.peers).forEach(pc => pc.close());
      this.peers = {}; this.pendingStreams = {};
      if (this.ws) { this.sendWs({ type: 'LEAVE' }); this.ws.close(); this.ws = null; }
      sessionStorage.removeItem('nova_meeting_code');
      sessionStorage.removeItem('nova_is_host');
      clearInterval(this.clockInterval);
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/join-meeting');
    },

    leave() {
      const msg = this.isHost
        ? 'Leave this meeting? (Use "End" to close for everyone.)'
        : 'Leave this meeting?';
      if (!confirm(msg)) return;
      this.cleanupAndNavigate();
    },
  },

  mounted() {
    const forceCreate = this.$route?.query?.create === 'true';
    if (forceCreate) {
      sessionStorage.removeItem('nova_meeting_code');
      sessionStorage.removeItem('nova_is_host');
      this.view = 'create';
    } else {
      const routeCode = this.$route?.params?.code || sessionStorage.getItem('nova_meeting_code');
      if (routeCode) {
        this.meetingCode = routeCode;
        this.isHost = sessionStorage.getItem('nova_is_host') === 'true';
        this.view = 'meeting';
        this.$nextTick(() => this.initMeeting());
      }
    }

    window.addEventListener('keydown', (e) => {
      if (this.view !== 'meeting') return;
      if (e.key === 'd') this.toggleVideo();
      if (e.key === 'a') this.toggleAudio();
    });
  },

  beforeUnmount() {
    clearInterval(this.clockInterval);
    this.localStream?.getTracks().forEach(t => t.stop());
    this.screenStream?.getTracks().forEach(t => t.stop());
    Object.values(this.peers).forEach(pc => pc.close());
    if (this.ws) { this.ws.close(); this.ws = null; }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

.nv-root {
  --c-bg:     #202124; --c-surf:   #292b2f; --c-surf2:  #3c4043;
  --c-line:   #3c4043; --c-blue:   #1a73e8; --c-blue2:  #174ea6;
  --c-green:  #34a853; --c-red:    #ea4335; --c-red-bg: rgba(234,67,53,.15);
  --c-orange: #fa7b17; --c-text:   #e8eaed; --c-text2:  #9aa0a6; --c-r: 8px;
  font-family: 'Google Sans', system-ui, sans-serif;
}

/* ── CREATE ───────────────────────────────────────────── */
.nv-create-wrap { min-height:100vh; background:var(--c-bg); color:var(--c-text); display:flex; flex-direction:column; }
.nv-cnav { display:flex; align-items:center; justify-content:space-between; padding:14px 32px; background:var(--c-surf); border-bottom:1px solid var(--c-line); }
.nv-cbrand { display:flex; align-items:center; gap:10px; font-size:17px; font-weight:600; color:var(--c-text); cursor:pointer; }
.nv-cnav-back { display:flex; align-items:center; gap:7px; padding:7px 16px; border:1px solid var(--c-line); border-radius:var(--c-r); background:transparent; color:var(--c-text2); font-family:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; }
.nv-cnav-back:hover { border-color:var(--c-blue); color:var(--c-text); background:rgba(26,115,232,.08); }
.nv-cmain { max-width:560px; margin:0 auto; padding:44px 24px 60px; width:100%; }
.nv-chead { margin-bottom:28px; }
.nv-ctitle { font-size:26px; font-weight:600; color:var(--c-text); letter-spacing:-.3px; margin-bottom:6px; }
.nv-csub { font-size:14px; color:var(--c-text2); }
.nv-card { background:var(--c-surf); border:1px solid var(--c-line); border-radius:16px; padding:32px; box-shadow:0 8px 40px rgba(0,0,0,.4); }
.nv-success-banner { display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:12px; background:rgba(52,168,83,.1); border:1px solid rgba(52,168,83,.3); margin-bottom:24px; flex-wrap:wrap; }
.nv-success-check { width:36px; height:36px; border-radius:50%; background:rgba(52,168,83,.2); border:1px solid rgba(52,168,83,.4); display:flex; align-items:center; justify-content:center; color:#81c995; flex-shrink:0; }
.nv-success-title { font-size:14px; font-weight:600; color:var(--c-text); }
.nv-success-sub { font-size:12px; color:var(--c-text2); margin-top:2px; }
.nv-code-pill { display:flex; align-items:center; gap:7px; margin-left:auto; padding:8px 16px; border-radius:24px; background:rgba(52,168,83,.12); border:1px solid rgba(52,168,83,.3); font-family:'Google Sans Mono',monospace; font-size:15px; font-weight:600; color:#81c995; cursor:pointer; letter-spacing:1px; transition:background .15s; }
.nv-code-pill:hover { background:rgba(52,168,83,.22); }
.nv-section-label { font-size:11px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:var(--c-text2); margin-bottom:14px; }
.nv-field { margin-bottom:16px; }
.nv-flabel { display:block; font-size:13px; font-weight:500; color:var(--c-text2); margin-bottom:7px; }
.nv-req { color:var(--c-red); } .nv-opt { color:#5f6368; font-weight:400; }
.nv-finput { width:100%; padding:11px 14px; background:var(--c-surf2); border:1px solid var(--c-line); border-radius:var(--c-r); color:var(--c-text); font-family:inherit; font-size:14px; transition:border-color .15s,box-shadow .15s; }
.nv-finput::placeholder { color:#5f6368; }
.nv-finput:focus { outline:none; border-color:var(--c-blue); box-shadow:0 0 0 3px rgba(26,115,232,.18); }
.nv-ftextarea { resize:vertical; min-height:70px; line-height:1.5; }
.nv-row2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.nv-toggle-list { border:1px solid var(--c-line); border-radius:var(--c-r); overflow:hidden; }
.nv-trow { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; cursor:pointer; border-bottom:1px solid var(--c-line); transition:background .12s; }
.nv-trow:last-child { border-bottom:none; }
.nv-trow:hover { background:rgba(255,255,255,.03); }
.nv-trow-label { font-size:14px; color:var(--c-text); } .nv-trow-sub { font-size:12px; color:var(--c-text2); margin-top:2px; }
.nv-switch { width:40px; height:22px; border-radius:22px; background:var(--c-surf2); border:1px solid var(--c-line); position:relative; flex-shrink:0; transition:background .2s,border-color .2s; }
.nv-switch--on { background:var(--c-blue); border-color:var(--c-blue); }
.nv-switch-thumb { position:absolute; width:16px; height:16px; border-radius:50%; background:var(--c-text2); top:2px; left:2px; transition:transform .2s,background .2s; }
.nv-switch--on .nv-switch-thumb { transform:translateX(18px); background:#fff; }
.nv-btn-primary { width:100%; margin-top:24px; padding:13px 20px; background:var(--c-blue); border:none; border-radius:var(--c-r); color:#fff; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s,transform .1s,box-shadow .15s; box-shadow:0 2px 12px rgba(26,115,232,.35); }
.nv-btn-primary:hover:not(:disabled) { background:var(--c-blue2); transform:translateY(-1px); box-shadow:0 6px 20px rgba(26,115,232,.45); }
.nv-btn-primary:disabled { opacity:.55; cursor:not-allowed; }
.nv-btn-go { background:#34a853; box-shadow:0 2px 12px rgba(52,168,83,.35); }
.nv-btn-go:hover:not(:disabled) { background:#2d9248; }
.nv-btn-ghost { width:100%; margin-top:10px; padding:12px 20px; background:transparent; border:1px solid var(--c-line); border-radius:var(--c-r); color:var(--c-text2); font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; transition:all .15s; }
.nv-btn-ghost:hover { border-color:var(--c-blue); color:var(--c-text); background:rgba(26,115,232,.06); }
.nv-postcreate { margin-top:8px; }
.nv-alert-error { display:flex; align-items:center; gap:8px; margin-top:14px; padding:11px 14px; border-radius:var(--c-r); background:rgba(234,67,53,.1); border:1px solid rgba(234,67,53,.3); font-size:13px; color:#f28b82; }
.nv-spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:nv-spin .65s linear infinite; }
.nv-spinner--sm { width:13px; height:13px; border:2px solid rgba(255,255,255,.25); border-top-color:currentColor; }
@keyframes nv-spin { to { transform:rotate(360deg); } }

/* ── MEETING ──────────────────────────────────────────── */
.nv-meet { background:var(--c-bg); color:var(--c-text); display:flex; flex-direction:column; position:fixed; inset:0; z-index:9999; overflow:hidden; }
.nv-header { height:60px; flex-shrink:0; background:var(--c-bg); border-bottom:1px solid var(--c-line); display:flex; align-items:center; justify-content:space-between; padding:0 20px; z-index:10; }
.nv-hleft,.nv-hright { display:flex; align-items:center; gap:12px; }
.nv-brand { display:flex; align-items:center; gap:8px; }
.nv-brand-name { font-size:16px; font-weight:600; letter-spacing:-.2px; }
.nv-live-pill { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; letter-spacing:.5px; padding:3px 8px; border-radius:20px; background:rgba(234,67,53,.14); border:1px solid rgba(234,67,53,.3); color:#f28b82; }
.nv-live-dot { width:6px; height:6px; border-radius:50%; background:var(--c-red); animation:nv-pulse 2s ease-in-out infinite; }
@keyframes nv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.65)} }
.nv-host-badge { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; padding:3px 9px; border-radius:20px; background:rgba(250,123,23,.14); border:1px solid rgba(250,123,23,.35); color:#fba45c; }
.nv-code-chip { display:flex; align-items:center; gap:6px; padding:5px 12px; background:var(--c-surf); border:1px solid var(--c-line); border-radius:var(--c-r); color:#8ab4f8; font-family:'Google Sans Mono',monospace; font-size:12px; cursor:pointer; transition:background .15s; }
.nv-code-chip:hover { background:var(--c-surf2); border-color:#8ab4f8; }
.nv-pcount { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--c-text2); }
.nv-clock { font-size:13px; color:var(--c-text2); min-width:42px; text-align:right; }
.nv-hbtn { display:flex; align-items:center; gap:6px; padding:7px 14px; border:1px solid var(--c-line); border-radius:var(--c-r); background:transparent; color:var(--c-text2); font-family:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; position:relative; }
.nv-hbtn:hover,.nv-hbtn--on { background:var(--c-surf2); color:var(--c-text); border-color:var(--c-surf2); }
.nv-hbtn--danger { border-color:rgba(234,67,53,.35); color:#f28b82; }
.nv-hbtn--danger:hover { background:rgba(234,67,53,.14); border-color:var(--c-red); }
.nv-unread { min-width:17px; height:17px; border-radius:9px; background:var(--c-blue); color:#fff; font-size:10px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; padding:0 4px; }

/* ── GRID ─────────────────────────────────────────────── */
.nv-grid {
  flex:1; min-height:0;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:12px; padding:16px;
  overflow-y:auto; align-content:start;
  background:var(--c-bg);
}
.nv-grid:has(> .nv-tile:nth-child(2))  { grid-template-columns:repeat(2,1fr); }
.nv-grid:has(> .nv-tile:nth-child(5))  { grid-template-columns:repeat(3,1fr); }
.nv-grid:has(> .nv-tile:nth-child(10)) { grid-template-columns:repeat(4,1fr); }

.nv-grid--presenting {
  grid-template-columns:1fr 300px;
  grid-template-rows:1fr;
  align-content:stretch;
  gap:12px;
}
.nv-gmain { grid-column:1; grid-row:1; display:flex; align-items:center; justify-content:center; min-height:0; border-radius:16px; overflow:hidden; background:#000; }
.nv-gsidebar { grid-column:2; grid-row:1; display:flex; flex-direction:column; gap:10px; overflow-y:auto; min-height:0; padding-right:4px; }
.nv-gsidebar .nv-tile { flex-shrink:0; aspect-ratio:16/9; min-height:100px; }
.nv-gsidebar::-webkit-scrollbar { width:6px; }
.nv-gsidebar::-webkit-scrollbar-thumb { background:var(--c-surf2); border-radius:3px; }

.nv-tile { position:relative; background:var(--c-surf); border-radius:12px; overflow:hidden; aspect-ratio:16/9; border:1px solid var(--c-line); transition:border-color .2s; }
.nv-tile:hover { border-color:#5f6368; }
.nv-tile--me { border:2px solid rgba(52,168,83,.4); box-shadow:0 0 0 1px rgba(52,168,83,.2); }
.nv-tile--me:hover { border-color:var(--c-green); }
.nv-tile--screen { width:100%; height:100%; aspect-ratio:unset; border:2px solid var(--c-blue); box-shadow:0 0 0 1px rgba(26,115,232,.25); }
.nv-tile video { width:100%; height:100%; object-fit:cover; display:block; }
.nv-tile--screen video { object-fit:contain; background:#000; }
.nv-tilebar { position:absolute; bottom:0; left:0; right:0; padding:22px 10px 9px; background:linear-gradient(to top,rgba(0,0,0,.72) 0%,transparent 100%); display:flex; align-items:flex-end; justify-content:space-between; pointer-events:none; }
.nv-tilemeta { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.5); }
.nv-tilebadges { display:flex; gap:4px; }
.nv-you-dot { width:6px; height:6px; border-radius:50%; background:var(--c-green); flex-shrink:0; }
.nv-badge { width:22px; height:22px; border-radius:5px; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); }
.nv-badge--red  { background:rgba(234,67,53,.88); }
.nv-badge--blue { background:rgba(26,115,232,.88); }
.nv-nocam { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:var(--c-surf); }
.nv-avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#1a73e8,#0d47a1); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:600; color:#fff; box-shadow:0 4px 16px rgba(26,115,232,.35); }
.nv-avatar--sm { width:40px; height:40px; font-size:14px; }

/* ── CONTROLS ─────────────────────────────────────────── */
.nv-controls { height:80px; flex-shrink:0; background:var(--c-bg); border-top:1px solid var(--c-line); display:flex; align-items:center; justify-content:center; }
.nv-ctrl-row { display:flex; align-items:center; gap:6px; }
.nv-cslot { display:flex; flex-direction:column; align-items:center; gap:5px; }
.nv-ctrl { width:48px; height:48px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s,transform .1s; color:var(--c-text); }
.nv-ctrl:hover:not(:disabled) { transform:scale(1.06); }
.nv-ctrl:disabled { opacity:.5; cursor:not-allowed; }
.nv-ctrl--on  { background:var(--c-surf2); border:1px solid var(--c-line); }
.nv-ctrl--on:hover { background:#4e5256; }
.nv-ctrl--off { background:var(--c-red-bg); color:#f28b82; border:1px solid rgba(234,67,53,.3); }
.nv-ctrl--off:hover { background:rgba(234,67,53,.25); }
.nv-ctrl--sharing { background:rgba(26,115,232,.2); color:#8ab4f8; border:1px solid rgba(26,115,232,.3); }
.nv-ctrl--leave { width:52px; height:52px; background:var(--c-red); color:#fff; box-shadow:0 2px 12px rgba(234,67,53,.4); }
.nv-ctrl--leave:hover { background:#d33828; }
.nv-ctrl--end { width:52px; height:52px; background:rgba(234,67,53,.18); color:#f28b82; border:2px solid rgba(234,67,53,.5); }
.nv-ctrl--end:hover:not(:disabled) { background:var(--c-red); color:#fff; border-color:var(--c-red); }
.nv-ctrl--restart { background:rgba(250,123,23,.15); color:#fba45c; border:1.5px solid rgba(250,123,23,.4); }
.nv-ctrl--restart:hover:not(:disabled) { background:rgba(250,123,23,.3); }
.nv-clabel { font-size:10px; color:var(--c-text2); white-space:nowrap; font-weight:500; }
.nv-clabel--red    { color:#f28b82; }
.nv-clabel--orange { color:#fba45c; }
.nv-cdivider { width:1px; height:32px; background:var(--c-line); margin:0 8px; }

/* ── CHAT ─────────────────────────────────────────────── */
.nv-chat { position:fixed; top:0; right:-380px; height:100%; width:360px; background:var(--c-surf); border-left:1px solid var(--c-line); display:flex; flex-direction:column; z-index:10000; transition:right .25s cubic-bezier(.4,0,.2,1); }
.nv-chat--open { right:0; }
.nv-chdr { height:56px; flex-shrink:0; border-bottom:1px solid var(--c-line); display:flex; align-items:center; justify-content:space-between; padding:0 18px; }
.nv-chdr-title { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; }
.nv-chdr-close { width:32px; height:32px; border:none; background:transparent; border-radius:50%; color:var(--c-text2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.nv-chdr-close:hover { background:var(--c-surf2); color:var(--c-text); }
.nv-cmsgs { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; scrollbar-width:thin; }
.nv-cempty { display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--c-text2); font-size:13px; padding-top:40px; }
.nv-cmsg { padding:10px 13px; background:var(--c-surf2); border-radius:10px; }
.nv-cmsg--self { background:rgba(26,115,232,.18); border:1px solid rgba(26,115,232,.25); }
.nv-cmsg-who  { font-size:11px; font-weight:600; color:#8ab4f8; margin-bottom:4px; }
.nv-cmsg-body { font-size:14px; line-height:1.5; word-break:break-word; }
.nv-cfoot { padding:12px 14px; border-top:1px solid var(--c-line); display:flex; gap:8px; flex-shrink:0; }
.nv-cinput { flex:1; padding:10px 14px; background:var(--c-surf2); border:1px solid var(--c-line); border-radius:24px; color:var(--c-text); font-family:inherit; font-size:14px; transition:border-color .15s; }
.nv-cinput::placeholder { color:var(--c-text2); }
.nv-cinput:focus { outline:none; border-color:var(--c-blue); }
.nv-csend { width:38px; height:38px; border:none; border-radius:50%; background:var(--c-blue); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; flex-shrink:0; }
.nv-csend:disabled { opacity:.4; cursor:default; }
.nv-csend:not(:disabled):hover { background:var(--c-blue2); }

/* ── MODALS ───────────────────────────────────────────── */
.nv-modal-overlay { position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,.65); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:nv-fade-in .18s ease; }
@keyframes nv-fade-in { from{opacity:0} to{opacity:1} }
.nv-modal { background:var(--c-surf); border:1px solid var(--c-line); border-radius:20px; padding:36px 32px 28px; width:100%; max-width:420px; text-align:center; box-shadow:0 24px 80px rgba(0,0,0,.6); animation:nv-slide-up .2s cubic-bezier(.34,1.56,.64,1); }
@keyframes nv-slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.nv-modal-icon { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
.nv-modal-icon--red  { background:rgba(234,67,53,.15); color:#f28b82; border:1.5px solid rgba(234,67,53,.4); }
.nv-modal-icon--blue { background:rgba(26,115,232,.15); color:#8ab4f8; border:1.5px solid rgba(26,115,232,.4); }
.nv-modal-title { font-size:20px; font-weight:600; color:var(--c-text); margin-bottom:12px; }
.nv-modal-body  { font-size:14px; color:var(--c-text2); line-height:1.6; margin-bottom:28px; }
.nv-modal-actions { display:flex; gap:10px; justify-content:center; }
.nv-modal-btn { flex:1; padding:12px 20px; border-radius:var(--c-r); font-family:inherit; font-size:14px; font-weight:600; cursor:pointer; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:7px; max-width:180px; }
.nv-modal-btn--ghost   { background:transparent; border:1px solid var(--c-line); color:var(--c-text2); }
.nv-modal-btn--ghost:hover { border-color:var(--c-text2); color:var(--c-text); }
.nv-modal-btn--danger  { background:var(--c-red); border:none; color:#fff; }
.nv-modal-btn--danger:hover:not(:disabled) { background:#d33828; }
.nv-modal-btn--danger:disabled { opacity:.55; cursor:not-allowed; }
.nv-modal-btn--primary { background:var(--c-blue); border:none; color:#fff; }
.nv-modal-btn--primary:hover:not(:disabled) { background:var(--c-blue2); }
.nv-modal-btn--primary:disabled { opacity:.55; cursor:not-allowed; }

/* ── TOAST ────────────────────────────────────────────── */
.nv-toast { position:fixed; bottom:96px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:8px; padding:10px 20px; border-radius:24px; background:var(--c-surf2); border:1px solid var(--c-line); font-size:13px; font-weight:500; color:#81c995; box-shadow:0 4px 24px rgba(0,0,0,.4); z-index:10001; pointer-events:none; white-space:nowrap; }
.nv-toast--error { color:#f28b82; border-color:rgba(234,67,53,.35); }
.nv-toast-fx-enter-active,.nv-toast-fx-leave-active { transition:opacity .2s,transform .2s; }
.nv-toast-fx-enter-from { opacity:0; transform:translateX(-50%) translateY(10px); }
.nv-toast-fx-leave-to   { opacity:0; transform:translateX(-50%) translateY(10px); }

@media (max-width:960px) {
  .nv-grid--presenting { grid-template-columns:1fr; grid-template-rows:1fr auto; }
  .nv-gmain   { grid-column:1; grid-row:1; }
  .nv-gsidebar { grid-column:1; grid-row:2; flex-direction:row; max-height:140px; overflow-x:auto; overflow-y:hidden; }
  .nv-gsidebar .nv-tile { min-width:180px; }
  .nv-chat { width:100vw; right:-100vw; }
  .nv-modal { margin:0 16px; }
}
</style>