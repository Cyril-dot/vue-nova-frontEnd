<!-- TeamWorkspaceAdmin.vue — Admin control panel -->
<!-- Endpoints used:
     GET  /v1/team/workspace/all/{teamId}
     GET  /v1/team/workspace/view/{teamId}/{docId}
     POST /v1/team/workspace/create/{teamId}              ← step 1 (via createWorkspaceWithTemplate)
     POST /v1/team/workspace/template/{teamId}/{docId}    ← step 2 (via createWorkspaceWithTemplate)
     PUT  /v1/team/workspace/work/{teamId}/{docId}
     PATCH /v1/team/workspace/continue/{teamId}/{docId}
     GET  /v1/team/workspace/pending/{teamId}/{workspaceId}
     PATCH /v1/team/workspace/approve/{teamId}/{contributionId}
     PATCH /v1/team/workspace/reject/{teamId}/{contributionId}?reason=
     DELETE /v1/team/workspace/delete/{teamId}/{docId}
     GET  /v1/team/workspace/download/{teamId}/{docId}
     GET  /v1/team/workspace/download-all/{teamId}
-->
<template>
  <div class="ws-root" @click.self="activeMenu = null">
    <!-- ══════════════ HEADER ══════════════ -->
    <header class="ws-header">
      <div class="ws-header__inner">
        <div class="ws-brand">
          <div class="ws-brand__icon">
            <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <rect x="8" y="8" width="26" height="26" rx="3" stroke="white" stroke-width="2"/>
              <path d="M21 13v16M13 21h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="ws-brand__text">
            <span class="ws-brand__name">NovaSpace</span>
            <span class="ws-brand__sub">Admin Panel</span>
          </div>
        </div>

        <div class="ws-header__center">
          <template v-if="editorMode && activeWorkspace">
            <div class="ws-editor-breadcrumb">
              <button @click="exitEditor" class="ws-crumb-btn">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Admin
              </button>
              <span class="ws-crumb-sep">/</span>
              <span class="ws-crumb-cur">{{ activeWorkspace.title }}</span>
              <span class="ws-mode-pill" :class="`ws-mode-pill--${editorTab}`">
                {{ editorTab === 'work' ? '✏️ Work' : editorTab === 'continue' ? '➕ Continue' : '👁 View' }}
              </span>
            </div>
          </template>
          <template v-else>
            <div class="ws-admin-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/></svg>
              Admin Control Panel
            </div>
          </template>
        </div>

        <div class="ws-header__actions">
          <template v-if="editorMode && activeWorkspace">
            <button class="ws-btn ws-btn--amber" @click="submitEditorContent" :disabled="submittingEditor || editorTab === 'view'">
              <svg v-if="!submittingEditor" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <div v-else class="ws-spin ws-spin--sm ws-spin--white"></div>
              {{ submittingEditor ? 'Saving…' : 'Save' }}
            </button>
            <button class="ws-btn ws-btn--ghost" @click="exitEditor">Close</button>
          </template>
          <template v-else>
            <div class="ws-nav-tabs">
              <router-link to="/team-workspace" class="ws-nav-tab">Hub</router-link>
              <router-link to="/team-workspace-members" class="ws-nav-tab">Contribute</router-link>
              <span class="ws-nav-tab ws-nav-tab--active">Admin</span>
            </div>
          </template>
        </div>
      </div>
    </header>

    <!-- ══════════════ EDITOR MODE ══════════════ -->
    <div v-if="editorMode && activeWorkspace" class="ws-editor-shell">
      <aside class="ws-editor-sidebar">
        <div class="ws-editor-meta">
          <div class="ws-type-pill" :style="{ background: typeColor(activeWorkspace.docType), color:'#fff' }">
            {{ activeWorkspace.docType || 'TEXT' }}
          </div>
          <h2 class="ws-editor-title">{{ activeWorkspace.title }}</h2>
          <p class="ws-editor-desc">{{ activeWorkspace.description || 'No description.' }}</p>
        </div>

        <div class="ws-section-label">View Mode</div>
        <div class="ws-tab-group">
          <button :class="['ws-tab', { active: editorTab === 'view' }]" @click="editorTab = 'view'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            View Only
          </button>
          <button :class="['ws-tab', { active: editorTab === 'work' }]" @click="editorTab = 'work'; editorInput = ''">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/></svg>
            Work (Replace)
          </button>
          <button :class="['ws-tab', { active: editorTab === 'continue' }]" @click="editorTab = 'continue'; editorInput = ''">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Continue (Append)
          </button>
        </div>

        <div class="ws-section-label" style="margin-top:14px">Actions</div>
        <button class="ws-action-btn" @click="copyContent">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/></svg>
          {{ copied ? '✓ Copied!' : 'Copy Content' }}
        </button>
        <button class="ws-action-btn" @click="downloadSingle(activeWorkspace.id)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Download File
        </button>
        <button class="ws-action-btn" @click="openAddTemplate(activeWorkspace)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><path d="M14 2v6h6M12 18v-6M9 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Add Template
        </button>
        <button class="ws-action-btn" @click="openPendingFor(activeWorkspace)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          View Pending
          <span v-if="pendingContributions.length > 0" class="ws-badge-dot">{{ pendingContributions.length }}</span>
        </button>
        <button class="ws-action-btn ws-action-btn--danger" @click="deleteFromEditor">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Delete Workspace
        </button>
      </aside>

      <div class="ws-editor-main">
        <div v-if="editorTab === 'view'" class="ws-view-pane">
          <div class="ws-code-block">
            <div class="ws-code-header">
              <div class="ws-mac-dots"><span></span><span></span><span></span></div>
              <span class="ws-code-lang">{{ (activeWorkspace.docType || 'text').toLowerCase() }}</span>
              <button class="ws-copy-btn" @click="copyContent">{{ copied ? '✓ Copied' : 'Copy' }}</button>
            </div>
            <div v-if="loadingContent" class="ws-center-spin"><div class="ws-spin ws-spin--light"></div></div>
            <pre v-else class="ws-code-pre"><code>{{ activeContent || '// No content yet. Use Work or Continue mode to add content.' }}</code></pre>
          </div>
        </div>

        <div v-else class="ws-edit-pane">
          <div class="ws-edit-header">
            <div class="ws-edit-info" :class="editorTab === 'continue' ? 'ws-edit-info--green' : 'ws-edit-info--amber'">
              <svg v-if="editorTab === 'work'" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>
              <span v-if="editorTab === 'work'">Work mode <strong>replaces</strong> all existing content.</span>
              <span v-else>Continue mode <strong>appends</strong> to existing content.</span>
            </div>
          </div>
          <div class="ws-split">
            <div class="ws-split-panel ws-split-panel--input">
              <div class="ws-panel-label">
                <span>{{ editorTab === 'work' ? 'New Content (Replaces All)' : 'Append Content' }}</span>
                <span class="ws-char-count">{{ editorInput.length }} chars</span>
              </div>
              <textarea v-model="editorInput" class="ws-textarea"
                :placeholder="editorTab === 'work' ? 'Write your content here — replaces everything…' : 'Write content to append below existing…'"
                spellcheck="false"></textarea>
            </div>
            <div class="ws-split-panel ws-split-panel--preview">
              <div class="ws-panel-label">
                <span>Current Document</span>
                <span class="ws-char-count">Preview</span>
              </div>
              <pre class="ws-preview-pre"><code>{{ activeContent || '// No content yet.' }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════ LIST / MAIN MODE ══════════════ -->
    <div v-else class="ws-layout">

      <!-- ── LEFT SIDEBAR ── -->
      <aside class="ws-sidebar">
        <nav class="ws-sidebar-nav">
          <div class="ws-sidebar-label">Navigation</div>
          <router-link to="/dashboard" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
            Dashboard
          </router-link>
          <router-link to="/teams" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
            Teams
          </router-link>
          <router-link to="/team-workspace" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 3v18M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Workspace Hub
          </router-link>
          <router-link to="/team-workspace-members" class="ws-sidebar-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Contribute
          </router-link>
          <router-link to="/team-workspace-admin" class="ws-sidebar-link ws-sidebar-link--active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/></svg>
            Admin Panel
          </router-link>
        </nav>

        <div class="ws-sidebar-stats">
          <div class="ws-sidebar-stats__title">Overview</div>
          <div class="ws-sidebar-stats__grid">
            <div class="ws-stat-mini"><div class="ws-stat-mini__val">{{ adminTeams.length }}</div><div class="ws-stat-mini__lbl">Teams</div></div>
            <div class="ws-stat-mini"><div class="ws-stat-mini__val">{{ workspaces.length }}</div><div class="ws-stat-mini__lbl">Workspaces</div></div>
            <div class="ws-stat-mini ws-stat-mini--red"><div class="ws-stat-mini__val">{{ pendingContributions.length }}</div><div class="ws-stat-mini__lbl">Pending</div></div>
          </div>
        </div>

        <div class="ws-sidebar-section">
          <div class="ws-sidebar-label">Admin Teams</div>
          <div v-if="loadingTeams" class="ws-spin-wrap"><div class="ws-spin ws-spin--sm"></div></div>
          <div v-else class="ws-team-list">
            <button v-for="t in adminTeams" :key="t.teamId"
              :class="['ws-team-btn', { active: selectedTeam?.teamId === t.teamId }]"
              @click="selectTeam(t)">
              <div class="ws-team-ava">{{ (t.teamName||'T')[0].toUpperCase() }}</div>
              <div class="ws-team-btn__body">
                <span class="ws-team-btn__name">{{ t.teamName }}</span>
                <span class="ws-team-btn__role">{{ t.myRole }}</span>
              </div>
            </button>
            <div v-if="adminTeams.length === 0" class="ws-sidebar-empty">No admin teams</div>
          </div>
        </div>

        <div v-if="workspaces.length > 0" class="ws-sidebar-section">
          <div class="ws-sidebar-label">Workspaces</div>
          <div class="ws-ws-list">
            <div v-for="ws in workspaces.slice(0,8)" :key="ws.id+'-s'"
              class="ws-ws-item" @click="openWorkspace(ws)">
              <div class="ws-ws-item__dot" :style="{ background: typeColor(ws.docType) }"></div>
              <span class="ws-ws-item__name">{{ ws.title }}</span>
            </div>
          </div>
        </div>

        <div v-if="selectedWorkspaceForPending && pendingContributions.length > 0" class="ws-pending-badge">
          <div class="ws-pending-badge__label">Pending Reviews</div>
          <div class="ws-pending-badge__count">{{ pendingContributions.length }}</div>
          <p class="ws-pending-badge__ws">{{ selectedWorkspaceForPending.title }}</p>
        </div>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <main class="ws-main">
        <div v-if="!selectedTeam" class="ws-empty-state">
          <div class="ws-empty-state__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <h3>Select an Admin Team</h3>
          <p>Only teams where you hold admin or owner privileges appear in the sidebar.</p>
        </div>

        <template v-else>
          <div class="ws-page-head">
            <div>
              <h1 class="ws-page-title">{{ selectedTeam.teamName }}</h1>
              <p class="ws-page-sub">Manage workspaces, templates &amp; contributions</p>
            </div>
            <button class="ws-btn ws-btn--ghost" @click="loadWorkspaces">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Refresh
            </button>
          </div>

          <div class="ws-tabs">
            <button :class="['ws-tab-btn', { active: adminTab === 'workspaces' }]" @click="adminTab = 'workspaces'">
              Workspaces <span class="ws-tab-count">{{ workspaces.length }}</span>
            </button>
            <button :class="['ws-tab-btn', { active: adminTab === 'create' }]" @click="adminTab = 'create'">
              + Create
            </button>
            <button :class="['ws-tab-btn', { active: adminTab === 'pending' }]" @click="adminTab = 'pending'">
              Pending
              <span v-if="pendingContributions.length > 0" class="ws-tab-count ws-tab-count--red">{{ pendingContributions.length }}</span>
            </button>
          </div>

          <!-- ══ WORKSPACES TAB ══ -->
          <div v-if="adminTab === 'workspaces'">
            <div class="ws-controls">
              <div class="ws-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                <input v-model="searchQuery" type="text" placeholder="Search workspaces…" class="ws-search-input" />
                <span v-if="searchQuery" @click="searchQuery = ''" class="ws-search-clear">✕</span>
              </div>
              <button class="ws-btn ws-btn--ghost" @click="downloadAll">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Download All
              </button>
            </div>

            <div v-if="loading" class="ws-loading"><div class="ws-spin"></div><p>Loading…</p></div>

            <div v-else-if="filteredWorkspaces.length === 0" class="ws-empty-state">
              <div class="ws-empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/></svg></div>
              <h3>No workspaces yet</h3>
              <p>Create the first workspace for this team</p>
              <button class="ws-btn ws-btn--primary" @click="adminTab = 'create'">+ Create Workspace</button>
            </div>

            <div v-else class="ws-grid">
              <div v-for="ws in filteredWorkspaces" :key="ws.id" class="ws-card">
                <div class="ws-card__stripe" :style="{ background: typeColor(ws.docType) }"></div>
                <div class="ws-card__head">
                  <div class="ws-type-chip" :style="{ background: typeBg(ws.docType), color: typeColor(ws.docType) }">{{ ws.docType || 'TEXT' }}</div>
                  <!-- Fixed: Added dropdown container with proper positioning -->
                  <div class="ws-dropdown-container">
                    <button class="ws-more-btn" @click.stop="toggleMenu(ws.id)">⋮</button>
                    <div v-if="activeMenu === ws.id" class="ws-dropdown">
                      <button @click="openWorkspace(ws); activeMenu=null">👁 View</button>
                      <button @click="openEditor(ws,'work'); activeMenu=null">✏️ Work in Doc</button>
                      <button @click="openEditor(ws,'continue'); activeMenu=null">➕ Continue</button>
                      <button @click="openAddTemplate(ws); activeMenu=null">📄 Template</button>
                      <button @click="openPendingFor(ws); activeMenu=null">⏳ Pending</button>
                      <button @click="downloadSingle(ws.id); activeMenu=null">⬇ Download</button>
                      <div class="ws-dropdown__divider"></div>
                      <button @click="deleteWorkspace(ws); activeMenu=null" class="ws-dropdown__danger">🗑 Delete</button>
                    </div>
                  </div>
                </div>
                <div class="ws-card__body">
                  <h3 class="ws-card__title">{{ ws.title }}</h3>
                  <p class="ws-card__desc">{{ ws.description || 'No description.' }}</p>
                </div>
                <div class="ws-card__actions">
                  <button class="ws-pill-btn ws-pill-btn--view"     @click="openWorkspace(ws)">👁 View</button>
                  <button class="ws-pill-btn ws-pill-btn--edit"     @click="openEditor(ws,'work')">✏️ Edit</button>
                  <button class="ws-pill-btn ws-pill-btn--template" @click="openAddTemplate(ws)">📄</button>
                  <button class="ws-pill-btn ws-pill-btn--pending"  @click="openPendingFor(ws)">⏳</button>
                  <button class="ws-pill-btn ws-pill-btn--danger"   @click="deleteWorkspace(ws)">🗑</button>
                </div>
                <div class="ws-card__foot">
                  <span class="ws-card__by">
                    <div class="ws-ava">{{ (ws.username||'A')[0].toUpperCase() }}</div>
                    {{ ws.username || 'Admin' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ══ CREATE TAB ══ -->
          <div v-if="adminTab === 'create'">
            <div class="ws-form-card">
              <div class="ws-form-card__head">
                <h3>Create New Workspace</h3>
                <p>Fills in title, description and doc type — the workspace and its starter template are created together in one go.</p>
              </div>

              <!-- ── creation progress indicator (shows during the 2-step call) ── -->
              <div v-if="submitting" class="ws-create-progress">
                <div class="ws-create-progress__step" :class="{ done: createStep >= 1, active: createStep === 0 }">
                  <div class="ws-create-progress__dot"></div>
                  <span>Creating workspace…</span>
                </div>
                <div class="ws-create-progress__line"></div>
                <div class="ws-create-progress__step" :class="{ done: createStep >= 2, active: createStep === 1 }">
                  <div class="ws-create-progress__dot"></div>
                  <span>Applying {{ createForm.docType }} template…</span>
                </div>
              </div>

              <div class="ws-form-grid">
                <div class="ws-field">
                  <label>Title <span class="req">*</span></label>
                  <input v-model="createForm.title" class="ws-input" placeholder="e.g. Frontend Components" :disabled="submitting" />
                  <span v-if="createErrors.title" class="ws-err">{{ createErrors.title }}</span>
                </div>
                <div class="ws-field">
                  <label>Document Type <span class="req">*</span></label>
                  <select v-model="createForm.docType" class="ws-input" :disabled="submitting">
                    <option value="">Select…</option>
                    <option v-for="t in docTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                  </select>
                  <span v-if="createErrors.docType" class="ws-err">{{ createErrors.docType }}</span>
                </div>
                <div class="ws-field ws-field--full">
                  <label>Description <span class="req">*</span></label>
                  <textarea v-model="createForm.description" class="ws-input" rows="3"
                    placeholder="What is this workspace for? (min 10 chars)"
                    :disabled="submitting"></textarea>
                  <span v-if="createErrors.description" class="ws-err">{{ createErrors.description }}</span>
                </div>
              </div>

              <div class="ws-form-actions">
                <button class="ws-btn ws-btn--ghost" @click="clearCreate" :disabled="submitting">Clear</button>
                <button class="ws-btn ws-btn--primary" @click="createWorkspace" :disabled="submitting">
                  <div v-if="submitting" class="ws-spin ws-spin--sm ws-spin--white"></div>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                  {{ submitting ? (createStep === 0 ? 'Creating workspace…' : 'Applying template…') : '+ Create Workspace' }}
                </button>
              </div>
            </div>
          </div>

          <!-- ══ PENDING TAB ══ -->
          <div v-if="adminTab === 'pending'">
            <h2 class="ws-section-title">Pending Contributions</h2>
            <p class="ws-section-sub">Select a workspace to review contributions awaiting approval.</p>

            <div class="ws-pending-ws-row">
              <button v-for="ws in workspaces" :key="ws.id+'-p'"
                :class="['ws-pending-ws-chip', { active: selectedWorkspaceForPending?.id === ws.id }]"
                @click="loadPendingFor(ws)">
                <span class="ws-type-dot" :style="{ background: typeColor(ws.docType) }"></span>
                {{ ws.title }}
                <span v-if="selectedWorkspaceForPending?.id === ws.id && pendingContributions.length > 0"
                  class="ws-count-badge">{{ pendingContributions.length }}</span>
              </button>
            </div>

            <div v-if="loadingPending" class="ws-loading"><div class="ws-spin"></div><p>Loading contributions…</p></div>
            <div v-else-if="!selectedWorkspaceForPending" class="ws-empty-state">
              <div class="ws-empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="1.5"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="1.5"/></svg></div>
              <h3>Select a workspace</h3>
              <p>Choose a workspace above to see pending contributions</p>
            </div>
            <div v-else-if="pendingContributions.length === 0" class="ws-empty-state">
              <div class="ws-empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="1.5"/></svg></div>
              <h3>All clear!</h3>
              <p>No pending contributions for "{{ selectedWorkspaceForPending.title }}"</p>
            </div>
            <div v-else class="ws-contrib-list">
              <div v-for="c in pendingContributions" :key="c.contributionId" class="ws-contrib-card">
                <div class="ws-contrib-card__head">
                  <div class="ws-contrib-card__who">
                    <div class="ws-contrib-ava">{{ (c.contributorName||'U')[0].toUpperCase() }}</div>
                    <div>
                      <p class="ws-contrib-name">{{ c.contributorName }}</p>
                      <p class="ws-contrib-email">{{ c.contributorEmail }}</p>
                    </div>
                  </div>
                  <div class="ws-contrib-meta">
                    <span class="ws-contrib-status">● Pending</span>
                    <span class="ws-contrib-time">{{ fmtDate(c.submittedAt) }}</span>
                  </div>
                </div>
                <div class="ws-contrib-preview-label">Contribution Preview</div>
                <pre class="ws-contrib-pre">{{ (c.content || 'No preview').slice(0,400) }}{{ (c.content||'').length > 400 ? '\n…' : '' }}</pre>

                <div v-if="rejectingId === c.contributionId" class="ws-reject-form">
                  <textarea v-model="rejectReason" class="ws-input" rows="2" placeholder="Rejection reason (required)…"></textarea>
                  <div class="ws-reject-form__actions">
                    <button class="ws-btn ws-btn--ghost ws-btn--sm" @click="rejectingId=null; rejectReason=''">Cancel</button>
                    <button class="ws-btn ws-btn--red ws-btn--sm" @click="confirmReject(c.contributionId)"
                      :disabled="!rejectReason.trim() || submittingApproval">
                      {{ submittingApproval ? 'Rejecting…' : 'Confirm Reject' }}
                    </button>
                  </div>
                </div>
                <div v-else class="ws-contrib-card__actions">
                  <button class="ws-btn ws-btn--green ws-btn--sm" @click="approveContribution(c.contributionId)" :disabled="submittingApproval">
                    ✓ Approve &amp; Merge
                  </button>
                  <button class="ws-btn ws-btn--red ws-btn--sm" @click="rejectingId=c.contributionId; rejectReason=''">
                    ✕ Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>

      <!-- ── RIGHT SIDEBAR ── -->
      <aside class="ws-right-sidebar">
        <div class="ws-right-sidebar__head">
          <h3>Quick Actions</h3>
          <p>{{ selectedTeam?.teamName || 'Select a team' }}</p>
        </div>

        <template v-if="selectedTeam">
          <div class="ws-right-stats">
            <div class="ws-right-stat"><div class="ws-right-stat__val">{{ workspaces.length }}</div><div class="ws-right-stat__lbl">Workspaces</div></div>
            <div class="ws-right-stat ws-right-stat--red"><div class="ws-right-stat__val">{{ pendingContributions.length }}</div><div class="ws-right-stat__lbl">Pending</div></div>
          </div>

          <button class="ws-right-action" @click="adminTab = 'create'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            New Workspace
          </button>
          <button class="ws-right-action" @click="adminTab = 'pending'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            View Pending
          </button>
          <button class="ws-right-action" @click="downloadAll">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Download All (.zip)
          </button>
          <button class="ws-right-action" @click="loadWorkspaces">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Refresh
          </button>

          <div v-if="workspaces.length > 0" class="ws-right-sidebar__ws-list">
            <div class="ws-right-sidebar__ws-label">Recent Workspaces</div>
            <div v-for="ws in workspaces.slice(0,5)" :key="ws.id+'-r'" class="ws-right-ws-item" @click="openWorkspace(ws)">
              <div class="ws-right-ws-dot" :style="{ background: typeBg(ws.docType) }">
                <span :style="{ color: typeColor(ws.docType), fontSize:'8px', fontWeight:'800' }">{{ (ws.docType||'TXT').slice(0,3) }}</span>
              </div>
              <div class="ws-right-ws-info">
                <p class="ws-right-ws-name">{{ ws.title }}</p>
                <p class="ws-right-ws-type">{{ ws.docType || 'TEXT' }}</p>
              </div>
            </div>
          </div>
        </template>

        <div class="ws-right-sidebar__footer">
          <router-link to="/team-workspace-members" class="ws-right-action">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Member Contributions
          </router-link>
        </div>
      </aside>
    </div>

    <!-- ══════════════ TEMPLATE MODAL ══════════════ -->
    <div v-if="showTemplateModal" class="ws-modal-overlay" @click.self="showTemplateModal = false">
      <div class="ws-modal">
        <div class="ws-modal__head">
          <h3>Add Template — "{{ templateTarget?.title }}"</h3>
          <button @click="showTemplateModal = false" class="ws-icon-btn">✕</button>
        </div>
        <div class="ws-form-notice">Adding a template <strong>replaces</strong> current content with a starter.</div>
        <div class="ws-field">
          <label>Document Type <span class="req">*</span></label>
          <select v-model="templateDocType" class="ws-input">
            <option value="">Choose type…</option>
            <option v-for="t in docTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="ws-modal__actions">
          <button class="ws-btn ws-btn--ghost" @click="showTemplateModal = false">Cancel</button>
          <button class="ws-btn ws-btn--primary" @click="addTemplate" :disabled="!templateDocType || submittingTemplate">
            {{ submittingTemplate ? 'Adding…' : 'Add Template' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════ TOAST ══════════════ -->
    <transition name="toast">
      <div v-if="toast.show" :class="['ws-toast', `ws-toast--${toast.type}`]">
        <span class="ws-toast__icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { apiRequest } from '@/utils/apiService';
import { TeamWorkspaceAPI } from '@/utils/teamWorkspaceApi';

export default {
  name: 'TeamWorkspaceAdmin',
  data() {
    return {
      teams: [], adminTeams: [], selectedTeam: null,
      workspaces: [], pendingContributions: [], selectedWorkspaceForPending: null,
      editorMode: false, activeWorkspace: null, activeContent: '',
      editorTab: 'view', editorInput: '', copied: false,
      loading: false, loadingTeams: false, loadingPending: false,
      loadingContent: false, submitting: false, submittingEditor: false,
      submittingApproval: false, submittingTemplate: false,
      // tracks which step of create is running (0 = create, 1 = template)
      createStep: 0,
      adminTab: 'workspaces', searchQuery: '', activeMenu: null,
      rejectingId: null, rejectReason: '',
      showTemplateModal: false, templateTarget: null, templateDocType: '',
      createForm: { title: '', description: '', docType: '' },
      createErrors: {},
      docTypes: [
        { label: 'HTML',       value: 'HTML'        },
        { label: 'CSS',        value: 'CSS'         },
        { label: 'JavaScript', value: 'JS'          },
        { label: 'TypeScript', value: 'TYPESCRIPT'  },
        { label: 'Python',     value: 'PYTHON'      },
        { label: 'Java',       value: 'JAVA'        },
        { label: 'C++',        value: 'C_PLUS_PLUS' },
        { label: 'C#',         value: 'C_SHARP'     },
        { label: 'SQL',        value: 'SQL'         },
        { label: 'Markdown',   value: 'MARKDOWN'    },
        { label: 'Text',       value: 'TEXT'        },
      ],
      toast: { show: false, message: '', type: 'success' },
    };
  },

  computed: {
    filteredWorkspaces() {
      let list = [...this.workspaces];
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(w =>
          (w.title||'').toLowerCase().includes(q) ||
          (w.description||'').toLowerCase().includes(q)
        );
      }
      return list;
    },
  },

  methods: {
    // ── Teams ─────────────────────────────────────────────────────────
    async loadTeams() {
      try {
        this.loadingTeams = true;
        const res  = await apiRequest('/v1/dashboard/teams/joined', { method: 'GET' });
        const data = await res.json();
        this.teams      = Array.isArray(data) ? data : [];
        this.adminTeams = this.teams.filter(t => t.myRole === 'ADMIN' || t.myRole === 'OWNER');
        const saved = sessionStorage.getItem('selectedTeam');
        if (saved) {
          const st    = JSON.parse(saved);
          const match = this.adminTeams.find(t => t.teamId === st.teamId);
          if (match) { await this.selectTeam(match); return; }
        }
        if (this.adminTeams.length > 0) await this.selectTeam(this.adminTeams[0]);
      } catch (e) {
        this.showToast('Failed to load teams', 'error');
      } finally {
        this.loadingTeams = false;
      }
    },

    async selectTeam(team) {
      this.selectedTeam = team;
      sessionStorage.setItem('selectedTeam', JSON.stringify(team));
      this.workspaces = [];
      this.pendingContributions = [];
      this.selectedWorkspaceForPending = null;
      await this.loadWorkspaces();
    },

    async loadWorkspaces() {
      if (!this.selectedTeam) return;
      try {
        this.loading = true;
        const data   = await TeamWorkspaceAPI.getAllWorkspaces(this.selectedTeam.teamId);
        this.workspaces = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load workspaces', 'error');
        this.workspaces = [];
      } finally {
        this.loading = false;
      }
    },

    // ── Editor ────────────────────────────────────────────────────────
    async openWorkspace(ws) {
      try {
        this.loadingContent = true;
        const data = await TeamWorkspaceAPI.viewWorkspace(this.selectedTeam.teamId, ws.id);
        this.activeWorkspace = { ...ws, title: data.title || ws.title, description: data.description || ws.description };
        this.activeContent   = data.content || '';
        this.editorInput = ''; this.editorTab = 'view'; this.editorMode = true;
      } catch (e) {
        this.showToast('Failed to load workspace', 'error');
      } finally {
        this.loadingContent = false;
        this.activeMenu = null;
      }
    },

    async openEditor(ws, tab) {
      await this.openWorkspace(ws);
      this.editorTab = tab; this.editorInput = ''; this.activeMenu = null;
    },

    exitEditor() {
      this.editorMode = false; this.activeWorkspace = null;
      this.activeContent = ''; this.editorInput = ''; this.editorTab = 'view';
      this.loadWorkspaces();
    },

    async submitEditorContent() {
      if (this.editorTab === 'view') return;
      if (!this.editorInput.trim()) { this.showToast('Enter some content first', 'error'); return; }
      try {
        this.submittingEditor = true;
        if (this.editorTab === 'work') {
          await TeamWorkspaceAPI.workInWorkspace(this.selectedTeam.teamId, this.activeWorkspace.id, this.editorInput);
        } else {
          await TeamWorkspaceAPI.continueWork(this.selectedTeam.teamId, this.activeWorkspace.id, this.editorInput);
        }
        const fresh        = await TeamWorkspaceAPI.viewWorkspace(this.selectedTeam.teamId, this.activeWorkspace.id);
        this.activeContent = fresh.content || this.editorInput;
        this.editorInput   = ''; this.editorTab = 'view';
        this.showToast('Saved successfully!', 'success');
      } catch (e) {
        this.showToast('Failed to save changes', 'error');
      } finally {
        this.submittingEditor = false;
      }
    },

    async deleteFromEditor() {
      if (!confirm('Delete this workspace? This cannot be undone.')) return;
      await this.deleteWorkspace(this.activeWorkspace);
      this.exitEditor();
    },

    copyContent() {
      if (this.activeContent) {
        navigator.clipboard.writeText(this.activeContent);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      }
    },

    // ── Create ────────────────────────────────────────────────────────
    validateCreate() {
      this.createErrors = {};
      if (!this.createForm.title || this.createForm.title.trim().length < 3)
        this.createErrors.title = 'Title must be at least 3 characters';
      if (!this.createForm.docType)
        this.createErrors.docType = 'Document type is required';
      if (!this.createForm.description || this.createForm.description.trim().length < 10)
        this.createErrors.description = 'Description must be at least 10 characters';
      return Object.keys(this.createErrors).length === 0;
    },

    async createWorkspace() {
      if (!this.validateCreate()) return;
      try {
        this.submitting  = true;
        this.createStep  = 0;   // show "Creating workspace…"

        // ── single call that does POST /create then POST /template ────
        // createStep is updated inside so the progress indicator reflects reality
        const created = await this._createThenTemplate();

        this.showToast(`✓ "${created.title || this.createForm.title}" created with ${this.createForm.docType} template!`, 'success');
        this.clearCreate();
        this.adminTab = 'workspaces';
        await this.loadWorkspaces();
      } catch (e) {
        this.showToast(e.message || 'Failed to create workspace', 'error');
      } finally {
        this.submitting = false;
        this.createStep = 0;
      }
    },

    // Runs the two API steps in sequence and updates createStep for the UI
    async _createThenTemplate() {
      // Step 1 — create the workspace record
      this.createStep = 0;
      const createRes = await apiRequest(`/v1/team/workspace/create/${this.selectedTeam.teamId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title:       this.createForm.title,
          description: this.createForm.description,
        }),
      });
      if (!createRes.ok) throw new Error(await createRes.text() || 'Failed to create workspace');
      const created = await createRes.json();

      // Step 2 — stamp it with a starter template
      this.createStep = 1;
      const templateRes = await apiRequest(
        `/v1/team/workspace/template/${this.selectedTeam.teamId}/${created.id}?docType=${this.createForm.docType}`,
        { method: 'POST' },
      );
      if (!templateRes.ok) throw new Error(await templateRes.text() || 'Workspace created but template failed');

      return templateRes.json();
    },

    clearCreate() {
      this.createForm   = { title: '', description: '', docType: '' };
      this.createErrors = {};
    },

    // ── Template modal ────────────────────────────────────────────────
    openAddTemplate(ws) {
      this.templateTarget  = ws;
      this.templateDocType = ws.docType || '';
      this.showTemplateModal = true;
      this.activeMenu = null;
    },

    async addTemplate() {
      if (!this.templateDocType) return;
      try {
        this.submittingTemplate = true;
        await TeamWorkspaceAPI.createTemplate(this.selectedTeam.teamId, this.templateTarget.id, this.templateDocType);
        this.showToast('Template added!', 'success');
        this.showTemplateModal = false;
        await this.loadWorkspaces();
      } catch (e) {
        this.showToast(e.message || 'Failed to add template', 'error');
      } finally {
        this.submittingTemplate = false;
      }
    },

    // ── Pending ───────────────────────────────────────────────────────
    async openPendingFor(ws) {
      this.adminTab = 'pending';
      await this.loadPendingFor(ws);
      this.activeMenu = null;
    },

    async loadPendingFor(ws) {
      try {
        this.loadingPending = true;
        this.selectedWorkspaceForPending = ws;
        const data = await TeamWorkspaceAPI.getPendingContributions(this.selectedTeam.teamId, ws.id);
        this.pendingContributions = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load contributions', 'error');
        this.pendingContributions = [];
      } finally {
        this.loadingPending = false;
      }
    },

    async approveContribution(contributionId) {
      try {
        this.submittingApproval = true;
        await TeamWorkspaceAPI.approveContribution(this.selectedTeam.teamId, contributionId);
        this.pendingContributions = this.pendingContributions.filter(c => c.contributionId !== contributionId);
        this.showToast('Contribution approved and merged!', 'success');
      } catch (e) {
        this.showToast(e.message || 'Failed to approve', 'error');
      } finally {
        this.submittingApproval = false;
      }
    },

    async confirmReject(contributionId) {
      if (!this.rejectReason.trim()) return;
      try {
        this.submittingApproval = true;
        await TeamWorkspaceAPI.rejectContribution(this.selectedTeam.teamId, contributionId, this.rejectReason);
        this.pendingContributions = this.pendingContributions.filter(c => c.contributionId !== contributionId);
        this.rejectingId = null; this.rejectReason = '';
        this.showToast('Contribution rejected', 'success');
      } catch (e) {
        this.showToast(e.message || 'Failed to reject', 'error');
      } finally {
        this.submittingApproval = false;
      }
    },

    // ── Delete ────────────────────────────────────────────────────────
    async deleteWorkspace(ws) {
      if (!confirm(`Delete "${ws.title}"? This cannot be undone.`)) return;
      try {
        await TeamWorkspaceAPI.deleteWorkspace(this.selectedTeam.teamId, ws.id);
        this.workspaces = this.workspaces.filter(w => w.id !== ws.id);
        this.showToast('Workspace deleted', 'success');
      } catch (e) {
        this.showToast(e.message || 'Failed to delete', 'error');
      }
    },

    // ── Download ──────────────────────────────────────────────────────
    async downloadSingle(id) {
      try { await TeamWorkspaceAPI.downloadWorkspace(this.selectedTeam.teamId, id); this.showToast('Download started', 'success'); }
      catch (e) { this.showToast('Download failed', 'error'); }
    },
    async downloadAll() {
      try { await TeamWorkspaceAPI.downloadAllWorkspaces(this.selectedTeam.teamId); this.showToast('Download started', 'success'); }
      catch (e) { this.showToast(e.message || 'Download failed', 'error'); }
    },

    // ── UI helpers ────────────────────────────────────────────────────
    toggleMenu(id) { this.activeMenu = this.activeMenu === id ? null : id; },
    typeColor(type) {
      const m = { HTML:'#f59e0b',CSS:'#3b82f6',JS:'#eab308',TYPESCRIPT:'#6366f1',PYTHON:'#10b981',JAVA:'#ef4444',C_PLUS_PLUS:'#8b5cf6',C_SHARP:'#a855f7',SQL:'#0891b2',MARKDOWN:'#64748b',TEXT:'#94a3b8' };
      return m[type] || '#6366f1';
    },
    typeBg(type) {
      const m = { HTML:'#fef3c7',CSS:'#dbeafe',JS:'#fef9c3',TYPESCRIPT:'#ede9fe',PYTHON:'#d1fae5',JAVA:'#fee2e2',C_PLUS_PLUS:'#ede9fe',C_SHARP:'#f3e8ff',SQL:'#cffafe',MARKDOWN:'#f1f5f9',TEXT:'#f8fafc' };
      return m[type] || '#f1f5f9';
    },
    fmtDate(d) {
      if (!d) return '—';
      const diff = Date.now() - new Date(d).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1)  return 'Just now';
      if (m < 60) return `${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h ago`;
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    },
  },

  async mounted() {
    await this.loadTeams();
    document.addEventListener('click', () => { this.activeMenu = null; });
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

.ws-root {
  --ink: #0f172a; --ink2: #475569; --ink3: #94a3b8; --ink4: #cbd5e1;
  --border: #e2e8f0; --border2: #f1f5f9; --bg: #f8fafc; --bg2: #f1f5f9;
  --white: #fff;
  --primary: #6366f1; --primary-dk: #4f46e5; --primary-soft: #eef2ff;
  --green: #10b981; --green-soft: #d1fae5; --green-dk: #059669;
  --red: #ef4444; --red-soft: #fee2e2;
  --amber: #f59e0b; --amber-soft: #fef3c7;
  --sh-xs: 0 1px 2px rgba(15,23,42,.05);
  --sh-sm: 0 1px 4px rgba(15,23,42,.08);
  --sh-md: 0 4px 16px rgba(15,23,42,.10);
  --sh-lg: 0 12px 32px rgba(15,23,42,.13);
  --sh-xl: 0 24px 48px rgba(15,23,42,.15);
  --r: 10px; --r-sm: 6px; --r-md: 14px; --r-lg: 18px;
  --ease: cubic-bezier(.22,1,.36,1);
  min-height: 100vh; background: var(--bg);
  font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px;
  color: var(--ink); display: flex; flex-direction: column;
  -webkit-font-smoothing: antialiased;
}
.ws-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Header ─────────────────────────────────────────────────── */
.ws-header { background: rgba(255,255,255,.96); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); height: 58px; position: sticky; top: 0; z-index: 200; }
.ws-header__inner { height: 100%; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.ws-brand { display: flex; align-items: center; gap: 9px; flex-shrink: 0; user-select: none; }
.ws-brand__text { display: flex; flex-direction: column; line-height: 1.2; }
.ws-brand__name { font-size: 14px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; letter-spacing: -.3px; }
.ws-brand__sub { font-size: 9px; font-weight: 700; color: var(--amber); text-transform: uppercase; letter-spacing: .4px; }
.ws-header__center { flex: 1; display: flex; justify-content: center; }
.ws-admin-badge { display: flex; align-items: center; gap: 6px; background: var(--amber-soft); border: 1px solid rgba(245,158,11,.3); border-radius: 999px; padding: 5px 14px; font-size: 11px; font-weight: 700; color: #92400e; }
.ws-editor-breadcrumb { display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 999px; padding: 5px 14px; }
.ws-crumb-btn { background: none; border: none; color: var(--amber); font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: 'DM Sans', sans-serif; }
.ws-crumb-sep { color: var(--ink4); }
.ws-crumb-cur { font-size: 11px; font-weight: 700; color: var(--ink); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-mode-pill { padding: 2px 9px; border-radius: 999px; font-size: 9px; font-weight: 800; margin-left: 4px; }
.ws-mode-pill--view     { background: var(--bg2);        color: var(--ink3);  }
.ws-mode-pill--work     { background: var(--amber-soft); color: #92400e;      }
.ws-mode-pill--continue { background: var(--green-soft); color: var(--green-dk); }
.ws-header__actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ws-nav-tabs { display: flex; gap: 2px; background: var(--bg2); padding: 3px; border-radius: var(--r); border: 1px solid var(--border); }
.ws-nav-tab { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border: none; background: none; border-radius: 7px; font-size: 11px; font-weight: 600; color: var(--ink3); cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; transition: color .15s; }
.ws-nav-tab:hover { color: var(--ink); }
.ws-nav-tab--active { background: var(--amber-soft); color: #92400e; }

/* ── Layout ──────────────────────────────────────────────────── */
.ws-layout { display: grid; grid-template-columns: 224px 1fr 248px; height: calc(100vh - 58px); overflow: hidden; }

/* ── Left Sidebar ────────────────────────────────────────────── */
.ws-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 18px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.ws-sidebar-label { font-size: 9px; font-weight: 800; color: var(--ink3); text-transform: uppercase; letter-spacing: .8px; padding: 0 6px 4px; }
.ws-sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
.ws-sidebar-link { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 10px; border-radius: var(--r); color: var(--ink2); font-size: 12px; font-weight: 500; text-decoration: none; transition: all .15s; }
.ws-sidebar-link:hover { background: var(--bg2); color: var(--ink); }
.ws-sidebar-link--active, .ws-sidebar-link.router-link-active { background: var(--amber-soft); color: #92400e; font-weight: 700; box-shadow: inset 3px 0 0 var(--amber); }
.ws-sidebar-stats { background: linear-gradient(140deg, var(--amber) 0%, #d97706 100%); border-radius: var(--r-md); padding: 14px 12px; color: #fff; box-shadow: 0 4px 14px rgba(245,158,11,.3); }
.ws-sidebar-stats__title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; opacity: .8; margin-bottom: 10px; }
.ws-sidebar-stats__grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }
.ws-stat-mini { text-align: center; background: rgba(255,255,255,.15); border-radius: var(--r); padding: 8px 4px; }
.ws-stat-mini__val { font-size: 20px; font-weight: 900; font-family: 'Fraunces', serif; line-height: 1; }
.ws-stat-mini__lbl { font-size: 9px; font-weight: 600; opacity: .8; }
.ws-stat-mini--red .ws-stat-mini__val { color: #fca5a5; }
.ws-sidebar-section { display: flex; flex-direction: column; gap: 4px; }
.ws-spin-wrap { display: flex; justify-content: center; padding: 10px; }
.ws-team-list { display: flex; flex-direction: column; gap: 3px; }
.ws-team-btn { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: var(--r); border: 1px solid transparent; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; text-align: left; width: 100%; transition: all .15s; }
.ws-team-btn:hover { background: var(--bg2); }
.ws-team-btn.active { background: var(--amber-soft); border-color: rgba(245,158,11,.3); }
.ws-team-ava { width: 28px; height: 28px; border-radius: var(--r-sm); background: var(--amber-soft); color: #92400e; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
.ws-team-btn__body { flex: 1; min-width: 0; }
.ws-team-btn__name { font-size: 11px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-team-btn__role { font-size: 9px; font-weight: 700; color: var(--amber); text-transform: uppercase; }
.ws-sidebar-empty { font-size: 11px; color: var(--ink3); text-align: center; padding: 10px; }
.ws-ws-list { display: flex; flex-direction: column; gap: 2px; }
.ws-ws-item { display: flex; align-items: center; gap: 7px; padding: 5px 8px; border-radius: var(--r-sm); cursor: pointer; transition: background .15s; }
.ws-ws-item:hover { background: var(--bg2); }
.ws-ws-item__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.ws-ws-item__name { font-size: 11px; color: var(--ink2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.ws-pending-badge { border: 1px solid rgba(99,102,241,.2); border-radius: var(--r-md); padding: 12px; background: var(--primary-soft); }
.ws-pending-badge__label { font-size: 9px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.ws-pending-badge__count { font-size: 28px; font-weight: 900; color: var(--red); font-family: 'Fraunces', serif; line-height: 1; }
.ws-pending-badge__ws { font-size: 10px; color: var(--ink3); margin-top: 2px; }

/* ── Main ────────────────────────────────────────────────────── */
.ws-main { padding: 24px; overflow-y: auto; background: var(--bg); }
.ws-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 10px; color: var(--ink3); text-align: center; }
.ws-empty-state__icon { width: 64px; height: 64px; background: var(--amber-soft); border-radius: var(--r-lg); display: flex; align-items: center; justify-content: center; color: #92400e; margin-bottom: 6px; }
.ws-empty-state h3 { font-size: 17px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.ws-empty-state p { font-size: 13px; color: var(--ink2); max-width: 260px; line-height: 1.5; }
.ws-page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
.ws-page-title { font-size: 26px; font-weight: 900; color: var(--ink); font-family: 'Fraunces', serif; letter-spacing: -.5px; margin-bottom: 3px; }
.ws-page-sub { font-size: 13px; color: var(--ink2); }
.ws-tabs { display: flex; gap: 3px; background: var(--bg2); padding: 3px; border-radius: var(--r-md); border: 1px solid var(--border); margin-bottom: 22px; }
.ws-tab-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; border: none; background: none; border-radius: var(--r); font-size: 12px; font-weight: 600; color: var(--ink3); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.ws-tab-btn:hover { color: var(--ink); }
.ws-tab-btn.active { background: var(--white); color: var(--ink); box-shadow: var(--sh-sm); }
.ws-tab-count { min-width: 18px; height: 17px; padding: 0 5px; border-radius: 999px; background: var(--bg2); color: var(--ink3); font-size: 10px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
.ws-tab-count--red { background: var(--red-soft); color: var(--red); }
.ws-controls { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.ws-search { flex: 1; max-width: 380px; position: relative; display: flex; align-items: center; }
.ws-search > svg { position: absolute; left: 11px; color: var(--ink3); pointer-events: none; }
.ws-search-input { width: 100%; height: 38px; padding: 0 30px 0 36px; border: 1px solid var(--border); border-radius: var(--r); font-size: 13px; font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); outline: none; transition: all .2s; box-shadow: var(--sh-xs); }
.ws-search-input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(245,158,11,.1); }
.ws-search-input::placeholder { color: var(--ink4); }
.ws-search-clear { position: absolute; right: 10px; color: var(--ink3); font-size: 10px; cursor: pointer; }
.ws-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; background: var(--white); border-radius: var(--r-md); border: 1px solid var(--border); gap: 12px; }
.ws-loading p { font-size: 13px; color: var(--ink2); }

/* ── Cards ───────────────────────────────────────────────────── */
.ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.ws-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px; display: flex; flex-direction: column; gap: 10px; position: relative; overflow: visible; box-shadow: var(--sh-xs); transition: all .22s var(--ease); }
.ws-card:hover { box-shadow: var(--sh-lg); border-color: transparent; transform: translateY(-2px); }
.ws-card__stripe { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.ws-card__head { display: flex; align-items: center; justify-content: space-between; }
.ws-type-chip { padding: 3px 9px; border-radius: var(--r-sm); font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; font-family: 'DM Mono', monospace; }

/* Fixed: Dropdown container styles */
.ws-dropdown-container { position: relative; display: inline-block; }

.ws-more-btn { width: 28px; height: 28px; border: none; background: none; border-radius: var(--r-sm); color: var(--ink3); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.ws-more-btn:hover { background: var(--bg2); color: var(--ink); }

/* Fixed: Dropdown positioning and z-index */
.ws-dropdown { position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--sh-xl); z-index: 1000; min-width: 170px; overflow: hidden; }
.ws-dropdown button { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: none; background: none; font-size: 12px; font-weight: 500; color: var(--ink); cursor: pointer; font-family: 'DM Sans', sans-serif; text-align: left; transition: background .12s; }
.ws-dropdown button:hover { background: var(--bg2); }
.ws-dropdown__divider { height: 1px; background: var(--border); }
.ws-dropdown__danger { color: var(--red) !important; }
.ws-dropdown__danger:hover { background: var(--red-soft) !important; }

.ws-card__body { flex: 1; min-width: 0; }
.ws-card__title { font-size: 14px; font-weight: 700; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-card__desc { font-size: 11px; color: var(--ink2); line-height: 1.5; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.ws-card__actions { display: flex; gap: 4px; flex-wrap: wrap; }
.ws-pill-btn { display: flex; align-items: center; gap: 3px; padding: 4px 9px; border-radius: 999px; border: none; font-size: 10px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.ws-pill-btn--view     { background: var(--bg2);          color: var(--ink2);     } .ws-pill-btn--view:hover     { background: var(--ink);     color: var(--white); }
.ws-pill-btn--edit     { background: var(--primary-soft); color: var(--primary);  } .ws-pill-btn--edit:hover     { background: var(--primary); color: var(--white); }
.ws-pill-btn--template { background: var(--primary-soft); color: var(--primary);  } .ws-pill-btn--template:hover { background: var(--primary); color: var(--white); }
.ws-pill-btn--pending  { background: var(--amber-soft);   color: #92400e;         } .ws-pill-btn--pending:hover  { background: var(--amber);   color: var(--white); }
.ws-pill-btn--danger   { background: var(--red-soft);     color: var(--red);      } .ws-pill-btn--danger:hover   { background: var(--red);     color: var(--white); }
.ws-card__foot { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border2); }
.ws-card__by { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--ink2); font-weight: 600; }
.ws-ava { width: 18px; height: 18px; border-radius: 50%; background: var(--amber-soft); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 800; color: #92400e; }

/* ── Buttons ─────────────────────────────────────────────────── */
.ws-btn { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: var(--r); font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s var(--ease); border: none; outline: none; white-space: nowrap; text-decoration: none; }
.ws-btn:disabled { opacity: .5; cursor: not-allowed; }
.ws-btn--primary { background: var(--primary); color: var(--white); }
.ws-btn--primary:hover:not(:disabled) { background: var(--primary-dk); transform: translateY(-1px); }
.ws-btn--ghost { background: var(--white); border: 1px solid var(--border); color: var(--ink2); box-shadow: var(--sh-xs); }
.ws-btn--ghost:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
.ws-btn--amber { background: var(--amber); color: var(--white); }
.ws-btn--amber:hover:not(:disabled) { background: #d97706; transform: translateY(-1px); }
.ws-btn--green { background: var(--green); color: var(--white); }
.ws-btn--green:hover:not(:disabled) { background: var(--green-dk); }
.ws-btn--red { background: var(--red); color: var(--white); }
.ws-btn--red:hover:not(:disabled) { background: #dc2626; }
.ws-btn--sm { height: 28px; padding: 0 11px; font-size: 11px; }

/* ── Create Form ─────────────────────────────────────────────── */
.ws-form-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; box-shadow: var(--sh-md); max-width: 680px; }
.ws-form-card__head { margin-bottom: 18px; }
.ws-form-card__head h3 { font-size: 16px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; }
.ws-form-card__head p  { font-size: 12px; color: var(--ink2); }

/* creation progress bar */
.ws-create-progress { display: flex; align-items: center; gap: 0; background: var(--primary-soft); border: 1px solid rgba(99,102,241,.2); border-radius: var(--r); padding: 12px 16px; margin-bottom: 18px; }
.ws-create-progress__step { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: var(--ink3); flex: 1; }
.ws-create-progress__step.active { color: var(--primary); }
.ws-create-progress__step.done   { color: var(--green); }
.ws-create-progress__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ink4); flex-shrink: 0; transition: background .3s; }
.ws-create-progress__step.active .ws-create-progress__dot { background: var(--primary); animation: _spin .8s linear infinite; border: 2px solid var(--primary-soft); border-top-color: var(--primary); }
.ws-create-progress__step.done   .ws-create-progress__dot { background: var(--green); }
.ws-create-progress__line { width: 32px; height: 2px; background: var(--border); border-radius: 1px; flex-shrink: 0; margin: 0 8px; }

.ws-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
.ws-field { display: flex; flex-direction: column; gap: 5px; }
.ws-field--full { grid-column: 1 / -1; }
.ws-field label { font-size: 11px; font-weight: 700; color: var(--ink); }
.req { color: var(--red); }
.ws-input { width: 100%; padding: 8px 11px; border: 1px solid var(--border); border-radius: var(--r); font-size: 12px; font-family: 'DM Sans', sans-serif; color: var(--ink); background: var(--white); outline: none; transition: all .2s; }
.ws-input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(245,158,11,.09); }
.ws-input:disabled { background: var(--bg2); color: var(--ink3); cursor: not-allowed; }
.ws-input::placeholder { color: var(--ink4); }
textarea.ws-input { resize: vertical; min-height: 64px; }
.ws-err { font-size: 10px; color: var(--red); font-weight: 600; }
.ws-form-actions { display: flex; gap: 8px; justify-content: flex-end; }

/* ── Pending ─────────────────────────────────────────────────── */
.ws-section-title { font-size: 20px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 4px; }
.ws-section-sub { font-size: 12px; color: var(--ink2); margin-bottom: 14px; }
.ws-pending-ws-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.ws-pending-ws-chip { display: flex; align-items: center; gap: 6px; padding: 6px 13px; border: 1px solid var(--border); border-radius: 999px; background: var(--white); font-size: 11px; font-weight: 600; color: var(--ink2); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; box-shadow: var(--sh-xs); }
.ws-pending-ws-chip:hover { border-color: var(--primary); color: var(--primary); }
.ws-pending-ws-chip.active { background: var(--primary); color: var(--white); border-color: var(--primary); }
.ws-type-dot { width: 7px; height: 7px; border-radius: 50%; }
.ws-count-badge { background: var(--red); color: var(--white); border-radius: 999px; padding: 1px 6px; font-size: 9px; font-weight: 800; }
.ws-contrib-list { display: flex; flex-direction: column; gap: 12px; }
.ws-contrib-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--r-md); padding: 18px; box-shadow: var(--sh-xs); }
.ws-contrib-card__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.ws-contrib-card__who { display: flex; align-items: center; gap: 9px; }
.ws-contrib-ava { width: 34px; height: 34px; border-radius: 50%; background: var(--primary-soft); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
.ws-contrib-name { font-size: 12px; font-weight: 700; color: var(--ink); }
.ws-contrib-email { font-size: 10px; color: var(--ink3); }
.ws-contrib-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.ws-contrib-status { font-size: 10px; font-weight: 700; color: var(--amber); }
.ws-contrib-time { font-size: 10px; color: var(--ink3); }
.ws-contrib-preview-label { font-size: 9px; font-weight: 800; color: var(--ink3); text-transform: uppercase; letter-spacing: .6px; margin-bottom: 6px; }
.ws-contrib-pre { background: #0c1220; border-radius: var(--r); padding: 12px; font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.6; color: #cdd6f4; overflow-x: auto; white-space: pre; margin-bottom: 12px; }
.ws-reject-form { display: flex; flex-direction: column; gap: 7px; }
.ws-reject-form__actions { display: flex; gap: 6px; justify-content: flex-end; }
.ws-contrib-card__actions { display: flex; gap: 7px; }

/* ── Modal ───────────────────────────────────────────────────── */
.ws-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.ws-modal { background: var(--white); border-radius: var(--r-lg); padding: 24px; box-shadow: var(--sh-xl); width: 100%; max-width: 460px; border: 1px solid var(--border); }
.ws-modal__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.ws-modal__head h3 { font-size: 15px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; }
.ws-icon-btn { width: 30px; height: 30px; border: none; background: none; cursor: pointer; border-radius: var(--r-sm); color: var(--ink3); font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.ws-icon-btn:hover { background: var(--bg2); color: var(--ink); }
.ws-form-notice { display: flex; align-items: flex-start; gap: 8px; background: var(--amber-soft); border: 1px solid rgba(245,158,11,.3); border-radius: var(--r); padding: 9px 12px; font-size: 11px; color: #92400e; margin-bottom: 14px; line-height: 1.5; }
.ws-form-notice strong { font-weight: 800; }
.ws-modal__actions { display: flex; gap: 7px; justify-content: flex-end; margin-top: 18px; }

/* ── Spinners ────────────────────────────────────────────────── */
.ws-spin { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: _spin .65s linear infinite; }
.ws-spin--sm    { width: 16px; height: 16px; border-width: 2px; }
.ws-spin--white { border-color: rgba(255,255,255,.3); border-top-color: #fff; }
.ws-spin--light { border-color: rgba(255,255,255,.2); border-top-color: rgba(255,255,255,.8); }
@keyframes _spin { to { transform: rotate(360deg); } }

/* ── Editor Shell ────────────────────────────────────────────── */
.ws-editor-shell { display: grid; grid-template-columns: 256px 1fr; height: calc(100vh - 58px); overflow: hidden; }
.ws-editor-sidebar { background: var(--white); border-right: 1px solid var(--border); padding: 20px 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
.ws-editor-meta .ws-type-pill { display: inline-flex; padding: 3px 9px; border-radius: var(--r-sm); font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; font-family: 'DM Mono', monospace; }
.ws-editor-title { font-size: 17px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin: 8px 0 5px; line-height: 1.25; }
.ws-editor-desc { font-size: 12px; color: var(--ink2); line-height: 1.5; }
.ws-section-label { font-size: 9px; font-weight: 800; color: var(--ink3); text-transform: uppercase; letter-spacing: .8px; }
.ws-tab-group { display: flex; flex-direction: column; gap: 4px; }
.ws-tab { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; text-align: left; box-shadow: var(--sh-xs); }
.ws-tab:hover { border-color: var(--amber); color: #92400e; background: var(--amber-soft); }
.ws-tab.active { background: var(--amber); color: #fff; border-color: var(--amber); }
.ws-action-btn { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; box-shadow: var(--sh-xs); position: relative; }
.ws-action-btn:hover { border-color: var(--amber); color: #92400e; background: var(--amber-soft); }
.ws-action-btn--danger { color: var(--red); }
.ws-action-btn--danger:hover { border-color: var(--red); background: var(--red-soft); color: var(--red); }
.ws-badge-dot { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: var(--red); color: #fff; border-radius: 999px; padding: 1px 6px; font-size: 9px; font-weight: 800; }
.ws-editor-main { overflow: hidden; display: flex; flex-direction: column; height: 100%; background: #0c1220; }
.ws-view-pane { flex: 1; overflow: auto; padding: 20px; }
.ws-center-spin { display: flex; justify-content: center; align-items: center; padding: 50px 0; }
.ws-code-block { border-radius: var(--r-md); overflow: hidden; background: #111827; border: 1px solid #1e2d3d; }
.ws-code-header { display: flex; align-items: center; gap: 9px; padding: 11px 16px; background: #1a2333; border-bottom: 1px solid #1e2d3d; }
.ws-mac-dots { display: flex; gap: 5px; }
.ws-mac-dots span { width: 10px; height: 10px; border-radius: 50%; }
.ws-mac-dots span:nth-child(1) { background: #ff5f57; }
.ws-mac-dots span:nth-child(2) { background: #febc2e; }
.ws-mac-dots span:nth-child(3) { background: #28c840; }
.ws-code-lang { font-size: 10px; font-weight: 600; color: #6b7fa3; font-family: 'DM Mono', monospace; flex: 1; }
.ws-copy-btn { padding: 3px 10px; background: #1e2d3d; border: 1px solid #2a3a4d; border-radius: var(--r-sm); font-size: 10px; color: #6b7fa3; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all .15s; }
.ws-copy-btn:hover { background: var(--amber); color: #fff; border-color: var(--amber); }
.ws-code-pre { padding: 20px; margin: 0; overflow-x: auto; }
.ws-code-pre code { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.7; color: #cdd6f4; white-space: pre; }
.ws-edit-pane { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.ws-edit-header { padding: 10px 18px; background: #1a2333; border-bottom: 1px solid #1e2d3d; }
.ws-edit-info { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #8a9abb; padding: 7px 11px; border-radius: var(--r-sm); }
.ws-edit-info--amber { background: rgba(245,158,11,.08); border: 1px solid rgba(245,158,11,.18); }
.ws-edit-info--amber strong { color: #f5d88a; }
.ws-edit-info--green { background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.18); }
.ws-edit-info--green strong { color: #5eead4; }
.ws-split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
.ws-split-panel { display: flex; flex-direction: column; overflow: hidden; }
.ws-split-panel--input { border-right: 1px solid #1e2d3d; }
.ws-panel-label { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #1a2333; flex-shrink: 0; border-bottom: 1px solid #1e2d3d; }
.ws-panel-label > span:first-child { font-size: 10px; font-weight: 700; color: #6b7fa3; text-transform: uppercase; letter-spacing: .6px; }
.ws-char-count { font-size: 9px; color: #3d5570; }
.ws-textarea { flex: 1; resize: none; border: none; outline: none; background: #0c1220; color: #cdd6f4; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.7; padding: 20px; tab-size: 2; caret-color: var(--amber); }
.ws-textarea::placeholder { color: #2a3a4d; }
.ws-preview-pre { flex: 1; margin: 0; overflow: auto; background: #0c1220; }
.ws-preview-pre code { display: block; font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.7; color: #44596b; padding: 20px; white-space: pre; }

/* ── Right Sidebar ───────────────────────────────────────────── */
.ws-right-sidebar { background: var(--white); border-left: 1px solid var(--border); padding: 18px 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.ws-right-sidebar__head { margin-bottom: 4px; }
.ws-right-sidebar__head h3 { font-size: 13px; font-weight: 800; color: var(--ink); font-family: 'Fraunces', serif; margin-bottom: 2px; }
.ws-right-sidebar__head p { font-size: 10px; color: var(--ink3); }
.ws-right-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.ws-right-stat { text-align: center; background: linear-gradient(140deg, var(--amber) 0%, #d97706 100%); border-radius: var(--r); padding: 10px 6px; color: #fff; box-shadow: 0 3px 10px rgba(245,158,11,.28); }
.ws-right-stat--red { background: linear-gradient(140deg, var(--red) 0%, #dc2626 100%); box-shadow: 0 3px 10px rgba(239,68,68,.28); }
.ws-right-stat__val { font-size: 22px; font-weight: 900; font-family: 'Fraunces', serif; line-height: 1; }
.ws-right-stat__lbl { font-size: 9px; font-weight: 600; opacity: .8; margin-top: 2px; }
.ws-right-action { width: 100%; display: flex; align-items: center; gap: 7px; padding: 8px 11px; border-radius: var(--r); border: 1px solid var(--border); background: var(--white); color: var(--ink2); font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; box-shadow: var(--sh-xs); text-decoration: none; }
.ws-right-action:hover { border-color: var(--amber); color: #92400e; background: var(--amber-soft); }
.ws-right-sidebar__ws-list { border-top: 1px solid var(--border2); padding-top: 12px; display: flex; flex-direction: column; gap: 4px; }
.ws-right-sidebar__ws-label { font-size: 9px; font-weight: 800; color: var(--ink3); text-transform: uppercase; letter-spacing: .7px; margin-bottom: 6px; }
.ws-right-ws-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: var(--r); cursor: pointer; transition: background .15s; }
.ws-right-ws-item:hover { background: var(--bg2); }
.ws-right-ws-dot { width: 28px; height: 28px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ws-right-ws-info { flex: 1; min-width: 0; }
.ws-right-ws-name { font-size: 11px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-right-ws-type { font-size: 9px; color: var(--ink3); }
.ws-right-sidebar__footer { margin-top: auto; border-top: 1px solid var(--border); padding-top: 12px; }

/* ── Toast ───────────────────────────────────────────────────── */
.ws-toast { position: fixed; bottom: 22px; right: 22px; display: flex; align-items: center; gap: 9px; padding: 11px 16px; background: var(--white); border-radius: var(--r-md); box-shadow: var(--sh-xl); font-size: 12px; font-weight: 600; z-index: 2000; border: 1px solid var(--border); min-width: 230px; }
.ws-toast__icon { width: 24px; height: 24px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px; font-weight: 800; }
.ws-toast--success { border-left: 3px solid var(--green); }
.ws-toast--success .ws-toast__icon { background: var(--green-soft); color: var(--green); }
.ws-toast--error { border-left: 3px solid var(--red); }
.ws-toast--error .ws-toast__icon { background: var(--red-soft); color: var(--red); }
.toast-enter-active, .toast-leave-active { transition: all .3s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px) scale(.97); }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 1200px) { .ws-layout { grid-template-columns: 210px 1fr; } .ws-right-sidebar { display: none; } .ws-editor-shell { grid-template-columns: 210px 1fr; } }
@media (max-width: 900px)  { .ws-layout { grid-template-columns: 1fr; } .ws-sidebar { display: none; } .ws-editor-shell { grid-template-columns: 1fr; } .ws-editor-sidebar { display: none; } .ws-split { grid-template-columns: 1fr; } .ws-split-panel--input { border-right: none; border-bottom: 1px solid #1e2d3d; height: 50%; } }
@media (max-width: 640px)  { .ws-grid { grid-template-columns: 1fr; } .ws-main { padding: 14px; } .ws-form-grid { grid-template-columns: 1fr; } }
</style>