<template>
  <div class="nm-shell">

    <!-- ═══════════════════ CREATE VIEW ═══════════════════ -->
    <div v-if="view === 'create'" class="nm-create">
      <header class="nm-topbar">
        <div class="nm-brand" @click="goToDashboard">
          <div class="nm-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="nm-brand-name">Nova<span class="nm-brand-accent">Meet</span></span>
        </div>
        <button class="nm-back-btn" @click="goToDashboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>
      </header>

      <div class="nm-create-body">
        <div class="nm-create-left">
          <div class="nm-hero-eyebrow">START A MEETING</div>
          <h1 class="nm-hero-title">Create your<br>conference room</h1>
          <p class="nm-hero-desc">Set up a secure video meeting and invite your team to collaborate in real time.</p>
          <div class="nm-hero-features">
            <div class="nm-feat">
              <div class="nm-feat-dot"></div>
              HD video & crystal-clear audio
            </div>
            <div class="nm-feat">
              <div class="nm-feat-dot"></div>
              Screen sharing & collaboration
            </div>
            <div class="nm-feat">
              <div class="nm-feat-dot"></div>
              Secure JWT-authenticated rooms
            </div>
          </div>
        </div>

        <div class="nm-create-right">
          <div class="nm-card">
            <div class="nm-card-header">
              <div class="nm-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
              </div>
              <div>
                <div class="nm-card-title">New Meeting</div>
                <div class="nm-card-sub">Configure your room settings</div>
              </div>
            </div>

            <!-- Success state -->
            <div v-if="created.code" class="nm-success">
              <div class="nm-success-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div class="nm-success-label">Room created successfully</div>
              <div class="nm-code-block">
                <div class="nm-code-label">Meeting code</div>
                <div class="nm-code-row">
                  <code class="nm-code">{{ created.code }}</code>
                  <button class="nm-copy-btn" @click="copyCreatedCode">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy
                  </button>
                </div>
                <p class="nm-code-hint">Share this code with your participants</p>
              </div>
              <div class="nm-success-actions">
                <button class="nm-btn-primary" @click="enterMeeting">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Launch Meeting
                </button>
                <button class="nm-btn-ghost" @click="goToDashboard">Cancel</button>
              </div>
            </div>

            <!-- Form state -->
            <div v-if="!created.code" class="nm-form">
              <div class="nm-field">
                <label class="nm-label">Room Name</label>
                <div class="nm-input-wrap">
                  <svg class="nm-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
                  <input class="nm-input" v-model="form.roomName" type="text" placeholder="e.g. engineering-standup" autocomplete="off" spellcheck="false" @keyup.enter="createMeeting" />
                </div>
                <p class="nm-hint">Lowercase letters, numbers and hyphens only</p>
              </div>

              <label class="nm-toggle-row">
                <input type="checkbox" v-model="form.isPrivate" class="nm-toggle-cb"/>
                <div class="nm-toggle">
                  <div class="nm-toggle-knob"></div>
                </div>
                <div class="nm-toggle-text">
                  <span class="nm-toggle-label">Private meeting</span>
                  <span class="nm-toggle-desc">Only invited participants can join</span>
                </div>
              </label>

              <button class="nm-btn-primary nm-btn-full" @click="createMeeting" :disabled="creating">
                <span v-if="creating" class="nm-spinner"></span>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ creating ? 'Creating…' : 'Create Meeting' }}
              </button>

              <div v-if="createError" class="nm-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ createError }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════ MEETING VIEW ═══════════════════ -->
    <div v-if="view === 'meeting'" class="nm-meeting">

      <!-- Meeting topbar -->
      <header class="nm-meeting-bar">
        <div class="nm-bar-left">
          <div class="nm-bar-brand">
            <div class="nm-logo nm-logo--sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="nm-bar-name">NovaMeet</span>
          </div>
          <div class="nm-bar-sep"></div>
          <button class="nm-code-chip" @click="copyMeetingCode" title="Copy code">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            {{ meetingCode }}
          </button>
          <div class="nm-live-badge">
            <span class="nm-live-pulse"></span>
            LIVE
          </div>
          <span v-if="isHost" class="nm-host-badge">HOST</span>
        </div>

        <div class="nm-bar-center">
          <div class="nm-participants">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            {{ participantCount }}
          </div>
          <span class="nm-clock">{{ currentTime }}</span>
        </div>

        <div class="nm-bar-right">
          <button v-if="isHost" class="nm-bar-btn nm-bar-btn--end" @click="endMeeting">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            End for all
          </button>
          <button class="nm-bar-btn nm-bar-btn--leave" @click="leave">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Leave
          </button>
        </div>
      </header>

      <!-- Jitsi frame -->
      <div class="nm-frame-wrap">
        <transition name="nm-fade">
          <div v-if="loading" class="nm-loading">
            <div class="nm-loader-card">
              <div class="nm-loader-ring">
                <div class="nm-loader-inner"></div>
              </div>
              <div class="nm-loader-logo">
                <div class="nm-logo">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <p class="nm-loader-text">{{ loadingStatus }}</p>
              <div class="nm-loader-dots">
                <span :class="['nm-dot', loadingStep >= 1 ? 'nm-dot--on' : '']"></span>
                <span :class="['nm-dot', loadingStep >= 2 ? 'nm-dot--on' : '']"></span>
                <span :class="['nm-dot', loadingStep >= 3 ? 'nm-dot--on' : '']"></span>
                <span :class="['nm-dot', loadingStep >= 4 ? 'nm-dot--on' : '']"></span>
              </div>
            </div>
          </div>
        </transition>

        <div v-if="joinError && !loading" class="nm-error-overlay">
          <div class="nm-error-card">
            <div class="nm-error-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 class="nm-error-title">Connection failed</h3>
            <p class="nm-error-msg">{{ joinError }}</p>
            <button class="nm-btn-primary" @click="initMeeting">Retry</button>
          </div>
        </div>

        <div id="nc-jitsi" ref="jitsiContainer" class="nm-jitsi"></div>
      </div>

      <!-- End meeting modal -->
      <transition name="nm-modal">
        <div v-if="showEndModal" class="nm-modal-overlay" @click.self="showEndModal = false">
          <div class="nm-modal">
            <div class="nm-modal-icon nm-modal-icon--red">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            </div>
            <h2 class="nm-modal-title">End meeting for everyone?</h2>
            <p class="nm-modal-body">All participants will be disconnected and the room will be removed.</p>
            <div class="nm-modal-actions">
              <button class="nm-btn-ghost" @click="showEndModal = false">Cancel</button>
              <button class="nm-btn-danger" @click="confirmEndMeeting" :disabled="ending">
                <span v-if="ending" class="nm-spinner"></span>
                End for everyone
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Toast -->
    <transition name="nm-toast">
      <div v-if="toastVisible" class="nm-toast" :class="'nm-toast--' + toastType">
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

    async initMeeting() {
      log('════ initMeeting() ════');
      if (!this.meetingCode) {
        this.meetingCode = this.code || this.$route?.params?.code || MeetingSession.getMeetingCode();
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
        if (tokenData?.domain) this.jitsiDomain = tokenData.domain;
        if (tokenData?.appId) this.jitsiAppId = tokenData.appId;
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

    loadJaaSSDK() {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) { resolve(); return; }
        const s = document.createElement('script');
        s.src = `https://8x8.vc/${this.jitsiAppId}/external_api.js`;
        s.onload = () => { log('JaaS SDK loaded ✅'); resolve(); };
        s.onerror = () => reject(new Error('Failed to load JaaS SDK'));
        document.head.appendChild(s);
      });
    },

    launchJitsi(token = null) {
      try {
        if (this.jitsiApi) { try { this.jitsiApi.dispose(); } catch (_) {} this.jitsiApi = null; }
        const container = this.$refs.jitsiContainer;
        if (!container) throw new Error('Jitsi container not found.');
        const roomName = `${this.jitsiAppId}/${this.meetingCode}`;
        const options = {
          roomName, width: '100%', height: '100%', parentNode: container, jwt: token,
          userInfo: { displayName: this.userName },
          configOverwrite: {
            prejoinPageEnabled: false, prejoinConfig: { enabled: false },
            enableInsecureRoomNameWarning: false, requireDisplayName: false,
            enableLobbyChat: false, startWithAudioMuted: false, startWithVideoMuted: false,
            disableDeepLinking: true, disableInviteFunctions: true, doNotStoreRoom: true,
            notifications: [], disableNotifications: true, enableUserRolesBasedOnToken: true,
            desktopSharingChromeExtId: null, desktopSharingChromeDisabled: false,
            desktopSharingFirefoxDisabled: false,
            toolbarButtons: ['microphone','camera','desktop','chat','raisehand','participants-pane','tileview','fullscreen','settings','hangup'],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false, SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false, SHOW_CHROME_EXTENSION_BANNER: false,
            HIDE_INVITE_MORE_HEADER: true, DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            MOBILE_APP_PROMO: false,
            TOOLBAR_BUTTONS: ['microphone','camera','desktop','chat','raisehand','participants-pane','tileview','fullscreen','settings','hangup'],
          },
        };
        log('launchJitsi() creating JitsiMeetExternalAPI | room:', roomName);
        this.jitsiApi = new window.JitsiMeetExternalAPI(this.jitsiDomain, options);
        this.jitsiApi.addEventListeners({
          readyToClose: this.onJitsiReadyToClose,
          participantJoined: this.onParticipantJoined,
          participantLeft: this.onParticipantLeft,
          videoConferenceJoined: this.onConferenceJoined,
          videoConferenceLeft: this.onConferenceLeft,
          errorOccurred: this.onJitsiError,
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

    onConferenceJoined(event) { log('videoConferenceJoined', event); this.loading = false; this.joinError = ''; this.syncParticipantCount(); },
    onConferenceLeft(event) { log('videoConferenceLeft', event); this.cleanupAndNavigate(); },
    onParticipantJoined(event) { this.syncParticipantCount(); if (event?.displayName) this.showToast(`${event.displayName} joined`, 'success'); },
    onParticipantLeft() { this.syncParticipantCount(); },
    onJitsiReadyToClose() { this.cleanupAndNavigate(); },
    onJitsiError(event) {
      err('Jitsi error:', event);
      const msg = event?.error?.message || '';
      if (msg.includes('membersOnly') || msg.includes('members-only')) return;
      this.showToast('Connection issue: ' + (msg || 'Unknown error'), 'error');
    },
    onScreenShareChanged(event) { if (event?.on) this.showToast('Screen sharing started', 'success'); },
    syncParticipantCount() { if (!this.jitsiApi) return; try { this.participantCount = this.jitsiApi.getNumberOfParticipants(); } catch (_) {} },

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

    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode).then(() => this.showToast('Code copied!')).catch(() => this.showToast('Copy failed', 'error'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg; this.toastType = type; this.toastVisible = true;
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
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

.nm-shell {
  --blue:      #4a90e2;
  --blue-dk:   #2c6fbd;
  --blue-soft: #e8f2fc;
  --blue-mid:  #c9dff5;
  --blue-glow: rgba(74,144,226,0.18);
  --ink:       #0d1b36;
  --ink-s:     #2d3748;
  --ink-m:     #64748b;
  --white:     #ffffff;
  --border:    #e2ecf6;
  --bg:        #f8fafc;
  --green:     #10b981;
  --red:       #ef4444;
  --orange:    #f59e0b;
  --font:      'Manrope', sans-serif;
  --fdisp:     'Space Grotesk', sans-serif;
  --r:         10px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.1);

  font-family: var(--font);
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Logo ─────────────────────────── */
.nm-logo {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg, var(--blue), #6366f1);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px var(--blue-glow); flex-shrink: 0;
}
.nm-logo--sm { width: 28px; height: 28px; border-radius: 7px; }
.nm-brand-name { font-family: var(--fdisp); font-size: 18px; font-weight: 700; color: var(--ink); }
.nm-brand-accent { color: var(--blue); }

/* ── Create ───────────────────────── */
.nm-create { display: flex; flex-direction: column; min-height: 100vh; background: var(--bg); }

.nm-topbar {
  height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 50;
  box-shadow: var(--shadow-sm);
}
.nm-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.nm-back-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  color: var(--ink-m); font-family: var(--font); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all .15s;
}
.nm-back-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }

.nm-create-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 32px;
  gap: 80px;
  align-items: center;
  width: 100%;
}

.nm-hero-eyebrow {
  font-family: var(--fdisp); font-size: 11px; font-weight: 700;
  letter-spacing: 2px; color: var(--blue);
  background: var(--blue-soft); border: 1px solid var(--blue-mid);
  display: inline-block; padding: 5px 12px; border-radius: 20px;
  margin-bottom: 20px;
}
.nm-hero-title {
  font-family: var(--fdisp); font-size: clamp(32px, 4vw, 48px);
  font-weight: 700; color: var(--ink); line-height: 1.12; margin-bottom: 16px;
}
.nm-hero-desc { font-size: 16px; color: var(--ink-m); line-height: 1.7; margin-bottom: 32px; }
.nm-hero-features { display: flex; flex-direction: column; gap: 12px; }
.nm-feat { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink-s); font-weight: 500; }
.nm-feat-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }

