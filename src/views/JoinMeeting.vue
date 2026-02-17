<!-- JoinMeeting.vue -->
<template>
  <div class="jm-wrap">

    <!-- ── Nav ── -->
    <nav class="jm-nav">
      <div class="jm-brand" @click="goHome">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#1a73e8"/>
          <path d="M20 16L26 11V21L20 16Z" fill="white"/>
          <rect x="6" y="10" width="15" height="12" rx="2" fill="white"/>
        </svg>
        <span class="jm-brand-name">Nova</span>
      </div>
      <div class="jm-nav-actions">
        <button v-if="isLoggedIn" class="jm-nav-btn jm-nav-btn--ghost" @click="$router.push('/dashboard')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Dashboard
        </button>
        <button v-else class="jm-nav-btn jm-nav-btn--primary" @click="$router.push('/auth')">
          Sign in
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        </button>
      </div>
    </nav>

    <!-- ── Main ── -->
    <main class="jm-main">

      <!-- Ambient glow -->
      <div class="jm-glow jm-glow--tl" aria-hidden="true"></div>
      <div class="jm-glow jm-glow--br" aria-hidden="true"></div>

      <div class="jm-card">

        <!-- Card header -->
        <div class="jm-card-head">
          <div class="jm-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <h1 class="jm-title">Join a meeting</h1>
            <p class="jm-sub">Enter a code to connect instantly</p>
          </div>
        </div>

        <!-- Signed-in banner -->
        <div v-if="isLoggedIn && userData" class="jm-signin-banner">
          <span class="jm-signin-dot"></span>
          <span>Joining as <strong>{{ userData.name || userData.email }}</strong></span>
        </div>

        <!-- Mode tabs (only when not logged in) -->
        <div v-if="!isLoggedIn" class="jm-tabs">
          <button class="jm-tab" :class="{ 'jm-tab--active': mode === 'auth' }" @click="setMode('auth')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Sign in
          </button>
          <button class="jm-tab" :class="{ 'jm-tab--active': mode === 'guest' }" @click="setMode('guest')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Guest
          </button>
        </div>

        <!-- ── Form fields ── -->
        <div class="jm-fields">

          <!-- Meeting code — always shown -->
          <div class="jm-field">
            <label class="jm-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Meeting code
              <span class="jm-req">*</span>
            </label>
            <div class="jm-input-wrap">
              <input
                class="jm-input jm-input--mono"
                type="text"
                v-model="meetingCode"
                @keypress.enter="joinMeeting"
                placeholder="ABC-DEF-GHI"
                autocomplete="off"
                spellcheck="false"
              />
              <div class="jm-input-focus-ring"></div>
            </div>
          </div>

          <!-- Auth mode fields -->
          <template v-if="mode === 'auth' && !isLoggedIn">
            <div class="jm-field">
              <label class="jm-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email
              </label>
              <div class="jm-input-wrap">
                <input class="jm-input" type="email" v-model="authEmail" placeholder="you@example.com" autocomplete="email" />
                <div class="jm-input-focus-ring"></div>
              </div>
            </div>

            <div class="jm-field">
              <label class="jm-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </label>
              <div class="jm-input-wrap jm-input-wrap--pwd">
                <input
                  class="jm-input"
                  :type="showPwd ? 'text' : 'password'"
                  v-model="authPassword"
                  @keypress.enter="joinMeeting"
                  placeholder="Your account password"
                  autocomplete="current-password"
                />
                <button class="jm-pwd-toggle" type="button" @click="showPwd = !showPwd" tabindex="-1">
                  <svg v-if="!showPwd" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
                <div class="jm-input-focus-ring"></div>
              </div>
            </div>
          </template>

          <!-- Guest mode fields -->
          <template v-if="mode === 'guest'">
            <div class="jm-field">
              <label class="jm-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Display name
                <span class="jm-req">*</span>
              </label>
              <div class="jm-input-wrap">
                <input class="jm-input" type="text" v-model="guestName" @keypress.enter="joinMeeting" placeholder="e.g. Alice Johnson" autocomplete="name" />
                <div class="jm-input-focus-ring"></div>
              </div>
            </div>

            <div class="jm-field">
              <label class="jm-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email
                <span class="jm-opt">(optional)</span>
              </label>
              <div class="jm-input-wrap">
                <input class="jm-input" type="email" v-model="guestEmail" placeholder="alice@example.com" autocomplete="email" />
                <div class="jm-input-focus-ring"></div>
              </div>
            </div>
          </template>

        </div><!-- /jm-fields -->

        <!-- ── Actions ── -->
        <div class="jm-actions">
          <button class="jm-join-btn" @click="joinMeeting" :disabled="loading">
            <span v-if="loading" class="jm-spinner"></span>
            <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {{ loading ? 'Joining…' : 'Join meeting' }}
          </button>

          <button v-if="isLoggedIn" class="jm-create-btn" @click="$router.push('/meeting-dashboard')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create a meeting instead
          </button>
        </div>

        <!-- Alerts -->
        <transition name="jm-alert-fx">
          <div v-if="error" class="jm-alert jm-alert--error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ error }}
          </div>
        </transition>

        <transition name="jm-alert-fx">
          <div v-if="success" class="jm-alert jm-alert--success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ success }}
          </div>
        </transition>

      </div><!-- /jm-card -->

      <!-- Footer hint -->
      <p class="jm-footer-hint">
        By joining, you agree to our
        <a href="#" class="jm-link">Terms of Service</a>
        and
        <a href="#" class="jm-link">Privacy Policy</a>.
      </p>

    </main>
  </div>
