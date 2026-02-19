<!-- Meeting.vue — Nova | Daily.co SDK via wrap() | Full debug logging -->
<template>
  <div class="nv-root">

    <!-- ════════════ CREATE ════════════ -->
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
              <label class="nv-flabel">Room name <span class="nv-req">*</span></label>
              <input class="nv-finput" v-model="form.roomName" type="text" placeholder="e.g. weekly-standup" autocomplete="off" spellcheck="false" />
              <span class="nv-fhint">Lowercase letters, numbers and hyphens only</span>
            </div>
            <div class="nv-toggle-list" style="margin-top:20px">
              <label class="nv-trow">
                <div>
                  <div class="nv-trow-label">Private room</div>
                  <div class="nv-trow-sub">Participants need a token — guests can't join anonymously</div>
                </div>
                <div class="nv-switch" :class="{ 'nv-switch--on': form.isPrivate }" @click="form.isPrivate = !form.isPrivate">
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

    <!-- ════════════ MEETING ════════════ -->
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
          <span v-if="recording" class="nv-rec-badge"><span class="nv-rec-dot"></span>REC</span>
        </div>
        <div class="nv-hright">
          <span class="nv-clock">{{ currentTime }}</span>
          <button v-if="isHost" class="nv-hbtn" :class="{ 'nv-hbtn--on': recording }" @click="toggleRecording" :disabled="recordingLoading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>
            {{ recording ? 'Stop rec' : 'Record' }}
          </button>
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

      <div class="nv-daily-wrap" :class="{ 'nv-daily--chat-open': chatOpen }">
        <div v-if="dailyLoading" class="nv-daily-loading">
          <div class="nv-loading-inner">
            <span class="nv-spinner nv-spinner--lg"></span>
            <p>{{ loadingStatus }}</p>
          </div>
        </div>
        <div v-if="joinError" class="nv-join-error">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{{ joinError }}</p>
          <button class="nv-btn-primary" style="max-width:200px;margin-top:16px" @click="retryJoin">Retry</button>
        </div>
        <!-- Daily SDK iframe mounts here — plain div, no Vue reactivity wrapping the ref usage -->
        <div ref="dailyContainer" class="nv-daily-frame"></div>
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
            <button class="nv-ctrl" :class="screenSharing ? 'nv-ctrl--sharing' : 'nv-ctrl--on'" @click="toggleScreen">
              <svg v-if="!screenSharing" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="8 10 12 6 16 10"/><line x1="12" y1="6" x2="12" y2="14"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            </button>
            <span class="nv-clabel">{{ screenSharing ? 'Stop sharing' : 'Present' }}</span>
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
          <input class="nv-cinput" type="text" v-model="chatMessage" @keypress.enter="sendChatMessage" placeholder="Message everyone…" />
          <button class="nv-csend" @click="sendChatMessage" :disabled="!chatMessage.trim()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <!-- End modal -->
      <div v-if="showEndModal" class="nv-modal-overlay" @click.self="showEndModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--red">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h2 class="nv-modal-title">End meeting for everyone?</h2>
          <p class="nv-modal-body">This will permanently delete the Daily room and disconnect all participants.</p>
          <div class="nv-modal-actions">
            <button class="nv-modal-btn nv-modal-btn--ghost" @click="showEndModal = false">Cancel</button>
            <button class="nv-modal-btn nv-modal-btn--danger" @click="confirmEndMeeting" :disabled="ending">
              <span v-if="ending" class="nv-spinner nv-spinner--sm"></span>
              End for everyone
            </button>
          </div>
        </div>
      </div>

      <!-- Restart modal -->
      <div v-if="showRestartModal" class="nv-modal-overlay" @click.self="showRestartModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--blue">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          </div>
          <h2 class="nv-modal-title">Restart this meeting?</h2>
          <p class="nv-modal-body">All participants will be disconnected. They can rejoin with the same code once the room is ready.</p>
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
import { TokenService } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

// ─── Debug logger ─────────────────────────────────────────────────────────────
// All logs are prefixed so they're easy to filter in DevTools.
// Set window.__NOVA_VERBOSE = false to suppress non-error logs.
const log  = (...a) => { if (window.__NOVA_VERBOSE !== false) console.log('[Nova]',  ...a); };
const warn = (...a) => console.warn('[Nova]',  ...a);
const err  = (...a) => console.error('[Nova]', ...a);

// ─── Safe structured-clone test ───────────────────────────────────────────────
// Returns true if the value can be cloned across a postMessage boundary.
function isCloneable(val) {
  try { structuredClone(val); return true; } catch (e) { return false; }
}

