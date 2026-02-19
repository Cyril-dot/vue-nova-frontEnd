<template>
  <div class="nc-shell">

    <!-- ═══════════════════ CREATE VIEW ═══════════════════ -->
    <div v-if="view === 'create'" class="nc-create">
      <header class="nc-topbar">
        <div class="nc-topbar-brand" @click="goToDashboard">
          <div class="nc-logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="nc-logo-text">Nova<span class="nc-logo-accent">Meet</span></span>
        </div>
        <button class="nc-ghost-btn" @click="goToDashboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
      </header>

      <div class="nc-create-body">
        <div class="nc-create-hero">
          <div class="nc-hero-badge">NEW MEETING</div>
          <h1 class="nc-hero-title">Start a conference</h1>
          <p class="nc-hero-sub">Invite your team and collaborate in real time.</p>
        </div>

        <div class="nc-create-card">
          <!-- Success state -->
          <div v-if="created.code" class="nc-created-state">
            <div class="nc-created-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="nc-created-info">
              <div class="nc-created-label">Meeting ready</div>
              <div class="nc-created-code-row">
                <code class="nc-code-display">{{ created.code }}</code>
                <button class="nc-copy-btn" @click="copyCreatedCode" title="Copy code">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
              <p class="nc-created-hint">Share this code with participants</p>
            </div>
            <div class="nc-created-actions">
              <button class="nc-primary-btn" @click="enterMeeting">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Launch meeting
              </button>
              <button class="nc-ghost-btn nc-ghost-btn--sm" @click="goToDashboard">Cancel</button>
            </div>
          </div>

          <!-- Form state -->
          <div v-if="!created.code" class="nc-create-form">
            <label class="nc-field-label">Room name</label>
            <div class="nc-input-wrap">
              <svg class="nc-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
              <input class="nc-field-input" v-model="form.roomName" type="text" placeholder="e.g. engineering-standup" autocomplete="off" spellcheck="false" @keyup.enter="createMeeting" />
            </div>
            <p class="nc-field-hint">Lowercase letters, numbers and hyphens only</p>

            <div class="nc-form-meta">
              <label class="nc-toggle-wrap">
                <input type="checkbox" v-model="form.isPrivate" class="nc-toggle-input"/>
                <span class="nc-toggle-track"><span class="nc-toggle-thumb"></span></span>
                <span class="nc-toggle-label">Private meeting</span>
              </label>
            </div>

            <button class="nc-primary-btn nc-primary-btn--full" @click="createMeeting" :disabled="creating">
              <span v-if="creating" class="nc-btn-spinner"></span>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ creating ? 'Creating…' : 'Create meeting' }}
            </button>

            <div v-if="createError" class="nc-error-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ createError }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ MEETING VIEW ═══════════════════ -->
    <div v-if="view === 'meeting'" class="nc-meeting">

      <!-- Top control bar -->
      <header class="nc-meeting-bar">
        <div class="nc-bar-left">
          <div class="nc-bar-brand">
            <div class="nc-logo-mark nc-logo-mark--sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="nc-bar-name">NovaMeet</span>
          </div>
          <div class="nc-bar-divider"></div>
          <button class="nc-code-tag" @click="copyMeetingCode" title="Copy code">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            {{ meetingCode }}
          </button>
          <div class="nc-live-chip">
            <span class="nc-live-dot"></span>
            LIVE
          </div>
          <span v-if="isHost" class="nc-host-chip">HOST</span>
        </div>

        <div class="nc-bar-center">
          <div class="nc-pcount">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            {{ participantCount }}
          </div>
          <span class="nc-clock">{{ currentTime }}</span>
        </div>

        <div class="nc-bar-right">
          <button v-if="isHost" class="nc-bar-btn nc-bar-btn--warn" @click="endMeeting">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            End for all
          </button>
          <button class="nc-bar-btn nc-bar-btn--leave" @click="leave">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Leave
          </button>
        </div>
      </header>

      <!-- Jitsi frame area -->
      <div class="nc-frame-wrap">
        <!-- Loading overlay -->
        <transition name="nc-fade">
          <div v-if="loading" class="nc-loading-overlay">
            <div class="nc-loader-card">
              <div class="nc-loader-ring">
                <div class="nc-loader-ring-inner"></div>
              </div>
              <div class="nc-loader-logo">
                <div class="nc-logo-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <p class="nc-loader-status">{{ loadingStatus }}</p>
              <div class="nc-loader-steps">
                <span :class="['nc-step', loadingStep >= 1 ? 'nc-step--done' : '']"></span>
                <span :class="['nc-step', loadingStep >= 2 ? 'nc-step--done' : '']"></span>
                <span :class="['nc-step', loadingStep >= 3 ? 'nc-step--done' : '']"></span>
                <span :class="['nc-step', loadingStep >= 4 ? 'nc-step--done' : '']"></span>
              </div>
            </div>
          </div>
        </transition>

        <!-- Error state -->
        <div v-if="joinError && !loading" class="nc-error-overlay">
          <div class="nc-error-card">
            <div class="nc-error-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 class="nc-error-title">Connection failed</h3>
            <p class="nc-error-msg">{{ joinError }}</p>
            <button class="nc-primary-btn" @click="initMeeting">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 100 .49-4.5"/></svg>
              Retry
            </button>
          </div>
        </div>

        <!-- Jitsi mounts here -->
        <div id="nc-jitsi" ref="jitsiContainer" class="nc-jitsi-frame"></div>
      </div>

      <!-- End meeting modal -->
      <transition name="nc-modal-pop">
        <div v-if="showEndModal" class="nc-modal-overlay" @click.self="showEndModal = false">
          <div class="nc-modal">
            <div class="nc-modal-icon nc-modal-icon--danger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            </div>
            <h2 class="nc-modal-title">End meeting for everyone?</h2>
            <p class="nc-modal-body">All participants will be disconnected and the room will be removed.</p>
            <div class="nc-modal-actions">
              <button class="nc-ghost-btn" @click="showEndModal = false">Cancel</button>
              <button class="nc-danger-btn" @click="confirmEndMeeting" :disabled="ending">
                <span v-if="ending" class="nc-btn-spinner"></span>
                End for everyone
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Toast -->
    <transition name="nc-toast-pop">
      <div v-if="toastVisible" class="nc-toast" :class="'nc-toast--' + toastType">
        <svg v-if="toastType === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

