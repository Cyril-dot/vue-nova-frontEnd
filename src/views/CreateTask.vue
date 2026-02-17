<!-- CreateTask.vue -->
<template>
  <div class="app-shell">

    <!-- Top Navigation -->
    <nav class="header-nav">
      <div class="header-inner">
        <div class="header-left">
          <div class="brand-block">
            <div class="brand-logo">
              <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="11" fill="var(--blue)"/>
                <polygon points="21,10 33,16 21,22 9,16" fill="white" opacity="0.95"/>
                <rect x="13" y="25" width="16" height="7" rx="2" fill="white"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">NovaSpace</span>
              <span class="brand-plan">Free Plan</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <button class="notif-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="notif-dot"></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside class="side-panel">
      <router-link to="/tasks/create" class="create-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add New Task
      </router-link>

      <div class="panel-section">
        <div class="section-label">MAIN</div>
        <nav class="side-nav">
          <router-link to="/dashboard" class="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/tasks" class="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>My Tasks</span>
          </router-link>
          <router-link to="/projects" class="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Projects</span>
          </router-link>
          <router-link to="/calendar" class="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Calendar</span>
          </router-link>
        </nav>
      </div>

      <div class="tips-widget">
        <div class="tips-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h4 class="tips-title">Quick Tips</h4>
        <ul class="tips-list">
          <li>Set a due date to track deadlines</li>
          <li>Use HIGH priority for urgent items</li>
          <li>Add a clear description for context</li>
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="content-area">
      <header class="content-header">
        <div class="header-group">
          <button class="back-arrow" @click="$router.push('/tasks')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div>
            <h1 class="content-title">Create New Task</h1>
            <p class="content-subtitle">Fill in the details below to add a new task</p>
          </div>
        </div>
      </header>

      <div class="form-wrapper">
        <div class="form-card">

          <!-- Task Title -->
          <div class="field-group">
            <label class="field-label">
              Task Title <span class="required-mark">*</span>
            </label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.title, 'input-wrap--filled': taskForm.title }">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <input
                type="text"
                v-model="taskForm.title"
                placeholder="Enter a clear, concise task title"
                class="field-input"
              />
            </div>
            <span v-if="errors.title" class="field-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              {{ errors.title }}
            </span>
          </div>

          <!-- Description -->
          <div class="field-group">
            <label class="field-label">
              Description <span class="optional-mark">optional</span>
            </label>
            <div class="textarea-wrap" :class="{ 'textarea-wrap--filled': taskForm.description }">
              <textarea
                v-model="taskForm.description"
                placeholder="Describe the task in detail..."
                class="field-textarea"
                rows="4"
              ></textarea>
              <span class="char-count">{{ taskForm.description.length }}</span>
            </div>
          </div>

          <!-- Priority Selector -->
          <div class="field-group">
            <label class="field-label">Priority <span class="required-mark">*</span></label>
            <div class="priority-grid">

              <button
                type="button"
                class="prio-card"
                :class="{ 'prio-card--active': taskForm.priority === 'HIGH' }"
                data-level="high"
                @click="taskForm.priority = 'HIGH'"
              >
                <div class="prio-card-icon prio-icon-high">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="prio-card-text">
                  <span class="prio-card-name">High</span>
                  <span class="prio-card-desc">Urgent, do first</span>
                </div>
                <div class="prio-card-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </button>

              <button
                type="button"
                class="prio-card"
                :class="{ 'prio-card--active': taskForm.priority === 'MEDIUM' }"
                data-level="medium"
                @click="taskForm.priority = 'MEDIUM'"
              >
                <div class="prio-card-icon prio-icon-medium">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="prio-card-text">
                  <span class="prio-card-name">Medium</span>
                  <span class="prio-card-desc">Normal priority</span>
                </div>
                <div class="prio-card-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </button>

              <button
                type="button"
                class="prio-card"
                :class="{ 'prio-card--active': taskForm.priority === 'LOW' }"
                data-level="low"
                @click="taskForm.priority = 'LOW'"
              >
                <div class="prio-card-icon prio-icon-low">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M8 15l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="prio-card-text">
                  <span class="prio-card-name">Low</span>
                  <span class="prio-card-desc">When time allows</span>
                </div>
                <div class="prio-card-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </button>

            </div>
          </div>

          <!-- Status + Due Date -->
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">Status <span class="required-mark">*</span></label>
              <div class="select-wrap">
                <svg class="select-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                <select v-model="taskForm.status" class="field-select">
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Due Date <span class="required-mark">*</span></label>
              <div class="input-wrap" :class="{ 'input-wrap--error': errors.dueDate, 'input-wrap--filled': taskForm.dueDate }">
                <svg class="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                <input type="date" v-model="taskForm.dueDate" class="field-input" />
              </div>
              <span v-if="errors.dueDate" class="field-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                {{ errors.dueDate }}
              </span>
            </div>
          </div>

          <div class="form-divider"></div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="$router.push('/tasks')">Cancel</button>
            <button type="button" class="submit-btn" :disabled="saving || !isFormValid" @click="saveTask">
              <span class="spin-ring-sm" v-if="saving"></span>
              <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ saving ? 'Creating...' : 'Create Task' }}
            </button>
          </div>

        </div>

        <!-- Preview Panel -->
        <div class="preview-panel">
          <p class="preview-label">LIVE PREVIEW</p>
          <div class="preview-card" :class="getPriorityClass(taskForm.priority)">
            <div class="preview-card-top">
              <span class="preview-prio-tag" :class="getPriorityClass(taskForm.priority)">
                <span class="preview-prio-dot"></span>
                {{ taskForm.priority || 'MEDIUM' }}
              </span>
              <span class="preview-status-tag" :class="getStatusClass(taskForm.status)">
                {{ formatStatus(taskForm.status) }}
              </span>
            </div>
            <h4 class="preview-card-title">{{ taskForm.title || 'Task title will appear here' }}</h4>
            <p class="preview-card-desc">{{ taskForm.description || 'Task description will appear here...' }}</p>
            <div class="preview-card-footer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ taskForm.dueDate ? formatDate(taskForm.dueDate) : 'No due date set' }}</span>
            </div>
          </div>

          <div class="preview-prio-bar" :class="getPriorityClass(taskForm.priority)">
            <span class="prio-bar-label">
              {{ taskForm.priority === 'HIGH' ? '🔴 High Priority Task' : taskForm.priority === 'LOW' ? '🔵 Low Priority Task' : '🟡 Medium Priority Task' }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast-msg" :class="toast.type">
        <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';
import TasksAPI from '@/utils/tasksApi';

export default {
  name: 'CreateTask',
  data() {
    return {
      saving: false,
      taskForm: {
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: ''
      },
      errors: { title: '', dueDate: '' },
      toast: { show: false, message: '', type: 'success' }
    };
  },
  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
    isFormValid() {
      return (
        this.taskForm.title.trim() !== '' &&
        this.taskForm.priority !== '' &&
        this.taskForm.status !== '' &&
        this.taskForm.dueDate !== ''
      );
    }
  },
  methods: {
    validate() {
      this.errors = { title: '', dueDate: '' };
      let valid = true;
      if (!this.taskForm.title.trim()) { this.errors.title = 'Task title is required.'; valid = false; }
      if (!this.taskForm.dueDate) { this.errors.dueDate = 'Due date is required.'; valid = false; }
      return valid;
    },
    async saveTask() {
      if (!this.validate()) return;
      try {
        this.saving = true;
        await TasksAPI.createUserTask({
          title: this.taskForm.title,
          description: this.taskForm.description,
          priority: this.taskForm.priority,
          status: this.taskForm.status,
          dueDate: this.taskForm.dueDate
        });
        this.showToast('Task created successfully!', 'success');
        setTimeout(() => { this.$router.push('/tasks'); }, 1200);
      } catch (error) {
        this.showToast(error.message || 'Failed to create task', 'error');
      } finally {
        this.saving = false;
      }
    },
    getPriorityClass(p) { return { HIGH: 'prio-high', MEDIUM: 'prio-medium', LOW: 'prio-low' }[p] || 'prio-medium'; },
    getStatusClass(s) { return { PENDING: 'stat-pending', IN_PROGRESS: 'stat-wip', COMPLETED: 'stat-done' }[s] || 'stat-pending'; },
    formatStatus(s) { return s ? s.replace(/_/g, ' ') : 'Pending'; },
    formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'; },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },
  mounted() { if (!this.isAuthenticated) this.$router.push('/auth'); }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

:root {
  --blue:      #4a90e2;
  --ink:       #0d1b36;
  --ink-m:     #64748b;
  --white:     #ffffff;
  --border:    #e2ecf6;
  --bg:        #f8fafc;
  --purple:    #8b5cf6;
  --green:     #10b981;
  --orange:    #f59e0b;
  --red:       #ef4444;
  --cyan:      #06b6d4;
  --bar-h:     64px;
  --sidebar-w: 260px;
  --font:      'Manrope', sans-serif;
  --fdisp:     'Space Grotesk', sans-serif;
  --ease:      cubic-bezier(0.22,1,0.36,1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.app-shell {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font);
  display: grid;
  grid-template-areas: "nav nav" "sidebar main";
  grid-template-rows: var(--bar-h) 1fr;
  grid-template-columns: var(--sidebar-w) 1fr;
}

/* ── NAV ── */
.header-nav {
  grid-area: nav;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100;
  height: var(--bar-h);
}
.header-inner {
  height: 100%; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between;
}
.header-left { display: flex; align-items: center; gap: 24px; flex: 1; }
.brand-block { display: flex; align-items: center; gap: 12px; }
.brand-logo { width: 36px; height: 36px; flex-shrink: 0; }
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 14px; font-weight: 700; color: var(--ink); font-family: var(--fdisp); }
.brand-plan { font-size: 11px; font-weight: 600; color: var(--ink-m); }
.header-right { display: flex; align-items: center; }
.notif-btn {
  position: relative; width: 40px; height: 40px;
  border: 1px solid var(--border); background: var(--white);
  border-radius: 10px; display: flex; align-items: center;
  justify-content: center; cursor: pointer; color: var(--ink-m);
}
.notif-dot {
  position: absolute; top: 8px; right: 8px;
  width: 6px; height: 6px; background: var(--red);
  border-radius: 50%; border: 1.5px solid var(--white);
}

/* ── SIDEBAR ── */
.side-panel {
  grid-area: sidebar;
  background: var(--white);
  border-right: 1px solid var(--border);
  padding: 24px 16px;
  overflow-y: auto;
  height: calc(100vh - var(--bar-h));
  position: sticky; top: var(--bar-h);
}
.create-btn, a.create-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; height: 48px;
  background: linear-gradient(135deg, #8b5cf6 0%, #9333ea 100%);
  color: #ffffff !important; border: none; border-radius: 12px;
  font-size: 14px; font-weight: 700; font-family: var(--font);
  cursor: pointer; margin-bottom: 24px; text-decoration: none; letter-spacing: 0.2px;
}
.panel-section { margin-bottom: 24px; }
.section-label {
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  letter-spacing: 0.5px; text-transform: uppercase;
  margin-bottom: 12px; padding: 0 8px;
}
.side-nav { display: flex; flex-direction: column; gap: 4px; }
.side-link {
  display: flex; align-items: center; gap: 12px;
  height: 40px; padding: 0 12px; border-radius: 8px;
  color: var(--ink-m); font-size: 14px; font-weight: 500;
  text-decoration: none; cursor: pointer;
  border: none; background: none; font-family: var(--font); width: 100%; text-align: left;
}
.side-link svg { flex-shrink: 0; }
.tips-widget { background: #ede9fe; border-radius: 12px; padding: 20px; margin-top: 24px; }
.tips-icon {
  width: 40px; height: 40px; background: var(--purple);
  border-radius: 10px; display: flex; align-items: center;
  justify-content: center; color: var(--white); margin-bottom: 12px;
}
.tips-title { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 12px; font-family: var(--fdisp); }
.tips-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.tips-list li { font-size: 13px; color: var(--ink-m); font-weight: 500; padding-left: 16px; position: relative; }
.tips-list li::before { content: '•'; position: absolute; left: 0; color: var(--purple); font-weight: 700; }

/* ── MAIN ── */
.content-area {
  grid-area: main; padding: 32px;
  overflow-y: auto; max-height: calc(100vh - var(--bar-h));
}
.content-header { margin-bottom: 32px; }
.header-group { display: flex; align-items: center; gap: 16px; }
.back-arrow {
  width: 40px; height: 40px; background: var(--white);
  border: 1px solid var(--border); border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink-m); flex-shrink: 0;
}
.content-title { font-size: 28px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); margin-bottom: 4px; }
.content-subtitle { font-size: 15px; color: var(--ink-m); font-weight: 500; }

/* ── LAYOUT ── */
.form-wrapper { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }

/* ── FORM CARD ── */
.form-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px;
}