</template>

<script>
import { TokenService, AuthAPI, apiRequest } from '@/utils/apiService';

export default {
  name: 'JoinMeeting',

  data() {
    return {
      mode: 'guest',

      meetingCode: '',

      // Auth mode
      authEmail:    '',
      authPassword: '',
      showPwd:      false,

      // Guest mode
      guestName:  '',
      guestEmail: '',

      // UI
      loading: false,
      error:   null,
      success: null,

      userData: null,
    };
  },

  computed: {
    isLoggedIn() {
      return TokenService.isAuthenticated();
    },
  },

  methods: {
    setMode(m) {
      this.mode    = m;
      this.error   = null;
      this.success = null;
    },

    goHome() {
      this.$router.push(this.isLoggedIn ? '/dashboard' : '/auth');
    },

    async joinMeeting() {
      this.error   = null;
      this.success = null;

      if (!this.meetingCode.trim()) {
        this.error = 'Please enter a meeting code.';
        return;
      }

      this.loading = true;

      try {
        if (this.isLoggedIn) {
          await this.joinAsAuthenticated();
        } else if (this.mode === 'guest') {
          await this.joinAsGuest();
        } else {
          await this.joinWithAuthentication();
        }
      } catch (err) {
        console.error('Join error:', err);
        this.error = err.message || 'Failed to join meeting.';
      } finally {
        this.loading = false;
      }
    },

    async joinAsAuthenticated() {
      const res  = await apiRequest('/meetings/join', {
        method: 'POST',
        body: JSON.stringify({ meetingCode: this.meetingCode }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false)
        throw new Error(data.message || data.error || 'Failed to join meeting.');

      sessionStorage.setItem('nova_meeting_code', this.meetingCode);
      this.success = 'Joining…';
      setTimeout(() => this.$router.push('/meeting'), 600);
    },

    async joinAsGuest() {
      if (!this.guestName.trim())
        throw new Error('Please enter your display name.');

      const res  = await apiRequest('/meetings/join/guest', {
        method: 'POST',
        body: JSON.stringify({
          meetingCode: this.meetingCode,
          guestName:   this.guestName.trim(),
          guestEmail:  this.guestEmail.trim() || null,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false)
        throw new Error(data.message || data.error || 'Failed to join meeting.');

      sessionStorage.setItem('nova_user', JSON.stringify({
        name:    this.guestName.trim(),
        email:   this.guestEmail.trim() || null,
        isGuest: true,
      }));
      sessionStorage.setItem('nova_meeting_code', this.meetingCode);

      this.success = 'Joining…';
      setTimeout(() => this.$router.push('/meeting'), 600);
    },

    async joinWithAuthentication() {
      if (!this.authEmail.trim() || !this.authPassword.trim())
        throw new Error('Please enter your email and password.');

      const loginData = await AuthAPI.login(this.authEmail, this.authPassword);
      if (!loginData.accessToken)
        throw new Error('Login succeeded but no token returned.');

      TokenService.setTokens(loginData.accessToken, loginData.refreshToken);

      const jwtPayload = this.decodeJwt(loginData.accessToken);
      const user = {
        id:    jwtPayload.userId || null,
        email: jwtPayload.sub    || this.authEmail,
        role:  jwtPayload.role   || 'USER',
        name:  this.authEmail.split('@')[0],
      };
      sessionStorage.setItem('nova_user', JSON.stringify(user));
      this.userData = user;

      await this.joinAsAuthenticated();
    },

    decodeJwt(token) {
      try { return JSON.parse(atob(token.split('.')[1])); } catch { return {}; }
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
    if (code) this.meetingCode = code;

    this.loadUserData();
    if (this.isLoggedIn) this.mode = 'auth';
  },
};
</script>

<style scoped>
/*
  JoinMeeting — fully scoped to .jm-* prefix.
  Palette tokens mirror Meeting.vue (nv-*) for visual cohesion.
  No styles leak to or from other pages.
*/
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

.jm-wrap {
  /* ── Token palette ── */
  --jm-bg:       #202124;
  --jm-surf:     #292b2f;
  --jm-surf2:    #35373b;
  --jm-surf3:    #3c4043;
  --jm-line:     #3c4043;
  --jm-blue:     #1a73e8;
  --jm-blue2:    #174ea6;
  --jm-blue-glow:rgba(26,115,232,.18);
  --jm-green:    #34a853;
  --jm-red:      #ea4335;
  --jm-text:     #e8eaed;
  --jm-text2:    #9aa0a6;
  --jm-text3:    #5f6368;
  --jm-r:        10px;

  font-family: 'Google Sans', system-ui, sans-serif;
  background: var(--jm-bg);
  color: var(--jm-text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Nav ────────────────────────────────── */
.jm-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 28px;
  background: var(--jm-surf);
  border-bottom: 1px solid var(--jm-line);
  flex-shrink: 0;
}

.jm-brand {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; user-select: none;
}
.jm-brand svg { border-radius: 6px; }
.jm-brand-name { font-size: 17px; font-weight: 600; letter-spacing: -.2px; }

.jm-nav-actions { display: flex; gap: 8px; }

.jm-nav-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: var(--jm-r);
  font-family: inherit; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all .15s;
}
.jm-nav-btn--ghost {
  background: transparent; border: 1px solid var(--jm-line); color: var(--jm-text2);
}
.jm-nav-btn--ghost:hover { border-color: var(--jm-blue); color: var(--jm-text); background: rgba(26,115,232,.07); }
.jm-nav-btn--primary {
  background: var(--jm-blue); border: none; color: #fff;
  box-shadow: 0 2px 10px rgba(26,115,232,.35);
}
.jm-nav-btn--primary:hover { background: var(--jm-blue2); }

/* ── Main ───────────────────────────────── */
.jm-main {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 24px; position: relative; overflow: hidden;
}

/* Ambient glows */
.jm-glow {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none; z-index: 0;
}
.jm-glow--tl {
  width: 480px; height: 320px; top: -80px; left: -120px;
  background: radial-gradient(ellipse at center, rgba(26,115,232,.1) 0%, transparent 70%);
}
.jm-glow--br {
  width: 400px; height: 300px; bottom: -60px; right: -80px;
  background: radial-gradient(ellipse at center, rgba(52,168,83,.07) 0%, transparent 70%);
}

/* ── Card ───────────────────────────────── */
.jm-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 440px;
  background: var(--jm-surf);
  border: 1px solid var(--jm-line);
  border-radius: 20px;
  padding: 36px 36px 32px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.04) inset,
    0 24px 64px rgba(0,0,0,.55),
    0 4px 16px rgba(0,0,0,.3);
}

/* Card head */
.jm-card-head {
  display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
}
.jm-card-icon {
  width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
  background: rgba(26,115,232,.14); border: 1px solid rgba(26,115,232,.25);
  display: flex; align-items: center; justify-content: center;
  color: #8ab4f8;
}
.jm-title { font-size: 22px; font-weight: 600; letter-spacing: -.3px; color: var(--jm-text); line-height: 1.2; }
.jm-sub   { font-size: 13px; color: var(--jm-text2); margin-top: 3px; }

/* Signed-in banner */
.jm-signin-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; border-radius: var(--jm-r);
  background: rgba(52,168,83,.1); border: 1px solid rgba(52,168,83,.25);
  font-size: 13px; color: var(--jm-text2); margin-bottom: 24px;
}
.jm-signin-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--jm-green);
  box-shadow: 0 0 6px var(--jm-green);
  flex-shrink: 0;
  animation: jm-pulse 2.4s ease-in-out infinite;
}
@keyframes jm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
.jm-signin-banner strong { color: #81c995; font-weight: 600; }

/* ── Mode tabs ──────────────────────────── */
.jm-tabs {
  display: flex; gap: 6px;
  background: var(--jm-surf2);
  border: 1px solid var(--jm-line);
  border-radius: 12px; padding: 5px;
  margin-bottom: 28px;
}
.jm-tab {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 9px 10px; border: none; border-radius: 8px;
  background: transparent; color: var(--jm-text2);
  font-family: inherit; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all .18s;
}
.jm-tab:hover { color: var(--jm-text); background: rgba(255,255,255,.05); }
.jm-tab--active {
  background: var(--jm-blue);
  color: #fff;
  box-shadow: 0 2px 12px rgba(26,115,232,.4);
}
.jm-tab--active:hover { background: var(--jm-blue); }

/* ── Form fields ────────────────────────── */
.jm-fields { display: flex; flex-direction: column; gap: 18px; margin-bottom: 24px; }

.jm-field { display: flex; flex-direction: column; gap: 7px; }

.jm-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; letter-spacing: .3px;
  text-transform: uppercase; color: var(--jm-text2);
}
.jm-req { color: var(--jm-red); margin-left: 2px; }
.jm-opt { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--jm-text3); font-size: 11px; }

