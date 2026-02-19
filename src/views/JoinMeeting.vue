<template>
  <div class="nj-shell">
    <div class="nj-bg-mesh"></div>

    <header class="nj-topbar">
      <div class="nj-topbar-inner">
        <div class="nj-brand" @click="goHome">
          <div class="nj-logo-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="nj-brand-name">Nova<span class="nj-brand-accent">Meet</span></span>
        </div>
        <div class="nj-topbar-right">
          <button v-if="isLoggedIn" class="nj-ghost-btn" @click="$router.push('/dashboard')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </button>
          <button v-else class="nj-primary-btn" @click="$router.push('/auth')">
            Sign in
          </button>
        </div>
      </div>
    </header>

    <main class="nj-main">
      <div class="nj-split">

        <!-- Left panel — branding / features -->
        <div class="nj-left-panel">
          <div class="nj-left-inner">
            <div class="nj-left-badge">SECURE VIDEO CONFERENCING</div>
            <h1 class="nj-left-title">Join your<br><span class="nj-title-accent">meeting</span></h1>
            <p class="nj-left-sub">Enterprise-grade video calls powered by JaaS.<br>No downloads. No installs. Just connect.</p>

            <div class="nj-feature-list">
              <div class="nj-feature-item">
                <div class="nj-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
                </div>
                <div>
                  <div class="nj-feature-title">HD Video &amp; Audio</div>
                  <div class="nj-feature-sub">Crystal-clear quality with adaptive bitrate</div>
                </div>
              </div>
              <div class="nj-feature-item">
                <div class="nj-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div>
                  <div class="nj-feature-title">Screen Sharing</div>
                  <div class="nj-feature-sub">Share your screen, window or application</div>
                </div>
              </div>
              <div class="nj-feature-item">
                <div class="nj-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div class="nj-feature-title">End-to-End Encrypted</div>
                  <div class="nj-feature-sub">JWT-authenticated. Your data stays private</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right panel — join form -->
        <div class="nj-right-panel">
          <div class="nj-form-card">

            <!-- User info banner -->
            <div v-if="isLoggedIn && userData" class="nj-user-banner">
              <div class="nj-user-avatar">{{ getUserInitial() }}</div>
              <div class="nj-user-info">
                <div class="nj-user-name">{{ userData.name || userData.email }}</div>
                <div class="nj-user-status">Signed in · Ready to join</div>
              </div>
              <div class="nj-user-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>

            <h2 class="nj-card-title">Enter a room code</h2>

            <!-- Room code field -->
            <div class="nj-field">
              <label class="nj-field-label">Meeting code</label>
              <div class="nj-code-input-wrap" :class="{ 'nj-input--found': roomInfo, 'nj-input--error': codeError }">
                <svg class="nj-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                <input
                  class="nj-code-input"
                  type="text"
                  v-model="meetingCode"
                  @input="onCodeInput"
                  @keypress.enter="joinMeeting"
                  placeholder="e.g. weekly-standup"
                  autocomplete="off"
                  spellcheck="false"
                />
                <div v-if="validating" class="nj-validating-spinner"></div>
                <div v-else-if="roomInfo" class="nj-valid-check">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <div v-if="roomInfo" class="nj-found-tag">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Room found: <strong>{{ roomInfo.name }}</strong>
              </div>
              <div v-if="codeError" class="nj-error-tag">{{ codeError }}</div>
            </div>

            <!-- Guest name -->
            <div v-if="!isLoggedIn" class="nj-field">
              <label class="nj-field-label">Your name</label>
              <div class="nj-input-wrap">
                <svg class="nj-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  class="nj-text-input"
                  type="text"
                  v-model="guestName"
                  @keypress.enter="joinMeeting"
                  placeholder="e.g. Alice Johnson"
                  autocomplete="name"
                />
              </div>
            </div>

            <!-- Join button -->
            <button class="nj-join-btn" @click="joinMeeting" :disabled="loading">
              <span v-if="loading" class="nj-btn-spinner"></span>
              <template v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                {{ isLoggedIn ? 'Join meeting' : 'Join as guest' }}
              </template>
            </button>

            <!-- Error -->
            <transition name="nj-alert">
              <div v-if="error" class="nj-error-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ error }}
              </div>
            </transition>

            <!-- Create instead -->
            <div v-if="isLoggedIn" class="nj-divider-row">
              <div class="nj-divider-line"></div>
              <span class="nj-divider-text">or</span>
              <div class="nj-divider-line"></div>
            </div>
            <button v-if="isLoggedIn" class="nj-ghost-btn nj-ghost-btn--full" @click="$router.push({ path: '/meeting', query: { create: 'true' } })">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create a new meeting
            </button>

            <p class="nj-terms">
              By joining you agree to our
              <a href="#" class="nj-link">Terms</a> and
              <a href="#" class="nj-link">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
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
      validating:    false,
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

    getUserInitial() {
      const n = this.userData?.name || this.userData?.email || 'U';
      return n.charAt(0).toUpperCase();
    },

    onCodeInput() {
      this.roomInfo  = null;
      this.codeError = null;
      const code = this.meetingCode.trim();
      if (!code || code.length < 3) return;

      clearTimeout(this.validateTimer);
      this.validating = true;
      this.validateTimer = setTimeout(async () => {
        const result = await MeetingSession.validateMeetingCode(code);
        this.validating = false;
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
        this.error = 'Please enter your display name.'; return;
      }

      this.loading = true;
      try {
        if (this.isLoggedIn) {
          const tokenData = await MeetingSession.fetchMeetingToken(code, false);
          if (!tokenData) throw new Error('Could not get meeting token. Check the room code.');
          MeetingSession.setMeetingCode(code);
          MeetingSession.setIsHost(false);
          this.$router.push('/meeting');
        } else {
          MeetingSession.setGuestUser(this.guestName.trim(), null);
          const tokenData = await MeetingSession.fetchMeetingToken(code, false);
          MeetingSession.setMeetingCode(code);
          MeetingSession.setIsHost(false);
          if (!tokenData) {
            MeetingSession.setJitsiRoom(`https://8x8.vc/${code}`, code);
          }
          this.$router.push('/meeting');
        }
      } catch (e) {
        this.error = e.message || 'Failed to join meeting.';
      } finally {
        this.loading = false;
      }
    },

    loadUserData() {
      if (this.isLoggedIn) {
        try { this.userData = JSON.parse(sessionStorage.getItem('nova_user') || '{}'); }
        catch { this.userData = null; }
      }
    },
  },
  mounted() {
    const code = this.$route?.query?.code;
    if (code) { this.meetingCode = code; this.onCodeInput(); }
    this.loadUserData();
  },
  beforeUnmount() { clearTimeout(this.validateTimer); },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

