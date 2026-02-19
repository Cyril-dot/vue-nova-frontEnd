<!-- Meeting.vue — Powered by Daily.co SDK (Backend Token Edition) -->
<!-- Daily.co API key is now server-side only. Frontend calls /api/meetings/daily-token -->
<template>
  <div class="nv-root">

    <!-- ════════════════════ CREATE ════════════════════ -->
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

          <!-- Success banner -->
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

          <!-- Form -->
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

          <!-- Post-create actions -->
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

    <!-- ════════════════════ MEETING ════════════════════ -->
    <div v-if="view === 'meeting'" class="nv-meet">

      <!-- Header -->
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

      <!-- Daily.co embedded iframe -->
      <div class="nv-daily-wrap" :class="{ 'nv-daily--chat-open': chatOpen }">
        <div v-if="dailyLoading" class="nv-daily-loading">
          <div class="nv-loading-inner">
            <span class="nv-spinner nv-spinner--lg"></span>
            <p>Connecting to meeting…</p>
          </div>
        </div>
        <div ref="dailyContainer" class="nv-daily-frame"></div>
      </div>

      <!-- Controls bar -->
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
            <button class="nv-ctrl" :class="screenSharing ? 'nv-ctrl--sharing' : 'nv-ctrl--on'" @click="toggleScreen">
              <svg v-if="!screenSharing" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="8 10 12 6 16 10"/><line x1="12" y1="6" x2="12" y2="14"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            </button>
            <span class="nv-clabel">{{ screenSharing ? 'Stop sharing' : 'Present' }}</span>
          </div>

          <div class="nv-cdivider"></div>

          <!-- Host-only controls -->
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

      <!-- Chat panel -->
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

      <!-- End Meeting Modal -->
      <div v-if="showEndModal" class="nv-modal-overlay" @click.self="showEndModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--red">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h2 class="nv-modal-title">End meeting for everyone?</h2>
          <p class="nv-modal-body">This will disconnect all participants and mark the meeting as completed.</p>
          <div class="nv-modal-actions">
            <button class="nv-modal-btn nv-modal-btn--ghost" @click="showEndModal = false">Cancel</button>
            <button class="nv-modal-btn nv-modal-btn--danger" @click="confirmEndMeeting" :disabled="ending">
              <span v-if="ending" class="nv-spinner nv-spinner--sm"></span>
              End for everyone
            </button>
          </div>
        </div>
      </div>

      <!-- Restart Meeting Modal -->
      <div v-if="showRestartModal" class="nv-modal-overlay" @click.self="showRestartModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--blue">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          </div>
          <h2 class="nv-modal-title">Restart this meeting?</h2>
          <p class="nv-modal-body">All participants will be disconnected. They can rejoin with the same code.</p>
          <div class="nv-modal-actions">
            <button class="nv-modal-btn nv-modal-btn--ghost" @click="showRestartModal = false">Cancel</button>
            <button class="nv-modal-btn nv-modal-btn--primary" @click="confirmRestartMeeting" :disabled="restarting">
              <span v-if="restarting" class="nv-spinner nv-spinner--sm"></span>
              Restart meeting
            </button>
          </div>
        </div>
      </div>

      <!-- Toast -->
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
import { TokenService, apiRequest } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

// ─── Config ──────────────────────────────────────────────────────────────────
// NOTE: No Daily API key here — all Daily API calls go through the backend.
// The backend endpoints /api/meetings/daily-token and /api/meetings/daily-token/guest
// handle room creation and token generation server-side so the key is never exposed.
const BACKEND_API = 'https://nova-test-ctne.onrender.com/api';

