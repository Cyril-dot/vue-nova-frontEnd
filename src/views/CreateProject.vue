<!-- CreateProject.vue -->
<!-- Dedicated Page for Creating/Editing Projects -->
<template>
  <div class="dashboard-layout">
    <!-- Top Navigation (Same as Dashboard) -->
    <nav class="top-bar">
      <div class="top-bar-content">
        <div class="nav-left">
          <button class="back-btn" @click="goBack">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to Projects
          </button>
        </div>

        <div class="nav-right">
          <button @click="handleLogout" class="icon-btn" title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="user-avatar">{{ userInitials }}</div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-group">
        <div class="group-label">MAIN</div>
        <nav class="nav-menu">
          <router-link to="/dashboard" class="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Dashboard</span>
          </router-link>

          <a href="#" class="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>My Tasks</span>
          </a>

          <router-link to="/projects" class="nav-link active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Projects</span>
          </router-link>

          <a href="#" class="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Calendar</span>
          </a>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-area">
      <!-- Page Header -->
      <header class="page-top">
        <div>
          <h1 class="page-title">{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h1>
          <p class="page-subtitle">{{ isEditing ? 'Update your project details' : 'Fill in the details to create your project' }}</p>
        </div>
      </header>

      <!-- Form Content -->
      <div class="form-container">
        <form @submit.prevent="submitProject" class="project-form">
          <!-- Project Name -->
          <div class="form-section">
            <h3 class="section-title">Project Information</h3>
            
            <div class="form-group">
              <label>Project Name *</label>
              <input 
                type="text" 
                v-model="projectForm.title"
                required
                placeholder="Enter project name"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea 
                v-model="projectForm.description"
                rows="6"
                placeholder="Describe your project in detail..."
                class="form-textarea"
              ></textarea>
            </div>
          </div>

          <!-- Timeline -->
          <div class="form-section">
            <h3 class="section-title">Timeline & Status</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Start Date *</label>
                <input 
                  type="date" 
                  v-model="projectForm.startDate"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>End Date *</label>
                <input 
                  type="date" 
                  v-model="projectForm.endDate"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Status *</label>
              <select v-model="projectForm.status" required class="form-select">
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <!-- Documents -->
          <div class="form-section">
            <h3 class="section-title">Documents (Optional)</h3>
            
            <div class="form-group">
              <label>Upload Files</label>
              <div class="file-upload-area">
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileChange"
                  multiple
                  id="file-input"
                  class="file-input-hidden"
                />
                <label for="file-input" class="file-upload-label">
                  <div class="upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="upload-text">
                    <span class="upload-title">Click to upload files</span>
                    <span class="upload-hint">or drag and drop</span>
                  </div>
                </label>

                <!-- Selected Files List -->
                <div v-if="selectedFiles.length > 0" class="selected-files">
                  <div class="files-header">
                    <span class="files-count">{{ selectedFiles.length }} file(s) selected</span>
                    <button type="button" @click="clearFiles" class="btn-clear">Clear All</button>
                  </div>
                  <div class="files-list">
                    <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/>
                        <path d="M13 2v7h7" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      <button type="button" @click="removeFile(index)" class="btn-remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="selectedFiles.length > 0">
              <label>Document Description</label>
              <input 
                type="text" 
                v-model="projectForm.documentDescription"
                placeholder="Brief description of the documents"
                class="form-input"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="goBack">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <svg v-if="!submitting" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2"/>
                <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div v-else class="btn-spinner"></div>
              {{ submitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project') }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
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
import { TokenService, apiRequest, AuthAPI } from '@/utils/apiService';

export default {
  name: 'CreateProject',
  data() {
    return {
      projectForm: {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'PLANNING',
        documentDescription: ''
      },
      selectedFiles: [],
      submitting: false,
      isEditing: false,
      projectId: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      userData: null
    };
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
    async submitProject() {
      try {
        this.submitting = true;

        // Log what we're sending for debugging
        console.log('📤 Submitting project:', {
          title: this.projectForm.title,
          description: this.projectForm.description,
          startDate: this.projectForm.startDate,
          endDate: this.projectForm.endDate,
          status: this.projectForm.status,
          hasFiles: this.selectedFiles.length > 0
        });

        // Check if there are files to upload
        const hasFiles = this.selectedFiles.length > 0;

        if (hasFiles) {
          // Use FormData for multipart/form-data (with files)
          await this.submitWithFiles();
        } else {
          // Use JSON for application/json (without files)
          await this.submitAsJson();
        }
        
      } catch (error) {
        console.error('❌ Error saving project:', error);
        this.showToast(error.message || 'Failed to save project', 'error');
      } finally {
        this.submitting = false;
      }
    },

    async submitAsJson() {
      // Prepare JSON payload with properly formatted dates
      const projectData = {
        title: this.projectForm.title.trim(),
        description: this.projectForm.description?.trim() || null,
        startDate: this.projectForm.startDate || null,  // Will be YYYY-MM-DD or null
        endDate: this.projectForm.endDate || null,      // Will be YYYY-MM-DD or null
        status: this.projectForm.status
      };

      // ✅ CRITICAL: Log the exact JSON being sent
      console.log('📨 JSON Payload:', JSON.stringify(projectData, null, 2));

      const endpoint = this.isEditing 
        ? `/projects/${this.projectId}`
        : '/projects';
      
      const method = this.isEditing ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Server error response:', error);
        throw new Error(error.message || error.error || 'Failed to save project');
      }

      const result = await response.json();
      console.log('✅ Project saved successfully:', result);

      this.showToast(
        this.isEditing ? 'Project updated successfully!' : 'Project created successfully!',
        'success'
      );
      
      // Redirect back to projects page after 1 second
      setTimeout(() => {
        this.$router.push('/projects');
      }, 1000);
    },

    async submitWithFiles() {
      // Use FormData for multipart/form-data (with files)
      const formData = new FormData();
      
      formData.append('title', this.projectForm.title.trim());
      formData.append('description', this.projectForm.description?.trim() || '');
      formData.append('startDate', this.projectForm.startDate || '');
      formData.append('endDate', this.projectForm.endDate || '');
      formData.append('status', this.projectForm.status);

      // Append files
      this.selectedFiles.forEach(file => {
        formData.append('documents', file);
      });
      
      if (this.projectForm.documentDescription) {
        formData.append('documentDescription', this.projectForm.documentDescription.trim());
      }

      // Log FormData contents
      console.log('📨 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, `File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      const endpoint = this.isEditing 
        ? `/projects/${this.projectId}`
        : '/projects';
      
      const method = this.isEditing ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method,
        body: formData
        // Note: Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Server error response:', error);
        throw new Error(error.message || error.error || 'Failed to save project');
      }

      const result = await response.json();
      console.log('✅ Project saved successfully:', result);

      this.showToast(
        this.isEditing ? 'Project updated successfully!' : 'Project created successfully!',
        'success'
      );
      
      // Redirect back to projects page after 1 second
      setTimeout(() => {
        this.$router.push('/projects');
      }, 1000);
    },

    handleFileChange(event) {
      const newFiles = Array.from(event.target.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log('📎 Files selected:', newFiles.map(f => f.name));
    },

    removeFile(index) {
      const removed = this.selectedFiles.splice(index, 1);
      console.log('🗑️ File removed:', removed[0].name);
    },

    clearFiles() {
      this.selectedFiles = [];
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      console.log('🗑️ All files cleared');
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    goBack() {
      this.$router.push('/projects');
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },

    async fetchUserData() {
      try {
        const response = await apiRequest('/auth/me', { method: 'GET' });
        if (response.ok) {
          this.userData = await response.json();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },

    async loadProjectData() {
      if (!this.isEditing) return;

      try {
        const response = await apiRequest(`/projects/${this.projectId}?includeDocuments=false`, {
          method: 'GET'
        });

        if (response.ok) {
          const project = await response.json();
          this.projectForm = {
            title: project.name || '',
            description: project.description || '',
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            status: project.status || 'PLANNING',
            documentDescription: ''
          };
          console.log('✅ Project data loaded:', this.projectForm);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        this.showToast('Failed to load project data', 'error');
      }
    },

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

    // Check if editing
    if (this.$route.params.id) {
      this.isEditing = true;
      this.projectId = this.$route.params.id;
      this.loadProjectData();
    }

    this.fetchUserData();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

:root {
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
  --bar-h:     64px;
  --sidebar-w: 260px;
  --font:      'Manrope', sans-serif;
  --fdisp:     'Space Grotesk', sans-serif;
  --ease:      cubic-bezier(0.22,1,0.36,1);
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-layout {
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font);
  display: grid;
  grid-template-areas:
    "nav nav"
    "sidebar main";
  grid-template-rows: var(--bar-h) 1fr;
  grid-template-columns: var(--sidebar-w) 1fr;
}

/* ========== TOP BAR ========== */
.top-bar {
  grid-area: nav;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--bar-h);
}

.top-bar-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--ink);
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.back-btn:hover {
  background: var(--bg);
  border-color: var(--blue-mid);
  color: var(--blue);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  background: var(--white);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  color: var(--ink-m);
}

.icon-btn:hover {
  background: var(--bg);
  color: var(--ink);
  border-color: var(--blue-mid);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dk) 100%);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--fdisp);
  cursor: pointer;
}

/* ========== SIDEBAR ========== */
.sidebar {
  grid-area: sidebar;
  background: var(--white);
  border-right: 1px solid var(--border);
  padding: 24px 16px;
  overflow-y: auto;
  height: calc(100vh - var(--bar-h));
  position: sticky;
  top: var(--bar-h);
}

.sidebar-group {
  margin-bottom: 24px;
}

.group-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-m);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 0 8px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--ink-m);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s var(--ease);
  cursor: pointer;
}

.nav-link:hover {
  background: var(--bg);
  color: var(--ink);
}

.nav-link.active {
  background: var(--blue-soft);
  color: var(--blue);
  font-weight: 600;
}

/* ========== MAIN AREA ========== */
.main-area {
  grid-area: main;
  padding: 32px;
  overflow-y: auto;
  max-height: calc(100vh - var(--bar-h));
}

.page-top {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--ink);
  font-family: var(--fdisp);
  margin-bottom: 6px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 15px;
  color: var(--ink-m);
  font-weight: 500;
}