.nj-shell {
  --nj-bg:    #0a0c10;
  --nj-surf:  #111318;
  --nj-surf2: #181c24;
  --nj-surf3: #1f2330;
  --nj-bd:    rgba(255,255,255,.07);
  --nj-bd2:   rgba(255,255,255,.12);
  --nj-blue:  #3b8eea;
  --nj-blg:   rgba(59,142,234,.3);
  --nj-green: #22c55e;
  --nj-red:   #ef4444;
  --nj-text:  #e6eaf2;
  --nj-t2:    #8892a4;
  --nj-t3:    #525c6e;
  --nj-r:     12px;
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--nj-bg);
  color: var(--nj-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.nj-bg-mesh {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 60% 50% at 10% 20%, rgba(59,142,234,.06) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 90% 80%, rgba(91,109,248,.05) 0%, transparent 60%);
}

/* ── Topbar ─────────────────────────────────────── */
.nj-topbar {
  height: 60px; flex-shrink: 0;
  background: rgba(17,19,24,.9); border-bottom: 1px solid var(--nj-bd);
  backdrop-filter: blur(12px); position: relative; z-index: 10;
}
.nj-topbar-inner {
  height: 100%; max-width: 1200px; margin: 0 auto; padding: 0 28px;
  display: flex; align-items: center; justify-content: space-between;
}
.nj-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.nj-logo-mark {
  width: 32px; height: 32px; border-radius: 9px;
  background: linear-gradient(135deg,#3b8eea,#5b6df8);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px var(--nj-blg);
}
.nj-brand-name { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--nj-text); }
.nj-brand-accent { color:var(--nj-blue); }
.nj-topbar-right { display:flex; align-items:center; gap:10px; }

