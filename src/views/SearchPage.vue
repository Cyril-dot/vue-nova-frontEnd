<!-- views/SearchPage.vue -->
<template>
  <div class="search-shell">

    <!-- ── Header ── -->
    <header class="search-header">
      <button class="back-btn" @click="$router.push('/apps')">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Apps
      </button>

      <div class="header-content">
        <div class="header-icon">
          <!-- Google-coloured search icon -->
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="ggrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stop-color="#4285F4"/>
                <stop offset="33%"  stop-color="#EA4335"/>
                <stop offset="66%"  stop-color="#FBBC05"/>
                <stop offset="100%" stop-color="#34A853"/>
              </linearGradient>
            </defs>
            <circle cx="11" cy="11" r="7.5" stroke="url(#ggrad)" stroke-width="2.4"/>
            <path d="M21 21l-4.2-4.2" stroke="url(#ggrad)" stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="header-text">
          <h1 class="header-title">Web Search</h1>
          <p class="header-subtitle">Powered by Google Custom Search</p>
        </div>
        <div class="g-dots">
          <span class="g-dot" style="background:#4285F4"></span>
          <span class="g-dot" style="background:#EA4335"></span>
          <span class="g-dot" style="background:#FBBC05"></span>
          <span class="g-dot" style="background:#34A853"></span>
        </div>
      </div>
    </header>

    <!-- ── Body ── -->
    <div class="search-body">

      <!-- Suggestion chips — collapse once user interacts -->
      <transition name="fade-slide">
        <div v-if="showIntro" class="intro-card">
          <p class="intro-label">Try a quick search</p>
          <div class="chip-row">
            <button
              v-for="chip in suggestions"
              :key="chip"
              class="chip"
              @click="prefillSearch(chip)"
            >{{ chip }}</button>
          </div>
        </div>
      </transition>

      <!-- ── Google CSE Widget ── -->
      <div class="cse-card">
        <div class="gcse-search"></div>
      </div>

    </div>

  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';

export default {
  name: 'SearchPage',

  data() {
    return {
      showIntro: true,
      suggestions: [
        'Latest AI news 2026',
        'Vue 3 best practices',
        'Spring Boot REST API',
        'Open source tools',
        'Remote work productivity',
      ],
    };
  },

  methods: {
    /**
     * Prefill the CSE widget's own input and fire the search.
     * The CSE injects an <input class="gsc-input"> into the DOM.
     */
    prefillSearch(term) {
      this.showIntro = false;
      this.$nextTick(() => {
        const input = document.querySelector('input.gsc-input');
        if (input) {
          input.value = term;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          const btn = document.querySelector(
            'button.gsc-search-button-v2, input[type="submit"].gsc-search-button'
          );
          if (btn) btn.click();
        }
      });
    },

    loadCSE() {
      // Only inject the script once across route changes
      if (document.getElementById('gcse-script')) return;

      // Collapse intro when user types in the CSE box
      window.__gcse = {
        parsetags: 'onload',
        callback: () => {
          document.addEventListener('keyup', (e) => {
            if (e.target?.classList?.contains('gsc-input')) {
              this.showIntro = false;
            }
          });
        },
      };

      const s   = document.createElement('script');
      s.id      = 'gcse-script';
      s.async   = true;
      s.src     = 'https://cse.google.com/cse.js?cx=b1262f50645c241c2';
      document.head.appendChild(s);
    },
  },

  mounted() {
    if (!TokenService.isAuthenticated()) {
      this.$router.push('/auth');
      return;
    }
    this.loadCSE();
  },
};
</script>

<!-- ─────────────────────────────────────────────
     SCOPED — layout & shell only
───────────────────────────────────────────── -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.search-shell {
  --blue:      #4285F4;
  --blue-dk:   #2c6fbd;
  --blue-soft: #e8f2fc;
  --blue-mid:  #c9dff5;
  --ink:       #0d1b36;
  --ink-m:     #64748b;
  --ink-l:     #94a3b8;
  --white:     #ffffff;
  --border:    #e2ecf6;
  --bg:        #f8fafc;
  --r:         16px;
  --ease:      cubic-bezier(0.22,1,0.36,1);
  --font:      'Manrope', sans-serif;

  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font);
  color: var(--ink);
}

/* ── Header ── */
.search-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 14px 28px 18px;
  position: sticky; 
  top: 0; 
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,.03);
}

.back-btn {
  display: inline-flex; 
  align-items: center; 
  gap: 7px;
  padding: 8px 16px; 
  background: var(--bg);
  border: 1px solid var(--border); 
  border-radius: 10px;
  font-size: 13px; 
  font-weight: 600; 
  color: var(--ink-m);
  cursor: pointer; 
  transition: all .2s var(--ease);
  margin-bottom: 16px; 
  font-family: var(--font);
}
.back-btn:hover { 
  border-color: var(--blue); 
  color: var(--blue); 
  background: var(--blue-soft);
  transform: translateY(-1px);
}

.header-content { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
}