/* ========== FORM CONTAINER ========== */
.form-container {
  max-width: 900px;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--fdisp);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-s);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: var(--font);
  font-size: 15px;
  color: var(--ink);
  background: var(--white);
  transition: all 0.2s var(--ease);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px var(--blue-glow);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* ========== FILE UPLOAD ========== */
.file-upload-area {
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: var(--bg);
  transition: all 0.2s var(--ease);
}

.file-upload-area:hover {
  border-color: var(--blue-mid);
  background: var(--blue-soft);
}

.file-input-hidden {
  display: none;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  cursor: pointer;
  gap: 16px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  background: var(--white);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--blue);
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.upload-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.upload-hint {
  font-size: 14px;
  color: var(--ink-m);
}

.selected-files {
  border-top: 1px solid var(--border);
  padding: 16px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.files-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.btn-clear {
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-m);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  font-family: var(--font);
}

.btn-clear:hover {
  background: var(--white);
  border-color: var(--red);
  color: var(--red);
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.file-item svg:first-child {
  color: var(--blue);
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: var(--ink-m);
  flex-shrink: 0;
}

.btn-remove {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: var(--ink-m);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-remove:hover {
  background: #fee;
  color: var(--red);
}

/* ========== FORM ACTIONS ========== */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-family: var(--font);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dk) 100%);
  color: var(--white);
  box-shadow: 0 4px 12px var(--blue-glow);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--blue-glow);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--white);
  color: var(--ink);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--bg);
  border-color: var(--ink-m);
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========== TOAST ========== */
.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(13, 27, 54, 0.16);
  font-size: 14px;
  font-weight: 600;
  z-index: 2000;
  border: 1px solid var(--border);
}

.toast.success {
  border-left: 4px solid var(--green);
}

.toast.success svg {
  color: var(--green);
}

.toast.error {
  border-left: 4px solid var(--red);
}

.toast.error svg {
  color: var(--red);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 968px) {
  .dashboard-layout {
    grid-template-areas:
      "nav"
      "main";
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
  
  .main-area {
    padding: 24px 20px;
  }

  .form-section {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-area {
    padding: 16px;
  }

  .form-section {
    padding: 20px;
  }

  .page-title {
    font-size: 22px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>