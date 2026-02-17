<!-- ExercisePage.vue -->
<template>
  <div class="exercise-shell">

    <!-- Header -->
    <header class="exercise-header">
      <button class="back-btn" @click="$router.push('/apps')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Apps
      </button>
      <div class="header-content">
        <div class="header-icon">🏋️</div>
        <div>
          <h1 class="header-title">Exercise Guide</h1>
          <p class="header-subtitle">Learn proper form, muscles worked, and expert tips for any exercise</p>
        </div>
      </div>
    </header>

    <div class="exercise-content">

      <!-- Search Section -->
      <div class="form-card">
        <h2 class="section-title">Search Exercise</h2>

        <div class="search-row">
          <div class="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              type="text"
              v-model="exerciseName"
              @keyup.enter="getExerciseDetails"
              placeholder="e.g. bench press, squat, deadlift, pull-up..."
              :disabled="loading"
            />
            <button v-if="exerciseName" class="clear-btn" @click="exerciseName = ''; result = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <button class="search-btn" @click="getExerciseDetails" :disabled="loading || !exerciseName.trim()">
            <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div v-else class="spinner"></div>
            {{ loading ? 'Loading...' : 'Get Details' }}
          </button>
        </div>

        <!-- Quick Picks -->
        <div class="quick-picks">
          <span class="quick-label">Quick picks:</span>
          <button
            v-for="ex in quickPicks"
            :key="ex"
            class="quick-chip"
            @click="selectQuick(ex)"
            :class="{ 'quick-chip--active': exerciseName === ex }"
          >
            {{ ex }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="result" class="result-card">
        <div class="result-header">
          <h2 class="section-title">{{ lastExercise }}</h2>
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
        <div class="empty-grid">
          <div v-for="cat in exerciseCategories" :key="cat.name" class="empty-cat">
            <div class="cat-icon">{{ cat.icon }}</div>
            <div class="cat-name">{{ cat.name }}</div>
            <div class="cat-examples">{{ cat.examples }}</div>
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
  name: 'ExercisePage',

  data() {
    return {
      exerciseName: '',
      lastExercise: '',
      loading: false,
      result: null,

      quickPicks: [
        'Bench Press', 'Squat', 'Deadlift', 'Pull-up',
        'Push-up', 'Plank', 'Lunges', 'Burpee'
      ],

      exerciseCategories: [
        { icon: '💪', name: 'Upper Body', examples: 'Bench press, pull-up, shoulder press' },
        { icon: '🦵', name: 'Lower Body', examples: 'Squat, deadlift, lunges, leg press' },
        { icon: '🏃', name: 'Cardio', examples: 'Burpee, jumping jacks, mountain climbers' },
        { icon: '🧘', name: 'Core', examples: 'Plank, crunch, Russian twist, leg raise' },
        { icon: '🔄', name: 'Compound', examples: 'Clean & press, thruster, snatch' },
        { icon: '🤸', name: 'Flexibility', examples: 'Hip flexor stretch, cobra, pigeon pose' }
      ],

      toast: { show: false, message: '', type: 'success' }
    };
  },

  methods: {
    async getExerciseDetails() {
      if (!this.exerciseName.trim()) return;

      this.loading = true;
      this.result = null;
      this.lastExercise = this.exerciseName;

      try {
        const res = await apiRequest('/v1/external/workout/exercise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseName: this.exerciseName.trim(),
            lang: 'en'
          })
        });

        if (!res.ok) throw new Error('Failed to get exercise details');

        const text = await res.text();
        this.result = text;
        this.showToast('Exercise details loaded!', 'success');

      } catch (error) {
        console.error('Exercise details error:', error);
        this.showToast('Failed to load exercise details. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },

    selectQuick(ex) {
      this.exerciseName = ex;
      this.getExerciseDetails();
    },

    formatResult(text) {
      if (!text) return '';
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.+)/g, '<h3>$1</h3>')
        .replace(/## (.+)/g, '<h2>$1</h2>')
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
  --exercise: linear-gradient(135deg, #F59E0B 0%, #fbbf24 100%);
  --exercise-clr: #F59E0B;
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

.exercise-shell {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font);
}

.exercise-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 20px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
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
  width: 56px; height: 56px;
  background: var(--exercise);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; flex-shrink: 0;
}

.header-title { font-size: 24px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
.header-subtitle { font-size: 14px; color: var(--ink-m); }

.exercise-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
}

.section-title { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 20px; }

.search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px;
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s;
}
.search-box:focus-within {
  border-color: var(--exercise-clr);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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
  background: none; border: none; cursor: pointer;
  color: var(--ink-m); display: flex; align-items: center;
  padding: 2px; transition: color 0.15s;
}
.clear-btn:hover { color: var(--ink); }

.search-btn {
  display: flex; align-items: center; gap: 8px; padding: 14px 24px;
  background: var(--exercise);
  color: white; border: none; border-radius: 12px;
  font-size: 15px; font-weight: 700; font-family: var(--font);
  cursor: pointer; transition: all 0.2s var(--ease);
  white-space: nowrap;
}
.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
}
.search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Quick Picks */
.quick-picks {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.quick-label {
  font-size: 13px; font-weight: 600; color: var(--ink-m); white-space: nowrap;
}
.quick-chip {
  padding: 6px 14px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 20px; font-size: 13px; font-weight: 600; font-family: var(--font);
  color: var(--ink); cursor: pointer; transition: all 0.15s;
}
.quick-chip:hover { border-color: var(--exercise-clr); background: rgba(245,158,11,0.08); }
.quick-chip--active { background: var(--exercise); border-color: var(--exercise-clr); color: white; }

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
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
}

.copy-btn {
  display: flex; align-items: center; gap: 8px; padding: 8px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  font-size: 14px; font-weight: 600; font-family: var(--font);
  color: var(--ink); cursor: pointer; transition: all 0.15s;
}
.copy-btn:hover { border-color: var(--exercise-clr); background: rgba(245, 158, 11, 0.05); }

.result-content { font-size: 15px; line-height: 1.8; color: var(--ink); }
.result-content :deep(strong) { font-weight: 700; color: var(--ink); }
.result-content :deep(h2) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; color: var(--ink); }
.result-content :deep(h3) { font-size: 17px; font-weight: 600; margin: 20px 0 10px; color: var(--ink); }

/* Empty Card */
.empty-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 32px;
}
.empty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.empty-cat {
  padding: 20px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 12px; transition: all 0.15s;
}
.empty-cat:hover { border-color: var(--exercise-clr); background: rgba(245,158,11,0.04); }
.cat-icon { font-size: 28px; margin-bottom: 10px; }
.cat-name { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
.cat-examples { font-size: 12px; color: var(--ink-m); line-height: 1.5; }

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
  .empty-grid { grid-template-columns: 1fr 1fr; }
}
</style>