/* Card */
.nm-card {
  background: var(--white); border: 1px solid var(--border); border-radius: 16px;
  padding: 32px; box-shadow: var(--shadow-lg);
}
.nm-card-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
.nm-card-icon {
  width: 44px; height: 44px; border-radius: 10px;
  background: var(--blue-soft); border: 1px solid var(--blue-mid);
  display: flex; align-items: center; justify-content: center; color: var(--blue); flex-shrink: 0;
}
.nm-card-title { font-family: var(--fdisp); font-size: 17px; font-weight: 700; color: var(--ink); }
.nm-card-sub { font-size: 12px; color: var(--ink-m); margin-top: 2px; }

/* Form */
.nm-form { display: flex; flex-direction: column; gap: 20px; }
.nm-field { display: flex; flex-direction: column; gap: 0; }
.nm-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--ink-m); margin-bottom: 8px; }
.nm-input-wrap { position: relative; }
.nm-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-m); pointer-events: none; }
.nm-input {
  width: 100%; padding: 12px 12px 12px 38px;
  background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--r);
  color: var(--ink); font-family: var(--font); font-size: 14px; font-weight: 500;
  transition: all .15s;
}
.nm-input::placeholder { color: #a0aec0; font-weight: 400; }
.nm-input:focus { outline: none; border-color: var(--blue); background: var(--white); box-shadow: 0 0 0 3px var(--blue-glow); }
.nm-hint { font-size: 11px; color: #a0aec0; margin-top: 6px; }

/* Toggle */
.nm-toggle-row { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.nm-toggle-cb { display: none; }
.nm-toggle {
  width: 40px; height: 22px; border-radius: 11px;
  background: var(--border); border: 1.5px solid #cbd5e0;
  position: relative; flex-shrink: 0; transition: all .2s;
}
.nm-toggle-knob {
  width: 16px; height: 16px; border-radius: 50%; background: var(--white);
  position: absolute; top: 1px; left: 1px;
  transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.15);
}
.nm-toggle-cb:checked ~ .nm-toggle { background: var(--blue); border-color: var(--blue); }
.nm-toggle-cb:checked ~ .nm-toggle .nm-toggle-knob { transform: translateX(18px); }
.nm-toggle-label { font-size: 14px; font-weight: 600; color: var(--ink-s); }
.nm-toggle-desc { font-size: 12px; color: var(--ink-m); margin-top: 1px; }

/* Buttons */
.nm-btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 24px;
  background: var(--blue); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all .15s;
  box-shadow: 0 4px 14px var(--blue-glow);
}
.nm-btn-primary:hover:not(:disabled) { background: var(--blue-dk); transform: translateY(-1px); box-shadow: 0 6px 20px var(--blue-glow); }
.nm-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.nm-btn-full { width: 100%; }

.nm-btn-ghost {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 18px;
  background: transparent; border: 1.5px solid var(--border); border-radius: var(--r);
  color: var(--ink-m); font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.nm-btn-ghost:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }

.nm-btn-danger {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px;
  background: var(--red); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.nm-btn-danger:hover:not(:disabled) { background: #dc2626; }
.nm-btn-danger:disabled { opacity: .55; cursor: not-allowed; }

/* Error */
.nm-error {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px;
  background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--r);
  font-size: 13px; color: #dc2626;
}

/* Spinner */
.nm-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: nm-spin .6s linear infinite;
}
@keyframes nm-spin { to { transform: rotate(360deg); } }

/* Success */
.nm-success { display: flex; flex-direction: column; gap: 20px; }
.nm-success-check {
  width: 52px; height: 52px; border-radius: 50%;
  background: #ecfdf5; border: 1px solid #6ee7b7;
  display: flex; align-items: center; justify-content: center; color: var(--green);
}
.nm-success-label { font-family: var(--fdisp); font-size: 16px; font-weight: 700; color: var(--ink); }
.nm-code-block { background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--r); padding: 16px; }
.nm-code-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--ink-m); margin-bottom: 8px; }
.nm-code-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.nm-code {
  font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: var(--blue);
  background: var(--blue-soft); border: 1px solid var(--blue-mid);
  padding: 6px 14px; border-radius: 7px; letter-spacing: 1px;
}
.nm-copy-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 12px; background: var(--white); border: 1.5px solid var(--border);
  border-radius: 7px; color: var(--ink-m); font-family: var(--font); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.nm-copy-btn:hover { border-color: var(--blue); color: var(--blue); }
