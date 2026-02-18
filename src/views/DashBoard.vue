<!-- Dashboard.vue -->
<!-- COMPLETE DASHBOARD WITH INTEGRATED SEARCH - ISOLATED STYLES -->
<template>
  <div class="dashboard-wrapper">
    <!-- Top Navigation -->
    <nav class="dashboard-header-nav">
      <div class="dashboard-header-content">
        <div class="dashboard-header-left">
          <div class="dashboard-workspace-card">
            <div class="dashboard-workspace-logo">
              <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="11" fill="var(--blue)"/>
                <polygon points="21,10 33,16 21,22 9,16" fill="white" opacity="0.95"/>
                <rect x="13" y="25" width="16" height="7" rx="2" fill="white"/>
              </svg>
            </div>
            <div class="dashboard-workspace-details">
              <span class="dashboard-workspace-title">NovaSpace</span>
              <span class="dashboard-workspace-plan">Free Plan</span>
            </div>
          </div>

          <!-- ENHANCED SEARCH WITH DROPDOWN -->
          <div class="dashboard-global-search">
            <svg class="dashboard-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              v-model="globalSearchQuery"
              @input="handleGlobalSearch"
              @focus="searchResults.showing = (searchResults.projects.length > 0 || searchResults.tasks.length > 0)"
              placeholder="Search projects, tasks, or team members..." 
              class="dashboard-search-input"
            />
            
            <!-- Search Results Dropdown -->
            <transition name="dashboard-dropdown-fade">
              <div v-if="searchResults.showing && (searchResults.projects.length > 0 || searchResults.tasks.length > 0 || searchLoading)" 
                   class="dashboard-search-results"
                   @click.stop>
                
                <!-- Projects Results -->
                <div v-if="searchResults.projects.length > 0" class="dashboard-results-group">
                  <div class="dashboard-results-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>Projects</span>
                  </div>
                  <div class="dashboard-results-list">
                    <div v-for="project in searchResults.projects" 
                         :key="'p-' + project.id"
                         class="dashboard-result-item"
                         @click="navigateToProject(project.id)">
                      <div class="dashboard-result-icon blue">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div>
                      <div class="dashboard-result-text">
                        <div class="dashboard-result-name">{{ project.name }}</div>
                        <div class="dashboard-result-meta">{{ project.status }} • Due {{ formatDate(project.endDate) }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tasks Results -->
                <div v-if="searchResults.tasks.length > 0" class="dashboard-results-group">
                  <div class="dashboard-results-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>Tasks</span>
                  </div>
                  <div class="dashboard-results-list">
                    <div v-for="task in searchResults.tasks" 
                         :key="'t-' + task.id"
                         class="dashboard-result-item"
                         @click="navigateToTask(task.id)">
                      <div class="dashboard-result-icon purple">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </div>
                      <div class="dashboard-result-text">
                        <div class="dashboard-result-name">{{ task.title }}</div>
                        <div class="dashboard-result-meta">{{ task.status }} • {{ task.priority }} priority</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="searchLoading" class="dashboard-results-empty">
                  <div class="dashboard-mini-spinner"></div>
                  <span>Searching...</span>
                </div>

                <!-- Empty State -->
                <div v-else-if="globalSearchQuery && searchResults.projects.length === 0 && searchResults.tasks.length === 0" 
                     class="dashboard-results-empty">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21l-4.35-4.35M11 7v8m-4-4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>No results found for "{{ globalSearchQuery }}"</span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
      <button class="dashboard-btn-primary" @click="createNewProject">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        New Project
      </button>

      <div class="dashboard-nav-section">
        <div class="dashboard-section-label">MAIN</div>
        <nav class="dashboard-nav-menu">
          <router-link to="/dashboard" class="dashboard-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/tasks" class="dashboard-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>My Tasks</span>
          </router-link>

          <router-link to="/projects" class="dashboard-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Projects</span>
          </router-link>

          <router-link to="/calendar" class="dashboard-nav-item" >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Calendar</span>
          </router-link>
        </nav>
      </div>

      <div class="dashboard-nav-section">
        <div class="dashboard-section-label">COLLABORATION</div>
        <nav class="dashboard-nav-menu">
          
          <router-link to="/meeting-dashboard" class="dashboard-nav-item">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M17 2l-5 5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Conferencing</span>
            <span class="dashboard-badge-new">New</span>
          </router-link>

          <router-link to="/teams" class="dashboard-nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Teams</span>
            <span v-if="teamCount > 0" class="dashboard-count-badge">{{ teamCount }}</span>
          </router-link>

          <router-link to="/chat" class="dashboard-nav-item">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Messages</span>
            <span v-if="unreadMessages > 0" class="dashboard-msg-count">{{ unreadMessages }}</span>
          </router-link>
        </nav>
      </div>

      <div v-if="userActiveProjects.length > 0" class="dashboard-nav-section">
        <div class="dashboard-section-header">
          <span class="dashboard-section-label">ACTIVE PROJECTS</span>
          <span class="dashboard-count-badge">{{ userActiveProjects.length }}</span>
        </div>
        <nav class="dashboard-nav-menu">
          <a v-for="project in userActiveProjects.slice(0, 5)" 
             :key="project.id" 
             href="#" 
             class="dashboard-nav-item"
             :title="project.name"
             @click.prevent="navigateToProject(project.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" :fill="project.color"/>
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" 
                    :stroke="project.color" 
                    stroke-width="2" 
                    stroke-linecap="round"/>
            </svg>
            <span class="dashboard-project-name">{{ project.name }}</span>
            <span class="dashboard-task-badge">{{ project.taskCount }}</span>
          </a>
        </nav>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-quick-actions">
        <div class="dashboard-qa-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Quick Actions</span>
        </div>
        <div class="dashboard-qa-grid">
          <button class="dashboard-qa-btn" @click="startTimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Start Timer</span>
          </button>
          <button class="dashboard-qa-btn" @click="quickNote">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Quick Note</span>
          </button>
          <button class="dashboard-qa-btn" @click="callTeam">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Call Team</span>
          </button>
          <button class="dashboard-qa-btn" @click="openAIChat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>AI Chat</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main-content">
      <!-- Page Header -->
      <header class="dashboard-page-header">
        <div>
          <h1 class="dashboard-page-title">Dashboard Overview</h1>
          <p class="dashboard-page-subtitle">Welcome back, {{ userData?.firstName || 'User' }}! Here's what's happening today.</p>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="dashboard-loading">
        <div class="dashboard-spinner"></div>
        <p>Loading your workspace...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="dashboard-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="fetchDashboardData" class="dashboard-btn-retry">Try Again</button>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Stats Grid -->
        <div class="dashboard-stats-grid">
          <div class="dashboard-stat-card purple">
            <div class="dashboard-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="dashboard-stat-content">
              <div class="dashboard-stat-header">
                <span class="dashboard-stat-label">Active Tasks</span>
                <span class="dashboard-trend up" v-if="stats.totalTasks > 0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ Math.round((stats.completedTasks / stats.totalTasks) * 100) }}%
                </span>
              </div>
              <div class="dashboard-stat-value">{{ stats.totalTasks }}</div>
              <div class="dashboard-stat-meta">{{ stats.completedTasks }} completed • {{ stats.inProgressTasks }} in progress</div>
            </div>
          </div>

          <div class="dashboard-stat-card blue">
            <div class="dashboard-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="dashboard-stat-content">
              <div class="dashboard-stat-header">
                <span class="dashboard-stat-label">Active Projects</span>
                <span class="dashboard-trend up" v-if="stats.totalProjects > 0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ Math.round((stats.completedProjects / stats.totalProjects) * 100) }}%
                </span>
              </div>
              <div class="dashboard-stat-value">{{ stats.totalProjects }}</div>
              <div class="dashboard-stat-meta">{{ stats.inProgressProjects }} in progress • {{ stats.completedProjects }} done</div>
            </div>
          </div>

          <div class="dashboard-stat-card green">
            <div class="dashboard-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="dashboard-stat-content">
              <div class="dashboard-stat-header">
                <span class="dashboard-stat-label">Completed</span>
                <span class="dashboard-status-active">This Month</span>
              </div>
              <div class="dashboard-stat-value">{{ stats.completedProjects + stats.completedTasks }}</div>
              <div class="dashboard-stat-meta">{{ stats.completedProjects }} projects • {{ stats.completedTasks }} tasks</div>
            </div>
          </div>

          <div class="dashboard-stat-card orange">
            <div class="dashboard-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="dashboard-stat-content">
              <div class="dashboard-stat-header">
                <span class="dashboard-stat-label">Team Members</span>
                <span class="dashboard-status-active">{{ onlineCount }} Online</span>
              </div>
              <div class="dashboard-stat-value">{{ teamCount }}</div>
              <div class="dashboard-stat-meta">Across {{ userTeams.length }} team{{ userTeams.length !== 1 ? 's' : '' }}</div>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="dashboard-main-grid">
          <!-- Activity Feed -->
          <div class="dashboard-card dashboard-activity-card">
            <div class="dashboard-card-header">
              <h2 class="dashboard-card-title">Recent Activity</h2>
              <div class="dashboard-time-filter">
                <button class="dashboard-filter-btn active">Today</button>
                <button class="dashboard-filter-btn">Week</button>
                <button class="dashboard-filter-btn">Month</button>
              </div>
            </div>
            <div class="dashboard-card-body">
              <div v-if="recentActivity.length === 0" class="dashboard-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>No recent activity</p>
                <span>Your project updates will appear here</span>
              </div>
              <div v-else class="dashboard-activity-feed">
                <div v-for="activity in recentActivity.slice(0, 8)" :key="activity.id" class="dashboard-activity-item">
                  <div class="dashboard-activity-avatar" :style="{ background: activity.color }">
                    {{ activity.initials }}
                  </div>
                  <div class="dashboard-activity-details">
                    <div class="dashboard-activity-text">
                      <strong>{{ activity.user }}</strong> {{ activity.action }}
                    </div>
                    <div class="dashboard-activity-meta">{{ activity.project }} • {{ activity.time }}</div>
                  </div>
                  <div class="dashboard-activity-icon" :class="activity.type">
                    <svg v-if="activity.type === 'completed'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2"/>
                      <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="activity.type === 'commented'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="dashboard-card dashboard-deadlines-card">
            <div class="dashboard-card-header">
              <h2 class="dashboard-card-title">Upcoming Deadlines</h2>
            </div>
            <div class="dashboard-card-body">
              <div v-if="upcomingDeadlines.length === 0" class="dashboard-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>No deadlines</p>
                <span>Your upcoming deadlines will show here</span>
              </div>
              <div v-else class="dashboard-deadlines-list">
                <div v-for="deadline in upcomingDeadlines.slice(0, 5)" :key="deadline.id" class="dashboard-deadline-item">
                  <div class="dashboard-deadline-date">
                    <div class="dashboard-date-day">{{ deadline.day }}</div>
                    <div class="dashboard-date-month">{{ deadline.month }}</div>
                  </div>
                  <div class="dashboard-deadline-info">
                    <div class="dashboard-deadline-title">{{ deadline.title }}</div>
                    <div class="dashboard-deadline-time">{{ deadline.timeLeft }}</div>
                    <div class="dashboard-avatar-row" v-if="deadline.members && deadline.members.length > 0">
                      <div v-for="(member, idx) in deadline.members.slice(0, 3)" :key="idx" 
                           class="dashboard-avatar-xs" :style="{ background: member.color }">
                        {{ member.initials }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Overview -->
          <div class="dashboard-card dashboard-projects-card">
            <div class="dashboard-card-header">
              <h2 class="dashboard-card-title">Your Projects</h2>
              <router-link to="/projects" class="dashboard-link-all">View All ({{ stats.totalProjects }})</router-link>
            </div>
            <div class="dashboard-card-body">
              <div v-if="projectsList.length === 0" class="dashboard-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>No projects yet</p>
                <span>Create your first project to get started</span>
              </div>
              <div v-else class="dashboard-projects-list">
                <div v-for="project in projectsList.slice(0, 6)" :key="project.id" class="dashboard-project-item">
                  <div class="dashboard-project-header">
                    <div class="dashboard-project-icon" :class="project.theme">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="dashboard-project-info">
                      <div class="dashboard-project-name">{{ project.name }}</div>
                      <div class="dashboard-project-due">Due {{ project.dueDate }}</div>
                    </div>
                    <div class="dashboard-project-status" :class="project.statusClass">
                      {{ project.status }}
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="dashboard-progress-wrapper">
                    <div class="dashboard-progress-info">
                      <span>Progress</span>
                      <span class="dashboard-progress-pct">{{ project.progress }}%</span>
                    </div>
                    <div class="dashboard-progress-track">
                      <div class="dashboard-progress-fill" :class="project.theme" :style="{ width: project.progress + '%' }">
                        <div class="dashboard-progress-glow"></div>
                      </div>
                      <div class="dashboard-progress-marker" :style="{ left: project.progress + '%' }"></div>
                    </div>
                  </div>

                  <div class="dashboard-project-footer">
                    <div class="dashboard-avatar-row" v-if="project.team && project.team.length > 0">
                      <div v-for="(member, idx) in project.team.slice(0, 3)" :key="idx" 
                           class="dashboard-avatar-xs" :style="{ background: member.color }">
                        {{ member.initials }}
                      </div>
                      <div v-if="project.team.length > 3" class="dashboard-avatar-xs more">
                        +{{ project.team.length - 3 }}
                      </div>
                    </div>
                    <div class="dashboard-task-info">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      {{ project.completedTasks }}/{{ project.totalTasks }} tasks
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Activity -->
          <div class="dashboard-card dashboard-team-card">
            <div class="dashboard-card-header">
              <h2 class="dashboard-card-title">Team Activity</h2>
            </div>
            <div class="dashboard-card-body">
              <div v-if="teamActivity.length === 0" class="dashboard-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>No team activity</p>
                <span>Team updates will appear here</span>
              </div>
              <div v-else class="dashboard-team-activity-list">
                <div v-for="item in teamActivity.slice(0, 6)" :key="item.id" class="dashboard-team-activity-item">
                  <div class="dashboard-avatar-xs" :style="{ background: item.color }">{{ item.initials }}</div>
                  <div class="dashboard-team-activity-content">
                    <div class="dashboard-team-activity-text">
                      <strong>{{ item.name }}</strong> {{ item.action }}
                    </div>
                    <div class="dashboard-team-activity-sub">{{ item.detail }}</div>
                    <div class="dashboard-team-activity-time">{{ item.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// FIX: import DashboardAPI and TeamManagementAPI from teamApi, not apiService
import { TokenService, apiRequest, AuthAPI } from '@/utils/apiService';
import { DashboardAPI, TeamManagementAPI } from '@/utils/teamApi';

export default {
  name: 'Dashboard',
  data() {
    return {
      userData: null,
      stats: {
        totalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
      },
      loading: true,
      error: null,
      teamCount: 0,
      onlineCount: 0,
      unreadMessages: 0,
      userActiveProjects: [],
      recentActivity: [],
      upcomingDeadlines: [],
      projectsList: [],
      teamActivity: [],
      userTeams: [],
      projectColors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
      activityTypes: ['completed', 'commented', 'uploaded', 'created', 'updated'],
      
      // SEARCH
      globalSearchQuery: '',
      searchResults: {
        projects: [],
        tasks: [],
        showing: false
      },
      searchLoading: false,

      // Cache raw API data for client-side search
      _allProjects: [],
      _allTasks: [],
    }
  },
  computed: {
    isAuthenticated() {
      return TokenService.isAuthenticated();
    },
    userInitials() {
      if (!this.userData) return 'U';
      const first = this.userData.firstName?.charAt(0) || '';
      const last = this.userData.lastName?.charAt(0) || '';
      return (first + last).toUpperCase() || 'U';
    }
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;

      try {
        await this.fetchUserData();
        await this.fetchStats();
        await this.fetchUserProjects();
        await this.fetchUserTasks();
        await this.fetchUserTeams();
        await this.generateActivityFeed();
      } catch (error) {
        console.error('❌ Error fetching dashboard:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    async fetchUserData() {
      try {
        const token = TokenService.getAccessToken();
        if (!token) {
          this.$router.push('/auth');
          return;
        }

        // GET /api/auth/me  (AuthController - unchanged)
        const response = await apiRequest('/auth/me', { method: 'GET' });

        if (response.ok) {
          this.userData = await response.json();
          console.log('✅ User data loaded:', this.userData.email);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error.message.includes('Session expired') || error.message.includes('401')) {
          this.$router.push('/auth');
        } else {
          throw error;
        }
      }
    },

    async fetchStats() {
      try {
        // GET /api/v1/dashboard/stats  →  DashboardAPI.getStats()
        const data = await DashboardAPI.getStats();
        this.stats = data;
        console.log('✅ Dashboard stats loaded:', this.stats);
      } catch (error) {
        console.warn('⚠️ Using default stats:', error.message);
      }
    },

    async fetchUserProjects() {
      try {
        // GET /api/v1/dashboard/projects  →  DashboardAPI.getProjectSummaries()
        // FIX: was incorrectly calling /projects?includeDocuments=false (non-existent endpoint)
        const projects = await DashboardAPI.getProjectSummaries();

        // Cache raw data for client-side search
        this._allProjects = Array.isArray(projects) ? projects : [];

        console.log('✅ User projects loaded:', this._allProjects.length);

        // Active projects for sidebar
        this.userActiveProjects = this._allProjects
          .filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS')
          .map((p, idx) => ({
            id: p.id,
            name: p.name || p.title,
            color: this.projectColors[idx % this.projectColors.length],
            taskCount: p.taskCount || 0
          }));

        // Detailed projects list
        this.projectsList = this._allProjects.slice(0, 10).map((p, idx) => ({
          id: p.id,
          name: p.name || p.title,
          dueDate: this.formatDate(p.endDate),
          status: this.getProjectStatus(p.endDate),
          statusClass: this.getProjectStatusClass(p.endDate),
          progress: this.calculateProgress(p.startDate, p.endDate),
          theme: this.getTheme(idx),
          completedTasks: p.completedTasks || 0,
          totalTasks: p.totalTasks || 0,
          team: this.generateTeamAvatars(3)
        }));

        // Upcoming deadlines
        this.upcomingDeadlines = this._allProjects
          .filter(p => p.endDate)
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .slice(0, 6)
          .map(p => {
            const dueDate = new Date(p.endDate);
            const daysLeft = this.getDaysLeft(p.endDate);
            return {
              id: p.id,
              day: dueDate.getDate().toString(),
              month: dueDate.toLocaleString('en', { month: 'short' }),
              title: p.name || p.title,
              timeLeft: daysLeft > 0
                ? `In ${daysLeft} day${daysLeft > 1 ? 's' : ''}`
                : daysLeft === 0
                  ? 'Today'
                  : `${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? 's' : ''} overdue`,
              members: this.generateTeamAvatars(2)
            };
          });

      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        this.userActiveProjects = [];
        this.projectsList = [];
      }
    },

    async fetchUserTasks() {
      try {
        // GET /api/v1/dashboard/tasks  →  DashboardAPI.getTaskSummaries()
        // FIX: was incorrectly calling /tasks/user/all (non-existent endpoint)
        const tasks = await DashboardAPI.getTaskSummaries();

        // Cache raw data for client-side search
        this._allTasks = Array.isArray(tasks) ? tasks : [];

        console.log('✅ User tasks loaded:', this._allTasks.length);

        // Build recent activity from tasks
        this.recentActivity = this._allTasks.slice(0, 10).map((task, idx) => ({
          id: task.id,
          user: this.userData
            ? `${this.userData.firstName} ${this.userData.lastName}`
            : 'You',
          initials: this.userInitials,
          action: this.getTaskAction(task.status),
          project: task.projectTitle || 'Personal Tasks',
          time: this.getRelativeTime(task.updatedAt),
          type: this.activityTypes[idx % this.activityTypes.length],
          color: this.projectColors[idx % this.projectColors.length]
        }));

      } catch (error) {
        console.error('❌ Error fetching tasks:', error);
      }
    },

    async fetchUserTeams() {
      try {
        // GET /api/v1/dashboard/teams/joined  →  TeamManagementAPI.getJoinedTeams()
        // FIX: was calling /dashboard/teams/joined (missing /v1/ prefix)
        this.userTeams = await TeamManagementAPI.getJoinedTeams();

        console.log('✅ User teams loaded:', this.userTeams.length);
        this.teamCount = this.userTeams.length;
        this.onlineCount = Math.floor(this.teamCount * 0.65);
        this.unreadMessages = Math.floor(Math.random() * 5);
      } catch (error) {
        console.error('❌ Error fetching teams:', error);
        this.teamCount = 0;
        this.onlineCount = 0;
      }
    },

    async generateActivityFeed() {
      const projectActivity = this.projectsList.slice(0, 3).map((p, idx) => ({
        id: `p-${p.id}`,
        user: this.userData
          ? `${this.userData.firstName} ${this.userData.lastName}`
          : 'You',
        initials: this.userInitials,
        action: 'updated project',
        project: p.name,
        time: this.getRandomTimeAgo(),
        type: 'updated',
        color: this.projectColors[idx % this.projectColors.length]
      }));

      const combined = [
        ...this.recentActivity.slice(0, 4),
        ...projectActivity.slice(0, 2)
      ];

      this.teamActivity = combined.slice(0, 8).map(item => ({
        id: item.id,
        name: item.user,
        initials: item.initials,
        action: item.action,
        detail: item.project,
        time: item.time,
        color: item.color
      }));
    },

    // ==================== SEARCH ====================
    async handleGlobalSearch() {
      const query = this.globalSearchQuery.trim();

      if (!query) {
        this.searchResults.showing = false;
        this.searchResults.projects = [];
        this.searchResults.tasks = [];
        return;
      }

      if (query.length < 2) return;

      // FIX: No dedicated search endpoint exists in the controller.
      // Filter client-side from cached data fetched at mount time.
      // GET /api/v1/dashboard/projects and /api/v1/dashboard/tasks are
      // already loaded into this._allProjects and this._allTasks.
      try {
        this.searchLoading = true;
        this.searchResults.showing = true;

        const lowerQuery = query.toLowerCase();

        this.searchResults.projects = this._allProjects
          .filter(p =>
            (p.name || p.title || '').toLowerCase().includes(lowerQuery) ||
            (p.description || '').toLowerCase().includes(lowerQuery)
          )
          .slice(0, 5);

        this.searchResults.tasks = this._allTasks
          .filter(t =>
            (t.title || '').toLowerCase().includes(lowerQuery) ||
            (t.description || '').toLowerCase().includes(lowerQuery)
          )
          .slice(0, 5);

        console.log('🔍 Search results:', {
          projects: this.searchResults.projects.length,
          tasks: this.searchResults.tasks.length
        });

      } catch (error) {
        console.error('❌ Search error:', error);
      } finally {
        this.searchLoading = false;
      }
    },

    navigateToProject(projectId) {
      this.$router.push(`/projects/${projectId}`);
      this.closeSearchResults();
    },

    navigateToTask(taskId) {
      console.log('Navigate to task:', taskId);
      this.closeSearchResults();
    },

    closeSearchResults() {
      this.searchResults.showing = false;
      this.globalSearchQuery = '';
      this.searchResults.projects = [];
      this.searchResults.tasks = [];
    },

    createNewProject() {
      this.$router.push('/projects');
    },

    // ==================== HELPERS ====================
    formatDate(dateString) {
      if (!dateString) return 'No deadline';
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    },

    getDaysLeft(dateString) {
      if (!dateString) return 999;
      const dueDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    },

    calculateProgress(startDate, endDate) {
      if (!startDate || !endDate) return Math.floor(Math.random() * 70) + 20;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      if (now < start) return 5;
      if (now > end) return 100;
      return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
    },

    getProjectStatus(endDate) {
      const d = this.getDaysLeft(endDate);
      if (d < 0) return 'Overdue';
      if (d <= 3) return 'At Risk';
      return 'On Track';
    },

    getProjectStatusClass(endDate) {
      const d = this.getDaysLeft(endDate);
      if (d < 0) return 'overdue';
      if (d <= 3) return 'at-risk';
      return 'on-track';
    },

    getTheme(index) {
      return ['purple', 'blue', 'green', 'orange', 'pink', 'cyan'][index % 6];
    },

    generateTeamAvatars(count = 3) {
      const fn = ['S', 'M', 'E', 'A', 'L', 'J', 'K', 'R', 'T', 'N'];
      const ln = ['W', 'C', 'D', 'J', 'M', 'S', 'P', 'B', 'H', 'G'];
      return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
        initials: fn[Math.floor(Math.random() * fn.length)] + ln[Math.floor(Math.random() * ln.length)],
        color: this.projectColors[i % this.projectColors.length]
      }));
    },

    getTaskAction(status) {
      return {
        'TO_DO': 'created task',
        'IN_PROGRESS': 'started working on',
        'DONE': 'completed task',
        'BLOCKED': 'marked task as blocked'
      }[status] || 'updated task';
    },

    getRelativeTime(dateString) {
      if (!dateString) return 'recently';
      const diffMs = new Date() - new Date(dateString);
      const diffMins  = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays  = Math.floor(diffMs / 86400000);
      if (diffMins < 1)  return 'just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7)  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    },

    getRandomTimeAgo() {
      const times = ['2 hours ago', '4 hours ago', '5 hours ago', '8 hours ago', '1 day ago', '2 days ago'];
      return times[Math.floor(Math.random() * times.length)];
    },

    startTimer()  { console.log('Starting timer...'); },
    quickNote()   { console.log('Opening quick note...'); },
    callTeam()    { console.log('Initiating team call...'); },
    openAIChat()  { console.log('Opening AI chat...'); },

    async handleLogout() {
      if (confirm('Are you sure you want to logout?')) {
        await AuthAPI.logout();
        this.$router.push('/auth');
      }
    }
  },

  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push('/auth');
      return;
    }

    console.log('🚀 Dashboard mounted - fetching data...');

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dashboard-global-search')) {
        this.closeSearchResults();
      }
    });

    setTimeout(() => {
      this.fetchDashboardData();
    }, 500);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