export default {
  name: 'Meeting',

  props: {
    code: { type: String, default: null },
  },

  data() {
    return {
      view: 'create',

      // ── Create form ──────────────────────────────────────────
      form: {
        title: '', description: '', maxParticipants: 50, password: '',
        allowGuests: true, videoEnabled: true, audioEnabled: true,
        chatEnabled: true, screenShareEnabled: true,
      },
      toggleOpts: [
        { key: 'allowGuests',        label: 'Allow guests',       sub: 'Anyone with the code can join' },
        { key: 'videoEnabled',       label: 'Video on by default' },
        { key: 'audioEnabled',       label: 'Audio on by default' },
        { key: 'chatEnabled',        label: 'Enable chat' },
        { key: 'screenShareEnabled', label: 'Screen sharing' },
      ],
      creating: false,
      createError: '',
      created: { code: null, title: null },

      // ── Meeting / Daily state ────────────────────────────────
      meetingCode:   '',
      dailyRoomUrl:  '',
      dailyRoomName: '',
      callFrame:     null,
      dailyLoading:  true,

      audioOn:       true,
      videoOn:       true,
      screenSharing: false,
      participantCount: 1,
      isHost:        false,

      userName:     'Guest',
      userInitials: 'G',

      // Guest info (stored for token requests)
      guestName:  null,
      guestEmail: null,

      showEndModal:     false,
      showRestartModal: false,
      ending:           false,
      restarting:       false,

      chatOpen:    false,
      chatMessage: '',
      messages:    [],
      unreadCount: 0,

      toastVisible: false,
      toastMessage: '',
      toastType:    'success',

      currentTime:   '',
      clockInterval: null,
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
    token()           { return TokenService.getAccessToken(); },
  },

  methods: {

    // ═══════════════════════════════════════════════════════════
    //  BACKEND TOKEN HELPERS
    //  All Daily.co API calls now go through YOUR backend.
    //  The frontend never touches api.daily.co directly.
    // ═══════════════════════════════════════════════════════════

    /**
     * Fetch a Daily meeting token + room URL from the backend.
     * Calls POST /api/meetings/daily-token (authenticated users)
     * or   POST /api/meetings/daily-token/guest (guests)
     *
     * Returns: { token, roomUrl, roomName, meetingCode, isOwner }
     */
    async fetchDailyToken(meetingCode) {
      try {
        if (this.isAuthenticated) {
          // ── Authenticated user ──────────────────────────────
          const res  = await apiRequest('/meetings/daily-token', {
            method: 'POST',
            body:   JSON.stringify({ meetingCode }),
          });
          const body = await res.json();

          if (!res.ok || body.success === false) {
            console.warn('Daily token fetch failed:', body.message);
            return null;
          }
          console.log('✅ Daily token received from backend (authenticated)');
          return body.data; // { token, roomUrl, roomName, meetingCode, isOwner }

        } else {
          // ── Guest ───────────────────────────────────────────
          const guestName = this.guestName || MeetingSession.getUserDisplayName();
          const res = await fetch(`${BACKEND_API}/meetings/daily-token/guest`, {
            method:  'POST',
            headers: {
              'Content-Type':             'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({
              meetingCode,
              guestName,
              guestEmail: this.guestEmail || null,
            }),
          });
          const body = await res.json();

          if (!res.ok || body.success === false) {
            console.warn('Daily guest token fetch failed:', body.message);
            return null;
          }
          console.log('✅ Daily token received from backend (guest)');
          return body.data;
        }
      } catch (err) {
        console.warn('Could not fetch Daily token from backend:', err.message);
        return null;
      }
    },

    // ═══════════════════════════════════════════════════════════
    //  CREATE MEETING
    //  Backend creates the meeting record AND the Daily room.
    //  We then fetch the Daily token to join.
    // ═══════════════════════════════════════════════════════════

    async createMeeting() {
      if (!this.form.title.trim()) { this.createError = 'Please enter a meeting title.'; return; }
      this.creating = true; this.createError = '';

      try {
        if (!this.token) throw new Error('You must be logged in to create a meeting.');

        const pw  = this.form.password.trim();
        const res = await apiRequest('/meetings/create', {
          method: 'POST',
          body: JSON.stringify({
            title:              this.form.title.trim(),
            description:        this.form.description.trim() || null,
            maxParticipants:    this.form.maxParticipants || 50,
            allowGuests:        this.form.allowGuests,
            requiresPassword:   pw.length > 0,
            password:           pw || null,
            videoEnabled:       this.form.videoEnabled,
            audioEnabled:       this.form.audioEnabled,
            chatEnabled:        this.form.chatEnabled,
            screenShareEnabled: this.form.screenShareEnabled,
            isPublic:           false,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || `Server error ${res.status}`);
        }

        const meetingData = data.data;
        const meetingCode = meetingData?.meetingCode || meetingData?.meeting_code;
        if (!meetingCode) throw new Error('Backend did not return a meeting code.');

        // Store the Daily room info the backend already created
        const roomUrl  = meetingData?.dailyRoomUrl  || null;
        const roomName = meetingData?.dailyRoomName || null;

        MeetingSession.setMeetingCode(meetingCode);
        if (roomUrl)  sessionStorage.setItem('nova_daily_room', roomUrl);
        if (roomName) sessionStorage.setItem('nova_daily_name', roomName);
        sessionStorage.setItem('nova_meeting_title', this.form.title.trim());

        this.created = { code: meetingCode, title: this.form.title.trim() };
        MeetingSession.saveRecentMeeting(meetingCode, this.form.title.trim());

        // Also kick off /start so the meeting is ACTIVE
        apiRequest(`/meetings/start/${meetingCode}`, { method: 'POST' }).catch(() => {});

        console.log('✅ Meeting created:', meetingCode, '→ Daily room:', roomUrl);

      } catch (err) {
        this.createError = err.message || 'Failed to create meeting.';
        console.error('Create meeting error:', err);
      } finally {
        this.creating = false;
      }
    },

    copyCreatedCode() {
      if (!this.created.code) return;
      navigator.clipboard.writeText(this.created.code).then(() => this.showToast('Code copied!'));
    },

    enterMeeting() {
      if (!this.created.code) return;
      this.meetingCode = this.created.code;
      this.isHost      = true;
      sessionStorage.setItem('nova_is_host', 'true');
      this.view = 'meeting';
      this.$nextTick(() => this.initMeeting());
    },

    // ═══════════════════════════════════════════════════════════
    //  JOIN / INIT MEETING
    // ═══════════════════════════════════════════════════════════

    async initMeeting() {
      if (!this.meetingCode) {
        this.meetingCode = this.code
          || this.$route?.params?.code
          || MeetingSession.getMeetingCode();
      }
      if (!this.meetingCode) { this.$router.push('/meetings/join'); return; }

      // Resolve display name
      this.userName    = MeetingSession.getUserDisplayName();
      this.userInitials = this.userName.charAt(0).toUpperCase();
      this.isHost      = this.isHost || sessionStorage.getItem('nova_is_host') === 'true';

      // Restore guest info if present
      const guestUser = MeetingSession.getUser();
      if (guestUser?.isGuest) {
        this.guestName  = guestUser.name;
        this.guestEmail = guestUser.email;
      }

      // Fetch Daily token + room URL from backend
      const tokenData = await this.fetchDailyToken(this.meetingCode);

      if (tokenData) {
        // Backend returned everything we need
        this.dailyRoomUrl  = tokenData.roomUrl;
        this.dailyRoomName = tokenData.roomName;
        this.isHost        = this.isHost || tokenData.isOwner;

        // Cache for reconnect
        sessionStorage.setItem('nova_daily_room', tokenData.roomUrl);
        sessionStorage.setItem('nova_daily_name', tokenData.roomName);
        sessionStorage.setItem('nova_daily_token', tokenData.token || '');
      } else {
        // Fallback: try cached room URL from sessionStorage
        const cachedUrl  = sessionStorage.getItem('nova_daily_room');
        const cachedName = sessionStorage.getItem('nova_daily_name');

        if (cachedUrl && cachedName) {
          console.warn('Using cached Daily room URL (no fresh token available)');
          this.dailyRoomUrl  = cachedUrl;
          this.dailyRoomName = cachedName;
        } else {
          this.showToast('Could not connect to meeting room — no room data available.', 'error');
          this.dailyLoading = false;
          return;
        }
      }

      this.updateClock();
      this.clockInterval = setInterval(this.updateClock, 10_000);

      await this.loadDailySDK();
      await this.joinDailyRoom(tokenData?.token || null);
    },

    loadDailySDK() {
      return new Promise((resolve, reject) => {
        if (window.DailyIframe) { resolve(); return; }
        const s  = document.createElement('script');
        s.src    = 'https://unpkg.com/@daily-co/daily-js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load Daily.co SDK'));
        document.head.appendChild(s);
      });
    },

    async joinDailyRoom(token = null) {
      try {
        this.dailyLoading = true;
        console.log('🎥 Joining Daily room:', this.dailyRoomUrl);

        // If we don't have a token yet (e.g. reconnect), try fetching one
        if (!token) {
          const freshData = await this.fetchDailyToken(this.meetingCode);
          token = freshData?.token || null;
        }

        this.callFrame = window.DailyIframe.createFrame(this.$refs.dailyContainer, {
          iframeStyle: {
            width: '100%', height: '100%', border: 'none', background: '#202124',
          },
          showLeaveButton:      false,
          showFullscreenButton: true,
          showParticipantsBar:  true,
          showLocalVideo:       true,
          theme: {
            colors: {
              accent:           '#1a73e8',
              accentText:       '#ffffff',
              background:       '#202124',
              backgroundAccent: '#292b2f',
              baseText:         '#e8eaed',
              border:           '#3c4043',
              mainAreaBg:       '#202124',
              mainAreaBgAccent: '#292b2f',
              supportiveText:   '#9aa0a6',
            },
          },
        });

        this.callFrame
          .on('joined-meeting',      this.onJoinedMeeting)
          .on('left-meeting',        this.onLeftMeeting)
          .on('participant-joined',  this.onParticipantJoined)
          .on('participant-updated', this.onParticipantUpdated)
          .on('participant-left',    this.onParticipantLeft)
          .on('app-message',         this.onAppMessage)
          .on('error',               this.onDailyError)
          .on('camera-error',        this.onCameraError);

        const joinOpts = {
          url:           this.dailyRoomUrl,
          userName:      this.userName,
          startVideoOff: false,
          startAudioOff: false,
        };
        if (token) joinOpts.token = token;

        await this.callFrame.join(joinOpts);

      } catch (err) {
        console.error('Daily join error:', err);
        this.dailyLoading = false;
        this.showToast('Failed to join: ' + err.message, 'error');
      }
    },

    // ═══════════════════════════════════════════════════════════
    //  DAILY EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════

    onJoinedMeeting(event) {
      console.log('✅ Joined Daily meeting');
      this.dailyLoading = false;
      const local = event?.participants?.local;
      if (local) {
        this.audioOn = !local.audio_disabled;
        this.videoOn = !local.video_disabled;
      }
      this.syncParticipantCount();
    },

    onLeftMeeting()  { console.log('👋 Left Daily meeting'); },

    onParticipantJoined(event) {
      const name = event?.participant?.user_name;
      console.log('👥 Participant joined:', name);
      this.syncParticipantCount();
      if (name && name !== this.userName) this.showToast(`${name} joined`);
    },

    onParticipantUpdated(event) {
      const p = event?.participant;
      if (!p) return;
      if (p.local) {
        this.audioOn       = !p.audio_disabled;
        this.videoOn       = !p.video_disabled;
        this.screenSharing = !!p.screen;
      }
      this.syncParticipantCount();
    },

    onParticipantLeft(event) {
      console.log('👋 Participant left:', event?.participant?.user_name);
      this.syncParticipantCount();
    },

    syncParticipantCount() {
      if (!this.callFrame) return;
      try { this.participantCount = Object.keys(this.callFrame.participants()).length; } catch (_) {}
    },

    onAppMessage(event) {
      const data = event?.data;
      if (!data) return;

      if (data.type === 'chat') {
        this.addMsg(data.sender || 'Participant', data.text, false);
        if (!this.chatOpen) this.unreadCount++;
      }

      if (data.type === 'meeting-ended') {
        this.showToast('Meeting ended by host.', 'error');
        setTimeout(() => this.cleanupAndNavigate(), 1800);
      }

      if (data.type === 'meeting-restarted') {
        this.showToast('Meeting restarted — reconnecting…');
        setTimeout(async () => {
          if (this.callFrame) {
            try { this.callFrame.destroy(); } catch (_) {}
            this.callFrame = null;
          }
          this.dailyLoading = true;
          await this.joinDailyRoom();
        }, 1000);
      }
    },

    onDailyError(event) {
      console.error('Daily error:', event);
      this.showToast('Connection error: ' + (event?.errorMsg || 'Unknown error'), 'error');
    },

    onCameraError(event) {
      console.warn('Camera error:', event);
      this.showToast('Camera/mic error — please check permissions.', 'error');
    },

    // ═══════════════════════════════════════════════════════════
    //  MEDIA CONTROLS
    // ═══════════════════════════════════════════════════════════

    toggleAudio() { if (this.callFrame) this.callFrame.setLocalAudio(!this.audioOn); },
    toggleVideo() { if (this.callFrame) this.callFrame.setLocalVideo(!this.videoOn); },

    async toggleScreen() {
      if (!this.callFrame) return;
      try {
        if (this.screenSharing) await this.callFrame.stopScreenShare();
        else                     await this.callFrame.startScreenShare();
      } catch (err) {
        if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
          this.showToast('Screen share error: ' + err.message, 'error');
        }
      }
    },

    // ═══════════════════════════════════════════════════════════
    //  MEETING LIFECYCLE
    // ═══════════════════════════════════════════════════════════

    endMeeting()     { this.showEndModal     = true; },
    restartMeeting() { this.showRestartModal = true; },

    async confirmEndMeeting() {
      this.ending = true;
      try {
        // 1. Tell backend to end the meeting + delete Daily room
        if (this.token && this.meetingCode) {
          apiRequest(`/meetings/end/${this.meetingCode}`, {
            method: 'POST',
          }).catch(e => console.warn('Backend end failed:', e));
        }

        // 2. Broadcast to all Daily participants via app-message
        if (this.callFrame) {
          try { this.callFrame.sendAppMessage({ type: 'meeting-ended', endedBy: this.userName }, '*'); } catch (_) {}
        }

        this.showEndModal = false;
        this.cleanupAndNavigate();
      } catch (err) {
        console.error('End meeting error:', err);
        this.showToast('Failed to end meeting.', 'error');
      } finally {
        this.ending = false;
      }
    },

    async confirmRestartMeeting() {
      this.restarting = true;
      try {
        if (this.token && this.meetingCode) {
          await apiRequest(`/meetings/end/${this.meetingCode}`,   { method: 'POST' }).catch(() => {});
          await apiRequest(`/meetings/start/${this.meetingCode}`, { method: 'POST' }).catch(() => {});
        }

        if (this.callFrame) {
          try { this.callFrame.sendAppMessage({ type: 'meeting-restarted', restartedBy: this.userName }, '*'); } catch (_) {}
        }

        this.showRestartModal = false;
        this.showToast('Meeting restarted!');
        this.messages    = [];
        this.unreadCount = 0;

        setTimeout(async () => {
          if (this.callFrame) {
            try { this.callFrame.destroy(); } catch (_) {}
            this.callFrame = null;
          }
          this.dailyLoading = true;
          // Fetch fresh token for rejoined room
          await this.joinDailyRoom();
        }, 1200);
      } catch (err) {
        console.error('Restart error:', err);
        this.showToast('Failed to restart meeting.', 'error');
      } finally {
        this.restarting = false;
      }
    },

    leave() {
      const msg = this.isHost
        ? 'Leave this meeting? Use "End" to close it for everyone.'
        : 'Leave this meeting?';
      if (!confirm(msg)) return;
      this.cleanupAndNavigate();
    },

    cleanupAndNavigate() {
      clearInterval(this.clockInterval);
      if (this.callFrame) {
        try { this.callFrame.destroy(); } catch (_) {}
        this.callFrame = null;
      }
      MeetingSession.clearMeetingCode();
      sessionStorage.removeItem('nova_daily_room');
      sessionStorage.removeItem('nova_daily_name');
      sessionStorage.removeItem('nova_daily_token');
      sessionStorage.removeItem('nova_is_host');

      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/meetings/join');
    },

    // ═══════════════════════════════════════════════════════════
    //  CHAT
    // ═══════════════════════════════════════════════════════════

    toggleChat() {
      this.chatOpen = !this.chatOpen;
      if (this.chatOpen) this.unreadCount = 0;
    },

    sendMessage() {
      const text = this.chatMessage.trim();
      if (!text) return;
      this.addMsg(this.userName, text, true);
      if (this.callFrame) {
        try { this.callFrame.sendAppMessage({ type: 'chat', sender: this.userName, text }, '*'); } catch (e) {
          console.warn('sendAppMessage failed:', e);
        }
      }
      this.chatMessage = '';
    },

    addMsg(sender, text, isSelf) {
      this.messages.push({ id: Date.now() + Math.random(), sender, text, isSelf });
      this.$nextTick(() => {
        const c = this.$refs.messagesContainer;
        if (c) c.scrollTop = c.scrollHeight;
      });
    },

    // ═══════════════════════════════════════════════════════════
    //  UTILITIES
    // ═══════════════════════════════════════════════════════════

    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode)
        .then(() => this.showToast('Code copied!'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg; this.toastType = type; this.toastVisible = true;
      setTimeout(() => { this.toastVisible = false; }, 2800);
    },

    updateClock() {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    goToDashboard() {
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/meetings/join');
    },

    goBack() { this.goToDashboard(); },
  },

  mounted() {
    const forceCreate = this.$route?.query?.create === 'true';

    if (forceCreate) {
      MeetingSession.clearMeetingCode();
      sessionStorage.removeItem('nova_is_host');
      sessionStorage.removeItem('nova_daily_room');
      sessionStorage.removeItem('nova_daily_name');
      sessionStorage.removeItem('nova_daily_token');
      this.view = 'create';
    } else {
      const resolvedCode = this.code
        || this.$route?.params?.code
        || MeetingSession.getMeetingCode();

      if (resolvedCode) {
        this.meetingCode = resolvedCode;
        this.isHost      = sessionStorage.getItem('nova_is_host') === 'true';

        // Restore guest info for token request
        const guestUser = MeetingSession.getUser();
        if (guestUser?.isGuest) {
          this.guestName  = guestUser.name;
          this.guestEmail = guestUser.email;
        }

        this.view = 'meeting';
        this.$nextTick(() => this.initMeeting());
      }
    }

    this._keyHandler = (e) => {
      if (this.view !== 'meeting') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'a') this.toggleAudio();
      if (e.key === 'd') this.toggleVideo();
    };
    window.addEventListener('keydown', this._keyHandler);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this._keyHandler);
    clearInterval(this.clockInterval);
    if (this.callFrame) {
      try { this.callFrame.destroy(); } catch (_) {}
      this.callFrame = null;
    }
  },
};
</script>

