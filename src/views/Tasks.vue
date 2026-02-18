<!-- Tasks.vue -->
<!-- Professional Task Management Page with Full API Integration -->
<template>
  <div class="tasks-wrapper">
    <!-- Top Navigation -->
    <nav class="tasks-header-nav">
      <div class="tasks-header-inner">
        <div class="tasks-header-left">
          <!-- Mobile Menu Toggle Button -->
          <button class="tasks-mobile-menu-btn" @click="toggleMobileSidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div class="tasks-brand-block">
            <div class="tasks-brand-logo">
              <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="11" fill="#4a90e2"/>
                <polygon points="21,10 33,16 21,22 9,16" fill="white" opacity="0.95"/>
                <rect x="13" y="25" width="16" height="7" rx="2" fill="white"/>
              </svg>
            </div>
            <div class="tasks-brand-text">
              <span class="tasks-brand-name">NovaSpace</span>
              <span class="tasks-brand-plan">Free Plan</span>
            </div>
          </div>

          <div class="tasks-global-search">
            <svg class="tasks-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              v-model="globalSearch"
              @input="handleGlobalSearch"
              placeholder="Search all tasks..."
              class="tasks-search-input"
            />
          </div>
        </div>

        <div class="tasks-header-right">
          <button class="tasks-notif-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tasks-notif-dot"></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Sidebar Overlay -->
    <transition name="tasks-fade">
      <div v-if="mobileSidebarOpen" class="tasks-mobile-overlay" @click="mobileSidebarOpen = false"></div>
    </transition>

    <!-- Sidebar -->
    <transition name="tasks-slide">
      <aside class="tasks-side-panel" :class="{ 'tasks-side-panel--mobile-open': mobileSidebarOpen }">
        <!-- Mobile Sidebar Header with Close Button -->
        <div class="tasks-sidebar-mobile-header">
          <div class="tasks-sidebar-mobile-brand">
            <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#4a90e2"/>
              <polygon points="21,10 33,16 21,22 9,16" fill="white" opacity="0.95"/>
              <rect x="13" y="25" width="16" height="7" rx="2" fill="white"/>
            </svg>
            <span class="tasks-sidebar-mobile-title">NovaSpace</span>
          </div>
          <button class="tasks-sidebar-mobile-close" @click="mobileSidebarOpen = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <router-link to="/tasks/create" class="tasks-create-btn" @click="mobileSidebarOpen = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add New Task
        </router-link>

        <div class="tasks-panel-section">
          <div class="tasks-section-label">QUICK ACCESS</div>
          <nav class="tasks-side-nav">
            <button 
              @click="currentView = 'my-tasks'; mobileSidebarOpen = false"
              :class="['tasks-side-link', currentView === 'my-tasks' ? 'tasks-side-link--active' : '']"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>My Tasks</span>
            </button>

            <button 
              @click="currentView = 'team-tasks'; mobileSidebarOpen = false"
              :class="['tasks-side-link', currentView === 'team-tasks' ? 'tasks-side-link--active' : '']"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>Team Tasks</span>
            </button>

            <button class="tasks-side-link" @click="showFilterDialog = true; mobileSidebarOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Filter Tasks</span>
            </button>
          </nav>
        </div>

        <div class="tasks-panel-section">
          <div class="tasks-section-label">MAIN</div>
          <nav class="tasks-side-nav">
            <router-link to="/dashboard" class="tasks-side-link" @click="mobileSidebarOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Dashboard</span>
            </router-link>

            <router-link to="/tasks" class="tasks-side-link tasks-side-link--active" @click="mobileSidebarOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>My Tasks</span>
            </router-link>

            <router-link to="/projects" class="tasks-side-link" @click="mobileSidebarOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>Projects</span>
            </router-link>

            <router-link to="/calendar" class="tasks-side-link" @click="mobileSidebarOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>Calendar</span>
            </router-link>
          </nav>
        </div>

        <!-- Task Overview Stats -->
        <div class="tasks-stats-widget">
          <h3 class="tasks-stats-title">Task Overview</h3>
          <div class="tasks-stats-list">
            <div class="tasks-stats-row">
              <span class="tasks-stats-key">Total Tasks</span>
              <span class="tasks-stats-val">{{ taskStats.total }}</span>
            </div>
            <div class="tasks-stats-row">
              <span class="tasks-stats-key">Completed</span>
              <span class="tasks-stats-val tasks-stats-val--done">{{ taskStats.completed }}</span>
            </div>
            <div class="tasks-stats-row">
              <span class="tasks-stats-key">In Progress</span>
              <span class="tasks-stats-val tasks-stats-val--wip">{{ taskStats.inProgress }}</span>
            </div>
            <div class="tasks-stats-row">
              <span class="tasks-stats-key">Overdue</span>
              <span class="tasks-stats-val tasks-stats-val--late">{{ taskStats.overdue }}</span>
            </div>
          </div>
        </div>
      </aside>
    </transition>

    <!-- Main Content -->
    <main class="tasks-content-area">
      <!-- Page Header -->
      <header class="tasks-content-header">
        <div>
          <h1 class="tasks-content-title">
            <button class="tasks-back-arrow" @click="$router.go(-1)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            {{ currentView === 'my-tasks' ? 'My Tasks' : 'Team Tasks' }}
          </h1>
          <p class="tasks-content-subtitle">Manage and track your tasks efficiently</p>
        </div>
      </header>

      <!-- Filters and Actions -->
      <div class="tasks-action-bar">
        <div class="tasks-filter-controls">
          <select v-model="priorityFilter" @change="applyFilters" class="tasks-filter-dropdown">
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select v-model="statusFilter" @change="applyFilters" class="tasks-filter-dropdown">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <div class="tasks-inline-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              @input="handleSearch"
              @keyup.enter="performSearch"
              placeholder="Search tasks..."
              class="tasks-inline-search-field"
            />
          </div>
        </div>

        <button class="tasks-sort-btn" @click="toggleSort">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M7 12h10M11 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Sort
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="tasks-state-loading">
        <div class="tasks-spin-ring"></div>
        <p>Loading your tasks...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="tasks-state-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="loadTasks" class="tasks-retry-btn">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="displayedTasks.length === 0" class="tasks-state-empty">
        <div class="tasks-empty-graphic">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>No tasks found</h3>
        <p>{{ searchQuery || statusFilter || priorityFilter ? 'Try adjusting your filters' : 'Create your first task to get started' }}</p>
        <button v-if="!searchQuery && !statusFilter && !priorityFilter" class="tasks-primary-lg-btn" @click="goToCreateTask">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Create Task
        </button>
      </div>

      <!-- Active Tasks Section -->
      <div v-else>
        <div class="tasks-list-header">
          <h2 class="tasks-list-title">{{ getFilteredTitle() }}</h2>
          <span class="tasks-list-count">{{ displayedTasks.length }} task(s)</span>
        </div>

        <div class="tasks-card-grid">
          <div 
            v-for="task in displayedTasks" 
            :key="task.id"
            class="tasks-task-card"
            :class="[getPriorityClass(task.priority), getStatusClass(task.status)]"
            @click="viewTask(task)"
          >
            <!-- Priority Badge -->
            <div class="tasks-card-top">
              <span class="tasks-priority-tag" :class="getPriorityClass(task.priority)">
                {{ formatPriority(task.priority) }}
              </span>
              <div class="tasks-card-menu-wrap">
                <button class="tasks-menu-trigger" @click.stop="toggleMenu(task.id)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div v-if="activeMenu === task.id" class="tasks-card-dropdown" @click.stop>
                  <button @click="editTask(task)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Edit
                  </button>
                  <button @click="toggleTaskStatus(task)" :class="task.status === 'COMPLETED' ? '' : 'tasks-menu-success'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    {{ task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete' }}
                  </button>
                  <button @click="deleteTask(task.id)" class="tasks-menu-danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Task Content -->
            <div class="tasks-card-body">
              <h3 class="tasks-card-title">{{ task.title }}</h3>
              <p class="tasks-card-desc">{{ task.description || 'No description' }}</p>
            </div>

            <!-- Progress Bar -->
            <div class="tasks-card-progress">
              <div class="tasks-progress-meta">
                <span class="tasks-progress-label">Progress</span>
                <span class="tasks-progress-pct">{{ task.progress || 0 }}%</span>
              </div>
              <div class="tasks-progress-rail">
                <div 
                  class="tasks-progress-bar" 
                  :class="getPriorityClass(task.priority)"
                  :style="{ width: (task.progress || 0) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Task Footer -->
            <div class="tasks-card-footer">
              <span class="tasks-due-label" :class="{ 'tasks-due-label--late': isOverdue(task.dueDate) }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Due: {{ formatDate(task.dueDate) }}
              </span>
              <span class="tasks-status-tag" :class="getStatusClass(task.status)">
                {{ formatStatus(task.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <transition name="tasks-toast">
      <div v-if="toast.show" class="tasks-toast-msg" :class="toast.type">
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
  name: 'Tasks',
  data() {
    return {
      currentView: 'my-tasks',
      tasks: [],
      displayedTasks: [],
      loading: true,
      error: null,
      searchQuery: '',
      globalSearch: '',
      priorityFilter: '',
      statusFilter: '',
      activeMenu: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      searchTimeout: null,
      // Mobile sidebar state
      mobileSidebarOpen: false
    };
  },
  computed: {
    isAuthenticated() {
      return TokenService.isAuthenticated();
    },
    taskStats() {
      return {
        total: this.tasks.length,
        completed: this.tasks.filter(t => t.status === 'COMPLETED').length,
        inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
        overdue: this.tasks.filter(t => this.isOverdue(t.dueDate) && t.status !== 'COMPLETED').length
      };
    }
  },
  methods: {
    // Mobile sidebar toggle
    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
    },

    goToCreateTask() {
      this.$router.push('/tasks/create');
    },

    async loadTasks() {
      try {
        this.loading = true;
        this.error = null;

        const data = await TasksAPI.getAllUserTasks();
        
        this.tasks = data.map(task => ({
          ...task,
          progress: this.calculateProgress(task.createdAt, task.dueDate, task.status)
        }));

        this.displayedTasks = [...this.tasks];
      } catch (error) {
        this.error = error.message || 'Failed to load tasks';
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(taskId) {
      if (!confirm('Are you sure you want to delete this task?')) return;

      try {
        await TasksAPI.deleteUserTask(taskId);
        this.showToast('Task deleted successfully', 'success');
        await this.loadTasks();
      } catch (error) {
        this.showToast(error.message || 'Failed to delete task', 'error');
      }
      this.activeMenu = null;
    },

    async toggleTaskStatus(task) {
      try {
        const newStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        await TasksAPI.updateUserTask(task.id, { status: newStatus });
        this.showToast(`Task marked as ${newStatus.toLowerCase().replace('_', ' ')}`, 'success');
        await this.loadTasks();
      } catch (error) {
        this.showToast('Failed to update task status', 'error');
      }
      this.activeMenu = null;
    },

    editTask(task) {
      this.$router.push(`/tasks/edit/${task.id}`);
      this.activeMenu = null;
    },

    viewTask(task) {
      this.$router.push(`/tasks/${task.id}`);
    },

    applyFilters() {
      let filtered = [...this.tasks];

      if (this.priorityFilter) {
        filtered = filtered.filter(t => t.priority === this.priorityFilter);
      }

      if (this.statusFilter) {
        filtered = filtered.filter(t => t.status === this.statusFilter);
      }

      this.displayedTasks = filtered;
    },

    async performSearch() {
      if (!this.searchQuery.trim()) {
        this.displayedTasks = [...this.tasks];
        return;
      }

      try {
        this.loading = true;
        const results = await TasksAPI.searchUserTasks(this.searchQuery);
        this.displayedTasks = results.map(task => ({
          ...task,
          progress: this.calculateProgress(task.createdAt, task.dueDate, task.status)
        }));
      } catch (error) {
        this.showToast('Search failed', 'error');
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.length >= 2 || this.searchQuery.length === 0) {
          this.performSearch();
        }
      }, 500);
    },

    handleGlobalSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchQuery = this.globalSearch;
        this.performSearch();
      }, 500);
    },

    toggleMenu(taskId) {
      this.activeMenu = this.activeMenu === taskId ? null : taskId;
    },

    closeAllMenus() {
      this.activeMenu = null;
    },

    toggleSort() {
      this.displayedTasks.reverse();
    },

    getFilteredTitle() {
      if (this.statusFilter) return `${this.formatStatus(this.statusFilter)} Tasks`;
      if (this.priorityFilter) return `${this.formatPriority(this.priorityFilter)} Priority Tasks`;
      return 'Active Tasks';
    },

    formatDate(dateString) {
      if (!dateString) return 'No deadline';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    formatStatus(status) {
      if (!status) return 'Unknown';
      return status.replace(/_/g, ' ');
    },

    formatPriority(priority) {
      return priority || 'Medium';
    },

    getPriorityClass(priority) {
      const map = { 'HIGH': 'tasks-prio-high', 'MEDIUM': 'tasks-prio-medium', 'LOW': 'tasks-prio-low' };
      return map[priority] || 'tasks-prio-medium';
    },

    getStatusClass(status) {
      const map = {
        'PENDING': 'tasks-stat-pending',
        'IN_PROGRESS': 'tasks-stat-wip',
        'COMPLETED': 'tasks-stat-done',
        'OVERDUE': 'tasks-stat-late'
      };
      return map[status] || 'tasks-stat-pending';
    },

    isOverdue(dueDate) {
      if (!dueDate) return false;
      return new Date(dueDate) < new Date() && this.status !== 'COMPLETED';
    },

    calculateProgress(startDate, dueDate, status) {
      if (status === 'COMPLETED') return 100;
      if (status === 'PENDING') return 0;
      if (!startDate || !dueDate) return 50;

      const start = new Date(startDate).getTime();
      const end = new Date(dueDate).getTime();
      const now = new Date().getTime();

      if (now < start) return 20;
      if (now > end) return 90;

      const totalDuration = end - start;
      const elapsed = now - start;
      return Math.min(90, Math.max(20, Math.round((elapsed / totalDuration) * 100)));
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },
  async mounted() {
    if (!this.isAuthenticated) {
      this.$router.push('/auth');
      return;
    }
    await this.loadTasks();
    document.addEventListener('click', this.closeAllMenus);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeAllMenus);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

.tasks-wrapper {
  --tasks-blue:      #4a90e2;
  --tasks-blue-dk:   #2c6fbd;
  --tasks-blue-soft: #e8f2fc;
  --tasks-blue-mid:  #c9dff5;
  --tasks-blue-glow: rgba(74,144,226,0.22);
  --tasks-ink:       #0d1b36;
  --tasks-ink-s:     #2d3748;
  --tasks-ink-m:     #64748b;
  --tasks-white:     #ffffff;
  --tasks-border:    #e2ecf6;
  --tasks-bg:        #f8fafc;
  --tasks-purple:    #8b5cf6;
  --tasks-green:     #10b981;
  --tasks-orange:    #f59e0b;
  --tasks-red:       #ef4444;
  --tasks-pink:      #ec4899;
  --tasks-cyan:      #06b6d4;
  --tasks-bar-h:     64px;
  --tasks-sidebar-w: 260px;
  --tasks-font:      'Manrope', sans-serif;
  --tasks-fdisp:     'Space Grotesk', sans-serif;
  --tasks-ease:      cubic-bezier(0.22,1,0.36,1);
  --tasks-shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --tasks-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --tasks-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  
  min-height: 100vh;
  background: var(--tasks-bg);
  font-family: var(--tasks-font);
  display: grid;
  grid-template-areas: "nav nav" "sidebar main";
  grid-template-rows: var(--tasks-bar-h) 1fr;
  grid-template-columns: var(--tasks-sidebar-w) 1fr;
}

.tasks-wrapper * { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
}

/* ===== HEADER ===== */
.tasks-header-nav {
  grid-area: nav;
  background: var(--tasks-white);
  border-bottom: 1px solid var(--tasks-border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--tasks-bar-h);
}

.tasks-header-inner {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tasks-header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  max-width: 60%;
}

/* Mobile Menu Button */
.tasks-mobile-menu-btn {
  display: none;
  width: 38px;
  height: 38px;
  border: 1px solid var(--tasks-border);
  background: var(--tasks-white);
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--tasks-ink-m);
  transition: all 0.2s var(--tasks-ease);
}

