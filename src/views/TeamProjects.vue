<!-- TeamProjects.vue — Comprehensive team project management -->
<template>
  <div class="tp-root">
    <!-- Header -->
    <header class="tp-header">
      <div class="tp-header__inner">
        <div class="tp-brand">
          <div class="tp-brand__icon">
            <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <path d="M12 16h18M12 21h18M12 26h12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <rect x="8" y="12" width="26" height="20" rx="2" stroke="white" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="tp-brand__text">
            <span class="tp-brand__name">Team Projects</span>
            <span class="tp-brand__sub">{{ selectedTeam?.name || 'Select a team' }}</span>
          </div>
        </div>

        <div class="tp-header__actions">
          <button v-if="!showCreateProject" class="tp-btn tp-btn--primary" @click="showCreateProject = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            New Project
          </button>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="tp-layout">
      <!-- Sidebar -->
      <aside class="tp-sidebar">
        <nav class="tp-nav">
          <div class="tp-nav__label">Navigation</div>
          <router-link to="/dashboard" class="tp-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            Dashboard
          </router-link>
          <router-link to="/teams" class="tp-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/>
            </svg>
            Teams
          </router-link>
          <router-link to="/team-projects" class="tp-nav__item tp-nav__item--active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Team Projects
          </router-link>
          <router-link to="/workspace" class="tp-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M9 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="2"/>
            </svg>
            WorkSpace
          </router-link>
        </nav>

        <!-- Team Selector -->
        <div class="tp-team-selector">
          <div class="tp-team-selector__label">Current Team</div>
          <select v-model="selectedTeamId" @change="onTeamChange" class="tp-team-select">
            <option value="">Select a team...</option>
            <option v-for="team in myTeams" :key="team.teamId" :value="team.teamId">
              {{ team.teamName }}
            </option>
          </select>
        </div>

        <!-- Stats -->
        <div class="tp-stats">
          <div class="tp-stats__title">Project Stats</div>
          <div class="tp-stats__grid">
            <div class="tp-stat">
              <div class="tp-stat__value">{{ projectStats.total }}</div>
              <div class="tp-stat__label">Total</div>
            </div>
            <div class="tp-stat">
              <div class="tp-stat__value">{{ projectStats.active }}</div>
              <div class="tp-stat__label">Active</div>
            </div>
          </div>
          <div class="tp-stats__grid">
            <div class="tp-stat">
              <div class="tp-stat__value">{{ projectStats.completed }}</div>
              <div class="tp-stat__label">Done</div>
            </div>
            <div class="tp-stat">
              <div class="tp-stat__value">{{ projectStats.overdue }}</div>
              <div class="tp-stat__label">Overdue</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="tp-filter">
          <div class="tp-filter__title">Filter by Status</div>
          <div class="tp-filter__list">
            <button
              :class="['tp-filter__item', { 'is-active': selectedStatus === null }]"
              @click="filterByStatus(null)"
            >
              <span class="tp-filter__dot" style="background: #6366f1"></span>
              All Projects
              <span v-if="selectedStatus === null" class="tp-filter__check">✓</span>
            </button>
            <button
              :class="['tp-filter__item', { 'is-active': selectedStatus === 'ACTIVE' }]"
              @click="filterByStatus('ACTIVE')"
            >
              <span class="tp-filter__dot" style="background: #3b82f6"></span>
              Active
              <span v-if="selectedStatus === 'ACTIVE'" class="tp-filter__check">✓</span>
            </button>
            <button
              :class="['tp-filter__item', { 'is-active': selectedStatus === 'COMPLETED' }]"
              @click="filterByStatus('COMPLETED')"
            >
              <span class="tp-filter__dot" style="background: #10b981"></span>
              Completed
              <span v-if="selectedStatus === 'COMPLETED'" class="tp-filter__check">✓</span>
            </button>
            <button
              :class="['tp-filter__item', { 'is-active': selectedStatus === 'ON_HOLD' }]"
              @click="filterByStatus('ON_HOLD')"
            >
              <span class="tp-filter__dot" style="background: #f59e0b"></span>
              On Hold
              <span v-if="selectedStatus === 'ON_HOLD'" class="tp-filter__check">✓</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="tp-content">
        <div class="tp-page-header">
          <div class="tp-page-header__left">
            <h1 class="tp-page-title">Projects</h1>
            <p class="tp-page-sub">Manage your team projects, tasks, and documents</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="tp-controls">
          <div class="tp-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search projects…" class="tp-search__input" />
            <span v-if="searchQuery" class="tp-search__clear" @click="searchQuery = ''">✕</span>
          </div>
          <div class="tp-view-tabs">
            <button :class="['tp-view-tab', { active: viewMode === 'grid' }]" @click="viewMode='grid'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button :class="['tp-view-tab', { active: viewMode === 'list' }]" @click="viewMode='list'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Create Project Form -->
        <div v-if="showCreateProject" class="tp-create-form">
          <div class="tp-create-form__header">
            <div class="tp-create-form__title-wrap">
              <div class="tp-create-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3>New Project</h3>
            </div>
            <button @click="cancelCreate" class="tp-icon-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="tp-form-grid">
            <div class="tp-form-group">
              <label>Project Title <span class="tp-req">*</span></label>
              <input v-model="projectForm.title" type="text" class="tp-input" placeholder="e.g. Website Redesign" required />
            </div>
            <div class="tp-form-group">
              <label>Status</label>
              <select v-model="projectForm.status" class="tp-input">
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div class="tp-form-group">
              <label>Start Date <span class="tp-req">*</span></label>
              <input v-model="projectForm.startDate" type="date" class="tp-input" required />
            </div>
            <div class="tp-form-group">
              <label>End Date <span class="tp-req">*</span></label>
              <input v-model="projectForm.endDate" type="date" class="tp-input" required />
            </div>
            <div class="tp-form-group tp-form-group--full">
              <label>Description</label>
              <textarea v-model="projectForm.description" class="tp-input tp-textarea-sm" rows="3" placeholder="Describe the project goals and objectives..."></textarea>
            </div>
            <div class="tp-form-group tp-form-group--full">
              <label>Documents (Optional)</label>
              <input type="file" ref="projectFiles" @change="handleProjectFiles" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" class="tp-file-input" />
              <div v-if="projectForm.files.length > 0" class="tp-file-list">
                <div v-for="(file, idx) in projectForm.files" :key="idx" class="tp-file-item">
                  <span>{{ file.name }}</span>
                  <button @click="removeProjectFile(idx)" class="tp-file-remove">✕</button>
                </div>
              </div>
            </div>
            <div v-if="projectForm.files.length > 0" class="tp-form-group tp-form-group--full">
              <label>Document Description</label>
              <input v-model="projectForm.documentDescription" type="text" class="tp-input" placeholder="e.g. Initial requirements" />
            </div>
          </div>
          <div class="tp-form-actions">
            <button @click="cancelCreate" class="tp-btn tp-btn--ghost">Cancel</button>
            <button @click="submitProject" class="tp-btn tp-btn--primary" :disabled="submitting || !isProjectFormValid">
              <svg v-if="!submitting" width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              {{ submitting ? 'Creating…' : 'Create Project' }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tp-loading">
          <div class="tp-spinner"></div>
          <p>Loading projects…</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProjects.length === 0 && !showCreateProject && selectedTeamId" class="tp-empty">
          <div class="tp-empty__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          <button class="tp-btn tp-btn--primary" @click="showCreateProject = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            Create Project
          </button>
        </div>

        <!-- No Team Selected -->
        <div v-else-if="!selectedTeamId && !loading" class="tp-empty">
          <div class="tp-empty__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h3>Select a team</h3>
          <p>Choose a team from the sidebar to view projects</p>
        </div>

        <!-- Projects Grid -->
        <div v-else-if="!showCreateProject && viewMode === 'grid'" class="tp-grid">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="tp-card"
            @click="viewProject(project)"
          >
            <div class="tp-card__accent" :style="{ background: getStatusColor(project.status) }"></div>

            <div class="tp-card__top">
              <div class="tp-card__status-chip" :style="{ background: getStatusBg(project.status), color: getStatusText(project.status) }">
                {{ project.status }}
              </div>
              <div class="tp-card__menu-wrap" @click.stop>
                <button class="tp-card__more" @click="toggleMenu(project.id)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                <div v-if="activeMenu === project.id" class="tp-card__dropdown">
                  <div class="tp-dropdown__section">
                    <button @click="viewProject(project)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      View Details
                    </button>
                    <button @click="openAddTask(project)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      Add Task
                    </button>
                    <button @click="openUploadDocuments(project)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Upload Documents
                    </button>
                  </div>
                  <div v-if="project.role === 'ADMIN'" class="tp-dropdown__divider"></div>
                  <div v-if="project.role === 'ADMIN'" class="tp-dropdown__section">
                    <button @click="deleteProject(project.id)" class="tp-dropdown-danger">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Delete Project
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="tp-card__body">
              <h3 class="tp-card__title">{{ project.name }}</h3>
              <p class="tp-card__desc">{{ project.description || 'No description provided.' }}</p>
            </div>

            <div class="tp-card__meta">
              <div class="tp-card__meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ formatDate(project.endDate) }}</span>
              </div>
              <div class="tp-card__meta-item" :class="{ 'tp-card__meta-item--danger': calculateDaysLeft(project.endDate) < 0 }">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ getDaysLeftText(project.endDate) }}</span>
              </div>
            </div>

            <div class="tp-card__foot">
              <div class="tp-card__stat">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                0 tasks
              </div>
              <div class="tp-card__stat">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ project.documentCount }} docs
              </div>
              <span class="tp-card__owner">{{ project.ownerName }}</span>
            </div>
          </div>
        </div>

        <!-- Projects List View -->
        <div v-else-if="!showCreateProject && viewMode === 'list'" class="tp-list">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="tp-list-item"
            @click="viewProject(project)"
          >
            <div class="tp-list-item__main">
              <div class="tp-list-item__status" :style="{ background: getStatusColor(project.status) }"></div>
              <div class="tp-list-item__content">
                <h3 class="tp-list-item__title">{{ project.name }}</h3>
                <p class="tp-list-item__desc">{{ project.description }}</p>
              </div>
            </div>
            <div class="tp-list-item__meta">
              <span class="tp-list-item__date">{{ formatDate(project.endDate) }}</span>
              <span class="tp-list-item__days" :class="{ 'tp-list-item__days--danger': calculateDaysLeft(project.endDate) < 0 }">
                {{ getDaysLeftText(project.endDate) }}
              </span>
              <span class="tp-list-item__docs">{{ project.documentCount }} docs</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Panel - Project Details -->
      <aside v-if="selectedProject" class="tp-details">
        <div class="tp-details__header">
          <div>
            <h3>{{ selectedProject.name }}</h3>
            <span class="tp-details__status" :style="{ background: getStatusBg(selectedProject.status), color: getStatusText(selectedProject.status) }">
              {{ selectedProject.status }}
            </span>
          </div>
          <button @click="closeDetails" class="tp-icon-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="tp-details__info">
          <p class="tp-details__desc">{{ selectedProject.description || 'No description' }}</p>
          <div class="tp-details__dates">
            <div class="tp-details__date-item">
              <span class="tp-details__date-label">Start</span>
              <span class="tp-details__date-value">{{ formatDate(selectedProject.startDate) }}</span>
            </div>
            <div class="tp-details__date-item">
              <span class="tp-details__date-label">End</span>
              <span class="tp-details__date-value">{{ formatDate(selectedProject.endDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tp-details__tabs">
          <button
            :class="['tp-details__tab', { active: detailsTab === 'tasks' }]"
            @click="detailsTab = 'tasks'; loadProjectTasks(selectedProject.id)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Tasks
          </button>
          <button
            :class="['tp-details__tab', { active: detailsTab === 'documents' }]"
            @click="detailsTab = 'documents'; loadProjectDocuments(selectedProject.id)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Documents
          </button>
          <button
            :class="['tp-details__tab', { active: detailsTab === 'reminders' }]"
            @click="detailsTab = 'reminders'; loadProjectReminders(selectedProject.id)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Reminders
          </button>
        </div>

        <!-- Tasks Tab -->
        <div v-if="detailsTab === 'tasks'" class="tp-details__content">
          <div class="tp-details__section-header">
            <h4>Project Tasks</h4>
            <button @click="showAddTaskModal = true" class="tp-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div v-if="loadingTasks" class="tp-details__loading">
            <div class="tp-spinner tp-spinner--sm"></div>
          </div>

          <div v-else-if="projectTasks.length === 0" class="tp-details__empty">
            <p>No tasks yet</p>
            <button class="tp-btn-sm tp-btn--primary" @click="showAddTaskModal = true">Add Task</button>
          </div>

          <div v-else class="tp-tasks-list">
            <div v-for="task in projectTasks" :key="task.id" class="tp-task-item">
              <div class="tp-task-item__header">
                <div class="tp-task-item__title">
                  <input
                    type="checkbox"
                    :checked="task.status === 'DONE'"
                    @change="toggleTaskStatus(task)"
                    class="tp-task-checkbox"
                  />
                  <span :class="{ 'tp-task-done': task.status === 'DONE' }">{{ task.title }}</span>
                </div>
                <span class="tp-task-priority" :style="{ background: getPriorityColor(task.priority) }">
                  {{ task.priority }}
                </span>
              </div>
              <p class="tp-task-item__desc">{{ task.description }}</p>
              <div class="tp-task-item__meta">
                <span v-if="task.assignedToName">👤 {{ task.assignedToName }}</span>
                <span v-if="task.dueDate">📅 {{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Tab -->
        <div v-if="detailsTab === 'documents'" class="tp-details__content">
          <div class="tp-details__section-header">
            <h4>Project Documents</h4>
            <button @click="showUploadModal = true" class="tp-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div v-if="loadingDocuments" class="tp-details__loading">
            <div class="tp-spinner tp-spinner--sm"></div>
          </div>

          <div v-else-if="projectDocuments.length === 0" class="tp-details__empty">
            <p>No documents yet</p>
            <button class="tp-btn-sm tp-btn--primary" @click="showUploadModal = true">Upload Document</button>
          </div>

          <div v-else class="tp-documents-list">
            <div v-for="doc in projectDocuments" :key="doc.id" class="tp-document-item">
              <div class="tp-document-icon">{{ getDocIcon(doc.documentType) }}</div>
              <div class="tp-document-info">
                <p class="tp-document-name">{{ doc.originalFileName }}</p>
                <p class="tp-document-meta">{{ formatFileSize(doc.fileSize) }} • {{ formatDate(doc.createdAt) }}</p>
              </div>
              <button @click="deleteDocument(doc.id)" class="tp-icon-btn tp-icon-btn--danger">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Reminders Tab -->
        <div v-if="detailsTab === 'reminders'" class="tp-details__content">
          <div class="tp-details__section-header">
            <h4>Project Reminders</h4>
            <button @click="showAddReminderModal = true" class="tp-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div v-if="loadingReminders" class="tp-details__loading">
            <div class="tp-spinner tp-spinner--sm"></div>
          </div>

          <div v-else-if="projectReminders.length === 0" class="tp-details__empty">
            <p>No reminders yet</p>
            <button class="tp-btn-sm tp-btn--primary" @click="showAddReminderModal = true">Add Reminder</button>
          </div>

          <div v-else class="tp-reminders-list">
            <div v-for="reminder in projectReminders" :key="reminder.id" class="tp-reminder-item">
              <div class="tp-reminder-header">
                <span class="tp-reminder-title">{{ reminder.title }}</span>
                <span v-if="reminder.isRecurring" class="tp-reminder-recurring">🔁 {{ reminder.recurringInterval }}</span>
              </div>
              <p class="tp-reminder-message">{{ reminder.message }}</p>
              <span class="tp-reminder-time">{{ formatDateTime(reminder.reminderDateTime) }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="tp-modal-overlay" @click="showAddTaskModal = false">
      <div class="tp-modal" @click.stop>
        <div class="tp-modal__header">
          <h3>Add Task</h3>
          <button @click="showAddTaskModal = false" class="tp-icon-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="tp-modal__body">
          <div class="tp-form-group">
            <label>Task Title <span class="tp-req">*</span></label>
            <input v-model="taskForm.title" type="text" class="tp-input" placeholder="e.g. Design homepage mockup" />
          </div>
          <div class="tp-form-group">
            <label>Description</label>
            <textarea v-model="taskForm.description" class="tp-input tp-textarea-sm" rows="3" placeholder="Task details..."></textarea>
          </div>
          <div class="tp-form-group">
            <label>Priority</label>
            <select v-model="taskForm.priority" class="tp-input">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div class="tp-form-group">
            <label>Due Date</label>
            <input v-model="taskForm.dueDate" type="date" class="tp-input" />
          </div>
          <div class="tp-form-group">
            <label>Assign To (Optional)</label>
            <select v-model="taskForm.assignedToUserId" class="tp-input">
              <option value="">Unassigned</option>
              <option v-for="member in teamMembers" :key="member.userId" :value="member.userId">
                {{ member.firstName }} {{ member.lastName }}
              </option>
            </select>
          </div>
        </div>
        <div class="tp-modal__footer">
          <button @click="showAddTaskModal = false" class="tp-btn tp-btn--ghost">Cancel</button>
          <button @click="submitTask" class="tp-btn tp-btn--primary" :disabled="!taskForm.title || addingTask">
            {{ addingTask ? 'Adding…' : 'Add Task' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Documents Modal -->
    <div v-if="showUploadModal" class="tp-modal-overlay" @click="showUploadModal = false">
      <div class="tp-modal" @click.stop>
        <div class="tp-modal__header">
          <h3>Upload Documents</h3>
          <button @click="showUploadModal = false" class="tp-icon-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="tp-modal__body">
          <div class="tp-form-group">
            <label>Select Files</label>
            <input type="file" ref="uploadFiles" @change="handleUploadFiles" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" class="tp-file-input" />
            <div v-if="uploadForm.files.length > 0" class="tp-file-list">
              <div v-for="(file, idx) in uploadForm.files" :key="idx" class="tp-file-item">
                <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                <button @click="removeUploadFile(idx)" class="tp-file-remove">✕</button>
              </div>
            </div>
          </div>
          <div class="tp-form-group">
            <label>Description (Optional)</label>
            <input v-model="uploadForm.description" type="text" class="tp-input" placeholder="e.g. Q4 Financial Reports" />
          </div>
        </div>
        <div class="tp-modal__footer">
          <button @click="showUploadModal = false" class="tp-btn tp-btn--ghost">Cancel</button>
          <button @click="submitUpload" class="tp-btn tp-btn--primary" :disabled="uploadForm.files.length === 0 || uploading">
            {{ uploading ? 'Uploading…' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Reminder Modal -->
    <div v-if="showAddReminderModal" class="tp-modal-overlay" @click="showAddReminderModal = false">
      <div class="tp-modal" @click.stop>
        <div class="tp-modal__header">
          <h3>Add Reminder</h3>
          <button @click="showAddReminderModal = false" class="tp-icon-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="tp-modal__body">
          <div class="tp-form-group">
            <label>Title <span class="tp-req">*</span></label>
            <input v-model="reminderForm.title" type="text" class="tp-input" placeholder="e.g. Project Deadline" />
          </div>
          <div class="tp-form-group">
            <label>Message</label>
            <textarea v-model="reminderForm.message" class="tp-input tp-textarea-sm" rows="2" placeholder="Reminder message..."></textarea>
          </div>
          <div class="tp-form-group">
            <label>Reminder Date & Time <span class="tp-req">*</span></label>
            <input v-model="reminderForm.reminderDateTime" type="datetime-local" class="tp-input" />
          </div>
          <div class="tp-form-group">
            <label class="tp-checkbox-label">
              <input v-model="reminderForm.isRecurring" type="checkbox" />
              <span>Recurring Reminder</span>
            </label>
          </div>
          <div v-if="reminderForm.isRecurring" class="tp-form-group">
            <label>Repeat Every</label>
            <select v-model="reminderForm.recurringInterval" class="tp-input">
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
        </div>
        <div class="tp-modal__footer">
          <button @click="showAddReminderModal = false" class="tp-btn tp-btn--ghost">Cancel</button>
          <button @click="submitReminder" class="tp-btn tp-btn--primary" :disabled="!reminderForm.title || !reminderForm.reminderDateTime || addingReminder">
            {{ addingReminder ? 'Adding…' : 'Add Reminder' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="tp-toast">
      <div v-if="toast.show" :class="['tp-toast', `tp-toast--${toast.type}`]">
        <div class="tp-toast__icon">
          <svg v-if="toast.type === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  TeamManagementAPI,
  TeamProjectAPI,
  TeamDocumentAPI,
  TeamTaskAPI,
  TeamReminderAPI,
  createProjectFormData,
  createDocumentFormData,
  formatDateForAPI,
  formatDateTimeForAPI,
  calculateDaysRemaining,
  getPriorityColor,
  getProjectStatusColor,
  getDocumentTypeIcon,
  formatFileSize,
  isValidDocumentType,
  isValidFileSize
} from '@/utils/teamApi';

export default {
  name: 'TeamProjects',
  
  data() {
    return {
      // Teams
      myTeams: [],
      selectedTeamId: null,
      selectedTeam: null,
      teamMembers: [],

      // Projects
      projects: [],
      selectedProject: null,
      loading: true,
      showCreateProject: false,
      submitting: false,
      selectedStatus: null,
      searchQuery: '',
      viewMode: 'grid',
      activeMenu: null,

      // Project Form
      projectForm: {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
        files: [],
        documentDescription: ''
      },

      // Stats
      projectStats: {
        total: 0,
        active: 0,
        completed: 0,
        overdue: 0
      },

      // Details Panel
      detailsTab: 'tasks',
      projectTasks: [],
      projectDocuments: [],
      projectReminders: [],
      loadingTasks: false,
      loadingDocuments: false,
      loadingReminders: false,

      // Task Modal
      showAddTaskModal: false,
      addingTask: false,
      taskForm: {
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedToUserId: ''
      },

      // Upload Modal
      showUploadModal: false,
      uploading: false,
      uploadForm: {
        files: [],
        description: ''
      },

      // Reminder Modal
      showAddReminderModal: false,
      addingReminder: false,
      reminderForm: {
        title: '',
        message: '',
        reminderDateTime: '',
        isRecurring: false,
        recurringInterval: 'WEEKLY'
      },

      // Toast
      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    filteredProjects() {
      let list = [...this.projects];
      
      if (this.selectedStatus) {
        list = list.filter(p => p.status === this.selectedStatus);
      }
      
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      
      return list;
    },

    isProjectFormValid() {
      return this.projectForm.title &&
             this.projectForm.description &&
             this.projectForm.startDate &&
             this.projectForm.endDate;
    }
  },

  methods: {
    // ==================== TEAMS ====================
    async loadMyTeams() {
      try {
        // FIX: Use TeamManagementAPI instead of direct apiRequest
        this.myTeams = await TeamManagementAPI.getJoinedTeams();
        
        // Auto-select first team if available
        if (this.myTeams.length > 0 && !this.selectedTeamId) {
          this.selectedTeamId = this.myTeams[0].teamId;
          await this.onTeamChange();
        }
      } catch (error) {
        console.error('Load teams error:', error);
        this.showToast('Failed to load teams', 'error');
      }
    },

    async onTeamChange() {
      if (!this.selectedTeamId) return;
      
      this.selectedTeam = this.myTeams.find(t => t.teamId === this.selectedTeamId);
      await Promise.all([
        this.loadProjects(),
        this.loadTeamMembers(),
        this.loadProjectStats()
      ]);
    },

    async loadTeamMembers() {
      try {
        // FIX: Use TeamManagementAPI instead of direct apiRequest
        this.teamMembers = await TeamManagementAPI.getTeamMembersWithRole(this.selectedTeamId);
      } catch (error) {
        console.error('Failed to load team members:', error);
      }
    },

    // ==================== PROJECTS ====================
    async loadProjects() {
      try {
        this.loading = true;
        const projects = await TeamProjectAPI.getAllProjects();
        
        // Filter by current team
        this.projects = projects.filter(p => p.teamId === this.selectedTeamId);
      } catch (error) {
        this.showToast('Failed to load projects', 'error');
        this.projects = [];
      } finally {
        this.loading = false;
      }
    },

    async loadProjectStats() {
      try {
        const [total, active, completed, overdue] = await Promise.all([
          TeamProjectAPI.getProjectCount(this.selectedTeamId),
          TeamProjectAPI.getProjectCountByStatus(this.selectedTeamId, 'ACTIVE'),
          TeamProjectAPI.getProjectCountByStatus(this.selectedTeamId, 'COMPLETED'),
          TeamProjectAPI.getOverdueProjects(this.selectedTeamId)
        ]);

        this.projectStats = {
          total,
          active,
          completed,
          overdue: overdue.length
        };
      } catch (error) {
        console.error('Failed to load project stats:', error);
      }
    },

    async submitProject() {
      try {
        this.submitting = true;
        
        const projectData = {
          title: this.projectForm.title,
          description: this.projectForm.description,
          startDate: this.projectForm.startDate,
          endDate: this.projectForm.endDate,
          status: this.projectForm.status,
          documents: this.projectForm.files,
          documentDescription: this.projectForm.documentDescription
        };

        const formData = createProjectFormData(projectData);
        const newProject = await TeamProjectAPI.createProject(this.selectedTeamId, formData);
        
        this.projects.push(newProject);
        this.showToast('Project created successfully!', 'success');
        this.cancelCreate();
        await this.loadProjectStats();
      } catch (error) {
        this.showToast(error.message || 'Failed to create project', 'error');
      } finally {
        this.submitting = false;
      }
    },

    async deleteProject(projectId) {
      if (!confirm('Delete this project? This cannot be undone.')) return;

      try {
        await TeamProjectAPI.deleteProject(this.selectedTeamId, projectId);
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        if (this.selectedProject?.id === projectId) {
          this.closeDetails();
        }
        
        this.showToast('Project deleted successfully', 'success');
        await this.loadProjectStats();
      } catch (error) {
        this.showToast(error.message || 'Failed to delete project', 'error');
      }
      this.activeMenu = null;
    },

    viewProject(project) {
      this.selectedProject = project;
      this.detailsTab = 'tasks';
      this.loadProjectTasks(project.id);
      this.activeMenu = null;
    },

    closeDetails() {
      this.selectedProject = null;
      this.projectTasks = [];
      this.projectDocuments = [];
      this.projectReminders = [];
    },

    cancelCreate() {
      this.showCreateProject = false;
      this.projectForm = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
        files: [],
        documentDescription: ''
      };
    },

    handleProjectFiles(event) {
      const files = Array.from(event.target.files);
      
      // Validate files
      const validFiles = files.filter(file => {
        if (!isValidDocumentType(file)) {
          this.showToast(`${file.name}: Unsupported file type`, 'error');
          return false;
        }
        if (!isValidFileSize(file)) {
          this.showToast(`${file.name}: File too large (max 50MB)`, 'error');
          return false;
        }
        return true;
      });

      this.projectForm.files = validFiles;
    },

    removeProjectFile(index) {
      this.projectForm.files.splice(index, 1);
    },

    filterByStatus(status) {
      this.selectedStatus = this.selectedStatus === status ? null : status;
    },

    toggleMenu(id) {
      this.activeMenu = this.activeMenu === id ? null : id;
    },

    // ==================== TASKS ====================
    async loadProjectTasks(projectId) {
      try {
        this.loadingTasks = true;
        this.projectTasks = await TeamTaskAPI.getProjectTasks(this.selectedTeamId, projectId);
      } catch (error) {
        this.showToast('Failed to load tasks', 'error');
        this.projectTasks = [];
      } finally {
        this.loadingTasks = false;
      }
    },

    openAddTask(project) {
      this.selectedProject = project;
      this.showAddTaskModal = true;
      this.activeMenu = null;
    },

    async submitTask() {
      try {
        this.addingTask = true;
        
        const taskData = {
          title: this.taskForm.title,
          description: this.taskForm.description,
          priority: this.taskForm.priority,
          dueDate: this.taskForm.dueDate ? formatDateForAPI(this.taskForm.dueDate) : null,
          assignedToUserId: this.taskForm.assignedToUserId || null
        };

        const newTask = await TeamTaskAPI.createTask(
          this.selectedTeamId,
          this.selectedProject.id,
          taskData
        );

        this.projectTasks.push(newTask);
        this.showToast('Task added successfully!', 'success');
        this.showAddTaskModal = false;
        this.resetTaskForm();
      } catch (error) {
        this.showToast(error.message || 'Failed to add task', 'error');
      } finally {
        this.addingTask = false;
      }
    },

    async toggleTaskStatus(task) {
      const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
      
      try {
        await TeamTaskAPI.updateTask(this.selectedTeamId, task.id, { status: newStatus });
        task.status = newStatus;
      } catch (error) {
        this.showToast('Failed to update task', 'error');
      }
    },

    resetTaskForm() {
      this.taskForm = {
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedToUserId: ''
      };
    },

    // ==================== DOCUMENTS ====================
    async loadProjectDocuments(projectId) {
      try {
        this.loadingDocuments = true;
        this.projectDocuments = await TeamDocumentAPI.getProjectDocuments(
          this.selectedTeamId,
          projectId
        );
      } catch (error) {
        this.showToast('Failed to load documents', 'error');
        this.projectDocuments = [];
      } finally {
        this.loadingDocuments = false;
      }
    },

    openUploadDocuments(project) {
      this.selectedProject = project;
      this.showUploadModal = true;
      this.activeMenu = null;
    },

    handleUploadFiles(event) {
      const files = Array.from(event.target.files);
      
      const validFiles = files.filter(file => {
        if (!isValidDocumentType(file)) {
          this.showToast(`${file.name}: Unsupported file type`, 'error');
          return false;
        }
        if (!isValidFileSize(file)) {
          this.showToast(`${file.name}: File too large (max 50MB)`, 'error');
          return false;
        }
        return true;
      });

      this.uploadForm.files = validFiles;
    },

    removeUploadFile(index) {
      this.uploadForm.files.splice(index, 1);
    },

    async submitUpload() {
      try {
        this.uploading = true;
        
        const formData = createDocumentFormData(
          this.uploadForm.files,
          this.uploadForm.description
        );

        const uploadedDocs = await TeamDocumentAPI.uploadDocuments(
          this.selectedTeamId,
          this.selectedProject.id,
          formData
        );

        this.projectDocuments.push(...uploadedDocs);
        this.showToast(`${uploadedDocs.length} document(s) uploaded!`, 'success');
        this.showUploadModal = false;
        this.resetUploadForm();
      } catch (error) {
        this.showToast(error.message || 'Failed to upload documents', 'error');
      } finally {
        this.uploading = false;
      }
    },

    async deleteDocument(documentId) {
      if (!confirm('Delete this document?')) return;

      try {
        await TeamDocumentAPI.deleteDocument(
          this.selectedTeamId,
          this.selectedProject.id,
          documentId
        );

        this.projectDocuments = this.projectDocuments.filter(d => d.id !== documentId);
        this.showToast('Document deleted', 'success');
      } catch (error) {
        this.showToast('Failed to delete document', 'error');
      }
    },

    resetUploadForm() {
      this.uploadForm = {
        files: [],
        description: ''
      };
      if (this.$refs.uploadFiles) {
        this.$refs.uploadFiles.value = '';
      }
    },

    // ==================== REMINDERS ====================
    async loadProjectReminders(projectId) {
      try {
        this.loadingReminders = true;
        this.projectReminders = await TeamReminderAPI.getProjectReminders(
          this.selectedTeamId,
          projectId
        );
      } catch (error) {
        this.showToast('Failed to load reminders', 'error');
        this.projectReminders = [];
      } finally {
        this.loadingReminders = false;
      }
    },

    async submitReminder() {
      try {
        this.addingReminder = true;
        
        const reminderData = {
          title: this.reminderForm.title,
          message: this.reminderForm.message,
          reminderDateTime: formatDateTimeForAPI(this.reminderForm.reminderDateTime),
          isRecurring: this.reminderForm.isRecurring,
          recurringInterval: this.reminderForm.isRecurring ? this.reminderForm.recurringInterval : null,
          projectId: this.selectedProject.id
        };

        const newReminder = await TeamReminderAPI.createReminder(
          this.selectedTeamId,
          reminderData
        );

        this.projectReminders.push(newReminder);
        this.showToast('Reminder added!', 'success');
        this.showAddReminderModal = false;
        this.resetReminderForm();
      } catch (error) {
        this.showToast(error.message || 'Failed to add reminder', 'error');
      } finally {
        this.addingReminder = false;
      }
    },

    resetReminderForm() {
      this.reminderForm = {
        title: '',
        message: '',
        reminderDateTime: '',
        isRecurring: false,
        recurringInterval: 'WEEKLY'
      };
    },

    // ==================== HELPERS ====================
    calculateDaysLeft(date) {
      return calculateDaysRemaining(date);
    },

    getDaysLeftText(date) {
      const days = this.calculateDaysLeft(date);
      if (days < 0) return `${Math.abs(days)} days overdue`;
      if (days === 0) return 'Due today';
      if (days === 1) return '1 day left';
      return `${days} days left`;
    },

    formatDate(date) {
      if (!date) return '—';
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    },

    formatDateTime(datetime) {
      if (!datetime) return '—';
      return new Date(datetime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    },

    formatFileSize(bytes) {
      return formatFileSize(bytes);
    },

    getPriorityColor(priority) {
      return getPriorityColor(priority);
    },

    getStatusColor(status) {
      return getProjectStatusColor(status);
    },

    getStatusBg(status) {
      const map = {
        ACTIVE: '#dbeafe',
        COMPLETED: '#d1fae5',
        ON_HOLD: '#fef3c7',
        CANCELLED: '#fee2e2'
      };
      return map[status] || '#f1f5f9';
    },

    getStatusText(status) {
      return this.getStatusColor(status);
    },

    getDocIcon(docType) {
      return getDocumentTypeIcon(docType);
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    }
  },

  async mounted() {
    await this.loadMyTeams();
    document.addEventListener('click', () => { this.activeMenu = null; });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

/* CSS Variables */
.tp-root {
  --ink:         #0f172a;
  --ink-2:       #475569;
  --ink-3:       #94a3b8;
  --ink-4:       #cbd5e1;
  --border:      #e2e8f0;
  --border-2:    #f1f5f9;
  --bg:          #f8fafc;
  --bg-2:        #f1f5f9;
  --white:       #ffffff;
  --primary:     #6366f1;
  --primary-dk:  #4f46e5;
  --primary-lt:  #818cf8;
  --primary-soft:#eef2ff;
  --green:       #10b981;
  --green-soft:  #d1fae5;
  --red:         #ef4444;
  --red-soft:    #fee2e2;
  --amber:       #f59e0b;
  --amber-soft:  #fef3c7;

  --shadow-xs: 0 1px 2px rgba(15,23,42,0.05);
  --shadow-sm: 0 1px 4px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.03);
  --shadow-md: 0 4px 16px rgba(15,23,42,0.10), 0 1px 4px rgba(15,23,42,0.05);
  --shadow-lg: 0 12px 32px rgba(15,23,42,0.13), 0 2px 8px rgba(15,23,42,0.07);
  --shadow-xl: 0 24px 48px rgba(15,23,42,0.15), 0 4px 12px rgba(15,23,42,0.08);

  --r-sm: 6px;
  --r:    10px;
  --r-md: 14px;
  --r-lg: 18px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  min-height: 100vh;
  background: var(--bg);
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 14px;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}
.tp-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* Header */
.tp-header {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  height: 60px;
  position: sticky; top: 0; z-index: 200;
}
.tp-header__inner {
  height: 100%; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.tp-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; user-select: none; }
.tp-brand__icon { display: flex; filter: drop-shadow(0 2px 8px rgba(99,102,241,0.28)); }
.tp-brand__text { display: flex; flex-direction: column; line-height: 1.2; }
.tp-brand__name { font-size: 15px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; letter-spacing: -0.3px; }
.tp-brand__sub  { font-size: 10px; font-weight: 600; color: var(--ink-3); }

.tp-header__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

/* Buttons */
.tp-btn {
  display: inline-flex; align-items: center; gap: 7px;
  height: 36px; padding: 0 16px;
  border-radius: var(--r); font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: all 0.2s var(--ease); border: none; outline: none; white-space: nowrap;
}
.tp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.tp-btn--primary {
  background: var(--primary); color: var(--white);
  box-shadow: 0 1px 3px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
}
.tp-btn--primary:hover:not(:disabled) { background: var(--primary-dk); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.35); }
.tp-btn--primary:active:not(:disabled) { transform: translateY(0); }
.tp-btn--ghost { background: var(--white); border: 1px solid var(--border); color: var(--ink-2); box-shadow: var(--shadow-xs); }
.tp-btn--ghost:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }

.tp-btn-sm {
  height: 32px; padding: 0 14px; font-size: 12px;
}

.tp-icon-btn { width: 32px; height: 32px; border-radius: var(--r-sm); border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink-3); transition: all 0.15s; }
.tp-icon-btn:hover { background: var(--bg-2); color: var(--ink); }
.tp-icon-btn--danger:hover { background: var(--red-soft); color: var(--red); }

/* Layout */
.tp-layout { display: grid; grid-template-columns: 236px 1fr 340px; flex: 1; height: calc(100vh - 60px); overflow: hidden; }

/* Sidebar - Same as Teams.vue */
.tp-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 20px 14px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; gap: 22px; }

.tp-nav__label { font-size: 9.5px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding: 0 8px; }
.tp-nav__item { display: flex; align-items: center; gap: 9px; height: 38px; padding: 0 10px; border-radius: var(--r); color: var(--ink-2); font-size: 13px; font-weight: 500; text-decoration: none; cursor: pointer; transition: all 0.15s; margin-bottom: 2px; }
.tp-nav__item:hover { background: var(--bg-2); color: var(--ink); }
.tp-nav__item--active, .tp-nav__item.router-link-active { background: var(--primary-soft); color: var(--primary); font-weight: 700; box-shadow: inset 3px 0 0 var(--primary); }

.tp-team-selector { margin-bottom: 16px; }
.tp-team-selector__label { font-size: 10px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 8px; }
.tp-team-select { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--r); font-size: 13px; font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); cursor: pointer; outline: none; transition: all 0.2s; }
.tp-team-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.10); }

.tp-stats {
  background: linear-gradient(140deg, var(--primary) 0%, var(--primary-dk) 100%);
  border-radius: var(--r-md); padding: 16px; color: var(--white);
  box-shadow: 0 4px 16px rgba(99,102,241,0.32);
  position: relative; overflow: hidden;
}
.tp-stats::after { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.07); border-radius: 50%; pointer-events: none; }
.tp-stats__title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 12px; opacity: 0.8; }
.tp-stats__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.tp-stats__grid:last-child { margin-bottom: 0; }
.tp-stat { text-align: center; background: rgba(255,255,255,0.12); border-radius: var(--r); padding: 10px 8px; border: 1px solid rgba(255,255,255,0.1); }
.tp-stat__value { font-size: 26px; font-weight: 900; font-family: 'Fraunces', serif; line-height: 1; margin-bottom: 3px; }
.tp-stat__label { font-size: 10px; font-weight: 600; opacity: 0.8; }

.tp-filter { border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px; }
.tp-filter__title { font-size: 11px; font-weight: 800; color: var(--ink); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.tp-filter__list { display: flex; flex-direction: column; gap: 1px; }
.tp-filter__item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: var(--r-sm); font-size: 12px; color: var(--ink-2); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; text-align: left; }
.tp-filter__item:hover { background: var(--bg-2); color: var(--ink); }
.tp-filter__item.is-active { background: var(--primary-soft); color: var(--primary); font-weight: 600; }
.tp-filter__dot { width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0; }
.tp-filter__check { margin-left: auto; font-size: 10px; color: var(--primary); }

/* Content - Similar structure to Teams.vue */
.tp-content { padding: 28px; overflow-y: auto; height: 100%; background: var(--bg); }

.tp-page-header { margin-bottom: 24px; }
.tp-page-title { font-size: 28px; font-weight: 900; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; letter-spacing: -0.5px; line-height: 1.1; }
.tp-page-sub { font-size: 14px; color: var(--ink-2); }

.tp-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }

.tp-search { flex: 1; min-width: 220px; max-width: 360px; position: relative; display: flex; align-items: center; }
.tp-search > svg { position: absolute; left: 12px; color: var(--ink-3); pointer-events: none; }
.tp-search__input { width: 100%; height: 40px; padding: 0 34px 0 40px; border: 1px solid var(--border); border-radius: var(--r); font-size: 13px; font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); outline: none; transition: all 0.2s; box-shadow: var(--shadow-xs); }
.tp-search__input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.12), var(--shadow-xs); }
.tp-search__input::placeholder { color: var(--ink-4); }
.tp-search__clear { position: absolute; right: 11px; color: var(--ink-3); font-size: 11px; cursor: pointer; transition: color 0.15s; }
.tp-search__clear:hover { color: var(--ink); }

