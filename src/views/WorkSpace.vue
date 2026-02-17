<!-- WorkSpace.vue — Full-featured workspace with inline editor, work/continue/view modes -->
<template>
  <div class="ws-root">
    <!-- Header -->
    <header class="ws-header">
      <div class="ws-header__inner">
        <div class="ws-brand">
          <div class="ws-brand__icon">
            <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <rect x="8" y="8" width="26" height="26" rx="3" stroke="white" stroke-width="2"/>
              <path d="M21 13v16M13 21h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ws-brand__text">
            <span class="ws-brand__name">NovaSpace</span>
            <span class="ws-brand__sub">WorkSpace</span>
          </div>
        </div>

        <div class="ws-header__center" v-if="editorMode">
          <div class="ws-editor-breadcrumb">
            <button @click="exitEditor" class="ws-crumb-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Workspaces
            </button>
            <span class="ws-crumb-sep">/</span>
            <span class="ws-crumb-current">{{ activeWorkspace?.title }}</span>
            <span class="ws-editor-badge" :class="`ws-editor-badge--${editorTab}`">
              {{ editorTab === 'work' ? '✏️ Editing' : editorTab === 'continue' ? '➕ Continuing' : '👁 Viewing' }}
            </span>
          </div>
        </div>

        <div class="ws-header__actions">
          <button v-if="!editorMode" class="ws-btn ws-btn--ghost" @click="downloadAll">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Download All
          </button>
          <button v-if="editorMode" class="ws-btn ws-btn--save" @click="submitEditorContent" :disabled="submittingEditor">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {{ submittingEditor ? 'Saving…' : 'Save Changes' }}
          </button>
          <button v-if="editorMode" class="ws-btn ws-btn--ghost" @click="exitEditor">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Close
          </button>
        </div>
      </div>
    </header>

    <!-- ===================== EDITOR MODE ===================== -->
    <div v-if="editorMode" class="ws-editor-shell">
      <aside class="ws-editor-sidebar">
        <div class="ws-editor-info">
          <div class="ws-editor-type-pill" :style="{ background: getTypeColor(activeWorkspace?.docType) }">
            {{ activeWorkspace?.docType || 'TEXT' }}
          </div>
          <h2 class="ws-editor-title">{{ activeWorkspace?.title }}</h2>
          <p class="ws-editor-desc">{{ activeWorkspace?.description || 'No description provided.' }}</p>
        </div>

        <div class="ws-editor-tabs">
          <div class="ws-editor-tabs__label">View Mode</div>
          <button :class="['ws-editor-tab', { active: editorTab === 'view' }]" @click="switchEditorTab('view')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            View Only
          </button>
          <button :class="['ws-editor-tab', { active: editorTab === 'work' }]" @click="switchEditorTab('work')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Work (Replace)
          </button>
          <button :class="['ws-editor-tab', { active: editorTab === 'continue' }]" @click="switchEditorTab('continue')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Continue (Append)
          </button>
        </div>

        <div class="ws-editor-actions">
          <div class="ws-editor-actions__label">Actions</div>
          <button class="ws-action-btn" @click="copyContent">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/></svg>
            {{ copied ? '✓ Copied!' : 'Copy Content' }}
          </button>
          <button class="ws-action-btn" @click="downloadWorkspace(activeWorkspace.id)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Download File
          </button>
          <button class="ws-action-btn ws-action-btn--danger" @click="deleteFromEditor">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Delete Workspace
          </button>
        </div>
      </aside>

      <!-- Editor Main -->
      <div class="ws-editor-main">
        <!-- View Mode -->
        <div v-if="editorTab === 'view'" class="ws-view-pane">
          <div class="ws-code-block">
            <div class="ws-code-block__header">
              <div class="ws-code-block__dots">
                <span></span><span></span><span></span>
              </div>
              <span class="ws-code-block__lang">{{ activeWorkspace?.docType?.toLowerCase() || 'text' }}</span>
              <button class="ws-code-copy-btn" @click="copyContent">
                {{ copied ? '✓ Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="ws-code-pre"><code>{{ activeContent || 'No content yet. Switch to Work or Continue mode to add content.' }}</code></pre>
          </div>
        </div>

        <!-- Work / Continue Mode -->
        <div v-else class="ws-edit-pane">
          <div class="ws-edit-pane__header">
            <div class="ws-edit-mode-info" :class="{ 'ws-edit-mode-info--green': editorTab === 'continue' }">
              <svg v-if="editorTab === 'work'" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>
              <span v-if="editorTab === 'work'">Work mode <strong>replaces</strong> existing content. Write only your new logic/content.</span>
              <span v-else>Continue mode <strong>appends</strong> to existing content. Your addition goes after what's already there.</span>
            </div>
          </div>

          <div class="ws-editor-split">
            <div class="ws-editor-input-panel">
              <div class="ws-panel-label">
                <span>{{ editorTab === 'work' ? 'Your Content' : 'New Content to Append' }}</span>
                <span class="ws-char-count">{{ editorInput.length }} chars</span>
              </div>
              <textarea
                v-model="editorInput"
                class="ws-textarea"
                :placeholder="editorTab === 'work'
                  ? `Write your ${activeWorkspace?.docType || 'content'} here…\n\nFor example:\nconsole.log('Hello World!');`
                  : `Add more content to append…`"
                spellcheck="false"
              ></textarea>
            </div>

            <div class="ws-editor-preview-panel">
              <div class="ws-panel-label">
                <span>Current Document</span>
                <span class="ws-char-count">Preview</span>
              </div>
              <pre class="ws-preview-pre"><code>{{ activeContent || 'No content yet.' }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== LIST MODE ===================== -->
    <div v-else class="ws-layout">
      <!-- Sidebar -->
      <aside class="ws-sidebar">
        <nav class="ws-nav">
          <div class="ws-nav__label">Navigation</div>
          <router-link to="/dashboard" class="ws-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
            Dashboard
          </router-link>
          <router-link to="/tasks" class="ws-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Tasks
          </router-link>
          <router-link to="/projects" class="ws-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Projects
          </router-link>
          <router-link to="/workspace" class="ws-nav__item ws-nav__item--active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            WorkSpace
          </router-link>
          <router-link to="/calendar" class="ws-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Calendar
          </router-link>
        </nav>

        <div class="ws-stats">
          <div class="ws-stats__title">Quick Stats</div>
          <div class="ws-stats__grid">
            <div class="ws-stat">
              <div class="ws-stat__value">{{ totalWorkspaces }}</div>
              <div class="ws-stat__label">Total</div>
            </div>
            <div class="ws-stat">
              <div class="ws-stat__value">{{ recentWorkspaces.length }}</div>
              <div class="ws-stat__label">Recent</div>
            </div>
          </div>
        </div>

        <div class="ws-filter">
          <div class="ws-filter__title">Filter by Type</div>
          <div class="ws-filter__list">
            <button
              v-for="type in documentTypes"
              :key="type.value"
              :class="['ws-filter__item', { 'is-active': selectedType === type.value }]"
              @click="filterByType(type.value)"
            >
              <span class="ws-filter__dot" :style="{ background: type.color }"></span>
              {{ type.label }}
              <span v-if="selectedType === type.value" class="ws-filter__check">✓</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="ws-content">
        <div class="ws-page-header">
          <div class="ws-page-header__left">
            <h1 class="ws-page-title">WorkSpace</h1>
            <p class="ws-page-sub">Create, edit and manage your code & document workspaces</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="ws-controls">
          <div class="ws-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input v-model="searchQuery" type="text" placeholder="Search workspaces…" class="ws-search__input" @input="handleSearch" />
            <span v-if="searchQuery" class="ws-search__clear" @click="searchQuery = ''">✕</span>
          </div>
          <div class="ws-view-tabs">
            <button :class="['ws-view-tab', { active: viewMode === 'all' }]" @click="viewMode='all'; loadWorkspaces()">All</button>
            <button :class="['ws-view-tab', { active: viewMode === 'recent' }]" @click="viewMode='recent'; loadRecentWorkspaces()">Recent</button>
            <button :class="['ws-view-tab', { active: viewMode === 'accessed' }]" @click="viewMode='accessed'; loadRecentlyAccessed()">Last Accessed</button>
          </div>
        </div>

        <!-- Create Form -->
        <div v-if="showCreateForm" class="ws-create-form">
          <div class="ws-create-form__header">
            <div class="ws-create-form__title-wrap">
              <div class="ws-create-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              </div>
              <h3>New Workspace</h3>
            </div>
            <button @click="cancelCreate" class="ws-icon-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="ws-form-grid">
            <div class="ws-form-group">
              <label>Title <span class="ws-req">*</span></label>
              <input v-model="formData.title" type="text" class="ws-input" placeholder="e.g. My React Component" required />
            </div>
            <div class="ws-form-group">
              <label>Document Type <span class="ws-req">*</span></label>
              <select v-model="formData.docType" class="ws-input ws-select" required>
                <option value="">Choose type…</option>
                <option v-for="t in documentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="ws-form-group ws-form-group--full">
              <label>Description</label>
              <textarea v-model="formData.description" class="ws-input ws-textarea-sm" rows="2" placeholder="Describe this workspace…"></textarea>
            </div>
          </div>
          <div class="ws-form-actions">
            <button @click="cancelCreate" class="ws-btn ws-btn--ghost">Cancel</button>
            <button @click="submitWorkspace" class="ws-btn ws-btn--primary" :disabled="submitting || !formData.title || !formData.docType">
              <svg v-if="!submitting" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              {{ submitting ? 'Creating…' : 'Create Workspace' }}
            </button>
          </div>
        </div>

        <button v-else class="ws-new-btn" @click="showCreateForm = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          New Workspace
        </button>

        <!-- Loading -->
        <div v-if="loading" class="ws-loading">
          <div class="ws-spinner"></div>
          <p>Loading workspaces…</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredWorkspaces.length === 0 && !showCreateForm" class="ws-empty">
          <div class="ws-empty__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <h3>No workspaces yet</h3>
          <p>Create your first workspace to start coding</p>
          <button class="ws-btn ws-btn--primary" @click="showCreateForm = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            Create Workspace
          </button>
        </div>

        <!-- Grid -->
        <div v-else-if="!showCreateForm" class="ws-grid">
          <div
            v-for="ws in filteredWorkspaces"
            :key="ws.id"
            class="ws-card"
            @click="openWorkspace(ws)"
          >
            <div class="ws-card__accent" :style="{ background: getTypeColor(ws.docType) }"></div>

            <div class="ws-card__top">
              <div class="ws-card__type-chip" :style="{ background: getTypeBg(ws.docType), color: getTypeText(ws.docType) }">
                {{ ws.docType || 'TEXT' }}
              </div>
              <div class="ws-card__menu-wrap" @click.stop>
                <button class="ws-card__more" @click="toggleMenu(ws.id)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                </button>
                <div v-if="activeMenu === ws.id" class="ws-card__dropdown">
                  <div class="ws-dropdown__section">
                    <button @click="openWorkspace(ws)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                      View
                    </button>
                    <button @click="openEditor(ws, 'work')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Work in Doc
                    </button>
                    <button @click="openEditor(ws, 'continue')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Continue
                    </button>
                    <button @click="downloadWorkspace(ws.id)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Download
                    </button>
                  </div>
                  <div class="ws-dropdown__divider"></div>
                  <div class="ws-dropdown__section">
                    <button @click="deleteWorkspace(ws.id)" class="ws-dropdown-danger">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="ws-card__body">
              <h3 class="ws-card__title">{{ ws.title }}</h3>
              <p class="ws-card__desc">{{ ws.description || 'No description provided.' }}</p>
            </div>

            <div class="ws-card__quick-actions">
              <button class="ws-qa-btn ws-qa-btn--edit" @click.stop="openEditor(ws, 'work')" title="Work in Doc">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Work
              </button>
              <button class="ws-qa-btn ws-qa-btn--append" @click.stop="openEditor(ws, 'continue')" title="Continue">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Continue
              </button>
              <button class="ws-qa-btn ws-qa-btn--view" @click.stop="openWorkspace(ws)" title="View">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                View
              </button>
            </div>

            <div class="ws-card__foot">
              <span class="ws-card__date">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                {{ formatDate(ws.createdAt || ws.updatedAt) }}
              </span>
              <span class="ws-card__user">
                <span class="ws-card__avatar">{{ (ws.username || 'Y')[0].toUpperCase() }}</span>
                {{ ws.username || 'You' }}
              </span>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Activity Panel -->
      <aside class="ws-activity">
        <div class="ws-activity__hd">
          <h3>Recent Activity</h3>
          <p>Your last opened files</p>
        </div>

        <div v-if="loadingActivity" class="ws-activity__loading">
          <div class="ws-spinner ws-spinner--sm"></div>
        </div>

        <div v-else-if="recentWorkspaces.length === 0" class="ws-activity__empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <p>No recent activity</p>
        </div>

        <div v-else class="ws-activity__list">
          <div
            v-for="ws in recentWorkspaces.slice(0, 8)"
            :key="ws.id + '-activity'"
            class="ws-activity-item"
            @click="openWorkspace(ws)"
          >
            <div class="ws-activity-item__icon" :style="{ background: getTypeBg(ws.docType) }">
              <span :style="{ color: getTypeText(ws.docType), fontSize: '9px', fontWeight: '800' }">{{ (ws.docType || 'TXT').slice(0, 3) }}</span>
            </div>
            <div class="ws-activity-item__body">
              <p class="ws-activity-item__name">{{ ws.title }}</p>
              <p class="ws-activity-item__time">{{ formatRelative(ws.updatedAt || ws.createdAt) }}</p>
            </div>
            <button class="ws-activity-item__edit" @click.stop="openEditor(ws, 'work')" title="Quick edit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <div class="ws-quick-actions">
          <div class="ws-quick-actions__label">Quick Actions</div>
          <button class="ws-qa-action" @click="showCreateForm = true; scrollToTop()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            New Workspace
          </button>
          <button class="ws-qa-action" @click="downloadAll">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Download All (.zip)
          </button>
        </div>
      </aside>
    </div>

    <!-- Toast -->
    <transition name="ws-toast">
      <div v-if="toast.show" :class="['ws-toast', `ws-toast--${toast.type}`]">
        <div class="ws-toast__icon">
          <svg v-if="toast.type === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import WorkSpaceAPI from '@/utils/workspaceApi';

export default {
  name: 'WorkSpace',
  data() {
    return {
      workspaces: [],
      recentWorkspaces: [],
      loading: true,
      loadingActivity: true,
      viewMode: 'all',
      selectedType: null,
      searchQuery: '',
      showCreateForm: false,
      activeMenu: null,
      submitting: false,
      copied: false,

      editorMode: false,
      activeWorkspace: null,
      activeContent: '',
      editorTab: 'view',
      editorInput: '',
      submittingEditor: false,

      formData: { title: '', description: '', docType: '' },

      documentTypes: [
        { label: 'HTML',       value: 'HTML',        color: '#f59e0b' },
        { label: 'CSS',        value: 'CSS',         color: '#3b82f6' },
        { label: 'JavaScript', value: 'JS',          color: '#eab308' },
        { label: 'TypeScript', value: 'TYPESCRIPT',  color: '#6366f1' },
        { label: 'Python',     value: 'PYTHON',      color: '#10b981' },
        { label: 'Java',       value: 'JAVA',        color: '#ef4444' },
        { label: 'C++',        value: 'C_PLUS_PLUS', color: '#8b5cf6' },
        { label: 'C#',         value: 'C_SHARP',     color: '#a855f7' },
        { label: 'Go',         value: 'GO',          color: '#06b6d4' },
        { label: 'Ruby',       value: 'RUBY',        color: '#f43f5e' },
        { label: 'PHP',        value: 'PHP',         color: '#7c3aed' },
        { label: 'Kotlin',     value: 'KOTLIN',      color: '#f97316' },
        { label: 'Scala',      value: 'SCALA',       color: '#ef4444' },
        { label: 'Swift',      value: 'SWIFT',       color: '#f59e0b' },
        { label: 'R',          value: 'R',           color: '#3b82f6' },
        { label: 'SQL',        value: 'SQL',         color: '#0891b2' },
        { label: 'NoSQL',      value: 'NO_SQL',      color: '#16a34a' },
        { label: 'Markdown',   value: 'MARKDOWN',    color: '#64748b' },
        { label: 'Text',       value: 'TEXT',        color: '#94a3b8' },
      ],

      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    filteredWorkspaces() {
      if (!Array.isArray(this.workspaces)) return [];
      let list = [...this.workspaces];
      if (this.selectedType) list = list.filter(w => w.docType === this.selectedType);
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(w =>
          (w.title && w.title.toLowerCase().includes(q)) ||
          (w.description && w.description.toLowerCase().includes(q))
        );
      }
      return list;
    },
    totalWorkspaces() {
      return Array.isArray(this.workspaces) ? this.workspaces.length : 0;
    }
  },

  methods: {
    async loadWorkspaces() {
      try {
        this.loading = true;
        const data = await WorkSpaceAPI.getRecentWorkspaces();
        this.workspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load workspaces', 'error');
        this.workspaces = [];
      } finally {
        this.loading = false;
      }
    },
    async loadRecentWorkspaces() {
      try {
        this.loading = true;
        const data = await WorkSpaceAPI.getRecentWorkspaces();
        this.workspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load recent workspaces', 'error');
        this.workspaces = [];
      } finally {
        this.loading = false;
      }
    },
    async loadRecentlyAccessed() {
      try {
        this.loading = true;
        const data = await WorkSpaceAPI.getRecentlyAccessedWorkspaces();
        this.workspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load recently accessed', 'error');
        this.workspaces = [];
      } finally {
        this.loading = false;
      }
    },
    async loadRecentActivity() {
      try {
        this.loadingActivity = true;
        const data = await WorkSpaceAPI.getRecentWorkspaces();
        this.recentWorkspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.recentWorkspaces = [];
      } finally {
        this.loadingActivity = false;
      }
    },

    async openWorkspace(ws) {
      try {
        this.loading = true;
        const data = await WorkSpaceAPI.viewWorkspace(ws.id);
        this.activeWorkspace = {
          id: ws.id,
          title: data.title || ws.title,
          description: data.description || ws.description,
          docType: ws.docType,
          createdAt: ws.createdAt,
          updatedAt: ws.updatedAt,
          username: ws.username
        };
        this.activeContent = data.content || '';
        this.editorInput = '';
        this.editorTab = 'view';
        this.editorMode = true;
      } catch (e) {
        this.showToast('Failed to load workspace', 'error');
      } finally {
        this.loading = false;
      }
    },

    async openEditor(ws, tab) {
      await this.openWorkspace(ws);
      this.editorTab = tab;
      this.activeMenu = null;
    },

    switchEditorTab(tab) {
      this.editorTab = tab;
      if (tab !== 'view') this.editorInput = '';
    },

    exitEditor() {
      this.editorMode = false;
      this.activeWorkspace = null;
      this.activeContent = '';
      this.editorInput = '';
      this.editorTab = 'view';
      this.loadWorkspaces();
      this.loadRecentActivity();
    },

    async submitEditorContent() {
      if (this.editorTab === 'view') return;
      if (!this.editorInput.trim()) {
        this.showToast('Please enter some content first', 'error');
        return;
      }
      try {
        this.submittingEditor = true;
        let response;
        if (this.editorTab === 'work') {
          response = await WorkSpaceAPI.workInWorkspace(this.activeWorkspace.id, this.editorInput);
        } else {
          response = await WorkSpaceAPI.continueWork(this.activeWorkspace.id, this.editorInput);
        }
        const fresh = await WorkSpaceAPI.viewWorkspace(this.activeWorkspace.id);
        this.activeContent = fresh.content || response?.content || this.editorInput;
        this.editorInput = '';
        this.editorTab = 'view';
        this.showToast('Workspace saved successfully!', 'success');
        this.loadRecentActivity();
      } catch (e) {
        this.showToast('Failed to save changes', 'error');
      } finally {
        this.submittingEditor = false;
      }
    },

    async deleteFromEditor() {
      if (!confirm('Delete this workspace? This cannot be undone.')) return;
      await this.deleteWorkspace(this.activeWorkspace.id);
      this.exitEditor();
    },

    async submitWorkspace() {
      try {
        this.submitting = true;
        const created = await WorkSpaceAPI.createWorkspace(this.formData);
        if (created?.id) {
          await WorkSpaceAPI.createTemplate(created.id, this.formData.docType);
        }
        this.showToast('Workspace created!', 'success');
        this.cancelCreate();
        await this.loadWorkspaces();
        await this.loadRecentActivity();
      } catch (e) {
        this.showToast('Failed to create workspace', 'error');
      } finally {
        this.submitting = false;
      }
    },

    cancelCreate() {
      this.showCreateForm = false;
      this.formData = { title: '', description: '', docType: '' };
    },

    async deleteWorkspace(id) {
      if (!confirm('Delete this workspace?')) return;
      try {
        await WorkSpaceAPI.deleteWorkspace(id);
        this.workspaces = this.workspaces.filter(w => w.id !== id);
        this.showToast('Workspace deleted', 'success');
      } catch (e) {
        this.showToast('Failed to delete', 'error');
      }
      this.activeMenu = null;
    },

    async downloadWorkspace(id) {
      try {
        const blob = await WorkSpaceAPI.downloadWorkspace(id);
        const ws = this.workspaces.find(w => w.id === id);
        const ext = this.getExtension(ws?.docType);
        WorkSpaceAPI.downloadFile(blob, `${ws?.title || 'workspace'}${ext}`);
        this.showToast('Download started', 'success');
      } catch (e) {
        this.showToast('Download failed', 'error');
      }
      this.activeMenu = null;
    },

    async downloadAll() {
      try {
        const blob = await WorkSpaceAPI.downloadAllWorkspaces();
        WorkSpaceAPI.downloadFile(blob, 'all_workspaces.zip');
        this.showToast('Download started', 'success');
      } catch (e) {
        this.showToast('Download failed', 'error');
      }
    },

    copyContent() {
      if (this.activeContent) {
        navigator.clipboard.writeText(this.activeContent);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      }
    },

    filterByType(type) {
      this.selectedType = this.selectedType === type ? null : type;
    },

    handleSearch() {},

    toggleMenu(id) {
      this.activeMenu = this.activeMenu === id ? null : id;
    },

    scrollToTop() {
      document.querySelector('.ws-content')?.scrollTo(0, 0);
    },

    getTypeColor(type) {
      const t = this.documentTypes.find(d => d.value === type);
      return t?.color || '#6366f1';
    },
    getTypeBg(type) {
      const map = {
        HTML: '#fef3c7', CSS: '#dbeafe', JS: '#fef9c3', TYPESCRIPT: '#ede9fe',
        PYTHON: '#d1fae5', JAVA: '#fee2e2', C_PLUS_PLUS: '#ede9fe', C_SHARP: '#f3e8ff',
        GO: '#cffafe', RUBY: '#ffe4e6', PHP: '#ede9fe', KOTLIN: '#ffedd5',
        SQL: '#cffafe', MARKDOWN: '#f1f5f9', TEXT: '#f8fafc', NO_SQL: '#dcfce7',
      };
      return map[type] || '#f1f5f9';
    },
    getTypeText(type) {
      const t = this.documentTypes.find(d => d.value === type);
      return t?.color || '#64748b';
    },
    getExtension(type) {
      const map = { HTML: '.html', CSS: '.css', JS: '.js', TYPESCRIPT: '.ts', PYTHON: '.py', JAVA: '.java', C_PLUS_PLUS: '.cpp', C_SHARP: '.cs', GO: '.go', RUBY: '.rb', PHP: '.php', KOTLIN: '.kt', SCALA: '.scala', SWIFT: '.swift', R: '.r', SQL: '.sql', NO_SQL: '.js', MARKDOWN: '.md', TEXT: '.txt' };
      return map[type] || '.txt';
    },
    formatDate(d) {
      if (!d) return '—';
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatRelative(d) {
      if (!d) return '—';
      const diff = Date.now() - new Date(d).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1) return 'Just now';
      if (m < 60) return `${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h ago`;
      return `${Math.floor(h / 24)}d ago`;
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    }
  },

  async mounted() {
    await Promise.all([this.loadWorkspaces(), this.loadRecentActivity()]);
    document.addEventListener('click', () => { this.activeMenu = null; });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

/* ══════════════════════════ CSS VARS ══════════════════════════ */
.ws-root {
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
.ws-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ══════════════════════════ HEADER ══════════════════════════ */
.ws-header {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  height: 60px;
  position: sticky; top: 0; z-index: 200;
}
.ws-header__inner {
  height: 100%; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.ws-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; user-select: none; }
.ws-brand__icon { display: flex; filter: drop-shadow(0 2px 8px rgba(99,102,241,0.28)); }
.ws-brand__text { display: flex; flex-direction: column; line-height: 1.2; }
.ws-brand__name { font-size: 15px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; letter-spacing: -0.3px; }
.ws-brand__sub  { font-size: 10px; font-weight: 600; color: var(--ink-3); }

.ws-header__center { flex: 1; display: flex; justify-content: center; }
.ws-editor-breadcrumb {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 999px; padding: 5px 16px;
}
.ws-crumb-btn {
  display: flex; align-items: center; gap: 5px;
  background: none; border: none; color: var(--primary);
  font-size: 12px; font-weight: 600; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: opacity 0.15s;
}
.ws-crumb-btn:hover { opacity: 0.7; }
.ws-crumb-sep { color: var(--ink-4); }
.ws-crumb-current { font-size: 12px; font-weight: 700; color: var(--ink); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-editor-badge { padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-left: 2px; }
.ws-editor-badge--view     { background: var(--bg-2); color: var(--ink-2); border: 1px solid var(--border); }
.ws-editor-badge--work     { background: var(--amber-soft); color: #92400e; }
.ws-editor-badge--continue { background: var(--green-soft); color: #065f46; }

.ws-header__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

/* ══════════════════════════ BUTTONS ══════════════════════════ */
.ws-btn {
  display: inline-flex; align-items: center; gap: 7px;
  height: 36px; padding: 0 16px;
  border-radius: var(--r); font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: all 0.2s var(--ease); border: none; outline: none; white-space: nowrap;
}
.ws-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ws-btn--primary {
  background: var(--primary); color: var(--white);
  box-shadow: 0 1px 3px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
}
.ws-btn--primary:hover:not(:disabled) { background: var(--primary-dk); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.35); }
.ws-btn--primary:active:not(:disabled) { transform: translateY(0); }
.ws-btn--ghost { background: var(--white); border: 1px solid var(--border); color: var(--ink-2); box-shadow: var(--shadow-xs); }
.ws-btn--ghost:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-btn--save { background: var(--green); color: var(--white); box-shadow: 0 1px 3px rgba(16,185,129,0.3); }
.ws-btn--save:hover:not(:disabled) { background: #059669; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(16,185,129,0.35); }

.ws-icon-btn { width: 32px; height: 32px; border-radius: var(--r-sm); border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink-3); transition: all 0.15s; }
.ws-icon-btn:hover { background: var(--bg-2); color: var(--ink); }

/* ══════════════════════════ LAYOUT ══════════════════════════ */
.ws-layout { display: grid; grid-template-columns: 236px 1fr 260px; flex: 1; height: calc(100vh - 60px); overflow: hidden; }

/* ══════════════════════════ SIDEBAR ══════════════════════════ */
.ws-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 20px 14px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; gap: 22px; }

.ws-nav__label { font-size: 9.5px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding: 0 8px; }
.ws-nav__item { display: flex; align-items: center; gap: 9px; height: 38px; padding: 0 10px; border-radius: var(--r); color: var(--ink-2); font-size: 13px; font-weight: 500; text-decoration: none; cursor: pointer; transition: all 0.15s; margin-bottom: 2px; }
.ws-nav__item:hover { background: var(--bg-2); color: var(--ink); }
.ws-nav__item--active, .ws-nav__item.router-link-active { background: var(--primary-soft); color: var(--primary); font-weight: 700; box-shadow: inset 3px 0 0 var(--primary); }

.ws-stats {
  background: linear-gradient(140deg, var(--primary) 0%, var(--primary-dk) 100%);
  border-radius: var(--r-md); padding: 16px; color: var(--white);
  box-shadow: 0 4px 16px rgba(99,102,241,0.32);
  position: relative; overflow: hidden;
}
.ws-stats::after { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.07); border-radius: 50%; pointer-events: none; }
.ws-stats__title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 12px; opacity: 0.8; }
.ws-stats__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ws-stat { text-align: center; background: rgba(255,255,255,0.12); border-radius: var(--r); padding: 10px 8px; border: 1px solid rgba(255,255,255,0.1); }
.ws-stat__value { font-size: 26px; font-weight: 900; font-family: 'Fraunces', serif; line-height: 1; margin-bottom: 3px; }
.ws-stat__label { font-size: 10px; font-weight: 600; opacity: 0.8; }

.ws-filter { border: 1px solid var(--border); border-radius: var(--r-md); padding: 14px; }
.ws-filter__title { font-size: 11px; font-weight: 800; color: var(--ink); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.ws-filter__list { display: flex; flex-direction: column; gap: 1px; max-height: 260px; overflow-y: auto; }
.ws-filter__item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: var(--r-sm); font-size: 12px; color: var(--ink-2); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; text-align: left; }
.ws-filter__item:hover { background: var(--bg-2); color: var(--ink); }
.ws-filter__item.is-active { background: var(--primary-soft); color: var(--primary); font-weight: 600; }
.ws-filter__dot { width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0; }
.ws-filter__check { margin-left: auto; font-size: 10px; color: var(--primary); }

/* ══════════════════════════ CONTENT ══════════════════════════ */
.ws-content { padding: 28px; overflow-y: auto; height: 100%; background: var(--bg); }

.ws-page-header { margin-bottom: 24px; }
.ws-page-title { font-size: 28px; font-weight: 900; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; letter-spacing: -0.5px; line-height: 1.1; }
.ws-page-sub { font-size: 14px; color: var(--ink-2); }

.ws-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }

.ws-search { flex: 1; min-width: 220px; max-width: 360px; position: relative; display: flex; align-items: center; }
.ws-search > svg { position: absolute; left: 12px; color: var(--ink-3); pointer-events: none; }
.ws-search__input { width: 100%; height: 40px; padding: 0 34px 0 40px; border: 1px solid var(--border); border-radius: var(--r); font-size: 13px; font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); outline: none; transition: all 0.2s; box-shadow: var(--shadow-xs); }
.ws-search__input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.12), var(--shadow-xs); }
.ws-search__input::placeholder { color: var(--ink-4); }
.ws-search__clear { position: absolute; right: 11px; color: var(--ink-3); font-size: 11px; cursor: pointer; transition: color 0.15s; }
.ws-search__clear:hover { color: var(--ink); }

.ws-view-tabs { display: flex; gap: 2px; background: var(--bg-2); padding: 3px; border-radius: var(--r); border: 1px solid var(--border); }
.ws-view-tab { padding: 5px 14px; border: none; background: none; border-radius: 7px; font-size: 12px; font-weight: 600; color: var(--ink-3); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.ws-view-tab.active { background: var(--white); color: var(--primary); box-shadow: var(--shadow-sm); }

/* Create form */
.ws-create-form { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; margin-bottom: 20px; box-shadow: var(--shadow-md); }
.ws-create-form__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.ws-create-form__title-wrap { display: flex; align-items: center; gap: 10px; }
.ws-create-form__icon { width: 32px; height: 32px; background: var(--primary-soft); border-radius: var(--r); display: flex; align-items: center; justify-content: center; color: var(--primary); }
.ws-create-form__header h3 { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.ws-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.ws-form-group { display: flex; flex-direction: column; gap: 6px; }
.ws-form-group--full { grid-column: 1 / -1; }
.ws-form-group label { font-size: 12px; font-weight: 700; color: var(--ink); }
.ws-req { color: var(--red); margin-left: 2px; }
.ws-input { width: 100%; padding: 9px 13px; border: 1px solid var(--border); border-radius: var(--r); font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--white); outline: none; transition: all 0.2s; }
.ws-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.10); }
.ws-input::placeholder { color: var(--ink-4); }
.ws-select { cursor: pointer; }
.ws-textarea-sm { resize: vertical; min-height: 58px; }
.ws-form-actions { display: flex; gap: 8px; justify-content: flex-end; }

