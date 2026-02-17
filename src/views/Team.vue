<!-- Teams.vue — Professional team management with GitHub-style member search -->
<template>
  <div class="teams-root">
    <!-- Header -->
    <header class="teams-header">
      <div class="teams-header__inner">
        <div class="teams-brand">
          <div class="teams-brand__icon">
            <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="11" fill="#6366f1"/>
              <circle cx="14" cy="14" r="4" fill="white"/>
              <circle cx="28" cy="14" r="4" fill="white"/>
              <circle cx="21" cy="26" r="4" fill="white"/>
              <path d="M14 18v4l7 4 7-4v-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="teams-brand__text">
            <span class="teams-brand__name">NovaSpace</span>
            <span class="teams-brand__sub">Teams</span>
          </div>
        </div>

        <div class="teams-header__actions">
          <button v-if="!showCreateForm" class="teams-btn teams-btn--primary" @click="showCreateForm = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            Create Team
          </button>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="teams-layout">
      <!-- Sidebar -->
      <aside class="teams-sidebar">
        <nav class="teams-nav">
          <div class="teams-nav__label">Navigation</div>
          <router-link to="/dashboard" class="teams-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            Dashboard
          </router-link>
          <router-link to="/tasks" class="teams-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Tasks
          </router-link>
          <router-link to="/team-projects" class="teams-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Team Projects
          </router-link>
          <router-link to="/teams" class="teams-nav__item teams-nav__item--active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Teams
          </router-link>
          <router-link to="/team-workspace" class="teams-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M9 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Team WorkSpace
          </router-link>
          <router-link to="/calendar" class="teams-nav__item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Calendar
          </router-link>
        </nav>

        <div class="teams-stats">
          <div class="teams-stats__title">Team Stats</div>
          <div class="teams-stats__grid">
            <div class="teams-stat">
              <div class="teams-stat__value">{{ totalTeams }}</div>
              <div class="teams-stat__label">Total Teams</div>
            </div>
            <div class="teams-stat">
              <div class="teams-stat__value">{{ myTeamsCount }}</div>
              <div class="teams-stat__label">My Teams</div>
            </div>
          </div>
        </div>

        <div class="teams-filter">
          <div class="teams-filter__title">Filter by Role</div>
          <div class="teams-filter__list">
            <button :class="['teams-filter__item', { 'is-active': selectedRole === null }]" @click="filterByRole(null)">
              <span class="teams-filter__dot" style="background: #6366f1"></span>
              All Teams
              <span v-if="selectedRole === null" class="teams-filter__check">✓</span>
            </button>
            <button :class="['teams-filter__item', { 'is-active': selectedRole === 'ADMIN' }]" @click="filterByRole('ADMIN')">
              <span class="teams-filter__dot" style="background: #f59e0b"></span>
              Admin
              <span v-if="selectedRole === 'ADMIN'" class="teams-filter__check">✓</span>
            </button>
            <button :class="['teams-filter__item', { 'is-active': selectedRole === 'MEMBER' }]" @click="filterByRole('MEMBER')">
              <span class="teams-filter__dot" style="background: #10b981"></span>
              Member
              <span v-if="selectedRole === 'MEMBER'" class="teams-filter__check">✓</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="teams-content">
        <div class="teams-page-header">
          <div class="teams-page-header__left">
            <h1 class="teams-page-title">Teams</h1>
            <p class="teams-page-sub">Collaborate with your team members on projects and tasks</p>
          </div>
        </div>

        <!-- Search -->
        <div class="teams-controls">
          <div class="teams-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search teams…" class="teams-search__input" />
            <span v-if="searchQuery" class="teams-search__clear" @click="searchQuery = ''">✕</span>
          </div>
        </div>

        <!-- ==================== CREATE TEAM FORM ==================== -->
        <div v-if="showCreateForm" class="teams-create-form">
          <div class="teams-create-form__header">
            <div class="teams-create-form__title-wrap">
              <div class="teams-create-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3>Create New Team</h3>
            </div>
            <button @click="cancelCreate" class="teams-icon-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="teams-form-grid">
            <div class="teams-form-group">
              <label>Team Name <span class="teams-req">*</span></label>
              <input v-model="formData.name" type="text" class="teams-input" placeholder="e.g. Engineering Team" />
            </div>
            <div class="teams-form-group teams-form-group--full">
              <label>Description</label>
              <textarea v-model="formData.description" class="teams-input teams-textarea-sm" rows="2" placeholder="Describe your team…"></textarea>
            </div>

            <!-- ==================== GITHUB-STYLE MEMBER SEARCH ==================== -->
            <div class="teams-form-group teams-form-group--full">
              <label>Add Members <span class="teams-optional">(Optional)</span></label>

              <div class="user-search-wrap" ref="createSearchWrap">
                <div class="user-search-input-row">
                  <div class="user-search-icon">
                    <svg v-if="!searchingUsers" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                      <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div v-else class="user-search-spinner"></div>
                  </div>
                  <input
                    v-model="memberSearchQuery"
                    type="text"
                    class="user-search-input"
                    placeholder="Search by username or email…"
                    @input="onMemberSearchInput"
                    @focus="showSearchDropdown = true"
                    @keydown.escape="showSearchDropdown = false"
                    @keydown.down.prevent="navigateResults(1)"
                    @keydown.up.prevent="navigateResults(-1)"
                    @keydown.enter.prevent="selectHighlighted"
                    autocomplete="off"
                  />
                  <span v-if="memberSearchQuery" class="user-search-clear" @mousedown.prevent @click="clearMemberSearch">✕</span>
                </div>

                <!-- Live results dropdown -->
                <transition name="user-search-drop">
                  <div v-if="showSearchDropdown && (searchResults.length > 0 || searchingUsers || (memberSearchQuery.length >= 2 && !searchingUsers))" class="user-search-dropdown">

                    <!-- Searching state -->
                    <div v-if="searchingUsers" class="user-search-state">
                      <div class="user-search-state__spinner"></div>
                      <span>Searching for "{{ memberSearchQuery }}"…</span>
                    </div>

                    <!-- No results -->
                    <div v-else-if="searchResults.length === 0 && memberSearchQuery.length >= 2" class="user-search-state user-search-state--empty">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M23 11l-6 6M23 17l-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      <div>
                        <p class="user-search-state__title">No users found</p>
                        <p class="user-search-state__sub">No results for "{{ memberSearchQuery }}"</p>
                      </div>
                    </div>

                    <!-- Results list -->
                    <template v-else>
                      <div class="user-search-dropdown__header">
                        {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }} found
                      </div>
                      <div
                        v-for="(user, idx) in searchResults"
                        :key="user.userEmail"
                        :class="['user-result-item', {
                          'is-highlighted': highlightedIndex === idx,
                          'is-added': isAlreadyAdded(user)
                        }]"
                        @mouseenter="highlightedIndex = idx"
                        @mouseleave="highlightedIndex = -1"
                        @mousedown.prevent
                        @click="addMemberToForm(user)"
                      >
                        <!-- Avatar -->
                        <div class="user-result-avatar">
                          <img v-if="user.userProfilePic" :src="user.userProfilePic" :alt="user.userName" class="user-result-avatar__img" />
                          <span v-else class="user-result-avatar__initials">
                            {{ (user.userFirstName || '')[0] }}{{ (user.userLastName || '')[0] }}
                          </span>
                          <div v-if="isAlreadyAdded(user)" class="user-result-avatar__check">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        </div>

                        <!-- Info -->
                        <div class="user-result-info">
                          <div class="user-result-info__top">
                            <span class="user-result-name">{{ user.userFirstName }} {{ user.userLastName }}</span>
                            <span class="user-result-username">@{{ user.userName }}</span>
                          </div>
                          <span class="user-result-email">{{ user.userEmail }}</span>
                        </div>

                        <!-- Action -->
                        <div class="user-result-action">
                          <span v-if="isAlreadyAdded(user)" class="user-result-action__added">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            Added
                          </span>
                          <span v-else class="user-result-action__add">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                            Add
                          </span>
                        </div>
                      </div>
                    </template>
                  </div>
                </transition>
              </div>

              <!-- Selected members chips -->
              <transition-group name="chip-list" tag="div" class="teams-selected-members" v-if="selectedMembers.length > 0">
                <div v-for="member in selectedMembers" :key="member.userEmail" class="teams-member-chip">
                  <div class="teams-member-chip__avatar">
                    <img v-if="member.userProfilePic" :src="member.userProfilePic" :alt="member.userName" />
                    <span v-else>{{ (member.userFirstName || '')[0] }}{{ (member.userLastName || '')[0] }}</span>
                  </div>
                  <span class="teams-member-chip__name">{{ member.userFirstName }} {{ member.userLastName }}</span>
                  <span class="teams-member-chip__username">@{{ member.userName }}</span>
                  <button class="teams-member-chip__remove" @click="removeMemberFromForm(member.userEmail)" title="Remove">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </transition-group>
              <p v-if="selectedMembers.length === 0" class="teams-member-hint">
                Search for teammates to add them to this team
              </p>
            </div>
            <!-- ==================== END MEMBER SEARCH ==================== -->
          </div>

          <div class="teams-form-actions">
            <button @click="cancelCreate" class="teams-btn teams-btn--ghost">Cancel</button>
            <button @click="submitTeam" class="teams-btn teams-btn--primary" :disabled="submitting || !formData.name">
              <svg v-if="!submitting" width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              <div v-else class="teams-spinner teams-spinner--sm teams-spinner--white"></div>
              {{ submitting ? 'Creating…' : 'Create Team' }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="teams-loading">
          <div class="teams-spinner"></div>
          <p>Loading teams…</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTeams.length === 0 && !showCreateForm" class="teams-empty">
          <div class="teams-empty__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>No teams yet</h3>
          <p>Create your first team to start collaborating</p>
          <button class="teams-btn teams-btn--primary" @click="showCreateForm = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            Create Team
          </button>
        </div>

        <!-- Teams Grid -->
        <div v-else-if="!showCreateForm" class="teams-grid">
          <div v-for="team in filteredTeams" :key="team.teamId" class="teams-card" @click="viewTeam(team)">
            <div class="teams-card__accent" :style="{ background: getRoleColor(team.myRole) }"></div>

            <div class="teams-card__top">
              <div class="teams-card__role-chip" :style="{ background: getRoleBg(team.myRole), color: getRoleText(team.myRole) }">
                {{ team.myRole }}
              </div>
              <div class="teams-card__menu-wrap" @click.stop>
                <button class="teams-card__more" @click="toggleMenu(team.teamId)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                <div v-if="activeMenu === team.teamId" class="teams-card__dropdown">
                  <div class="teams-dropdown__section">
                    <button @click="viewTeam(team)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      View Members
                    </button>
                    <button v-if="team.myRole === 'ADMIN'" @click="openAddMemberModal(team)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                        <path d="M20 8v6M23 11h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Add Member
                    </button>
                  </div>
                  <div v-if="team.myRole === 'ADMIN'" class="teams-dropdown__divider"></div>
                  <div v-if="team.myRole === 'ADMIN'" class="teams-dropdown__section">
                    <button @click="deleteTeam(team.teamId)" class="teams-dropdown-danger">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Delete Team
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="teams-card__body">
              <h3 class="teams-card__title">{{ team.teamName }}</h3>
              <p class="teams-card__desc">{{ team.description || 'No description provided.' }}</p>
            </div>

            <div class="teams-card__foot">
              <div class="teams-card__members">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ team.memberCount }} {{ team.memberCount === 1 ? 'member' : 'members' }}
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Panel - Team Details -->
      <aside v-if="selectedTeam" class="teams-details">
        <div class="teams-details__header">
          <h3>{{ selectedTeam.teamName }}</h3>
          <button @click="closeDetails" class="teams-icon-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="teams-details__info">
          <div class="teams-details__role" :style="{ background: getRoleBg(selectedTeam.myRole), color: getRoleText(selectedTeam.myRole) }">
            Your Role: {{ selectedTeam.myRole }}
          </div>
          <p class="teams-details__desc">{{ selectedTeam.description || 'No description' }}</p>
        </div>

        <div class="teams-details__section">
          <div class="teams-details__section-header">
            <h4>Team Members ({{ teamMembers.length }})</h4>
            <button v-if="selectedTeam.myRole === 'ADMIN'" @click="openAddMemberModal(selectedTeam)" class="teams-add-member-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Add
            </button>
          </div>

          <div v-if="loadingMembers" class="teams-details__loading">
            <div class="teams-spinner teams-spinner--sm"></div>
          </div>

          <div v-else class="teams-members-list">
            <div v-for="member in teamMembers" :key="member.userId" class="teams-member-item">
              <div class="teams-member-avatar">{{ member.firstName[0] }}{{ member.lastName[0] }}</div>
              <div class="teams-member-info">
                <p class="teams-member-name">{{ member.firstName }} {{ member.lastName }}</p>
                <p class="teams-member-username">@{{ member.username }}</p>
              </div>
              <div class="teams-member-role" :style="{ background: getRoleBg(member.role), color: getRoleText(member.role) }">
                {{ member.role }}
              </div>
              <div v-if="selectedTeam.myRole === 'ADMIN' && member.role !== 'ADMIN'" class="teams-member-actions" @click.stop>
                <button class="teams-member-action" @click="toggleMemberMenu(member.userId)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                <div v-if="activeMemberMenu === member.userId" class="teams-member-dropdown">
                  <button @click="updateMemberRole(member.userId, member.role === 'MEMBER' ? 'ADMIN' : 'MEMBER')">
                    {{ member.role === 'MEMBER' ? 'Make Admin' : 'Make Member' }}
                  </button>
                  <button @click="removeMember(member.userId)" class="teams-dropdown-danger">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- ==================== ADD MEMBER MODAL (GitHub-style) ==================== -->
    <div v-if="showAddMemberModal" class="teams-modal-overlay" @click.self="closeAddMemberModal">
      <div class="teams-modal" @click.stop>
        <div class="teams-modal__header">
          <div class="teams-modal__title-wrap">
            <div class="teams-modal__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M20 8v6M23 11h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <h3>Add Member</h3>
              <p class="teams-modal__subtitle">Search and add teammates to <strong>{{ modalTeam?.teamName }}</strong></p>
            </div>
          </div>
          <button @click="closeAddMemberModal" class="teams-icon-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="teams-modal__body">
          <!-- GitHub-style search in modal -->
          <div class="user-search-wrap" ref="modalSearchWrap">
            <div class="user-search-input-row">
              <div class="user-search-icon">
                <svg v-if="!modalSearchingUsers" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div v-else class="user-search-spinner"></div>
              </div>
              <input
                v-model="modalSearchQuery"
                type="text"
                class="user-search-input"
                placeholder="Search by username or email…"
                @input="onModalSearchInput"
                @focus="showModalDropdown = true"
                @keydown.escape="showModalDropdown = false"
                @keydown.down.prevent="navigateModalResults(1)"
                @keydown.up.prevent="navigateModalResults(-1)"
                @keydown.enter.prevent="selectModalHighlighted"
                ref="modalSearchInput"
                autocomplete="off"
              />
              <span v-if="modalSearchQuery" class="user-search-clear" @mousedown.prevent @click="clearModalSearch">✕</span>
            </div>

            <transition name="user-search-drop">
              <div v-if="showModalDropdown && (modalSearchResults.length > 0 || modalSearchingUsers || (modalSearchQuery.length >= 2 && !modalSearchingUsers))" class="user-search-dropdown">

                <div v-if="modalSearchingUsers" class="user-search-state">
                  <div class="user-search-state__spinner"></div>
                  <span>Searching for "{{ modalSearchQuery }}"…</span>
                </div>

                <div v-else-if="modalSearchResults.length === 0 && modalSearchQuery.length >= 2" class="user-search-state user-search-state--empty">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M23 11l-6 6M23 17l-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <div>
                    <p class="user-search-state__title">No users found</p>
                    <p class="user-search-state__sub">Try a different username or email</p>
                  </div>
                </div>

                <template v-else>
                  <div class="user-search-dropdown__header">{{ modalSearchResults.length }} result{{ modalSearchResults.length !== 1 ? 's' : '' }} found</div>
                  <div
                    v-for="(user, idx) in modalSearchResults"
                    :key="user.userEmail"
                    :class="['user-result-item', { 'is-highlighted': modalHighlightedIndex === idx }]"
                    @mouseenter="modalHighlightedIndex = idx"
                    @mouseleave="modalHighlightedIndex = -1"
                    @mousedown.prevent
                    @click="submitAddMember(user)"
                  >
                    <div class="user-result-avatar">
                      <img v-if="user.userProfilePic" :src="user.userProfilePic" :alt="user.userName" class="user-result-avatar__img" />
                      <span v-else class="user-result-avatar__initials">{{ (user.userFirstName || '')[0] }}{{ (user.userLastName || '')[0] }}</span>
                    </div>
                    <div class="user-result-info">
                      <div class="user-result-info__top">
                        <span class="user-result-name">{{ user.userFirstName }} {{ user.userLastName }}</span>
                        <span class="user-result-username">@{{ user.userName }}</span>
                      </div>
                      <span class="user-result-email">{{ user.userEmail }}</span>
                    </div>
                    <div class="user-result-action">
                      <span v-if="addingMember && addingMemberEmail === user.userEmail" class="user-result-action__loading">
                        <div class="user-search-spinner"></div>
                      </span>
                      <span v-else class="user-result-action__add">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Add
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </transition>
          </div>

          <p class="teams-modal__tip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Type at least 2 characters to search. Click a result to add them immediately.
          </p>
        </div>

        <div class="teams-modal__footer">
          <button @click="closeAddMemberModal" class="teams-btn teams-btn--ghost">Close</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="teams-toast">
      <div v-if="toast.show" :class="['teams-toast', `teams-toast--${toast.type}`]">
        <div class="teams-toast__icon">
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
import { apiRequest } from '@/utils/apiService';