const JAAS_APP_ID = 'vpaas-magic-cookie-7eca117a3c424c7bb5c5787891573dbf';

const log = (...a) => console.log('[NovaMeet]', ...a);
const err = (...a) => console.error('[NovaMeet]', ...a);

export default {
  name: 'Meeting',
  props: { code: { type: String, default: null } },

  data() {
    return {
      view: 'create',
      form: { roomName: '', isPrivate: false },
      creating: false,
      createError: '',
      created: { code: null },

      meetingCode: '',
      jitsiApi: null,
      loading: true,
      loadingStatus: 'Initialising…',
      loadingStep: 0,
      joinError: '',

      participantCount: 1,
      isHost: false,
      userName: 'Guest',
      jitsiDomain: '8x8.vc',
      jitsiAppId: JAAS_APP_ID,

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

    // ── Create ──────────────────────────────────────────────────────────────
    async createMeeting() {
      this.createError = '';
      const name = this.form.roomName.trim().toLowerCase()
        .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!name) { this.createError = 'Please enter a valid room name.'; return; }
      if (!this.isAuthenticated) { this.createError = 'You must be signed in to create a meeting.'; return; }

      this.creating = true;
      try {
        const roomData = await MeetingSession.createMeeting(name, this.form.isPrivate);
        log('createMeeting() roomData:', roomData);
        const code = roomData?.name || name;
        MeetingSession.setMeetingCode(code);
        if (roomData?.url) MeetingSession.setJitsiRoom(roomData.url, code);
        this.created = { code };
        this.showToast('Meeting created!', 'success');
      } catch (e) {
        err('createMeeting() error:', e);
        this.createError = e.message || 'Failed to create meeting.';
      } finally {
        this.creating = false;
      }
    },

    copyCreatedCode() {
      if (!this.created.code) return;
      navigator.clipboard.writeText(this.created.code)
        .then(() => this.showToast('Code copied!'));
    },

    enterMeeting() {
      if (!this.created.code) return;
      this.meetingCode = this.created.code;
      this.isHost = true;
      MeetingSession.setIsHost(true);
      this.view = 'meeting';
      this.$nextTick(() => this.initMeeting());
    },

    // ── Init Meeting ────────────────────────────────────────────────────────
    async initMeeting() {
      log('════ initMeeting() ════');

      if (!this.meetingCode) {
        this.meetingCode = this.code
          || this.$route?.params?.code
          || MeetingSession.getMeetingCode();
      }
      if (!this.meetingCode) { this.$router.push('/meetings/join'); return; }

      this.joinError = '';
      this.loading = true;
      this.loadingStep = 1;
      this.loadingStatus = 'Authenticating…';
      this.userName = MeetingSession.getUserDisplayName() || 'Nova User';
      this.isHost = this.isHost || MeetingSession.isHost();

      try {
        this.loadingStep = 2;
        this.loadingStatus = 'Fetching room token…';
        const tokenData = await MeetingSession.fetchMeetingToken(this.meetingCode, this.isHost);

        // Pick up domain/appId from backend response if available
        if (tokenData?.domain) this.jitsiDomain = tokenData.domain;
        if (tokenData?.appId)  this.jitsiAppId  = tokenData.appId;

        this.loadingStep = 3;
        this.loadingStatus = 'Loading JaaS SDK…';
        await this.loadJaaSSDK();

        this.updateClock();
        this.clockInterval = setInterval(this.updateClock, 10_000);

        this.loadingStep = 4;
        this.loadingStatus = 'Joining room…';
        this.launchJitsi(tokenData?.token || null);

      } catch (e) {
        err('initMeeting() error:', e);
        this.joinError = e.message || 'Failed to join meeting.';
        this.loading = false;
      }
    },

    // ── Load JaaS SDK ───────────────────────────────────────────────────────
    loadJaaSSDK() {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) { resolve(); return; }
        const s = document.createElement('script');
        s.src = `https://8x8.vc/${this.jitsiAppId}/external_api.js`;
        s.onload  = () => { log('JaaS SDK loaded ✅'); resolve(); };
        s.onerror = () => reject(new Error('Failed to load JaaS SDK'));
        document.head.appendChild(s);
      });
    },

    // ── Launch Jitsi ────────────────────────────────────────────────────────
    launchJitsi(token = null) {
      try {
        if (this.jitsiApi) {
          try { this.jitsiApi.dispose(); } catch (_) {}
          this.jitsiApi = null;
        }

        const container = this.$refs.jitsiContainer;
        if (!container) throw new Error('Jitsi container not found.');

        // JaaS room name format: AppID/roomCode
        const roomName = `${this.jitsiAppId}/${this.meetingCode}`;

        const options = {
          roomName,
          width:      '100%',
          height:     '100%',
          parentNode: container,
          jwt:        token,

          userInfo: { displayName: this.userName },

          configOverwrite: {
            prejoinPageEnabled:           false,
            prejoinConfig:                { enabled: false },
            enableInsecureRoomNameWarning: false,
            requireDisplayName:           false,
            enableLobbyChat:              false,
            startWithAudioMuted:          false,
            startWithVideoMuted:          false,
            disableDeepLinking:           true,
            disableInviteFunctions:       true,
            doNotStoreRoom:               true,
            notifications:                [],
            disableNotifications:         true,
            enableUserRolesBasedOnToken:  true,
            // Screen sharing enabled
            desktopSharingChromeExtId:    null,
            desktopSharingChromeDisabled: false,
            desktopSharingFirefoxDisabled: false,
            toolbarButtons: [
              'microphone', 'camera', 'desktop', 'chat',
              'raisehand', 'participants-pane', 'tileview',
              'fullscreen', 'settings', 'hangup',
            ],
          },

          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK:             false,
            SHOW_WATERMARK_FOR_GUESTS:        false,
            SHOW_BRAND_WATERMARK:             false,
            SHOW_POWERED_BY:                  false,
            SHOW_PROMOTIONAL_CLOSE_PAGE:      false,
            SHOW_CHROME_EXTENSION_BANNER:     false,
            HIDE_INVITE_MORE_HEADER:          true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            MOBILE_APP_PROMO:                 false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat',
              'raisehand', 'participants-pane', 'tileview',
              'fullscreen', 'settings', 'hangup',
            ],
          },
        };

        log('launchJitsi() creating JitsiMeetExternalAPI | room:', roomName);
        this.jitsiApi = new window.JitsiMeetExternalAPI(this.jitsiDomain, options);

        this.jitsiApi.addEventListeners({
          readyToClose:           this.onJitsiReadyToClose,
          participantJoined:      this.onParticipantJoined,
          participantLeft:        this.onParticipantLeft,
          videoConferenceJoined:  this.onConferenceJoined,
          videoConferenceLeft:    this.onConferenceLeft,
          errorOccurred:          this.onJitsiError,
          screenSharingStatusChanged: this.onScreenShareChanged,
        });

        this.participantInterval = setInterval(this.syncParticipantCount, 5000);
        log('launchJitsi() ✅');

      } catch (e) {
        err('launchJitsi() error:', e);
        this.joinError = e.message || 'Failed to launch meeting.';
        this.loading = false;
      }
    },

    // ── Jitsi Events ────────────────────────────────────────────────────────
    onConferenceJoined(event) {
      log('videoConferenceJoined', event);
      this.loading = false;
      this.joinError = '';
      this.syncParticipantCount();
    },

    onConferenceLeft(event) {
      log('videoConferenceLeft', event);
      this.cleanupAndNavigate();
    },

    onParticipantJoined(event) {
      this.syncParticipantCount();
      if (event?.displayName) this.showToast(`${event.displayName} joined`, 'success');
    },

    onParticipantLeft() { this.syncParticipantCount(); },

    onJitsiReadyToClose() { this.cleanupAndNavigate(); },

    onJitsiError(event) {
      err('Jitsi error:', event);
      const msg = event?.error?.message || '';
      if (msg.includes('membersOnly') || msg.includes('members-only')) return;
      this.showToast('Connection issue: ' + (msg || 'Unknown error'), 'error');
    },

    onScreenShareChanged(event) {
      if (event?.on) this.showToast('Screen sharing started', 'success');
    },

    syncParticipantCount() {
      if (!this.jitsiApi) return;
      try { this.participantCount = this.jitsiApi.getNumberOfParticipants(); } catch (_) {}
    },

    // ── Leave / End ──────────────────────────────────────────────────────────
    leave() {
      if (!confirm('Leave this meeting?')) return;
      if (this.jitsiApi) { try { this.jitsiApi.executeCommand('hangup'); } catch (_) {} }
      this.cleanupAndNavigate();
    },

    endMeeting() { this.showEndModal = true; },

    async confirmEndMeeting() {
      this.ending = true;
      try {
        if (this.jitsiApi) { try { this.jitsiApi.executeCommand('hangup'); } catch (_) {} }
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
      clearInterval(this.clockInterval);
      clearInterval(this.participantInterval);
      if (this.jitsiApi) { try { this.jitsiApi.dispose(); } catch (_) {} this.jitsiApi = null; }
      MeetingSession.clearMeetingData();
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/meetings/join');
    },

    // ── Utilities ────────────────────────────────────────────────────────────
    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode)
        .then(() => this.showToast('Code copied!'))
        .catch(() => this.showToast('Copy failed', 'error'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg;
      this.toastType = type;
      this.toastVisible = true;
      setTimeout(() => { this.toastVisible = false; }, 3000);
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
    log('mounted() code:', this.code, 'query:', this.$route?.query);
    const forceCreate = this.$route?.query?.create === 'true';

    if (forceCreate) {
      MeetingSession.clearMeetingData();
      this.view = 'create';
      this.loading = false;
    } else {
      const resolvedCode = this.code || this.$route?.params?.code || MeetingSession.getMeetingCode();
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
    clearInterval(this.clockInterval);
    clearInterval(this.participantInterval);
    if (this.jitsiApi) { try { this.jitsiApi.dispose(); } catch (_) {} this.jitsiApi = null; }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

/* ── Root ─────────────────────────────────────────────────── */
.nc-shell {
  --nc-bg:       #0a0c10;
  --nc-surf:     #111318;
  --nc-surf2:    #181c24;
  --nc-surf3:    #1f2330;
  --nc-border:   rgba(255,255,255,.07);
  --nc-border2:  rgba(255,255,255,.12);
  --nc-blue:     #3b8eea;
  --nc-blue-dk:  #2464c4;
  --nc-blue-glow:rgba(59,142,234,.3);
  --nc-green:    #22c55e;
  --nc-red:      #ef4444;
  --nc-amber:    #f59e0b;
  --nc-text:     #e6eaf2;
  --nc-text2:    #8892a4;
  --nc-text3:    #525c6e;
  --nc-r:        10px;
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--nc-bg);
  color: var(--nc-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Logo ─────────────────────────────────────────────────── */
.nc-logo-mark {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, var(--nc-blue), #5b6df8);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px var(--nc-blue-glow);
  flex-shrink: 0;
}
.nc-logo-mark--sm { width: 26px; height: 26px; border-radius: 7px; }
.nc-logo-text {
  font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 18px; color: var(--nc-text);
}
.nc-logo-accent { color: var(--nc-blue); }

/* ── Topbar ───────────────────────────────────────────────── */
.nc-topbar {
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  background: var(--nc-surf);
  border-bottom: 1px solid var(--nc-border);
  position: sticky; top: 0; z-index: 50;
}
.nc-topbar-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }

/* ── Create body ──────────────────────────────────────────── */
.nc-create {
  display: flex; flex-direction: column; min-height: 100vh;
  background: var(--nc-bg);
}
.nc-create-body {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 48px 20px;
  gap: 36px;
}
.nc-create-hero { text-align: center; }
.nc-hero-badge {
  display: inline-block;
  font-family: 'Syne', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  color: var(--nc-blue);
  background: rgba(59,142,234,.12);
  border: 1px solid rgba(59,142,234,.25);
  padding: 5px 12px; border-radius: 20px;
  margin-bottom: 16px;
}
.nc-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 800; color: var(--nc-text);
  line-height: 1.1; margin-bottom: 12px;
}
.nc-hero-sub { font-size: 15px; color: var(--nc-text2); }

/* ── Create card ──────────────────────────────────────────── */
.nc-create-card {
  width: 100%; max-width: 440px;
  background: var(--nc-surf);
  border: 1px solid var(--nc-border2);
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(0,0,0,.5);
}

/* ── Form ─────────────────────────────────────────────────── */
.nc-create-form { display: flex; flex-direction: column; gap: 0; }
.nc-field-label {
  font-size: 12px; font-weight: 600; letter-spacing: .5px;
  color: var(--nc-text2); text-transform: uppercase;
  margin-bottom: 8px; display: block;
}
.nc-input-wrap {
  position: relative;
}
.nc-input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--nc-text3); pointer-events: none;
}
.nc-field-input {
  width: 100%; padding: 12px 14px 12px 40px;
  background: var(--nc-surf2);
  border: 1px solid var(--nc-border2);
  border-radius: var(--nc-r);
  color: var(--nc-text); font-family: 'DM Sans', sans-serif; font-size: 14px;
  transition: border-color .15s, box-shadow .15s;
}
.nc-field-input::placeholder { color: var(--nc-text3); }
.nc-field-input:focus {
  outline: none;
  border-color: var(--nc-blue);
  box-shadow: 0 0 0 3px rgba(59,142,234,.15);
}
.nc-field-hint { font-size: 11px; color: var(--nc-text3); margin-top: 6px; margin-bottom: 16px; }