.dashboard-wrapper {
  --blue:      #4a90e2;
  --blue-dk:   #2c6fbd;
  --blue-soft: #e8f2fc;
  --blue-mid:  #c9dff5;
  --blue-glow: rgba(74,144,226,0.22);
  --ink:       #0d1b36;
  --ink-s:     #2d3748;
  --ink-m:     #64748b;
  --white:     #ffffff;
  --border:    #e2ecf6;
  --bg:        #f8fafc;
  --purple:    #8b5cf6;
  --green:     #10b981;
  --orange:    #f59e0b;
  --red:       #ef4444;
  --pink:      #ec4899;
  --cyan:      #06b6d4;
  --bar-h:     64px;
  --sidebar-w: 260px;
  --font:      'Manrope', sans-serif;
  --fdisp:     'Space Grotesk', sans-serif;
  --ease:      cubic-bezier(0.22,1,0.36,1);
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  
  background: var(--bg);
  font-family: var(--font);
  display: grid;
  grid-template-areas:
    "nav nav"
    "sidebar main";
  grid-template-rows: var(--bar-h) 1fr;
  grid-template-columns: var(--sidebar-w) 1fr;
}

.dashboard-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-header-nav {
  grid-area: nav;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--bar-h);
}

.dashboard-header-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  max-width: 60%;
}

