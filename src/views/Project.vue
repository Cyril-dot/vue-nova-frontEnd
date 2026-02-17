<!-- Projects.vue — Enhanced with Project WorkSpace creation & management -->
<template>
  <div class="pj-root">
    <!-- Top Nav -->
    <nav class="pj-topbar">
      <div class="pj-topbar__inner">
        <div class="pj-topbar__left">
          <div class="pj-brand">
            <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <polygon points="21,10 33,16 21,22 9,16" fill="white" opacity="0.95"/>
              <rect x="13" y="25" width="16" height="7" rx="2" fill="white"/>
            </svg>
            <div class="pj-brand__text">
              <span class="pj-brand__name">NovaSpace</span>
              <span class="pj-brand__plan">Free Plan</span>
            </div>
          </div>
          <div class="pj-global-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input v-model="globalSearch" @input="handleGlobalSearch" type="text" placeholder="Search projects…" class="pj-global-search__input" />
          </div>
        </div>
        <div class="pj-topbar__right">
          <button class="pj-icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span class="pj-notif-dot"></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside class="pj-sidebar">
      <button class="pj-new-btn" @click="$router.push('/projects/create')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        New Project
      </button>
      <div class="pj-nav-section">
        <div class="pj-nav-label">MAIN</div>
        <nav class="pj-nav-list">
          <router-link to="/dashboard" class="pj-nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
            Dashboard
          </router-link>
          <router-link to="/tasks" class="pj-nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            My Tasks
          </router-link>
          <router-link to="/projects" class="pj-nav-item pj-nav-item--active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Projects
          </router-link>
          <router-link to="/workspace" class="pj-nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            WorkSpace
          </router-link>
          <router-link to="/calendar" class="pj-nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Calendar
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Main -->
    <main class="pj-main">

      <!-- ══════════ PROJECT WORKSPACE PANEL ══════════ -->
      <div v-if="projectWorkspaceMode" class="pj-ws-panel">
        <div class="pj-ws-panel__header">
          <button class="pj-btn pj-btn--ghost" @click="closeWorkspacePanel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Back to Projects
          </button>
          <div class="pj-ws-panel__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18" stroke="currentColor" stroke-width="2"/></svg>
            <span>WorkSpace — <strong>{{ activeProject?.title }}</strong></span>
          </div>
          <button class="pj-btn pj-btn--primary" @click="showCreateWsForm = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            New Workspace Doc
          </button>
        </div>

        <!-- Create workspace form -->
        <div v-if="showCreateWsForm" class="pj-ws-create-form">
          <h3>Create Workspace for {{ activeProject?.title }}</h3>
          <div class="pj-ws-form-grid">
            <div class="pj-ws-form-group">
              <label>Title <span class="pj-req">*</span></label>
              <input v-model="wsFormData.title" type="text" class="pj-input" placeholder="e.g. Main API" required />
            </div>
            <div class="pj-ws-form-group">
              <label>Doc Type <span class="pj-req">*</span></label>
              <select v-model="wsFormData.docType" class="pj-input pj-select" required>
                <option value="">Choose type…</option>
                <option v-for="t in docTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="pj-ws-form-group pj-ws-form-group--full">
              <label>Description</label>
              <textarea v-model="wsFormData.description" class="pj-input pj-textarea" rows="2" placeholder="Describe this workspace…"></textarea>
            </div>
          </div>
          <div class="pj-ws-form-actions">
            <button @click="showCreateWsForm = false; resetWsForm()" class="pj-btn pj-btn--ghost">Cancel</button>
            <button @click="createProjectWorkspace" class="pj-btn pj-btn--primary" :disabled="wsSubmitting || !wsFormData.title || !wsFormData.docType">
              {{ wsSubmitting ? 'Creating…' : 'Create' }}
            </button>
          </div>
        </div>

        <!-- Workspace Filter Tabs -->
        <div class="pj-ws-tabs">
          <button :class="['pj-ws-tab', { active: wsViewMode === 'all' }]" @click="wsViewMode='all'; loadProjectWorkspaces()">All</button>
          <button :class="['pj-ws-tab', { active: wsViewMode === 'recent' }]" @click="wsViewMode='recent'; loadProjectWorkspaces('recent')">Recent</button>
          <div class="pj-ws-tab-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input v-model="wsSearch" type="text" placeholder="Search docs…" class="pj-ws-search-input" @input="searchProjectWorkspaces" />
          </div>
          <select v-model="wsDocTypeFilter" @change="filterWorkspacesByType" class="pj-input pj-ws-type-select">
            <option value="">All Types</option>
            <option v-for="t in docTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>

        <!-- Workspace Loading -->
        <div v-if="wsLoading" class="pj-ws-loading">
          <div class="pj-spinner"></div>
          <p>Loading workspaces…</p>
        </div>

        <!-- Workspace Empty -->
        <div v-else-if="projectWorkspaces.length === 0" class="pj-ws-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <h3>No workspace docs yet</h3>
          <p>Create your first workspace document for this project</p>
          <button class="pj-btn pj-btn--primary" @click="showCreateWsForm = true">Create Workspace Doc</button>
        </div>

        <!-- Workspace Grid -->
        <div v-else class="pj-ws-grid">
          <div
            v-for="doc in projectWorkspaces"
            :key="doc.id"
            class="pj-ws-card"
          >
            <div class="pj-ws-card__top">
              <span class="pj-ws-card__type" :style="{ background: getTypeBg(doc.docType), color: getTypeColor(doc.docType) }">
                {{ doc.docType || 'TEXT' }}
              </span>
              <div class="pj-ws-card__menu-wrap" @click.stop>
                <button class="pj-ws-card__more" @click="toggleWsMenu(doc.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                </button>
                <div v-if="activeWsMenu === doc.id" class="pj-ws-card__dropdown">
                  <button @click="viewProjectWorkspaceDoc(doc)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                    View
                  </button>
                  <button @click="openProjectWsEditor(doc, 'work')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    Work in Doc
                  </button>
                  <button @click="openProjectWsEditor(doc, 'continue')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    Continue
                  </button>
                  <button @click="downloadProjectWsDoc(doc)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    Download
                  </button>
                  <button @click="deleteProjectWsDoc(doc.id)" class="pj-ws-danger">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="pj-ws-card__body" @click="viewProjectWorkspaceDoc(doc)">
              <h4 class="pj-ws-card__title">{{ doc.title }}</h4>
              <p class="pj-ws-card__desc">{{ doc.description || 'No description' }}</p>
              <pre v-if="doc.content" class="pj-ws-card__preview"><code>{{ (doc.content || '').slice(0, 120) }}{{ doc.content?.length > 120 ? '…' : '' }}</code></pre>
            </div>

            <div class="pj-ws-card__actions">
              <button class="pj-ws-qa" @click="openProjectWsEditor(doc, 'work')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Work
              </button>
              <button class="pj-ws-qa" @click="openProjectWsEditor(doc, 'continue')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Continue
              </button>
              <button class="pj-ws-qa pj-ws-qa--view" @click="viewProjectWorkspaceDoc(doc)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                View
              </button>
            </div>
          </div>
        </div>

        <!-- View / Editor Modal for Project Workspace -->
        <div v-if="wsEditorOpen" class="pj-ws-modal-overlay" @click.self="wsEditorOpen = false">
          <div class="pj-ws-modal">
            <div class="pj-ws-modal__header">
              <div>
                <span class="pj-ws-modal__type" :style="{ background: getTypeBg(activeWsDoc?.docType), color: getTypeColor(activeWsDoc?.docType) }">{{ activeWsDoc?.docType }}</span>
                <h3 class="pj-ws-modal__title">{{ activeWsDoc?.title }}</h3>
              </div>
              <div class="pj-ws-modal__tabs">
                <button :class="['pj-ws-mtab', { active: wsEditorTab === 'view' }]" @click="wsEditorTab='view'">View</button>
                <button :class="['pj-ws-mtab', { active: wsEditorTab === 'work' }]" @click="wsEditorTab='work'; wsEditorInput=''">Work</button>
                <button :class="['pj-ws-mtab', { active: wsEditorTab === 'continue' }]" @click="wsEditorTab='continue'; wsEditorInput=''">Continue</button>
              </div>
              <div class="pj-ws-modal__actions">
                <button v-if="wsEditorTab !== 'view'" class="pj-btn pj-btn--save" @click="saveProjectWsChanges" :disabled="wsEditorSaving">
                  {{ wsEditorSaving ? 'Saving…' : 'Save' }}
                </button>
                <button class="pj-btn pj-btn--ghost" @click="wsEditorOpen = false">Close</button>
              </div>
            </div>

            <div class="pj-ws-modal__body">
              <!-- View Mode -->
              <div v-if="wsEditorTab === 'view'" class="pj-ws-modal__view">
                <div class="pj-code-block">
                  <div class="pj-code-header">
                    <div class="pj-code-dots"><span></span><span></span><span></span></div>
                    <span class="pj-code-lang">{{ activeWsDoc?.docType?.toLowerCase() }}</span>
                    <button class="pj-code-copy" @click="copyWsContent">{{ wsContentCopied ? '✓ Copied' : 'Copy' }}</button>
                  </div>
                  <pre class="pj-code-pre"><code>{{ wsActiveContent || 'No content yet.' }}</code></pre>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="pj-ws-modal__edit">
                <div class="pj-ws-modal__edit-info" :class="wsEditorTab">
                  <span v-if="wsEditorTab === 'work'">⚠ Work mode replaces content inside the template</span>
                  <span v-else>＋ Continue mode appends to existing content</span>
                </div>
                <div class="pj-ws-edit-split">
                  <div class="pj-ws-edit-input">
                    <div class="pj-ws-edit-label">Your {{ wsEditorTab === 'work' ? 'Content' : 'Addition' }}</div>
                    <textarea v-model="wsEditorInput" class="pj-ws-edit-textarea" :placeholder="wsEditorTab === 'work' ? 'Write your content here…' : 'Add more content…'" spellcheck="false"></textarea>
                  </div>
                  <div class="pj-ws-edit-preview">
                    <div class="pj-ws-edit-label">Current Document</div>
                    <pre class="pj-ws-preview-code"><code>{{ wsActiveContent || 'No content yet.' }}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════ PROJECTS LIST ══════════ -->
      <template v-else>
        <header class="pj-page-header">
          <div>
            <h1 class="pj-page-title">Projects</h1>
            <p class="pj-page-sub">Manage and track your project progress</p>
          </div>
        </header>

        <!-- Toolbar -->
        <div class="pj-toolbar">
          <div class="pj-toolbar__filters">
            <select v-model="statusFilter" class="pj-status-select">
              <option value="">All Status</option>
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <div class="pj-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <input v-model="searchQuery" @input="handleSearch" @keyup.enter="performSearch" type="text" placeholder="Search projects…" class="pj-search-field" />
            </div>
            <button v-if="searchQuery" @click="performSearch" class="pj-btn pj-btn--primary">Search</button>
          </div>
          <div class="pj-view-switcher">
            <button :class="['pj-view-btn', { active: viewMode === 'grid' }]" @click="viewMode='grid'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
            </button>
            <button :class="['pj-view-btn', { active: viewMode === 'list' }]" @click="viewMode='list'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="pj-state pj-state--loading">
          <div class="pj-spinner"></div>
          <p>Loading projects…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="pj-state pj-state--error">
          <p>{{ error }}</p>
          <button @click="loadProjects" class="pj-btn pj-btn--primary">Try Again</button>
        </div>

        <!-- Empty -->
        <div v-else-if="projects.length === 0" class="pj-state pj-state--empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <h3>No projects found</h3>
          <p>{{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'Create your first project' }}</p>
          <button v-if="!searchQuery && !statusFilter" class="pj-btn pj-btn--primary" @click="$router.push('/projects/create')">New Project</button>
        </div>

        <!-- Grid -->
        <div v-else-if="viewMode === 'grid'" class="pj-grid">
          <div v-for="project in projects" :key="project.id" class="pj-card" @click="navigateToProject(project.id)">
            <div class="pj-card__head">
              <div class="pj-card__icon" :class="`pj-card__icon--${project.theme}`">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div class="pj-card__menu-wrap" @click.stop>
                <button class="pj-card__more" @click="toggleMenu(project.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                </button>
                <div v-if="activeMenu === project.id" class="pj-card__dropdown">
                  <button @click="openWorkspacePanel(project)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2"/></svg>
                    Open WorkSpace
                  </button>
                  <button @click="editProject(project)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    Edit
                  </button>
                  <button @click="deleteProject(project.id)" class="pj-danger">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="pj-card__body">
              <h3 class="pj-card__title">{{ project.title }}</h3>
              <p class="pj-card__desc">{{ project.description || 'No description' }}</p>
              <div class="pj-card__meta">
                <span class="pj-status-tag" :class="`pj-status-tag--${project.statusClass}`">{{ formatStatus(project.status) }}</span>
                <span class="pj-due">Due: {{ formatDate(project.endDate) }}</span>
              </div>
            </div>

            <!-- Workspace shortcut button -->
            <button class="pj-card__ws-btn" @click.stop="openWorkspacePanel(project)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              WorkSpace
            </button>

            <div class="pj-card__progress">
              <div class="pj-progress-hd">
                <span>Progress</span>
                <span class="pj-progress-pct">{{ project.progress }}%</span>
              </div>
              <div class="pj-progress-track">
                <div class="pj-progress-bar" :class="`pj-progress-bar--${project.theme}`" :style="{ width: project.progress + '%' }"></div>
              </div>
            </div>

            <div class="pj-card__foot">
              <div class="pj-avatars">
                <div v-for="(m, i) in project.team?.slice(0, 3)" :key="i" class="pj-avatar" :style="{ background: m.color }">{{ m.initials }}</div>
              </div>
              <span class="pj-doc-count" v-if="project.documentCount > 0">{{ project.documentCount }} docs</span>
            </div>
          </div>
        </div>

        <!-- List -->
        <div v-else class="pj-list">
          <div v-for="project in projects" :key="project.id" class="pj-list-row" @click="navigateToProject(project.id)">
            <div class="pj-list-icon" :class="`pj-list-icon--${project.theme}`">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div class="pj-list-body">
              <div class="pj-list-info">
                <h3 class="pj-list-title">{{ project.title }}</h3>
                <p class="pj-list-desc">{{ project.description || 'No description' }}</p>
              </div>
              <div class="pj-list-meta">
                <span class="pj-status-tag" :class="`pj-status-tag--${project.statusClass}`">{{ formatStatus(project.status) }}</span>
                <span class="pj-due">{{ formatDate(project.endDate) }}</span>
                <button class="pj-list-ws-btn" @click.stop="openWorkspacePanel(project)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2"/></svg>
                  WorkSpace
                </button>
              </div>
              <div class="pj-list-progress">
                <div class="pj-progress-track">
                  <div class="pj-progress-bar" :class="`pj-progress-bar--${project.theme}`" :style="{ width: project.progress + '%' }"></div>
                </div>
                <span class="pj-progress-pct">{{ project.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Toast -->
    <transition name="pj-toast">
      <div v-if="toast.show" :class="['pj-toast', `pj-toast--${toast.type}`]">
        <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import ProjectsAPI from '@/utils/projectsApi';
import WorkSpaceAPI from '@/utils/workspaceApi';

// NOTE: ProjectWorkSpaceService calls require a separate API wrapper.
// Below we build the calls matching ProjectWorkSpaceController endpoints.
const ProjectWorkSpaceAPI = {
  async createWorkspace(projectId, data) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/create/${projectId}`, { method: 'POST', body: JSON.stringify(data) });
    return r.json();
  },
  async createTemplate(projectId, docId, docType) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/template/${projectId}/${docId}?docType=${docType}`, { method: 'POST' });
    return r.json();
  },
  async viewDoc(projectId, docId) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/view/${projectId}/${docId}`, { method: 'GET' });
    return r.json();
  },
  async workInDoc(projectId, docId, content) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/work/${projectId}/${docId}`, { method: 'PUT', body: JSON.stringify({ content }) });
    return r.json();
  },
  async continueDoc(projectId, docId, content) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/continue/${projectId}/${docId}`, { method: 'PATCH', body: JSON.stringify({ content }) });
    return r.json();
  },
  async deleteDoc(projectId, docId) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/delete/${projectId}/${docId}`, { method: 'DELETE' });
    return r.text();
  },
  async downloadDoc(projectId, docId) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/download/${projectId}/${docId}`, { method: 'GET' });
    return r.blob();
  },
  async getRecent(projectId) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/recent/${projectId}`, { method: 'GET' });
    return r.json();
  },
  async getByType(projectId, docType) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/by-type/${projectId}?docType=${docType}`, { method: 'GET' });
    return r.json();
  },
  async search(projectId, keyword) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/search/${projectId}?keyword=${encodeURIComponent(keyword)}`, { method: 'GET' });
    return r.json();
  },
  async downloadAll(projectId) {
    const { apiRequest } = await import('@/utils/apiService');
    const r = await apiRequest(`/v1/project/workspace/download-all/${projectId}`, { method: 'GET' });
    return r.blob();
  },
};