/* Input wrapper — handles focus ring */
.jm-input-wrap {
  position: relative;
  border-radius: var(--jm-r);
}

.jm-input {
  width: 100%; padding: 13px 16px;
  background: var(--jm-surf2);
  border: 1.5px solid var(--jm-line);
  border-radius: var(--jm-r);
  color: var(--jm-text);
  font-family: 'Google Sans', inherit;
  font-size: 15px;
  outline: none;
  transition: border-color .18s, background .18s, box-shadow .18s;
  position: relative; z-index: 1;
  /* Subtle inset shadow for depth */
  box-shadow: inset 0 1px 3px rgba(0,0,0,.25);
}

.jm-input::placeholder { color: var(--jm-text3); }

/* Hover state */
.jm-input:hover:not(:focus) {
  border-color: #5f6368;
  background: var(--jm-surf3);
}

/* Focus state — animated glow ring */
.jm-input:focus {
  border-color: var(--jm-blue);
  background: var(--jm-surf3);
  box-shadow:
    inset 0 1px 3px rgba(0,0,0,.2),
    0 0 0 3px var(--jm-blue-glow),
    0 0 16px rgba(26,115,232,.12);
}

/* Monospace code input */
.jm-input--mono {
  font-family: 'Google Sans Mono', monospace;
  letter-spacing: 2px;
  font-size: 15px;
  text-transform: uppercase;
}
.jm-input--mono::placeholder { letter-spacing: 1px; text-transform: none; }