.header-icon {
  width: 52px; 
  height: 52px;
  background: var(--blue-soft); 
  border: 1px solid var(--blue-mid);
  border-radius: 14px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(66,133,244,.08);
}
.header-text { flex: 1; }
.header-title    { 
  font-size: 24px; 
  font-weight: 800; 
  color: var(--ink); 
  margin: 0 0 4px; 
  letter-spacing: -0.3px;
}
.header-subtitle { 
  font-size: 13px; 
  color: var(--ink-m); 
  font-weight: 500; 
  margin: 0; 
  display: flex;
  align-items: center;
  gap: 6px;
}
.header-subtitle::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--blue);
  border-radius: 50%;
  opacity: 0.5;
}

.g-dots { 
  display: flex; 
  gap: 8px; 
  margin-left: auto; 
  background: var(--bg);
  padding: 6px 12px;
  border-radius: 40px;
  border: 1px solid var(--border);
}
.g-dot  { 
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  transition: transform .2s var(--ease);
}
.g-dot:hover {
  transform: scale(1.2);
}

/* ── Body ── */
.search-body {
  max-width: 1000px; 
  margin: 0 auto;
  padding: 32px 24px 60px;
  display: flex; 
  flex-direction: column; 
  gap: 20px;
}

/* ── Intro card ── */
.intro-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,.04);
  transition: box-shadow .2s var(--ease);
}
.intro-card:hover {
  box-shadow: 0 8px 24px rgba(66,133,244,.08);
}
.intro-label {
  font-size: 12px; 
  font-weight: 700; 
  color: var(--ink-l);
  text-transform: uppercase; 
  letter-spacing: .8px;
  margin: 0 0 14px;
}
.chip-row { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 10px; 
}
.chip {
  padding: 8px 18px; 
  background: var(--bg); 
  border: 1px solid var(--border);
  border-radius: 40px; 
  font-size: 13px; 
  font-weight: 600; 
  color: var(--ink-m);
  cursor: pointer; 
  transition: all .2s var(--ease); 
  font-family: var(--font);
}
.chip:hover {
  border-color: var(--blue); 
  color: var(--blue);
  background: var(--blue-soft); 
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66,133,244,.12);
}

/* ── CSE card ── */
.cse-card {
  background: transparent;
  min-height: 200px;
  width: 100%;
}

/* ── Transitions ── */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity .3s var(--ease), transform .3s var(--ease);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0; 
  transform: translateY(-8px);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .search-header { padding: 12px 16px 14px; }
  .search-body   { padding: 16px 14px 48px; }
  .cse-card      { padding: 0; }
  .header-title  { font-size: 20px; }
  .header-icon   { width: 44px; height: 44px; }
  .g-dots        { display: none; }
  .intro-card    { padding: 16px 18px; }
  .chip          { padding: 6px 14px; font-size: 12px; }
}
</style>

<!-- ─────────────────────────────────────────────
     GLOBAL (unscoped) — themes the CSE widget DOM
     Must be unscoped to reach Google-injected elements
───────────────────────────────────────────── -->
<style>
/* Main container fixes - this fixes the "glassy" look */
.gsc-control-cse {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  font-family: 'Manrope', sans-serif !important;
}

/* Search box container */
.gsc-search-box {
  margin-bottom: 24px !important;
}

/* Input box */
.gsc-input-box {
  border: 2px solid #e2ecf6 !important;
  border-radius: 50px !important;
  background: #ffffff !important;
  transition: border-color .2s, box-shadow .2s !important;
  height: 52px !important;
}
.gsc-input-box:focus-within {
  border-color: #4285F4 !important;
  box-shadow: 0 0 0 4px rgba(66,133,244,.1) !important;
}
input.gsc-input {
  font-family: 'Manrope', sans-serif !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #0d1b36 !important;
  background: transparent !important;
  padding: 0 20px !important;
  height: 48px !important;
  text-indent: 0 !important;
}
input.gsc-input::placeholder { 
  color: #94a3b8 !important; 
  font-weight: 400 !important;
}

/* Search button */
button.gsc-search-button-v2,
input.gsc-search-button {
  background: #4285F4 !important;
  border: none !important;
  border-radius: 40px !important;
  padding: 0 28px !important;
  height: 52px !important;
  font-family: 'Manrope', sans-serif !important;
  font-weight: 700 !important;
  font-size: 15px !important;
  cursor: pointer !important;
  transition: all .2s !important;
  margin-left: 8px !important;
  color: white !important;
  letter-spacing: 0.3px !important;
}
button.gsc-search-button-v2:hover,
input.gsc-search-button:hover {
  background: #2c6fbd !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(66,133,244,.3) !important;
}
button.gsc-search-button-v2 svg { 
  fill: #fff !important;
  width: 18px !important;
  height: 18px !important;
}

/* Results container - FIXES THE GLASSY LOOK */
.gsc-results-wrapper-visible {
  background: transparent !important;
  padding: 0 !important;
}

.gsc-results {
  background: transparent !important;
  padding: 0 !important;
  width: 100% !important;
}

