<!-- JoinMeeting.vue — Jitsi aligned -->
<template>
  <div class="nv-root">
    <div class="nv-create-wrap">
      <nav class="nv-cnav">
        <div class="nv-cbrand" @click="goHome">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1a73e8"/>
            <path d="M20 16L26 11V21L20 16Z" fill="white"/>
            <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
          </svg>
          <span>Nova</span>
        </div>
        <button v-if="isLoggedIn" class="nv-cnav-back" @click="$router.push('/dashboard')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Dashboard
        </button>
        <button v-else class="nv-cnav-back" @click="$router.push('/auth')">Sign in</button>
      </nav>

      <main class="nv-cmain">
        <div class="nv-chead">
          <h1 class="nv-ctitle">Join a meeting</h1>
          <p class="nv-csub">Enter a room code to connect instantly.</p>
        </div>

        <div class="nv-card">
          <div v-if="isLoggedIn && userData" class="nv-success-banner">
            <div class="nv-success-check nv-success-check--green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <div class="nv-success-title">Signed in</div>
              <div class="nv-success-sub">Joining as <strong>{{ userData.name || userData.email }}</strong></div>
            </div>
          </div>

          <div class="nv-section-label">Meeting code</div>
          <div class="nv-field">
            <label class="nv-flabel">Enter code <span class="nv-req">*</span></label>
            <input
              class="nv-finput nv-finput--mono"
              type="text"
              v-model="meetingCode"
              @input="onCodeInput"
              @keypress.enter="joinMeeting"
              placeholder="e.g. weekly-standup"
              autocomplete="off"
              spellcheck="false"
            />
            <div v-if="roomInfo" class="nv-room-found">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Room found: <strong>{{ roomInfo.name }}</strong>
            </div>
            <div v-if="codeError" class="nv-code-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ codeError }}
            </div>
          </div>

          <!-- Guest name (only when not logged in) -->
          <template v-if="!isLoggedIn">
            <div class="nv-section-label" style="margin-top:24px">Your name</div>
            <div class="nv-field">
              <label class="nv-flabel">Display name <span class="nv-req">*</span></label>
              <input class="nv-finput" type="text" v-model="guestName" @keypress.enter="joinMeeting" placeholder="e.g. Alice Johnson" autocomplete="name" />
            </div>
          </template>

          <button class="nv-btn-primary" @click="joinMeeting" :disabled="loading">
            <span v-if="loading" class="nv-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {{ loading ? 'Joining…' : 'Join meeting' }}
          </button>

          <div class="nv-postcreate">
            <button v-if="isLoggedIn" class="nv-btn-ghost" @click="$router.push({ path: '/meeting', query: { create: 'true' } })">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create a meeting instead
            </button>
          </div>

          <transition name="nv-alert-fx">
            <div v-if="error" class="nv-alert-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error }}
            </div>
          </transition>
        </div>

        <p class="nv-footer-hint">
          By joining you agree to our <a href="#" class="nv-link">Terms</a> and <a href="#" class="nv-link">Privacy Policy</a>.
        </p>
      </main>
    </div>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';
import { MeetingSession } from '@/utils/meetingSession';