<!-- Styles are identical to the original — no visual changes needed -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

.nv-root {
  --c-bg:    #202124; --c-surf:  #292b2f; --c-surf2: #3c4043;
  --c-line:  #3c4043; --c-blue:  #1a73e8; --c-blue2: #174ea6;
  --c-green: #34a853; --c-red:   #ea4335; --c-red-bg:rgba(234,67,53,.15);
  --c-orange:#fa7b17; --c-text:  #e8eaed; --c-text2: #9aa0a6; --c-r:8px;
  font-family:'Google Sans',system-ui,sans-serif;
}
.nv-create-wrap{min-height:100vh;background:var(--c-bg);color:var(--c-text);display:flex;flex-direction:column}
.nv-cnav{display:flex;align-items:center;justify-content:space-between;padding:14px 32px;background:var(--c-surf);border-bottom:1px solid var(--c-line)}
.nv-cbrand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600;color:var(--c-text);cursor:pointer}
.nv-cnav-back{display:flex;align-items:center;gap:7px;padding:7px 16px;border:1px solid var(--c-line);border-radius:var(--c-r);background:transparent;color:var(--c-text2);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}
.nv-cnav-back:hover{border-color:var(--c-blue);color:var(--c-text);background:rgba(26,115,232,.08)}
.nv-cmain{max-width:560px;margin:0 auto;padding:44px 24px 60px;width:100%}
.nv-chead{margin-bottom:28px}
.nv-ctitle{font-size:26px;font-weight:600;color:var(--c-text);letter-spacing:-.3px;margin-bottom:6px}
.nv-csub{font-size:14px;color:var(--c-text2)}
.nv-card{background:var(--c-surf);border:1px solid var(--c-line);border-radius:16px;padding:32px;box-shadow:0 8px 40px rgba(0,0,0,.4)}
.nv-success-banner{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:12px;background:rgba(52,168,83,.1);border:1px solid rgba(52,168,83,.3);margin-bottom:24px;flex-wrap:wrap}
.nv-success-check{width:36px;height:36px;border-radius:50%;background:rgba(52,168,83,.2);border:1px solid rgba(52,168,83,.4);display:flex;align-items:center;justify-content:center;color:#81c995;flex-shrink:0}
.nv-success-title{font-size:14px;font-weight:600;color:var(--c-text)}
.nv-success-sub{font-size:12px;color:var(--c-text2);margin-top:2px}
.nv-code-pill{display:flex;align-items:center;gap:7px;margin-left:auto;padding:8px 16px;border-radius:24px;background:rgba(52,168,83,.12);border:1px solid rgba(52,168,83,.3);font-family:'Google Sans Mono',monospace;font-size:15px;font-weight:600;color:#81c995;cursor:pointer;letter-spacing:1px;transition:background .15s}
.nv-code-pill:hover{background:rgba(52,168,83,.22)}
.nv-section-label{font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--c-text2);margin-bottom:14px}
.nv-field{margin-bottom:16px}
.nv-flabel{display:block;font-size:13px;font-weight:500;color:var(--c-text2);margin-bottom:7px}
.nv-req{color:var(--c-red)}.nv-opt{color:#5f6368;font-weight:400}
.nv-finput{width:100%;padding:11px 14px;background:var(--c-surf2);border:1px solid var(--c-line);border-radius:var(--c-r);color:var(--c-text);font-family:inherit;font-size:14px;transition:border-color .15s,box-shadow .15s;box-sizing:border-box}
.nv-finput::placeholder{color:#5f6368}
.nv-finput:focus{outline:none;border-color:var(--c-blue);box-shadow:0 0 0 3px rgba(26,115,232,.18)}
.nv-ftextarea{resize:vertical;min-height:70px;line-height:1.5}
.nv-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.nv-toggle-list{border:1px solid var(--c-line);border-radius:var(--c-r);overflow:hidden}
.nv-trow{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer;border-bottom:1px solid var(--c-line);transition:background .12s}
.nv-trow:last-child{border-bottom:none}
.nv-trow:hover{background:rgba(255,255,255,.03)}
.nv-trow-label{font-size:14px;color:var(--c-text)}.nv-trow-sub{font-size:12px;color:var(--c-text2);margin-top:2px}
.nv-switch{width:40px;height:22px;border-radius:22px;background:var(--c-surf2);border:1px solid var(--c-line);position:relative;flex-shrink:0;transition:background .2s,border-color .2s}
.nv-switch--on{background:var(--c-blue);border-color:var(--c-blue)}
.nv-switch-thumb{position:absolute;width:16px;height:16px;border-radius:50%;background:var(--c-text2);top:2px;left:2px;transition:transform .2s,background .2s}
.nv-switch--on .nv-switch-thumb{transform:translateX(18px);background:#fff}
.nv-btn-primary{width:100%;margin-top:24px;padding:13px 20px;background:var(--c-blue);border:none;border-radius:var(--c-r);color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s,transform .1s,box-shadow .15s;box-shadow:0 2px 12px rgba(26,115,232,.35)}
.nv-btn-primary:hover:not(:disabled){background:var(--c-blue2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,115,232,.45)}
.nv-btn-primary:disabled{opacity:.55;cursor:not-allowed}
.nv-btn-go{background:#34a853;box-shadow:0 2px 12px rgba(52,168,83,.35)}
.nv-btn-go:hover:not(:disabled){background:#2d9248}
.nv-btn-ghost{width:100%;margin-top:10px;padding:12px 20px;background:transparent;border:1px solid var(--c-line);border-radius:var(--c-r);color:var(--c-text2);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
.nv-btn-ghost:hover{border-color:var(--c-blue);color:var(--c-text);background:rgba(26,115,232,.06)}
.nv-postcreate{margin-top:8px}
.nv-alert-error{display:flex;align-items:center;gap:8px;margin-top:14px;padding:11px 14px;border-radius:var(--c-r);background:rgba(234,67,53,.1);border:1px solid rgba(234,67,53,.3);font-size:13px;color:#f28b82}
.nv-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:nv-spin .65s linear infinite}
.nv-spinner--sm{width:13px;height:13px;border:2px solid rgba(255,255,255,.25);border-top-color:currentColor}
.nv-spinner--lg{width:36px;height:36px;border-width:3px;border-color:rgba(255,255,255,.2);border-top-color:var(--c-blue)}
@keyframes nv-spin{to{transform:rotate(360deg)}}
.nv-meet{background:var(--c-bg);color:var(--c-text);display:flex;flex-direction:column;position:fixed;inset:0;z-index:9999;overflow:hidden}
.nv-header{height:60px;flex-shrink:0;background:var(--c-bg);border-bottom:1px solid var(--c-line);display:flex;align-items:center;justify-content:space-between;padding:0 20px;z-index:200}
.nv-hleft,.nv-hright{display:flex;align-items:center;gap:12px}
.nv-brand{display:flex;align-items:center;gap:8px}
.nv-brand-name{font-size:16px;font-weight:600;letter-spacing:-.2px}
.nv-live-pill{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:600;letter-spacing:.5px;padding:3px 8px;border-radius:20px;background:rgba(234,67,53,.14);border:1px solid rgba(234,67,53,.3);color:#f28b82}
.nv-live-dot{width:6px;height:6px;border-radius:50%;background:var(--c-red);animation:nv-pulse 2s ease-in-out infinite}
@keyframes nv-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
.nv-host-badge{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;background:rgba(250,123,23,.14);border:1px solid rgba(250,123,23,.35);color:#fba45c}
.nv-code-chip{display:flex;align-items:center;gap:6px;padding:5px 12px;background:var(--c-surf);border:1px solid var(--c-line);border-radius:var(--c-r);color:#8ab4f8;font-family:'Google Sans Mono',monospace;font-size:12px;cursor:pointer;transition:background .15s}
.nv-code-chip:hover{background:var(--c-surf2);border-color:#8ab4f8}
.nv-pcount{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--c-text2)}
.nv-clock{font-size:13px;color:var(--c-text2);min-width:42px;text-align:right}
.nv-hbtn{display:flex;align-items:center;gap:6px;padding:7px 14px;border:1px solid var(--c-line);border-radius:var(--c-r);background:transparent;color:var(--c-text2);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;position:relative}
.nv-hbtn:hover,.nv-hbtn--on{background:var(--c-surf2);color:var(--c-text);border-color:var(--c-surf2)}
.nv-hbtn--danger{border-color:rgba(234,67,53,.35);color:#f28b82}
.nv-hbtn--danger:hover{background:rgba(234,67,53,.14);border-color:var(--c-red)}
.nv-unread{min-width:17px;height:17px;border-radius:9px;background:var(--c-blue);color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;padding:0 4px}
.nv-daily-wrap{position:absolute;top:60px;bottom:80px;left:0;right:0;transition:right .25s cubic-bezier(.4,0,.2,1);background:#000}
.nv-daily-wrap.nv-daily--chat-open{right:360px}
.nv-daily-frame{width:100%;height:100%}
.nv-daily-loading{position:absolute;inset:0;z-index:5;background:var(--c-bg);display:flex;align-items:center;justify-content:center}
.nv-loading-inner{display:flex;flex-direction:column;align-items:center;gap:16px;color:var(--c-text2);font-size:15px}
.nv-controls{position:fixed;bottom:0;left:0;right:0;height:80px;background:var(--c-bg);border-top:1px solid var(--c-line);display:flex;align-items:center;justify-content:center;z-index:201}
.nv-ctrl-row{display:flex;align-items:center;gap:6px}
.nv-cslot{display:flex;flex-direction:column;align-items:center;gap:5px}
.nv-ctrl{width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .1s;color:var(--c-text)}
.nv-ctrl:hover:not(:disabled){transform:scale(1.06)}
.nv-ctrl:disabled{opacity:.5;cursor:not-allowed}
.nv-ctrl--on{background:var(--c-surf2);border:1px solid var(--c-line)}
.nv-ctrl--on:hover{background:#4e5256}
.nv-ctrl--off{background:var(--c-red-bg);color:#f28b82;border:1px solid rgba(234,67,53,.3)}
.nv-ctrl--off:hover{background:rgba(234,67,53,.25)}
.nv-ctrl--sharing{background:rgba(26,115,232,.2);color:#8ab4f8;border:1px solid rgba(26,115,232,.3)}
.nv-ctrl--leave{width:52px;height:52px;background:var(--c-red);color:#fff;box-shadow:0 2px 12px rgba(234,67,53,.4)}
.nv-ctrl--leave:hover{background:#d33828}
.nv-ctrl--end{width:52px;height:52px;background:rgba(234,67,53,.18);color:#f28b82;border:2px solid rgba(234,67,53,.5)}
.nv-ctrl--end:hover:not(:disabled){background:var(--c-red);color:#fff;border-color:var(--c-red)}
.nv-ctrl--restart{background:rgba(250,123,23,.15);color:#fba45c;border:1.5px solid rgba(250,123,23,.4)}
.nv-ctrl--restart:hover:not(:disabled){background:rgba(250,123,23,.3)}
.nv-clabel{font-size:10px;color:var(--c-text2);white-space:nowrap;font-weight:500}
.nv-clabel--red{color:#f28b82}.nv-clabel--orange{color:#fba45c}
.nv-cdivider{width:1px;height:32px;background:var(--c-line);margin:0 8px}
.nv-chat{position:fixed;top:0;right:-380px;height:100%;width:360px;background:var(--c-surf);border-left:1px solid var(--c-line);display:flex;flex-direction:column;z-index:210;transition:right .25s cubic-bezier(.4,0,.2,1)}
.nv-chat--open{right:0}
.nv-chdr{height:56px;flex-shrink:0;border-bottom:1px solid var(--c-line);display:flex;align-items:center;justify-content:space-between;padding:0 18px}
.nv-chdr-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600}
.nv-chdr-close{width:32px;height:32px;border:none;background:transparent;border-radius:50%;color:var(--c-text2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.nv-chdr-close:hover{background:var(--c-surf2);color:var(--c-text)}
.nv-cmsgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin}
.nv-cempty{display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--c-text2);font-size:13px;padding-top:40px}
.nv-cmsg{padding:10px 13px;background:var(--c-surf2);border-radius:10px}
.nv-cmsg--self{background:rgba(26,115,232,.18);border:1px solid rgba(26,115,232,.25)}
.nv-cmsg-who{font-size:11px;font-weight:600;color:#8ab4f8;margin-bottom:4px}
.nv-cmsg-body{font-size:14px;line-height:1.5;word-break:break-word}
.nv-cfoot{padding:12px 14px;border-top:1px solid var(--c-line);display:flex;gap:8px;flex-shrink:0}
.nv-cinput{flex:1;padding:10px 14px;background:var(--c-surf2);border:1px solid var(--c-line);border-radius:24px;color:var(--c-text);font-family:inherit;font-size:14px;transition:border-color .15s}
.nv-cinput::placeholder{color:var(--c-text2)}
.nv-cinput:focus{outline:none;border-color:var(--c-blue)}
.nv-csend{width:38px;height:38px;border:none;border-radius:50%;background:var(--c-blue);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}
.nv-csend:disabled{opacity:.4;cursor:default}
.nv-csend:not(:disabled):hover{background:var(--c-blue2)}
.nv-modal-overlay{position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:nv-fade-in .18s ease}
@keyframes nv-fade-in{from{opacity:0}to{opacity:1}}
.nv-modal{background:var(--c-surf);border:1px solid var(--c-line);border-radius:20px;padding:36px 32px 28px;width:100%;max-width:420px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.6);animation:nv-slide-up .2s cubic-bezier(.34,1.56,.64,1)}
@keyframes nv-slide-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.nv-modal-icon{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
.nv-modal-icon--red{background:rgba(234,67,53,.15);color:#f28b82;border:1.5px solid rgba(234,67,53,.4)}
.nv-modal-icon--blue{background:rgba(26,115,232,.15);color:#8ab4f8;border:1.5px solid rgba(26,115,232,.4)}
.nv-modal-title{font-size:20px;font-weight:600;color:var(--c-text);margin-bottom:12px}
.nv-modal-body{font-size:14px;color:var(--c-text2);line-height:1.6;margin-bottom:28px}
.nv-modal-actions{display:flex;gap:10px;justify-content:center}
.nv-modal-btn{flex:1;padding:12px 20px;border-radius:var(--c-r);font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:7px;max-width:180px}
.nv-modal-btn--ghost{background:transparent;border:1px solid var(--c-line);color:var(--c-text2)}
.nv-modal-btn--ghost:hover{border-color:var(--c-text2);color:var(--c-text)}
.nv-modal-btn--danger{background:var(--c-red);border:none;color:#fff}
.nv-modal-btn--danger:hover:not(:disabled){background:#d33828}
.nv-modal-btn--danger:disabled,.nv-modal-btn--primary:disabled{opacity:.55;cursor:not-allowed}
.nv-modal-btn--primary{background:var(--c-blue);border:none;color:#fff}
.nv-modal-btn--primary:hover:not(:disabled){background:var(--c-blue2)}
.nv-toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:24px;background:var(--c-surf2);border:1px solid var(--c-line);font-size:13px;font-weight:500;color:#81c995;box-shadow:0 4px 24px rgba(0,0,0,.4);z-index:30000;pointer-events:none;white-space:nowrap}
.nv-toast--error{color:#f28b82;border-color:rgba(234,67,53,.35)}
.nv-toast-fx-enter-active,.nv-toast-fx-leave-active{transition:opacity .2s,transform .2s}
.nv-toast-fx-enter-from{opacity:0;transform:translateX(-50%) translateY(10px)}
.nv-toast-fx-leave-to{opacity:0;transform:translateX(-50%) translateY(10px)}
@media(max-width:768px){.nv-daily-wrap.nv-daily--chat-open{right:0}.nv-chat{width:100vw;right:-100vw}.nv-modal{margin:0 16px}}
</style>