.tasks-mobile-menu-btn:hover {
  border-color: var(--tasks-purple);
  color: var(--tasks-purple);
  background: var(--tasks-blue-soft);
}

.tasks-brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 24px;
  border-right: 1px solid var(--tasks-border);
}

.tasks-brand-logo { width: 36px; height: 36px; flex-shrink: 0; }

.tasks-brand-text { display: flex; flex-direction: column; }

.tasks-brand-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--tasks-ink);
  line-height: 1.2;
  font-family: var(--tasks-fdisp);
}

.tasks-brand-plan { font-size: 11px; font-weight: 600; color: var(--tasks-ink-m); }

.tasks-global-search {
  flex: 1;
  max-width: 400px;
  position: relative;
  display: flex;
  align-items: center;
}

.tasks-search-icon {
  position: absolute;
  left: 14px;
  color: var(--tasks-ink-m);
  pointer-events: none;
  z-index: 1;
}

.tasks-search-input {
  width: 100%;
  height: 40px;
  padding: 0 16px 0 40px;
  border: 1px solid var(--tasks-border);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--tasks-font);
  color: var(--tasks-ink);
  background: var(--tasks-bg);
  transition: all 0.2s var(--tasks-ease);
}

.tasks-search-input:focus {
  outline: none;
  border-color: var(--tasks-blue);
  background: var(--tasks-white);
  box-shadow: 0 0 0 3px var(--tasks-blue-glow);
}