/* Toggle */
.nc-form-meta { margin-bottom: 24px; }
.nc-toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.nc-toggle-input { display: none; }
.nc-toggle-track {
  width: 38px; height: 21px;
  background: var(--nc-surf3); border-radius: 12px;
  border: 1px solid var(--nc-border2);
  position: relative; transition: background .2s;
  flex-shrink: 0;
}
.nc-toggle-thumb {
  width: 15px; height: 15px;
  background: var(--nc-text3); border-radius: 50%;
  position: absolute; top: 2px; left: 2px;
  transition: transform .2s, background .2s;
}
.nc-toggle-input:checked ~ .nc-toggle-track { background: var(--nc-blue); border-color: var(--nc-blue); }
.nc-toggle-input:checked ~ .nc-toggle-track .nc-toggle-thumb { transform: translateX(17px); background: #fff; }
.nc-toggle-label { font-size: 13px; font-weight: 500; color: var(--nc-text2); }

/* Buttons */
.nc-primary-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 24px;
  background: var(--nc-blue); color: #fff;
  border: none; border-radius: var(--nc-r);
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background .15s, transform .15s, box-shadow .15s;
  box-shadow: 0 4px 16px var(--nc-blue-glow);
}
.nc-primary-btn:hover:not(:disabled) { background: var(--nc-blue-dk); transform: translateY(-1px); box-shadow: 0 6px 20px var(--nc-blue-glow); }
.nc-primary-btn:disabled { opacity: .5; cursor: not-allowed; }
.nc-primary-btn--full { width: 100%; }

