<!-- AppsPage.vue -->
<template>
  <div class="apps-shell">
    
    <!-- ══════ SIDEBAR ══════ -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': sidebarCollapsed }">
      
      <!-- Header with Logo -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="var(--purple)"/>
              <path d="M16 24h16M24 16v16" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">Nova Apps</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" title="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Search -->
      <div class="sidebar-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input v-model="appSearch" placeholder="Search apps..." />
      </div>

      <!-- Category Filters -->
      <div class="categories-section">
        <div class="category-label">Categories</div>
        <div class="category-list">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="category-btn"
            :class="{ 'category-btn--active': selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button class="user-profile-btn" @click="$router.push('/ai-assistant')">
          <div class="user-avatar ai-avatar">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="var(--purple)"/>
              <path d="M16 24h16M24 16v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="user-profile-text">AI Assistant</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button class="user-profile-btn notebooks-btn" @click="$router.push('/notebooks')">
          <div class="user-avatar notebooks-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="user-profile-text">Notebooks</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button class="user-profile-btn" @click="$router.push('/dashboard')">
          <div class="user-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="user-profile-text">Dashboard</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- ══════ MAIN CONTENT ══════ -->
    <main class="apps-main">
      
      <!-- Top Bar -->
      <header class="apps-topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <h1 class="page-title">Apps</h1>
          <span class="page-subtitle">Chat with your favorite apps in Nova-Space</span>
        </div>
      </header>

      <!-- Apps Content -->
      <div class="apps-content">
        
        <!-- Featured App Banner -->
        <div v-if="featuredApp" class="featured-banner" :style="{ background: featuredApp.gradient }">
          <div class="featured-icon">
            <img :src="featuredApp.iconUrl" :alt="featuredApp.name" class="app-logo" />
          </div>
          <div class="featured-content">
            <h2 class="featured-title">{{ featuredApp.name }}</h2>
            <p class="featured-desc">{{ featuredApp.description }}</p>
            <button class="featured-btn" @click="openApp(featuredApp)">
              Open {{ featuredApp.name }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="featured-graphic">
            <div class="graphic-orb"></div>
          </div>
        </div>

        <!-- Category Tabs (Mobile) -->
        <div class="category-tabs-mobile">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="category-tab"
            :class="{ 'category-tab--active': selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <!-- Apps Grid -->
        <div class="apps-grid">
          <div
            v-for="app in filteredApps"
            :key="app.id"
            class="app-card"
            @click="openApp(app)"
          >
            <div class="app-icon" :style="{ background: app.iconBg || 'white' }">
              <img v-if="app.iconUrl" :src="app.iconUrl" :alt="app.name" class="app-logo" />
              <span v-else class="app-emoji">{{ app.emoji }}</span>
            </div>
            <div class="app-body">
              <h3 class="app-name">{{ app.name }}</h3>
              <p class="app-desc">{{ app.description }}</p>
            </div>
            <div class="app-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredApps.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="empty-title">No apps found</h3>
          <p class="empty-desc">Try adjusting your search or filters</p>
        </div>
      </div>
    </main>

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
import { TokenService } from '@/utils/apiService';

export default {
  name: 'AppsPage',

  data() {
    return {
      sidebarCollapsed: false,
      appSearch: '',
      selectedCategory: 'featured',
      
      categories: [
        { value: 'featured', label: 'Featured', icon: '⭐' },
        { value: 'lifestyle', label: 'Lifestyle', icon: '🎵' },
        { value: 'productivity', label: 'Productivity', icon: '📊' },
        { value: 'programming', label: 'Programming', icon: '💻' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'business', label: 'Business', icon: '💼' }
      ],

      apps: [
        {
          id: 'spotify',
          name: 'Spotify',
          description: 'Listen to music and podcasts. Discover new tracks and artists.',
          iconUrl: 'https://cdn.simpleicons.org/spotify/1DB954',
          iconBg: '#ffffff',
          color: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
          gradient: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
          category: 'lifestyle',
          model: 'SPOTIFY',
          route: null,
          externalUrl: 'https://open.spotify.com'
        },
        {
          id: 'netflix',
          name: 'Netflix',
          description: 'Stream movies and TV shows. Find your next binge-worthy series.',
          iconUrl: 'https://cdn.simpleicons.org/netflix/E50914',
          iconBg: '#ffffff',
          color: 'linear-gradient(135deg, #E50914 0%, #ff1a1a 100%)',
          gradient: 'linear-gradient(135deg, #E50914 0%, #ff1a1a 100%)',
          category: 'lifestyle',
          model: 'NETFLIX',
          route: null,
          externalUrl: 'https://www.netflix.com'
        },
        {
          id: 'search',
          name: 'Web Search',
          description: 'Find information on the web. Get instant AI-powered answers.',
          iconUrl: 'https://cdn.simpleicons.org/google/4285F4',
          iconBg: '#ffffff',
          color: 'linear-gradient(135deg, #4285F4 0%, #5a9cf7 100%)',
          gradient: 'linear-gradient(135deg, #4285F4 0%, #5a9cf7 100%)',
          category: 'productivity',
          model: 'SEARCH',
          route: '/search',
          externalUrl: null
        },
        {
          id: 'workout',
          name: 'Workout Planner',
          description: 'Get AI-personalized fitness plans tailored to your goals.',
          iconUrl: 'https://cdn.simpleicons.org/trainerroad/E12726',
          iconBg: '#fff5f5',
          color: 'linear-gradient(135deg, #FF6B6B 0%, #ff8787 100%)',
          gradient: 'linear-gradient(135deg, #FF6B6B 0%, #ff8787 100%)',
          category: 'lifestyle',
          model: 'WORKOUT',
          route: '/workout',
          externalUrl: null
        },
        {
          id: 'nutrition',
          name: 'Nutrition Advisor',
          description: 'Get personalized meal plans and expert nutrition advice.',
          iconUrl: 'https://cdn.simpleicons.org/foodpanda/D70F64',
          iconBg: '#fff0f5',
          color: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
          gradient: 'linear-gradient(135deg, #10B981 0%, #34d399 100%)',
          category: 'lifestyle',
          model: 'NUTRITION',
          route: '/nutrition',
          externalUrl: null
        },
        {
          id: 'exercise',
          name: 'Exercise Guide',
          description: 'Learn proper form and techniques for any exercise.',
          iconUrl: 'https://cdn.simpleicons.org/strava/FC4C02',
          iconBg: '#fff8f5',
          color: 'linear-gradient(135deg, #F59E0B 0%, #fbbf24 100%)',
          gradient: 'linear-gradient(135deg, #F59E0B 0%, #fbbf24 100%)',
          category: 'lifestyle',
          model: 'EXERCISE',
          route: '/exercise',
          externalUrl: null
        },
        {
          id: 'song-recognition',
          name: 'Song Recognition',
          description: 'Identify songs playing around you instantly with Shazam.',
          iconUrl: 'https://cdn.simpleicons.org/shazam/0088FF',
          iconBg: '#f0f7ff',
          color: 'linear-gradient(135deg, #0088FF 0%, #00c3ff 100%)',
          gradient: 'linear-gradient(135deg, #0088FF 0%, #00c3ff 100%)',
          category: 'lifestyle',
          model: 'SONG_RECOGNITION',
          route: '/song-recognition',
          externalUrl: null
        },
        {
          id: 'city-weather',
          name: 'City Weather',
          description: 'Get current weather by city. Plan your day smartly.',
          iconUrl: 'https://cdn.simpleicons.org/accuweather/FF6600',
          iconBg: '#fff8f0',
          color: 'linear-gradient(135deg, #06B6D4 0%, #22d3ee 100%)',
          gradient: 'linear-gradient(135deg, #06B6D4 0%, #22d3ee 100%)',
          category: 'productivity',
          model: 'CITY_WEATHER',
          route: '/city-weather',
          externalUrl: null
        },
        {
          id: 'country-weather',
          name: 'Country Weather',
          description: 'Get weather info for any country. Check forecasts.',
          iconUrl: 'https://cdn.simpleicons.org/theweatherchannel/6AACDD',
          iconBg: '#f0f7ff',
          color: 'linear-gradient(135deg, #3B82F6 0%, #60a5fa 100%)',
          gradient: 'linear-gradient(135deg, #3B82F6 0%, #60a5fa 100%)',
          category: 'productivity',
          model: 'COUNTRY_WEATHER',
          route: '/country-weather',
          externalUrl: null
        }
      ],

      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    featuredApp() {
      return this.apps.find(app => app.id === 'spotify');
    },

    filteredApps() {
      let filtered = this.apps;

      if (this.selectedCategory !== 'featured') {
        filtered = filtered.filter(app => app.category === this.selectedCategory);
      }

      if (this.appSearch.trim()) {
        const q = this.appSearch.toLowerCase();
        filtered = filtered.filter(app =>
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q)
        );
      }

      return filtered;
    }
  },

  methods: {
    openApp(app) {
      // Navigate to internal route first
      if (app.route) {
        this.$router.push(app.route);
        this.showToast(`Opening ${app.name}...`, 'success');
        return;
      }
      // Then external URL
      if (app.externalUrl) {
        window.open(app.externalUrl, '_blank');
        this.showToast(`Opening ${app.name}...`, 'success');
        return;
      }
      // Fallback: AI chat with model
      this.$router.push({
        path: '/ai-assistant',
        query: { model: app.model, app: app.id }
      });
      this.showToast(`Opening ${app.name} chat...`, 'success');
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },

  async mounted() {
    if (!TokenService.isAuthenticated()) {
      this.$router.push('/auth');
      return;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

:root {
  --blue:        #4a90e2;
  --ink:         #0d1b36;
  --ink-m:       #64748b;
  --white:       #ffffff;
  --border:      #e2ecf6;
  --bg:          #f8fafc;
  --sidebar-bg:  #f9fafb;
  --purple:      #8b5cf6;
  --purple-dk:   #7c3aed;
  --purple-soft: #ede9fe;
  --green:       #10b981;
  --orange:      #f59e0b;
  --red:         #ef4444;
  --cyan:        #06b6d4;
  --sidebar-w:   280px;
  --font:        'Manrope', sans-serif;
  --fdisp:       'Space Grotesk', sans-serif;
  --ease:        cubic-bezier(0.22, 1, 0.36, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.apps-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  font-family: var(--font);
}

/* ═══ SIDEBAR ══════════════════════════════════════════════ */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s var(--ease);
}
.sidebar--collapsed { width: 0; border-right: none; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-logo { display: flex; align-items: center; gap: 10px; flex: 1; }
.logo-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.logo-text { font-size: 16px; font-weight: 700; color: var(--ink); font-family: var(--fdisp); }

.collapse-btn {
  width: 28px; height: 28px;
  background: none; border: none; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink-m); flex-shrink: 0; transition: background 0.15s;
}
.collapse-btn:hover { background: var(--bg); }

.sidebar-search {
  display: flex; align-items: center; gap: 8px;
  height: 36px; padding: 0 12px; margin: 12px 12px 0;
  background: var(--white); border: 1px solid var(--border); border-radius: 8px;
  color: var(--ink-m); flex-shrink: 0;
}
.sidebar-search input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 13px; font-family: var(--font); color: var(--ink);
}
.sidebar-search input::placeholder { color: var(--ink-m); }

.categories-section {
  flex: 1; padding: 12px; overflow: hidden;
  display: flex; flex-direction: column; min-height: 0;
}
.category-label {
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
}
.category-list {
  flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 2px;
}
.category-list::-webkit-scrollbar { width: 4px; }
.category-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.category-btn {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: none; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; font-family: var(--font);
  color: var(--ink); cursor: pointer; text-align: left; transition: background 0.15s;
}
.category-btn:hover { background: var(--white); }
.category-btn--active { background: var(--white); box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.category-btn span:first-child { font-size: 16px; }

.sidebar-footer {
  padding: 12px; border-top: 1px solid var(--border);
  flex-shrink: 0; display: flex; flex-direction: column; gap: 8px;
}

.user-profile-btn {
  width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: var(--white); border: 1px solid var(--border); border-radius: 8px;
  font-size: 13px; font-weight: 600; font-family: var(--font);
  color: var(--ink); cursor: pointer; transition: all 0.15s;
}
.user-profile-btn:hover { background: var(--bg); }
.ai-avatar { background: var(--purple-soft) !important; color: var(--purple) !important; }
.notebooks-btn:hover { background: #dbeafe; border-color: var(--blue); }

.user-avatar {
  width: 28px; height: 28px; background: var(--purple-soft);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: var(--purple); flex-shrink: 0;
}
.notebooks-avatar { background: #dbeafe; color: var(--blue); }
.user-profile-text { flex: 1; }

/* ═══ MAIN CONTENT ════════════════════════════════════════ */
.apps-main {
  flex: 1; display: flex; flex-direction: column;
  min-width: 0; background: var(--bg); overflow: hidden;
}

.apps-topbar {
  height: 60px; background: var(--white); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; flex-shrink: 0;
}
.topbar-left { display: flex; align-items: center; gap: 12px; }

.mobile-menu-btn {
  display: none; width: 36px; height: 36px; background: none; border: none;
  border-radius: 8px; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink-m); transition: background 0.15s;
}
.mobile-menu-btn:hover { background: var(--bg); }

.page-title { font-size: 18px; font-weight: 700; color: var(--ink); font-family: var(--fdisp); }
.page-subtitle { font-size: 13px; color: var(--ink-m); font-weight: 500; }

.apps-content { flex: 1; overflow-y: auto; padding: 24px; }
.apps-content::-webkit-scrollbar { width: 6px; }
.apps-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Featured Banner */
.featured-banner {
  position: relative; padding: 40px; border-radius: 20px;
  margin-bottom: 32px; overflow: hidden;
  display: flex; align-items: center; gap: 24px;
  animation: fade-in 0.4s var(--ease);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.featured-icon {
  width: 80px; height: 80px; background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px); border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.1); padding: 16px;
}

.featured-content { flex: 1; color: white; z-index: 2; }
.featured-title { font-size: 32px; font-weight: 800; font-family: var(--fdisp); margin-bottom: 8px; }
.featured-desc { font-size: 16px; font-weight: 500; margin-bottom: 20px; opacity: 0.95; }

.featured-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px;
  background: white; color: var(--ink); border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700; font-family: var(--font);
  cursor: pointer; transition: all 0.2s var(--ease);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.featured-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }

.featured-graphic {
  position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
  width: 300px; height: 300px; z-index: 1;
}
.graphic-orb {
  width: 100%; height: 100%; background: rgba(255,255,255,0.1);
  border-radius: 50%; backdrop-filter: blur(40px); box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

/* App Icon */
.app-logo { width: 100%; height: 100%; object-fit: contain; }
.app-emoji { font-size: 26px; line-height: 1; }

/* Category Tabs Mobile */
.category-tabs-mobile {
  display: none; gap: 8px; margin-bottom: 24px;
  overflow-x: auto; padding-bottom: 4px;
}
.category-tabs-mobile::-webkit-scrollbar { height: 3px; }
.category-tabs-mobile::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.category-tab {
  display: flex; align-items: center; gap: 6px; padding: 8px 16px;
  background: var(--white); border: 1px solid var(--border); border-radius: 20px;
  font-size: 13px; font-weight: 600; font-family: var(--font);
  color: var(--ink); white-space: nowrap; cursor: pointer; transition: all 0.15s;
}
.category-tab:hover { border-color: var(--purple); background: var(--purple-soft); }
.category-tab--active { background: var(--purple); border-color: var(--purple); color: white; }

/* Apps Grid */
.apps-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;
}

.app-card {
  background: var(--white); border: 1px solid var(--border); border-radius: 16px;
  padding: 20px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; transition: all 0.2s var(--ease); animation: fade-in 0.3s var(--ease);
}
.app-card:hover {
  border-color: var(--purple); box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.app-icon {
  width: 56px; height: 56px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 10px;
}

.app-body { flex: 1; min-width: 0; }
.app-name { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.app-desc { font-size: 13px; color: var(--ink-m); line-height: 1.5; }

.app-arrow { color: var(--ink-m); flex-shrink: 0; transition: transform 0.2s var(--ease); }
.app-card:hover .app-arrow { transform: translateX(4px); color: var(--purple); }

/* Empty State */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 24px; text-align: center;
}
.empty-icon {
  width: 80px; height: 80px; background: var(--bg); border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-m); margin-bottom: 20px;
}
.empty-title { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.empty-desc { font-size: 14px; color: var(--ink-m); }

/* Toast */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px; padding: 12px 18px;
  background: var(--white); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1); font-size: 13px; font-weight: 600;
  z-index: 9999; color: var(--ink);
}
.toast--success { border-left: 3px solid var(--green); }
.toast--success svg { color: var(--green); }
.toast--error { border-left: 3px solid var(--red); }
.toast--error svg { color: var(--red); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed; left: 0; top: 0; height: 100vh; z-index: 200;
    box-shadow: 2px 0 12px rgba(0,0,0,0.1);
  }
  .sidebar--collapsed { transform: translateX(-100%); }
  .mobile-menu-btn { display: flex; }
  .page-subtitle { display: none; }
  .category-tabs-mobile { display: flex; }
  .apps-grid { grid-template-columns: 1fr; }
  .featured-graphic { display: none; }
  .featured-banner { padding: 24px; }
  .featured-title { font-size: 24px; }
  .featured-desc { font-size: 14px; }
}
</style>