.ws-new-btn { display: flex; align-items: center; justify-content: center; gap: 9px; width: 100%; height: 48px; border: 2px dashed var(--border); border-radius: var(--r-md); background: var(--white); color: var(--ink-3); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; margin-bottom: 20px; }
.ws-new-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }

.ws-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; background: var(--white); border-radius: var(--r-md); border: 1px solid var(--border); gap: 14px; }
.ws-loading p { font-size: 14px; color: var(--ink-2); }
.ws-spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: ws-spin 0.65s linear infinite; }
.ws-spinner--sm { width: 22px; height: 22px; border-width: 2px; }
@keyframes ws-spin { to { transform: rotate(360deg); } }

.ws-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 340px; background: var(--white); border-radius: var(--r-md); border: 1px dashed var(--border); gap: 12px; text-align: center; padding: 48px; }
.ws-empty__icon { width: 72px; height: 72px; background: var(--bg-2); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; color: var(--ink-3); margin-bottom: 8px; }
.ws-empty h3 { font-size: 18px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.ws-empty p { font-size: 14px; color: var(--ink-2); max-width: 260px; line-height: 1.5; }

/* ══════════════════════════ CARDS ══════════════════════════ */
.ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; }

.ws-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 18px; cursor: pointer; transition: all 0.22s var(--ease); display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; box-shadow: var(--shadow-xs); }
.ws-card__accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; opacity: 0; transition: opacity 0.22s; }
.ws-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: transparent; }
.ws-card:hover .ws-card__accent { opacity: 1; }
.ws-card:hover .ws-card__quick-actions { opacity: 1; transform: translateY(0); }

