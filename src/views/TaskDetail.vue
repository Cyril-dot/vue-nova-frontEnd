<!-- TaskDetail.vue -->
<!-- Task Detail + Inline Edit Page -->
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
          <router-link to="/tasks" class="side-link side-link--active">
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

      <!-- Task mini-status in sidebar -->
      <div v-if="task" class="task-sidebar-info">
        <div class="sidebar-info-title">This Task</div>
        <div class="sidebar-status-row">
          <span class="sidebar-dot" :class="getPriorityClass(task.priority)"></span>
          <span class="sidebar-info-text">{{ task.priority }} Priority</span>
        </div>
        <div class="sidebar-status-row">
          <span class="sidebar-status-badge" :class="getStatusClass(task.status)">
            {{ formatStatus(task.status) }}
          </span>
        </div>
        <div class="sidebar-due">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span :class="{ 'overdue-text': isOverdue(task.dueDate) }">{{ formatDate(task.dueDate) }}</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="content-area">

      <!-- Loading -->
      <div v-if="loading" class="state-loading">
        <div class="spin-ring"></div>
        <p>Loading task details...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-error">
        <div class="state-icon state-icon--error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Failed to load task</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadTask">Try Again</button>
      </div>

      <!-- Content -->
      <template v-else-if="task">

        <!-- Page Header -->
        <header class="content-header">
          <div class="header-group">
            <button class="back-arrow" @click="$router.push('/tasks')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="breadcrumb">
              <span class="breadcrumb-link" @click="$router.push('/tasks')">My Tasks</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="breadcrumb-current">{{ isEditing ? 'Edit Task' : 'Task Details' }}</span>
            </div>
          </div>

          <div class="header-actions">
            <template v-if="!isEditing">
              <button class="action-ghost-btn" @click="confirmDelete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Delete
              </button>
              <button class="edit-btn" @click="startEdit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Edit Task
              </button>
            </template>
            <template v-else>
              <button class="action-ghost-btn" @click="cancelEdit">
                Cancel
              </button>
              <button class="save-btn" :disabled="saving || !isFormValid" @click="saveEdit">
                <span class="spin-ring-sm" v-if="saving"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </template>
          </div>
        </header>

        <!-- ════════════════ VIEW MODE ════════════════ -->
        <div v-if="!isEditing" class="detail-layout">

          <!-- Left: Main Info -->
          <div class="detail-main">

            <!-- Hero Card -->
            <div class="hero-card" :class="getPriorityClass(task.priority)">
              <div class="hero-card-top">
                <div class="hero-badges">
                  <span class="prio-badge" :class="getPriorityClass(task.priority)">
                    <span class="prio-badge-dot"></span>
                    {{ task.priority }}
                  </span>
                  <span class="status-badge" :class="getStatusClass(task.status)">
                    {{ formatStatus(task.status) }}
                  </span>
                  <span v-if="isOverdue(task.dueDate)" class="overdue-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Overdue
                  </span>
                </div>
              </div>

              <h1 class="hero-title">{{ task.title }}</h1>

              <p v-if="task.description" class="hero-desc">{{ task.description }}</p>
              <p v-else class="hero-desc hero-desc--empty">No description provided.</p>

              <!-- Progress -->
              <div class="hero-progress">
                <div class="progress-header">
                  <span class="progress-label">Progress</span>
                  <span class="progress-value">{{ task.progress || 0 }}%</span>
                </div>
                <div class="progress-rail">
                  <div
                    class="progress-fill"
                    :class="getPriorityClass(task.priority)"
                    :style="{ width: (task.progress || 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="details-grid">
              <div class="detail-cell">
                <div class="detail-cell-icon detail-cell-icon--blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="detail-cell-body">
                  <span class="detail-cell-label">Due Date</span>
                  <span class="detail-cell-value" :class="{ 'detail-cell-value--late': isOverdue(task.dueDate) }">
                    {{ formatDate(task.dueDate) }}
                  </span>
                </div>
              </div>

              <div class="detail-cell">
                <div class="detail-cell-icon detail-cell-icon--green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="detail-cell-body">
                  <span class="detail-cell-label">Created</span>
                  <span class="detail-cell-value">{{ formatDate(task.createdAt) }}</span>
                </div>
              </div>

              <div class="detail-cell">
                <div class="detail-cell-icon detail-cell-icon--purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="detail-cell-body">
                  <span class="detail-cell-label">Priority</span>
                  <span class="detail-cell-value">{{ task.priority }}</span>
                </div>
              </div>

              <div class="detail-cell">
                <div class="detail-cell-icon detail-cell-icon--orange">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="detail-cell-body">
                  <span class="detail-cell-label">Status</span>
                  <span class="detail-cell-value">{{ formatStatus(task.status) }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Status Toggle -->
            <div class="quick-actions-card">
              <h3 class="quick-actions-title">Quick Actions</h3>
              <div class="quick-actions-row">
                <button
                  class="quick-action-btn"
                  :class="task.status === 'COMPLETED' ? 'quick-action-btn--active' : 'quick-action-btn--complete'"
                  @click="toggleStatus('COMPLETED')"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete' }}
                </button>

                <button
                  class="quick-action-btn quick-action-btn--progress"
                  :class="{ 'quick-action-btn--active-wip': task.status === 'IN_PROGRESS' }"
                  @click="toggleStatus('IN_PROGRESS')"
                  v-if="task.status !== 'IN_PROGRESS'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Start Progress
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Meta Panel -->
          <div class="detail-side">

            <!-- Task ID Card -->
            <div class="meta-card">
              <div class="meta-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Task Info
              </div>
              <div class="meta-rows">
                <div class="meta-row">
                  <span class="meta-key">Task ID</span>
                  <span class="meta-val meta-val--mono">#{{ task.id }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-key">Created</span>
                  <span class="meta-val">{{ formatDate(task.createdAt) }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-key">Due</span>
                  <span class="meta-val" :class="{ 'meta-val--late': isOverdue(task.dueDate) }">{{ formatDate(task.dueDate) }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-key">Days Left</span>
                  <span class="meta-val" :class="daysLeftClass">{{ daysLeftLabel }}</span>
                </div>
              </div>
            </div>

            <!-- Priority Indicator Card -->
            <div class="prio-indicator-card" :class="getPriorityClass(task.priority)">
              <div class="prio-indicator-icon" :class="getPriorityClass(task.priority)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="prio-indicator-text">
                <span class="prio-indicator-level">{{ task.priority }} PRIORITY</span>
                <span class="prio-indicator-hint">{{ priorityHint }}</span>
              </div>
            </div>

            <!-- Timeline Card -->
            <div class="meta-card">
              <div class="meta-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Timeline
              </div>
              <div class="timeline">
                <div class="timeline-item timeline-item--done">
                  <div class="timeline-dot timeline-dot--done">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="timeline-body">
                    <span class="timeline-event">Task Created</span>
                    <span class="timeline-date">{{ formatDate(task.createdAt) }}</span>
                  </div>
                </div>
                <div class="timeline-item" :class="task.status === 'IN_PROGRESS' || task.status === 'COMPLETED' ? 'timeline-item--done' : 'timeline-item--pending'">
                  <div class="timeline-dot" :class="task.status === 'IN_PROGRESS' || task.status === 'COMPLETED' ? 'timeline-dot--done' : 'timeline-dot--pending'">
                    <svg v-if="task.status === 'IN_PROGRESS' || task.status === 'COMPLETED'" width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="timeline-body">
                    <span class="timeline-event">In Progress</span>
                    <span class="timeline-date">{{ task.status === 'IN_PROGRESS' || task.status === 'COMPLETED' ? 'Started' : 'Not started' }}</span>
                  </div>
                </div>
                <div class="timeline-item" :class="task.status === 'COMPLETED' ? 'timeline-item--done' : 'timeline-item--pending'">
                  <div class="timeline-dot" :class="task.status === 'COMPLETED' ? 'timeline-dot--done' : 'timeline-dot--pending'">
                    <svg v-if="task.status === 'COMPLETED'" width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="timeline-body">
                    <span class="timeline-event">Completed</span>
                    <span class="timeline-date">{{ task.status === 'COMPLETED' ? 'Done' : formatDate(task.dueDate) }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ════════════════ EDIT MODE ════════════════ -->
        <div v-else class="edit-layout">
          <div class="edit-notice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            You are editing this task. Changes will be saved when you click <strong>Save Changes</strong>.
          </div>

          <div class="form-wrapper">
            <div class="form-card">

              <!-- Title -->
              <div class="field-group">
                <label class="field-label">Task Title <span class="required-mark">*</span></label>
                <div class="input-wrap" :class="{ 'input-wrap--error': errors.title, 'input-wrap--filled': editForm.title }">
                  <svg class="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                  <input type="text" v-model="editForm.title" placeholder="Task title" class="field-input" />
                </div>
                <span v-if="errors.title" class="field-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  {{ errors.title }}
                </span>
              </div>

              <!-- Description -->
              <div class="field-group">
                <label class="field-label">Description <span class="optional-mark">optional</span></label>
                <div class="textarea-wrap" :class="{ 'textarea-wrap--filled': editForm.description }">
                  <textarea v-model="editForm.description" placeholder="Describe the task..." class="field-textarea" rows="4"></textarea>
                  <span class="char-count">{{ editForm.description.length }}</span>
                </div>
              </div>

              <!-- Priority -->
              <div class="field-group">
                <label class="field-label">Priority <span class="required-mark">*</span></label>
                <div class="priority-grid">
                  <button type="button" class="prio-card" :class="{ 'prio-card--active': editForm.priority === 'HIGH' }" data-level="high" @click="editForm.priority = 'HIGH'">
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                    </div>
                  </button>

                  <button type="button" class="prio-card" :class="{ 'prio-card--active': editForm.priority === 'MEDIUM' }" data-level="medium" @click="editForm.priority = 'MEDIUM'">
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                    </div>
                  </button>

                  <button type="button" class="prio-card" :class="{ 'prio-card--active': editForm.priority === 'LOW' }" data-level="low" @click="editForm.priority = 'LOW'">
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
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
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
                    <select v-model="editForm.status" class="field-select">
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
                  <div class="input-wrap" :class="{ 'input-wrap--error': errors.dueDate, 'input-wrap--filled': editForm.dueDate }">
                    <svg class="input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                    <input type="date" v-model="editForm.dueDate" class="field-input" />
                  </div>
                  <span v-if="errors.dueDate" class="field-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    {{ errors.dueDate }}
                  </span>
                </div>
              </div>

              <div class="form-divider"></div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="cancelEdit">Discard Changes</button>
                <button type="button" class="save-btn" :disabled="saving || !isFormValid" @click="saveEdit">
                  <span class="spin-ring-sm" v-if="saving"></span>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>

            <!-- Live Preview in Edit Mode -->
            <div class="preview-panel">
              <p class="preview-label">LIVE PREVIEW</p>
              <div class="preview-card" :class="getPriorityClass(editForm.priority)">
                <div class="preview-card-top">
                  <span class="preview-prio-tag" :class="getPriorityClass(editForm.priority)">
                    <span class="preview-prio-dot"></span>
                    {{ editForm.priority || 'MEDIUM' }}
                  </span>
                  <span class="preview-status-tag" :class="getStatusClass(editForm.status)">
                    {{ formatStatus(editForm.status) }}
                  </span>
                </div>
                <h4 class="preview-card-title">{{ editForm.title || 'Task title will appear here' }}</h4>
                <p class="preview-card-desc">{{ editForm.description || 'Task description will appear here...' }}</p>
                <div class="preview-card-footer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ editForm.dueDate ? formatDate(editForm.dueDate) : 'No due date set' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>
    </main>

    <!-- Delete Confirm Modal -->
    <transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal-box" @click.stop>
          <div class="modal-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="modal-title">Delete Task?</h3>
          <p class="modal-desc">This action cannot be undone. The task <strong>"{{ task && task.title }}"</strong> will be permanently removed.</p>
          <div class="modal-actions">
            <button class="modal-cancel-btn" @click="showDeleteConfirm = false">Cancel</button>
            <button class="modal-delete-btn" :disabled="deleting" @click="deleteTask">
              <span class="spin-ring-sm" v-if="deleting"></span>
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

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
  name: 'TaskDetail',
  data() {
    return {
      task: null,
      loading: true,
      error: null,
      isEditing: false,
      saving: false,
      deleting: false,
      showDeleteConfirm: false,
      editForm: {
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
      return this.editForm.title.trim() !== '' && this.editForm.dueDate !== '';
    },
    daysLeft() {
      if (!this.task || !this.task.dueDate) return null;
      const now = new Date(); now.setHours(0,0,0,0);
      const due = new Date(this.task.dueDate); due.setHours(0,0,0,0);
      return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    },
    daysLeftLabel() {
      if (this.daysLeft === null) return '—';
      if (this.task.status === 'COMPLETED') return 'Completed';
      if (this.daysLeft < 0) return `${Math.abs(this.daysLeft)}d overdue`;
      if (this.daysLeft === 0) return 'Due today';
      return `${this.daysLeft} day${this.daysLeft !== 1 ? 's' : ''}`;
    },
    daysLeftClass() {
      if (this.task && this.task.status === 'COMPLETED') return 'meta-val--done';
      if (this.daysLeft !== null && this.daysLeft < 0) return 'meta-val--late';
      if (this.daysLeft !== null && this.daysLeft <= 2) return 'meta-val--warn';
      return '';
    },
    priorityHint() {
      const hints = {
        HIGH: 'Needs immediate attention',
        MEDIUM: 'Complete within schedule',
        LOW: 'Handle when time permits'
      };
      return hints[this.task?.priority] || '';
    }
  },
  methods: {
    async loadTask() {
      try {
        this.loading = true;
        this.error = null;
        const taskId = this.$route.params.id;
        const data = await TasksAPI.getUserTaskById(taskId);
        this.task = {
          ...data,
          progress: this.calculateProgress(data.createdAt, data.dueDate, data.status)
        };
      } catch (err) {
        this.error = err.message || 'Failed to load task';
      } finally {
        this.loading = false;
      }
    },

    startEdit() {
      this.editForm = {
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority,
        status: this.task.status,
        dueDate: this.task.dueDate
      };
      this.errors = { title: '', dueDate: '' };
      this.isEditing = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cancelEdit() {
      this.isEditing = false;
      this.errors = { title: '', dueDate: '' };
    },

    validate() {
      this.errors = { title: '', dueDate: '' };
      let valid = true;
      if (!this.editForm.title.trim()) { this.errors.title = 'Task title is required.'; valid = false; }
      if (!this.editForm.dueDate) { this.errors.dueDate = 'Due date is required.'; valid = false; }
      return valid;
    },

    async saveEdit() {
      if (!this.validate()) return;
      try {
        this.saving = true;
        const updated = await TasksAPI.updateUserTask(this.task.id, {
          title: this.editForm.title,
          description: this.editForm.description,
          priority: this.editForm.priority,
          status: this.editForm.status,
          dueDate: this.editForm.dueDate
        });
        this.task = {
          ...this.task,
          ...this.editForm,
          progress: this.calculateProgress(this.task.createdAt, this.editForm.dueDate, this.editForm.status)
        };
        this.isEditing = false;
        this.showToast('Task updated successfully!', 'success');
      } catch (err) {
        this.showToast(err.message || 'Failed to save changes', 'error');
      } finally {
        this.saving = false;
      }
    },

    confirmDelete() { this.showDeleteConfirm = true; },

    async deleteTask() {
      try {
        this.deleting = true;
        await TasksAPI.deleteUserTask(this.task.id);
        this.showToast('Task deleted', 'success');
        setTimeout(() => { this.$router.push('/tasks'); }, 1000);
      } catch (err) {
        this.showToast(err.message || 'Failed to delete task', 'error');
        this.showDeleteConfirm = false;
      } finally {
        this.deleting = false;
      }
    },

    async toggleStatus(newStatus) {
      if (this.task.status === newStatus) newStatus = 'PENDING';
      try {
        await TasksAPI.updateUserTask(this.task.id, { status: newStatus });
        this.task.status = newStatus;
        this.task.progress = this.calculateProgress(this.task.createdAt, this.task.dueDate, newStatus);
        this.showToast(`Status updated to ${this.formatStatus(newStatus)}`, 'success');
      } catch (err) {
        this.showToast('Failed to update status', 'error');
      }
    },

    getPriorityClass(p) { return { HIGH: 'prio-high', MEDIUM: 'prio-medium', LOW: 'prio-low' }[p] || 'prio-medium'; },
    getStatusClass(s)   { return { PENDING: 'stat-pending', IN_PROGRESS: 'stat-wip', COMPLETED: 'stat-done', OVERDUE: 'stat-late' }[s] || 'stat-pending'; },
    formatStatus(s)     { return s ? s.replace(/_/g, ' ') : '—'; },
    formatDate(d)       { return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'; },
    isOverdue(dueDate)  { if (!dueDate || this.task?.status === 'COMPLETED') return false; return new Date(dueDate) < new Date(); },
    calculateProgress(startDate, dueDate, status) {
      if (status === 'COMPLETED') return 100;
      if (status === 'PENDING') return 0;
      if (!startDate || !dueDate) return 50;
      const start = new Date(startDate).getTime(), end = new Date(dueDate).getTime(), now = Date.now();
      if (now < start) return 20;
      if (now > end) return 90;
      return Math.min(90, Math.max(20, Math.round(((now - start) / (end - start)) * 100)));
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },
  async mounted() {
    if (!this.isAuthenticated) { this.$router.push('/auth'); return; }
    await this.loadTask();
  }
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
  --ease:      cubic-bezier(0.22, 1, 0.36, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.app-shell {
  min-height: 100vh; background: var(--bg); font-family: var(--font);
  display: grid;
  grid-template-areas: "nav nav" "sidebar main";
  grid-template-rows: var(--bar-h) 1fr;
  grid-template-columns: var(--sidebar-w) 1fr;
}

/* ── NAV ── */
.header-nav {
  grid-area: nav; background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100; height: var(--bar-h);
}
.header-inner { height: 100%; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
.header-left  { display: flex; align-items: center; gap: 24px; flex: 1; }
.brand-block  { display: flex; align-items: center; gap: 12px; }
.brand-logo   { width: 36px; height: 36px; flex-shrink: 0; }
.brand-text   { display: flex; flex-direction: column; }
.brand-name   { font-size: 14px; font-weight: 700; color: var(--ink); font-family: var(--fdisp); }
.brand-plan   { font-size: 11px; font-weight: 600; color: var(--ink-m); }
.header-right { display: flex; align-items: center; }
.notif-btn    { position: relative; width: 40px; height: 40px; border: 1px solid var(--border); background: var(--white); border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink-m); }
.notif-dot    { position: absolute; top: 8px; right: 8px; width: 6px; height: 6px; background: var(--red); border-radius: 50%; border: 1.5px solid var(--white); }

/* ── SIDEBAR ── */
.side-panel {
  grid-area: sidebar; background: var(--white);
  border-right: 1px solid var(--border); padding: 24px 16px;
  overflow-y: auto; height: calc(100vh - var(--bar-h));
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
.section-label { font-size: 11px; font-weight: 700; color: var(--ink-m); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; padding: 0 8px; }
.side-nav { display: flex; flex-direction: column; gap: 4px; }
.side-link { display: flex; align-items: center; gap: 12px; height: 40px; padding: 0 12px; border-radius: 8px; color: var(--ink-m); font-size: 14px; font-weight: 500; text-decoration: none; cursor: pointer; border: none; background: none; font-family: var(--font); width: 100%; text-align: left; }
.side-link--active { background: #ede9fe; color: var(--purple); font-weight: 600; }
.side-link svg { flex-shrink: 0; }

/* Sidebar task info */
.task-sidebar-info { background: var(--bg); border-radius: 12px; padding: 18px; margin-top: 24px; }
.sidebar-info-title { font-size: 11px; font-weight: 700; color: var(--ink-m); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
.sidebar-status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.sidebar-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sidebar-dot.prio-high   { background: var(--red); }
.sidebar-dot.prio-medium { background: var(--orange); }
.sidebar-dot.prio-low    { background: var(--cyan); }
.sidebar-info-text { font-size: 13px; font-weight: 600; color: var(--ink); }
.sidebar-status-badge { display: inline-flex; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
.sidebar-status-badge.stat-pending { background: #fef3c7; color: #92400e; }
.sidebar-status-badge.stat-wip     { background: #dbeafe; color: #1e40af; }
.sidebar-status-badge.stat-done    { background: #d1fae5; color: #065f46; }
.sidebar-status-badge.stat-late    { background: #fee2e2; color: #991b1b; }
.sidebar-due { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-m); font-weight: 500; margin-top: 4px; }
.overdue-text { color: var(--red); font-weight: 600; }

/* ── MAIN ── */
.content-area { grid-area: main; padding: 32px; overflow-y: auto; max-height: calc(100vh - var(--bar-h)); }

/* States */
.state-loading, .state-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; background: var(--white); border-radius: 20px; border: 1px solid var(--border); }
.spin-ring { width: 48px; height: 48px; border: 4px solid var(--border); border-top-color: var(--purple); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
.state-loading p, .state-error p { font-size: 15px; color: var(--ink-m); font-weight: 500; margin-bottom: 20px; }
.state-icon--error { width: 72px; height: 72px; background: #fee2e2; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--red); margin-bottom: 20px; }
.state-error h3 { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.retry-btn { height: 44px; padding: 0 24px; background: var(--purple); color: var(--white); border: none; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: var(--font); cursor: pointer; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Header */
.content-header { margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.header-group { display: flex; align-items: center; gap: 14px; }
.back-arrow { width: 40px; height: 40px; background: var(--white); border: 1px solid var(--border); border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink-m); flex-shrink: 0; }
.breadcrumb { display: flex; align-items: center; gap: 6px; }
.breadcrumb-link { font-size: 14px; font-weight: 600; color: var(--ink-m); cursor: pointer; }
.breadcrumb-link:hover { color: var(--purple); }
.breadcrumb svg { color: var(--ink-m); flex-shrink: 0; }
.breadcrumb-current { font-size: 14px; font-weight: 700; color: var(--ink); }

/* Header action buttons */
.header-actions { display: flex; gap: 10px; align-items: center; }
.action-ghost-btn { height: 40px; padding: 0 18px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--ink-m); font-family: var(--font); cursor: pointer; display: flex; align-items: center; gap: 7px; }
.action-ghost-btn:hover { border-color: var(--red); color: var(--red); background: #fff5f5; }
.edit-btn { height: 40px; padding: 0 20px; background: linear-gradient(135deg, #8b5cf6 0%, #9333ea 100%); color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: var(--font); cursor: pointer; display: flex; align-items: center; gap: 8px; }
.save-btn { height: 40px; padding: 0 20px; background: linear-gradient(135deg, var(--green) 0%, #059669 100%); color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: var(--font); cursor: pointer; display: flex; align-items: center; gap: 8px; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── VIEW LAYOUT ── */
.detail-layout { display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start; }

/* Hero card */
.hero-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 32px; border-left-width: 5px; margin-bottom: 20px; }
.hero-card.prio-high   { border-left-color: var(--red); }
.hero-card.prio-medium { border-left-color: var(--orange); }
.hero-card.prio-low    { border-left-color: var(--cyan); }

.hero-card-top { margin-bottom: 20px; }
.hero-badges   { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }

.prio-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.prio-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.prio-badge.prio-high   { background: #fee2e2; color: #b91c1c; }
.prio-badge.prio-medium { background: #fef3c7; color: #92400e; }
.prio-badge.prio-low    { background: #cffafe; color: #155e75; }

.status-badge { display: inline-flex; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.status-badge.stat-pending { background: #fef3c7; color: #92400e; }
.status-badge.stat-wip     { background: #dbeafe; color: #1e40af; }
.status-badge.stat-done    { background: #d1fae5; color: #065f46; }
.status-badge.stat-late    { background: #fee2e2; color: #991b1b; }

.overdue-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fee2e2; color: #b91c1c; }

.hero-title { font-size: 26px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); line-height: 1.3; margin-bottom: 14px; }
.hero-desc  { font-size: 15px; color: var(--ink-m); line-height: 1.7; margin-bottom: 28px; }
.hero-desc--empty { font-style: italic; color: #b0bac8; }

.hero-progress { }
.progress-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.progress-label  { font-size: 13px; font-weight: 700; color: var(--ink-m); text-transform: uppercase; letter-spacing: 0.3px; }
.progress-value  { font-size: 16px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); }
.progress-rail   { width: 100%; height: 10px; background: var(--border); border-radius: 10px; overflow: hidden; }
.progress-fill   { height: 100%; border-radius: 10px; transition: width 0.8s var(--ease); }
.progress-fill.prio-high   { background: linear-gradient(90deg, #ef4444, #dc2626); }
.progress-fill.prio-medium { background: linear-gradient(90deg, #f59e0b, #d97706); }
.progress-fill.prio-low    { background: linear-gradient(90deg, #06b6d4, #0891b2); }

/* Details grid */
.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.detail-cell  { display: flex; align-items: center; gap: 14px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px; }

.detail-cell-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.detail-cell-icon--blue   { background: #eff6ff; color: #2563eb; }
.detail-cell-icon--green  { background: #d1fae5; color: #059669; }
.detail-cell-icon--purple { background: #ede9fe; color: var(--purple); }
.detail-cell-icon--orange { background: #fef3c7; color: #d97706; }

.detail-cell-body { display: flex; flex-direction: column; gap: 3px; }
.detail-cell-label { font-size: 11px; font-weight: 700; color: var(--ink-m); text-transform: uppercase; letter-spacing: 0.4px; }
.detail-cell-value { font-size: 14px; font-weight: 700; color: var(--ink); }
.detail-cell-value--late { color: var(--red); }

/* Quick actions */
.quick-actions-card  { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.quick-actions-title { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 16px; font-family: var(--fdisp); }
.quick-actions-row   { display: flex; gap: 12px; flex-wrap: wrap; }

.quick-action-btn { height: 44px; padding: 0 20px; border-radius: 10px; font-size: 13px; font-weight: 600; font-family: var(--font); cursor: pointer; display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--border); background: var(--bg); color: var(--ink); }
.quick-action-btn--complete { border-color: var(--green); color: var(--green); background: #f0fdf4; }
.quick-action-btn--active   { border-color: var(--green); color: var(--green); background: #d1fae5; }
.quick-action-btn--progress { border-color: var(--blue); color: var(--blue); background: #eff6ff; }

/* ── SIDE CARDS ── */
.detail-side { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

.meta-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 22px; }
.meta-card-header { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 18px; }
.meta-card-header svg { color: var(--ink-m); flex-shrink: 0; }

.meta-rows { display: flex; flex-direction: column; gap: 13px; }
.meta-row  { display: flex; align-items: center; justify-content: space-between; }
.meta-key  { font-size: 13px; color: var(--ink-m); font-weight: 500; }
.meta-val  { font-size: 13px; color: var(--ink); font-weight: 700; }
.meta-val--mono { font-family: monospace; font-size: 12px; background: var(--bg); padding: 2px 8px; border-radius: 6px; }
.meta-val--late { color: var(--red); }
.meta-val--warn { color: var(--orange); }
.meta-val--done { color: var(--green); }

/* Priority indicator card */
.prio-indicator-card { border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid transparent; }
.prio-indicator-card.prio-high   { background: #fff5f5; border-color: #fecaca; }
.prio-indicator-card.prio-medium { background: #fffbeb; border-color: #fde68a; }
.prio-indicator-card.prio-low    { background: #f0fdff; border-color: #a5f3fc; }

.prio-indicator-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.prio-indicator-icon.prio-high   { background: #ef4444; color: #fff; }
.prio-indicator-icon.prio-medium { background: #f59e0b; color: #fff; }
.prio-indicator-icon.prio-low    { background: #06b6d4; color: #fff; }

.prio-indicator-text  { display: flex; flex-direction: column; gap: 4px; }
.prio-indicator-level { font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
.prio-indicator-card.prio-high   .prio-indicator-level { color: #b91c1c; }
.prio-indicator-card.prio-medium .prio-indicator-level { color: #92400e; }
.prio-indicator-card.prio-low    .prio-indicator-level { color: #155e75; }
.prio-indicator-hint  { font-size: 12px; color: var(--ink-m); font-weight: 500; }

/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; gap: 14px; padding-bottom: 20px; position: relative; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item:not(:last-child)::before { content: ''; position: absolute; left: 11px; top: 26px; width: 2px; height: calc(100% - 16px); background: var(--border); }
.timeline-item--done:not(:last-child)::before { background: var(--green); }

.timeline-dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border); background: var(--white); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.timeline-dot--done    { border-color: var(--green); background: var(--green); color: white; }
.timeline-dot--pending { border-color: var(--border); background: var(--bg); }

.timeline-body  { display: flex; flex-direction: column; gap: 2px; }
.timeline-event { font-size: 13px; font-weight: 700; color: var(--ink); }
.timeline-date  { font-size: 12px; color: var(--ink-m); font-weight: 500; }

/* ── EDIT MODE ── */
.edit-notice { display: flex; align-items: center; gap: 10px; padding: 14px 18px; background: #ede9fe; border: 1px solid #c4b5fd; border-radius: 12px; font-size: 13px; color: #5b21b6; font-weight: 500; margin-bottom: 24px; }
.edit-notice svg { flex-shrink: 0; color: var(--purple); }
.edit-layout .form-wrapper { display: grid; grid-template-columns: 1fr 320px; gap: 28px; align-items: start; }

/* Form (shared with CreateTask styles) */
.form-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 32px; }
.field-group { margin-bottom: 24px; }
.field-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 10px; letter-spacing: 0.4px; text-transform: uppercase; }
.required-mark { font-size: 14px; color: var(--red); font-weight: 800; text-transform: none; }
.optional-mark { font-size: 11px; font-weight: 600; color: var(--ink-m); background: var(--bg); padding: 2px 8px; border-radius: 20px; text-transform: none; letter-spacing: 0; }

.input-wrap { position: relative; display: flex; align-items: center; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
.input-wrap:focus-within { border-color: var(--purple); background: var(--white); box-shadow: 0 0 0 4px rgba(139,92,246,0.1); }
.input-wrap--error { border-color: var(--red); background: #fff8f8; }
.input-wrap--filled { border-color: #c4b5fd; background: var(--white); }
.input-icon { flex-shrink: 0; margin-left: 14px; color: var(--ink-m); pointer-events: none; }
.input-wrap:focus-within .input-icon { color: var(--purple); }
.field-input { flex: 1; height: 52px; padding: 0 16px 0 12px; border: none; background: transparent; font-size: 14px; font-family: var(--font); font-weight: 500; color: var(--ink); outline: none; }
.field-input::placeholder { color: #b0bac8; }

.textarea-wrap { position: relative; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
.textarea-wrap:focus-within { border-color: var(--purple); background: var(--white); box-shadow: 0 0 0 4px rgba(139,92,246,0.1); }
.textarea-wrap--filled { border-color: #c4b5fd; background: var(--white); }
.field-textarea { width: 100%; padding: 16px; border: none; background: transparent; font-size: 14px; font-family: var(--font); font-weight: 500; color: var(--ink); resize: none; outline: none; line-height: 1.6; min-height: 110px; }
.field-textarea::placeholder { color: #b0bac8; }
.char-count { position: absolute; bottom: 10px; right: 14px; font-size: 11px; font-weight: 600; color: #b0bac8; }
.field-error { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--red); font-weight: 600; margin-top: 8px; }

/* Priority cards */
.priority-grid { display: flex; flex-direction: column; gap: 10px; }
.prio-card { display: flex; align-items: center; gap: 16px; width: 100%; padding: 14px 18px; background: var(--bg); border: 2px solid var(--border); border-radius: 14px; cursor: pointer; font-family: var(--font); text-align: left; }
.prio-card[data-level="high"].prio-card--active   { border-color: #ef4444; background: #fff5f5; }
.prio-card[data-level="medium"].prio-card--active { border-color: #f59e0b; background: #fffbeb; }
.prio-card[data-level="low"].prio-card--active    { border-color: #06b6d4; background: #f0fdff; }
.prio-card-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.prio-icon-high   { background: #fee2e2; color: #ef4444; }
.prio-icon-medium { background: #fef3c7; color: #f59e0b; }
.prio-icon-low    { background: #cffafe; color: #06b6d4; }
.prio-card[data-level="high"].prio-card--active   .prio-icon-high   { background: #ef4444; color: #fff; }
.prio-card[data-level="medium"].prio-card--active .prio-icon-medium { background: #f59e0b; color: #fff; }
.prio-card[data-level="low"].prio-card--active    .prio-icon-low    { background: #06b6d4; color: #fff; }
.prio-card-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.prio-card-name { font-size: 14px; font-weight: 700; color: var(--ink); }
.prio-card-desc { font-size: 12px; font-weight: 500; color: var(--ink-m); }
.prio-card-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: transparent; background: var(--white); }
.prio-card--active .prio-card-check { border-color: transparent; color: white; }
.prio-card[data-level="high"].prio-card--active   .prio-card-check { background: #ef4444; }
.prio-card[data-level="medium"].prio-card--active .prio-card-check { background: #f59e0b; }
.prio-card[data-level="low"].prio-card--active    .prio-card-check { background: #06b6d4; }

.select-wrap { position: relative; display: flex; align-items: center; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.select-wrap:focus-within { border-color: var(--purple); background: var(--white); box-shadow: 0 0 0 4px rgba(139,92,246,0.1); }
.select-icon { flex-shrink: 0; margin-left: 14px; color: var(--ink-m); pointer-events: none; }
.select-wrap:focus-within .select-icon { color: var(--purple); }
.field-select { flex: 1; height: 52px; padding: 0 40px 0 12px; border: none; background: transparent; font-size: 14px; font-family: var(--font); font-weight: 500; color: var(--ink); outline: none; appearance: none; cursor: pointer; }
.select-arrow { position: absolute; right: 14px; color: var(--ink-m); pointer-events: none; flex-shrink: 0; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-divider { height: 1px; background: var(--border); margin: 4px 0 24px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; }
.cancel-btn { height: 50px; padding: 0 28px; background: var(--bg); color: var(--ink); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; font-weight: 600; font-family: var(--font); cursor: pointer; }

/* Preview panel */
.preview-panel { position: sticky; top: 24px; }
.preview-label { font-size: 11px; font-weight: 700; color: var(--ink-m); letter-spacing: 0.8px; margin-bottom: 14px; }
.preview-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 20px; border-left-width: 4px; }
.preview-card.prio-high   { border-left-color: var(--red); }
.preview-card.prio-medium { border-left-color: var(--orange); }
.preview-card.prio-low    { border-left-color: var(--cyan); }
.preview-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.preview-prio-tag { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.preview-prio-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.preview-prio-tag.prio-high   { background: #fee2e2; color: #b91c1c; }
.preview-prio-tag.prio-medium { background: #fef3c7; color: #92400e; }
.preview-prio-tag.prio-low    { background: #cffafe; color: #155e75; }
.preview-status-tag { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.preview-status-tag.stat-pending { background: #fef3c7; color: #92400e; }
.preview-status-tag.stat-wip     { background: #dbeafe; color: #1e40af; }
.preview-status-tag.stat-done    { background: #d1fae5; color: #065f46; }
.preview-card-title { font-size: 15px; font-weight: 700; color: var(--ink); font-family: var(--fdisp); margin-bottom: 8px; line-height: 1.4; }
.preview-card-desc { font-size: 13px; color: var(--ink-m); line-height: 1.5; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.preview-card-footer { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-m); font-weight: 500; padding-top: 14px; border-top: 1px solid var(--border); }

/* ── DELETE MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(13,27,54,0.65); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
.modal-box { background: var(--white); border-radius: 20px; padding: 36px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 24px 48px rgba(0,0,0,0.15); }
.modal-icon { width: 72px; height: 72px; background: #fee2e2; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--red); margin: 0 auto 20px; }
.modal-title { font-size: 22px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); margin-bottom: 12px; }
.modal-desc  { font-size: 14px; color: var(--ink-m); line-height: 1.6; margin-bottom: 28px; }
.modal-actions { display: flex; gap: 12px; }
.modal-cancel-btn { flex: 1; height: 48px; background: var(--bg); color: var(--ink); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; font-weight: 600; font-family: var(--font); cursor: pointer; }
.modal-delete-btn { flex: 1; height: 48px; background: var(--red); color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; font-family: var(--font); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
.modal-delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── SPINNER ── */
.spin-ring-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }

/* ── TOAST ── */
.toast-msg { position: fixed; bottom: 32px; right: 32px; display: flex; align-items: center; gap: 12px; padding: 16px 24px; background: var(--white); border-radius: 12px; box-shadow: 0 8px 24px rgba(13,27,54,0.16); font-size: 14px; font-weight: 600; z-index: 2000; border: 1px solid var(--border); }
.toast-msg.success { border-left: 4px solid var(--green); }
.toast-msg.success svg { color: var(--green); }
.toast-msg.error   { border-left: 4px solid var(--red); }
.toast-msg.error svg { color: var(--red); }

/* ── TRANSITIONS ── */
.modal-enter-active, .modal-leave-active { transition: all 0.25s var(--ease); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.95) translateY(16px); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

/* ── RESPONSIVE ── */
@media (max-width: 1200px) {
  .detail-layout { grid-template-columns: 1fr 280px; }
  .edit-layout .form-wrapper { grid-template-columns: 1fr; }
  .preview-panel { position: static; }
}
@media (max-width: 968px) {
  .app-shell { grid-template-areas: "nav" "main"; grid-template-columns: 1fr; }
  .side-panel { display: none; }
  .content-area { padding: 20px; }
  .detail-layout { grid-template-columns: 1fr; }
  .detail-side { position: static; }
  .details-grid { grid-template-columns: 1fr 1fr; }
  .field-row { grid-template-columns: 1fr; }
  .content-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 640px) {
  :root { --bar-h: 56px; }
  .content-area { padding: 14px; }
  .hero-title { font-size: 20px; }
  .details-grid { grid-template-columns: 1fr; }
  .form-card { padding: 20px; }
  .quick-actions-row { flex-direction: column; }
  .header-actions { width: 100%; }
}
</style>