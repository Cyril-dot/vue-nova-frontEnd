<template>
  <div class="jm-shell">
    <header class="jm-topbar">
      <div class="jm-topbar-inner">
        <div class="jm-brand" @click="goHome">
          <div class="jm-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="jm-brand-name">Nova<span class="jm-brand-accent">Meet</span></span>
        </div>
        <div class="jm-topbar-right">
          <button v-if="isLoggedIn" class="jm-ghost-btn" @click="$router.push('/dashboard')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Dashboard
          </button>
          <button v-else class="jm-primary-btn" @click="$router.push('/auth')">Sign in</button>
        </div>
      </div>
    </header>

    <main class="jm-main">
      <div class="jm-layout">

        <!-- Left panel -->
        <div class="jm-left">
          <div class="jm-left-content">
            <div class="jm-eyebrow">SECURE VIDEO CONFERENCING</div>
            <h1 class="jm-hero-title">Join your<br><span class="jm-title-accent">meeting</span></h1>
            <p class="jm-hero-sub">Enterprise-grade video calls. No downloads. No installs. Just connect instantly.</p>

            <div class="jm-features">
              <div class="jm-feature">
                <div class="jm-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polygon points="23 7 16 12 23 17 23 7"/></svg>
                </div>
                <div>
                  <div class="jm-feature-title">HD Video &amp; Audio</div>
                  <div class="jm-feature-desc">Crystal-clear quality with adaptive bitrate</div>
                </div>
              </div>
              <div class="jm-feature">
                <div class="jm-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div>
                  <div class="jm-feature-title">Screen Sharing</div>
                  <div class="jm-feature-desc">Share your screen, window or app</div>
                </div>
              </div>
              <div class="jm-feature">
                <div class="jm-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div class="jm-feature-title">End-to-End Encrypted</div>
                  <div class="jm-feature-desc">JWT-authenticated. Your data stays private</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right panel — form -->
        <div class="jm-right">
          <div class="jm-card">

            <!-- User banner -->
            <div v-if="isLoggedIn && userData" class="jm-user-banner">
              <div class="jm-avatar">{{ getUserInitial() }}</div>
              <div class="jm-user-info">
                <div class="jm-user-name">{{ userData.name || userData.email }}</div>
                <div class="jm-user-status">
                  <span class="jm-status-dot"></span>
                  Signed in &amp; ready
                </div>
              </div>
            </div>

            <h2 class="jm-card-title">Enter a meeting code</h2>
            <p class="jm-card-sub">Type the code shared by your meeting host</p>

            <!-- Code field -->
            <div class="jm-field">
              <label class="jm-label">Meeting Code</label>
              <div class="jm-code-wrap" :class="{ 'jm-code-wrap--ok': roomInfo, 'jm-code-wrap--err': codeError }">
                <svg class="jm-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                <input
                  class="jm-code-input"
                  type="text"
                  v-model="meetingCode"
                  @input="onCodeInput"
                  @keypress.enter="joinMeeting"
                  placeholder="e.g. weekly-standup"
                  autocomplete="off"
                  spellcheck="false"
                />
                <div v-if="validating" class="jm-spin"></div>
                <div v-else-if="roomInfo" class="jm-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <div v-if="roomInfo" class="jm-found">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Room found: <strong>{{ roomInfo.name }}</strong>
              </div>
              <div v-if="codeError" class="jm-code-err">{{ codeError }}</div>
            </div>

            <!-- Guest name -->
            <div v-if="!isLoggedIn" class="jm-field">
              <label class="jm-label">Your Name</label>
              <div class="jm-input-wrap">
                <svg class="jm-field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input class="jm-text-input" type="text" v-model="guestName" @keypress.enter="joinMeeting" placeholder="e.g. Alice Johnson" autocomplete="name" />
              </div>
            </div>

            <button class="jm-join-btn" @click="joinMeeting" :disabled="loading">
              <span v-if="loading" class="jm-btn-spin"></span>
              <template v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                {{ isLoggedIn ? 'Join Meeting' : 'Join as Guest' }}
              </template>
            </button>

            <transition name="jm-alert">
              <div v-if="error" class="jm-error-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ error }}
              </div>
            </transition>

            <template v-if="isLoggedIn">
              <div class="jm-divider">
                <span class="jm-divider-line"></span>
                <span class="jm-divider-text">or</span>
                <span class="jm-divider-line"></span>
              </div>
              <button class="jm-create-btn" @click="$router.push({ path: '/meeting', query: { create: 'true' } })">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create a new meeting
              </button>
            </template>

            <p class="jm-terms">By joining you agree to our <a href="#" class="jm-link">Terms</a> and <a href="#" class="jm-link">Privacy Policy</a>.</p>
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
      meetingCode: '', guestName: '', loading: false, validating: false,
      error: null, userData: null, roomInfo: null, codeError: null, validateTimer: null,
    };
  },
  computed: {
    isLoggedIn() { return TokenService.isAuthenticated(); },
  },
  methods: {
    goHome() { this.$router.push(this.isLoggedIn ? '/dashboard' : '/auth'); },
    getUserInitial() { const n = this.userData?.name || this.userData?.email || 'U'; return n.charAt(0).toUpperCase(); },

    onCodeInput() {
      this.roomInfo = null; this.codeError = null;
      const code = this.meetingCode.trim();
      if (!code || code.length < 3) return;
      clearTimeout(this.validateTimer);
      this.validating = true;
      this.validateTimer = setTimeout(async () => {
        const result = await MeetingSession.validateMeetingCode(code);
        this.validating = false;
        if (result.valid) { this.roomInfo = result.meeting; this.codeError = null; }
        else if (this.meetingCode.trim() === code) { this.codeError = result.message || 'Room not found.'; this.roomInfo = null; }
      }, 600);
    },

    async joinMeeting() {
      this.error = null;
      const code = this.meetingCode.trim();
      if (!code) { this.error = 'Please enter a meeting code.'; return; }
      if (!this.isLoggedIn && !this.guestName.trim()) { this.error = 'Please enter your display name.'; return; }
      this.loading = true;
      try {
        if (this.isLoggedIn) {
          const tokenData = await MeetingSession.fetchMeetingToken(code, false);
          if (!tokenData) throw new Error('Could not get meeting token. Check the room code.');
          MeetingSession.setMeetingCode(code); MeetingSession.setIsHost(false);
          this.$router.push('/meeting');
        } else {
          MeetingSession.setGuestUser(this.guestName.trim(), null);
          const tokenData = await MeetingSession.fetchMeetingToken(code, false);
          MeetingSession.setMeetingCode(code); MeetingSession.setIsHost(false);
          if (!tokenData) MeetingSession.setJitsiRoom(`https://8x8.vc/${code}`, code);
          this.$router.push('/meeting');
        }
      } catch (e) { this.error = e.message || 'Failed to join meeting.'; }
      finally { this.loading = false; }
    },

    loadUserData() {
      if (this.isLoggedIn) { try { this.userData = JSON.parse(sessionStorage.getItem('nova_user') || '{}'); } catch { this.userData = null; } }
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
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

.jm-shell {
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
  --font:      'Manrope', sans-serif;
  --fdisp:     'Space Grotesk', sans-serif;
  --r:         10px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.1);

  font-family: var(--font);
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* Topbar */
.jm-topbar { height: 64px; background: var(--white); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-sm); flex-shrink: 0; }
.jm-topbar-inner { height: 100%; max-width: 1200px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }
.jm-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.jm-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #4a90e2, #6366f1); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px var(--blue-glow); }
.jm-brand-name { font-family: var(--fdisp); font-size: 18px; font-weight: 700; color: var(--ink); }
.jm-brand-accent { color: var(--blue); }
.jm-topbar-right { display: flex; align-items: center; gap: 10px; }

/* Layout */
.jm-main { flex: 1; display: flex; align-items: stretch; }
.jm-layout { display: grid; grid-template-columns: 1fr 480px; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 32px; gap: 80px; align-items: center; min-height: calc(100vh - 64px); }

/* Left */
.jm-left { display: flex; align-items: center; }
.jm-left-content { display: flex; flex-direction: column; gap: 28px; }
.jm-eyebrow { font-family: var(--fdisp); font-size: 11px; font-weight: 700; letter-spacing: 2px; color: var(--blue); background: var(--blue-soft); border: 1px solid var(--blue-mid); display: inline-block; padding: 5px 12px; border-radius: 20px; }
.jm-hero-title { font-family: var(--fdisp); font-size: clamp(38px, 5vw, 58px); font-weight: 700; color: var(--ink); line-height: 1.08; }
.jm-title-accent { color: var(--blue); }
.jm-hero-sub { font-size: 16px; color: var(--ink-m); line-height: 1.7; }
.jm-features { display: flex; flex-direction: column; gap: 16px; }
.jm-feature { display: flex; align-items: flex-start; gap: 14px; }
.jm-feature-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--blue-soft); border: 1px solid var(--blue-mid); display: flex; align-items: center; justify-content: center; color: var(--blue); flex-shrink: 0; }
.jm-feature-title { font-size: 14px; font-weight: 700; color: var(--ink-s); margin-bottom: 3px; }
.jm-feature-desc { font-size: 12px; color: var(--ink-m); }