.tp-view-tabs { display: flex; gap: 2px; background: var(--bg-2); padding: 3px; border-radius: var(--r); border: 1px solid var(--border); }
.tp-view-tab { width: 36px; height: 36px; padding: 0; border: none; background: none; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: var(--ink-3); cursor: pointer; transition: all 0.15s; }
.tp-view-tab.active { background: var(--white); color: var(--primary); box-shadow: var(--shadow-sm); }

/* Create Form - Same as Teams.vue */
.tp-create-form { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; margin-bottom: 20px; box-shadow: var(--shadow-md); }
.tp-create-form__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.tp-create-form__title-wrap { display: flex; align-items: center; gap: 10px; }
.tp-create-form__icon { width: 32px; height: 32px; background: var(--primary-soft); border-radius: var(--r); display: flex; align-items: center; justify-content: center; color: var(--primary); }
.tp-create-form__header h3 { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.tp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.tp-form-group { display: flex; flex-direction: column; gap: 6px; }
.tp-form-group--full { grid-column: 1 / -1; }
.tp-form-group label { font-size: 12px; font-weight: 700; color: var(--ink); }
.tp-req { color: var(--red); margin-left: 2px; }
.tp-input { width: 100%; padding: 9px 13px; border: 1px solid var(--border); border-radius: var(--r); font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--white); outline: none; transition: all 0.2s; }
.tp-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.10); }
.tp-input::placeholder { color: var(--ink-4); }
.tp-textarea-sm { resize: vertical; min-height: 58px; }
.tp-form-actions { display: flex; gap: 8px; justify-content: flex-end; }

