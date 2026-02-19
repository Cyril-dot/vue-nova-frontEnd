<!-- Meeting.vue — Nova | Jitsi Meet IFrame API -->
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
              <input class="nv-finput" v-model="form.roomName" type="text" placeholder="e.g. weekly-standup" autocomplete="off" spellcheck="false" @keyup.enter="createMeeting" />
              <span class="nv-fhint">Lowercase letters, numbers and hyphens only</span>
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
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a73e8"/>
              <path d="M20 16L26 11V21L20 16Z" fill="white"/>
              <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
            </svg>
            <span class="nv-brand-name">Nova</span>
            <span class="nv-live-pill"><span class="nv-live-dot"></span>LIVE</span>
          </div>
          <button class="nv-code-chip" @click="copyMeetingCode" title="Click to copy meeting code">
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
          <button v-if="isHost" class="nv-hbtn nv-hbtn--warn" @click="endMeeting" title="End meeting for all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            End
          </button>
          <button class="nv-hbtn nv-hbtn--danger" @click="leave">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Leave
          </button>
        </div>
      </header>

      <div class="nv-jitsi-wrap">
        <!-- Loading overlay -->
        <transition name="nv-fade">
          <div v-if="loading" class="nv-loading-overlay">
            <div class="nv-loading-inner">
              <div class="nv-loading-ring"></div>
              <div class="nv-loading-brand">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#1a73e8"/>
                  <path d="M20 16L26 11V21L20 16Z" fill="white"/>
                  <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
                </svg>
              </div>
              <p class="nv-loading-status">{{ loadingStatus }}</p>
            </div>
          </div>
        </transition>

        <!-- Error state -->
        <div v-if="joinError && !loading" class="nv-join-error">
          <div class="nv-error-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p>{{ joinError }}</p>
          <button class="nv-btn-primary" style="max-width:200px;margin-top:16px" @click="initMeeting">Retry</button>
        </div>

        <!-- Jitsi IFrame mounts here -->
        <div id="jitsi-container" ref="jitsiContainer" class="nv-jitsi-frame"></div>
      </div>

      <!-- End modal -->
      <div v-if="showEndModal" class="nv-modal-overlay" @click.self="showEndModal = false">
        <div class="nv-modal">
          <div class="nv-modal-icon nv-modal-icon--red">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h2 class="nv-modal-title">End meeting for everyone?</h2>
          <p class="nv-modal-body">This will delete the room and disconnect all participants.</p>
          <div class="nv-modal-actions">
            <button class="nv-modal-btn nv-modal-btn--ghost" @click="showEndModal = false">Cancel</button>
            <button class="nv-modal-btn nv-modal-btn--danger" @click="confirmEndMeeting" :disabled="ending">
              <span v-if="ending" class="nv-spinner nv-spinner--sm"></span>
              End for everyone
            </button>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <transition name="nv-toast-fx">
        <div v-if="toastVisible" class="nv-toast" :class="toastType === 'error' ? 'nv-toast--error' : ''">
          {{ toastMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

const log = (...a) => console.log('[Nova]', ...a);
const err = (...a) => console.error('[Nova]', ...a);

export default {
  name: 'Meeting',
  props: { code: { type: String, default: null } },

  data() {
    return {
      view: 'create',
      form: { roomName: '' },
      creating: false, createError: '',
      created: { code: null },

      meetingCode: '',
      jitsiRoomUrl: '',
      jitsiApi: null,
      loading: true,
      loadingStatus: 'Initialising…',
      joinError: '',

      participantCount: 1,
      isHost: false,
      userName: 'Guest',

      showEndModal: false,
      ending: false,

      toastVisible: false,
      toastMessage: '',
      toastType: 'success',

      currentTime: '',
      clockInterval: null,
      participantInterval: null,
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
  },

  methods: {

    // ── Create ────────────────────────────────────────────────────────────────
    async createMeeting() {
      this.createError = '';
      const name = this.form.roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!name) { this.createError = 'Please enter a valid room name.'; return; }
      if (!this.isAuthenticated) { this.createError = 'You must be signed in to create a meeting.'; return; }

      this.creating = true;
      try {
        const roomData = await MeetingSession.createMeeting(name, false);
        log('createMeeting() — roomData:', roomData);
        const code = roomData?.name || name;
        MeetingSession.setMeetingCode(code);
        if (roomData?.url) MeetingSession.setJitsiRoom(roomData.url, code);
        this.created = { code };
      } catch (e) {
        err('createMeeting() error:', e);
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
      this.meetingCode = this.created.code;
      this.isHost = true;
      MeetingSession.setIsHost(true);
      this.view = 'meeting';
      this.$nextTick(() => this.initMeeting());
    },

    // ── Init Meeting ──────────────────────────────────────────────────────────
    async initMeeting() {
      log('════ initMeeting() ════');

      if (!this.meetingCode) {
        this.meetingCode = this.code
          || this.$route?.params?.code
          || MeetingSession.getMeetingCode();
      }

      if (!this.meetingCode) {
        this.$router.push('/meetings/join');
        return;
      }

      this.joinError = '';
      this.loading = true;
      this.loadingStatus = 'Resolving user…';

      this.userName = MeetingSession.getUserDisplayName() || 'Nova User';
      this.isHost = this.isHost || MeetingSession.isHost();

      try {
        this.loadingStatus = 'Fetching room…';
        const tokenData = await MeetingSession.fetchMeetingToken(this.meetingCode, this.isHost);

        let roomUrl = tokenData?.roomUrl;
        if (!roomUrl) {
          const cached = MeetingSession.getJitsiRoom();
          roomUrl = cached?.roomUrl;
        }
        if (!roomUrl) {
          roomUrl = `https://meet.jit.si/${this.meetingCode}`;
        }

        this.jitsiRoomUrl = roomUrl;

        this.loadingStatus = 'Loading SDK…';
        await this.loadJitsiSDK();

        this.updateClock();
        this.clockInterval = setInterval(this.updateClock, 10_000);

        this.loadingStatus = 'Joining room…';
        this.launchJitsi(tokenData?.token || null);

      } catch (e) {
        err('initMeeting() error:', e);
        this.joinError = e.message || 'Failed to join meeting.';
        this.loading = false;
      }
    },

    // ── Load Jitsi SDK ────────────────────────────────────────────────────────
    loadJitsiSDK() {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://meet.jit.si/external_api.js';
        s.onload = () => { log('loadJitsiSDK() ✅'); resolve(); };
        s.onerror = () => reject(new Error('Failed to load Jitsi SDK'));
        document.head.appendChild(s);
      });
    },

    // ── Launch Jitsi ──────────────────────────────────────────────────────────
    launchJitsi(token = null) {
      try {
        if (this.jitsiApi) {
          try { this.jitsiApi.dispose(); } catch (_) {}
          this.jitsiApi = null;
        }

        const container = this.$refs.jitsiContainer;
        if (!container) throw new Error('Jitsi container not found.');

        const domain = 'meet.jit.si';
        const roomName = this.meetingCode;

        const options = {
          roomName,
          width: '100%',
          height: '100%',
          parentNode: container,
          userInfo: {
            displayName: this.userName,
          },

          // ── KEY: suppress all security/insecurity warnings ──────────────────
          configOverwrite: {
            // Prejoin / lobby
            prejoinPageEnabled: false,
            prejoinConfig: { enabled: false },

            // Disable the "This meeting is not secured" warnings
            disableThirdPartyRequests: true,
            enableInsecureRoomNameWarning: false,       // ← removes the "public/unsafe" banner
            requireDisplayName: false,

            // Lobby / auth
            enableLobbyChat: false,
            hiddenPremeetingButtons: ['invite'],

            // UX
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            disableInviteFunctions: true,
            doNotStoreRoom: true,

            // Notifications — suppress security-related ones
            notifications: [],          // empty array disables ALL in-meeting notifications
            disableNotifications: true,

            // Hide "Secured by" / watermark branding
            brandingRoomAlias: null,
            callStatsID: null,

            // Prevent redirect on hangup
            enableUserRolesBasedOnToken: false,

            // Toolbox
            toolbarButtons: [
              'microphone', 'camera', 'desktop', 'chat',
              'raisehand', 'participants-pane', 'tileview',
              'fullscreen', 'hangup',
            ],
          },

          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            SHOW_CHROME_EXTENSION_BANNER: false,
            HIDE_INVITE_MORE_HEADER: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            MOBILE_APP_PROMO: false,
            ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 1,

            // Minimal toolbar — security badge won't show on fewer buttons
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat',
              'raisehand', 'participants-pane', 'tileview',
              'fullscreen', 'hangup',
            ],
          },
        };

        if (token) options.jwt = token;

        log('launchJitsi() — creating JitsiMeetExternalAPI | room:', roomName);
        this.jitsiApi = new window.JitsiMeetExternalAPI(domain, options);

        // ── Dismiss any security/notification dialogs that slip through ────────
        // Poll for and auto-dismiss insecurity warnings from the iframe
        setTimeout(() => this.suppressJitsiWarnings(), 2500);
        setTimeout(() => this.suppressJitsiWarnings(), 5000);

        this.jitsiApi.addEventListeners({
          readyToClose:          this.onJitsiReadyToClose,
          participantJoined:     this.onParticipantJoined,
          participantLeft:       this.onParticipantLeft,
          videoConferenceJoined: this.onConferenceJoined,
          videoConferenceLeft:   this.onConferenceLeft,
          errorOccurred:         this.onJitsiError,
        });

        // Start polling participant count
        this.participantInterval = setInterval(this.syncParticipantCount, 5000);

        log('launchJitsi() ✅ — Jitsi launched');
        // Don't set loading=false here — wait for videoConferenceJoined event

      } catch (e) {
        err('launchJitsi() — error:', e);
        this.joinError = e.message || 'Failed to launch meeting.';
        this.loading = false;
      }
    },

    // ── Suppress Jitsi's native in-room warning dialogs ───────────────────────
    // Jitsi renders into an iframe so we can't directly manipulate the DOM,
    // but we can use the IFrame API to execute commands that dismiss warnings.
    suppressJitsiWarnings() {
      if (!this.jitsiApi) return;
      try {
        // Use overwriteConfig to push our disable settings again after the room loads
        // (Jitsi sometimes re-applies defaults after conference joins)
        this.jitsiApi.executeCommand('overwriteConfig', {
          enableInsecureRoomNameWarning: false,
          notifications: [],
          disableNotifications: true,
        });
      } catch (_) {
        // overwriteConfig may not be available in all Jitsi versions — silent fail
      }
    },

    // ── Jitsi Events ──────────────────────────────────────────────────────────
    onConferenceJoined(event) {
      log('Jitsi event: videoConferenceJoined', event);
      this.loading = false;
      this.joinError = '';
      this.syncParticipantCount();
      // Suppress warnings again post-join (Jitsi sometimes shows them on join)
      setTimeout(() => this.suppressJitsiWarnings(), 1000);
    },

    onConferenceLeft(event) {
      log('Jitsi event: videoConferenceLeft', event);
      this.cleanupAndNavigate();
    },

    onParticipantJoined(event) {
      log('Jitsi event: participantJoined', event?.displayName);
      this.syncParticipantCount();
      if (event?.displayName) this.showToast(`${event.displayName} joined`);
    },

    onParticipantLeft(event) {
      log('Jitsi event: participantLeft', event);
      this.syncParticipantCount();
    },

    onJitsiReadyToClose() {
      log('Jitsi event: readyToClose');
      this.cleanupAndNavigate();
    },

    onJitsiError(event) {
      err('Jitsi event: error', event);
      const msg = event?.error?.message || 'Unknown';

      // membersOnly = lobby is enabled on this room — not a real error for us
      if (msg.includes('membersOnly') || msg.includes('members-only')) {
        log('Room has lobby enabled — joining as guest via lobby');
        return;
      }

      this.showToast('Connection issue: ' + msg, 'error');
    },

    syncParticipantCount() {
      if (!this.jitsiApi) return;
      try {
        this.participantCount = this.jitsiApi.getNumberOfParticipants();
      } catch (_) {}
    },

    // ── Leave / End ───────────────────────────────────────────────────────────
    leave() {
      if (!confirm('Leave this meeting?')) return;
      if (this.jitsiApi) {
        try { this.jitsiApi.executeCommand('hangup'); } catch (_) {}
      }
      // Navigate immediately — hangup fires videoConferenceLeft which would double-navigate,
      // so we dispose here and navigate ourselves
      this.cleanupAndNavigate();
    },

    endMeeting() { this.showEndModal = true; },

    async confirmEndMeeting() {
      this.ending = true;
      try {
        if (this.jitsiApi) {
          try { this.jitsiApi.executeCommand('hangup'); } catch (_) {}
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

    cleanupAndNavigate() {
      log('cleanupAndNavigate()');
      clearInterval(this.clockInterval);
      clearInterval(this.participantInterval);
      if (this.jitsiApi) {
        try { this.jitsiApi.dispose(); } catch (_) {}
        this.jitsiApi = null;
      }
      MeetingSession.clearMeetingData();
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/meetings/join');
    },

    // ── Utilities ─────────────────────────────────────────────────────────────
    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode)
        .then(() => this.showToast('Meeting code copied!'))
        .catch(() => this.showToast('Copy failed', 'error'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg;
      this.toastType = type;
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
  },

  mounted() {
    log('mounted() — route query:', this.$route?.query, '| prop code:', this.code);
    const forceCreate = this.$route?.query?.create === 'true';

    if (forceCreate) {
      MeetingSession.clearMeetingData();
      this.view = 'create';
      this.loading = false;
    } else {
      const resolvedCode = this.code
        || this.$route?.params?.code
        || MeetingSession.getMeetingCode();

      if (resolvedCode) {
        this.meetingCode = resolvedCode;
        this.isHost = MeetingSession.isHost();
        this.view = 'meeting';
        this.$nextTick(() => this.initMeeting());
      } else {
        this.view = 'create';
        this.loading = false;
      }
    }
  },

  beforeUnmount() {
    log('beforeUnmount()');
    clearInterval(this.clockInterval);
    clearInterval(this.participantInterval);
    if (this.jitsiApi) {
      try { this.jitsiApi.dispose(); } catch (_) {}
      this.jitsiApi = null;
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

.nv-root {
  --c-bg: #202124;
  --c-surf: #292b2f;
  --c-surf2: #3c4043;
  --c-line: #3c4043;
  --c-blue: #1a73e8;
  --c-blue2: #174ea6;
  --c-green: #34a853;
  --c-red: #ea4335;
  --c-orange: #fa7b17;
  --c-text: #e8eaed;
  --c-text2: #9aa0a6;
  --c-r: 8px;
  font-family: 'Google Sans', system-ui, sans-serif;
}

/* ── Create view ──────────────────────────────────────────── */
.nv-create-wrap { min-height: 100vh; background: var(--c-bg); color: var(--c-text); display: flex; flex-direction: column; }
.nv-cnav { display: flex; align-items: center; justify-content: space-between; padding: 14px 32px; background: var(--c-surf); border-bottom: 1px solid var(--c-line); }
.nv-cbrand { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; color: var(--c-text); cursor: pointer; }
.nv-cnav-back { display: flex; align-items: center; gap: 7px; padding: 7px 16px; border: 1px solid var(--c-line); border-radius: var(--c-r); background: transparent; color: var(--c-text2); font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
.nv-cnav-back:hover { border-color: var(--c-blue); color: var(--c-text); }
.nv-cmain { max-width: 520px; margin: 0 auto; padding: 44px 24px 60px; width: 100%; }
.nv-chead { margin-bottom: 28px; }
.nv-ctitle { font-size: 26px; font-weight: 600; color: var(--c-text); margin-bottom: 6px; }
.nv-csub { font-size: 14px; color: var(--c-text2); }
.nv-card { background: var(--c-surf); border: 1px solid var(--c-line); border-radius: 16px; padding: 32px; box-shadow: 0 8px 40px rgba(0,0,0,.4); }
.nv-success-banner { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 12px; background: rgba(52,168,83,.1); border: 1px solid rgba(52,168,83,.3); margin-bottom: 24px; flex-wrap: wrap; }
.nv-success-check { width: 36px; height: 36px; border-radius: 50%; background: rgba(52,168,83,.2); border: 1px solid rgba(52,168,83,.4); display: flex; align-items: center; justify-content: center; color: #81c995; flex-shrink: 0; }
.nv-success-title { font-size: 14px; font-weight: 600; color: var(--c-text); }
.nv-success-sub { font-size: 12px; color: var(--c-text2); margin-top: 2px; }
.nv-code-pill { display: flex; align-items: center; gap: 7px; margin-left: auto; padding: 8px 16px; border-radius: 24px; background: rgba(52,168,83,.12); border: 1px solid rgba(52,168,83,.3); font-family: 'Google Sans Mono', monospace; font-size: 15px; font-weight: 600; color: #81c995; cursor: pointer; letter-spacing: 1px; }
.nv-section-label { font-size: 11px; font-weight: 600; letter-spacing: .8px; text-transform: uppercase; color: var(--c-text2); margin-bottom: 14px; }
.nv-field { margin-bottom: 16px; }
.nv-flabel { display: block; font-size: 13px; font-weight: 500; color: var(--c-text2); margin-bottom: 7px; }
.nv-req { color: var(--c-red); }
.nv-fhint { font-size: 11px; color: #5f6368; margin-top: 5px; display: block; }
.nv-finput { width: 100%; padding: 11px 14px; background: var(--c-surf2); border: 1px solid var(--c-line); border-radius: var(--c-r); color: var(--c-text); font-family: inherit; font-size: 14px; transition: border-color .15s; box-sizing: border-box; }
.nv-finput:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3px rgba(26,115,232,.18); }
.nv-btn-primary { width: 100%; margin-top: 24px; padding: 13px 20px; background: var(--c-blue); border: none; border-radius: var(--c-r); color: #fff; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .15s; box-shadow: 0 2px 12px rgba(26,115,232,.35); }
.nv-btn-primary:hover:not(:disabled) { background: var(--c-blue2); }
.nv-btn-primary:disabled { opacity: .55; cursor: not-allowed; }
.nv-btn-go { background: #34a853; box-shadow: 0 2px 12px rgba(52,168,83,.35); }
.nv-btn-go:hover:not(:disabled) { background: #2d9248; }
.nv-btn-ghost { width: 100%; margin-top: 10px; padding: 12px 20px; background: transparent; border: 1px solid var(--c-line); border-radius: var(--c-r); color: var(--c-text2); font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer; }
.nv-postcreate { margin-top: 8px; }
.nv-alert-error { display: flex; align-items: center; gap: 8px; margin-top: 14px; padding: 11px 14px; border-radius: var(--c-r); background: rgba(234,67,53,.1); border: 1px solid rgba(234,67,53,.3); font-size: 13px; color: #f28b82; }

/* ── Meeting view ─────────────────────────────────────────── */
.nv-meet { background: var(--c-bg); color: var(--c-text); display: flex; flex-direction: column; position: fixed; inset: 0; z-index: 9999; overflow: hidden; }
.nv-header { height: 60px; flex-shrink: 0; background: var(--c-bg); border-bottom: 1px solid var(--c-line); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 200; }
.nv-hleft, .nv-hright { display: flex; align-items: center; gap: 10px; }
.nv-brand { display: flex; align-items: center; gap: 8px; }
.nv-brand-name { font-size: 16px; font-weight: 600; }
.nv-live-pill { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; letter-spacing: .5px; padding: 3px 8px; border-radius: 20px; background: rgba(234,67,53,.14); border: 1px solid rgba(234,67,53,.3); color: #f28b82; }
.nv-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c-red); animation: nv-pulse 2s ease-in-out infinite; }
@keyframes nv-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .3; transform: scale(.65); } }
.nv-host-badge { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; background: rgba(250,123,23,.14); border: 1px solid rgba(250,123,23,.35); color: #fba45c; }
.nv-code-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; background: var(--c-surf); border: 1px solid var(--c-line); border-radius: var(--c-r); color: #8ab4f8; font-family: 'Google Sans Mono', monospace; font-size: 12px; cursor: pointer; transition: background .15s; }
.nv-code-chip:hover { background: var(--c-surf2); }
.nv-pcount { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--c-text2); }
.nv-clock { font-size: 13px; color: var(--c-text2); min-width: 42px; text-align: right; }
.nv-hbtn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid var(--c-line); border-radius: var(--c-r); background: transparent; color: var(--c-text2); font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
.nv-hbtn--danger { border-color: rgba(234,67,53,.35); color: #f28b82; }
.nv-hbtn--danger:hover { background: rgba(234,67,53,.14); }
.nv-hbtn--warn { border-color: rgba(250,123,23,.35); color: #fba45c; }
.nv-hbtn--warn:hover { background: rgba(250,123,23,.1); }

/* Jitsi container */
.nv-jitsi-wrap { position: absolute; top: 60px; bottom: 0; left: 0; right: 0; background: #000; }
.nv-jitsi-frame { width: 100%; height: 100%; position: relative; }
.nv-jitsi-frame iframe { width: 100% !important; height: 100% !important; border: none !important; }

/* Loading overlay */
.nv-loading-overlay { position: absolute; inset: 0; z-index: 5; background: var(--c-bg); display: flex; align-items: center; justify-content: center; }
.nv-loading-inner { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.nv-loading-ring { width: 64px; height: 64px; border-radius: 50%; border: 3px solid rgba(26,115,232,.2); border-top-color: var(--c-blue); animation: nv-spin .8s linear infinite; position: relative; }
.nv-loading-brand { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -105%); }
.nv-loading-status { font-size: 14px; color: var(--c-text2); }

/* Error state */
.nv-join-error { position: absolute; inset: 0; z-index: 6; background: var(--c-bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #f28b82; font-size: 15px; padding: 32px; text-align: center; }
.nv-error-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(234,67,53,.12); border: 1px solid rgba(234,67,53,.3); display: flex; align-items: center; justify-content: center; color: #f28b82; }

/* Modal */
.nv-modal-overlay { position: fixed; inset: 0; z-index: 20000; background: rgba(0,0,0,.65); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.nv-modal { background: var(--c-surf); border: 1px solid var(--c-line); border-radius: 20px; padding: 36px 32px 28px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 24px 80px rgba(0,0,0,.6); }
.nv-modal-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.nv-modal-icon--red { background: rgba(234,67,53,.15); color: #f28b82; border: 1.5px solid rgba(234,67,53,.4); }
.nv-modal-title { font-size: 20px; font-weight: 600; color: var(--c-text); margin-bottom: 12px; }
.nv-modal-body { font-size: 14px; color: var(--c-text2); line-height: 1.6; margin-bottom: 28px; }
.nv-modal-actions { display: flex; gap: 10px; justify-content: center; }
.nv-modal-btn { flex: 1; padding: 12px 20px; border-radius: var(--c-r); font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 7px; max-width: 180px; }
.nv-modal-btn--ghost { background: transparent; border: 1px solid var(--c-line); color: var(--c-text2); }
.nv-modal-btn--danger { background: var(--c-red); border: none; color: #fff; }
.nv-modal-btn--danger:disabled { opacity: .55; cursor: not-allowed; }

/* Spinners */
.nv-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: nv-spin .65s linear infinite; }
.nv-spinner--sm { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.25); border-top-color: currentColor; }
@keyframes nv-spin { to { transform: rotate(360deg); } }

/* Toast */
.nv-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 24px; background: var(--c-surf2); border: 1px solid var(--c-line); font-size: 13px; font-weight: 500; color: #81c995; box-shadow: 0 4px 24px rgba(0,0,0,.4); z-index: 30000; pointer-events: none; white-space: nowrap; }
.nv-toast--error { color: #f28b82; border-color: rgba(234,67,53,.35); }
.nv-toast-fx-enter-active, .nv-toast-fx-leave-active { transition: opacity .2s, transform .2s; }
.nv-toast-fx-enter-from { opacity: 0; transform: translateX(-50%) translateY(10px); }
.nv-toast-fx-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* Fade transition */
.nv-fade-enter-active, .nv-fade-leave-active { transition: opacity .3s; }
.nv-fade-enter-from, .nv-fade-leave-to { opacity: 0; }
</style>