export default {
  name: 'Teams',
  data() {
    return {
      teams: [],
      selectedTeam: null,
      teamMembers: [],
      loading: true,
      loadingMembers: false,
      showCreateForm: false,
      selectedRole: null,
      searchQuery: '',
      activeMenu: null,
      activeMemberMenu: null,
      submitting: false,

      // Create form member search
      memberSearchQuery: '',
      searchResults: [],
      selectedMembers: [],
      searchingUsers: false,
      showSearchDropdown: false,
      highlightedIndex: -1,
      searchTimeout: null,

      // Add member modal
      showAddMemberModal: false,
      modalTeam: null,
      modalSearchQuery: '',
      modalSearchResults: [],
      modalSearchingUsers: false,
      showModalDropdown: false,
      modalHighlightedIndex: -1,
      modalSearchTimeout: null,
      addingMember: false,
      addingMemberEmail: null,

      formData: { name: '', description: '' },
      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    filteredTeams() {
      let list = [...this.teams];
      if (this.selectedRole) list = list.filter(t => t.myRole === this.selectedRole);
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(t =>
          (t.teamName && t.teamName.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      }
      return list;
    },
    totalTeams() { return this.teams.length; },
    myTeamsCount() { return this.teams.filter(t => t.myRole === 'ADMIN').length; }
  },

  methods: {
    // ── Teams ──────────────────────────────────────────────────────────
    async loadTeams() {
      this.loading = true;
      try {
        const response = await apiRequest('/v1/dashboard/teams/joined', { method: 'GET' });
        const data = await response.json();
        this.teams = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load teams', 'error');
        this.teams = [];
      } finally {
        this.loading = false;
      }
    },

    async viewTeam(team) {
      this.selectedTeam = team;
      this.loadingMembers = true;
      this.activeMenu = null;
      try {
        const response = await apiRequest(`/v1/dashboard/teams/${team.teamId}/members/details`, { method: 'GET' });
        const data = await response.json();
        this.teamMembers = Array.isArray(data) ? data : [];
      } catch (e) {
        this.showToast('Failed to load team members', 'error');
        this.teamMembers = [];
      } finally {
        this.loadingMembers = false;
      }
    },

    closeDetails() {
      this.selectedTeam = null;
      this.teamMembers = [];
    },

    // ── Live user search (CREATE FORM) ─────────────────────────────────
    onMemberSearchInput() {
      clearTimeout(this.searchTimeout);
      this.highlightedIndex = -1;
      if (this.memberSearchQuery.length < 2) {
        this.searchResults = [];
        this.searchingUsers = false;
        return;
      }
      this.searchingUsers = true;
      this.showSearchDropdown = true;
      this.searchTimeout = setTimeout(() => this.doUserSearch(), 300);
    },

    async doUserSearch() {
      try {
        const response = await apiRequest('/v1/dashboard/users/search', {
          method: 'POST',
          body: JSON.stringify({ username: this.memberSearchQuery })
        });
        const data = await response.json();
        this.searchResults = Array.isArray(data) ? data : [];
      } catch (e) {
        this.searchResults = [];
      } finally {
        this.searchingUsers = false;
      }
    },

    navigateResults(dir) {
      if (!this.searchResults.length) return;
      this.highlightedIndex = Math.max(-1, Math.min(this.searchResults.length - 1, this.highlightedIndex + dir));
    },

    selectHighlighted() {
      if (this.highlightedIndex >= 0 && this.searchResults[this.highlightedIndex]) {
        this.addMemberToForm(this.searchResults[this.highlightedIndex]);
      }
    },

    addMemberToForm(user) {
      if (!this.isAlreadyAdded(user)) {
        this.selectedMembers.push(user);
      }
      this.memberSearchQuery = '';
      this.searchResults = [];
      this.showSearchDropdown = false;
      this.highlightedIndex = -1;
    },

    removeMemberFromForm(email) {
      this.selectedMembers = this.selectedMembers.filter(m => m.userEmail !== email);
    },

    clearMemberSearch() {
      this.memberSearchQuery = '';
      this.searchResults = [];
      this.showSearchDropdown = false;
      this.searchingUsers = false;
    },

    isAlreadyAdded(user) {
      return this.selectedMembers.some(m => m.userEmail === user.userEmail);
    },

    // ── Live user search (ADD MEMBER MODAL) ────────────────────────────
    onModalSearchInput() {
      clearTimeout(this.modalSearchTimeout);
      this.modalHighlightedIndex = -1;
      if (this.modalSearchQuery.length < 2) {
        this.modalSearchResults = [];
        this.modalSearchingUsers = false;
        return;
      }
      this.modalSearchingUsers = true;
      this.showModalDropdown = true;
      this.modalSearchTimeout = setTimeout(() => this.doModalUserSearch(), 300);
    },

    async doModalUserSearch() {
      try {
        const response = await apiRequest('/v1/dashboard/users/search', {
          method: 'POST',
          body: JSON.stringify({ username: this.modalSearchQuery })
        });
        const data = await response.json();
        this.modalSearchResults = Array.isArray(data) ? data : [];
      } catch (e) {
        this.modalSearchResults = [];
      } finally {
        this.modalSearchingUsers = false;
      }
    },

    navigateModalResults(dir) {
      if (!this.modalSearchResults.length) return;
      this.modalHighlightedIndex = Math.max(-1, Math.min(this.modalSearchResults.length - 1, this.modalHighlightedIndex + dir));
    },

    selectModalHighlighted() {
      if (this.modalHighlightedIndex >= 0 && this.modalSearchResults[this.modalHighlightedIndex]) {
        this.submitAddMember(this.modalSearchResults[this.modalHighlightedIndex]);
      }
    },

    clearModalSearch() {
      this.modalSearchQuery = '';
      this.modalSearchResults = [];
      this.showModalDropdown = false;
      this.modalSearchingUsers = false;
    },

    openAddMemberModal(team) {
      this.modalTeam = team;
      this.showAddMemberModal = true;
      this.clearModalSearch();
      this.activeMenu = null;
      this.$nextTick(() => {
        this.$refs.modalSearchInput?.focus();
      });
    },

    closeAddMemberModal() {
      this.showAddMemberModal = false;
      this.modalTeam = null;
      this.clearModalSearch();
    },

    // ── POST add member directly on click ────────────────────────────
    async submitAddMember(user) {
      if (this.addingMember) return;
      try {
        this.addingMember = true;
        this.addingMemberEmail = user.userEmail;
        const response = await apiRequest(`/v1/dashboard/teams/${this.modalTeam.teamId}/members`, {
          method: 'POST',
          body: JSON.stringify({ searchMethod: 'EMAIL', memberIdentifier: user.userEmail })
        });
        if (response.ok) {
          this.showToast(`${user.userFirstName} ${user.userLastName} added!`, 'success');
          this.closeAddMemberModal();
          await this.loadTeams();
          if (this.selectedTeam?.teamId === this.modalTeam?.teamId) {
            await this.viewTeam(this.selectedTeam);
          }
        } else {
          const err = await response.json();
          throw new Error(err.error || 'Failed to add member');
        }
      } catch (e) {
        this.showToast(e.message || 'Failed to add member', 'error');
      } finally {
        this.addingMember = false;
        this.addingMemberEmail = null;
      }
    },

    // ── Create team ───────────────────────────────────────────────────
    async submitTeam() {
      try {
        this.submitting = true;
        const memberIds = this.selectedMembers.map(m => m.userEmail);
        const response = await apiRequest('/v1/dashboard/teams', {
          method: 'POST',
          body: JSON.stringify({ name: this.formData.name, description: this.formData.description, memberIds })
        });
        if (response.ok) {
          this.showToast('Team created successfully!', 'success');
          this.cancelCreate();
          await this.loadTeams();
        } else {
          const err = await response.json();
          throw new Error(err.error || 'Failed to create team');
        }
      } catch (e) {
        this.showToast(e.message || 'Failed to create team', 'error');
      } finally {
        this.submitting = false;
      }
    },

    cancelCreate() {
      this.showCreateForm = false;
      this.formData = { name: '', description: '' };
      this.selectedMembers = [];
      this.clearMemberSearch();
    },

    async deleteTeam(teamId) {
      if (!confirm('Are you sure you want to delete this team?')) return;
      try {
        const response = await apiRequest(`/v1/dashboard/teams/${teamId}`, { method: 'DELETE' });
        if (response.ok) {
          this.teams = this.teams.filter(t => t.teamId !== teamId);
          this.showToast('Team deleted', 'success');
          if (this.selectedTeam?.teamId === teamId) this.closeDetails();
        } else {
          const err = await response.json();
          throw new Error(err.error || 'Failed to delete team');
        }
      } catch (e) {
        this.showToast(e.message || 'Failed to delete', 'error');
      }
      this.activeMenu = null;
    },

    async updateMemberRole(memberId, newRole) {
      try {
        const response = await apiRequest(`/v1/dashboard/teams/${this.selectedTeam.teamId}/members/${memberId}/role?role=${newRole}`, { method: 'PATCH' });
        if (response.ok) {
          this.showToast('Role updated!', 'success');
          await this.viewTeam(this.selectedTeam);
        } else {
          const err = await response.json();
          throw new Error(err.error || 'Failed to update role');
        }
      } catch (e) {
        this.showToast(e.message || 'Failed to update role', 'error');
      }
      this.activeMemberMenu = null;
    },

    async removeMember(memberId) {
      if (!confirm('Remove this member from the team?')) return;
      try {
        const response = await apiRequest(`/v1/dashboard/teams/${this.selectedTeam.teamId}/members/${memberId}`, { method: 'DELETE' });
        if (response.ok) {
          this.showToast('Member removed', 'success');
          await this.viewTeam(this.selectedTeam);
          await this.loadTeams();
        } else {
          const err = await response.json();
          throw new Error(err.error || 'Failed to remove member');
        }
      } catch (e) {
        this.showToast(e.message || 'Failed to remove member', 'error');
      }
      this.activeMemberMenu = null;
    },

    filterByRole(role) { this.selectedRole = this.selectedRole === role ? null : role; },
    toggleMenu(id) { this.activeMenu = this.activeMenu === id ? null : id; },
    toggleMemberMenu(id) { this.activeMemberMenu = this.activeMemberMenu === id ? null : id; },

    getRoleColor(role) { return role === 'ADMIN' ? '#f59e0b' : '#10b981'; },
    getRoleBg(role)    { return role === 'ADMIN' ? '#fef3c7' : '#d1fae5'; },
    getRoleText(role)  { return role === 'ADMIN' ? '#92400e' : '#065f46'; },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3500);
    }
  },

  async mounted() {
    await this.loadTeams();
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      this.activeMenu = null;
      this.activeMemberMenu = null;
      // Close create form search dropdown if clicking outside
      if (this.$refs.createSearchWrap && !this.$refs.createSearchWrap.contains(e.target)) {
        this.showSearchDropdown = false;
      }
      // Close modal search dropdown if clicking outside
      if (this.$refs.modalSearchWrap && !this.$refs.modalSearchWrap.contains(e.target)) {
        this.showModalDropdown = false;
      }
    });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&display=swap');