.dashboard-workspace-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 24px;
  border-right: 1px solid var(--border);
}

.dashboard-workspace-logo { width: 36px; height: 36px; flex-shrink: 0; }

.dashboard-workspace-details { display: flex; flex-direction: column; }

.dashboard-workspace-title {
  font-size: 14px; font-weight: 700; color: var(--ink);
  line-height: 1.2; font-family: var(--fdisp);
}

.dashboard-workspace-plan { font-size: 11px; font-weight: 600; color: var(--ink-m); }

.dashboard-global-search {
  flex: 1; max-width: 520px; position: relative;
  display: flex; align-items: center;
}

.dashboard-search-icon {
  position: absolute; left: 14px; color: var(--ink-m);
  pointer-events: none; z-index: 1;
}

.dashboard-search-input {
  width: 100%; height: 40px; padding: 0 16px 0 40px;
  border: 1px solid var(--border); border-radius: 10px;
  font-size: 14px; font-family: var(--font); color: var(--ink);
  background: var(--bg); transition: all 0.2s var(--ease);
}

.dashboard-search-input:focus {
  outline: none; border-color: var(--blue);
  background: var(--white); box-shadow: 0 0 0 3px var(--blue-glow);
}

.dashboard-search-input::placeholder { color: var(--ink-m); }