.tp-file-input { cursor: pointer; font-size: 13px; }
.tp-file-list { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
.tp-file-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; background: var(--bg-2); border-radius: var(--r-sm); font-size: 12px; }
.tp-file-remove { background: none; border: none; color: var(--red); cursor: pointer; font-size: 14px; padding: 0; transition: opacity 0.15s; }
.tp-file-remove:hover { opacity: 0.7; }

.tp-checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.tp-checkbox-label input[type="checkbox"] { cursor: pointer; }

/* Loading, Empty - Same as Teams.vue */
.tp-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; background: var(--white); border-radius: var(--r-md); border: 1px solid var(--border); gap: 14px; }
.tp-loading p { font-size: 14px; color: var(--ink-2); }
.tp-spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: tp-spin 0.65s linear infinite; }
.tp-spinner--sm { width: 22px; height: 22px; border-width: 2px; }
@keyframes tp-spin { to { transform: rotate(360deg); } }

.tp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 340px; background: var(--white); border-radius: var(--r-md); border: 1px dashed var(--border); gap: 12px; text-align: center; padding: 48px; }
.tp-empty__icon { width: 72px; height: 72px; background: var(--bg-2); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; color: var(--ink-3); margin-bottom: 8px; }
.tp-empty h3 { font-size: 18px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.tp-empty p { font-size: 14px; color: var(--ink-2); max-width: 260px; line-height: 1.5; }

/* Projects Grid */
.tp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; }