.tasks-search-input::placeholder { color: var(--tasks-ink-m); }

.tasks-header-right { display: flex; align-items: center; gap: 12px; }

.tasks-notif-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid var(--tasks-border);
  background: var(--tasks-white);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--tasks-ink-m);
  transition: all 0.2s var(--tasks-ease);
}

.tasks-notif-btn:hover {
  background: var(--tasks-bg);
  color: var(--tasks-ink);
}

.tasks-notif-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: var(--tasks-red);
  border-radius: 50%;
  border: 1.5px solid var(--tasks-white);
}

/* Mobile Sidebar Components */
.tasks-mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(13, 27, 54, 0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  animation: tasks-fade-in 0.2s ease;
}

.tasks-sidebar-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--tasks-border);
}

.tasks-sidebar-mobile-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tasks-sidebar-mobile-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--tasks-ink);
  font-family: var(--tasks-fdisp);
}

.tasks-sidebar-mobile-close {
  width: 36px;
  height: 36px;
  border: 1px solid var(--tasks-border);
  background: var(--tasks-white);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--tasks-ink-m);
  transition: all 0.2s var(--tasks-ease);
}

.tasks-sidebar-mobile-close:hover {
  border-color: var(--tasks-red);
  color: var(--tasks-red);
  background: #fee2e2;
}

