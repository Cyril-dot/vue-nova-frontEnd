<!-- SongRecognitionPage.vue -->
<template>
  <div class="song-shell">

    <!-- Header -->
    <header class="song-header">
      <button class="back-btn" @click="$router.push('/apps')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Apps
      </button>
      <div class="header-content">
        <div class="header-icon">
          <img src="https://cdn.simpleicons.org/shazam/ffffff" alt="Shazam" class="header-app-icon" />
        </div>
        <div>
          <h1 class="header-title">Song Recognition</h1>
          <p class="header-subtitle">Search and identify songs, artists and albums</p>
        </div>
      </div>
    </header>

    <div class="song-content">

      <!-- Search Card -->
      <div class="form-card">
        <h2 class="section-title">Find a Song</h2>

        <div class="search-row">
          <div class="search-box" :class="{ 'search-box--focused': searchFocused }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              type="text"
              v-model="query"
              @keyup.enter="searchSong"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
              placeholder="Search by song title, artist, or lyrics..."
              :disabled="loading"
            />
            <button v-if="query" class="clear-btn" @click="query = ''; result = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <button class="search-btn" @click="searchSong" :disabled="loading || !query.trim()">
            <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-else class="spinner"></div>
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>

        <!-- Search Suggestions -->
        <div class="suggestions">
          <span class="suggestions-label">Try searching:</span>
          <div class="suggestion-chips">
            <button
              v-for="s in suggestions"
              :key="s"
              class="suggestion-chip"
              @click="query = s; searchSong()"
            >
              🎵 {{ s }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-card">
        <div class="loading-icon">
          <div class="pulse-ring ring-1"></div>
          <div class="pulse-ring ring-2"></div>
          <div class="pulse-ring ring-3"></div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#0088FF" stroke-width="2"/>
            <circle cx="12" cy="12" r="2.5" fill="#0088FF"/>
          </svg>
        </div>
        <p class="loading-text">Searching for "{{ lastQuery }}"...</p>
      </div>

      <!-- Results -->
      <div v-if="result && !loading" class="result-card">
        <div class="result-header">
          <div>
            <h2 class="section-title">Results for "{{ lastQuery }}"</h2>
          </div>
          <button class="copy-btn" @click="copyResult">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
            </svg>
            Copy
          </button>
        </div>
        <div class="result-content" v-html="formatResult(result)"></div>
      </div>

      <!-- Empty State (before search) -->
      <div v-if="!result && !loading" class="empty-card">
        <div class="empty-inner">
          <div class="empty-visual">
            <div class="vinyl">
              <div class="vinyl-inner">
                <div class="vinyl-center"></div>
              </div>
            </div>
          </div>
          <h3 class="empty-title">Discover Any Song</h3>
          <p class="empty-desc">Search by title, artist name, or even lyrics to find information about any track</p>
          <div class="feature-pills">
            <span class="feature-pill">🎤 Artist info</span>
            <span class="feature-pill">💿 Album details</span>
            <span class="feature-pill">📅 Release dates</span>
            <span class="feature-pill">🎼 Genre & more</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script>
import { TokenService, apiRequest } from '@/utils/apiService';

export default {
  name: 'SongRecognitionPage',

  data() {
    return {
      query: '',
      lastQuery: '',
      searchFocused: false,
      loading: false,
      result: null,

      suggestions: [
        'Blinding Lights',
        'Shape of You',
        'Bohemian Rhapsody',
        'Levitating Dua Lipa'
      ],

      toast: { show: false, message: '', type: 'success' }
    };
  },

  methods: {
    async searchSong() {
      if (!this.query.trim()) return;

      this.loading = true;
      this.result = null;
      this.lastQuery = this.query;

      try {
        const payload = {
          message: this.query,
          model: 'SONG_RECOGNITION',
          chatId: null,
          params: {
            query: this.query.trim(),
            lang: 'en'
          }
        };

        const res = await apiRequest('/v1/external-chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Song search failed');

        const data = await res.json();
        this.result = data.response;
        this.showToast('Song found!', 'success');

      } catch (error) {
        console.error('Song recognition error:', error);
        this.showToast('Search failed. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },

    formatResult(text) {
      if (!text) return '';
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.+)/g, '<h3>$1</h3>')
        .replace(/## (.+)/g, '<h2>$1</h2>')
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
        .replace(/\n/g, '<br>');
    },

    copyResult() {
      navigator.clipboard.writeText(this.result).then(() => {
        this.showToast('Copied to clipboard!', 'success');
      });
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },

  async mounted() {
    if (!TokenService.isAuthenticated()) {
      this.$router.push('/auth');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --song: linear-gradient(135deg, #0088FF 0%, #00c3ff 100%);
  --song-clr: #0088FF;
  --ink: #0d1b36;
  --ink-m: #64748b;
  --white: #ffffff;
  --border: #e2ecf6;
  --bg: #f8fafc;
  --green: #10b981;
  --red: #ef4444;
  --font: 'Manrope', sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.song-shell { min-height: 100vh; background: var(--bg); font-family: var(--font); }

.song-header {
  background: var(--white); border-bottom: 1px solid var(--border);
  padding: 20px 24px; position: sticky; top: 0; z-index: 100;
}

.back-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  font-size: 14px; font-weight: 600; color: var(--ink);
  cursor: pointer; transition: all 0.15s; margin-bottom: 16px; font-family: var(--font);
}
.back-btn:hover { border-color: var(--ink-m); }

.header-content { display: flex; align-items: center; gap: 16px; }
.header-icon {
  width: 56px; height: 56px; background: var(--song);
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.header-app-icon { width: 32px; height: 32px; object-fit: contain; filter: brightness(0) invert(1); }
.header-title { font-size: 24px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
.header-subtitle { font-size: 14px; color: var(--ink-m); }

.song-content {
  max-width: 900px; margin: 0 auto; padding: 24px;
  display: flex; flex-direction: column; gap: 24px;
}

.form-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 32px;
}
.section-title { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 20px; }

.search-row { display: flex; gap: 12px; margin-bottom: 20px; }

.search-box {
  flex: 1; display: flex; align-items: center; gap: 12px; padding: 14px 18px;
  background: var(--bg); border: 2px solid var(--border); border-radius: 12px;
  transition: all 0.2s;
}
.search-box--focused {
  border-color: var(--song-clr); box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.1);
  background: var(--white);
}
.search-box svg { color: var(--ink-m); flex-shrink: 0; }
.search-box input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 15px; font-family: var(--font); color: var(--ink);
}
.search-box input::placeholder { color: var(--ink-m); }
.search-box input:disabled { opacity: 0.6; }

.clear-btn {
  background: none; border: none; cursor: pointer; color: var(--ink-m);
  display: flex; align-items: center; padding: 2px; transition: color 0.15s;
}
.clear-btn:hover { color: var(--ink); }

.search-btn {
  display: flex; align-items: center; gap: 8px; padding: 14px 24px;
  background: var(--song); color: white; border: none; border-radius: 12px;
  font-size: 15px; font-weight: 700; font-family: var(--font);
  cursor: pointer; transition: all 0.2s var(--ease); white-space: nowrap;
}
.search-btn:hover:not(:disabled) {
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 136, 255, 0.3);
}
.search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 3px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.suggestions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.suggestions-label { font-size: 13px; font-weight: 600; color: var(--ink-m); white-space: nowrap; }
.suggestion-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.suggestion-chip {
  padding: 6px 14px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 20px; font-size: 13px; font-weight: 500; font-family: var(--font);
  color: var(--ink); cursor: pointer; transition: all 0.15s;
}
.suggestion-chip:hover { border-color: var(--song-clr); background: rgba(0,136,255,0.06); }

/* Loading Card */
.loading-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 60px 32px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.loading-icon { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
.pulse-ring {
  position: absolute; border-radius: 50%; border: 2px solid rgba(0, 136, 255, 0.3);
  animation: pulse 2s ease-out infinite;
}
.ring-1 { width: 80px; height: 80px; animation-delay: 0s; }
.ring-2 { width: 60px; height: 60px; animation-delay: 0.4s; }
.ring-3 { width: 40px; height: 40px; animation-delay: 0.8s; }
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}
.loading-text { font-size: 15px; font-weight: 600; color: var(--ink-m); }

/* Result Card */
.result-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 32px;
  animation: fade-in 0.4s var(--ease);
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.result-header {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
}
.copy-btn {
  display: flex; align-items: center; gap: 8px; padding: 8px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  font-size: 14px; font-weight: 600; font-family: var(--font);
  color: var(--ink); cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.copy-btn:hover { border-color: var(--song-clr); background: rgba(0, 136, 255, 0.05); }

.result-content { font-size: 15px; line-height: 1.8; color: var(--ink); }
.result-content :deep(strong) { font-weight: 700; color: var(--ink); }
.result-content :deep(h2) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; color: var(--ink); }
.result-content :deep(h3) { font-size: 17px; font-weight: 600; margin: 20px 0 10px; color: var(--ink); }
.result-content :deep(a) {
  color: var(--song-clr); text-decoration: none; border-bottom: 1px solid rgba(0,136,255,0.3);
}
.result-content :deep(a:hover) { border-bottom-color: var(--song-clr); }

/* Empty Card */
.empty-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 48px 32px;
}
.empty-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }

/* Vinyl Animation */
.vinyl {
  width: 100px; height: 100px; background: #1a1a2e; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  animation: spin-slow 4s linear infinite; margin-bottom: 8px;
}
@keyframes spin-slow { to { transform: rotate(360deg); } }
.vinyl-inner {
  width: 60px; height: 60px; background: #2d2d44; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid rgba(0,136,255,0.3);
}
.vinyl-center {
  width: 18px; height: 18px; background: var(--song-clr); border-radius: 50%;
  box-shadow: 0 0 12px rgba(0,136,255,0.6);
}

.empty-title { font-size: 20px; font-weight: 700; color: var(--ink); }
.empty-desc { font-size: 14px; color: var(--ink-m); max-width: 340px; line-height: 1.6; }

.feature-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.feature-pill {
  padding: 6px 14px; background: rgba(0,136,255,0.08); border: 1px solid rgba(0,136,255,0.2);
  border-radius: 20px; font-size: 13px; font-weight: 600; color: var(--song-clr);
}

/* Toast */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px; padding: 12px 18px;
  background: var(--white); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); font-size: 13px; font-weight: 600;
  z-index: 9999; color: var(--ink); font-family: var(--font);
}
.toast--success { border-left: 3px solid var(--green); }
.toast--success svg { color: var(--green); }
.toast--error { border-left: 3px solid var(--red); }
.toast--error svg { color: var(--red); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

@media (max-width: 768px) {
  .search-row { flex-direction: column; }
  .search-btn { width: 100%; justify-content: center; }
}
</style>