// ─── Strip Vue reactive proxy from a value ────────────────────────────────────
// Vue 3 wraps data/computed refs in a Proxy. Daily's SDK passes joinOpts and
// the iframe element through internal postMessage calls; Proxy objects are NOT
// structured-cloneable, causing DataCloneError.
// This helper walks an object and returns a plain clone with zero proxy metadata.
function deproxy(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string')  return String(val);   // force new primitive
  if (typeof val === 'boolean') return Boolean(val);  // force new primitive
  if (typeof val === 'number')  return Number(val);   // force new primitive
  // For objects, use JSON round-trip — guaranteed plain, no proxy, no prototype chain
  try { return JSON.parse(JSON.stringify(val)); } catch { return val; }
}

export default {
  name: 'Meeting',
  props: { code: { type: String, default: null } },

  data() {
    return {
      view: 'create',

      // Create form
      form:        { roomName: '', isPrivate: false },
      creating:    false,
      createError: '',
      created:     { code: null },

      // Meeting state
      meetingCode:      '',
      dailyRoomUrl:     '',
      dailyRoomName:    '',
      callFrame:        null,
      dailyLoading:     true,
      loadingStatus:    'Initialising…',
      joinError:        '',
      retryCount:       0,

      // Media
      audioOn:          true,
      videoOn:          true,
      screenSharing:    false,
      participantCount: 1,
      isHost:           false,
      userName:         'Guest',

      // Recording
      recording:        false,
      recordingLoading: false,

      // Modals
      showEndModal:     false,
      showRestartModal: false,
      ending:           false,
      restarting:       false,

      // Chat
      chatOpen:         false,
      chatMessage:      '',
      messages:         [],
      unreadCount:      0,

      // Toast
      toastVisible:     false,
      toastMessage:     '',
      toastType:        'success',

      currentTime:   '',
      clockInterval: null,
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
  },

  methods: {

    // ═══════════════════════════════════════════════════════
    //  CREATE MEETING
    // ═══════════════════════════════════════════════════════

    async createMeeting() {
      this.createError = '';
      const name = this.form.roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      log('createMeeting() — sanitised name:', name);

      if (!name) { this.createError = 'Please enter a valid room name.'; return; }
      if (!this.isAuthenticated) { this.createError = 'You must be signed in to create a meeting.'; return; }

      this.creating = true;
      try {
        log('createMeeting() — calling MeetingSession.createMeeting…');
        const roomData = await MeetingSession.createMeeting(name, this.form.isPrivate);
        log('createMeeting() — raw roomData:', roomData);

        const code = roomData?.name || roomData?.meetingCode || name;
        MeetingSession.setMeetingCode(code);
        if (roomData?.url) sessionStorage.setItem('nova_daily_room', roomData.url);
        sessionStorage.setItem('nova_meeting_title', name);

        this.created = { code };
        MeetingSession.saveRecentMeeting(code, name);
        log('✅ createMeeting() — code:', code, '| url:', roomData?.url);
      } catch (e) {
        err('createMeeting() — error:', e);
        this.createError = e.message || 'Failed to create meeting.';
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
      log('enterMeeting() — code:', this.created.code);
      this.meetingCode = this.created.code;
      this.isHost      = true;
      MeetingSession.setIsHost(true);
      this.view = 'meeting';
      this.$nextTick(() => this.initMeeting());
    },

    // ═══════════════════════════════════════════════════════
    //  INIT MEETING
    // ═══════════════════════════════════════════════════════

    async initMeeting() {
      log('════ initMeeting() ════');

      if (!this.meetingCode) {
        this.meetingCode = this.code
          || this.$route?.params?.code
          || MeetingSession.getMeetingCode();
      }

      log('initMeeting() — meetingCode:', this.meetingCode);

      if (!this.meetingCode) {
        warn('initMeeting() — no meetingCode, redirecting to join');
        this.$router.push('/meetings/join');
        return;
      }

      this.joinError     = '';
      this.dailyLoading  = true;
      this.loadingStatus = 'Resolving user…';

      this.userName = MeetingSession.getUserDisplayName();
      this.isHost   = this.isHost || MeetingSession.isHost();
      log('initMeeting() — userName:', this.userName, '| isHost:', this.isHost);

      // ── Fetch Daily token ──────────────────────────────
      this.loadingStatus = 'Fetching token…';
      log('initMeeting() — fetching token for:', this.meetingCode);

      const tokenData = await MeetingSession.fetchDailyToken(this.meetingCode, this.isHost);
      log('initMeeting() — tokenData:', tokenData);

      if (tokenData?.roomUrl) {
        this.dailyRoomUrl  = tokenData.roomUrl;
        this.dailyRoomName = tokenData.roomName;
        this.isHost        = this.isHost || !!tokenData.isOwner;
        log('initMeeting() — roomUrl:', this.dailyRoomUrl, '| isOwner:', this.isHost);
      } else {
        warn('initMeeting() — token fetch failed, trying cache…');
        const cached = MeetingSession.getDailyRoom();
        log('initMeeting() — cached room:', cached);
        if (cached.roomUrl) {
          this.dailyRoomUrl  = cached.roomUrl;
          this.dailyRoomName = cached.roomName;
        } else {
          err('initMeeting() — no room URL available');
          this.joinError    = 'Could not get room URL. Try again.';
          this.dailyLoading = false;
          return;
        }
      }

      // ── Load Daily SDK ────────────────────────────────
      this.loadingStatus = 'Loading video SDK…';
      try {
        await this.loadDailySDK();
        log('initMeeting() — Daily SDK ready | DailyIframe:', typeof window.DailyIframe);
      } catch (e) {
        err('initMeeting() — SDK load failed:', e);
        this.joinError    = 'Failed to load video SDK. Check your connection.';
        this.dailyLoading = false;
        return;
      }

      // ── Extract plain string token ─────────────────────
      let rawToken = typeof tokenData?.token === 'string'
        ? tokenData.token
        : (MeetingSession.getDailyToken() || null);

      log('initMeeting() — rawToken type:', typeof rawToken, '| length:', rawToken?.length);

      if (rawToken && typeof rawToken !== 'string') {
        warn('initMeeting() — rawToken was not a string, discarding');
        rawToken = null;
      }

      this.updateClock();
      this.clockInterval = setInterval(this.updateClock, 10_000);

      // ── Join ──────────────────────────────────────────
      this.loadingStatus = 'Joining room…';
      await this.joinDailyRoom(rawToken);
    },

    // ═══════════════════════════════════════════════════════
    //  LOAD DAILY SDK
    // ═══════════════════════════════════════════════════════

    loadDailySDK() {
      return new Promise((resolve, reject) => {
        if (window.DailyIframe) {
          log('loadDailySDK() — already loaded');
          resolve();
          return;
        }
        log('loadDailySDK() — injecting script…');
        const s   = document.createElement('script');
        s.src     = 'https://unpkg.com/@daily-co/daily-js';
        s.onload  = () => { log('loadDailySDK() — script loaded ✅'); resolve(); };
        s.onerror = (e) => { err('loadDailySDK() — script error:', e); reject(new Error('Failed to load Daily SDK')); };
        document.head.appendChild(s);
      });
    },

    // ═══════════════════════════════════════════════════════
    //  JOIN DAILY ROOM
    //
    //  Strategy: manually create an <iframe> and append it to the container
    //  div, then call DailyIframe.wrap(iframe) instead of createFrame().
    //
    //  Why wrap() instead of createFrame():
    //    createFrame() creates an iframe internally and passes it via
    //    postMessage during setup. In Vue 3, anything touched by the
    //    reactivity system becomes a Proxy, which is NOT structured-cloneable,
    //    causing DataCloneError. wrap() accepts an already-existing DOM node
    //    that we create ourselves — no cloning of DOM references involved.
    //
    //  Why deproxy() on joinOpts:
    //    Even plain JS object literals `{}` created inside a Vue method can
    //    carry hidden reactive metadata if any value came from a reactive data
    //    property. deproxy() JSON-round-trips the values to produce clean
    //    primitives with zero Vue involvement.
    // ═══════════════════════════════════════════════════════

    async joinDailyRoom(token = null) {
      log('════ joinDailyRoom() ════');

      try {
        this.dailyLoading = true;
        this.joinError    = '';

        // ── 1. Ensure we have a plain string token ─────
        if (token && typeof token !== 'string') {
          warn('joinDailyRoom() — token was not a string:', typeof token, '— discarding');
          token = null;
        }

        // If no token, try to fetch a fresh one
        if (!token) {
          log('joinDailyRoom() — no token supplied, fetching fresh…');
          const fresh = await MeetingSession.fetchDailyToken(this.meetingCode, this.isHost);
          token = typeof fresh?.token === 'string' ? fresh.token : null;
          log('joinDailyRoom() — fresh token length:', token?.length ?? 'none');
        }

        // ── 2. Get the container — read from DOM directly ──
        //    We read $refs.dailyContainer once and immediately extract the
        //    raw DOM node. We NEVER store the result in a reactive data
        //    property (that would re-wrap it in a Proxy).
        const containerRef = this.$refs.dailyContainer;
        log('joinDailyRoom() — containerRef type:', Object.prototype.toString.call(containerRef));

        // Unwrap Vue component ref ($el) or use the element directly
        const container = containerRef?.$el instanceof HTMLElement
          ? containerRef.$el
          : (containerRef instanceof HTMLElement ? containerRef : null);

        log('joinDailyRoom() — container:', container?.tagName, container?.id || container?.className);

        if (!container) {
          throw new Error('Daily container <div> not found in DOM. Check ref="dailyContainer".');
        }

        // ── 3. Remove any stale iframe from a previous session ──
        const stale = container.querySelector('iframe');
        if (stale) {
          warn('joinDailyRoom() — removing stale iframe');
          stale.remove();
        }

        // ── 4. Create a brand-new <iframe> and append to container ──
        //    We set all attributes before inserting into the DOM so Daily
        //    sees a fully-configured iframe when wrap() is called.
        log('joinDailyRoom() — creating iframe element…');
        const iframe = document.createElement('iframe');
        iframe.allow = 'camera; microphone; fullscreen; display-capture; autoplay; clipboard-write';
        iframe.style.cssText = [
          'position:absolute',
          'top:0',
          'left:0',
          'width:100%',
          'height:100%',
          'border:none',
          'background:#202124',
        ].join(';');

        container.appendChild(iframe);
        log('joinDailyRoom() — iframe appended ✅ | inDOM:', document.contains(iframe));

        // ── 5. Verify iframe is cloneable BEFORE calling wrap() ──
        const iframeCloneable = isCloneable(iframe);
        log('joinDailyRoom() — iframe structuredClone test:', iframeCloneable ? '✅ pass' : '❌ FAIL');

        // ── 6. Call DailyIframe.wrap() with the raw DOM iframe ──
        log('joinDailyRoom() — calling DailyIframe.wrap()…');
        this.callFrame = window.DailyIframe.wrap(iframe, {
          showLeaveButton:      false,
          showFullscreenButton: false,
        });
        log('joinDailyRoom() — callFrame created ✅:', typeof this.callFrame);

        // ── 7. Register event listeners ──────────────────
        this.callFrame
          .on('joined-meeting',      this.onJoinedMeeting)
          .on('left-meeting',        this.onLeftMeeting)
          .on('participant-joined',  this.onParticipantJoined)
          .on('participant-updated', this.onParticipantUpdated)
          .on('participant-left',    this.onParticipantLeft)
          .on('app-message',         this.onAppMessage)
          .on('error',               this.onDailyError)
          .on('camera-error',        this.onCameraError)
          .on('load-attempt-failed', this.onLoadAttemptFailed);
        log('joinDailyRoom() — event listeners registered ✅');

        // ── 8. Build joinOpts from fully deproxied primitives ──
        //    Every value is passed through deproxy() to strip any Vue
        //    reactive metadata before Daily touches it.
        const safeUrl      = deproxy(this.dailyRoomUrl);
        const safeUserName = deproxy(this.userName);
        const safeToken    = token ? deproxy(token) : undefined;

        log('joinDailyRoom() — safeUrl type:', typeof safeUrl, '| value:', safeUrl);
        log('joinDailyRoom() — safeUserName type:', typeof safeUserName, '| value:', safeUserName);
        log('joinDailyRoom() — safeToken type:', typeof safeToken, '| present:', !!safeToken);

        // Build opts on a null-prototype object — no prototype chain = no hidden proxy
        const joinOpts = Object.create(null);
        joinOpts.url           = safeUrl;
        joinOpts.userName      = safeUserName;
        joinOpts.startVideoOff = false;
        joinOpts.startAudioOff = false;
        if (safeToken && safeToken.trim().length > 0) {
          joinOpts.token = safeToken;
        }

        // ── 9. Verify joinOpts is cloneable BEFORE calling join() ──
        const optsCloneable = isCloneable(joinOpts);
        log('joinDailyRoom() — joinOpts structuredClone test:', optsCloneable ? '✅ pass' : '❌ FAIL');
        if (!optsCloneable) {
          // If this fires, log each field individually to find the culprit
          for (const [k, v] of Object.entries(joinOpts)) {
            const ok = isCloneable(v);
            log(`  joinOpts["${k}"] (${typeof v}) → cloneable: ${ok ? '✅' : '❌'}`);
          }
          throw new Error('joinOpts is not structured-cloneable — check logs above for culprit field');
        }

        log('joinDailyRoom() — calling callFrame.join()…', {
          url:      joinOpts.url,
          userName: joinOpts.userName,
          hasToken: !!joinOpts.token,
        });

        // ── 10. JOIN ──────────────────────────────────────
        await this.callFrame.join(joinOpts);
        log('✅ joinDailyRoom() — joined successfully');

      } catch (e) {
        err('joinDailyRoom() — CAUGHT ERROR:', e?.name, e?.message);
        err('joinDailyRoom() — stack:', e?.stack);
        this.dailyLoading = false;
        this.joinError    = e.message || 'Failed to join meeting.';
        this.showToast('Failed to join: ' + (e.message || 'Unknown error'), 'error');
        this.retryCount++;
      }
    },

    // Exposed for the "Retry" button shown when joinError is set
    async retryJoin() {
      log('retryJoin() — attempt #', this.retryCount + 1);
      this.joinError = '';
      await this.joinDailyRoom(null);
    },

    // ═══════════════════════════════════════════════════════
    //  DAILY EVENTS
    // ═══════════════════════════════════════════════════════

    onJoinedMeeting(event) {
      log('Daily event: joined-meeting', event);
      this.dailyLoading = false;
      this.joinError    = '';
      const local = event?.participants?.local;
      if (local) {
        this.audioOn = !local.audio_disabled;
        this.videoOn = !local.video_disabled;
        log('onJoinedMeeting() — audio:', this.audioOn, '| video:', this.videoOn);
      }
      this.syncParticipantCount();
    },

    onLeftMeeting(event) {
      log('Daily event: left-meeting', event);
    },

    onParticipantJoined(event) {
      log('Daily event: participant-joined', event?.participant?.user_name);
      const name = event?.participant?.user_name;
      this.syncParticipantCount();
      if (name && name !== this.userName) this.showToast(`${name} joined`);
    },

    onParticipantUpdated(event) {
      const p = event?.participant;
      if (!p) return;
      if (p.local) {
        this.audioOn      = !p.audio_disabled;
        this.videoOn      = !p.video_disabled;
        this.screenSharing = !!p.screen;
      }
      this.syncParticipantCount();
    },

    onParticipantLeft(event) {
      log('Daily event: participant-left', event?.participant?.user_name);
      this.syncParticipantCount();
    },

    syncParticipantCount() {
      if (!this.callFrame) return;
      try {
        const count = Object.keys(this.callFrame.participants()).length;
        log('syncParticipantCount() —', count);
        this.participantCount = count;
      } catch (e) {
        warn('syncParticipantCount() — error:', e.message);
      }
    },

    onAppMessage(event) {
      const data = event?.data;
      log('Daily event: app-message', data?.type);
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
          if (this.callFrame) { try { this.callFrame.destroy(); } catch (_) {} this.callFrame = null; }
          this.dailyLoading = true;
          await this.initMeeting();
        }, 1200);
      }
    },

    onDailyError(event) {
      err('Daily event: error', event);
      this.showToast('Connection error: ' + (event?.errorMsg || 'Unknown'), 'error');
    },

    onCameraError(event) {
      warn('Daily event: camera-error', event);
      this.showToast('Camera/mic error — check your permissions.', 'error');
    },

    onLoadAttemptFailed(event) {
      err('Daily event: load-attempt-failed', event);
      this.joinError = 'Room failed to load. The room may not exist yet.';
      this.dailyLoading = false;
    },

    // ═══════════════════════════════════════════════════════
    //  MEDIA CONTROLS
    // ═══════════════════════════════════════════════════════

    toggleAudio() {
      if (!this.callFrame) return;
      log('toggleAudio() — new state:', !this.audioOn);
      this.callFrame.setLocalAudio(!this.audioOn);
    },

    toggleVideo() {
      if (!this.callFrame) return;
      log('toggleVideo() — new state:', !this.videoOn);
      this.callFrame.setLocalVideo(!this.videoOn);
    },

    async toggleScreen() {
      if (!this.callFrame) return;
      try {
        if (this.screenSharing) {
          log('toggleScreen() — stopping share');
          await this.callFrame.stopScreenShare();
        } else {
          log('toggleScreen() — starting share');
          await this.callFrame.startScreenShare();
        }
      } catch (e) {
        if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
          err('toggleScreen() error:', e.message);
          this.showToast('Screen share error: ' + e.message, 'error');
        }
      }
    },

    // ═══════════════════════════════════════════════════════
    //  RECORDING
    // ═══════════════════════════════════════════════════════

    async toggleRecording() {
      if (this.recordingLoading) return;
      this.recordingLoading = true;
      try {
        if (this.recording) {
          log('toggleRecording() — stopping');
          await MeetingSession.stopRecording(this.meetingCode);
          this.recording = false;
          this.showToast('Recording stopped.');
        } else {
          log('toggleRecording() — starting');
          await MeetingSession.startRecording(this.meetingCode);
          this.recording = true;
          this.showToast('Recording started.');
        }
      } catch (e) {
        err('toggleRecording() error:', e.message);
        this.showToast('Recording error: ' + e.message, 'error');
      } finally {
        this.recordingLoading = false;
      }
    },

    // ═══════════════════════════════════════════════════════
    //  MEETING LIFECYCLE
    // ═══════════════════════════════════════════════════════

    endMeeting()     { this.showEndModal     = true; },
    restartMeeting() { this.showRestartModal = true; },

    async confirmEndMeeting() {
      log('confirmEndMeeting()');
      this.ending = true;
      try {
        if (this.callFrame) {
          try { this.callFrame.sendAppMessage({ type: 'meeting-ended', endedBy: this.userName }, '*'); } catch (_) {}
          await new Promise(r => setTimeout(r, 600));
        }
        await MeetingSession.endMeeting(this.meetingCode);
        this.showEndModal = false;
        this.cleanupAndNavigate();
      } catch (e) {
        err('confirmEndMeeting() error:', e);
        this.showToast('Failed to end meeting.', 'error');
      } finally {
        this.ending = false;
      }
    },

    async confirmRestartMeeting() {
      log('confirmRestartMeeting()');
      this.restarting = true;
      try {
        if (this.callFrame) {
          try { this.callFrame.sendAppMessage({ type: 'meeting-restarted', by: this.userName }, '*'); } catch (_) {}
          await new Promise(r => setTimeout(r, 600));
        }
        await MeetingSession.restartMeeting(this.meetingCode);
        this.showRestartModal = false;
        this.showToast('Meeting restarted!');
        this.messages    = [];
        this.unreadCount = 0;

        if (this.callFrame) { try { this.callFrame.destroy(); } catch (_) {} this.callFrame = null; }
        this.dailyLoading = true;
        await new Promise(r => setTimeout(r, 1000));
        await this.initMeeting();
      } catch (e) {
        err('confirmRestartMeeting() error:', e);
        this.showToast('Failed to restart meeting.', 'error');
      } finally {
        this.restarting = false;
      }
    },

    leave() {
      const msg = this.isHost
        ? 'Leave? Use "End" to close for everyone.'
        : 'Leave this meeting?';
      if (!confirm(msg)) return;
      log('leave() — confirmed');
      this.cleanupAndNavigate();
    },

    cleanupAndNavigate() {
      log('cleanupAndNavigate()');
      clearInterval(this.clockInterval);
      if (this.recording) MeetingSession.stopRecording(this.meetingCode).catch(() => {});
      if (this.callFrame) {
        try { this.callFrame.destroy(); } catch (_) {}
        this.callFrame = null;
      }
      // Remove manually-created iframe
      const containerRef = this.$refs.dailyContainer;
      const container    = containerRef?.$el instanceof HTMLElement ? containerRef.$el : containerRef;
      if (container instanceof HTMLElement) {
        const iframe = container.querySelector('iframe');
        if (iframe) { log('cleanupAndNavigate() — removing iframe'); iframe.remove(); }
      }
      MeetingSession.clearMeetingData();
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/meetings/join');
    },

    // ═══════════════════════════════════════════════════════
    //  CHAT
    // ═══════════════════════════════════════════════════════

    toggleChat() {
      this.chatOpen = !this.chatOpen;
      if (this.chatOpen) this.unreadCount = 0;
    },

    sendChatMessage() {
      const text = this.chatMessage.trim();
      if (!text) return;
      this.addMsg(this.userName, text, true);

      if (this.callFrame) {
        try {
          this.callFrame.sendAppMessage({ type: 'chat', sender: this.userName, text }, '*');
        } catch (e) {
          warn('sendChatMessage() — sendAppMessage failed:', e.message);
        }
      }

      if (this.isAuthenticated && this.meetingCode) {
        MeetingSession.sendMessage(this.meetingCode, { type: 'chat', sender: this.userName, text })
          .catch(e => warn('sendChatMessage() — backend send failed:', e.message));
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

    // ═══════════════════════════════════════════════════════
    //  UTILITIES
    // ═══════════════════════════════════════════════════════

    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode).then(() => this.showToast('Code copied!'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg;
      this.toastType    = type;
      this.toastVisible = true;
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

  // ═══════════════════════════════════════════════════════
  //  LIFECYCLE
  // ═══════════════════════════════════════════════════════

  mounted() {
    log('mounted() — route query:', this.$route?.query, '| prop code:', this.code);

    const forceCreate = this.$route?.query?.create === 'true';

    if (forceCreate) {
      MeetingSession.clearMeetingData();
      this.view = 'create';
      log('mounted() → force-create mode');
    } else {
      const resolvedCode = this.code || this.$route?.params?.code || MeetingSession.getMeetingCode();
      log('mounted() — resolvedCode:', resolvedCode);
      if (resolvedCode) {
        this.meetingCode = resolvedCode;
        this.isHost      = MeetingSession.isHost();
        this.view        = 'meeting';
        this.$nextTick(() => {
          log('mounted() → $nextTick → initMeeting()');
          this.initMeeting();
        });
      } else {
        log('mounted() → no code found, staying on create view');
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
    log('beforeUnmount()');
    window.removeEventListener('keydown', this._keyHandler);
    clearInterval(this.clockInterval);
    if (this.callFrame) { try { this.callFrame.destroy(); } catch (_) {} this.callFrame = null; }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

.nv-root {
  --c-bg:    #202124; --c-surf:  #292b2f; --c-surf2: #3c4043;
  --c-line:  #3c4043; --c-blue:  #1a73e8; --c-blue2: #174ea6;
  --c-green: #34a853; --c-red:   #ea4335; --c-red-bg:rgba(234,67,53,.15);
  --c-orange:#fa7b17; --c-text:  #e8eaed; --c-text2: #9aa0a6; --c-r:8px;
  font-family:'Google Sans',system-ui,sans-serif;
}

/* ── Create ──────────────────────────────────────────────── */
.nv-create-wrap{min-height:100vh;background:var(--c-bg);color:var(--c-text);display:flex;flex-direction:column}
.nv-cnav{display:flex;align-items:center;justify-content:space-between;padding:14px 32px;background:var(--c-surf);border-bottom:1px solid var(--c-line)}
.nv-cbrand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600;color:var(--c-text);cursor:pointer}
.nv-cnav-back{display:flex;align-items:center;gap:7px;padding:7px 16px;border:1px solid var(--c-line);border-radius:var(--c-r);background:transparent;color:var(--c-text2);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}
.nv-cnav-back:hover{border-color:var(--c-blue);color:var(--c-text);background:rgba(26,115,232,.08)}
.nv-cmain{max-width:520px;margin:0 auto;padding:44px 24px 60px;width:100%}
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
.nv-req{color:var(--c-red)}
.nv-fhint{font-size:11px;color:#5f6368;margin-top:5px;display:block}
.nv-finput{width:100%;padding:11px 14px;background:var(--c-surf2);border:1px solid var(--c-line);border-radius:var(--c-r);color:var(--c-text);font-family:inherit;font-size:14px;transition:border-color .15s,box-shadow .15s;box-sizing:border-box}
.nv-finput::placeholder{color:#5f6368}
.nv-finput:focus{outline:none;border-color:var(--c-blue);box-shadow:0 0 0 3px rgba(26,115,232,.18)}
.nv-toggle-list{border:1px solid var(--c-line);border-radius:var(--c-r);overflow:hidden}
.nv-trow{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer;border-bottom:1px solid var(--c-line);transition:background .12s}
.nv-trow:last-child{border-bottom:none}
.nv-trow:hover{background:rgba(255,255,255,.03)}
.nv-trow-label{font-size:14px;color:var(--c-text)}
.nv-trow-sub{font-size:12px;color:var(--c-text2);margin-top:2px}
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

/* ── Meeting ──────────────────────────────────────────────── */
.nv-meet{background:var(--c-bg);color:var(--c-text);display:flex;flex-direction:column;position:fixed;inset:0;z-index:9999;overflow:hidden}
.nv-header{height:60px;flex-shrink:0;background:var(--c-bg);border-bottom:1px solid var(--c-line);display:flex;align-items:center;justify-content:space-between;padding:0 20px;z-index:200}
.nv-hleft,.nv-hright{display:flex;align-items:center;gap:10px}
.nv-brand{display:flex;align-items:center;gap:8px}
.nv-brand-name{font-size:16px;font-weight:600;letter-spacing:-.2px}
.nv-live-pill{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:600;letter-spacing:.5px;padding:3px 8px;border-radius:20px;background:rgba(234,67,53,.14);border:1px solid rgba(234,67,53,.3);color:#f28b82}
.nv-live-dot{width:6px;height:6px;border-radius:50%;background:var(--c-red);animation:nv-pulse 2s ease-in-out infinite}
@keyframes nv-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
.nv-host-badge{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;background:rgba(250,123,23,.14);border:1px solid rgba(250,123,23,.35);color:#fba45c}
.nv-rec-badge{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(234,67,53,.18);border:1px solid rgba(234,67,53,.5);color:var(--c-red)}
.nv-rec-dot{width:6px;height:6px;border-radius:50%;background:var(--c-red);animation:nv-pulse 1.2s ease-in-out infinite}
.nv-code-chip{display:flex;align-items:center;gap:6px;padding:5px 12px;background:var(--c-surf);border:1px solid var(--c-line);border-radius:var(--c-r);color:#8ab4f8;font-family:'Google Sans Mono',monospace;font-size:12px;cursor:pointer;transition:background .15s}
.nv-code-chip:hover{background:var(--c-surf2);border-color:#8ab4f8}
.nv-pcount{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--c-text2)}
.nv-clock{font-size:13px;color:var(--c-text2);min-width:42px;text-align:right}
.nv-hbtn{display:flex;align-items:center;gap:6px;padding:7px 14px;border:1px solid var(--c-line);border-radius:var(--c-r);background:transparent;color:var(--c-text2);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;position:relative}
.nv-hbtn:hover,.nv-hbtn--on{background:var(--c-surf2);color:var(--c-text);border-color:var(--c-surf2)}
.nv-hbtn--danger{border-color:rgba(234,67,53,.35);color:#f28b82}
.nv-hbtn--danger:hover{background:rgba(234,67,53,.14);border-color:var(--c-red)}
.nv-hbtn:disabled{opacity:.5;cursor:not-allowed}
.nv-unread{min-width:17px;height:17px;border-radius:9px;background:var(--c-blue);color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;padding:0 4px}
.nv-daily-wrap{position:absolute;top:60px;bottom:80px;left:0;right:0;transition:right .25s cubic-bezier(.4,0,.2,1);background:#000}
.nv-daily-wrap.nv-daily--chat-open{right:360px}
.nv-daily-frame{position:relative;width:100%;height:100%}
.nv-daily-loading{position:absolute;inset:0;z-index:5;background:var(--c-bg);display:flex;align-items:center;justify-content:center}
.nv-loading-inner{display:flex;flex-direction:column;align-items:center;gap:16px;color:var(--c-text2);font-size:15px}
.nv-join-error{position:absolute;inset:0;z-index:6;background:var(--c-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#f28b82;font-size:15px;padding:32px;text-align:center}
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
.nv-clabel--red{color:#f28b82}
.nv-clabel--orange{color:#fba45c}
.nv-cdivider{width:1px;height:32px;background:var(--c-line);margin:0 8px}

/* Chat */
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

/* Modals */
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

/* Spinners & Toast */
.nv-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:nv-spin .65s linear infinite}
.nv-spinner--sm{width:13px;height:13px;border:2px solid rgba(255,255,255,.25);border-top-color:currentColor}
.nv-spinner--lg{width:36px;height:36px;border-width:3px;border-color:rgba(255,255,255,.2);border-top-color:var(--c-blue)}
@keyframes nv-spin{to{transform:rotate(360deg)}}
.nv-toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:24px;background:var(--c-surf2);border:1px solid var(--c-line);font-size:13px;font-weight:500;color:#81c995;box-shadow:0 4px 24px rgba(0,0,0,.4);z-index:30000;pointer-events:none;white-space:nowrap}
.nv-toast--error{color:#f28b82;border-color:rgba(234,67,53,.35)}
.nv-toast-fx-enter-active,.nv-toast-fx-leave-active{transition:opacity .2s,transform .2s}
.nv-toast-fx-enter-from{opacity:0;transform:translateX(-50%) translateY(10px)}
.nv-toast-fx-leave-to{opacity:0;transform:translateX(-50%) translateY(10px)}

@media(max-width:768px){
  .nv-daily-wrap.nv-daily--chat-open{right:0}
  .nv-chat{width:100vw;right:-100vw}
  .nv-modal{margin:0 16px}
}
</style>