/* ══════════════════════════ CORE VARS ══════════════════════════ */
.teams-root {
  --ink:#0f172a;--ink-2:#475569;--ink-3:#94a3b8;--ink-4:#cbd5e1;
  --border:#e2e8f0;--border-2:#f1f5f9;--bg:#f8fafc;--bg-2:#f1f5f9;--white:#ffffff;
  --primary:#6366f1;--primary-dk:#4f46e5;--primary-lt:#818cf8;--primary-soft:#eef2ff;
  --green:#10b981;--green-soft:#d1fae5;--red:#ef4444;--red-soft:#fee2e2;
  --amber:#f59e0b;--amber-soft:#fef3c7;
  --shadow-xs:0 1px 2px rgba(15,23,42,0.05);
  --shadow-sm:0 1px 4px rgba(15,23,42,0.08),0 0 0 1px rgba(15,23,42,0.03);
  --shadow-md:0 4px 16px rgba(15,23,42,0.10),0 1px 4px rgba(15,23,42,0.05);
  --shadow-lg:0 12px 32px rgba(15,23,42,0.13),0 2px 8px rgba(15,23,42,0.07);
  --shadow-xl:0 24px 48px rgba(15,23,42,0.15),0 4px 12px rgba(15,23,42,0.08);
  --r-sm:6px;--r:10px;--r-md:14px;--r-lg:18px;--ease:cubic-bezier(0.22,1,0.36,1);
  min-height:100vh;background:var(--bg);font-family:'DM Sans',system-ui,sans-serif;
  font-size:14px;color:var(--ink);display:flex;flex-direction:column;-webkit-font-smoothing:antialiased;
}
.teams-root * { box-sizing:border-box;margin:0;padding:0; }