export default {
  name: 'Projects',
  data() {
    return {
      projects: [], loading: true, error: null,
      searchQuery: '', globalSearch: '', statusFilter: '', viewMode: 'grid',
      activeMenu: null,
      searchTimeout: null,
      projectColors: ['#8b5cf6','#3b82f6','#10b981','#f59e0b','#ec4899','#06b6d4'],

      // Project Workspace Panel
      projectWorkspaceMode: false,
      activeProject: null,
      projectWorkspaces: [],
      wsLoading: false,
      wsViewMode: 'all',
      wsSearch: '',
      wsDocTypeFilter: '',
      showCreateWsForm: false,
      wsFormData: { title: '', description: '', docType: '' },
      wsSubmitting: false,
      activeWsMenu: null,

      // WS Editor Modal
      wsEditorOpen: false,
      activeWsDoc: null,
      wsActiveContent: '',
      wsEditorTab: 'view',
      wsEditorInput: '',
      wsEditorSaving: false,
      wsContentCopied: false,

      docTypes: [
        { label: 'HTML', value: 'HTML' }, { label: 'CSS', value: 'CSS' },
        { label: 'JavaScript', value: 'JS' }, { label: 'TypeScript', value: 'TYPESCRIPT' },
        { label: 'Python', value: 'PYTHON' }, { label: 'Java', value: 'JAVA' },
        { label: 'C++', value: 'C_PLUS_PLUS' }, { label: 'C#', value: 'C_SHARP' },
        { label: 'Go', value: 'GO' }, { label: 'Ruby', value: 'RUBY' },
        { label: 'PHP', value: 'PHP' }, { label: 'Kotlin', value: 'KOTLIN' },
        { label: 'SQL', value: 'SQL' }, { label: 'Markdown', value: 'MARKDOWN' },
        { label: 'Text', value: 'TEXT' },
      ],

      toast: { show: false, message: '', type: 'success' }
    };
  },

  watch: {
    statusFilter() { this.loadProjects(); }
  },

  methods: {
    /* ── PROJECTS ── */
    async loadProjects() {
      try {
        this.loading = true; this.error = null;
        const data = await ProjectsAPI.getAllProjects({ status: this.statusFilter, includeDocuments: false });
        this.projects = (data.projects || []).map((p, i) => ({
          ...p,
          theme: ['purple','blue','green','orange','pink','cyan'][i % 6],
          progress: this.calcProgress(p.startDate, p.endDate),
          statusClass: { PLANNING:'planning', ACTIVE:'active', IN_PROGRESS:'in-progress', COMPLETED:'completed', ARCHIVED:'archived' }[p.status] || 'active',
          team: Array.from({ length: 3 }, () => ({
            initials: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)] + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)],
            color: this.projectColors[Math.floor(Math.random()*6)]
          })),
          documentCount: p.documentCount || 0
        }));
      } catch (e) {
        this.error = e.message || 'Failed to load projects';
        this.projects = [];
      } finally { this.loading = false; }
    },

    async deleteProject(id) {
      if (!confirm('Delete this project?')) return;
      try {
        await ProjectsAPI.deleteProject(id);
        this.showToast('Project deleted', 'success');
        await this.loadProjects();
      } catch (e) { this.showToast(e.message || 'Delete failed', 'error'); }
      this.activeMenu = null;
    },

    async performSearch() {
      if (!this.searchQuery.trim()) { await this.loadProjects(); return; }
      try {
        this.loading = true;
        const data = await ProjectsAPI.searchProjects(this.searchQuery);
        this.projects = (data.projects || []).map((p, i) => ({ ...p, theme: ['purple','blue','green','orange','pink','cyan'][i % 6], progress: this.calcProgress(p.startDate, p.endDate), statusClass: { PLANNING:'planning', ACTIVE:'active', IN_PROGRESS:'in-progress', COMPLETED:'completed', ARCHIVED:'archived' }[p.status] || 'active', team: [], documentCount: p.documentCount || 0 }));
      } catch (e) { this.error = e.message; } finally { this.loading = false; }
    },

    handleSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => { if (this.searchQuery.length >= 3 || this.searchQuery.length === 0) this.performSearch(); }, 500); },
    handleGlobalSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => { this.searchQuery = this.globalSearch; this.performSearch(); }, 500); },
    editProject(p) { this.$router.push(`/projects/${p.id}/edit`); this.activeMenu = null; },
    navigateToProject(id) { this.$router.push(`/projects/${id}`); },
    toggleMenu(id) { this.activeMenu = this.activeMenu === id ? null : id; },

    /* ── PROJECT WORKSPACE ── */
    openWorkspacePanel(project) {
      this.activeProject = project;
      this.projectWorkspaceMode = true;
      this.activeMenu = null;
      this.loadProjectWorkspaces();
    },

    closeWorkspacePanel() {
      this.projectWorkspaceMode = false;
      this.activeProject = null;
      this.projectWorkspaces = [];
      this.wsEditorOpen = false;
      this.showCreateWsForm = false;
    },

    async loadProjectWorkspaces(mode = 'all') {
      try {
        this.wsLoading = true;
        let data;
        if (mode === 'recent') {
          data = await ProjectWorkSpaceAPI.getRecent(this.activeProject.id);
        } else {
          data = await ProjectWorkSpaceAPI.getRecent(this.activeProject.id);
        }
        this.projectWorkspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load workspace docs', 'error');
        this.projectWorkspaces = [];
      } finally { this.wsLoading = false; }
    },

    async createProjectWorkspace() {
      try {
        this.wsSubmitting = true;
        const created = await ProjectWorkSpaceAPI.createWorkspace(this.activeProject.id, this.wsFormData);
        if (created?.id) {
          await ProjectWorkSpaceAPI.createTemplate(this.activeProject.id, created.id, this.wsFormData.docType);
        }
        this.showToast('Workspace created!', 'success');
        this.showCreateWsForm = false;
        this.resetWsForm();
        await this.loadProjectWorkspaces();
      } catch (e) {
        this.showToast('Failed to create workspace', 'error');
      } finally { this.wsSubmitting = false; }
    },

    resetWsForm() { this.wsFormData = { title: '', description: '', docType: '' }; },

    async viewProjectWorkspaceDoc(doc) {
      try {
        const data = await ProjectWorkSpaceAPI.viewDoc(this.activeProject.id, doc.id);
        this.activeWsDoc = { ...doc, title: data.title || doc.title, description: data.description || doc.description };
        this.wsActiveContent = data.content || '';
        this.wsEditorTab = 'view';
        this.wsEditorInput = '';
        this.wsEditorOpen = true;
        this.activeWsMenu = null;
      } catch (e) { this.showToast('Failed to load doc', 'error'); }
    },

    openProjectWsEditor(doc, tab) {
      this.viewProjectWorkspaceDoc(doc).then(() => { this.wsEditorTab = tab; this.wsEditorInput = ''; });
    },

    async saveProjectWsChanges() {
      if (!this.wsEditorInput.trim()) { this.showToast('Please enter content first', 'error'); return; }
      try {
        this.wsEditorSaving = true;
        if (this.wsEditorTab === 'work') {
          await ProjectWorkSpaceAPI.workInDoc(this.activeProject.id, this.activeWsDoc.id, this.wsEditorInput);
        } else {
          await ProjectWorkSpaceAPI.continueDoc(this.activeProject.id, this.activeWsDoc.id, this.wsEditorInput);
        }
        const fresh = await ProjectWorkSpaceAPI.viewDoc(this.activeProject.id, this.activeWsDoc.id);
        this.wsActiveContent = fresh.content || '';
        this.wsEditorTab = 'view';
        this.wsEditorInput = '';
        this.showToast('Saved successfully!', 'success');
        await this.loadProjectWorkspaces();
      } catch (e) { this.showToast('Save failed', 'error'); } finally { this.wsEditorSaving = false; }
    },

    async deleteProjectWsDoc(id) {
      if (!confirm('Delete this workspace document?')) return;
      try {
        await ProjectWorkSpaceAPI.deleteDoc(this.activeProject.id, id);
        this.projectWorkspaces = this.projectWorkspaces.filter(d => d.id !== id);
        this.showToast('Deleted', 'success');
      } catch (e) { this.showToast('Delete failed', 'error'); }
      this.activeWsMenu = null;
    },

    async downloadProjectWsDoc(doc) {
      try {
        const blob = await ProjectWorkSpaceAPI.downloadDoc(this.activeProject.id, doc.id);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${doc.title || 'workspace'}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
        this.showToast('Download started', 'success');
      } catch (e) { this.showToast('Download failed', 'error'); }
      this.activeWsMenu = null;
    },

    async filterWorkspacesByType() {
      if (!this.wsDocTypeFilter) { await this.loadProjectWorkspaces(); return; }
      try {
        this.wsLoading = true;
        const data = await ProjectWorkSpaceAPI.getByType(this.activeProject.id, this.wsDocTypeFilter);
        this.projectWorkspaces = Array.isArray(data) ? data : [];
      } catch (e) { this.showToast('Filter failed', 'error'); } finally { this.wsLoading = false; }
    },

    async searchProjectWorkspaces() {
      if (!this.wsSearch.trim()) { await this.loadProjectWorkspaces(); return; }
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        try {
          this.wsLoading = true;
          const data = await ProjectWorkSpaceAPI.search(this.activeProject.id, this.wsSearch);
          this.projectWorkspaces = Array.isArray(data) ? data : [];
        } catch (e) { this.showToast('Search failed', 'error'); } finally { this.wsLoading = false; }
      }, 400);
    },

    copyWsContent() {
      if (this.wsActiveContent) { navigator.clipboard.writeText(this.wsActiveContent); this.wsContentCopied = true; setTimeout(() => { this.wsContentCopied = false; }, 2000); }
    },
    toggleWsMenu(id) { this.activeWsMenu = this.activeWsMenu === id ? null : id; },

    /* ── UTILS ── */
    getTypeBg(type) {
      const m = { HTML:'#fef3c7', CSS:'#dbeafe', JS:'#fef9c3', TYPESCRIPT:'#ede9fe', PYTHON:'#d1fae5', JAVA:'#fee2e2', C_PLUS_PLUS:'#ede9fe', C_SHARP:'#f3e8ff', GO:'#cffafe', RUBY:'#ffe4e6', PHP:'#ede9fe', KOTLIN:'#ffedd5', SQL:'#cffafe', MARKDOWN:'#f1f5f9', TEXT:'#f8fafc' };
      return m[type] || '#f1f5f9';
    },
    getTypeColor(type) {
      const m = { HTML:'#92400e', CSS:'#1e40af', JS:'#78350f', TYPESCRIPT:'#4338ca', PYTHON:'#065f46', JAVA:'#991b1b', C_PLUS_PLUS:'#6b21a8', C_SHARP:'#7e22ce', GO:'#0e7490', RUBY:'#9f1239', PHP:'#5b21b6', KOTLIN:'#c2410c', SQL:'#0891b2', MARKDOWN:'#475569', TEXT:'#64748b' };
      return m[type] || '#64748b';
    },
    calcProgress(s, e) {
      if (!s || !e) return Math.floor(Math.random() * 60) + 20;
      const now = Date.now(), start = new Date(s).getTime(), end = new Date(e).getTime();
      if (now < start) return 5;
      if (now > end) return 100;
      return Math.round(((now - start) / (end - start)) * 100);
    },
    formatDate(d) { if (!d) return 'No deadline'; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); },
    formatStatus(s) { if (!s) return 'Unknown'; return s.replace(/_/g, ' '); },
    showToast(message, type = 'success') { this.toast = { show: true, message, type }; setTimeout(() => { this.toast.show = false; }, 3200); }
  },

  async mounted() {
    await this.loadProjects();
    document.addEventListener('click', () => { this.activeMenu = null; this.activeWsMenu = null; });
  },
  beforeUnmount() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Fraunces:wght@700;800&display=swap');