export default {
  name: 'JoinMeeting',

  data() {
    return {
      meetingCode:   '',
      guestName:     '',
      loading:       false,
      error:         null,
      userData:      null,
      roomInfo:      null,
      codeError:     null,
      validateTimer: null,
    };
  },

  computed: {
    isLoggedIn() { return TokenService.isAuthenticated(); },
  },

  methods: {
    goHome() { this.$router.push(this.isLoggedIn ? '/dashboard' : '/auth'); },

    onCodeInput() {
      this.roomInfo  = null;
      this.codeError = null;
      const code = this.meetingCode.trim();
      if (!code || code.length < 3) return;

      clearTimeout(this.validateTimer);
      this.validateTimer = setTimeout(async () => {
        const result = await MeetingSession.validateMeetingCode(code);
        if (result.valid) {
          this.roomInfo  = result.meeting;
          this.codeError = null;
        } else if (this.meetingCode.trim() === code) {
          this.codeError = result.message || 'Room not found.';
          this.roomInfo  = null;
        }
      }, 600);
    },

    async joinMeeting() {
      this.error = null;
      const code = this.meetingCode.trim();
      if (!code) { this.error = 'Please enter a meeting code.'; return; }

      if (!this.isLoggedIn && !this.guestName.trim()) {
        this.error = 'Please enter your display name.';
        return;
      }

      this.loading = true;
      try {
        if (this.isLoggedIn) {
          await this.joinAsAuthenticated(code);
        } else {
          await this.joinAsGuest(code);
        }
      } catch (err) {
        this.error = err.message || 'Failed to join meeting.';
      } finally {
        this.loading = false;
      }
    },

    async joinAsAuthenticated(code) {
      const tokenData = await MeetingSession.fetchMeetingToken(code, false);
      if (!tokenData) throw new Error('Could not get meeting token. Check the room code.');

      MeetingSession.setMeetingCode(code);
      MeetingSession.setIsHost(false);
      this.$router.push('/meeting');
    },

    async joinAsGuest(code) {
      MeetingSession.setGuestUser(this.guestName.trim(), null);
      const tokenData = await MeetingSession.fetchMeetingToken(code, false);
      if (!tokenData) {
        // For public Jitsi, we can still join even if backend room doesn't exist
        // Just set up session data and navigate
        MeetingSession.setMeetingCode(code);
        MeetingSession.setIsHost(false);
        MeetingSession.setJitsiRoom(`https://meet.jit.si/${code}`, code);
      } else {
        MeetingSession.setMeetingCode(code);
        MeetingSession.setIsHost(false);
      }
      this.$router.push('/meeting');
    },

    loadUserData() {
      if (this.isLoggedIn) {
        try { this.userData = JSON.parse(sessionStorage.getItem('nova_user') || '{}'); } catch { this.userData = null; }
      }
    },
  },

  mounted() {
    const code = this.$route?.query?.code;
    if (code) { this.meetingCode = code; this.onCodeInput(); }
    this.loadUserData();
  },

  beforeUnmount() {
    clearTimeout(this.validateTimer);
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');
.nv-root{--c-bg:#202124;--c-surf:#292b2f;--c-surf2:#3c4043;--c-line:#3c4043;--c-blue:#1a73e8;--c-blue2:#174ea6;--c-green:#34a853;--c-red:#ea4335;--c-text:#e8eaed;--c-text2:#9aa0a6;--c-r:8px;font-family:'Google Sans',system-ui,sans-serif}
.nv-create-wrap{min-height:100vh;background:var(--c-bg);color:var(--c-text);display:flex;flex-direction:column}
.nv-cnav{display:flex;align-items:center;justify-content:space-between;padding:14px 32px;background:var(--c-surf);border-bottom:1px solid var(--c-line)}
.nv-cbrand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600;color:var(--c-text);cursor:pointer}
.nv-cnav-back{display:flex;align-items:center;gap:7px;padding:7px 16px;border:1px solid var(--c-line);border-radius:var(--c-r);background:transparent;color:var(--c-text2);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer}
.nv-cmain{max-width:520px;margin:0 auto;padding:44px 24px 60px;width:100%}
.nv-chead{margin-bottom:28px}
.nv-ctitle{font-size:26px;font-weight:600;color:var(--c-text);margin-bottom:6px}
.nv-csub{font-size:14px;color:var(--c-text2)}
.nv-card{background:var(--c-surf);border:1px solid var(--c-line);border-radius:16px;padding:32px;box-shadow:0 8px 40px rgba(0,0,0,.4)}
.nv-success-banner{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:12px;background:rgba(52,168,83,.1);border:1px solid rgba(52,168,83,.3);margin-bottom:24px}
.nv-success-check{width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.nv-success-check--green{background:rgba(52,168,83,.2);border:1px solid rgba(52,168,83,.4);color:#81c995}
.nv-success-title{font-size:14px;font-weight:600;color:var(--c-text)}
.nv-success-sub{font-size:12px;color:var(--c-text2);margin-top:2px}
.nv-success-sub strong{color:#81c995;font-weight:600}
.nv-section-label{font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--c-text2);margin-bottom:14px}
.nv-field{margin-bottom:16px}
.nv-flabel{display:block;font-size:13px;font-weight:500;color:var(--c-text2);margin-bottom:7px}
.nv-req{color:var(--c-red)}
.nv-finput{width:100%;padding:11px 14px;background:var(--c-surf2);border:1px solid var(--c-line);border-radius:var(--c-r);color:var(--c-text);font-family:inherit;font-size:14px;box-sizing:border-box}
.nv-finput:focus{outline:none;border-color:var(--c-blue);box-shadow:0 0 0 3px rgba(26,115,232,.18)}
.nv-finput--mono{font-family:'Google Sans Mono',monospace;letter-spacing:1px}
.nv-room-found{display:flex;align-items:center;gap:6px;margin-top:7px;font-size:12px;color:#81c995;font-weight:500}
.nv-code-error{display:flex;align-items:center;gap:6px;margin-top:7px;font-size:12px;color:#f28b82;font-weight:500}
.nv-btn-primary{width:100%;margin-top:24px;padding:13px 20px;background:var(--c-blue);border:none;border-radius:var(--c-r);color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 2px 12px rgba(26,115,232,.35)}
.nv-btn-primary:disabled{opacity:.55;cursor:not-allowed}
.nv-postcreate{margin-top:10px}
.nv-btn-ghost{width:100%;padding:12px 20px;background:transparent;border:1px solid var(--c-line);border-radius:var(--c-r);color:var(--c-text2);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px}
.nv-alert-error{display:flex;align-items:flex-start;gap:8px;margin-top:14px;padding:11px 14px;border-radius:var(--c-r);background:rgba(234,67,53,.1);border:1px solid rgba(234,67,53,.3);font-size:13px;color:#f28b82}
.nv-alert-fx-enter-active,.nv-alert-fx-leave-active{transition:opacity .2s,transform .2s}
.nv-alert-fx-enter-from{opacity:0;transform:translateY(-6px)}
.nv-alert-fx-leave-to{opacity:0;transform:translateY(-6px)}
.nv-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:nv-spin .65s linear infinite}
@keyframes nv-spin{to{transform:rotate(360deg)}}
.nv-footer-hint{margin-top:20px;font-size:12px;color:#5f6368;text-align:center}
.nv-link{color:var(--c-text2);text-decoration:none}
.nv-link:hover{color:var(--c-blue)}
</style>