.field-group { margin-bottom: 28px; }

.field-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; color: var(--ink);
  margin-bottom: 10px; letter-spacing: 0.4px; text-transform: uppercase;
}

.required-mark { font-size: 14px; color: var(--red); font-weight: 800; text-transform: none; }

.optional-mark {
  font-size: 11px; font-weight: 600; color: var(--ink-m);
  background: var(--bg); padding: 2px 8px;
  border-radius: 20px; text-transform: none; letter-spacing: 0;
}

/* ── INPUT ── */
.input-wrap {
  position: relative; display: flex; align-items: center;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 12px; overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.input-wrap:focus-within {
  border-color: var(--purple); background: var(--white);
  box-shadow: 0 0 0 4px rgba(139,92,246,0.1);
}
.input-wrap--error { border-color: var(--red); background: #fff8f8; }
.input-wrap--error:focus-within { box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }
.input-wrap--filled { border-color: #c4b5fd; background: var(--white); }

.input-icon {
  flex-shrink: 0; margin-left: 14px; color: var(--ink-m); pointer-events: none;
}
.input-wrap:focus-within .input-icon { color: var(--purple); }

.field-input {
  flex: 1; height: 52px; padding: 0 16px 0 12px;
  border: none; background: transparent;
  font-size: 14px; font-family: var(--font); font-weight: 500;
  color: var(--ink); outline: none;
}
.field-input::placeholder { color: #b0bac8; }

/* ── TEXTAREA ── */
.textarea-wrap {
  position: relative; background: var(--bg);
  border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.textarea-wrap:focus-within {
  border-color: var(--purple); background: var(--white);
  box-shadow: 0 0 0 4px rgba(139,92,246,0.1);
}
.textarea-wrap--filled { border-color: #c4b5fd; background: var(--white); }

.field-textarea {
  width: 100%; padding: 16px; border: none; background: transparent;
  font-size: 14px; font-family: var(--font); font-weight: 500;
  color: var(--ink); resize: none; outline: none;
  line-height: 1.6; min-height: 110px;
}
.field-textarea::placeholder { color: #b0bac8; }

.char-count {
  position: absolute; bottom: 10px; right: 14px;
  font-size: 11px; font-weight: 600; color: #b0bac8;
}

/* ── FIELD ERROR ── */
.field-error {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: var(--red); font-weight: 600; margin-top: 8px;
}

/* ── PRIORITY GRID ── */
.priority-grid { display: flex; flex-direction: column; gap: 10px; }

.prio-card {
  display: flex; align-items: center; gap: 16px;
  width: 100%; padding: 14px 18px;
  background: var(--bg); border: 2px solid var(--border);
  border-radius: 14px; cursor: pointer; font-family: var(--font);
  text-align: left; position: relative;
}

.prio-card[data-level="high"].prio-card--active  { border-color: #ef4444; background: #fff5f5; }
.prio-card[data-level="medium"].prio-card--active { border-color: #f59e0b; background: #fffbeb; }
.prio-card[data-level="low"].prio-card--active    { border-color: #06b6d4; background: #f0fdff; }

.prio-card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.prio-icon-high   { background: #fee2e2; color: #ef4444; }
.prio-icon-medium { background: #fef3c7; color: #f59e0b; }
.prio-icon-low    { background: #cffafe; color: #06b6d4; }

.prio-card[data-level="high"].prio-card--active   .prio-icon-high   { background: #ef4444; color: #fff; }
.prio-card[data-level="medium"].prio-card--active .prio-icon-medium { background: #f59e0b; color: #fff; }
.prio-card[data-level="low"].prio-card--active    .prio-icon-low    { background: #06b6d4; color: #fff; }

.prio-card-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.prio-card-name { font-size: 14px; font-weight: 700; color: var(--ink); }
.prio-card-desc { font-size: 12px; font-weight: 500; color: var(--ink-m); }

.prio-card-check {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid var(--border); display: flex;
  align-items: center; justify-content: center;
  flex-shrink: 0; color: transparent; background: var(--white);
}
.prio-card--active .prio-card-check { border-color: transparent; color: white; }
.prio-card[data-level="high"].prio-card--active   .prio-card-check { background: #ef4444; }
.prio-card[data-level="medium"].prio-card--active .prio-card-check { background: #f59e0b; }
.prio-card[data-level="low"].prio-card--active    .prio-card-check { background: #06b6d4; }

/* ── SELECT ── */
.select-wrap {
  position: relative; display: flex; align-items: center;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 12px; overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.select-wrap:focus-within {
  border-color: var(--purple); background: var(--white);
  box-shadow: 0 0 0 4px rgba(139,92,246,0.1);
}
.select-icon { flex-shrink: 0; margin-left: 14px; color: var(--ink-m); pointer-events: none; }
.select-wrap:focus-within .select-icon { color: var(--purple); }

.field-select {
  flex: 1; height: 52px; padding: 0 40px 0 12px;
  border: none; background: transparent;
  font-size: 14px; font-family: var(--font); font-weight: 500;
  color: var(--ink); outline: none; appearance: none; cursor: pointer;
}
.select-arrow { position: absolute; right: 14px; color: var(--ink-m); pointer-events: none; flex-shrink: 0; }

/* ── ROW ── */
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* ── DIVIDER ── */
.form-divider { height: 1px; background: var(--border); margin: 4px 0 28px; }

/* ── ACTIONS ── */
.form-actions { display: flex; gap: 12px; justify-content: flex-end; }

.cancel-btn {
  height: 50px; padding: 0 28px; background: var(--bg);
  color: var(--ink); border: 1.5px solid var(--border); border-radius: 12px;
  font-size: 14px; font-weight: 600; font-family: var(--font); cursor: pointer;
}
.submit-btn {
  height: 50px; padding: 0 32px;
  background: linear-gradient(135deg, #8b5cf6 0%, #9333ea 100%);
  color: #ffffff; border: none; border-radius: 12px;
  font-size: 14px; font-weight: 700; font-family: var(--font);
  cursor: pointer; display: flex; align-items: center; gap: 8px;
}
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spin-ring-sm {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── PREVIEW ── */
.preview-panel { position: sticky; top: 32px; }

.preview-label {
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  letter-spacing: 0.8px; margin-bottom: 14px;
}

.preview-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; padding: 20px; border-left-width: 4px; margin-bottom: 12px;
}
.preview-card.prio-high   { border-left-color: var(--red); }
.preview-card.prio-medium { border-left-color: var(--orange); }
.preview-card.prio-low    { border-left-color: var(--cyan); }

.preview-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }

.preview-prio-tag {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
}
.preview-prio-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.preview-prio-tag.prio-high   { background: #fee2e2; color: #b91c1c; }
.preview-prio-tag.prio-medium { background: #fef3c7; color: #92400e; }
.preview-prio-tag.prio-low    { background: #cffafe; color: #155e75; }

.preview-status-tag {
  padding: 5px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
}
.preview-status-tag.stat-pending { background: #fef3c7; color: #92400e; }
.preview-status-tag.stat-wip     { background: #dbeafe; color: #1e40af; }
.preview-status-tag.stat-done    { background: #d1fae5; color: #065f46; }

.preview-card-title { font-size: 15px; font-weight: 700; color: var(--ink); font-family: var(--fdisp); margin-bottom: 8px; line-height: 1.4; }
.preview-card-desc { font-size: 13px; color: var(--ink-m); line-height: 1.5; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.preview-card-footer { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-m); font-weight: 500; padding-top: 14px; border-top: 1px solid var(--border); }

.preview-prio-bar {
  border-radius: 12px; padding: 12px 16px;
  font-size: 13px; font-weight: 600;
}
.preview-prio-bar.prio-high   { background: #fff5f5; color: #b91c1c; }
.preview-prio-bar.prio-medium { background: #fffbeb; color: #92400e; }
.preview-prio-bar.prio-low    { background: #f0fdff; color: #155e75; }

/* ── TOAST ── */
.toast-msg {
  position: fixed; bottom: 32px; right: 32px;
  display: flex; align-items: center; gap: 12px;
  padding: 16px 24px; background: var(--white);
  border-radius: 12px; box-shadow: 0 8px 24px rgba(13,27,54,0.16);
  font-size: 14px; font-weight: 600; z-index: 2000; border: 1px solid var(--border);
}
.toast-msg.success { border-left: 4px solid var(--green); }
.toast-msg.success svg { color: var(--green); }
.toast-msg.error   { border-left: 4px solid var(--red); }
.toast-msg.error svg { color: var(--red); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .form-wrapper { grid-template-columns: 1fr; }
  .preview-panel { position: static; }
}
@media (max-width: 968px) {
  .app-shell { grid-template-areas: "nav" "main"; grid-template-columns: 1fr; }
  .side-panel { display: none; }
  .content-area { padding: 24px 20px; }
  .field-row { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  :root { --bar-h: 56px; }
  .content-area { padding: 16px; }
  .content-title { font-size: 22px; }
  .form-card { padding: 20px; }
}
</style>