/* ══════════════════════ ROOT ══════════════════════ */
.pj-root {
  --ink: #0f172a; --ink-2: #475569; --ink-3: #94a3b8;
  --border: #e2e8f0; --bg: #f8fafc; --white: #ffffff;
  --primary: #6366f1; --primary-dk: #4f46e5; --primary-soft: #eef2ff;
  --green: #10b981; --red: #ef4444; --amber: #f59e0b;
  --r: 12px; --ease: cubic-bezier(0.22,1,0.36,1);
  --shadow-sm: 0 1px 3px rgba(15,23,42,0.07);
  --shadow-md: 0 4px 14px rgba(15,23,42,0.10);
  --shadow-lg: 0 10px 28px rgba(15,23,42,0.13);
  --topbar-h: 58px;
  --sidebar-w: 220px;

  min-height: 100vh; background: var(--bg);
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
  display: grid;
  grid-template-areas: "nav nav" "sidebar main";
  grid-template-rows: var(--topbar-h) 1fr;
  grid-template-columns: var(--sidebar-w) 1fr;
}
.pj-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* TOPBAR */
.pj-topbar { grid-area: nav; background: var(--white); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; height: var(--topbar-h); }
.pj-topbar__inner { height: 100%; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; }
.pj-topbar__left { display: flex; align-items: center; gap: 20px; flex: 1; max-width: 60%; }
.pj-brand { display: flex; align-items: center; gap: 10px; padding-right: 20px; border-right: 1px solid var(--border); }
.pj-brand__text { display: flex; flex-direction: column; }
.pj-brand__name { font-size: 14px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; line-height: 1.2; }
.pj-brand__plan { font-size: 10px; font-weight: 600; color: var(--ink-2); }
.pj-global-search { flex: 1; max-width: 360px; position: relative; display: flex; align-items: center; }
.pj-global-search svg { position: absolute; left: 12px; color: var(--ink-3); pointer-events: none; }
.pj-global-search__input { width: 100%; height: 38px; padding: 0 12px 0 36px; border: 1px solid var(--border); border-radius: 9px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--bg); outline: none; transition: all 0.2s; }
.pj-global-search__input:focus { border-color: var(--primary); background: var(--white); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.pj-topbar__right { display: flex; align-items: center; gap: 10px; }
.pj-icon-btn { position: relative; width: 38px; height: 38px; border: 1px solid var(--border); background: var(--white); border-radius: 9px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: var(--ink-2); }
.pj-icon-btn:hover { border-color: var(--primary); color: var(--primary); }
.pj-notif-dot { position: absolute; top: 9px; right: 9px; width: 6px; height: 6px; background: var(--red); border-radius: 50%; border: 1.5px solid var(--white); }

/* SIDEBAR */
.pj-sidebar { grid-area: sidebar; background: var(--white); border-right: 1px solid var(--border); padding: 16px 12px; position: sticky; top: var(--topbar-h); align-self: start; height: calc(100vh - var(--topbar-h)); overflow-y: auto; }
.pj-new-btn { width: 100%; height: 38px; background: linear-gradient(135deg, var(--primary), var(--primary-dk)); color: var(--white); border: none; border-radius: 9px; font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; margin-bottom: 18px; transition: all 0.25s var(--ease); }
.pj-new-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
.pj-nav-section { margin-bottom: 16px; }
.pj-nav-label { font-size: 10px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding: 0 8px; }
.pj-nav-list { display: flex; flex-direction: column; gap: 2px; }
.pj-nav-item { display: flex; align-items: center; gap: 9px; height: 36px; padding: 0 10px; border-radius: 9px; color: var(--ink-2); font-size: 13px; font-weight: 500; text-decoration: none; transition: all 0.15s; cursor: pointer; }
.pj-nav-item:hover { background: var(--bg); color: var(--ink); }
.pj-nav-item--active, .pj-nav-item.router-link-active { background: var(--primary-soft); color: var(--primary); font-weight: 700; }

/* MAIN */
.pj-main { grid-area: main; padding: 28px; overflow-y: auto; max-height: calc(100vh - var(--topbar-h)); }

/* BUTTONS */
.pj-btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 16px; border-radius: 9px; font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s var(--ease); border: none; outline: none; }
.pj-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pj-btn--primary { background: var(--primary); color: var(--white); }
.pj-btn--primary:hover:not(:disabled) { background: var(--primary-dk); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
.pj-btn--ghost { background: var(--white); border: 1px solid var(--border); color: var(--ink); }
.pj-btn--ghost:hover { border-color: var(--primary); color: var(--primary); }
.pj-btn--save { background: var(--green); color: var(--white); }
.pj-btn--save:hover:not(:disabled) { background: #059669; }

/* PAGE HEADER */
.pj-page-header { margin-bottom: 24px; }
.pj-page-title { font-size: 26px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; }
.pj-page-sub { font-size: 14px; color: var(--ink-2); }

/* TOOLBAR */
.pj-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
.pj-toolbar__filters { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 280px; flex-wrap: wrap; }
.pj-status-select { height: 38px; padding: 0 32px 0 12px; border: 1px solid var(--border); border-radius: 9px; font-size: 13px; font-weight: 500; color: var(--ink); background: var(--white); font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; min-width: 140px; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
.pj-search-wrap { position: relative; flex: 1; max-width: 360px; }
.pj-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-3); pointer-events: none; }
.pj-search-field { width: 100%; height: 38px; padding: 0 12px 0 36px; border: 1px solid var(--border); border-radius: 9px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--white); outline: none; transition: all 0.2s; }
.pj-search-field:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.pj-view-switcher { display: flex; gap: 4px; background: var(--bg); padding: 3px; border-radius: 9px; border: 1px solid var(--border); }
.pj-view-btn { width: 36px; height: 32px; border: none; background: none; border-radius: 7px; color: var(--ink-3); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
.pj-view-btn.active { background: var(--white); color: var(--primary); box-shadow: var(--shadow-sm); }

/* STATES */
.pj-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; background: var(--white); border-radius: var(--r); border: 1px solid var(--border); gap: 12px; text-align: center; }
.pj-state--loading .pj-spinner, .pj-spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: pj-spin 0.7s linear infinite; }
@keyframes pj-spin { to { transform: rotate(360deg); } }
.pj-state p, .pj-state h3 { color: var(--ink-2); }
.pj-state--error p { color: var(--red); }
.pj-state--empty svg { color: var(--ink-3); opacity: 0.3; }
.pj-state--empty h3 { font-size: 18px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.pj-state--empty p { color: var(--ink-2); }

/* GRID */
.pj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.pj-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r); padding: 18px; cursor: pointer; transition: all 0.25s var(--ease); display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; }
.pj-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--primary); opacity: 0; transition: opacity 0.2s; }
.pj-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: transparent; }
.pj-card:hover::after { opacity: 1; }
.pj-card__head { display: flex; align-items: center; justify-content: space-between; }
.pj-card__icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pj-card__icon--purple { background: #ede9fe; color: #7c3aed; }
.pj-card__icon--blue   { background: #dbeafe; color: #1d4ed8; }
.pj-card__icon--green  { background: #d1fae5; color: #059669; }
.pj-card__icon--orange { background: #fef3c7; color: #d97706; }
.pj-card__icon--pink   { background: #fce7f3; color: #db2777; }
.pj-card__icon--cyan   { background: #cffafe; color: #0891b2; }
.pj-card__menu-wrap { position: relative; }
.pj-card__more { width: 30px; height: 30px; border: none; background: none; border-radius: 7px; color: var(--ink-3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.pj-card__more:hover { background: var(--bg); color: var(--ink); }
.pj-card__dropdown, .pj-ws-card__dropdown { position: absolute; top: calc(100% + 4px); right: 0; background: var(--white); border: 1px solid var(--border); border-radius: 10px; box-shadow: var(--shadow-lg); z-index: 100; min-width: 165px; overflow: hidden; animation: pj-drop 0.15s var(--ease); }
@keyframes pj-drop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.pj-card__dropdown button, .pj-ws-card__dropdown button { width: 100%; display: flex; align-items: center; gap: 9px; padding: 9px 14px; border: none; background: none; font-size: 13px; font-weight: 500; color: var(--ink); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; text-align: left; }
.pj-card__dropdown button:hover, .pj-ws-card__dropdown button:hover { background: var(--bg); }
.pj-danger, .pj-ws-danger { color: var(--red) !important; }
.pj-danger:hover, .pj-ws-danger:hover { background: #fee2e2 !important; }

.pj-card__body { flex: 1; }
.pj-card__title { font-size: 15px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 5px; line-height: 1.3; }
.pj-card__desc { font-size: 12px; color: var(--ink-2); line-height: 1.5; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pj-card__meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* Workspace shortcut button on card */
.pj-card__ws-btn { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 7px; border: 1px solid var(--border); background: var(--white); color: var(--ink-2); font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; align-self: flex-start; }
.pj-card__ws-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }

.pj-status-tag { padding: 4px 9px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
.pj-status-tag--planning    { background: #fef3c7; color: #92400e; }
.pj-status-tag--active      { background: #d1fae5; color: #065f46; }
.pj-status-tag--in-progress { background: #dbeafe; color: #1e40af; }
.pj-status-tag--completed   { background: var(--primary-soft); color: var(--primary-dk); }
.pj-status-tag--archived    { background: #f1f5f9; color: #64748b; }
.pj-due { font-size: 12px; color: var(--ink-2); }

.pj-card__progress { }
.pj-progress-hd { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; }
.pj-progress-pct { font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.pj-progress-track { height: 7px; background: var(--border); border-radius: 10px; overflow: hidden; }
.pj-progress-bar { height: 100%; border-radius: 10px; transition: width 0.6s var(--ease); }
.pj-progress-bar--purple { background: linear-gradient(90deg, #8b5cf6, #6d28d9); }
.pj-progress-bar--blue   { background: linear-gradient(90deg, var(--primary), var(--primary-dk)); }
.pj-progress-bar--green  { background: linear-gradient(90deg, var(--green), #059669); }
.pj-progress-bar--orange { background: linear-gradient(90deg, var(--amber), #d97706); }
.pj-progress-bar--pink   { background: linear-gradient(90deg, #ec4899, #db2777); }
.pj-progress-bar--cyan   { background: linear-gradient(90deg, #06b6d4, #0891b2); }

.pj-card__foot { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 10px; }
.pj-avatars { display: flex; gap: 4px; }
.pj-avatar { width: 26px; height: 26px; border-radius: 7px; color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; border: 2px solid var(--white); font-family: 'Fraunces', serif; }
.pj-doc-count { font-size: 12px; color: var(--ink-2); font-weight: 600; }

/* LIST VIEW */
.pj-list { display: flex; flex-direction: column; gap: 12px; }
.pj-list-row { background: var(--white); border: 1px solid var(--border); border-radius: var(--r); padding: 16px 20px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s var(--ease); }
.pj-list-row:hover { box-shadow: var(--shadow-md); border-color: transparent; }
.pj-list-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pj-list-icon--purple { background: #ede9fe; color: #7c3aed; }
.pj-list-icon--blue   { background: #dbeafe; color: #1d4ed8; }
.pj-list-icon--green  { background: #d1fae5; color: #059669; }
.pj-list-icon--orange { background: #fef3c7; color: #d97706; }
.pj-list-icon--pink   { background: #fce7f3; color: #db2777; }
.pj-list-icon--cyan   { background: #cffafe; color: #0891b2; }
.pj-list-body { flex: 1; display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center; min-width: 0; }
.pj-list-info { min-width: 0; }
.pj-list-title { font-size: 15px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pj-list-desc { font-size: 12px; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pj-list-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pj-list-ws-btn { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--white); color: var(--ink-2); font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; white-space: nowrap; }
.pj-list-ws-btn:hover { border-color: var(--primary); color: var(--primary); }
.pj-list-progress { display: flex; align-items: center; gap: 10px; min-width: 160px; }
.pj-list-progress .pj-progress-track { flex: 1; height: 6px; }

/* ══════════════════ PROJECT WORKSPACE PANEL ══════════════════ */
.pj-ws-panel { }
.pj-ws-panel__header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.pj-ws-panel__title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--ink); flex: 1; }
.pj-ws-panel__title strong { color: var(--primary); }

/* Create WS Form */
.pj-ws-create-form { background: var(--white); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-sm); }
.pj-ws-create-form h3 { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 16px; }
.pj-ws-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.pj-ws-form-group { display: flex; flex-direction: column; gap: 6px; }
.pj-ws-form-group--full { grid-column: 1 / -1; }
.pj-ws-form-group label { font-size: 12px; font-weight: 700; color: var(--ink); }
.pj-req { color: var(--red); }
.pj-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--white); outline: none; transition: all 0.2s; }
.pj-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.pj-select { cursor: pointer; }
.pj-textarea { resize: vertical; min-height: 56px; }
.pj-ws-form-actions { display: flex; gap: 8px; justify-content: flex-end; }

/* Workspace tabs/filters */
.pj-ws-tabs { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.pj-ws-tab { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--white); font-size: 12px; font-weight: 700; color: var(--ink-2); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.pj-ws-tab.active { background: var(--primary); color: var(--white); border-color: var(--primary); }
.pj-ws-tab-search { position: relative; flex: 1; min-width: 160px; max-width: 240px; display: flex; align-items: center; }
.pj-ws-tab-search svg { position: absolute; left: 10px; color: var(--ink-3); pointer-events: none; }
.pj-ws-search-input { width: 100%; height: 34px; padding: 0 10px 0 32px; border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--white); outline: none; transition: all 0.2s; }
.pj-ws-search-input:focus { border-color: var(--primary); }
.pj-ws-type-select { height: 34px; padding: 0 28px 0 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 12px; color: var(--ink); background: var(--white); font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; min-width: 110px; }

/* WS Loading/Empty */
.pj-ws-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; background: var(--white); border-radius: var(--r); border: 1px solid var(--border); gap: 10px; }
.pj-ws-loading p { font-size: 13px; color: var(--ink-2); }
.pj-ws-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px; background: var(--white); border-radius: var(--r); border: 1px solid var(--border); gap: 10px; text-align: center; padding: 32px; }
.pj-ws-empty svg { color: var(--ink-3); opacity: 0.3; }
.pj-ws-empty h3 { font-size: 18px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.pj-ws-empty p { font-size: 13px; color: var(--ink-2); }

/* WS Grid */
.pj-ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.pj-ws-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r); padding: 16px; display: flex; flex-direction: column; gap: 10px; position: relative; transition: all 0.2s var(--ease); }
.pj-ws-card:hover { box-shadow: var(--shadow-md); border-color: var(--primary); }
.pj-ws-card__top { display: flex; align-items: center; justify-content: space-between; }
.pj-ws-card__type { padding: 3px 9px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Mono', monospace; }
.pj-ws-card__menu-wrap { position: relative; }
.pj-ws-card__more { width: 26px; height: 26px; border: none; background: none; border-radius: 6px; color: var(--ink-3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.pj-ws-card__more:hover { background: var(--bg); color: var(--ink); }
.pj-ws-card__body { flex: 1; cursor: pointer; }
.pj-ws-card__title { font-size: 14px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pj-ws-card__desc { font-size: 12px; color: var(--ink-2); margin-bottom: 8px; }
.pj-ws-card__preview { background: #f8fafc; border-radius: 6px; padding: 8px 10px; margin-top: 6px; font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.5; color: var(--ink-2); overflow: hidden; max-height: 60px; }
.pj-ws-card__preview code { display: block; }
.pj-ws-card__actions { display: flex; gap: 6px; }
.pj-ws-qa { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 7px; border: none; background: var(--primary-soft); color: var(--primary); font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.pj-ws-qa:hover { background: var(--primary); color: var(--white); }
.pj-ws-qa--view { background: #f0fdf4; color: var(--green); }
.pj-ws-qa--view:hover { background: var(--green); color: var(--white); }

/* WS Editor Modal */
.pj-ws-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 24px; animation: pj-fade 0.2s ease; }
@keyframes pj-fade { from { opacity: 0; } to { opacity: 1; } }
.pj-ws-modal { background: var(--white); border-radius: 16px; width: 100%; max-width: 900px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: var(--shadow-lg); overflow: hidden; animation: pj-slide 0.25s var(--ease); }
@keyframes pj-slide { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.pj-ws-modal__header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); background: #fafbfc; flex-wrap: wrap; }
.pj-ws-modal__type { display: inline-block; padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'DM Mono', monospace; margin-bottom: 4px; }
.pj-ws-modal__title { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.pj-ws-modal__tabs { display: flex; gap: 3px; background: var(--bg); padding: 3px; border-radius: 8px; border: 1px solid var(--border); margin-left: auto; }
.pj-ws-mtab { padding: 5px 12px; border: none; background: none; border-radius: 6px; font-size: 12px; font-weight: 700; color: var(--ink-2); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.pj-ws-mtab.active { background: var(--white); color: var(--primary); box-shadow: var(--shadow-sm); }
.pj-ws-modal__actions { display: flex; gap: 8px; }
.pj-ws-modal__body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

/* Modal View Mode */
.pj-ws-modal__view { flex: 1; overflow: auto; padding: 20px; background: #0f172a; }
.pj-code-block { border-radius: 10px; overflow: hidden; }
.pj-code-header { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: #1e293b; border-bottom: 1px solid #334155; }
.pj-code-dots { display: flex; gap: 5px; }
.pj-code-dots span { width: 10px; height: 10px; border-radius: 50%; }
.pj-code-dots span:nth-child(1) { background: #ef4444; }
.pj-code-dots span:nth-child(2) { background: #f59e0b; }
.pj-code-dots span:nth-child(3) { background: #10b981; }
.pj-code-lang { font-size: 11px; font-weight: 600; color: #94a3b8; flex: 1; font-family: 'DM Mono', monospace; }
.pj-code-copy { padding: 4px 10px; background: #334155; border: none; border-radius: 5px; font-size: 11px; color: #94a3b8; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
.pj-code-copy:hover { background: var(--primary); color: var(--white); }
.pj-code-pre { margin: 0; padding: 20px; overflow-x: auto; }
.pj-code-pre code { font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.7; color: #e2e8f0; white-space: pre; }

/* Modal Edit Mode */
.pj-ws-modal__edit { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #0f172a; }
.pj-ws-modal__edit-info { padding: 10px 16px; font-size: 12px; color: #f59e0b; background: #1e293b; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 8px; }
.pj-ws-modal__edit-info.continue { color: #10b981; }
.pj-ws-edit-split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
.pj-ws-edit-input, .pj-ws-edit-preview { display: flex; flex-direction: column; overflow: hidden; }
.pj-ws-edit-input { border-right: 1px solid #334155; }
.pj-ws-edit-label { padding: 8px 14px; background: #1e293b; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
.pj-ws-edit-textarea { flex: 1; resize: none; border: none; outline: none; background: #0f172a; color: #e2e8f0; font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.7; padding: 16px; }
.pj-ws-edit-textarea::placeholder { color: #334155; }
.pj-ws-preview-code { flex: 1; margin: 0; overflow: auto; background: #0f172a; }
.pj-ws-preview-code code { display: block; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.7; color: #64748b; padding: 16px; white-space: pre; }

/* TOAST */
.pj-toast { position: fixed; bottom: 20px; right: 20px; display: flex; align-items: center; gap: 9px; padding: 12px 18px; background: var(--white); border-radius: 10px; box-shadow: var(--shadow-lg); font-size: 13px; font-weight: 600; z-index: 2000; border: 1px solid var(--border); min-width: 240px; }
.pj-toast--success { border-left: 4px solid var(--green); }
.pj-toast--success svg { color: var(--green); }
.pj-toast--error { border-left: 4px solid var(--red); }
.pj-toast--error svg { color: var(--red); }
.pj-toast-enter-active, .pj-toast-leave-active { transition: all 0.3s var(--ease); }
.pj-toast-enter-from, .pj-toast-leave-to { opacity: 0; transform: translateY(12px); }

/* RESPONSIVE */
@media (max-width: 968px) {
  .pj-root { grid-template-areas: "nav" "main"; grid-template-columns: 1fr; }
  .pj-sidebar { display: none; }
  .pj-toolbar { flex-direction: column; align-items: stretch; }
  .pj-ws-form-grid { grid-template-columns: 1fr; }
  .pj-ws-edit-split { grid-template-columns: 1fr; }
  .pj-ws-edit-input { height: 50%; border-right: none; border-bottom: 1px solid #334155; }
  .pj-list-body { grid-template-columns: 1fr; gap: 8px; }
}
@media (max-width: 640px) {
  .pj-grid, .pj-ws-grid { grid-template-columns: 1fr; }
  .pj-global-search { display: none; }
  .pj-ws-modal { max-width: 100%; max-height: 100%; border-radius: 0; }
}
</style>