.ws-card__top { display: flex; align-items: center; justify-content: space-between; }
.ws-card__type-chip { padding: 4px 10px; border-radius: var(--r-sm); font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; font-family: 'DM Mono', monospace; }

.ws-card__menu-wrap { position: relative; }
.ws-card__more { width: 30px; height: 30px; border: none; background: none; border-radius: var(--r-sm); color: var(--ink-3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.ws-card__more:hover { background: var(--bg-2); color: var(--ink); }

.ws-card__dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--shadow-xl); z-index: 100; min-width: 168px; overflow: hidden; animation: ws-drop-in 0.15s var(--ease); }
@keyframes ws-drop-in { from { opacity: 0; transform: translateY(-8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
.ws-dropdown__section { padding: 4px; }
.ws-dropdown__divider { height: 1px; background: var(--border); margin: 0; }
.ws-card__dropdown button { width: 100%; display: flex; align-items: center; gap: 9px; padding: 8px 12px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--ink); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.12s; text-align: left; border-radius: var(--r-sm); }
.ws-card__dropdown button:hover { background: var(--bg-2); }
.ws-dropdown-danger { color: var(--red) !important; }
.ws-dropdown-danger:hover { background: var(--red-soft) !important; }

.ws-card__body { flex: 1; min-width: 0; }
.ws-card__title { font-size: 15px; font-weight: 700; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 5px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-card__desc { font-size: 12px; color: var(--ink-2); line-height: 1.55; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

.ws-card__quick-actions { display: flex; gap: 6px; flex-wrap: wrap; opacity: 0; transform: translateY(6px); transition: all 0.2s var(--ease); }
.ws-qa-btn { display: flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: var(--r-sm); border: none; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.ws-qa-btn--edit   { background: var(--primary-soft); color: var(--primary); }
.ws-qa-btn--edit:hover   { background: var(--primary); color: var(--white); }
.ws-qa-btn--append { background: var(--green-soft); color: var(--green); }
.ws-qa-btn--append:hover { background: var(--green); color: var(--white); }
.ws-qa-btn--view   { background: var(--bg-2); color: var(--ink-2); border: 1px solid var(--border); }
.ws-qa-btn--view:hover   { background: var(--ink); color: var(--white); border-color: transparent; }

.ws-card__foot { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border-2); }
.ws-card__date { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-3); }
.ws-card__user { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-2); font-weight: 600; }
.ws-card__avatar { width: 18px; height: 18px; background: var(--primary-soft); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: var(--primary); }

/* ══════════════════════════ ACTIVITY ══════════════════════════ */
.ws-activity { background: var(--white); border-left: 1px solid var(--border); padding: 20px 16px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
.ws-activity__hd { margin-bottom: 16px; }
.ws-activity__hd h3 { font-size: 14px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 3px; }
.ws-activity__hd p { font-size: 11px; color: var(--ink-3); }
.ws-activity__loading { display: flex; justify-content: center; padding: 28px 0; }
.ws-activity__empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px 0; gap: 8px; color: var(--ink-3); }
.ws-activity__empty p { font-size: 12px; }
.ws-activity__list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px; flex: 1; }

.ws-activity-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r); border: 1px solid transparent; cursor: pointer; transition: all 0.15s; }
.ws-activity-item:hover { border-color: var(--border); background: var(--bg-2); }
.ws-activity-item__icon { width: 34px; height: 34px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ws-activity-item__body { flex: 1; min-width: 0; }
.ws-activity-item__name { font-size: 12px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.ws-activity-item__time { font-size: 10px; color: var(--ink-3); }
.ws-activity-item__edit { width: 26px; height: 26px; border-radius: var(--r-sm); border: none; background: none; color: var(--ink-3); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; opacity: 0; }
.ws-activity-item:hover .ws-activity-item__edit { opacity: 1; }
.ws-activity-item__edit:hover { background: var(--primary-soft); color: var(--primary); }

.ws-quick-actions { border-top: 1px solid var(--border); padding-top: 16px; margin-top: auto; }
.ws-quick-actions__label { font-size: 9.5px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
.ws-qa-action { width: 100%; display: flex; align-items: center; gap: 8px; padding: 9px 13px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink-2); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; margin-bottom: 6px; box-shadow: var(--shadow-xs); }
.ws-qa-action:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }

/* ══════════════════════════ EDITOR SHELL ══════════════════════════ */
.ws-editor-shell { display: grid; grid-template-columns: 270px 1fr; flex: 1; height: calc(100vh - 60px); overflow: hidden; }

.ws-editor-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 22px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; }
.ws-editor-type-pill { display: inline-flex; padding: 4px 11px; border-radius: var(--r-sm); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: var(--white); margin-bottom: 10px; font-family: 'DM Mono', monospace; }
.ws-editor-title { font-size: 19px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 7px; line-height: 1.25; letter-spacing: -0.3px; }
.ws-editor-desc { font-size: 13px; color: var(--ink-2); line-height: 1.55; }