.nc-ghost-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px;
  background: transparent;
  border: 1px solid var(--nc-border2);
  border-radius: var(--nc-r);
  color: var(--nc-text2); font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all .15s;
}
.nc-ghost-btn:hover { border-color: var(--nc-blue); color: var(--nc-text); background: rgba(59,142,234,.06); }
.nc-ghost-btn--sm { padding: 7px 14px; font-size: 12px; }

.nc-danger-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px;
  background: var(--nc-red); color: #fff;
  border: none; border-radius: var(--nc-r);
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all .15s;
  box-shadow: 0 4px 16px rgba(239,68,68,.3);
}
.nc-danger-btn:hover:not(:disabled) { background: #dc2626; }
.nc-danger-btn:disabled { opacity: .55; cursor: not-allowed; }

/* Error bar */
.nc-error-bar {
  display: flex; align-items: center; gap: 8px;
  margin-top: 14px; padding: 11px 14px;
  background: rgba(239,68,68,.08);
  border: 1px solid rgba(239,68,68,.2);
  border-radius: var(--nc-r);
  font-size: 13px; color: #f87171;
}

/* Spinner */
.nc-btn-spinner {
  display: inline-block; width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: nc-spin .6s linear infinite;
}
@keyframes nc-spin { to { transform: rotate(360deg); } }

/* ── Created state ────────────────────────────────────────── */
.nc-created-state { display: flex; flex-direction: column; gap: 20px; }
.nc-created-icon {
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25);
  display: flex; align-items: center; justify-content: center; color: var(--nc-green);
}
.nc-created-label { font-size: 11px; font-weight: 600; letter-spacing: .8px; color: var(--nc-text2); text-transform: uppercase; margin-bottom: 6px; }
.nc-created-code-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.nc-code-display {
  font-family: 'DM Mono', 'Courier New', monospace;
  font-size: 17px; font-weight: 600; color: var(--nc-green);
  background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.2);
  padding: 6px 14px; border-radius: 8px; letter-spacing: 1px;
}
.nc-copy-btn {
  width: 32px; height: 32px;
  background: var(--nc-surf2); border: 1px solid var(--nc-border2);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  color: var(--nc-text2); cursor: pointer; transition: all .15s;
}
.nc-copy-btn:hover { border-color: var(--nc-blue); color: var(--nc-blue); }
.nc-created-hint { font-size: 12px; color: var(--nc-text3); }
.nc-created-actions { display: flex; flex-direction: column; gap: 8px; }

