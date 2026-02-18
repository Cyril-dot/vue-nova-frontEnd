<!-- components/NavBar.vue -->
<template>
  <header class="ns-header" :class="{ 'ns-header--scrolled': isScrolled }">

    <!-- Announcement strip -->
    <div class="ns-strip" v-if="showStrip">
      <span class="ns-strip__dot"></span>
      <span class="ns-strip__text">NovaSpace AI is now in public beta</span>
      <button class="ns-strip__close" @click="showStrip = false" aria-label="Dismiss">✕</button>
    </div>

    <div class="ns-header__bar">
      <div class="ns-header__inner">

        <!-- Logo -->
        <router-link to="/" class="ns-logo">
          <span class="ns-logo__mark" aria-hidden="true">
            <svg width="44" height="44" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42" height="42" rx="11" fill="#0d1b36"/>
              <line x1="8" y1="21" x2="34" y2="21" stroke="#1e3a6e" stroke-width="0.8"/>
              <line x1="21" y1="8" x2="21" y2="34" stroke="#1e3a6e" stroke-width="0.8"/>
              <polygon points="21,10 33,16 21,22 9,16" fill="#4a90e2" opacity="0.95"/>
              <rect x="29" y="16" width="2" height="8" rx="1" fill="#4a90e2"/>
              <circle cx="30" cy="25" r="2" fill="#7db8f0"/>
              <rect x="13" y="25" width="16" height="7" rx="2" fill="#2c6fbd"/>
              <line x1="21" y1="25" x2="21" y2="32" stroke="#4a90e2" stroke-width="1"/>
              <circle cx="33" cy="10" r="2.5" fill="#7dd3fc" opacity="0.9"/>
              <circle cx="33" cy="10" r="4.5" fill="#7dd3fc" opacity="0.18"/>
            </svg>
          </span>
          <span class="ns-logo__text">
            <span class="ns-logo__name">Nova<span class="ns-logo__accent">Space</span></span>
            <span class="ns-logo__sub">· EdTech AI Platform ·</span>
          </span>
        </router-link>

        <!-- Nav desktop -->
        <nav class="ns-nav" aria-label="Main navigation">
          <ul class="ns-nav__list">
            <li class="ns-nav__item">
              <router-link to="/" class="ns-nav__link">Home</router-link>
            </li>
            <li
              class="ns-nav__item"
              ref="solTrigger"
              @mouseenter="openDrop"
              @mouseleave="queueClose"
            >
              <button class="ns-nav__link ns-nav__link--active" type="button">
                Features
                <svg class="ns-nav__chev" :class="{ 'ns-nav__chev--open': dropOpen }" width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </li>
            <li class="ns-nav__item" v-if="!isAuthenticated">
              <a href="#about" class="ns-nav__link">About</a>
            </li>
            <li class="ns-nav__item" v-if="isAuthenticated">
              <router-link to="/dashboard" class="ns-nav__link">Dashboard</router-link>
            </li>
            <li class="ns-nav__item" v-if="isAuthenticated">
              <router-link to="/projects" class="ns-nav__link">Projects</router-link>
            </li>
            <li class="ns-nav__item" v-if="isAuthenticated">
              <router-link to="/ai-assistant" class="ns-nav__link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
                  <rect width="24" height="24" rx="7" fill="currentColor" opacity="0.15"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                AI Assistant
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Actions -->
        <div class="ns-actions">
          <template v-if="!isAuthenticated">
            <router-link to="/auth" class="ns-auth-link">Log in</router-link>
            <router-link to="/auth" class="ns-auth-link ns-auth-link--primary">Sign up</router-link>
          </template>

          <div v-else class="ns-user-menu" @click="toggleUserMenu" ref="userMenuTrigger">
            <div class="ns-user-profile">
              <div class="ns-user-avatar-wrap">
                <img
                  :src="userAvatar"
                  :alt="userName"
                  class="ns-user-avatar"
                  @error="onAvatarError"
                />
              </div>
              <span class="ns-user-name">{{ userName }}</span>
              <svg class="ns-user-chev" :class="{ 'ns-user-chev--open': userMenuOpen }" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <button
            class="ns-toggle"
            :class="{ 'ns-toggle--open': mobileOpen }"
            @click="toggleMobile"
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile drawer -->
    <transition name="ns-slide">
      <div v-if="mobileOpen" class="ns-drawer">
        <ul class="ns-drawer__list">
          <li><router-link to="/" class="ns-drawer__link">Home</router-link></li>
          <li>
            <button class="ns-drawer__link ns-drawer__link--active" @click="mSubOpen = !mSubOpen">
              Features
              <svg class="ns-drawer__chev" :class="{ 'ns-drawer__chev--open': mSubOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <transition name="ns-acc">
              <ul v-if="mSubOpen" class="ns-drawer__sub">
                <li>
                  <router-link to="/ai-assistant" class="ns-drawer__sub-link" @click="mobileOpen = false">
                    AI Assistant
                  </router-link>
                </li>
                <li>
                  <router-link to="/workspace" class="ns-drawer__sub-link ns-drawer__sub-link--workspace" @click="mobileOpen = false">
                    WorkSpace
                  </router-link>
                </li>
                <li>
                  <router-link to="/teams" class="ns-drawer__sub-link ns-drawer__sub-link--teams" @click="mobileOpen = false">
                    Teams
                  </router-link>
                </li>
                <li>
                  <router-link to="/meeting-dashboard" class="ns-drawer__sub-link" @click="mobileOpen = false">
                    Conferencing
                  </router-link>
                </li>
                <li>
                  <router-link to="/chat" class="ns-drawer__sub-link ns-drawer__sub-link--chat" @click="mobileOpen = false">
                    Live Chat
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>
          <li v-if="!isAuthenticated"><a href="#about" class="ns-drawer__link">About</a></li>
          <li v-if="isAuthenticated">
            <router-link to="/dashboard" class="ns-drawer__link">Dashboard</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/projects" class="ns-drawer__link">Projects</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/ai-assistant" class="ns-drawer__link ns-drawer__link--ai" @click="mobileOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="7" fill="#8b5cf6" opacity="0.12"/>
                <path d="M9 12l2 2 4-4" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              AI Assistant
            </router-link>
          </li>
        </ul>

        <!-- Mobile footer - authenticated -->
        <div v-if="isAuthenticated" class="ns-drawer__foot ns-drawer__foot--user">
          <div class="ns-drawer__user">
            <div class="ns-drawer__avatar-wrap">
              <img
                :src="userAvatar"
                :alt="userName"
                class="ns-drawer__avatar"
                @error="onAvatarError"
              />
            </div>
            <div class="ns-drawer__user-info">
              <span class="ns-drawer__user-name">{{ userName }}</span>
              <span class="ns-drawer__user-email">{{ userEmail }}</span>
            </div>
          </div>
          <button @click="handleLogout" class="ns-drawer__logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Logout
          </button>
        </div>

        <!-- Mobile footer - not authenticated -->
        <div v-else class="ns-drawer__foot">
          <router-link to="/auth" class="ns-drawer__login">Log in</router-link>
          <router-link to="/auth" class="ns-drawer__signup">Sign up free →</router-link>
        </div>
      </div>
    </transition>

    <!-- User dropdown (desktop) -->
    <transition name="ns-user-drop">
      <div v-if="userMenuOpen && isAuthenticated" class="ns-user-dropdown" :style="userMenuStyle" @click.stop>
        <div class="ns-user-dropdown__header">
          <div class="ns-user-dropdown__avatar-wrap">
            <img
              :src="userAvatar"
              :alt="userName"
              class="ns-user-dropdown__avatar"
              @error="onAvatarError"
            />
          </div>
          <div class="ns-user-dropdown__info">
            <span class="ns-user-dropdown__name">{{ userName }}</span>
            <span class="ns-user-dropdown__email">{{ userEmail }}</span>
          </div>
        </div>

        <div class="ns-user-dropdown__divider"></div>

        <router-link to="/dashboard" class="ns-user-dropdown__item" @click="closeUserMenu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          </svg>
          Dashboard
        </router-link>

        <router-link to="/projects" class="ns-user-dropdown__item" @click="closeUserMenu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Projects
        </router-link>

        <router-link to="/chat" class="ns-user-dropdown__item ns-user-dropdown__item--chat" @click="closeUserMenu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#4a90e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Chat
        </router-link>

        <router-link to="/ai-assistant" class="ns-user-dropdown__item ns-user-dropdown__item--ai" @click="closeUserMenu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="7" fill="#8b5cf6" opacity="0.12"/>
            <path d="M9 12l2 2 4-4" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          AI Assistant
        </router-link>

        <div class="ns-user-dropdown__divider"></div>

        <button @click="handleLogout" class="ns-user-dropdown__item ns-user-dropdown__item--danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Logout
        </button>
      </div>
    </transition>

    <div v-if="mobileOpen || userMenuOpen" class="ns-backdrop" @click="closeAll"></div>

  </header>