/* Card */
.jm-right { display: flex; align-items: center; padding: 40px 0; }
.jm-card { width: 100%; background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 36px; box-shadow: var(--shadow-lg); }

/* User banner */
.jm-user-banner { display: flex; align-items: center; gap: 12px; padding: 14px 16px; margin-bottom: 24px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--r); }
.jm-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), #6366f1); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: var(--white); flex-shrink: 0; }
.jm-user-name { font-size: 14px; font-weight: 700; color: var(--ink-s); }
.jm-user-status { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--green); font-weight: 600; margin-top: 2px; }
.jm-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

.jm-card-title { font-family: var(--fdisp); font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.jm-card-sub { font-size: 14px; color: var(--ink-m); margin-bottom: 24px; }

/* Fields */
.jm-field { margin-bottom: 18px; }
.jm-label { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--ink-m); margin-bottom: 8px; }

.jm-code-wrap, .jm-input-wrap { position: relative; }
.jm-field-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-m); pointer-events: none; }
.jm-code-input, .jm-text-input {
  width: 100%; padding: 13px 42px 13px 38px;
  background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--r);
  color: var(--ink); font-family: var(--font); font-size: 15px; font-weight: 600;
  transition: all .15s;
}
.jm-code-input::placeholder, .jm-text-input::placeholder { color: #a0aec0; font-weight: 400; }
.jm-code-input:focus, .jm-text-input:focus { outline: none; border-color: var(--blue); background: var(--white); box-shadow: 0 0 0 3px var(--blue-glow); }
.jm-code-wrap--ok .jm-code-input { border-color: var(--green); }
.jm-code-wrap--err .jm-code-input { border-color: var(--red); }

.jm-spin { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; border: 2px solid var(--blue-mid); border-top-color: var(--blue); border-radius: 50%; animation: jm-spin .65s linear infinite; }
@keyframes jm-spin { to { transform: translateY(-50%) rotate(360deg); } }
.jm-check { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; border-radius: 50%; background: #d1fae5; border: 1px solid #6ee7b7; display: flex; align-items: center; justify-content: center; color: #065f46; }

.jm-found { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 12px; color: var(--green); font-weight: 600; }
.jm-code-err { margin-top: 6px; font-size: 12px; color: var(--red); font-weight: 600; }

/* Buttons */
.jm-join-btn {
  width: 100%; padding: 14px;
  background: var(--blue); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 15px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: all .15s; box-shadow: 0 4px 16px var(--blue-glow);
  margin-bottom: 4px;
}
.jm-join-btn:hover:not(:disabled) { background: var(--blue-dk); transform: translateY(-1px); }
.jm-join-btn:disabled { opacity: .5; cursor: not-allowed; }

.jm-ghost-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; background: transparent; border: 1.5px solid var(--border); border-radius: var(--r);
  color: var(--ink-m); font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.jm-ghost-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }

.jm-primary-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; background: var(--blue); color: var(--white);
  border: none; border-radius: var(--r);
  font-family: var(--font); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .15s; box-shadow: 0 4px 12px var(--blue-glow);
}
.jm-primary-btn:hover { background: var(--blue-dk); }