/* ── Meeting layout ───────────────────────────────────────── */
.nc-meeting {
  display: flex; flex-direction: column;
  position: fixed; inset: 0; z-index: 9999;
  background: #050608;
  overflow: hidden;
}

/* ── Meeting bar ──────────────────────────────────────────── */
.nc-meeting-bar {
  height: 56px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 18px;
  background: rgba(10,12,16,.95);
  border-bottom: 1px solid var(--nc-border);
  backdrop-filter: blur(12px);
  z-index: 100;
}
.nc-bar-left, .nc-bar-right { display: flex; align-items: center; gap: 10px; flex: 1; }
.nc-bar-right { justify-content: flex-end; }
.nc-bar-center { display: flex; align-items: center; gap: 14px; }
.nc-bar-brand { display: flex; align-items: center; gap: 8px; }
.nc-bar-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--nc-text); }
.nc-bar-divider { width: 1px; height: 18px; background: var(--nc-border2); }

.nc-code-tag {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 11px;
  background: var(--nc-surf); border: 1px solid var(--nc-border2);
  border-radius: 7px;
  font-family: 'DM Mono', 'Courier New', monospace; font-size: 11px; font-weight: 600;
  color: #8ab4f8; cursor: pointer; transition: all .15s; letter-spacing: .5px;
}
.nc-code-tag:hover { border-color: var(--nc-blue); background: rgba(59,142,234,.08); }