.dashboard-search-results {
  position: absolute; top: 48px; left: 0; right: 0;
  background: var(--white); border: 1px solid var(--border);
  border-radius: 12px; box-shadow: 0 12px 32px rgba(13,27,54,0.15);
  max-height: 400px; overflow-y: auto; z-index: 200;
}

.dashboard-search-results::-webkit-scrollbar { width: 6px; }
.dashboard-search-results::-webkit-scrollbar-track { background: var(--bg); }
.dashboard-search-results::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.dashboard-results-group { padding: 8px; border-bottom: 1px solid var(--border); }
.dashboard-results-group:last-child { border-bottom: none; }

.dashboard-results-header {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  text-transform: uppercase; letter-spacing: 0.5px;
}

.dashboard-results-list { display: flex; flex-direction: column; gap: 2px; }

.dashboard-result-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: 8px; cursor: pointer; transition: all 0.2s var(--ease);
}

.dashboard-result-item:hover { background: var(--blue-soft); }

.dashboard-result-icon {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.dashboard-result-icon.blue { background: var(--blue-soft); color: var(--blue); }
.dashboard-result-icon.purple { background: #ede9fe; color: #8b5cf6; }

.dashboard-result-text { flex: 1; min-width: 0; }

.dashboard-result-name {
  font-size: 14px; font-weight: 600; color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-result-meta {
  font-size: 12px; color: var(--ink-m);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-results-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 32px 16px; gap: 12px; text-align: center;
}

.dashboard-results-empty svg { color: var(--ink-m); opacity: 0.5; }
.dashboard-results-empty span { font-size: 13px; color: var(--ink-m); font-weight: 500; }

.dashboard-mini-spinner {
  width: 24px; height: 24px; border: 3px solid var(--border);
  border-top-color: var(--blue); border-radius: 50%;
  animation: dashboard-spin 0.8s linear infinite;
}

.dashboard-dropdown-fade-enter-active,
.dashboard-dropdown-fade-leave-active { transition: all 0.2s var(--ease); }
.dashboard-dropdown-fade-enter-from,
.dashboard-dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px); }

.dashboard-sidebar {
  grid-area: sidebar; background: var(--white);
  border-right: 1px solid var(--border); padding: 24px 16px;
  overflow-y: auto; height: calc(100vh - var(--bar-h));
  position: sticky; top: var(--bar-h);
}

.dashboard-sidebar::-webkit-scrollbar { width: 6px; }
.dashboard-sidebar::-webkit-scrollbar-track { background: var(--bg); }
.dashboard-sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
.dashboard-sidebar::-webkit-scrollbar-thumb:hover { background: var(--ink-m); }

.dashboard-btn-primary {
  width: 100%; height: 44px;
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dk) 100%);
  color: var(--white); border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600; font-family: var(--font);
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 8px; margin-bottom: 24px;
  transition: all 0.3s var(--ease);
}

