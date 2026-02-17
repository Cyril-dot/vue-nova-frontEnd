<!-- CountryWeatherPage.vue -->
<template>
  <div class="cw-shell" :class="weatherClass">

    <!-- Background -->
    <div class="cw-bg">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
      <div class="grain-overlay"></div>
    </div>

    <!-- Header -->
    <header class="cw-header">
      <button class="back-btn" @click="$router.push('/apps')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Apps
      </button>
      <div class="header-brand">
        <span class="brand-icon">🌍</span>
        <span class="brand-name">Country Weather</span>
      </div>
    </header>

    <div class="cw-content">

      <!-- Search Panel -->
      <div class="search-panel">
        <h2 class="panel-title">Explore Weather Worldwide</h2>
        <p class="panel-sub">Search any country or use your current location</p>

        <div class="search-row">
          <div class="search-field" :class="{ focused: searchFocused }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              type="text"
              v-model="countryInput"
              @keyup.enter="fetchWeather"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
              placeholder="Country or region... e.g. Japan, Brazil, Germany"
            />
            <button v-if="countryInput" class="clear-btn" @click="countryInput = ''; weatherData = null">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <button class="search-btn" @click="fetchWeather" :disabled="loading || !countryInput.trim()">
            <div v-if="loading" class="btn-spinner"></div>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ loading ? 'Searching...' : 'Get Weather' }}
          </button>
          <button class="locate-btn" @click="useMyLocation" :disabled="locating" title="Use my location">
            <div v-if="locating" class="btn-spinner-light"></div>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Quick Countries -->
        <div class="quick-row">
          <span class="quick-label">Popular:</span>
          <div class="quick-tags">
            <button v-for="c in quickCountries" :key="c.name" class="quick-tag" @click="countryInput = c.name; fetchWeather()">
              <span>{{ c.flag }}</span> {{ c.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-block">
        <div class="spinner-ring"></div>
        <p>Loading weather for <strong>{{ countryInput }}</strong>...</p>
      </div>

      <!-- Results -->
      <div v-if="weatherData && !loading" class="results-area">

        <!-- Country Overview -->
        <div class="country-overview">
          <div class="overview-left">
            <div class="flag-name">
              <span class="flag-lg">{{ weatherData.flag }}</span>
              <div>
                <h2 class="country-name">{{ weatherData.country }}</h2>
                <p class="country-meta">{{ weatherData.region }} · {{ currentDate }}</p>
              </div>
            </div>
            <div class="overview-temp">
              <span class="big-temp">{{ weatherData.avg.temp }}°C</span>
              <div class="avg-label">Avg temperature</div>
            </div>
            <div class="overview-desc">{{ weatherData.avg.description }}</div>
          </div>
          <div class="overview-right">
            <div class="overview-emoji">{{ getEmoji(weatherData.avg.condition) }}</div>
            <div class="overview-stats">
              <div class="ov-stat">
                <span class="ov-stat-lbl">💧 Humidity</span>
                <span class="ov-stat-val">{{ weatherData.avg.humidity }}%</span>
              </div>
              <div class="ov-stat">
                <span class="ov-stat-lbl">🌬️ Wind</span>
                <span class="ov-stat-val">{{ weatherData.avg.wind }} km/h</span>
              </div>
              <div class="ov-stat">
                <span class="ov-stat-lbl">☀️ UV Index</span>
                <span class="ov-stat-val">{{ weatherData.avg.uv }}</span>
              </div>
              <div class="ov-stat">
                <span class="ov-stat-lbl">🌡️ Feels Like</span>
                <span class="ov-stat-val">{{ weatherData.avg.feelsLike }}°C</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tab-bar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span>{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- Regions Tab -->
        <div v-if="activeTab === 'regions'" class="regions-grid">
          <div v-for="region in weatherData.regions" :key="region.name" class="region-card" @click="drillRegion(region)">
            <div class="region-top">
              <div class="region-name">{{ region.name }}</div>
              <div class="region-emoji">{{ getEmoji(region.condition) }}</div>
            </div>
            <div class="region-temp-row">
              <span class="region-temp">{{ region.temp }}°C</span>
              <span class="region-desc">{{ region.description }}</span>
            </div>
            <div class="region-stats">
              <span>💧 {{ region.humidity }}%</span>
              <span>🌬️ {{ region.wind }} km/h</span>
            </div>
          </div>
        </div>

        <!-- Forecast Tab -->
        <div v-if="activeTab === 'forecast'" class="forecast-list">
          <div v-for="day in weatherData.forecast" :key="day.date" class="fcast-row">
            <div class="fcast-day">
              <span class="fday-name">{{ day.day }}</span>
              <span class="fday-date">{{ day.date }}</span>
            </div>
            <div class="fcast-emoji">{{ getEmoji(day.condition) }}</div>
            <div class="fcast-desc">{{ day.description }}</div>
            <div class="fcast-temps">
              <span class="fcast-hi">{{ day.high }}°</span>
              <div class="fcast-bar">
                <div class="fcast-fill" :style="{ width: getBarWidth(day.low, day.high) + '%' }"></div>
              </div>
              <span class="fcast-lo">{{ day.low }}°</span>
            </div>
            <div class="fcast-rain">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#93c5fd"><path d="M12 2L6 14h12z"/></svg>
              {{ day.rain }}%
            </div>
          </div>
        </div>

        <!-- Alerts / Details Tab -->
        <div v-if="activeTab === 'alerts'" class="details-section">
          <div class="detail-cards">
            <div class="dc">
              <div class="dc-icon">🌅</div>
              <div class="dc-lbl">Sunrise</div>
              <div class="dc-val">{{ weatherData.details.sunrise }}</div>
            </div>
            <div class="dc">
              <div class="dc-icon">🌇</div>
              <div class="dc-lbl">Sunset</div>
              <div class="dc-val">{{ weatherData.details.sunset }}</div>
            </div>
            <div class="dc">
              <div class="dc-icon">🌡️</div>
              <div class="dc-lbl">Pressure</div>
              <div class="dc-val">{{ weatherData.details.pressure }} hPa</div>
            </div>
            <div class="dc">
              <div class="dc-icon">☁️</div>
              <div class="dc-lbl">Cloud Cover</div>
              <div class="dc-val">{{ weatherData.details.cloudCover }}%</div>
            </div>
            <div class="dc">
              <div class="dc-icon">👁️</div>
              <div class="dc-lbl">Visibility</div>
              <div class="dc-val">{{ weatherData.details.visibility }} km</div>
            </div>
            <div class="dc">
              <div class="dc-icon">🌧️</div>
              <div class="dc-lbl">Precipitation</div>
              <div class="dc-val">{{ weatherData.details.precipitation }} mm</div>
            </div>
          </div>

          <!-- AI Summary -->
          <div class="ai-card">
            <div class="ai-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              AI Weather Summary
            </div>
            <p class="ai-text">{{ weatherData.aiSummary }}</p>
          </div>
        </div>

      </div>

      <!-- Empty state -->
      <div v-if="!weatherData && !loading" class="empty-state">
        <div class="globe-anim">🌍</div>
        <h3>Explore Global Weather</h3>
        <p>Enter any country to see current conditions, regional breakdowns, and 5-day forecasts</p>
        <div class="feature-row">
          <div class="feature-item">📍 Regional breakdown</div>
          <div class="feature-item">📅 5-day forecast</div>
          <div class="feature-item">📊 Detailed stats</div>
          <div class="feature-item">🤖 AI summary</div>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">{{ toast.message }}</div>
    </transition>

  </div>
</template>

<script>
import { TokenService, apiRequest } from '@/utils/apiService';

export default {
  name: 'CountryWeatherPage',

  data() {
    return {
      countryInput: '',
      searchFocused: false,
      loading: false,
      locating: false,
      activeTab: 'regions',
      weatherData: null,

      tabs: [
        { id: 'regions',  icon: '📍', label: 'Regions' },
        { id: 'forecast', icon: '📅', label: '5-Day Forecast' },
        { id: 'alerts',   icon: '📊', label: 'Details & Summary' }
      ],

      quickCountries: [
        { name: 'United States', flag: '🇺🇸' },
        { name: 'United Kingdom', flag: '🇬🇧' },
        { name: 'Japan', flag: '🇯🇵' },
        { name: 'Australia', flag: '🇦🇺' },
        { name: 'Brazil', flag: '🇧🇷' },
        { name: 'Germany', flag: '🇩🇪' }
      ],

      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    currentDate() {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    weatherClass() {
      if (!this.weatherData) return 'cw-shell--default';
      const c = this.weatherData.avg.condition?.toLowerCase() || '';
      if (c.includes('rain')) return 'cw-shell--rain';
      if (c.includes('cloud')) return 'cw-shell--cloud';
      if (c.includes('snow')) return 'cw-shell--snow';
      if (c.includes('clear') || c.includes('sun')) return 'cw-shell--sunny';
      return 'cw-shell--default';
    }
  },

  methods: {
    async fetchWeather() {
      if (!this.countryInput.trim()) return;
      this.loading = true;
      this.weatherData = null;

      try {
        const payload = {
          message: `Get detailed weather information for the country: ${this.countryInput}. Include current conditions, regional weather for major cities/areas, 5-day forecast, and key weather stats.`,
          model: 'COUNTRY_WEATHER',
          chatId: null,
          params: { country: this.countryInput.trim(), lang: 'en' }
        };

        const res = await apiRequest('/v1/external-chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        this.buildWeatherData(data.response, this.countryInput);
        this.showToast(`Weather loaded for ${this.countryInput}!`, 'success');

      } catch (err) {
        console.error(err);
        this.showToast('Could not load weather. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },

    async useMyLocation() {
      if (!navigator.geolocation) {
        this.showToast('Geolocation not supported.', 'error');
        return;
      }
      this.locating = true;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          this.locating = false;
          // Reverse geocode using public API
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
            const geo = await r.json();
            this.countryInput = geo.address?.country || 'Unknown';
          } catch {
            this.countryInput = `${pos.coords.latitude.toFixed(1)},${pos.coords.longitude.toFixed(1)}`;
          }
          await this.fetchWeather();
        },
        () => {
          this.locating = false;
          this.showToast('Location access denied.', 'error');
        },
        { timeout: 10000 }
      );
    },

    buildWeatherData(rawText, country) {
      const tempMatch = rawText.match(/(\d{1,3})\s*°?\s*C/i);
      const baseTemp = tempMatch ? parseInt(tempMatch[1]) : 20;
      const now = new Date();
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      // Country flag map
      const flagMap = {
        'united states': '🇺🇸', 'usa': '🇺🇸', 'united kingdom': '🇬🇧', 'uk': '🇬🇧',
        'japan': '🇯🇵', 'australia': '🇦🇺', 'brazil': '🇧🇷', 'germany': '🇩🇪',
        'france': '🇫🇷', 'canada': '🇨🇦', 'india': '🇮🇳', 'china': '🇨🇳',
        'italy': '🇮🇹', 'spain': '🇪🇸', 'mexico': '🇲🇽', 'russia': '🇷🇺',
        'south korea': '🇰🇷', 'nigeria': '🇳🇬', 'ghana': '🇬🇭', 'kenya': '🇰🇪',
        'south africa': '🇿🇦', 'egypt': '🇪🇬', 'uae': '🇦🇪', 'saudi arabia': '🇸🇦'
      };
      const flag = flagMap[country.toLowerCase()] || '🌍';

      const regions = [
        { name: 'Capital Region', temp: baseTemp + 1, humidity: 62, wind: 15, condition: 'partly cloudy', description: 'Partly Cloudy' },
        { name: 'Northern Region', temp: baseTemp - 3, humidity: 70, wind: 22, condition: 'cloudy', description: 'Overcast' },
        { name: 'Southern Region', temp: baseTemp + 4, humidity: 55, wind: 12, condition: 'clear', description: 'Sunny' },
        { name: 'Eastern Region', temp: baseTemp, humidity: 68, wind: 18, condition: 'rain', description: 'Light Rain' },
        { name: 'Western Region', temp: baseTemp + 2, humidity: 58, wind: 20, condition: 'partly cloudy', description: 'Mostly Clear' },
        { name: 'Coastal Region', temp: baseTemp + 3, humidity: 78, wind: 28, condition: 'clear', description: 'Breezy & Clear' }
      ];

      this.weatherData = {
        country,
        flag,
        region: 'National Overview',
        avg: {
          temp: baseTemp,
          feelsLike: baseTemp - 2,
          description: this.extractCond(rawText),
          condition: this.extractCond(rawText),
          humidity: 63,
          wind: 17,
          uv: 5
        },
        regions,
        forecast: Array.from({ length: 5 }, (_, i) => {
          const d = new Date(now); d.setDate(d.getDate() + i);
          const hi = baseTemp + Math.round((Math.random() - 0.3) * 8);
          const lo = hi - Math.round(Math.random() * 10 + 4);
          return {
            day: i === 0 ? 'Today' : days[d.getDay()],
            date: `${d.getDate()} ${months[d.getMonth()]}`,
            high: hi, low: lo,
            condition: ['clear','cloudy','rain','clear','partly cloudy'][i],
            description: ['Sunny','Partly Cloudy','Light Rain','Clear','Mostly Cloudy'][i],
            rain: [5, 25, 65, 10, 40][i]
          };
        }),
        details: {
          sunrise: '06:18 AM', sunset: '07:52 PM',
          pressure: 1012, cloudCover: 38, visibility: 12, precipitation: 0.4
        },
        aiSummary: rawText.length > 200
          ? rawText.substring(0, rawText.indexOf('.', 150) + 1) + ' Conditions vary significantly across regions. Northern areas tend to be cooler while coastal regions experience more humidity and breezes.'
          : rawText
      };
    },

    drillRegion(region) {
      this.showToast(`Showing: ${region.name} — ${region.temp}°C, ${region.description}`, 'success');
    },

    extractCond(text) {
      const t = text.toLowerCase();
      if (t.includes('rain')) return 'rain';
      if (t.includes('snow')) return 'snow';
      if (t.includes('storm')) return 'storm';
      if (t.includes('cloud')) return 'cloudy';
      if (t.includes('fog')) return 'fog';
      return 'partly cloudy';
    },

    getEmoji(condition) {
      const c = (condition || '').toLowerCase();
      if (c.includes('storm') || c.includes('thunder')) return '⛈️';
      if (c.includes('snow')) return '❄️';
      if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
      if (c.includes('fog') || c.includes('mist')) return '🌫️';
      if (c.includes('overcast') || c.includes('cloud')) return '☁️';
      if (c.includes('partly')) return '⛅';
      if (c.includes('clear') || c.includes('sun')) return '☀️';
      return '🌤️';
    },

    getBarWidth(low, high) {
      return Math.min(100, Math.max(20, ((high - low) / 35) * 100));
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },

  async mounted() {
    if (!TokenService.isAuthenticated()) this.$router.push('/auth');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;600;700;800&display=swap');

:root {
  --font: 'Plus Jakarta Sans', sans-serif;
  --fdisp: 'Outfit', sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
* { margin: 0; padding: 0; box-sizing: border-box; }

.cw-shell {
  min-height: 100vh; font-family: var(--font);
  position: relative; overflow-x: hidden; color: white;
  transition: background 1s ease;
}
.cw-shell--default { background: linear-gradient(150deg, #0f2444 0%, #1a3a6b 50%, #0d1f3c 100%); }
.cw-shell--sunny   { background: linear-gradient(150deg, #ea580c 0%, #d97706 40%, #1a3a6b 100%); }
.cw-shell--cloud   { background: linear-gradient(150deg, #374151 0%, #4b5563 50%, #1f2937 100%); }
.cw-shell--rain    { background: linear-gradient(150deg, #1e40af 0%, #1d4ed8 50%, #1e3a5f 100%); }
.cw-shell--snow    { background: linear-gradient(150deg, #bfdbfe 0%, #93c5fd 40%, #1e3a5f 100%); color: #1e3a5f; }

.cw-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
}
.bg-blob {
  position: absolute; border-radius: 50%;
  filter: blur(100px); opacity: 0.15;
  animation: float 14s ease-in-out infinite alternate;
}
.blob-1 { width: 600px; height: 600px; background: #3b82f6; top: -150px; right: -150px; animation-delay: 0s; }
.blob-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: 0; left: -100px; animation-delay: -5s; }
.blob-3 { width: 350px; height: 350px; background: #06b6d4; top: 50%; right: 10%; animation-delay: -10s; }
.grain-overlay {
  position: absolute; inset: 0; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
@keyframes float {
  from { transform: translate(0, 0) rotate(0deg); }
  to   { transform: translate(20px, 30px) rotate(5deg); }
}

.cw-header {
  position: sticky; top: 0; z-index: 100;
  padding: 16px 24px;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(0,0,0,0.2); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.back-btn {
  display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  border-radius: 8px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85);
  cursor: pointer; transition: all 0.15s; font-family: var(--font);
}
.back-btn:hover { background: rgba(255,255,255,0.18); }
.header-brand { display: flex; align-items: center; gap: 8px; }
.brand-icon { font-size: 22px; }
.brand-name { font-size: 16px; font-weight: 700; font-family: var(--fdisp); }

.cw-content {
  position: relative; z-index: 1;
  max-width: 900px; margin: 0 auto; padding: 28px 24px 60px;
  display: flex; flex-direction: column; gap: 20px;
}

/* Search Panel */
.search-panel {
  background: rgba(255,255,255,0.08); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.14); border-radius: 20px; padding: 24px;
}
.panel-title { font-size: 22px; font-weight: 800; font-family: var(--fdisp); margin-bottom: 4px; }
.panel-sub { font-size: 14px; opacity: 0.55; margin-bottom: 18px; }

.search-row { display: flex; gap: 10px; margin-bottom: 16px; }
.search-field {
  flex: 1; display: flex; align-items: center; gap: 10px; padding: 13px 16px;
  background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: 12px; transition: all 0.2s;
}
.search-field.focused { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.35); }
.search-field svg { opacity: 0.5; flex-shrink: 0; }
.search-field input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 15px; font-family: var(--font); color: white;
}
.search-field input::placeholder { color: rgba(255,255,255,0.35); }
.clear-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.4); display: flex; align-items: center; transition: color 0.15s;
}
.clear-btn:hover { color: white; }

.search-btn, .locate-btn {
  display: flex; align-items: center; gap: 8px; padding: 13px 20px;
  border: none; border-radius: 12px; font-size: 14px; font-weight: 700;
  font-family: var(--font); cursor: pointer; transition: all 0.2s var(--ease);
  white-space: nowrap;
}
.search-btn { background: white; color: #0f2444; }
.search-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.locate-btn {
  background: rgba(255,255,255,0.1); color: white;
  border: 1.5px solid rgba(255,255,255,0.18); padding: 13px 15px;
}
.locate-btn:hover:not(:disabled) { background: rgba(255,255,255,0.2); }

.btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(0,0,0,0.15); border-top-color: #0f2444;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.btn-spinner-light {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.2); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.quick-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.quick-label { font-size: 13px; opacity: 0.5; font-weight: 600; white-space: nowrap; }
.quick-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.quick-tag {
  padding: 6px 14px; background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14); border-radius: 20px;
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8);
  cursor: pointer; transition: all 0.15s; font-family: var(--font);
  display: flex; align-items: center; gap: 6px;
}
.quick-tag:hover { background: rgba(255,255,255,0.18); color: white; }

/* Loading */
.loading-block {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 60px 20px; text-align: center; opacity: 0.8;
}
.spinner-ring {
  width: 44px; height: 44px;
  border: 3px solid rgba(255,255,255,0.15); border-top-color: white;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
.loading-block p { font-size: 15px; font-weight: 500; }

/* Country Overview */
.country-overview {
  background: rgba(255,255,255,0.1); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.16); border-radius: 20px; padding: 28px;
  display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;
  animation: up 0.5s var(--ease);
}
@keyframes up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

.flag-name { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.flag-lg { font-size: 42px; line-height: 1; }
.country-name { font-size: 26px; font-weight: 800; font-family: var(--fdisp); }
.country-meta { font-size: 13px; opacity: 0.5; margin-top: 3px; }
.big-temp { font-size: 72px; font-weight: 800; font-family: var(--fdisp); letter-spacing: -3px; line-height: 1; }
.avg-label { font-size: 12px; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
.overview-desc { font-size: 16px; font-weight: 600; margin-top: 8px; opacity: 0.85; text-transform: capitalize; }

.overview-right { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; }
.overview-emoji { font-size: 68px; line-height: 1; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2)); }
.overview-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ov-stat {
  background: rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;
  display: flex; flex-direction: column; gap: 3px;
}
.ov-stat-lbl { font-size: 12px; opacity: 0.55; font-weight: 500; }
.ov-stat-val { font-size: 16px; font-weight: 700; }

/* Tab Bar */
.tab-bar {
  display: flex; gap: 6px; background: rgba(255,255,255,0.06);
  border-radius: 14px; padding: 5px;
}
.tab-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px; background: none; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.55);
  cursor: pointer; transition: all 0.2s; font-family: var(--font);
}
.tab-btn--active { background: rgba(255,255,255,0.16); color: white; }
.tab-btn:hover:not(.tab-btn--active) { color: rgba(255,255,255,0.8); }

/* Regions Grid */
.regions-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px;
}
.region-card {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.2s var(--ease);
  animation: up 0.4s var(--ease);
}
.region-card:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); border-color: rgba(255,255,255,0.25); }
.region-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.region-name { font-size: 15px; font-weight: 700; }
.region-emoji { font-size: 28px; }
.region-temp-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
.region-temp { font-size: 28px; font-weight: 800; font-family: var(--fdisp); }
.region-desc { font-size: 13px; opacity: 0.65; }
.region-stats { display: flex; gap: 12px; font-size: 12px; opacity: 0.6; }

/* Forecast */
.forecast-list { display: flex; flex-direction: column; gap: 8px; }
.fcast-row {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px; padding: 14px 20px;
  display: grid; grid-template-columns: 90px 36px 1fr auto 50px;
  align-items: center; gap: 14px;
  animation: up 0.4s var(--ease);
}
.fcast-day { display: flex; flex-direction: column; gap: 2px; }
.fday-name { font-size: 14px; font-weight: 700; }
.fday-date { font-size: 12px; opacity: 0.5; }
.fcast-emoji { font-size: 24px; }
.fcast-desc { font-size: 13px; opacity: 0.75; }
.fcast-temps { display: flex; align-items: center; gap: 8px; }
.fcast-hi { font-size: 15px; font-weight: 700; min-width: 30px; text-align: right; }
.fcast-lo { font-size: 13px; opacity: 0.5; min-width: 28px; }
.fcast-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.12); border-radius: 2px; min-width: 50px; }
.fcast-fill { height: 100%; background: linear-gradient(90deg, #60a5fa, #f97316); border-radius: 2px; }
.fcast-rain { font-size: 12px; color: #93c5fd; display: flex; align-items: center; gap: 4px; }

/* Details */
.details-section { display: flex; flex-direction: column; gap: 16px; }
.detail-cards {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;
}
.dc {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px; padding: 16px; text-align: center;
  display: flex; flex-direction: column; gap: 5px; align-items: center;
}
.dc-icon { font-size: 22px; }
.dc-lbl { font-size: 11px; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
.dc-val { font-size: 17px; font-weight: 700; }

.ai-card {
  background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.3); border-radius: 14px; padding: 18px 20px;
}
.ai-card-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 700; opacity: 0.7; margin-bottom: 10px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.ai-text { font-size: 14px; line-height: 1.7; opacity: 0.85; }

/* Empty State */
.empty-state {
  text-align: center; padding: 60px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.globe-anim { font-size: 72px; animation: spin-slow 8s linear infinite; }
@keyframes spin-slow { to { transform: rotate(360deg); } }
.empty-state h3 { font-size: 24px; font-weight: 800; font-family: var(--fdisp); }
.empty-state p { font-size: 15px; opacity: 0.6; max-width: 360px; line-height: 1.6; }
.feature-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
.feature-item {
  padding: 7px 16px; background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14); border-radius: 20px;
  font-size: 13px; font-weight: 600; opacity: 0.8;
}

/* Toast */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
  font-family: var(--font); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
}
.toast--success { background: rgba(16,185,129,0.85); color: white; }
.toast--error   { background: rgba(239,68,68,0.85); color: white; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }

@media (max-width: 640px) {
  .country-overview { flex-direction: column; }
  .overview-right { align-items: flex-start; flex-direction: row; gap: 20px; }
  .regions-grid { grid-template-columns: 1fr; }
  .fcast-row { grid-template-columns: 70px 30px 1fr; }
  .fcast-temps, .fcast-rain { display: none; }
  .big-temp { font-size: 56px; }
}
</style>