.nm-code-hint { font-size: 12px; color: var(--ink-m); }
.nm-success-actions { display: flex; flex-direction: column; gap: 8px; }

/* ── Meeting View ─────────────────── */
.nm-meeting {
  display: flex; flex-direction: column;
  position: fixed; inset: 0; z-index: 9999;
  background: #1a1a2e;
}

.nm-meeting-bar {
  height: 56px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  z-index: 100;
}
.nm-bar-left, .nm-bar-right { display: flex; align-items: center; gap: 10px; flex: 1; }
.nm-bar-right { justify-content: flex-end; }
.nm-bar-center { display: flex; align-items: center; gap: 14px; }
.nm-bar-brand { display: flex; align-items: center; gap: 8px; }
.nm-bar-name { font-family: var(--fdisp); font-size: 14px; font-weight: 700; color: var(--ink); }
.nm-bar-sep { width: 1px; height: 18px; background: var(--border); }

.nm-code-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 11px;
  background: var(--blue-soft); border: 1.5px solid var(--blue-mid); border-radius: 7px;
  font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700;
  color: var(--blue); cursor: pointer; transition: all .15s;
}
.nm-code-chip:hover { background: var(--blue-mid); }

.nm-live-badge {
  display: flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 20px;
  background: #fef2f2; border: 1px solid #fecaca;
  font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #dc2626;
}
.nm-live-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: nm-blink 2s ease-in-out infinite; }
@keyframes nm-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.nm-host-badge {
  padding: 4px 10px; border-radius: 20px;
  background: var(--blue-soft); border: 1px solid var(--blue-mid);
  font-size: 9px; font-weight: 800; letter-spacing: 1px; color: var(--blue);
}
.nm-participants { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--ink-m); font-weight: 600; }
.nm-clock { font-size: 13px; color: var(--ink-m); font-weight: 600; }