.dashboard-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px var(--blue-glow); }

.dashboard-nav-section { margin-bottom: 24px; }

.dashboard-section-label {
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  letter-spacing: 0.5px; text-transform: uppercase;
  margin-bottom: 12px; padding: 0 8px;
}

.dashboard-section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px; padding: 0 8px;
}

.dashboard-count-badge {
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  background: var(--bg); padding: 2px 8px; border-radius: 6px;
}

.dashboard-nav-menu { display: flex; flex-direction: column; gap: 4px; }

.dashboard-nav-item {
  display: flex; align-items: center; gap: 12px; height: 40px;
  padding: 0 12px; border-radius: 8px; color: var(--ink-m);
  font-size: 14px; font-weight: 500; text-decoration: none;
  transition: all 0.2s var(--ease); cursor: pointer; position: relative;
}

.dashboard-nav-item:hover { background: var(--bg); color: var(--ink); }
.dashboard-nav-item.active { background: var(--blue-soft); color: var(--blue); font-weight: 600; }
.dashboard-nav-item svg { flex-shrink: 0; }

.dashboard-nav-item span:not(.dashboard-task-badge):not(.dashboard-count-badge):not(.dashboard-msg-count):not(.dashboard-badge-new) {
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-project-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.dashboard-task-badge {
  font-size: 11px; font-weight: 700; color: var(--ink-m);
  background: var(--bg); padding: 2px 7px; border-radius: 6px;
  min-width: 24px; text-align: center;
}

.dashboard-badge-new {
  background: linear-gradient(135deg, var(--purple) 0%, #7c3aed 100%);
  color: var(--white); font-size: 10px; font-weight: 700;
  padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px;
}

.dashboard-msg-count {
  background: var(--red); color: var(--white); font-size: 11px;
  font-weight: 700; padding: 2px 7px; border-radius: 6px;
  min-width: 20px; text-align: center;
}

.dashboard-quick-actions {
  margin-top: 24px; padding: 16px;
  background: linear-gradient(135deg, var(--blue-soft) 0%, #dbeafe 100%);
  border: 1px solid var(--blue-mid); border-radius: 12px;
}

.dashboard-qa-header {
  display: flex; align-items: center; gap: 8px; font-size: 12px;
  font-weight: 700; color: var(--blue); margin-bottom: 12px;
  text-transform: uppercase; letter-spacing: 0.5px;
}

.dashboard-qa-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }

.dashboard-qa-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 8px; background: var(--white); border: 1px solid var(--border);
  border-radius: 8px; font-size: 11px; font-weight: 600; color: var(--ink-m);
  cursor: pointer; transition: all 0.2s var(--ease); font-family: var(--font);
}

.dashboard-qa-btn:hover {
  background: var(--blue-soft); border-color: var(--blue); color: var(--blue);
  transform: translateY(-2px); box-shadow: var(--shadow-md);
}

.dashboard-qa-btn svg { color: var(--blue); }

.dashboard-main-content {
  grid-area: main; padding: 32px; overflow-y: auto;
  max-height: calc(100vh - var(--bar-h));
}

.dashboard-page-header { margin-bottom: 32px; }

.dashboard-page-title {
  font-size: 28px; font-weight: 800; color: var(--ink);
  font-family: var(--fdisp); margin-bottom: 6px; line-height: 1.2;
}

.dashboard-page-subtitle { font-size: 15px; color: var(--ink-m); font-weight: 500; }

.dashboard-loading, .dashboard-error {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 400px; background: var(--white);
  border-radius: 16px; padding: 48px; border: 1px solid var(--border);
}

.dashboard-spinner {
  width: 48px; height: 48px; border: 4px solid var(--border);
  border-top-color: var(--blue); border-radius: 50%;
  animation: dashboard-spin 0.8s linear infinite; margin-bottom: 20px;
}

@keyframes dashboard-spin { to { transform: rotate(360deg); } }

.dashboard-loading p, .dashboard-error p { font-size: 16px; color: var(--ink-m); font-weight: 600; }
.dashboard-error svg { color: var(--red); margin-bottom: 20px; }
.dashboard-error p { margin-bottom: 24px; }

.dashboard-btn-retry {
  height: 40px; padding: 0 24px; background: var(--blue);
  color: var(--white); border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.3s var(--ease); font-family: var(--font);
}

.dashboard-btn-retry:hover { background: var(--blue-dk); transform: translateY(-2px); }

.dashboard-content { display: flex; flex-direction: column; gap: 24px; }

.dashboard-stats-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;
}