@keyframes tasks-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== SIDEBAR ===== */
.tasks-side-panel {
  grid-area: sidebar;
  background: var(--tasks-white);
  border-right: 1px solid var(--tasks-border);
  padding: 24px 16px;
  overflow-y: auto;
  height: calc(100vh - var(--tasks-bar-h));
  position: sticky;
  top: var(--tasks-bar-h);
  transition: transform 0.3s var(--tasks-ease);
}

.tasks-side-panel::-webkit-scrollbar { width: 6px; }
.tasks-side-panel::-webkit-scrollbar-track { background: var(--tasks-bg); }
.tasks-side-panel::-webkit-scrollbar-thumb { background: var(--tasks-border); border-radius: 3px; }

.tasks-create-btn,
a.tasks-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6 0%, #9333ea 100%);
  color: #ffffff !important;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--tasks-font);
  cursor: pointer;
  margin-bottom: 24px;
  text-decoration: none;
  box-sizing: border-box;
  letter-spacing: 0.2px;
  transition: all 0.3s var(--tasks-ease);
}

.tasks-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);
}

.tasks-panel-section { margin-bottom: 24px; }

.tasks-section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--tasks-ink-m);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 0 8px;
}

.tasks-side-nav { display: flex; flex-direction: column; gap: 4px; }