.nc-live-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 20px;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
  font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #f87171;
}
.nc-live-dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--nc-red);
  animation: nc-pulse 2s ease-in-out infinite;
}
@keyframes nc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }

.nc-host-chip {
  padding: 3px 9px; border-radius: 20px;
  background: rgba(59,142,234,.12); border: 1px solid rgba(59,142,234,.3);
  font-size: 9px; font-weight: 800; letter-spacing: 1px; color: var(--nc-blue);
}
.nc-pcount {
  display: flex; align-items: center; gap: 5px;
  font-size: 13px; color: var(--nc-text2); font-weight: 500;
}
.nc-clock { font-size: 13px; color: var(--nc-text2); font-weight: 500; min-width: 40px; text-align: center; }

.nc-bar-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
  cursor: pointer; border: 1px solid; transition: all .15s;
}
.nc-bar-btn--warn {
  background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.3); color: #fbbf24;
}
.nc-bar-btn--warn:hover { background: rgba(245,158,11,.15); }
.nc-bar-btn--leave {
  background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.3); color: #f87171;
}
.nc-bar-btn--leave:hover { background: var(--nc-red); color: #fff; border-color: var(--nc-red); }

/* ── Frame ────────────────────────────────────────────────── */
.nc-frame-wrap { flex: 1; position: relative; background: #050608; overflow: hidden; }
.nc-jitsi-frame { width: 100%; height: 100%; }
.nc-jitsi-frame iframe { width: 100% !important; height: 100% !important; border: none !important; }

/* ── Loading overlay ──────────────────────────────────────── */
.nc-loading-overlay {
  position: absolute; inset: 0; z-index: 10;
  background: rgba(5,6,8,.96);
  display: flex; align-items: center; justify-content: center;
}
.nc-loader-card {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  padding: 48px 40px;
  background: var(--nc-surf); border: 1px solid var(--nc-border2);
  border-radius: 20px; min-width: 280px;
  box-shadow: 0 40px 80px rgba(0,0,0,.6);
}
.nc-loader-ring {
  width: 72px; height: 72px; border-radius: 50%;
  border: 2px solid rgba(59,142,234,.15); border-top-color: var(--nc-blue);
  animation: nc-spin .9s linear infinite;
  position: relative; display: flex; align-items: center; justify-content: center;
}
.nc-loader-logo {
  position: absolute;
}
.nc-loader-status { font-size: 14px; color: var(--nc-text2); font-weight: 500; }
.nc-loader-steps { display: flex; gap: 6px; }
.nc-step {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--nc-surf3); border: 1px solid var(--nc-border2);
  transition: background .3s;
}
.nc-step--done { background: var(--nc-blue); border-color: var(--nc-blue); }

/* ── Error overlay ────────────────────────────────────────── */
.nc-error-overlay {
  position: absolute; inset: 0; z-index: 10;
  background: rgba(5,6,8,.96);
  display: flex; align-items: center; justify-content: center;
}
.nc-error-card {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  padding: 48px 40px; text-align: center;
  background: var(--nc-surf); border: 1px solid rgba(239,68,68,.2);
  border-radius: 20px; max-width: 360px;
  box-shadow: 0 40px 80px rgba(0,0,0,.6);
}
.nc-error-icon-wrap {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
  display: flex; align-items: center; justify-content: center; color: #f87171;
}
.nc-error-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--nc-text); }
.nc-error-msg { font-size: 14px; color: var(--nc-text2); line-height: 1.6; }