/* Result cards - now with solid background and proper spacing */
.gsc-webResult.gsc-result,
.gsc-imageResult {
  background: #ffffff !important;
  border: 1px solid #e2ecf6 !important;
  border-radius: 16px !important;
  padding: 20px 24px !important;
  margin-bottom: 16px !important;
  transition: all .2s !important;
  box-shadow: 0 2px 8px rgba(0,0,0,.02) !important;
}
.gsc-webResult.gsc-result:hover {
  border-color: #c9dff5 !important;
  box-shadow: 0 8px 24px rgba(66,133,244,.12) !important;
  transform: translateY(-2px) !important;
}

/* Title */
.gs-title, .gs-title * {
  color: #4285F4 !important;
  font-family: 'Manrope', sans-serif !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  line-height: 1.4 !important;
}
.gs-title:hover, .gs-title *:hover { 
  text-decoration: underline !important; 
  color: #2c6fbd !important;
}

/* URL */
.gsc-url-top, .gs-visibleUrl, .gs-visibleUrl-long {
  font-family: 'Manrope', sans-serif !important;
  font-size: 12px !important;
  color: #64748b !important;
  font-weight: 500 !important;
  margin: 6px 0 !important;
  word-break: break-all !important;
}

/* Snippet */
.gs-snippet {
  font-family: 'Manrope', sans-serif !important;
  font-size: 14px !important;
  color: #64748b !important;
  line-height: 1.7 !important;
  margin-top: 10px !important;
}
.gs-snippet b { 
  color: #0d1b36 !important; 
  font-weight: 700 !important; 
  background: #e8f2fc !important;
  padding: 0 2px !important;
  border-radius: 4px !important;
}

/* Result count */
.gsc-result-info {
  font-family: 'Manrope', sans-serif !important;
  font-size: 13px !important;
  color: #94a3b8 !important;
  padding: 8px 0 20px !important;
  font-weight: 500 !important;
}

/* Pagination */
.gsc-cursor-box { 
  text-align: center !important; 
  padding: 28px 0 8px !important; 
  margin-top: 8px !important;
  border-top: 1px solid #e2ecf6 !important;
}
.gsc-cursor-page {
  display: inline-flex !important;
  align-items: center !important; 
  justify-content: center !important;
  width: 40px !important; 
  height: 40px !important;
  border-radius: 12px !important;
  font-family: 'Manrope', sans-serif !important;
  font-size: 14px !important; 
  font-weight: 700 !important;
  color: #64748b !important;
  background: #ffffff !important;
  border: 1px solid #e2ecf6 !important;
  margin: 0 4px !important;
  cursor: pointer !important;
  transition: all .2s !important;
}
.gsc-cursor-page:hover {
  background: #e8f2fc !important;
  color: #4285F4 !important;
  border-color: #4285F4 !important;
  transform: translateY(-1px) !important;
}
.gsc-cursor-current-page {
  background: #4285F4 !important;
  color: #ffffff !important;
  border-color: #4285F4 !important;
  box-shadow: 0 4px 12px rgba(66,133,244,.2) !important;
}

/* No results */
.gs-no-results-result .gs-snippet {
  font-family: 'Manrope', sans-serif !important;
  font-size: 15px !important;
  color: #64748b !important;
  padding: 32px 0 !important;
  text-align: center !important;
}

/* Hide CSE branding */
.gcsc-more-maybe-branding-root,
.gcsc-branding { 
  display: none !important; 
}

/* Strip table borders */
table.gsc-search-box,
table.gsc-search-box td {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
}

/* Fix table layout */
.gsc-control-wrapper-cse {
  background: transparent !important;
}

/* Fix for any remaining glassy elements */
.gsc-above-wrapper-area {
  border-bottom: none !important;
  padding: 0 !important;
  margin-bottom: 16px !important;
}

.gsc-selected-option-container {
  border-radius: 30px !important;
  border: 1px solid #e2ecf6 !important;
  background: #ffffff !important;
  font-family: 'Manrope', sans-serif !important;
}

/* Thumbnail images if present */
.gsc-thumbnail {
  padding-right: 16px !important;
}

.gsc-thumbnail img {
  border-radius: 12px !important;
  border: 1px solid #e2ecf6 !important;
}

/* Web result thumbnail layout */
.gsc-webResult.gsc-result {
  display: flex !important;
  flex-direction: column !important;
}

.gs-web-image-box {
  padding-right: 16px !important;
}

.gs-web-image-box img {
  border-radius: 12px !important;
  border: 1px solid #e2ecf6 !important;
}

/* Fix for any floating elements */
.gsc-results .gsc-cursor-box {
  clear: both !important;
}

/* Ensure proper background throughout */
.gsc-control-cse,
.gsc-control-wrapper-cse,
.gsc-results-wrapper-overlay,
.gsc-results-wrapper-nooverlay {
  background: transparent !important;
}

/* Add subtle animation to results appearing */
@keyframes resultFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gsc-webResult.gsc-result {
  animation: resultFadeIn 0.3s ease-out;
}
</style>