.tasks-side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--tasks-ink-m);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  border: none;
  background: none;
  font-family: var(--tasks-font);
  width: 100%;
  text-align: left;
  transition: all 0.2s var(--tasks-ease);
}

.tasks-side-link:hover {
  background: var(--tasks-bg);
  color: var(--tasks-ink);
}

.tasks-side-link--active {
  background: #ede9fe;
  color: var(--tasks-purple);
  font-weight: 600;
}

.tasks-side-link svg { flex-shrink: 0; }

/* Stats Widget */
.tasks-stats-widget {
  background: var(--tasks-bg);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  border: 1px solid var(--tasks-border);
}

.tasks-stats-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--tasks-ink);
  margin-bottom: 16px;
  font-family: var(--tasks-fdisp);
}

.tasks-stats-list { display: flex; flex-direction: column; gap: 12px; }

.tasks-stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.tasks-stats-key { color: var(--tasks-ink-m); font-weight: 500; }

.tasks-stats-val {
  font-weight: 800;
  font-family: var(--tasks-fdisp);
  font-size: 18px;
  color: var(--tasks-ink);
}

.tasks-stats-val--done { color: var(--tasks-green); }
.tasks-stats-val--wip  { color: var(--tasks-orange); }
.tasks-stats-val--late { color: var(--tasks-red); }