.ws-editor-tabs__label { font-size: 9.5px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
.ws-editor-tab { width: 100%; display: flex; align-items: center; gap: 9px; padding: 10px 13px; margin-bottom: 5px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink-2); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; text-align: left; box-shadow: var(--shadow-xs); }
.ws-editor-tab:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-editor-tab.active { background: var(--primary); color: var(--white); border-color: var(--primary); box-shadow: 0 3px 12px rgba(99,102,241,0.30); }

.ws-editor-actions { display: flex; flex-direction: column; gap: 6px; margin-top: auto; }
.ws-editor-actions__label { font-size: 9.5px; font-weight: 800; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 2px; }
.ws-action-btn { display: flex; align-items: center; gap: 9px; padding: 9px 13px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink-2); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; box-shadow: var(--shadow-xs); }
.ws-action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-action-btn--danger { color: var(--red); }
.ws-action-btn--danger:hover { border-color: var(--red); background: var(--red-soft); color: var(--red); }

.ws-editor-main { overflow: hidden; display: flex; flex-direction: column; height: 100%; background: #0c1220; }

/* Code view pane */
.ws-view-pane { flex: 1; overflow: auto; padding: 24px; }
.ws-code-block { border-radius: var(--r-md); overflow: hidden; background: #111827; border: 1px solid #1e2d3d; box-shadow: var(--shadow-lg); }
.ws-code-block__header { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: #1a2333; border-bottom: 1px solid #1e2d3d; }
.ws-code-block__dots { display: flex; gap: 6px; }
.ws-code-block__dots span { width: 11px; height: 11px; border-radius: 50%; }
.ws-code-block__dots span:nth-child(1) { background: #ff5f57; }
.ws-code-block__dots span:nth-child(2) { background: #febc2e; }
.ws-code-block__dots span:nth-child(3) { background: #28c840; }
.ws-code-block__lang { font-size: 11px; font-weight: 600; color: #6b7fa3; text-transform: lowercase; font-family: 'DM Mono', monospace; flex: 1; }
.ws-code-copy-btn { padding: 4px 12px; background: #1e2d3d; border: 1px solid #2a3a4d; border-radius: var(--r-sm); font-size: 11px; color: #6b7fa3; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; font-weight: 600; }
.ws-code-copy-btn:hover { background: var(--primary); color: var(--white); border-color: var(--primary); }
.ws-code-pre { padding: 24px; margin: 0; overflow-x: auto; }
.ws-code-pre code { font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.75; color: #cdd6f4; white-space: pre; }

/* Edit pane */
.ws-edit-pane { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.ws-edit-pane__header { padding: 12px 20px; background: #1a2333; border-bottom: 1px solid #1e2d3d; }
.ws-edit-mode-info { display: flex; align-items: center; gap: 9px; font-size: 12px; color: #8a9abb; font-family: 'DM Sans', sans-serif; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.18); padding: 8px 12px; border-radius: var(--r-sm); }
.ws-edit-mode-info strong { color: #f5d88a; }
.ws-edit-mode-info--green { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.18); }
.ws-edit-mode-info--green strong { color: #5eead4; }

.ws-editor-split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
.ws-editor-input-panel, .ws-editor-preview-panel { display: flex; flex-direction: column; overflow: hidden; }
.ws-editor-input-panel { border-right: 1px solid #1e2d3d; }
.ws-panel-label { display: flex; align-items: center; justify-content: space-between; padding: 9px 18px; background: #1a2333; flex-shrink: 0; border-bottom: 1px solid #1e2d3d; }
.ws-panel-label > span:first-child { font-size: 11px; font-weight: 700; color: #6b7fa3; text-transform: uppercase; letter-spacing: 0.7px; }
.ws-char-count { font-size: 10px; color: #3d5570; }

.ws-textarea { flex: 1; resize: none; border: none; outline: none; background: #0c1220; color: #cdd6f4; font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.75; padding: 22px; tab-size: 2; caret-color: var(--primary-lt); }
.ws-textarea::placeholder { color: #2a3a4d; }
.ws-textarea:focus { background: #0e1524; }
.ws-preview-pre { flex: 1; margin: 0; overflow: auto; background: #0c1220; }
.ws-preview-pre code { display: block; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.75; color: #44596b; padding: 22px; white-space: pre; }

/* ══════════════════════════ TOAST ══════════════════════════ */
.ws-toast { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: var(--white); border-radius: var(--r-md); box-shadow: var(--shadow-xl); font-size: 13px; font-weight: 600; z-index: 2000; border: 1px solid var(--border); min-width: 250px; }
.ws-toast__icon { width: 28px; height: 28px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ws-toast--success { border-left: 3px solid var(--green); }
.ws-toast--success .ws-toast__icon { background: var(--green-soft); color: var(--green); }
.ws-toast--error   { border-left: 3px solid var(--red); }
.ws-toast--error   .ws-toast__icon { background: var(--red-soft); color: var(--red); }
.ws-toast-enter-active, .ws-toast-leave-active { transition: all 0.3s var(--ease); }
.ws-toast-enter-from, .ws-toast-leave-to { opacity: 0; transform: translateY(10px) scale(0.97); }

/* ══════════════════════════ RESPONSIVE ══════════════════════════ */
@media (max-width: 1200px) {
  .ws-layout { grid-template-columns: 220px 1fr; }
  .ws-activity { display: none; }
  .ws-editor-shell { grid-template-columns: 220px 1fr; }
}
@media (max-width: 900px) {
  .ws-layout { grid-template-columns: 1fr; }
  .ws-sidebar { display: none; }
  .ws-editor-shell { grid-template-columns: 1fr; }
  .ws-editor-sidebar { display: none; }
  .ws-editor-split { grid-template-columns: 1fr; }
  .ws-editor-input-panel { height: 50%; border-right: none; border-bottom: 1px solid #1e2d3d; }
}
@media (max-width: 640px) {
  .ws-form-grid { grid-template-columns: 1fr; }
  .ws-grid { grid-template-columns: 1fr; }
  .ws-header__center { display: none; }
  .ws-content { padding: 16px; }
}
</style>