/* ── Main split ────────────────────────────────── */
.nj-main { flex:1; position:relative; z-index:1; display:flex; align-items:stretch; }
.nj-split { display:grid; grid-template-columns:1fr 480px; width:100%; max-width:1200px; margin:0 auto; padding:0 28px; gap:60px; align-items:center; min-height:calc(100vh - 60px); }

/* ── Left panel ─────────────────────────────────── */
.nj-left-panel { display:flex; align-items:center; }
.nj-left-inner { display:flex; flex-direction:column; gap:32px; }
.nj-left-badge {
  display:inline-block; font-family:'Syne',sans-serif; font-size:10px; font-weight:700;
  letter-spacing:2px; color:var(--nj-blue);
  background:rgba(59,142,234,.1); border:1px solid rgba(59,142,234,.2);
  padding:5px 12px; border-radius:20px;
}
.nj-left-title {
  font-family:'Syne',sans-serif; font-size:clamp(36px,5vw,56px);
  font-weight:800; color:var(--nj-text); line-height:1.05;
}
.nj-title-accent { color:var(--nj-blue); }
.nj-left-sub { font-size:16px; color:var(--nj-t2); line-height:1.7; }
.nj-feature-list { display:flex; flex-direction:column; gap:16px; }
.nj-feature-item { display:flex; align-items:flex-start; gap:14px; }
.nj-feature-icon {
  width:38px; height:38px; border-radius:10px; flex-shrink:0;
  background:rgba(59,142,234,.1); border:1px solid rgba(59,142,234,.2);
  display:flex; align-items:center; justify-content:center; color:var(--nj-blue);
}
.nj-feature-title { font-size:14px; font-weight:600; color:var(--nj-text); margin-bottom:3px; }
.nj-feature-sub { font-size:12px; color:var(--nj-t2); }

/* ── Form card ─────────────────────────────────── */
.nj-right-panel { display:flex; align-items:center; padding:40px 0; }
.nj-form-card {
  width:100%;
  background:var(--nj-surf); border:1px solid var(--nj-bd2);
  border-radius:20px; padding:36px;
  box-shadow:0 32px 80px rgba(0,0,0,.5);
}

/* ── User banner ───────────────────────────────── */
.nj-user-banner {
  display:flex; align-items:center; gap:12px;
  padding:14px 16px; margin-bottom:24px;
  background:rgba(34,197,94,.06); border:1px solid rgba(34,197,94,.15); border-radius:var(--nj-r);
}
.nj-user-avatar {
  width:38px; height:38px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,var(--nj-blue),#5b6df8);
  display:flex; align-items:center; justify-content:center;
  font-size:15px; font-weight:700; color:#fff;
}
.nj-user-name { font-size:14px; font-weight:600; color:var(--nj-text); }
.nj-user-status { font-size:11px; color:var(--nj-green); font-weight:500; margin-top:2px; }
.nj-user-check {
  margin-left:auto; width:26px; height:26px; border-radius:50%;
  background:rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.25);
  display:flex; align-items:center; justify-content:center; color:var(--nj-green); flex-shrink:0;
}

.nj-card-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:var(--nj-text); margin-bottom:24px; }

/* ── Fields ────────────────────────────────────── */
.nj-field { margin-bottom:18px; }
.nj-field-label { display:block; font-size:11px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:var(--nj-t2); margin-bottom:8px; }

.nj-code-input-wrap, .nj-input-wrap { position:relative; }
.nj-field-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--nj-t3); pointer-events:none; }
.nj-code-input, .nj-text-input {
  width:100%; padding:13px 13px 13px 40px;
  background:var(--nj-surf2); border:1.5px solid var(--nj-bd2); border-radius:var(--nj-r);
  color:var(--nj-text); font-family:'DM Sans',sans-serif; font-size:15px;
  font-weight:500; letter-spacing:.5px;
  transition:border-color .15s, box-shadow .15s;
}
.nj-code-input::placeholder, .nj-text-input::placeholder { color:var(--nj-t3); font-weight:400; letter-spacing:0; }
.nj-code-input:focus, .nj-text-input:focus {
  outline:none; border-color:var(--nj-blue); box-shadow:0 0 0 3px rgba(59,142,234,.12);
}
.nj-input--found .nj-code-input { border-color:var(--nj-green); }
.nj-input--error .nj-code-input { border-color:var(--nj-red); }