/* ══════════════════════════ HEADER ══════════════════════════ */
.teams-header{background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);height:60px;position:sticky;top:0;z-index:200;}
.teams-header__inner{height:100%;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.teams-brand{display:flex;align-items:center;gap:10px;flex-shrink:0;user-select:none;}
.teams-brand__icon{display:flex;filter:drop-shadow(0 2px 8px rgba(99,102,241,0.28));}
.teams-brand__text{display:flex;flex-direction:column;line-height:1.2;}
.teams-brand__name{font-size:15px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;letter-spacing:-0.3px;}
.teams-brand__sub{font-size:10px;font-weight:600;color:var(--ink-3);}
.teams-header__actions{display:flex;align-items:center;gap:8px;}

/* ══════════════════════════ BUTTONS ══════════════════════════ */
.teams-btn{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 16px;border-radius:var(--r);font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s var(--ease);border:none;outline:none;white-space:nowrap;}
.teams-btn:disabled{opacity:0.5;cursor:not-allowed;}
.teams-btn--primary{background:var(--primary);color:var(--white);box-shadow:0 1px 3px rgba(99,102,241,0.3),inset 0 1px 0 rgba(255,255,255,0.15);}
.teams-btn--primary:hover:not(:disabled){background:var(--primary-dk);transform:translateY(-1px);box-shadow:0 6px 18px rgba(99,102,241,0.35);}
.teams-btn--ghost{background:var(--white);border:1px solid var(--border);color:var(--ink-2);box-shadow:var(--shadow-xs);}
.teams-btn--ghost:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-soft);}
.teams-icon-btn{width:32px;height:32px;border-radius:var(--r-sm);border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink-3);transition:all 0.15s;}
.teams-icon-btn:hover{background:var(--bg-2);color:var(--ink);}
.teams-add-member-btn{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:var(--r-sm);background:var(--primary-soft);border:1px solid rgba(99,102,241,0.2);color:var(--primary);font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;}
.teams-add-member-btn:hover{background:var(--primary);color:var(--white);}