/* Password toggle */
.jm-input-wrap--pwd .jm-input { padding-right: 44px; }
.jm-pwd-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  z-index: 2; background: none; border: none; cursor: pointer;
  color: var(--jm-text2); padding: 4px; border-radius: 4px;
  transition: color .15s;
}
.jm-pwd-toggle:hover { color: var(--jm-text); }

/* ── Action buttons ─────────────────────── */
.jm-actions { display: flex; flex-direction: column; gap: 10px; }

.jm-join-btn {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  padding: 14px 20px; border: none; border-radius: var(--jm-r);
  background: var(--jm-blue); color: #fff;
  font-family: inherit; font-size: 15px; font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 14px rgba(26,115,232,.4);
  transition: background .15s, transform .1s, box-shadow .15s;
}
.jm-join-btn:hover:not(:disabled) {
  background: var(--jm-blue2);
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(26,115,232,.5);
}
.jm-join-btn:active:not(:disabled) { transform: translateY(0); }
.jm-join-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

.jm-create-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 20px; border: 1.5px solid var(--jm-line);
  border-radius: var(--jm-r); background: transparent;
  color: var(--jm-text2); font-family: inherit; font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all .15s;
}
.jm-create-btn:hover {
  border-color: var(--jm-blue);
  color: var(--jm-text);
  background: rgba(26,115,232,.07);
}

/* ── Alerts ─────────────────────────────── */
.jm-alert {
  display: flex; align-items: flex-start; gap: 9px;
  margin-top: 14px; padding: 12px 14px;
  border-radius: var(--jm-r); font-size: 13px; line-height: 1.5;
}
.jm-alert svg { flex-shrink: 0; margin-top: 1px; }
.jm-alert--error  { background: rgba(234,67,53,.1); border: 1px solid rgba(234,67,53,.28); color: #f28b82; }
.jm-alert--success { background: rgba(52,168,83,.1); border: 1px solid rgba(52,168,83,.28); color: #81c995; }

.jm-alert-fx-enter-active, .jm-alert-fx-leave-active { transition: opacity .2s, transform .2s; }
.jm-alert-fx-enter-from  { opacity: 0; transform: translateY(-6px); }
.jm-alert-fx-leave-to    { opacity: 0; transform: translateY(-6px); }

/* Spinner */
.jm-spinner {
  display: inline-block; width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: jm-spin .65s linear infinite;
}
@keyframes jm-spin { to { transform: rotate(360deg); } }

/* ── Footer hint ────────────────────────── */
.jm-footer-hint {
  position: relative; z-index: 1;
  margin-top: 20px; font-size: 12px; color: var(--jm-text3); text-align: center;
}
.jm-link { color: var(--jm-text2); text-decoration: none; transition: color .15s; }
.jm-link:hover { color: var(--jm-blue); text-decoration: underline; }

/* ── Responsive ─────────────────────────── */
@media (max-width: 480px) {
  .jm-card { padding: 28px 22px 24px; border-radius: 16px; }
  .jm-title { font-size: 20px; }
}
</style>