</template>

<script>
import { TokenService, apiRequest, AuthAPI } from '@/utils/apiService';

// ─── Fallback avatars ─────────────────────────────────────────────────────────
const FALLBACK_AVATARS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Princess&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Midnight&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Buster&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Simon&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Coco&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Daisy&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Bella&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Rocky&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Molly&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Jack&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Sophie&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Buddy&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Lily&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Oscar&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Milo&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Cooper&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Ruby&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Toby&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Rosie&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Bear&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Sadie&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Duke&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Chloe&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Zeus&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Pepper&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Bentley&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Stella&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Tucker&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Lola&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Finn&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Willow&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Apollo&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Penny&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=ffdfbf'
];

function getAvatarForSeed(seed) {
  if (!seed) seed = 'default';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash;
  }
  return FALLBACK_AVATARS[Math.abs(hash) % FALLBACK_AVATARS.length];
}

// ─── Helper: read token from either storage ───────────────────────────────────
function readToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || null;
}

export default {
  name: 'NavBar',

  data() {
    return {
      authToken:    !!readToken(),
      isScrolled:   false,
      mobileOpen:   false,
      mSubOpen:     false,
      dropOpen:     false,
      showStrip:    true,
      userMenuOpen: false,
      userMenuStyle: {},
      userData:     null,
      userAvatar:   getAvatarForSeed('default'),
      _closeT:      null,
      _dropEl:      null,
      // ✅ FIX: polling interval handle for OAuth redirect detection
      _pollInterval: null
    };
  },

  computed: {
    isAuthenticated() {
      return this.authToken;
    },
    userName() {
      if (!this.userData) return 'User';
      return this.userData.username || this.userData.email?.split('@')[0] || 'User';
    },
    userEmail() {
      return this.userData?.email || '';
    }
  },

  watch: {
    isAuthenticated: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchUserData();
        } else {
          this.userData   = null;
          this.userAvatar = getAvatarForSeed('default');
        }
      }
    }
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('click', this.handleOutsideClick);
    this._buildDrop();
    if (this.isAuthenticated) this.fetchUserData();

    // ─── Auth event listeners ────────────────────────────────────────────────
    window.addEventListener('auth-login',         this.handleAuthLogin);
    window.addEventListener('auth-logout',        this.handleAuthLogout);
    window.addEventListener('auth-token-updated', this.refreshAuthState);
    // Cross-tab storage changes (also fires for OAuth callbacks in same tab via postMessage)
    window.addEventListener('storage',            this.onStorageChange);

    // ✅ FIX: Watch for route changes — OAuth typically redirects back to a
    //    callback route (e.g. /auth/callback) which then stores tokens and
    //    navigates away. The route change itself is our signal to re-check.
    this.$router.afterEach(() => {
      this.$nextTick(() => this.refreshAuthState());
    });

    // ✅ FIX: Start a short-lived poll right after mount so we catch the
    //    brief window where OAuth sets tokens but hasn't fired any event yet.
    //    Runs every 300ms for 10 seconds, then stops.
    this._startAuthPoll();
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('auth-login',         this.handleAuthLogin);
    window.removeEventListener('auth-logout',        this.handleAuthLogout);
    window.removeEventListener('auth-token-updated', this.refreshAuthState);
    window.removeEventListener('storage',            this.onStorageChange);
    clearTimeout(this._closeT);
    clearInterval(this._pollInterval);
    if (this._dropEl?.parentNode) this._dropEl.parentNode.removeChild(this._dropEl);
  },

  methods: {

    // ✅ FIX: Short-lived poll to catch OAuth token writes that happen without
    //    firing a custom event (e.g. from a redirect callback page).
    _startAuthPoll() {
      let ticks = 0;
      const MAX_TICKS = 33; // ~10 seconds at 300ms
      this._pollInterval = setInterval(() => {
        ticks++;
        const hasToken = !!readToken();
        if (hasToken !== this.authToken) {
          console.log('🔄 NavBar poll detected auth change:', hasToken);
          this.refreshAuthState();
        }
        if (ticks >= MAX_TICKS) {
          clearInterval(this._pollInterval);
          this._pollInterval = null;
        }
      }, 300);
    },

    // ✅ FIX: Called for cross-tab storage events AND direct storage writes
    onStorageChange(e) {
      // Only react to token-related keys
      if (!e || !e.key || e.key === 'accessToken' || e.key === 'refreshToken') {
        this.refreshAuthState();
      }
    },

    // ✅ FIX: Unified method — refreshes authToken from storage.
    //    Works for BOTH normal login and OAuth since both ultimately
    //    write a token to localStorage/sessionStorage.
    refreshAuthState() {
      const prev = this.authToken;
      this.authToken = !!readToken();
      if (!prev && this.authToken) {
        // Just became authenticated — load user data
        console.log('✅ NavBar: auth state became authenticated, fetching user…');
        this.fetchUserData();
      } else if (prev && !this.authToken) {
        // Just became unauthenticated
        this.userData   = null;
        this.userAvatar = getAvatarForSeed('default');
      }
    },

    // ✅ FIX: Dedicated handler for the 'auth-login' event.
    //    Accepts optional user data payload so we can skip the extra API call
    //    when the login flow already has the user object.
    handleAuthLogin(e) {
      const payload = e?.detail;
      this.authToken = !!readToken();
      if (payload?.user) {
        // Login flow passed user data directly — use it
        this.userData = payload.user;
        const seed = String(this.userData.id || this.userData.email || this.userData.username || 'user');
        this.userAvatar = this.userData.profileImage || getAvatarForSeed(seed);
      } else {
        this.fetchUserData();
      }
    },

    onScroll() {
      this.isScrolled = window.scrollY > 50;
      if (this.dropOpen) this._positionDrop();
    },

    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
      if (this.mobileOpen) this.userMenuOpen = false;
    },

    openDrop() {
      clearTimeout(this._closeT);
      this.dropOpen = true;
      this._dropEl.style.display = 'block';
      this.$nextTick(() => this._positionDrop());
    },

    queueClose() {
      this._closeT = setTimeout(() => {
        this.dropOpen = false;
        this._dropEl.style.display = 'none';
      }, 140);
    },

    _positionDrop() {
      const trigger = this.$refs.solTrigger;
      if (!trigger || !this._dropEl) return;
      const r = trigger.getBoundingClientRect();
      const w = 360;
      let left = r.left + r.width / 2 - w / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
      this._dropEl.style.top  = (r.bottom + 8) + 'px';
      this._dropEl.style.left = left + 'px';
      this._dropEl.style.width = w + 'px';
    },

    _buildDrop() {
      const el = document.createElement('div');
      el.className = 'ns-body-drop';
      el.style.cssText = `display:none;position:fixed;z-index:2147483647;font-family:'Manrope',sans-serif;`;

      const items = [
        {
          title: 'AI Assistant',
          desc:  'Smart tutoring, chat & adaptive learning',
          href:  '/ai-assistant',
          iconBg: '#ede9fe', iconColor: '#8b5cf6',
          icon: 'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          isRoute: true,
          badge: 'New'
        },
        {
          title: 'WorkSpace',
          desc:  'Code & document workspace manager',
          href:  '/workspace',
          iconBg: '#d1fae5', iconColor: '#10b981',
          icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
          isRoute: true,
          badge: 'New'
        },
        {
          title: 'Teams',
          desc:  'Collaborate with team members',
          href:  '/teams',
          iconBg: '#fef3c7', iconColor: '#f59e0b',
          icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 108 0 4 4 0 00-8 0zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
          isRoute: true,
          badge: 'New'
        },
        {
          title: 'Conferencing',
          desc:  'HD virtual classrooms & meetings',
          href:  '/meeting-dashboard',
          iconBg: '#e8f2fc', iconColor: '#4a90e2',
          icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
          isRoute: true
        },
        {
          title: 'Live Chat',
          desc:  'Real-time messaging & Q&A sessions',
          href:  '/chat',
          iconBg: '#e8f2fc', iconColor: '#4a90e2',
          icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 11.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
          isRoute: true
        }
      ];

      el.innerHTML = `
        <div class="ns-body-drop__arrow"></div>
        <div class="ns-body-drop__box">
          ${items.map(item => `
            <a href="${item.href}" class="ns-body-drop__item${item.href === '/ai-assistant' ? ' ns-body-drop__item--ai' : ''}${item.href === '/workspace' ? ' ns-body-drop__item--workspace' : ''}${item.href === '/teams' ? ' ns-body-drop__item--teams' : ''}" data-route="${item.isRoute ? 'true' : 'false'}">
              <span class="ns-body-drop__ico" style="background:${item.iconBg}; border-color:${item.iconBg};">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="${item.icon}" stroke="${item.iconColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="ns-body-drop__text">
                <span class="ns-body-drop__title"${item.href === '/ai-assistant' ? ' style="color:#8b5cf6"' : ''}${item.href === '/workspace' ? ' style="color:#10b981"' : ''}${item.href === '/teams' ? ' style="color:#f59e0b"' : ''}>${item.title}</span>
                <span class="ns-body-drop__desc">${item.desc}</span>
              </span>
              ${item.badge ? `<span class="ns-body-drop__badge${item.href === '/workspace' ? ' ns-body-drop__badge--workspace' : ''}${item.href === '/teams' ? ' ns-body-drop__badge--teams' : ''}">${item.badge}</span>` : ''}
            </a>
          `).join('')}
        </div>
      `;

      el.querySelectorAll('.ns-body-drop__item[data-route="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          this.$router.push(href);
          this.queueClose();
        });
      });

      el.addEventListener('mouseenter', () => clearTimeout(this._closeT));
      el.addEventListener('mouseleave', () => this.queueClose());

      document.body.appendChild(el);
      this._dropEl = el;

      if (!document.getElementById('ns-body-drop-styles')) {
        const s = document.createElement('style');
        s.id = 'ns-body-drop-styles';
        s.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700&display=swap');
          .ns-body-drop { animation: ns-dropin 0.18s cubic-bezier(0.22,1,0.36,1); }
          .ns-body-drop__arrow {
            position:absolute; top:-6px; left:50%;
            transform:translateX(-50%) rotate(45deg);
            width:12px; height:12px; background:#fff;
            border-top:1px solid #e2ecf6; border-left:1px solid #e2ecf6;
            border-radius:2px; z-index:1;
          }
          .ns-body-drop__box {
            background:#fff; border:1px solid #e2ecf6; border-radius:16px; padding:10px;
            box-shadow:0 4px 6px rgba(0,0,0,0.04),0 24px 56px rgba(74,144,226,0.2);
            position:relative;
          }
          .ns-body-drop__item {
            display:flex; align-items:center; gap:14px; padding:14px;
            border-radius:10px; text-decoration:none; position:relative; transition:background 0.16s;
            cursor:pointer;
          }
          .ns-body-drop__item + .ns-body-drop__item { margin-top:2px; }
          .ns-body-drop__item:hover { background:#f8fafc; }
          .ns-body-drop__item--ai:hover { background:#f5f3ff; }
          .ns-body-drop__item--workspace:hover { background:#f0fdf4; }
          .ns-body-drop__item--teams:hover { background:#fffbeb; }
          .ns-body-drop__item::after {
            content:''; position:absolute; bottom:7px; left:52px; right:14px;
            height:1.5px; border-radius:2px; background:#4a90e2;
            transform:scaleX(0); transform-origin:left;
            transition:transform 0.2s cubic-bezier(0.22,1,0.36,1);
          }
          .ns-body-drop__item--ai::after { background:#8b5cf6; }
          .ns-body-drop__item--workspace::after { background:#10b981; }
          .ns-body-drop__item--teams::after { background:#f59e0b; }
          .ns-body-drop__item:hover::after { transform:scaleX(1); }
          .ns-body-drop__ico {
            display:flex; align-items:center; justify-content:center; flex-shrink:0;
            width:38px; height:38px; border-radius:9px; border:1px solid transparent;
          }
          .ns-body-drop__text { display:flex; flex-direction:column; gap:2px; flex:1; }
          .ns-body-drop__title { font-size:14.5px; font-weight:700; color:#0d1b36; line-height:1.2; }
          .ns-body-drop__desc  { font-size:12.5px; color:#64748b; line-height:1.4; }
          .ns-body-drop__badge {
            flex-shrink:0; padding:3px 8px; background:#ede9fe; color:#8b5cf6;
            font-size:11px; font-weight:700; border-radius:20px; letter-spacing:0.3px;
          }
          .ns-body-drop__badge--workspace { background:#d1fae5; color:#10b981; }
          .ns-body-drop__badge--teams { background:#fef3c7; color:#f59e0b; }
          @keyframes ns-dropin {
            from { opacity:0; transform:translateY(6px); }
            to   { opacity:1; transform:translateY(0); }
          }
        `;
        document.head.appendChild(s);
      }
    },

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
      if (this.userMenuOpen) {
        this.mobileOpen = false;
        this.$nextTick(() => this.positionUserMenu());
      }
    },

    closeUserMenu() { this.userMenuOpen = false; },

    closeAll() {
      this.mobileOpen   = false;
      this.userMenuOpen = false;
    },

    handleOutsideClick(e) {
      const userMenu = this.$refs.userMenuTrigger;
      if (this.userMenuOpen && userMenu && !userMenu.contains(e.target)) {
        this.closeUserMenu();
      }
    },

    positionUserMenu() {
      const trigger = this.$refs.userMenuTrigger;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const dropdownWidth = 280;
      let left = rect.right - dropdownWidth;
      left = Math.max(12, Math.min(left, window.innerWidth - dropdownWidth - 12));
      this.userMenuStyle = {
        top:   `${rect.bottom + 8}px`,
        left:  `${left}px`,
        width: `${dropdownWidth}px`
      };
    },

    async fetchUserData() {
      try {
        const response = await apiRequest('/auth/me', { method: 'GET' });
        if (response.ok) {
          this.userData = await response.json();
          if (this.userData.profileImage) {
            this.userAvatar = this.userData.profileImage;
          } else {
            const seed = String(this.userData.id || this.userData.email || this.userData.username || 'user');
            this.userAvatar = getAvatarForSeed(seed);
          }
        } else {
          this.userAvatar = getAvatarForSeed('fallback');
        }
      } catch (error) {
        this.userAvatar = getAvatarForSeed('error');
      }
    },

    onAvatarError(event) {
      const el = event.target;
      el.onerror = null;
      el.src = getAvatarForSeed('imgfallback');
    },

    async handleLogout() {
      if (confirm('Are you sure you want to logout?')) {
        try {
          await AuthAPI.logout();
          this.userData   = null;
          this.userAvatar = getAvatarForSeed('default');
          this.authToken  = false;
          this.closeAll();
          window.dispatchEvent(new Event('auth-logout'));
          this.$router.push('/auth');
        } catch (error) {
          console.error('Error during logout:', error);
        }
      }
    },

    handleAuthLogout() {
      this.userData   = null;
      this.userAvatar = getAvatarForSeed('default');
      this.authToken  = false;
      this.closeAll();
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

:root {
  --blue:        #4a90e2;
  --blue-dk:     #2c6fbd;
  --blue-soft:   #e8f2fc;
  --blue-mid:    #c9dff5;
  --blue-glow:   rgba(74,144,226,0.22);
  --ink:         #0d1b36;
  --ink-s:       #2d3748;
  --ink-m:       #64748b;
  --white:       #ffffff;
  --border:      #e2ecf6;
  --red:         #ef4444;
  --purple:      #8b5cf6;
  --purple-soft: #ede9fe;
  --green:       #10b981;
  --green-soft:  #d1fae5;
  --amber:       #f59e0b;
  --amber-soft:  #fef3c7;
  --strip-h:     46px;
  --bar-h:       88px;
  --font:        'Manrope', sans-serif;
  --fdisp:       'Space Grotesk', sans-serif;
  --ease:        cubic-bezier(0.22,1,0.36,1);
}
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
button { font:inherit; cursor:pointer; }

/* ── HEADER ─────────────────────────────────────────────── */
.ns-header { position:sticky; top:0; z-index:9000; width:100%; font-family:var(--font); }

/* Strip */
.ns-strip {
  display:flex; align-items:center; justify-content:center; gap:9px;
  height:var(--strip-h);
  background:linear-gradient(90deg,#0d2a6e 0%,#1a5fb4 45%,#4a90e2 100%);
  font-size:13px; font-weight:500; color:rgba(255,255,255,0.9);
  padding:0 22px; position:relative; overflow:hidden;
}
.ns-strip::before {
  content:''; position:absolute; inset:0;
  background:repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 64px);
}
.ns-strip__dot {
  width:7px; height:7px; background:#7dd3fc; border-radius:50%;
  box-shadow:0 0 0 3px rgba(125,211,252,0.25);
  animation:ns-pulse 2s infinite; flex-shrink:0;
}
.ns-strip__text { color:rgba(255,255,255,0.85); }
.ns-strip__close {
  position:absolute; right:16px; background:none; border:none;
  color:rgba(255,255,255,0.55); font-size:12px; padding:5px 7px;
  border-radius:4px; transition:color 0.15s;
}
.ns-strip__close:hover { color:#fff; }

/* Bar */
.ns-header__bar {
  height:var(--bar-h); background:var(--white);
  border-bottom:1px solid var(--border);
  transition:background 0.3s var(--ease),box-shadow 0.3s var(--ease),border-color 0.3s var(--ease);
}
.ns-header--scrolled .ns-header__bar {
  background:rgba(255,255,255,0.93);
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  border-bottom-color:transparent;
  box-shadow:0 1px 0 var(--border),0 8px 32px rgba(74,144,226,0.09);
}
.ns-header__inner {
  max-width:1280px; margin:0 auto; padding:0 44px;
  height:100%; display:flex; align-items:center;
}

/* Logo */
.ns-logo { display:flex; align-items:center; gap:15px; text-decoration:none; flex-shrink:0; margin-right:48px; }
.ns-logo__mark { display:flex; align-items:center; justify-content:center; filter:drop-shadow(0 3px 10px rgba(74,144,226,0.3)); transition:filter 0.4s var(--ease); }
.ns-logo:hover .ns-logo__mark { filter:drop-shadow(0 6px 18px rgba(74,144,226,0.5)); }
.ns-logo__text { display:flex; flex-direction:column; gap:3px; }
.ns-logo__name { font-family:var(--fdisp); font-size:24px; font-weight:700; line-height:1; color:var(--ink); letter-spacing:-0.03em; }
.ns-logo__accent { color:var(--blue); }
.ns-logo__sub { font-size:10px; font-weight:600; color:var(--ink-m); letter-spacing:0.1em; text-transform:uppercase; line-height:1; }

/* Nav */
.ns-nav { flex:1; display:flex; justify-content:center; }
.ns-nav__list { list-style:none; display:flex; align-items:center; gap:4px; }
.ns-nav__item { position:relative; }

.ns-nav__link {
  display:inline-flex !important; align-items:center; gap:6px;
  padding:20px 17px; border-radius:10px;
  font-size:16px; font-weight:500; font-family:var(--font);
  color:var(--ink-s); text-decoration:none !important;
  background:none !important; border:none; white-space:nowrap;
  position:relative; transition:color 0.18s;
}
.ns-nav__link::after {
  content:'' !important; position:absolute;
  bottom:9px; left:17px; right:17px;
  height:2px; border-radius:2px; background:var(--blue) !important;
  transform:scaleX(0); transform-origin:left;
  transition:transform 0.22s var(--ease);
}
.ns-nav__link:hover { color:var(--ink) !important; }
.ns-nav__link:hover::after { transform:scaleX(1) !important; }
.ns-nav__link.router-link-active { color:var(--blue) !important; font-weight:700; }
.ns-nav__link.router-link-active::after { transform:scaleX(1) !important; }
.ns-nav__chev { color:var(--ink-m); transition:transform 0.22s var(--ease); }
.ns-nav__chev--open { transform:rotate(180deg); }

.ns-nav__item:last-child .ns-nav__link.router-link-active { color:var(--purple) !important; }
.ns-nav__item:last-child .ns-nav__link.router-link-active::after { background:var(--purple) !important; }
.ns-nav__item:last-child .ns-nav__link:hover { color:var(--purple) !important; }

/* Actions */
.ns-actions { display:flex; align-items:center; gap:10px; margin-left:auto; flex-shrink:0; }

/* Auth links */
.ns-auth-link {
  padding:20px 22px; border-radius:10px;
  font-size:16px; font-weight:600; font-family:var(--font);
  color:var(--ink-s); text-decoration:none !important;
  position:relative; transition:color 0.18s,background 0.18s; display:inline-block;
}
.ns-auth-link::after {
  content:'' !important; position:absolute; bottom:10px; left:22px; right:22px;
  height:1.5px; border-radius:2px; background:var(--blue) !important;
  transform:scaleX(0); transform-origin:left;
  transition:transform 0.22s var(--ease); display:block;
}
.ns-auth-link:hover { color:var(--blue) !important; }
.ns-auth-link:hover::after { transform:scaleX(1) !important; }
.ns-auth-link--primary {
  background:var(--blue) !important; color:var(--white) !important;
  box-shadow:0 4px 12px var(--blue-glow);
}
.ns-auth-link--primary::after { display:none !important; }
.ns-auth-link--primary:hover { background:var(--blue-dk) !important; color:var(--white) !important; }

/* User menu */
.ns-user-menu { position:relative; }
.ns-user-profile {
  display:flex; align-items:center; gap:12px;
  padding:10px 16px 10px 10px; border-radius:12px;
  border:1.5px solid var(--border); background:var(--white);
  cursor:pointer; transition:all 0.2s var(--ease);
}
.ns-user-profile:hover { border-color:var(--blue-mid); box-shadow:0 2px 8px var(--blue-glow); }
.ns-user-avatar-wrap {
  width:36px; height:36px; border-radius:10px;
  overflow:hidden; flex-shrink:0;
  background:linear-gradient(135deg,#c0aede,#b6e3f4);
  border:2px solid var(--border);
  display:flex; align-items:center; justify-content:center;
}
.ns-user-avatar { width:100%; height:100%; object-fit:cover; display:block; }
.ns-user-name { font-size:15px; font-weight:600; color:var(--ink); max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ns-user-chev { color:var(--blue); transition:transform 0.22s var(--ease); flex-shrink:0; margin-left:4px; }
.ns-user-chev--open { transform:rotate(180deg); }

/* User dropdown */
.ns-user-dropdown {
  position:fixed; z-index:9999;
  background:var(--white); border:1px solid var(--border); border-radius:16px;
  box-shadow:0 8px 32px rgba(74,144,226,0.15); padding:8px; min-width:280px;
}
.ns-user-dropdown__header { display:flex; align-items:center; gap:12px; padding:16px 12px; }
.ns-user-dropdown__avatar-wrap {
  width:48px; height:48px; border-radius:12px; overflow:hidden; flex-shrink:0;
  background:linear-gradient(135deg,#c0aede,#b6e3f4);
  border:2px solid var(--border);
  display:flex; align-items:center; justify-content:center;
}
.ns-user-dropdown__avatar { width:100%; height:100%; object-fit:cover; display:block; }
.ns-user-dropdown__info { display:flex; flex-direction:column; gap:4px; flex:1; min-width:0; }
.ns-user-dropdown__name  { font-size:15px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ns-user-dropdown__email { font-size:13px; color:var(--ink-m); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ns-user-dropdown__divider { height:1px; background:var(--border); margin:8px 0; }
.ns-user-dropdown__item {
  display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:10px;
  font-size:14px; font-weight:500; color:var(--ink);
  text-decoration:none; background:none; border:none;
  width:100%; text-align:left; transition:all 0.2s var(--ease); cursor:pointer;
}
.ns-user-dropdown__item:hover { background:var(--blue-soft); color:var(--blue); }
.ns-user-dropdown__item svg { flex-shrink:0; opacity:0.7; }
.ns-user-dropdown__item:hover svg { opacity:1; }
.ns-user-dropdown__item--chat:hover { background:var(--blue-soft); color:var(--blue); }
.ns-user-dropdown__item--ai:hover { background:var(--purple-soft); color:var(--purple); }
.ns-user-dropdown__item--danger { color:var(--red); }
.ns-user-dropdown__item--danger:hover { background:#fee; color:var(--red); }

/* Hamburger */
.ns-toggle {
  display:none; flex-direction:column; justify-content:center; align-items:center;
  gap:5px; width:48px; height:48px; border-radius:10px;
  border:1.5px solid var(--border); background:none; transition:border-color 0.18s;
}
.ns-toggle:hover { border-color:var(--blue-mid); }
.ns-toggle span { display:block; width:20px; height:1.5px; background:var(--ink); border-radius:2px; transform-origin:center; transition:transform 0.25s var(--ease),opacity 0.2s,width 0.2s; }
.ns-toggle--open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
.ns-toggle--open span:nth-child(2) { opacity:0; width:0; }
.ns-toggle--open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

/* Mobile drawer */
.ns-drawer {
  position:fixed; top:var(--bar-h); right:0; bottom:0;
  width:min(396px,88vw); background:var(--white);
  border-left:1px solid var(--border);
  box-shadow:-12px 0 48px rgba(74,144,226,0.1);
  display:flex; flex-direction:column; z-index:9500;
  overflow-y:auto; padding:28px 20px 44px;
}
.ns-drawer__list { list-style:none; display:flex; flex-direction:column; gap:2px; }
.ns-drawer__link {
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  padding:20px 22px; border-radius:11px;
  font-size:18px; font-weight:500; color:var(--ink-s);
  text-decoration:none; background:none; border:none; width:100%;
  cursor:pointer; position:relative; transition:color 0.18s;
}
.ns-drawer__link::before {
  content:''; position:absolute; bottom:10px; left:22px; right:44px;
  height:1.5px; background:var(--blue); border-radius:2px;
  transform:scaleX(0); transform-origin:left; transition:transform 0.22s var(--ease);
}
.ns-drawer__link:hover { color:var(--ink); }
.ns-drawer__link:hover::before { transform:scaleX(1); }
.ns-drawer__link.router-link-active { color:var(--blue); font-weight:700; }
.ns-drawer__link.router-link-active::before { transform:scaleX(1); }
.ns-drawer__link--ai { color:var(--purple) !important; }
.ns-drawer__link--ai::before { background:var(--purple) !important; }
.ns-drawer__link--ai.router-link-active { color:var(--purple) !important; }
.ns-drawer__link--chat { color:var(--blue) !important; }
.ns-drawer__link--chat::before { background:var(--blue) !important; }
.ns-drawer__link--chat.router-link-active { color:var(--blue); font-weight:700; }
.ns-drawer__chev { color:var(--blue); transition:transform 0.25s var(--ease); margin-left:auto; flex-shrink:0; }
.ns-drawer__chev--open { transform:rotate(180deg); }

.ns-drawer__sub { list-style:none; padding:4px 0 4px 22px; display:flex; flex-direction:column; gap:2px; }
.ns-drawer__sub-link {
  display:flex; align-items:center; gap:10px; padding:14px 16px; border-radius:9px;
  font-size:16px; font-weight:500; color:var(--ink-m);
  text-decoration:none; transition:color 0.16s; position:relative;
}
.ns-drawer__sub-link::before { content:'·'; color:var(--blue); font-size:20px; line-height:0; }
.ns-drawer__sub-link:hover { color:var(--blue); }
.ns-drawer__sub li:first-child .ns-drawer__sub-link::before { color:var(--purple); }
.ns-drawer__sub li:first-child .ns-drawer__sub-link:hover { color:var(--purple); }
.ns-drawer__sub li:first-child .ns-drawer__sub-link.router-link-active { color:var(--purple); }
.ns-drawer__sub li:nth-child(2) .ns-drawer__sub-link::before { color:var(--green); }
.ns-drawer__sub li:nth-child(2) .ns-drawer__sub-link:hover { color:var(--green); }
.ns-drawer__sub li:nth-child(2) .ns-drawer__sub-link.router-link-active { color:var(--green); }
.ns-drawer__sub li:nth-child(3) .ns-drawer__sub-link::before { color:var(--amber); }
.ns-drawer__sub li:nth-child(3) .ns-drawer__sub-link:hover { color:var(--amber); }
.ns-drawer__sub li:nth-child(3) .ns-drawer__sub-link.router-link-active { color:var(--amber); }

/* Drawer footer */
.ns-drawer__foot { margin-top:auto; padding-top:32px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:12px; }
.ns-drawer__foot--user { gap:16px; }
.ns-drawer__user { display:flex; align-items:center; gap:14px; padding:14px; border-radius:12px; background:var(--blue-soft); border:1px solid var(--blue-mid); }
.ns-drawer__avatar-wrap {
  width:52px; height:52px; border-radius:12px; overflow:hidden; flex-shrink:0;
  background:linear-gradient(135deg,#c0aede,#b6e3f4);
  border:2px solid var(--white);
  display:flex; align-items:center; justify-content:center;
}
.ns-drawer__avatar { width:100%; height:100%; object-fit:cover; display:block; }
.ns-drawer__user-info { display:flex; flex-direction:column; gap:4px; flex:1; min-width:0; }
.ns-drawer__user-name  { font-size:16px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ns-drawer__user-email { font-size:13px; color:var(--ink-m); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ns-drawer__logout { display:flex; align-items:center; justify-content:center; gap:10px; padding:18px; border-radius:11px; border:1.5px solid var(--border); font-size:16px; font-weight:600; color:var(--red); text-decoration:none; transition:all 0.18s; background:var(--white); }
.ns-drawer__logout:hover { background:#fee; border-color:var(--red); }
.ns-drawer__login  { display:flex; justify-content:center; padding:18px; border-radius:11px; border:1.5px solid var(--border); font-size:18px; font-weight:600; color:var(--ink-s); text-decoration:none; transition:color 0.18s,border-color 0.18s; }
.ns-drawer__login:hover  { color:var(--blue); border-color:var(--blue-mid); }
.ns-drawer__signup { display:flex; justify-content:center; padding:19px; border-radius:11px; background:var(--blue); font-size:18px; font-weight:700; color:var(--white); text-decoration:none; box-shadow:0 4px 16px var(--blue-glow); transition:background 0.2s; }
.ns-drawer__signup:hover { background:var(--blue-dk); }

/* Backdrop */
.ns-backdrop { position:fixed; inset:var(--bar-h) 0 0 0; background:rgba(13,17,23,0.3); backdrop-filter:blur(3px); z-index:9400; animation:ns-fade 0.2s var(--ease); }

/* Transitions */
.ns-slide-enter-active,.ns-slide-leave-active { transition:transform 0.32s var(--ease),opacity 0.25s; }
.ns-slide-enter-from,.ns-slide-leave-to { transform:translateX(100%); opacity:0; }
.ns-acc-enter-active,.ns-acc-leave-active { transition:max-height 0.28s var(--ease),opacity 0.22s; max-height:240px; }
.ns-acc-enter-from,.ns-acc-leave-to { max-height:0; opacity:0; }
.ns-user-drop-enter-active,.ns-user-drop-leave-active { transition:opacity 0.2s var(--ease),transform 0.2s var(--ease); }
.ns-user-drop-enter-from,.ns-user-drop-leave-to { opacity:0; transform:translateY(-8px); }

/* Responsive */
@media (max-width:1060px) {
  .ns-header__inner { padding:0 28px; }
  .ns-logo { margin-right:28px; }
  .ns-nav__link { font-size:15px; padding:20px 13px; }
  .ns-nav__link::after { left:13px; right:13px; }
  .ns-auth-link { padding:20px 18px; font-size:15px; }
  .ns-auth-link::after { left:18px; right:18px; }
}
@media (max-width:820px) {
  .ns-nav { display:none; }
  .ns-auth-link { display:none; }
  .ns-user-name { display:none; }
  .ns-toggle { display:flex; }
  .ns-header__inner { padding:0 24px; }
  .ns-logo { margin-right:auto; }
}
@media (max-width:480px) {
  .ns-header__inner { padding:0 18px; }
  .ns-logo__sub { display:none; }
  .ns-strip__text { display:none; }
}

@keyframes ns-fade  { from{opacity:0} to{opacity:1} }
@keyframes ns-pulse {
  0%,100% { opacity:1; box-shadow:0 0 0 3px rgba(125,211,252,0.25); }
  50%      { opacity:0.7; box-shadow:0 0 0 6px rgba(125,211,252,0.1); }
}
</style>