.jm-create-btn {
  width: 100%; padding: 12px;
  background: transparent; border: 1.5px solid var(--border); border-radius: var(--r);
  color: var(--ink-m); font-family: var(--font); font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .15s;
}
.jm-create-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-soft); }

.jm-error-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px; margin-top: 12px;
  background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--r);
  font-size: 13px; color: #dc2626;
}

.jm-divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
.jm-divider-line { flex: 1; height: 1px; background: var(--border); }
.jm-divider-text { font-size: 12px; color: var(--ink-m); font-weight: 600; }

.jm-terms { margin-top: 18px; font-size: 11px; color: var(--ink-m); text-align: center; }
.jm-link { color: var(--blue); text-decoration: none; font-weight: 600; }

.jm-btn-spin { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: jm-spin-b .65s linear infinite; }
@keyframes jm-spin-b { to { transform: rotate(360deg); } }

.jm-alert-enter-active, .jm-alert-leave-active { transition: opacity .2s, transform .2s; }
.jm-alert-enter-from { opacity: 0; transform: translateY(-6px); }
.jm-alert-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .jm-layout { grid-template-columns: 1fr; padding: 28px 20px; gap: 0; align-items: flex-start; }
  .jm-left { display: none; }
  .jm-right { width: 100%; max-width: 480px; margin: 0 auto; }
}
</style>