/* ===== MAIN CONTENT ===== */
.tasks-content-area {
  grid-area: main;
  padding: 32px;
  overflow-y: auto;
  max-height: calc(100vh - var(--tasks-bar-h));
}

.tasks-content-header {
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.tasks-content-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--tasks-ink);
  font-family: var(--tasks-fdisp);
  margin-bottom: 6px;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tasks-back-arrow {
  width: 36px;
  height: 36px;
  background: var(--tasks-bg);
  border: 1px solid var(--tasks-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--tasks-ink-m);
  transition: all 0.2s var(--tasks-ease);
}

.tasks-back-arrow:hover {
  background: var(--tasks-white);
  color: var(--tasks-ink);
}

.tasks-content-subtitle { font-size: 15px; color: var(--tasks-ink-m); font-weight: 500; }

/* ===== ACTION BAR ===== */
.tasks-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;
}

.tasks-filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 300px;
}

.tasks-filter-dropdown {
  height: 44px;
  padding: 0 40px 0 16px;
  border: 1px solid var(--tasks-border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--tasks-ink);
  background: var(--tasks-white);
  font-family: var(--tasks-font);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  min-width: 150px;
  transition: all 0.2s var(--tasks-ease);
}

.tasks-filter-dropdown:focus {
  outline: none;
  border-color: var(--tasks-purple);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

.tasks-inline-search { position: relative; flex: 1; max-width: 400px; }

.tasks-inline-search svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--tasks-ink-m);
  pointer-events: none;
}

.tasks-inline-search-field {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 40px;
  border: 1px solid var(--tasks-border);
  border-radius: 10px;
  font-size: 14px;
  font-family: var(--tasks-font);
  color: var(--tasks-ink);
  background: var(--tasks-white);
  transition: all 0.2s var(--tasks-ease);
}

.tasks-inline-search-field:focus {
  outline: none;
  border-color: var(--tasks-purple);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

.tasks-inline-search-field::placeholder { color: var(--tasks-ink-m); }

.tasks-sort-btn {
  height: 44px;
  padding: 0 20px;
  background: var(--tasks-white);
  border: 1px solid var(--tasks-border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--tasks-font);
  color: var(--tasks-ink);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s var(--tasks-ease);
}

.tasks-sort-btn:hover {
  background: var(--tasks-bg);
}

/* ===== STATES ===== */
.tasks-state-loading,
.tasks-state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--tasks-white);
  border-radius: 16px;
  padding: 48px;
  border: 1px solid var(--tasks-border);
}

.tasks-spin-ring {
  width: 48px;
  height: 48px;
  border: 4px solid var(--tasks-border);
  border-top-color: var(--tasks-purple);
  border-radius: 50%;
  animation: tasks-spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes tasks-spin { to { transform: rotate(360deg); } }

.tasks-state-loading p, .tasks-state-error p { font-size: 16px; color: var(--tasks-ink-m); font-weight: 600; }

.tasks-state-error svg { color: var(--tasks-red); margin-bottom: 20px; }
.tasks-state-error p { margin-bottom: 24px; }

.tasks-retry-btn {
  height: 44px;
  padding: 0 24px;
  background: var(--tasks-purple);
  color: var(--tasks-white);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--tasks-font);
  transition: all 0.3s var(--tasks-ease);
}

.tasks-retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);
}

.tasks-state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--tasks-white);
  border-radius: 16px;
  padding: 48px;
  border: 1px solid var(--tasks-border);
  text-align: center;
}

