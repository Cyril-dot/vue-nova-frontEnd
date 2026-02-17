<!-- NutritionPage.vue -->
<template>
  <div class="nutrition-shell">

    <!-- Header -->
    <header class="nutrition-header">
      <button class="back-btn" @click="$router.push('/apps')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Apps
      </button>
      <div class="header-content">
        <div class="header-icon">🥗</div>
        <div>
          <h1 class="header-title">AI Nutrition Advisor</h1>
          <p class="header-subtitle">Get personalized meal plans and nutrition advice</p>
        </div>
      </div>
    </header>

    <div class="nutrition-content">

      <!-- Form Section -->
      <div class="form-card">
        <h2 class="section-title">Your Nutrition Profile</h2>

        <div class="form-grid">
          <!-- Goal -->
          <div class="form-group">
            <label>Nutrition Goal</label>
            <select v-model="form.goal">
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="healthy_eating">Healthy Eating</option>
            </select>
          </div>

          <!-- Current Weight -->
          <div class="form-group">
            <label>Current Weight (kg)</label>
            <input type="number" v-model.number="form.currentWeight" min="30" max="300" step="0.1" />
          </div>

          <!-- Target Weight -->
          <div class="form-group">
            <label>Target Weight (kg)</label>
            <input type="number" v-model.number="form.targetWeight" min="30" max="300" step="0.1" />
          </div>

          <!-- Activity Level -->
          <div class="form-group">
            <label>Daily Activity Level</label>
            <select v-model="form.dailyActivityLevel">
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (hard exercise daily)</option>
            </select>
          </div>

          <!-- Dietary Restrictions -->
          <div class="form-group full-width">
            <label>Dietary Restrictions</label>
            <div class="checkbox-grid">
              <label v-for="restriction in availableRestrictions" :key="restriction" class="checkbox-label">
                <input type="checkbox" :value="restriction" v-model="form.dietaryRestrictions" />
                <span>{{ restriction.replace('_', ' ') }}</span>
              </label>
            </div>
          </div>
        </div>

        <button class="generate-btn" @click="getAdvice" :disabled="loading">
          <svg v-if="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div v-else class="spinner"></div>
          {{ loading ? 'Generating...' : 'Get Nutrition Advice' }}
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="result" class="result-card">
        <div class="result-header">
          <h2 class="section-title">Your Nutrition Plan</h2>
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
  name: 'NutritionPage',

  data() {
    return {
      form: {
        goal: 'weight_loss',
        dietaryRestrictions: [],
        currentWeight: 70,
        targetWeight: 65,
        dailyActivityLevel: 'moderate'
      },

      availableRestrictions: [
        'none',
        'vegetarian',
        'vegan',
        'gluten_free',
        'dairy_free',
        'keto',
        'paleo',
        'halal',
        'kosher'
      ],

      loading: false,
      result: null,
      toast: { show: false, message: '', type: 'success' }
    };
  },

  methods: {
    async getAdvice() {
      this.loading = true;
      this.result = null;

      try {
        const res = await apiRequest('/v1/external/workout/nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: this.form.goal,
            dietaryRestrictions: this.form.dietaryRestrictions,
            currentWeight: this.form.currentWeight,
            targetWeight: this.form.targetWeight,
            dailyActivityLevel: this.form.dailyActivityLevel,
            lang: 'en'
          })
        });

        if (!res.ok) throw new Error('Failed to get nutrition advice');

        const text = await res.text();
        this.result = text;
        this.showToast('Nutrition plan generated!', 'success');

      } catch (error) {
        console.error('Nutrition advice error:', error);
        this.showToast('Failed to get advice. Please try again.', 'error');
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
  --nutrition: linear-gradient(135deg, #10B981 0%, #34d399 100%);
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

.nutrition-shell {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font);
}

.nutrition-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 20px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 16px;
  font-family: var(--font);
}
.back-btn:hover { border-color: var(--ink-m); }

.header-content { display: flex; align-items: center; gap: 16px; }

.header-icon {
  width: 56px; height: 56px;
  background: var(--nutrition);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; flex-shrink: 0;
}

.header-title { font-size: 24px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
.header-subtitle { font-size: 14px; color: var(--ink-m); }

.nutrition-content {
  max-width: 1200px;
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

.section-title { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 24px; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full-width { grid-column: 1 / -1; }

.form-group label { font-size: 14px; font-weight: 600; color: var(--ink); }

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--font);
  color: var(--ink);
  background: var(--white);
  transition: all 0.15s;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.checkbox-label {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  cursor: pointer; transition: all 0.15s; user-select: none;
}
.checkbox-label:hover { border-color: #10B981; background: rgba(16, 185, 129, 0.05); }
.checkbox-label input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; accent-color: #10B981; }
.checkbox-label span { font-size: 13px; font-weight: 500; color: var(--ink); text-transform: capitalize; }

.generate-btn {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 32px;
  background: var(--nutrition);
  color: white; border: none; border-radius: 12px;
  font-size: 16px; font-weight: 700; font-family: var(--font);
  cursor: pointer; transition: all 0.2s var(--ease);
}
.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}
.generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 20px; height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

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
.copy-btn:hover { border-color: #10B981; background: rgba(16, 185, 129, 0.05); }

.result-content { font-size: 15px; line-height: 1.8; color: var(--ink); }
.result-content :deep(strong) { font-weight: 700; color: var(--ink); }
.result-content :deep(h2) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; color: var(--ink); }
.result-content :deep(h3) { font-size: 17px; font-weight: 600; margin: 20px 0 10px; color: var(--ink); }

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
  .form-grid { grid-template-columns: 1fr; }
  .checkbox-grid { grid-template-columns: 1fr 1fr; }
}
</style>