/* ══════════════════════════ LAYOUT ══════════════════════════ */
.teams-layout{display:grid;grid-template-columns:236px 1fr 320px;flex:1;height:calc(100vh - 60px);overflow:hidden;}

/* ══════════════════════════ SIDEBAR ══════════════════════════ */
.teams-sidebar{background:var(--white);border-right:1px solid var(--border);padding:20px 14px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:22px;}
.teams-nav__label{font-size:9.5px;font-weight:800;color:var(--ink-3);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;padding:0 8px;}
.teams-nav__item{display:flex;align-items:center;gap:9px;height:38px;padding:0 10px;border-radius:var(--r);color:var(--ink-2);font-size:13px;font-weight:500;text-decoration:none;cursor:pointer;transition:all 0.15s;margin-bottom:2px;}
.teams-nav__item:hover{background:var(--bg-2);color:var(--ink);}
.teams-nav__item--active,.teams-nav__item.router-link-active{background:var(--primary-soft);color:var(--primary);font-weight:700;box-shadow:inset 3px 0 0 var(--primary);}
.teams-stats{background:linear-gradient(140deg,var(--primary) 0%,var(--primary-dk) 100%);border-radius:var(--r-md);padding:16px;color:var(--white);box-shadow:0 4px 16px rgba(99,102,241,0.32);position:relative;overflow:hidden;}
.teams-stats::after{content:'';position:absolute;top:-30px;right:-30px;width:100px;height:100px;background:rgba(255,255,255,0.07);border-radius:50%;}
.teams-stats__title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:12px;opacity:0.8;}
.teams-stats__grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.teams-stat{text-align:center;background:rgba(255,255,255,0.12);border-radius:var(--r);padding:10px 8px;border:1px solid rgba(255,255,255,0.1);}
.teams-stat__value{font-size:26px;font-weight:900;font-family:'Fraunces',serif;line-height:1;margin-bottom:3px;}
.teams-stat__label{font-size:10px;font-weight:600;opacity:0.8;}
.teams-filter{border:1px solid var(--border);border-radius:var(--r-md);padding:14px;}
.teams-filter__title{font-size:11px;font-weight:800;color:var(--ink);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;}
.teams-filter__list{display:flex;flex-direction:column;gap:1px;}
.teams-filter__item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:var(--r-sm);font-size:12px;color:var(--ink-2);background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;text-align:left;}
.teams-filter__item:hover{background:var(--bg-2);color:var(--ink);}
.teams-filter__item.is-active{background:var(--primary-soft);color:var(--primary);font-weight:600;}
.teams-filter__dot{width:8px;height:8px;border-radius:3px;flex-shrink:0;}
.teams-filter__check{margin-left:auto;font-size:10px;color:var(--primary);}