.tasks-empty-graphic {
  width: 100px;
  height: 100px;
  background: #ede9fe;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.tasks-empty-graphic svg { color: var(--tasks-purple); }

.tasks-state-empty h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--tasks-ink);
  margin-bottom: 8px;
  font-family: var(--tasks-fdisp);
}

.tasks-state-empty p { font-size: 15px; color: var(--tasks-ink-m); margin-bottom: 24px; }

.tasks-primary-lg-btn {
  height: 44px;
  padding: 0 24px;
  background: linear-gradient(135deg, var(--tasks-purple) 0%, #9333ea 100%);
  color: var(--tasks-white);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--tasks-font);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s var(--tasks-ease);
}

.tasks-primary-lg-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);
}

/* ===== LIST HEADER ===== */
.tasks-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.tasks-list-title { font-size: 20px; font-weight: 700; color: var(--tasks-ink); font-family: var(--tasks-fdisp); }
.tasks-list-count { font-size: 14px; font-weight: 600; color: var(--tasks-ink-m); }

/* ===== CARD GRID ===== */
.tasks-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.tasks-task-card {
  background: var(--tasks-white);
  border: 1px solid var(--tasks-border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  position: relative;
  border-left-width: 4px;
  transition: all 0.3s var(--tasks-ease);
}

.tasks-task-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--tasks-shadow-lg);
}

.tasks-task-card.tasks-prio-high  { border-left-color: var(--tasks-red); }
.tasks-task-card.tasks-prio-medium { border-left-color: var(--tasks-orange); }
.tasks-task-card.tasks-prio-low   { border-left-color: var(--tasks-cyan); }