/* ── Modal ────────────────────────────────────────────────── */
.nc-modal-overlay {
  position: fixed; inset: 0; z-index: 20000;
  background: rgba(0,0,0,.75); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.nc-modal {
  background: var(--nc-surf); border: 1px solid var(--nc-border2);
  border-radius: 20px; padding: 40px 36px 32px;
  max-width: 420px; width: 100%; text-align: center;
  box-shadow: 0 40px 100px rgba(0,0,0,.7);
}
.nc-modal-icon {
  width: 60px; height: 60px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
}
.nc-modal-icon--danger { background: rgba(239,68,68,.12); border: 1.5px solid rgba(239,68,68,.3); color: #f87171; }
.nc-modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--nc-text); margin-bottom: 10px; }
.nc-modal-body { font-size: 14px; color: var(--nc-text2); line-height: 1.65; margin-bottom: 28px; }
.nc-modal-actions { display: flex; gap: 10px; justify-content: center; }

/* ── Toast ────────────────────────────────────────────────── */
.nc-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 30000;
  display: flex; align-items: center; gap: 8px;
  padding: 11px 18px; border-radius: 12px;
  font-size: 13px; font-weight: 600;
  box-shadow: 0 8px 32px rgba(0,0,0,.4);
  pointer-events: none;
}
.nc-toast--success { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #4ade80; }
.nc-toast--error   { background: rgba(239,68,68,.1);  border: 1px solid rgba(239,68,68,.25);  color: #f87171; }

/* ── Transitions ──────────────────────────────────────────── */
.nc-fade-enter-active, .nc-fade-leave-active { transition: opacity .3s; }
.nc-fade-enter-from, .nc-fade-leave-to { opacity: 0; }
.nc-modal-pop-enter-active { animation: nc-pop-in .22s cubic-bezier(.34,1.56,.64,1); }
.nc-modal-pop-leave-active { animation: nc-pop-in .15s reverse ease-in; }
@keyframes nc-pop-in { from { opacity:0; transform: scale(.92); } to { opacity:1; transform: scale(1); } }
.nc-toast-pop-enter-active, .nc-toast-pop-leave-active { transition: opacity .2s, transform .2s; }
.nc-toast-pop-enter-from { opacity:0; transform: translateY(12px); }
.nc-toast-pop-leave-to { opacity:0; transform: translateY(12px); }
</style>