/* ══════════════════════════ CONTENT ══════════════════════════ */
.teams-content{padding:28px;overflow-y:auto;height:100%;background:var(--bg);}
.teams-page-header{margin-bottom:24px;}
.teams-page-title{font-size:28px;font-weight:900;color:var(--ink);font-family:'Fraunces',serif;margin-bottom:4px;letter-spacing:-0.5px;line-height:1.1;}
.teams-page-sub{font-size:14px;color:var(--ink-2);}
.teams-controls{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.teams-search{flex:1;min-width:220px;max-width:360px;position:relative;display:flex;align-items:center;}
.teams-search>svg{position:absolute;left:12px;color:var(--ink-3);pointer-events:none;}
.teams-search__input{width:100%;height:40px;padding:0 34px 0 40px;border:1px solid var(--border);border-radius:var(--r);font-size:13px;font-family:'DM Sans',sans-serif;background:var(--white);color:var(--ink);outline:none;transition:all 0.2s;box-shadow:var(--shadow-xs);}
.teams-search__input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.12);}
.teams-search__input::placeholder{color:var(--ink-4);}
.teams-search__clear{position:absolute;right:11px;color:var(--ink-3);font-size:11px;cursor:pointer;}

/* ══════════════════════════ CREATE FORM ══════════════════════════ */
.teams-create-form{background:var(--white);border:1px solid var(--border);border-radius:var(--r-md);padding:24px;margin-bottom:20px;box-shadow:var(--shadow-md);}
.teams-create-form__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.teams-create-form__title-wrap{display:flex;align-items:center;gap:10px;}
.teams-create-form__icon{width:32px;height:32px;background:var(--primary-soft);border-radius:var(--r);display:flex;align-items:center;justify-content:center;color:var(--primary);}
.teams-create-form__header h3{font-size:16px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;}
.teams-form-grid{display:grid;grid-template-columns:1fr;gap:14px;margin-bottom:20px;}
.teams-form-group{display:flex;flex-direction:column;gap:6px;}
.teams-form-group--full{grid-column:1/-1;}
.teams-form-group label{font-size:12px;font-weight:700;color:var(--ink);}
.teams-optional{font-weight:500;color:var(--ink-3);font-size:11px;}
.teams-req{color:var(--red);margin-left:2px;}
.teams-input{width:100%;padding:9px 13px;border:1px solid var(--border);border-radius:var(--r);font-size:13px;font-family:'DM Sans',sans-serif;color:var(--ink);background:var(--white);outline:none;transition:all 0.2s;}
.teams-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.10);}
.teams-input::placeholder{color:var(--ink-4);}
.teams-textarea-sm{resize:vertical;min-height:58px;}
.teams-form-actions{display:flex;gap:8px;justify-content:flex-end;}

/* ══════════════════════════ GITHUB-STYLE USER SEARCH ══════════════════════════ */
.user-search-wrap { position:relative; }

.user-search-input-row {
  display:flex;align-items:center;
  border:2px solid var(--border);border-radius:var(--r);
  background:var(--white);transition:all 0.2s;overflow:hidden;
}
.user-search-input-row:focus-within {
  border-color:var(--primary);
  box-shadow:0 0 0 3px rgba(99,102,241,0.12);
}
.user-search-icon {
  width:42px;display:flex;align-items:center;justify-content:center;
  color:var(--ink-3);flex-shrink:0;
}
.user-search-input {
  flex:1;height:42px;border:none;outline:none;background:transparent;
  font-size:13px;font-family:'DM Sans',sans-serif;color:var(--ink);
}
.user-search-input::placeholder{color:var(--ink-4);}
.user-search-clear {
  width:32px;height:32px;display:flex;align-items:center;justify-content:center;
  margin-right:5px;color:var(--ink-4);cursor:pointer;font-size:11px;
  border-radius:var(--r-sm);flex-shrink:0;transition:all 0.15s;
}
.user-search-clear:hover{background:var(--bg-2);color:var(--ink);}

.user-search-spinner {
  width:14px;height:14px;border:2px solid var(--border);
  border-top-color:var(--primary);border-radius:50%;
  animation:spin 0.6s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}