.tasks-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tasks-priority-tag {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.tasks-priority-tag.tasks-prio-high   { background: #fee2e2; color: #991b1b; }
.tasks-priority-tag.tasks-prio-medium { background: #fef3c7; color: #92400e; }
.tasks-priority-tag.tasks-prio-low    { background: #cffafe; color: #155e75; }

.tasks-card-menu-wrap { position: relative; }

.tasks-menu-trigger {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--tasks-bg);
  border-radius: 8px;
  color: var(--tasks-ink-m);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s var(--tasks-ease);
}

.tasks-menu-trigger:hover {
  background: #ede9fe;
  color: var(--tasks-purple);
}

.tasks-card-dropdown {
  position: absolute;
  top: 36px;
  right: 0;
  background: var(--tasks-white);
  border: 1px solid var(--tasks-border);
  border-radius: 10px;
  box-shadow: var(--tasks-shadow-lg);
  z-index: 100;
  min-width: 180px;
  overflow: hidden;
  animation: tasks-dropdown-in 0.2s var(--tasks-ease);
}

@keyframes tasks-dropdown-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tasks-card-dropdown button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  font-family: var(--tasks-font);
  font-size: 14px;
  font-weight: 500;
  color: var(--tasks-ink);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s var(--tasks-ease);
}

.tasks-card-dropdown button:hover {
  background: #ede9fe;
  color: var(--tasks-purple);
}

.tasks-card-dropdown button.tasks-menu-danger { color: var(--tasks-red); }
.tasks-card-dropdown button.tasks-menu-danger:hover { background: #fee2e2; }
.tasks-card-dropdown button.tasks-menu-success { color: var(--tasks-green); }
.tasks-card-dropdown button.tasks-menu-success:hover { background: #d1fae5; }

.tasks-card-body { margin-bottom: 16px; }

.tasks-card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--tasks-ink);
  font-family: var(--tasks-fdisp);
  margin-bottom: 8px;
  line-height: 1.3;
}

.tasks-card-desc {
  font-size: 14px;
  color: var(--tasks-ink-m);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tasks-card-progress { margin-bottom: 16px; }

.tasks-progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.tasks-progress-label { font-weight: 600; color: var(--tasks-ink-m); }
.tasks-progress-pct { font-size: 13px; font-weight: 800; color: var(--tasks-ink); font-family: var(--tasks-fdisp); }

.tasks-progress-rail {
  width: 100%;
  height: 8px;
  background: var(--tasks-border);
  border-radius: 8px;
  overflow: hidden;
}

.tasks-progress-bar {
  height: 100%;
  border-radius: 8px;
  transition: width 0.6s var(--tasks-ease);
}

.tasks-progress-bar.tasks-prio-high   { background: linear-gradient(90deg, var(--tasks-red) 0%, #dc2626 100%); }
.tasks-progress-bar.tasks-prio-medium { background: linear-gradient(90deg, var(--tasks-orange) 0%, #d97706 100%); }
.tasks-progress-bar.tasks-prio-low    { background: linear-gradient(90deg, var(--tasks-cyan) 0%, #0891b2 100%); }

.tasks-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--tasks-border);
}

.tasks-due-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--tasks-ink-m);
  font-weight: 500;
}

.tasks-due-label--late { color: var(--tasks-red); }

.tasks-status-tag {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.tasks-status-tag.tasks-stat-pending { background: #fef3c7; color: #92400e; }
.tasks-status-tag.tasks-stat-wip     { background: #dbeafe; color: #1e40af; }
.tasks-status-tag.tasks-stat-done    { background: #d1fae5; color: #065f46; }
.tasks-status-tag.tasks-stat-late    { background: #fee2e2; color: #991b1b; }

/* ===== TOAST ===== */
.tasks-toast-msg {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--tasks-white);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(13, 27, 54, 0.16);
  font-size: 14px;
  font-weight: 600;
  z-index: 2000;
  border: 1px solid var(--tasks-border);
}

.tasks-toast-msg.success { border-left: 4px solid var(--tasks-green); }
.tasks-toast-msg.success svg { color: var(--tasks-green); }
.tasks-toast-msg.error   { border-left: 4px solid var(--tasks-red); }
.tasks-toast-msg.error svg { color: var(--tasks-red); }

/* ===== TRANSITIONS ===== */
.tasks-toast-enter-active, .tasks-toast-leave-active { transition: all 0.3s var(--tasks-ease); }
.tasks-toast-enter-from, .tasks-toast-leave-to { opacity: 0; transform: translateY(20px); }

.tasks-slide-enter-active,
.tasks-slide-leave-active {
  transition: transform 0.3s var(--tasks-ease);
}
.tasks-slide-enter-from {
  transform: translateX(-100%);
}
.tasks-slide-leave-to {
  transform: translateX(-100%);
}

.tasks-fade-enter-active,
.tasks-fade-leave-active {
  transition: opacity 0.3s ease;
}
.tasks-fade-enter-from,
.tasks-fade-leave-to {
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .tasks-card-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
}

@media (max-width: 968px) {
  .tasks-wrapper {
    grid-template-areas: "nav" "main";
    grid-template-columns: 1fr;
  }
  
  .tasks-mobile-menu-btn {
    display: flex;
  }
  
  .tasks-mobile-overlay {
    display: block;
  }
  
  .tasks-side-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    z-index: 300;
    transform: translateX(-100%);
    border-right: 1px solid var(--tasks-border);
    box-shadow: none;
    padding-top: 20px;
  }
  
  .tasks-side-panel--mobile-open {
    transform: translateX(0);
    box-shadow: var(--tasks-shadow-lg);
  }
  
  .tasks-sidebar-mobile-header {
    display: flex;
  }
  
  .tasks-header-left { max-width: 100%; }
  
  .tasks-brand-block { 
    border-right: none; 
    padding-right: 0; 
  }
  
  .tasks-content-area { padding: 24px 20px; }
  .tasks-action-bar { flex-direction: column; align-items: stretch; }
  .tasks-filter-controls { flex-direction: column; min-width: auto; }
  .tasks-inline-search { max-width: 100%; }
  .tasks-filter-dropdown { width: 100%; }
  
  .tasks-stats-widget {
    margin-bottom: 20px;
  }
}

@media (max-width: 640px) {
  .tasks-wrapper { --tasks-bar-h: 56px; }
  .tasks-brand-block { border-right: none; padding-right: 0; }
  .tasks-global-search { display: none; }
  .tasks-card-grid { grid-template-columns: 1fr; }
  .tasks-content-area { padding: 16px; }
  .tasks-content-title { font-size: 22px; }
  
  .tasks-side-panel {
    width: 100%;
  }
  
  .tasks-filter-controls {
    gap: 8px;
  }
  
  .tasks-toast-msg {
    left: 16px;
    right: 16px;
    bottom: 16px;
    max-width: none;
  }
}
</style>