.dashboard-stat-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; display: flex; gap: 16px;
  transition: all 0.3s var(--ease);
}

.dashboard-stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: transparent; }

.dashboard-stat-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--white); flex-shrink: 0;
}

.dashboard-stat-card.purple .dashboard-stat-icon { background: linear-gradient(135deg, var(--purple) 0%, #7c3aed 100%); }
.dashboard-stat-card.blue   .dashboard-stat-icon { background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dk) 100%); }
.dashboard-stat-card.green  .dashboard-stat-icon { background: linear-gradient(135deg, var(--green) 0%, #059669 100%); }
.dashboard-stat-card.orange .dashboard-stat-icon { background: linear-gradient(135deg, var(--orange) 0%, #d97706 100%); }

.dashboard-stat-content { flex: 1; display: flex; flex-direction: column; gap: 6px; }

.dashboard-stat-header { display: flex; align-items: center; justify-content: space-between; }
.dashboard-stat-label { font-size: 13px; font-weight: 600; color: var(--ink-m); }

.dashboard-trend {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px;
}

.dashboard-trend.up { color: var(--green); background: #d1fae5; }

.dashboard-status-active {
  font-size: 11px; font-weight: 700; color: var(--green);
  background: #d1fae5; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;
}

.dashboard-stat-value {
  font-size: 32px; font-weight: 800; color: var(--ink);
  font-family: var(--fdisp); line-height: 1;
}

.dashboard-stat-meta { font-size: 12px; color: var(--ink-m); font-weight: 500; }

.dashboard-main-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; }
.dashboard-activity-card  { grid-column: span 8; }
.dashboard-deadlines-card { grid-column: span 4; }
.dashboard-projects-card  { grid-column: span 8; }
.dashboard-team-card      { grid-column: span 4; }

.dashboard-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden; transition: all 0.3s var(--ease);
}

.dashboard-card:hover { box-shadow: var(--shadow-lg); border-color: transparent; }

.dashboard-card-header {
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}

.dashboard-card-title { font-size: 18px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); }
.dashboard-card-body { padding: 24px; }

.dashboard-empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 48px 24px; text-align: center;
}

.dashboard-empty-state svg { color: var(--ink-m); opacity: 0.3; margin-bottom: 16px; }
.dashboard-empty-state p { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
.dashboard-empty-state span { font-size: 14px; color: var(--ink-m); font-weight: 500; }

.dashboard-time-filter {
  display: flex; gap: 6px; background: var(--bg); padding: 4px; border-radius: 8px;
}

.dashboard-filter-btn {
  padding: 6px 14px; border: none; background: transparent; border-radius: 6px;
  font-size: 13px; font-weight: 600; color: var(--ink-m); cursor: pointer;
  transition: all 0.2s var(--ease); font-family: var(--font);
}

.dashboard-filter-btn:hover { color: var(--ink); }
.dashboard-filter-btn.active { background: var(--white); color: var(--blue); box-shadow: var(--shadow-sm); }

.dashboard-activity-feed {
  display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto;
}

.dashboard-activity-feed::-webkit-scrollbar { width: 6px; }
.dashboard-activity-feed::-webkit-scrollbar-track { background: var(--bg); border-radius: 3px; }
.dashboard-activity-feed::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.dashboard-activity-item {
  display: flex; gap: 12px; padding: 12px; background: var(--bg);
  border-radius: 10px; transition: all 0.2s var(--ease); align-items: center;
}

.dashboard-activity-item:hover { background: var(--blue-soft); }

.dashboard-activity-avatar {
  width: 40px; height: 40px; border-radius: 10px; color: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; flex-shrink: 0; font-family: var(--fdisp);
}

.dashboard-activity-details { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dashboard-activity-text { font-size: 14px; color: var(--ink); font-weight: 500; }
.dashboard-activity-text strong { font-weight: 700; }

.dashboard-activity-meta {
  font-size: 12px; color: var(--ink-m); font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-activity-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.dashboard-activity-icon.completed  { background: #d1fae5; color: var(--green); }
.dashboard-activity-icon.commented  { background: var(--blue-soft); color: var(--blue); }
.dashboard-activity-icon.uploaded,
.dashboard-activity-icon.created,
.dashboard-activity-icon.updated    { background: #fef3c7; color: var(--orange); }

.dashboard-deadlines-list {
  display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto;
}

.dashboard-deadlines-list::-webkit-scrollbar { width: 6px; }
.dashboard-deadlines-list::-webkit-scrollbar-track { background: var(--bg); border-radius: 3px; }
.dashboard-deadlines-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.dashboard-deadline-item {
  display: flex; gap: 12px; padding: 12px; background: var(--bg);
  border-radius: 10px; transition: all 0.2s var(--ease);
}

.dashboard-deadline-item:hover { background: var(--blue-soft); }

.dashboard-deadline-date {
  width: 48px; height: 48px; background: var(--white); border: 1px solid var(--border);
  border-radius: 10px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; flex-shrink: 0;
}

.dashboard-date-day { font-size: 18px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); line-height: 1; }
.dashboard-date-month { font-size: 11px; font-weight: 600; color: var(--ink-m); text-transform: uppercase; }

.dashboard-deadline-info { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }

.dashboard-deadline-title {
  font-size: 14px; font-weight: 700; color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-deadline-time { font-size: 12px; color: var(--ink-m); font-weight: 500; }

.dashboard-avatar-row { display: flex; gap: 4px; align-items: center; }

.dashboard-avatar-xs {
  width: 24px; height: 24px; border-radius: 6px; color: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; border: 2px solid var(--white);
  flex-shrink: 0; font-family: var(--fdisp);
}

.dashboard-avatar-xs.more { background: var(--ink-m); }

.dashboard-projects-list {
  display: flex; flex-direction: column; gap: 16px; max-height: 600px; overflow-y: auto;
}

.dashboard-projects-list::-webkit-scrollbar { width: 6px; }
.dashboard-projects-list::-webkit-scrollbar-track { background: var(--bg); border-radius: 3px; }
.dashboard-projects-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.dashboard-project-item {
  padding: 16px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 12px; display: flex; flex-direction: column; gap: 14px;
  transition: all 0.3s var(--ease);
}

.dashboard-project-item:hover { background: var(--white); box-shadow: var(--shadow-md); }

.dashboard-project-header { display: flex; align-items: flex-start; gap: 12px; }

.dashboard-project-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.dashboard-project-icon.purple { background: #ede9fe; color: var(--purple); }
.dashboard-project-icon.blue   { background: var(--blue-soft); color: var(--blue); }
.dashboard-project-icon.green  { background: #d1fae5; color: var(--green); }
.dashboard-project-icon.orange { background: #fef3c7; color: var(--orange); }
.dashboard-project-icon.pink   { background: #fce7f3; color: var(--pink); }
.dashboard-project-icon.cyan   { background: #cffafe; color: var(--cyan); }

.dashboard-project-info { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }

.dashboard-project-name {
  font-size: 15px; font-weight: 700; color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-project-due { font-size: 12px; color: var(--ink-m); font-weight: 500; }

.dashboard-project-status {
  padding: 5px 10px; border-radius: 8px; font-size: 11px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap;
}

.dashboard-project-status.on-track { background: #d1fae5; color: var(--green); }
.dashboard-project-status.at-risk  { background: #fef3c7; color: var(--orange); }
.dashboard-project-status.overdue  { background: #fee2e2; color: var(--red); }

.dashboard-progress-wrapper { display: flex; flex-direction: column; gap: 8px; }

.dashboard-progress-info { display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
.dashboard-progress-info span:first-child { font-weight: 600; color: var(--ink-m); }
.dashboard-progress-pct { font-size: 13px; font-weight: 800; color: var(--ink); font-family: var(--fdisp); }

.dashboard-progress-track {
  position: relative; width: 100%; height: 8px;
  background: var(--border); border-radius: 8px; overflow: visible;
}

.dashboard-progress-fill {
  height: 100%; border-radius: 8px;
  transition: width 0.6s var(--ease); position: relative; overflow: hidden;
}

.dashboard-progress-fill.purple { background: linear-gradient(90deg, var(--purple) 0%, #9333ea 100%); box-shadow: 0 2px 8px rgba(139,92,246,0.3); }
.dashboard-progress-fill.blue   { background: linear-gradient(90deg, var(--blue) 0%, var(--blue-dk) 100%); box-shadow: 0 2px 8px rgba(74,144,226,0.3); }
.dashboard-progress-fill.green  { background: linear-gradient(90deg, var(--green) 0%, #059669 100%); box-shadow: 0 2px 8px rgba(16,185,129,0.3); }
.dashboard-progress-fill.orange { background: linear-gradient(90deg, var(--orange) 0%, #d97706 100%); box-shadow: 0 2px 8px rgba(245,158,11,0.3); }
.dashboard-progress-fill.pink   { background: linear-gradient(90deg, var(--pink) 0%, #db2777 100%); box-shadow: 0 2px 8px rgba(236,72,153,0.3); }
.dashboard-progress-fill.cyan   { background: linear-gradient(90deg, var(--cyan) 0%, #0891b2 100%); box-shadow: 0 2px 8px rgba(6,182,212,0.3); }

.dashboard-progress-glow {
  position: absolute; top: 0; right: 0; width: 40px; height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 100%);
  animation: dashboard-shimmer 2s infinite;
}

@keyframes dashboard-shimmer {
  0%, 100% { transform: translateX(-40px); opacity: 0; }
  50%       { transform: translateX(0); opacity: 1; }
}

.dashboard-progress-marker {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 14px; height: 14px; background: var(--white);
  border: 3px solid var(--purple); border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: left 0.6s var(--ease);
}

.dashboard-project-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 10px; border-top: 1px solid var(--border);
}

.dashboard-task-info {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: var(--ink-m);
}

.dashboard-link-all {
  font-size: 13px; font-weight: 700; color: var(--blue);
  text-decoration: none; transition: all 0.2s var(--ease);
}

.dashboard-link-all:hover { color: var(--blue-dk); }

.dashboard-team-activity-list {
  display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto;
}

.dashboard-team-activity-list::-webkit-scrollbar { width: 6px; }
.dashboard-team-activity-list::-webkit-scrollbar-track { background: var(--bg); border-radius: 3px; }
.dashboard-team-activity-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.dashboard-team-activity-item {
  display: flex; gap: 12px; padding: 12px; background: var(--bg);
  border-radius: 10px; transition: all 0.2s var(--ease);
}

.dashboard-team-activity-item:hover { background: var(--blue-soft); }

.dashboard-team-activity-content { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dashboard-team-activity-text { font-size: 13px; color: var(--ink); font-weight: 500; }
.dashboard-team-activity-text strong { font-weight: 700; }

.dashboard-team-activity-sub {
  font-size: 12px; color: var(--ink-m); font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.dashboard-team-activity-time { font-size: 11px; color: var(--ink-m); font-weight: 500; }

@media (max-width: 1400px) {
  .dashboard-activity-card, .dashboard-projects-card  { grid-column: span 7; }
  .dashboard-deadlines-card, .dashboard-team-card     { grid-column: span 5; }
}

@media (max-width: 1200px) {
  .dashboard-activity-card, .dashboard-deadlines-card,
  .dashboard-projects-card, .dashboard-team-card { grid-column: span 12; }
}

@media (max-width: 968px) {
  .dashboard-wrapper {
    grid-template-areas: "nav" "main";
    grid-template-columns: 1fr;
  }
  .dashboard-sidebar { display: none; }
  .dashboard-header-left { max-width: 100%; }
  .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-main-content { padding: 24px 20px; }
}

@media (max-width: 640px) {
  .dashboard-wrapper { --bar-h: 56px; }
  .dashboard-workspace-card { border-right: none; padding-right: 0; }
  .dashboard-global-search { display: none; }
  .dashboard-stats-grid { grid-template-columns: 1fr; }
  .dashboard-main-content { padding: 16px; }
  .dashboard-page-title { font-size: 22px; }
  .dashboard-card-body { padding: 16px; }
}
</style>