/* Dropdown */
.user-search-dropdown {
  position:absolute;top:calc(100% + 6px);left:0;right:0;
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r-md);box-shadow:var(--shadow-xl);
  z-index:500;overflow:hidden;max-height:320px;overflow-y:auto;
}
.user-search-dropdown__header {
  padding:8px 14px 6px;font-size:10px;font-weight:800;
  color:var(--ink-3);text-transform:uppercase;letter-spacing:0.7px;
  border-bottom:1px solid var(--border-2);
}

/* Result items */
.user-result-item {
  display:flex;align-items:center;gap:12px;
  padding:10px 14px;cursor:pointer;transition:background 0.12s;
  border-bottom:1px solid var(--border-2);
}
.user-result-item:last-child{border-bottom:none;}
.user-result-item.is-highlighted{background:var(--primary-soft);}
.user-result-item.is-added{opacity:0.65;}

/* Avatar */
.user-result-avatar {
  width:38px;height:38px;border-radius:50%;
  background:var(--primary-soft);flex-shrink:0;
  position:relative;overflow:hidden;
}
.user-result-avatar__img{width:100%;height:100%;object-fit:cover;}
.user-result-avatar__initials {
  width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:800;color:var(--primary);text-transform:uppercase;
}
.user-result-avatar__check {
  position:absolute;bottom:-1px;right:-1px;width:16px;height:16px;
  background:var(--green);border-radius:50%;border:2px solid var(--white);
  display:flex;align-items:center;justify-content:center;
}

/* Info */
.user-result-info{flex:1;min-width:0;}
.user-result-info__top{display:flex;align-items:baseline;gap:6px;margin-bottom:2px;}
.user-result-name{font-size:13px;font-weight:700;color:var(--ink);white-space:nowrap;}
.user-result-username{font-size:11px;color:var(--ink-3);font-family:'DM Mono',monospace;white-space:nowrap;}
.user-result-email{font-size:11px;color:var(--ink-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;}

/* Action badge */
.user-result-action{flex-shrink:0;}
.user-result-action__add {
  display:inline-flex;align-items:center;gap:4px;
  padding:4px 10px;border-radius:var(--r-sm);
  background:var(--primary-soft);color:var(--primary);
  font-size:11px;font-weight:700;transition:all 0.15s;
}
.user-result-item.is-highlighted .user-result-action__add {
  background:var(--primary);color:var(--white);
}
.user-result-action__added {
  display:inline-flex;align-items:center;gap:4px;
  padding:4px 10px;border-radius:var(--r-sm);
  background:var(--green-soft);color:var(--green);
  font-size:11px;font-weight:700;
}
.user-result-action__loading{display:flex;align-items:center;justify-content:center;width:52px;}

/* Empty / searching state */
.user-search-state {
  display:flex;align-items:center;gap:12px;padding:18px 16px;color:var(--ink-3);
}
.user-search-state__spinner{width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 0.6s linear infinite;flex-shrink:0;}
.user-search-state>span{font-size:13px;color:var(--ink-2);}
.user-search-state--empty{gap:14px;}
.user-search-state--empty svg{flex-shrink:0;opacity:0.5;}
.user-search-state__title{font-size:13px;font-weight:600;color:var(--ink);margin-bottom:2px;}
.user-search-state__sub{font-size:11px;color:var(--ink-3);}

/* Dropdown animation */
.user-search-drop-enter-active,.user-search-drop-leave-active{transition:all 0.18s var(--ease);}
.user-search-drop-enter-from,.user-search-drop-leave-to{opacity:0;transform:translateY(-6px) scale(0.98);}

/* Selected member chips */
.teams-selected-members {
  display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;
}
.teams-member-chip {
  display:inline-flex;align-items:center;gap:7px;
  padding:5px 10px 5px 6px;
  background:var(--primary-soft);border:1px solid rgba(99,102,241,0.2);
  border-radius:999px;font-size:12px;transition:all 0.15s;
}
.teams-member-chip__avatar {
  width:22px;height:22px;border-radius:50%;background:var(--primary);
  display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;
}
.teams-member-chip__avatar img{width:100%;height:100%;object-fit:cover;}
.teams-member-chip__avatar span{font-size:9px;font-weight:800;color:var(--white);text-transform:uppercase;}
.teams-member-chip__name{font-weight:700;color:var(--primary);}
.teams-member-chip__username{font-size:10px;color:var(--primary-lt);font-family:'DM Mono',monospace;}
.teams-member-chip__remove {
  width:16px;height:16px;border-radius:50%;border:none;background:rgba(99,102,241,0.2);
  color:var(--primary);cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all 0.15s;padding:0;flex-shrink:0;
}
.teams-member-chip__remove:hover{background:var(--red);color:var(--white);}

/* Chip list animations */
.chip-list-enter-active{transition:all 0.2s var(--ease);}
.chip-list-leave-active{transition:all 0.15s;}
.chip-list-enter-from{opacity:0;transform:scale(0.85);}
.chip-list-leave-to{opacity:0;transform:scale(0.85);}

.teams-member-hint{font-size:11px;color:var(--ink-4);margin-top:8px;font-style:italic;}

/* Spinner variants */
.teams-spinner{width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 0.65s linear infinite;}
.teams-spinner--sm{width:18px;height:18px;border-width:2px;}
.teams-spinner--white{border-color:rgba(255,255,255,0.3);border-top-color:var(--white);}

/* ══════════════════════════ LOADING / EMPTY ══════════════════════════ */
.teams-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:280px;background:var(--white);border-radius:var(--r-md);border:1px solid var(--border);gap:14px;}
.teams-loading p{font-size:14px;color:var(--ink-2);}
.teams-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:340px;background:var(--white);border-radius:var(--r-md);border:1px dashed var(--border);gap:12px;text-align:center;padding:48px;}
.teams-empty__icon{width:72px;height:72px;background:var(--bg-2);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;color:var(--ink-3);margin-bottom:8px;}
.teams-empty h3{font-size:18px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;}
.teams-empty p{font-size:14px;color:var(--ink-2);max-width:260px;line-height:1.5;}