.nj-validating-spinner {
  position:absolute; right:13px; top:50%; transform:translateY(-50%);
  width:14px; height:14px; border:2px solid rgba(59,142,234,.3); border-top-color:var(--nj-blue);
  border-radius:50%; animation:nj-spin .65s linear infinite;
}
.nj-valid-check {
  position:absolute; right:10px; top:50%; transform:translateY(-50%);
  width:22px; height:22px; border-radius:50%;
  background:rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.25);
  display:flex; align-items:center; justify-content:center; color:var(--nj-green);
}
.nj-found-tag { display:flex; align-items:center; gap:6px; margin-top:6px; font-size:12px; color:var(--nj-green); font-weight:500; }
.nj-error-tag { margin-top:6px; font-size:12px; color:#f87171; font-weight:500; }

/* ── Buttons ───────────────────────────────────── */
.nj-join-btn {
  width:100%; padding:14px;
  background:var(--nj-blue); color:#fff;
  border:none; border-radius:var(--nj-r);
  font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600;
  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px;
  transition:all .15s; box-shadow:0 4px 18px var(--nj-blg);
  margin-bottom:4px;
}
.nj-join-btn:hover:not(:disabled) { background:#2464c4; transform:translateY(-1px); box-shadow:0 6px 24px var(--nj-blg); }
.nj-join-btn:disabled { opacity:.5; cursor:not-allowed; }

.nj-ghost-btn {
  display:inline-flex; align-items:center; gap:7px;
  padding:9px 16px;
  background:transparent; border:1px solid var(--nj-bd2); border-radius:var(--nj-r);
  color:var(--nj-t2); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
  cursor:pointer; transition:all .15s;
}
.nj-ghost-btn:hover { border-color:var(--nj-blue); color:var(--nj-text); background:rgba(59,142,234,.06); }
.nj-ghost-btn--full { width:100%; justify-content:center; padding:12px; font-size:14px; }

.nj-primary-btn {
  display:inline-flex; align-items:center; gap:7px;
  padding:8px 18px;
  background:var(--nj-blue); color:#fff;
  border:none; border-radius:var(--nj-r);
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
  cursor:pointer; transition:all .15s; box-shadow:0 4px 14px var(--nj-blg);
}
.nj-primary-btn:hover { background:#2464c4; }

.nj-error-bar {
  display:flex; align-items:center; gap:8px;
  padding:11px 14px; margin-top:14px;
  background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.2); border-radius:var(--nj-r);
  font-size:13px; color:#f87171;
}

.nj-divider-row { display:flex; align-items:center; gap:12px; margin:16px 0; }
.nj-divider-line { flex:1; height:1px; background:var(--nj-bd2); }
.nj-divider-text { font-size:12px; color:var(--nj-t3); font-weight:500; }

.nj-terms { margin-top:18px; font-size:11px; color:var(--nj-t3); text-align:center; }
.nj-link { color:var(--nj-t2); text-decoration:none; }
.nj-link:hover { color:var(--nj-blue); }

.nj-btn-spinner {
  display:inline-block; width:14px; height:14px;
  border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
  border-radius:50%; animation:nj-spin .65s linear infinite;
}
@keyframes nj-spin { to { transform:rotate(360deg); } }

.nj-alert-enter-active, .nj-alert-leave-active { transition:opacity .2s, transform .2s; }
.nj-alert-enter-from { opacity:0; transform:translateY(-6px); }
.nj-alert-leave-to { opacity:0; }

@media (max-width:900px) {
  .nj-split { grid-template-columns:1fr; padding:28px 20px; gap:0; align-items:flex-start; }
  .nj-left-panel { display:none; }
  .nj-right-panel { width:100%; max-width:480px; margin:0 auto; }
}
</style>