.tp-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 18px; cursor: pointer; transition: all 0.22s var(--ease); display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; box-shadow: var(--shadow-xs); }
.tp-card__accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; opacity: 0; transition: opacity 0.22s; }
.tp-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: transparent; }
.tp-card:hover .tp-card__accent { opacity: 1; }

.tp-card__top { display: flex; align-items: center; justify-content: space-between; }
.tp-card__status-chip { padding: 4px 10px; border-radius: var(--r-sm); font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; font-family: 'DM Mono', monospace; }

.tp-card__menu-wrap { position: relative; }
.tp-card__more { width: 30px; height: 30px; border: none; background: none; border-radius: var(--r-sm); color: var(--ink-3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.tp-card__more:hover { background: var(--bg-2); color: var(--ink); }

.tp-card__dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--shadow-xl); z-index: 100; min-width: 168px; overflow: hidden; animation: tp-drop-in 0.15s var(--ease); }
@keyframes tp-drop-in { from { opacity: 0; transform: translateY(-8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
.tp-dropdown__section { padding: 4px; }
.tp-dropdown__divider { height: 1px; background: var(--border); margin: 0; }
.tp-card__dropdown button { width: 100%; display: flex; align-items: center; gap: 9px; padding: 8px 12px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--ink); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.12s; text-align: left; border-radius: var(--r-sm); }
.tp-card__dropdown button:hover { background: var(--bg-2); }
.tp-dropdown-danger { color: var(--red) !important; }
.tp-dropdown-danger:hover { background: var(--red-soft) !important; }

.tp-card__body { flex: 1; min-width: 0; }
.tp-card__title { font-size: 15px; font-weight: 700; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 5px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tp-card__desc { font-size: 12px; color: var(--ink-2); line-height: 1.55; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

.tp-card__meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.tp-card__meta-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-3); }
.tp-card__meta-item--danger { color: var(--red); }

.tp-card__foot { display: flex; align-items: center; gap: 12px; padding-top: 10px; border-top: 1px solid var(--border-2); font-size: 11px; color: var(--ink-3); }
.tp-card__stat { display: flex; align-items: center; gap: 4px; }
.tp-card__owner { margin-left: auto; font-weight: 600; color: var(--ink-2); }

/* List View */
.tp-list { display: flex; flex-direction: column; gap: 12px; }
.tp-list-item { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 20px; background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); cursor: pointer; transition: all 0.2s var(--ease); }
.tp-list-item:hover { transform: translateX(4px); box-shadow: var(--shadow-md); border-color: transparent; }
.tp-list-item__main { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.tp-list-item__status { width: 4px; height: 48px; border-radius: 2px; flex-shrink: 0; }
.tp-list-item__content { flex: 1; min-width: 0; }
.tp-list-item__title { font-size: 15px; font-weight: 700; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tp-list-item__desc { font-size: 13px; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tp-list-item__meta { display: flex; align-items: center; gap: 16px; font-size: 12px; color: var(--ink-3); flex-shrink: 0; }
.tp-list-item__days { font-weight: 600; }
.tp-list-item__days--danger { color: var(--red); }

/* Details Panel */
.tp-details { background: var(--white); border-left: 1px solid var(--border); padding: 20px 16px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
.tp-details__header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.tp-details__header h3 { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 6px; }
.tp-details__status { display: inline-flex; padding: 4px 10px; border-radius: var(--r-sm); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; }
.tp-details__info { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
.tp-details__desc { font-size: 13px; color: var(--ink-2); line-height: 1.55; margin-bottom: 12px; }
.tp-details__dates { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.tp-details__date-item { display: flex; flex-direction: column; gap: 4px; }
.tp-details__date-label { font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.5px; }
.tp-details__date-value { font-size: 13px; font-weight: 600; color: var(--ink); }

.tp-details__tabs { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 4px; }
.tp-details__tab { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border: none; background: none; border-radius: var(--r-sm); font-size: 12px; font-weight: 600; color: var(--ink-3); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.tp-details__tab:hover { background: var(--bg-2); color: var(--ink); }
.tp-details__tab.active { background: var(--primary-soft); color: var(--primary); }

.tp-details__content { flex: 1; }
.tp-details__section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.tp-details__section-header h4 { font-size: 13px; font-weight: 800; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; }
.tp-details__loading { display: flex; justify-content: center; padding: 28px 0; }
.tp-details__empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 28px 0; }
.tp-details__empty p { font-size: 13px; color: var(--ink-3); }

/* Tasks List */
.tp-tasks-list { display: flex; flex-direction: column; gap: 8px; }
.tp-task-item { padding: 12px; background: var(--bg-2); border-radius: var(--r); border: 1px solid var(--border); }
.tp-task-item__header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
.tp-task-item__title { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.tp-task-checkbox { cursor: pointer; }
.tp-task-item__title span { font-size: 13px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tp-task-done { text-decoration: line-through; opacity: 0.6; }
.tp-task-priority { padding: 3px 8px; border-radius: var(--r-sm); font-size: 9px; font-weight: 700; color: var(--white); text-transform: uppercase; letter-spacing: 0.5px; }
.tp-task-item__desc { font-size: 12px; color: var(--ink-2); margin-bottom: 6px; line-height: 1.4; }
.tp-task-item__meta { display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--ink-3); }

/* Documents List */
.tp-documents-list { display: flex; flex-direction: column; gap: 8px; }
.tp-document-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-2); border-radius: var(--r); border: 1px solid var(--border); }
.tp-document-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--white); border-radius: var(--r-sm); font-size: 18px; flex-shrink: 0; }
.tp-document-info { flex: 1; min-width: 0; }
.tp-document-name { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tp-document-meta { font-size: 11px; color: var(--ink-3); }

/* Reminders List */
.tp-reminders-list { display: flex; flex-direction: column; gap: 8px; }
.tp-reminder-item { padding: 12px; background: var(--bg-2); border-radius: var(--r); border: 1px solid var(--border); }
.tp-reminder-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
.tp-reminder-title { font-size: 13px; font-weight: 700; color: var(--ink); }
.tp-reminder-recurring { font-size: 10px; font-weight: 600; color: var(--amber); background: var(--amber-soft); padding: 3px 8px; border-radius: var(--r-sm); }
.tp-reminder-message { font-size: 12px; color: var(--ink-2); margin-bottom: 6px; line-height: 1.4; }
.tp-reminder-time { font-size: 11px; color: var(--ink-3); }

/* Modal */
.tp-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: tp-fade-in 0.2s; }
@keyframes tp-fade-in { from { opacity: 0; } to { opacity: 1; } }
.tp-modal { background: var(--white); border-radius: var(--r-md); box-shadow: var(--shadow-xl); width: 90%; max-width: 520px; max-height: 90vh; display: flex; flex-direction: column; animation: tp-modal-in 0.25s var(--ease); }
@keyframes tp-modal-in { from { opacity: 0; transform: scale(0.95) translateY(-20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.tp-modal__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.tp-modal__header h3 { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.tp-modal__body { padding: 24px; overflow-y: auto; flex: 1; }
.tp-modal__footer { display: flex; gap: 8px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid var(--border); flex-shrink: 0; }

/* Toast */
.tp-toast { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: var(--white); border-radius: var(--r-md); box-shadow: var(--shadow-xl); font-size: 13px; font-weight: 600; z-index: 2000; border: 1px solid var(--border); min-width: 250px; }
.tp-toast__icon { width: 28px; height: 28px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tp-toast--success { border-left: 3px solid var(--green); }
.tp-toast--success .tp-toast__icon { background: var(--green-soft); color: var(--green); }
.tp-toast--error   { border-left: 3px solid var(--red); }
.tp-toast--error   .tp-toast__icon { background: var(--red-soft); color: var(--red); }
.tp-toast-enter-active, .tp-toast-leave-active { transition: all 0.3s var(--ease); }
.tp-toast-enter-from, .tp-toast-leave-to { opacity: 0; transform: translateY(10px) scale(0.97); }

/* Responsive */
@media (max-width: 1200px) {
  .tp-layout { grid-template-columns: 220px 1fr; }
  .tp-details { display: none; }
}
@media (max-width: 900px) {
  .tp-layout { grid-template-columns: 1fr; }
  .tp-sidebar { display: none; }
}
@media (max-width: 640px) {
  .tp-form-grid { grid-template-columns: 1fr; }
  .tp-grid { grid-template-columns: 1fr; }
  .tp-content { padding: 16px; }
}
</style>