/* ══════════════════════════ CARDS ══════════════════════════ */
.teams-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px;}
.teams-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-md);padding:18px;cursor:pointer;transition:all 0.22s var(--ease);display:flex;flex-direction:column;gap:12px;position:relative;overflow:visible;box-shadow:var(--shadow-xs);}
.teams-card__accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r-md) var(--r-md) 0 0;opacity:0;transition:opacity 0.22s;}
.teams-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:transparent;}
.teams-card:hover .teams-card__accent{opacity:1;}
.teams-card__top{display:flex;align-items:center;justify-content:space-between;}
.teams-card__role-chip{padding:4px 10px;border-radius:var(--r-sm);font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:0.6px;}
.teams-card__menu-wrap{position:relative;z-index:10;}
.teams-card__more{width:30px;height:30px;border:none;background:none;border-radius:var(--r-sm);color:var(--ink-3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.teams-card__more:hover{background:var(--bg-2);color:var(--ink);}
.teams-card__dropdown{position:absolute;top:calc(100% + 6px);right:0;background:var(--white);border:1px solid var(--border);border-radius:var(--r-md);box-shadow:var(--shadow-xl);z-index:1000;min-width:180px;overflow:hidden;animation:drop-in 0.15s var(--ease);}
@keyframes drop-in{from{opacity:0;transform:translateY(-8px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
.teams-dropdown__section{padding:4px;}
.teams-dropdown__divider{height:1px;background:var(--border);}
.teams-card__dropdown button{width:100%;display:flex;align-items:center;gap:9px;padding:10px 14px;border:none;background:none;font-size:13px;font-weight:500;color:var(--ink);cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.12s;text-align:left;border-radius:var(--r-sm);white-space:nowrap;}
.teams-card__dropdown button:hover{background:var(--bg-2);}
.teams-dropdown-danger{color:var(--red)!important;}
.teams-dropdown-danger:hover{background:var(--red-soft)!important;}
.teams-card__body{flex:1;min-width:0;}
.teams-card__title{font-size:15px;font-weight:700;color:var(--ink);font-family:'Fraunces',serif;margin-bottom:5px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.teams-card__desc{font-size:12px;color:var(--ink-2);line-height:1.55;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.teams-card__foot{display:flex;align-items:center;padding-top:10px;border-top:1px solid var(--border-2);}
.teams-card__members{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--ink-3);}

/* ══════════════════════════ DETAILS PANEL ══════════════════════════ */
.teams-details{background:var(--white);border-left:1px solid var(--border);padding:20px 16px;overflow-y:auto;height:100%;display:flex;flex-direction:column;}
.teams-details__header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.teams-details__header h3{font-size:16px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;}
.teams-details__info{margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border);}
.teams-details__role{display:inline-flex;padding:5px 12px;border-radius:var(--r-sm);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;}
.teams-details__desc{font-size:13px;color:var(--ink-2);line-height:1.55;}
.teams-details__section{flex:1;}
.teams-details__section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.teams-details__section-header h4{font-size:13px;font-weight:800;color:var(--ink);text-transform:uppercase;letter-spacing:0.5px;}
.teams-details__loading{display:flex;justify-content:center;padding:28px 0;}
.teams-members-list{display:flex;flex-direction:column;gap:4px;}
.teams-member-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--r);border:1px solid transparent;transition:all 0.15s;}
.teams-member-item:hover{border-color:var(--border);background:var(--bg-2);}
.teams-member-avatar{width:36px;height:36px;border-radius:50%;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}
.teams-member-info{flex:1;min-width:0;}
.teams-member-name{font-size:13px;font-weight:600;color:var(--ink);margin-bottom:2px;}
.teams-member-username{font-size:11px;color:var(--ink-3);}
.teams-member-role{padding:3px 8px;border-radius:var(--r-sm);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;}
.teams-member-actions{position:relative;z-index:20;}
.teams-member-action{width:26px;height:26px;border-radius:var(--r-sm);border:none;background:none;color:var(--ink-3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.teams-member-action:hover{background:var(--bg-2);color:var(--ink);}
.teams-member-dropdown{position:absolute;top:calc(100% + 4px);right:0;background:var(--white);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow-lg);z-index:1000;min-width:150px;overflow:hidden;}
.teams-member-dropdown button{width:100%;display:flex;align-items:center;gap:8px;padding:8px 12px;border:none;background:none;font-size:12px;font-weight:500;color:var(--ink);cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.12s;text-align:left;}
.teams-member-dropdown button:hover{background:var(--bg-2);}

/* ══════════════════════════ MODAL ══════════════════════════ */
.teams-modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:24px;animation:fade-in 0.2s;}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
.teams-modal{background:var(--white);border-radius:var(--r-lg);box-shadow:var(--shadow-xl);width:100%;max-width:520px;border:1px solid var(--border);animation:modal-in 0.25s var(--ease);}
@keyframes modal-in{from{opacity:0;transform:scale(0.95) translateY(-16px)}to{opacity:1;transform:scale(1) translateY(0)}}
.teams-modal__header{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border);}
.teams-modal__title-wrap{display:flex;align-items:flex-start;gap:12px;}
.teams-modal__icon{width:36px;height:36px;border-radius:var(--r);background:var(--primary-soft);display:flex;align-items:center;justify-content:center;color:var(--primary);flex-shrink:0;margin-top:1px;}
.teams-modal__header h3{font-size:16px;font-weight:800;color:var(--ink);font-family:'Fraunces',serif;margin-bottom:3px;}
.teams-modal__subtitle{font-size:12px;color:var(--ink-3);}
.teams-modal__subtitle strong{color:var(--ink-2);}
.teams-modal__body{padding:20px 24px;}
.teams-modal__tip{display:flex;align-items:center;gap:7px;margin-top:12px;font-size:11px;color:var(--ink-3);}
.teams-modal__tip svg{flex-shrink:0;}
.teams-modal__footer{display:flex;gap:8px;justify-content:flex-end;padding:14px 24px;border-top:1px solid var(--border);}

/* ══════════════════════════ TOAST ══════════════════════════ */
.teams-toast{position:fixed;bottom:24px;right:24px;display:flex;align-items:center;gap:10px;padding:12px 18px;background:var(--white);border-radius:var(--r-md);box-shadow:var(--shadow-xl);font-size:13px;font-weight:600;z-index:2000;border:1px solid var(--border);min-width:250px;}
.teams-toast__icon{width:28px;height:28px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.teams-toast--success{border-left:3px solid var(--green);}
.teams-toast--success .teams-toast__icon{background:var(--green-soft);color:var(--green);}
.teams-toast--error{border-left:3px solid var(--red);}
.teams-toast--error .teams-toast__icon{background:var(--red-soft);color:var(--red);}
.teams-toast-enter-active,.teams-toast-leave-active{transition:all 0.3s var(--ease);}
.teams-toast-enter-from,.teams-toast-leave-to{opacity:0;transform:translateY(10px) scale(0.97);}

/* ══════════════════════════ RESPONSIVE ══════════════════════════ */
@media(max-width:1200px){.teams-layout{grid-template-columns:220px 1fr}.teams-details{display:none}}
@media(max-width:900px){.teams-layout{grid-template-columns:1fr}.teams-sidebar{display:none}}
@media(max-width:640px){.teams-grid{grid-template-columns:1fr}.teams-content{padding:16px}}
</style>