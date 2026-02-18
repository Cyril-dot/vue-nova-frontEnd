<!-- JoinMeeting.vue — structure mirrors Meeting.vue create phase -->
<template>
  <div class="nv-root">
    <div class="nv-create-wrap">

      <!-- ── Nav — identical to Meeting.vue ── -->
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
        <button v-else class="nv-cnav-back" @click="$router.push('/auth')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Sign in
        </button>
      </nav>

      <!-- ── Main — same max-width / padding as Meeting.vue ── -->
      <main class="nv-cmain">

        <div class="nv-chead">
          <h1 class="nv-ctitle">Join a meeting</h1>
          <p class="nv-csub">Enter a code to connect with others instantly.</p>
        </div>

        <div class="nv-card">

          <!-- ── Signed-in banner (mirrors success-banner style) ── -->
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

          <!-- ── Section: Meeting code ── -->
          <div class="nv-section-label">Meeting details</div>

          <div class="nv-field">
            <label class="nv-flabel">Meeting code <span class="nv-req">*</span></label>
            <input
              class="nv-finput nv-finput--mono"
              type="text"
              v-model="meetingCode"
              @keypress.enter="joinMeeting"
              placeholder="ABC-DEF-GHI"
              autocomplete="off"
              spellcheck="false"
            />
          </div>

          <!-- ── Section: Who are you? (only when not logged in) ── -->
          <template v-if="!isLoggedIn">
            <div class="nv-section-label" style="margin-top: 28px;">Join as</div>

            <!-- Toggle list — mirrors nv-toggle-list from Meeting.vue -->
            <div class="nv-toggle-list nv-toggle-list--tabs">
              <label class="nv-trow" :class="{ 'nv-trow--active': mode === 'guest' }" @click="setMode('guest')">
                <div>
                  <div class="nv-trow-label">Guest</div>
                  <div class="nv-trow-sub">Join without an account — just enter a name</div>
                </div>
                <div class="nv-radio" :class="{ 'nv-radio--on': mode === 'guest' }">
                  <div class="nv-radio-dot"></div>
                </div>
              </label>
              <label class="nv-trow" :class="{ 'nv-trow--active': mode === 'auth' }" @click="setMode('auth')">
                <div>
                  <div class="nv-trow-label">Sign in to join</div>
                  <div class="nv-trow-sub">Use your Nova account credentials</div>
                </div>
                <div class="nv-radio" :class="{ 'nv-radio--on': mode === 'auth' }">
                  <div class="nv-radio-dot"></div>
                </div>
              </label>
            </div>

            <!-- Guest fields -->
            <template v-if="mode === 'guest'">
              <div class="nv-row2" style="margin-top: 16px;">
                <div class="nv-field">
                  <label class="nv-flabel">Display name <span class="nv-req">*</span></label>
                  <input class="nv-finput" type="text" v-model="guestName" @keypress.enter="joinMeeting" placeholder="e.g. Alice Johnson" autocomplete="name" />
                </div>
                <div class="nv-field">
                  <label class="nv-flabel">Email <span class="nv-opt">(optional)</span></label>
                  <input class="nv-finput" type="email" v-model="guestEmail" placeholder="alice@example.com" autocomplete="email" />
                </div>
              </div>
            </template>

            <!-- Auth fields -->
            <template v-if="mode === 'auth'">
              <div class="nv-field" style="margin-top: 16px;">
                <label class="nv-flabel">Email</label>
                <input class="nv-finput" type="email" v-model="authEmail" placeholder="you@example.com" autocomplete="email" />
              </div>
              <div class="nv-field">
                <label class="nv-flabel">Password</label>
                <div class="nv-pwd-wrap">
                  <input
                    class="nv-finput nv-finput--pwd"
                    :type="showPwd ? 'text' : 'password'"
                    v-model="authPassword"
                    @keypress.enter="joinMeeting"
                    placeholder="Your account password"
                    autocomplete="current-password"
                  />
                  <button class="nv-pwd-toggle" type="button" @click="showPwd = !showPwd" tabindex="-1">
                    <svg v-if="!showPwd" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
            </template>
          </template>

          <!-- ── Join button — mirrors nv-btn-primary ── -->
          <button class="nv-btn-primary" @click="joinMeeting" :disabled="loading">
            <span v-if="loading" class="nv-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {{ loading ? 'Joining…' : 'Join meeting' }}
          </button>

          <!-- ── Secondary action — mirrors nv-btn-ghost ── -->
          <div class="nv-postcreate">
            <button v-if="isLoggedIn" class="nv-btn-ghost" @click="$router.push('/meeting-dashboard')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create a meeting instead
            </button>
          </div>

          <!-- ── Alerts — mirrors nv-alert-error ── -->
          <transition name="nv-alert-fx">
            <div v-if="error" class="nv-alert-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error }}
            </div>
          </transition>

          <transition name="nv-alert-fx">
            <div v-if="success" class="nv-alert-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ success }}
            </div>
          </transition>

        </div><!-- /nv-card -->

        <p class="nv-footer-hint">
          By joining, you agree to our
          <a href="#" class="nv-link">Terms of Service</a> and
          <a href="#" class="nv-link">Privacy Policy</a>.
        </p>

      </main>
    </div>
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
      authEmail:    '',
      authPassword: '',
      showPwd:      false,
      guestName:  '',
      guestEmail: '',
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
      this.mode  = m;
      this.error = null;
    },

    goHome() {
      this.$router.push(this.isLoggedIn ? '/dashboard' : '/auth');
    },

    async joinMeeting() {
      this.error   = null;
      this.success = null;
      if (!this.meetingCode.trim()) { this.error = 'Please enter a meeting code.'; return; }
      this.loading = true;
      try {
        if (this.isLoggedIn)         await this.joinAsAuthenticated();
        else if (this.mode === 'guest') await this.joinAsGuest();
        else                          await this.joinWithAuthentication();
      } catch (err) {
        this.error = err.message || 'Failed to join meeting.';
      } finally {
        this.loading = false;
      }
    },

    async joinAsAuthenticated() {
      const res  = await apiRequest('/meetings/join', { method: 'POST', body: JSON.stringify({ meetingCode: this.meetingCode }) });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || data.error || 'Failed to join meeting.');
      sessionStorage.setItem('nova_meeting_code', this.meetingCode);
      this.success = 'Joining…';
      setTimeout(() => this.$router.push('/meeting'), 600);
    },

    async joinAsGuest() {
      if (!this.guestName.trim()) throw new Error('Please enter your display name.');
      const res  = await apiRequest('/meetings/join/guest', {
        method: 'POST',
        body: JSON.stringify({ meetingCode: this.meetingCode, guestName: this.guestName.trim(), guestEmail: this.guestEmail.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || data.error || 'Failed to join meeting.');
      sessionStorage.setItem('nova_user', JSON.stringify({ name: this.guestName.trim(), email: this.guestEmail.trim() || null, isGuest: true }));
      sessionStorage.setItem('nova_meeting_code', this.meetingCode);
      this.success = 'Joining…';
      setTimeout(() => this.$router.push('/meeting'), 600);
    },

    async joinWithAuthentication() {
      if (!this.authEmail.trim() || !this.authPassword.trim()) throw new Error('Please enter your email and password.');
      const loginData = await AuthAPI.login(this.authEmail, this.authPassword);
      if (!loginData.accessToken) throw new Error('Login succeeded but no token returned.');
      TokenService.setTokens(loginData.accessToken, loginData.refreshToken);
      const p = this.decodeJwt(loginData.accessToken);
      const user = { id: p.userId || null, email: p.sub || this.authEmail, role: p.role || 'USER', name: this.authEmail.split('@')[0] };
      sessionStorage.setItem('nova_user', JSON.stringify(user));
      this.userData = user;
      await this.joinAsAuthenticated();
    },

    decodeJwt(token) {
      try { return JSON.parse(atob(token.split('.')[1])); } catch { return {}; }
    },

    loadUserData() {
      if (this.isLoggedIn) {
        try { this.userData = JSON.parse(sessionStorage.getItem('nova_user') || '{}'); } catch { this.userData = null; }
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
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

/* ─── Token palette — exact match to Meeting.vue ─── */
.nv-root {
  --c-bg:    #202124;
  --c-surf:  #292b2f;
  --c-surf2: #3c4043;
  --c-line:  #3c4043;
  --c-blue:  #1a73e8;
  --c-blue2: #174ea6;
  --c-green: #34a853;
  --c-red:   #ea4335;
  --c-text:  #e8eaed;
  --c-text2: #9aa0a6;
  --c-r:     8px;
  font-family: 'Google Sans', system-ui, sans-serif;
}

/* ─── Wrapper ─── */
.nv-create-wrap {
  min-height: 100vh;
  background: var(--c-bg);
  color: var(--c-text);
  display: flex;
  flex-direction: column;
}

/* ─── Nav — copy of Meeting.vue .nv-cnav ─── */
.nv-cnav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 32px;
  background: var(--c-surf);
  border-bottom: 1px solid var(--c-line);
}
.nv-cbrand {
  display: flex; align-items: center; gap: 10px;
  font-size: 17px; font-weight: 600; color: var(--c-text);
  cursor: pointer;
}
.nv-cnav-back {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px; border: 1px solid var(--c-line);
  border-radius: var(--c-r); background: transparent;
  color: var(--c-text2); font-family: inherit; font-size: 13px;
  font-weight: 500; cursor: pointer; transition: all .15s;
}
.nv-cnav-back:hover { border-color: var(--c-blue); color: var(--c-text); background: rgba(26,115,232,.08); }

/* ─── Main — copy of Meeting.vue .nv-cmain ─── */
.nv-cmain {
  max-width: 560px;
  margin: 0 auto;
  padding: 44px 24px 60px;
  width: 100%;
}

.nv-chead { margin-bottom: 28px; }
.nv-ctitle { font-size: 26px; font-weight: 600; color: var(--c-text); letter-spacing: -.3px; margin-bottom: 6px; }
.nv-csub   { font-size: 14px; color: var(--c-text2); }

/* ─── Card — copy of Meeting.vue .nv-card ─── */
.nv-card {
  background: var(--c-surf);
  border: 1px solid var(--c-line);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,.4);
}

/* ─── Success/signed-in banner ─── */
.nv-success-banner {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px; border-radius: 12px;
  background: rgba(52,168,83,.1); border: 1px solid rgba(52,168,83,.3);
  margin-bottom: 24px;
}
.nv-success-check {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.nv-success-check--green {
  background: rgba(52,168,83,.2); border: 1px solid rgba(52,168,83,.4); color: #81c995;
}
.nv-success-title { font-size: 14px; font-weight: 600; color: var(--c-text); }
.nv-success-sub   { font-size: 12px; color: var(--c-text2); margin-top: 2px; }
.nv-success-sub strong { color: #81c995; font-weight: 600; }

/* ─── Section label — copy of Meeting.vue .nv-section-label ─── */
.nv-section-label {
  font-size: 11px; font-weight: 600; letter-spacing: .8px;
  text-transform: uppercase; color: var(--c-text2); margin-bottom: 14px;
}

/* ─── Fields — copy of Meeting.vue .nv-field / .nv-flabel / .nv-finput ─── */
.nv-field { margin-bottom: 16px; }
.nv-flabel { display: block; font-size: 13px; font-weight: 500; color: var(--c-text2); margin-bottom: 7px; }
.nv-req { color: var(--c-red); }
.nv-opt { color: #5f6368; font-weight: 400; }

.nv-finput {
  width: 100%; padding: 11px 14px;
  background: var(--c-surf2); border: 1px solid var(--c-line);
  border-radius: var(--c-r); color: var(--c-text);
  font-family: inherit; font-size: 14px;
  transition: border-color .15s, box-shadow .15s;
  box-sizing: border-box;
}
.nv-finput::placeholder { color: #5f6368; }
.nv-finput:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3px rgba(26,115,232,.18); }
.nv-finput:hover:not(:focus) { border-color: #5f6368; }

.nv-finput--mono {
  font-family: 'Google Sans Mono', monospace;
  letter-spacing: 2px; text-transform: uppercase; font-size: 15px;
}
.nv-finput--mono::placeholder { letter-spacing: 1px; text-transform: none; font-size: 14px; }
.nv-finput--pwd { padding-right: 44px; }

/* Two-column row — copy of Meeting.vue .nv-row2 */
.nv-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Password wrapper */
.nv-pwd-wrap { position: relative; }
.nv-pwd-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--c-text2); padding: 4px; border-radius: 4px; transition: color .15s;
}
.nv-pwd-toggle:hover { color: var(--c-text); }

/* ─── Toggle list — copy of Meeting.vue .nv-toggle-list ─── */
.nv-toggle-list { border: 1px solid var(--c-line); border-radius: var(--c-r); overflow: hidden; }
.nv-trow {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 16px; cursor: pointer;
  border-bottom: 1px solid var(--c-line);
  transition: background .12s;
}
.nv-trow:last-child { border-bottom: none; }
.nv-trow:hover { background: rgba(255,255,255,.03); }
.nv-trow--active { background: rgba(26,115,232,.06); }
.nv-trow-label { font-size: 14px; color: var(--c-text); font-weight: 500; }
.nv-trow-sub   { font-size: 12px; color: var(--c-text2); margin-top: 2px; }

/* Radio button (replaces toggle switch for single-select) */
.nv-radio {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--c-line);
  position: relative; flex-shrink: 0;
  transition: border-color .2s;
  display: flex; align-items: center; justify-content: center;
}
.nv-radio--on { border-color: var(--c-blue); }
.nv-radio-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--c-blue);
  transform: scale(0); transition: transform .2s;
}
.nv-radio--on .nv-radio-dot { transform: scale(1); }

/* ─── Buttons — copy of Meeting.vue ─── */
.nv-btn-primary {
  width: 100%; margin-top: 24px; padding: 13px 20px;
  background: var(--c-blue); border: none; border-radius: var(--c-r);
  color: #fff; font-family: inherit; font-size: 15px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background .15s, transform .1s, box-shadow .15s;
  box-shadow: 0 2px 12px rgba(26,115,232,.35);
}
.nv-btn-primary:hover:not(:disabled) { background: var(--c-blue2); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,115,232,.45); }
.nv-btn-primary:disabled { opacity: .55; cursor: not-allowed; }

.nv-postcreate { margin-top: 10px; }
.nv-btn-ghost {
  width: 100%; padding: 12px 20px;
  background: transparent; border: 1px solid var(--c-line);
  border-radius: var(--c-r); color: var(--c-text2);
  font-family: inherit; font-size: 14px; font-weight: 500;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all .15s;
}
.nv-btn-ghost:hover { border-color: var(--c-blue); color: var(--c-text); background: rgba(26,115,232,.06); }

/* ─── Alerts — copy of Meeting.vue .nv-alert-error ─── */
.nv-alert-error,
.nv-alert-success {
  display: flex; align-items: flex-start; gap: 8px;
  margin-top: 14px; padding: 11px 14px;
  border-radius: var(--c-r); font-size: 13px; line-height: 1.5;
}
.nv-alert-error  { background: rgba(234,67,53,.1);  border: 1px solid rgba(234,67,53,.3);  color: #f28b82; }
.nv-alert-success { background: rgba(52,168,83,.1); border: 1px solid rgba(52,168,83,.28); color: #81c995; }

.nv-alert-fx-enter-active, .nv-alert-fx-leave-active { transition: opacity .2s, transform .2s; }
.nv-alert-fx-enter-from { opacity: 0; transform: translateY(-6px); }
.nv-alert-fx-leave-to   { opacity: 0; transform: translateY(-6px); }

/* Spinner — copy of Meeting.vue */
.nv-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: nv-spin .65s linear infinite;
}
@keyframes nv-spin { to { transform: rotate(360deg); } }

/* Footer */
.nv-footer-hint { margin-top: 20px; font-size: 12px; color: #5f6368; text-align: center; }
.nv-link { color: var(--c-text2); text-decoration: none; transition: color .15s; }
.nv-link:hover { color: var(--c-blue); text-decoration: underline; }

/* ─── Responsive ─── */
@media (max-width: 480px) {
  .nv-cnav  { padding: 12px 18px; }
  .nv-card  { padding: 24px 20px; border-radius: 12px; }
  .nv-ctitle { font-size: 22px; }
  .nv-row2  { grid-template-columns: 1fr; }
}
</style>