.nm-bar-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  font-family: var(--font); font-size: 12px; font-weight: 700;
  cursor: pointer; border: 1.5px solid; transition: all .15s;
}
.nm-bar-btn--end { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.nm-bar-btn--end:hover { background: var(--orange); color: var(--white); border-color: var(--orange); }
.nm-bar-btn--leave { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.nm-bar-btn--leave:hover { background: var(--red); color: var(--white); border-color: var(--red); }

/* Frame */
.nm-frame-wrap { flex: 1; position: relative; background: #1a1a2e; overflow: hidden; }
.nm-jitsi { width: 100%; height: 100%; }
.nm-jitsi iframe { width: 100% !important; height: 100% !important; border: none !important; }

/* Loading */
.nm-loading { position: absolute; inset: 0; z-index: 10; background: rgba(248,250,252,.97); display: flex; align-items: center; justify-content: center; }
.nm-loader-card {
  display: flex; flex-direction: column; align-items: center; gap: 18px;
  padding: 48px 40px; background: var(--white); border: 1px solid var(--border);
  border-radius: 20px; min-width: 280px; box-shadow: var(--shadow-lg);
}
.nm-loader-ring {
  width: 68px; height: 68px; border-radius: 50%;
  border: 3px solid var(--blue-mid); border-top-color: var(--blue);
  animation: nm-spin .9s linear infinite;
  position: relative; display: flex; align-items: center; justify-content: center;
}
.nm-loader-inner { position: absolute; }
.nm-loader-logo { position: absolute; }
.nm-loader-text { font-size: 14px; color: var(--ink-m); font-weight: 500; }
.nm-loader-dots { display: flex; gap: 6px; }
.nm-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); transition: background .3s; }
.nm-dot--on { background: var(--blue); }

/* Error overlay */
.nm-error-overlay { position: absolute; inset: 0; z-index: 10; background: rgba(248,250,252,.97); display: flex; align-items: center; justify-content: center; }
.nm-error-card {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  padding: 48px 40px; text-align: center; background: var(--white);
  border: 1px solid #fecaca; border-radius: 20px; max-width: 360px; box-shadow: var(--shadow-lg);
}
.nm-error-icon { width: 60px; height: 60px; border-radius: 50%; background: #fef2f2; border: 1px solid #fecaca; display: flex; align-items: center; justify-content: center; color: #dc2626; }
.nm-error-title { font-family: var(--fdisp); font-size: 20px; font-weight: 700; color: var(--ink); }
.nm-error-msg { font-size: 14px; color: var(--ink-m); line-height: 1.6; }

/* Modal */
.nm-modal-overlay {
  position: fixed; inset: 0; z-index: 20000;
  background: rgba(13,27,54,.5); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.nm-modal {
  background: var(--white); border: 1px solid var(--border); border-radius: 20px;
  padding: 40px 36px 32px; max-width: 420px; width: 100%; text-align: center;
  box-shadow: var(--shadow-lg);
}
.nm-modal-icon {
  width: 60px; height: 60px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
}
.nm-modal-icon--red { background: #fef2f2; border: 1.5px solid #fecaca; color: #dc2626; }
.nm-modal-title { font-family: var(--fdisp); font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.nm-modal-body { font-size: 14px; color: var(--ink-m); line-height: 1.65; margin-bottom: 28px; }
.nm-modal-actions { display: flex; gap: 10px; justify-content: center; }

/* Toast */
.nm-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 30000;
  display: flex; align-items: center; gap: 8px;
  padding: 11px 18px; border-radius: 10px;
  font-size: 13px; font-weight: 700;
  box-shadow: var(--shadow-lg); pointer-events: none;
}
.nm-toast--success { background: var(--white); border: 1.5px solid #6ee7b7; color: #065f46; }
.nm-toast--error { background: var(--white); border: 1.5px solid #fca5a5; color: #7f1d1d; }

/* Transitions */
.nm-fade-enter-active, .nm-fade-leave-active { transition: opacity .3s; }
.nm-fade-enter-from, .nm-fade-leave-to { opacity: 0; }
.nm-modal-enter-active { animation: nm-pop .22s cubic-bezier(.34,1.56,.64,1); }
.nm-modal-leave-active { animation: nm-pop .15s reverse ease-in; }
@keyframes nm-pop { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
.nm-toast-enter-active, .nm-toast-leave-active { transition: opacity .2s, transform .2s; }
.nm-toast-enter-from { opacity:0; transform:translateY(12px); }
.nm-toast-leave-to { opacity:0; }

@media (max-width: 768px) {
  .nm-create-body { grid-template-columns: 1fr; padding: 32px 20px; gap: 40px; }
  .nm-create-left { display: none; }
}
</style>