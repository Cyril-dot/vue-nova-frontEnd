<!-- ProjectDetail.vue -->
<!-- Professional Project Details Page with Document Viewer -->
<template>
  <div class="dashboard-layout">
    <!-- Top Navigation -->
    <nav class="top-bar">
      <div class="top-bar-content">
        <div class="nav-left">
          <button class="back-btn" @click="$router.push('/projects')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Back to Projects</span>
          </button>
          
          <div class="breadcrumbs">
            <router-link to="/projects">Projects</router-link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ project?.title || 'Loading...' }}</span>
          </div>
        </div>

        <div class="nav-right">
          <button class="icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="badge-dot"></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-wrapper">
        <div class="spinner"></div>
        <p>Loading project details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-wrapper">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="loadProject" class="btn-retry">Try Again</button>
      </div>

      <!-- Project Details -->
      <div v-else-if="project" class="project-detail">
        <!-- Project Header -->
        <header class="project-header">
          <div class="header-left">
            <div class="project-icon" :class="getTheme()">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="header-info">
              <h1 class="project-title">{{ project.title }}</h1>
              <div class="project-meta">
                <span class="status-badge" :class="getStatusClass(project.status)">
                  {{ formatStatus(project.status) }}
                </span>
                <span class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                </span>
                <span class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/>
                    <path d="M13 2v7h7" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ documents.length }} document(s)
                </span>
              </div>
            </div>
          </div>
          
          <div class="header-actions">
            <button class="btn-secondary" @click="editProject">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Edit Project
            </button>
            <button class="btn-danger" @click="deleteProject">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Delete
            </button>
          </div>
        </header>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">Project Progress</span>
            <span class="progress-pct">{{ progress }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :class="getTheme()" :style="{ width: progress + '%' }">
              <div class="progress-glow"></div>
            </div>
          </div>
        </div>

        <!-- Project Description -->
        <div class="description-section">
          <h2 class="section-title">Description</h2>
          <p class="description-text">{{ project.description || 'No description provided.' }}</p>
        </div>

        <!-- Documents Section -->
        <div class="documents-section">
          <div class="section-header">
            <h2 class="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/>
                <path d="M13 2v7h7" stroke="currentColor" stroke-width="2"/>
              </svg>
              Documents ({{ documents.length }})
            </h2>
            <button class="btn-primary" @click="showUploadDialog = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Upload Document
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="documents.length === 0" class="empty-documents">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/>
              <path d="M13 2v7h7" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>No documents yet</h3>
            <p>Upload documents to get started</p>
          </div>

          <!-- Documents Grid -->
          <div v-else class="documents-grid">
            <div 
              v-for="doc in documents" 
              :key="doc.id"
              class="document-card"
              @click="viewDocument(doc)"
            >
              <div class="doc-icon" :class="getDocumentIconClass(doc.mimeType)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/>
                  <path d="M13 2v7h7" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              
              <div class="doc-info">
                <h4 class="doc-name">{{ doc.originalFileName }}</h4>
                <p class="doc-meta">
                  <span>{{ formatFileSize(doc.fileSize) }}</span>
                  <span>•</span>
                  <span>{{ formatDate(doc.uploadedAt) }}</span>
                </p>
              </div>

              <div class="doc-actions">
                <button class="icon-btn-sm" @click.stop="downloadDocument(doc)" title="Download">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button class="icon-btn-sm danger" @click.stop="deleteDocument(doc.id)" title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Document Viewer Modal -->
    <transition name="modal">
      <div v-if="viewingDocument" class="modal-overlay" @click="closeDocumentViewer">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ viewingDocument.originalFileName }}</h3>
            <button class="modal-close" @click="closeDocumentViewer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div v-if="loadingDocument" class="loading-document">
              <div class="spinner"></div>
              <p>Loading document...</p>
            </div>
            
            <div v-else-if="documentError" class="error-document">
              <p>{{ documentError }}</p>
              <button @click="downloadDocument(viewingDocument)" class="btn-primary">
                Download Instead
              </button>
            </div>

            <iframe 
              v-else-if="documentUrl" 
              :src="documentUrl" 
              class="document-frame"
              @error="handleDocumentError"
            ></iframe>
          </div>

          <div class="modal-footer">
            <button @click="downloadDocument(viewingDocument)" class="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Download
            </button>
            <button @click="closeDocumentViewer" class="btn-primary">Close</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Upload Dialog -->
    <transition name="modal">
      <div v-if="showUploadDialog" class="modal-overlay" @click="showUploadDialog = false">
        <div class="modal-content upload-modal" @click.stop>
          <div class="modal-header">
            <h3>Upload Documents</h3>
            <button class="modal-close" @click="showUploadDialog = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="upload-area" @click="$refs.fileInput.click()">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <p>Click to select files or drag and drop</p>
              <span>PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG</span>
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                style="display: none"
              />
            </div>

            <div v-if="selectedFiles.length > 0" class="selected-files">
              <h4>Selected Files ({{ selectedFiles.length }})</h4>
              <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                <span>{{ file.name }}</span>
                <button @click="removeFile(index)" class="remove-btn">×</button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showUploadDialog = false" class="btn-secondary">Cancel</button>
            <button 
              @click="uploadDocuments" 
              class="btn-primary" 
              :disabled="selectedFiles.length === 0 || uploading"
            >
              {{ uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)` }}
            </button>
          </div>
        </div>
      </div>
    </transition>

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
import { TokenService } from '@/utils/apiService';
import ProjectsAPI from '@/utils/projectsApi';

export default {
  name: 'ProjectDetail',
  data() {
    return {
      project: null,
      documents: [],
      loading: true,
      error: null,
      viewingDocument: null,
      documentUrl: null,
      loadingDocument: false,
      documentError: null,
      showUploadDialog: false,
      selectedFiles: [],
      uploading: false,
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  computed: {
    isAuthenticated() {
      return TokenService.isAuthenticated();
    },
    projectId() {
      return this.$route.params.id;
    },
    progress() {
      if (!this.project) return 0;
      return this.calculateProgress(this.project.startDate, this.project.endDate);
    }
  },
  methods: {
    async loadProject() {
      try {
        this.loading = true;
        this.error = null;

        console.log('📡 Loading project:', this.projectId);

        const data = await ProjectsAPI.getProjectById(this.projectId, true);
        
        this.project = data;
        this.documents = data.documents || [];

        console.log('✅ Project loaded:', this.project);
        console.log('📄 Documents:', this.documents.length);
      } catch (error) {
        console.error('❌ Error loading project:', error);
        this.error = error.message || 'Failed to load project details';
      } finally {
        this.loading = false;
      }
    },

    async viewDocument(doc) {
      try {
        this.viewingDocument = doc;
        this.loadingDocument = true;
        this.documentError = null;
        this.documentUrl = null;

        console.log('👁️ Viewing document:', doc.originalFileName);

        const blob = await ProjectsAPI.viewDocument(doc.id);
        this.documentUrl = URL.createObjectURL(blob);

        console.log('✅ Document loaded for viewing');
      } catch (error) {
        console.error('❌ Error viewing document:', error);
        this.documentError = 'Failed to load document. You can download it instead.';
      } finally {
        this.loadingDocument = false;
      }
    },

    closeDocumentViewer() {
      if (this.documentUrl) {
        URL.revokeObjectURL(this.documentUrl);
      }
      this.viewingDocument = null;
      this.documentUrl = null;
      this.documentError = null;
    },

    handleDocumentError() {
      this.documentError = 'This document type cannot be previewed. Please download it instead.';
    },

    async downloadDocument(doc) {
      try {
        console.log('⬇️ Downloading document:', doc.originalFileName);

        const blob = await ProjectsAPI.downloadDocument(doc.id);
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.originalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('Document downloaded successfully', 'success');
        console.log('✅ Download complete');
      } catch (error) {
        console.error('❌ Error downloading document:', error);
        this.showToast('Failed to download document', 'error');
      }
    },

    async deleteDocument(documentId) {
      if (!confirm('Are you sure you want to delete this document?')) {
        return;
      }

      try {
        console.log('🗑️ Deleting document:', documentId);

        await ProjectsAPI.deleteDocument(documentId);
        
        // Remove from local array
        this.documents = this.documents.filter(d => d.id !== documentId);
        
        this.showToast('Document deleted successfully', 'success');
        console.log('✅ Document deleted');
      } catch (error) {
        console.error('❌ Error deleting document:', error);
        this.showToast('Failed to delete document', 'error');
      }
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.selectedFiles = [...this.selectedFiles, ...files];
      console.log('📎 Files selected:', files.length);
    },

    removeFile(index) {
      this.selectedFiles.splice(index, 1);
    },

    async uploadDocuments() {
      if (this.selectedFiles.length === 0) return;

      try {
        this.uploading = true;

        const formData = new FormData();
        this.selectedFiles.forEach(file => {
          formData.append('documents', file);
        });

        console.log('📤 Uploading documents:', this.selectedFiles.length);

        const result = await ProjectsAPI.uploadDocuments(this.projectId, formData);
        
        // Add new documents to the list
        this.documents = [...this.documents, ...result.documents];
        
        this.showToast(`${this.selectedFiles.length} document(s) uploaded successfully`, 'success');
        this.showUploadDialog = false;
        this.selectedFiles = [];

        console.log('✅ Upload complete');
      } catch (error) {
        console.error('❌ Error uploading documents:', error);
        this.showToast('Failed to upload documents', 'error');
      } finally {
        this.uploading = false;
      }
    },

    async deleteProject() {
      if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
      }

      try {
        console.log('🗑️ Deleting project:', this.projectId);

        await ProjectsAPI.deleteProject(this.projectId);
        
        this.showToast('Project deleted successfully', 'success');
        
        // Navigate back to projects after a brief delay
        setTimeout(() => {
          this.$router.push('/projects');
        }, 1000);
      } catch (error) {
        console.error('❌ Error deleting project:', error);
        this.showToast('Failed to delete project', 'error');
      }
    },

    editProject() {
      this.$router.push(`/projects/${this.projectId}/edit`);
    },

    // Helper Methods
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    },

    formatStatus(status) {
      if (!status) return 'Unknown';
      return status.replace(/_/g, ' ');
    },

    formatFileSize(bytes) {
      if (!bytes) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    getStatusClass(status) {
      const map = {
        'PLANNING': 'planning',
        'ACTIVE': 'active',
        'IN_PROGRESS': 'in-progress',
        'COMPLETED': 'completed',
        'ARCHIVED': 'archived'
      };
      return map[status] || 'active';
    },

    getTheme() {
      const themes = ['purple', 'blue', 'green', 'orange', 'pink', 'cyan'];
      const index = this.projectId ? this.projectId.charCodeAt(0) % themes.length : 0;
      return themes[index];
    },

    getDocumentIconClass(mimeType) {
      if (!mimeType) return 'doc-default';
      
      if (mimeType.includes('pdf')) return 'doc-pdf';
      if (mimeType.includes('word') || mimeType.includes('document')) return 'doc-word';
      if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'doc-excel';
      if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'doc-ppt';
      if (mimeType.includes('image')) return 'doc-image';
      if (mimeType.includes('text')) return 'doc-text';
      
      return 'doc-default';
    },

    calculateProgress(startDate, endDate) {
      if (!startDate || !endDate) return 0;
      
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      
      if (now < start) return 5;
      if (now > end) return 100;
      
      const totalDuration = end - start;
      const elapsed = now - start;
      
      return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  },
  async mounted() {
    if (!this.isAuthenticated) {
      this.$router.push('/auth');
      return;
    }

    console.log('🚀 ProjectDetail mounted');
    await this.loadProject();
  },
  beforeUnmount() {
    // Clean up any object URLs
    if (this.documentUrl) {
      URL.revokeObjectURL(this.documentUrl);
    }
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
  --pink:      #ec4899;
  --cyan:      #06b6d4;
  --bar-h:     64px;
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
}

/* ========== TOP BAR ========== */
.top-bar {
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
  max-width: 1400px;
  margin: 0 auto;
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
  height: 40px;
  padding: 0 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  font-family: var(--font);
}

.back-btn:hover {
  background: var(--white);
  border-color: var(--blue);
  color: var(--blue);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-m);
}

.breadcrumbs a {
  color: var(--blue);
  text-decoration: none;
  font-weight: 500;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumbs svg {
  color: var(--ink-m);
}

.breadcrumbs span:last-child {
  color: var(--ink);
  font-weight: 600;
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

.badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: var(--red);
  border-radius: 50%;
  border: 1.5px solid var(--white);
}

/* ========== MAIN CONTENT ========== */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* ========== LOADING & ERROR ========== */
.loading-wrapper,
.error-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--white);
  border-radius: 16px;
  padding: 48px;
  border: 1px solid var(--border);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-wrapper p,
.error-wrapper p {
  font-size: 16px;
  color: var(--ink-m);
  font-weight: 600;
}

.error-wrapper svg {
  color: var(--red);
  margin-bottom: 20px;
}

.error-wrapper p {
  margin-bottom: 24px;
}

.btn-retry {
  height: 44px;
  padding: 0 24px;
  background: var(--blue);
  color: var(--white);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  font-family: var(--font);
}

.btn-retry:hover {
  background: var(--blue-dk);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--blue-glow);
}

/* ========== PROJECT HEADER ========== */
.project-header {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

.project-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-icon.purple { background: #ede9fe; color: var(--purple); }
.project-icon.blue { background: var(--blue-soft); color: var(--blue); }
.project-icon.green { background: #d1fae5; color: var(--green); }
.project-icon.orange { background: #fef3c7; color: var(--orange); }
.project-icon.pink { background: #fce7f3; color: var(--pink); }
.project-icon.cyan { background: #cffafe; color: var(--cyan); }

.header-info {
  flex: 1;
}

.project-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--ink);
  font-family: var(--fdisp);
  margin-bottom: 12px;
  line-height: 1.2;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-badge.planning { background: #fef3c7; color: #92400e; }
.status-badge.active { background: #d1fae5; color: #065f46; }
.status-badge.in-progress { background: #dbeafe; color: #1e40af; }
.status-badge.completed { background: var(--blue-soft); color: var(--blue-dk); }
.status-badge.archived { background: #f3f4f6; color: #6b7280; }

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--ink-m);
  font-weight: 500;
}

.meta-item svg {
  color: var(--ink-m);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary,
.btn-primary,
.btn-danger {
  height: 44px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s var(--ease);
  border: none;
}

.btn-secondary {
  background: var(--bg);
  color: var(--ink);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--white);
  border-color: var(--blue);
  color: var(--blue);
}

.btn-primary {
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dk) 100%);
  color: var(--white);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--blue-glow);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: var(--red);
  color: var(--white);
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
}

/* ========== PROGRESS SECTION ========== */
.progress-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-m);
}

.progress-pct {
  font-size: 24px;
  font-weight: 800;
  color: var(--ink);
  font-family: var(--fdisp);
}

.progress-track {
  position: relative;
  width: 100%;
  height: 12px;
  background: var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.6s var(--ease);
  position: relative;
}

.progress-fill.purple { background: linear-gradient(90deg, var(--purple) 0%, #9333ea 100%); }
.progress-fill.blue { background: linear-gradient(90deg, var(--blue) 0%, var(--blue-dk) 100%); }
.progress-fill.green { background: linear-gradient(90deg, var(--green) 0%, #059669 100%); }
.progress-fill.orange { background: linear-gradient(90deg, var(--orange) 0%, #d97706 100%); }
.progress-fill.pink { background: linear-gradient(90deg, var(--pink) 0%, #db2777 100%); }
.progress-fill.cyan { background: linear-gradient(90deg, var(--cyan) 0%, #0891b2 100%); }

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translateX(-60px); opacity: 0; }
  50% { transform: translateX(0); opacity: 1; }
}

/* ========== DESCRIPTION SECTION ========== */
.description-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--fdisp);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.description-text {
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-s);
}

/* ========== DOCUMENTS SECTION ========== */
.documents-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.empty-documents {
  text-align: center;
  padding: 64px 32px;
}

.empty-documents svg {
  color: var(--ink-m);
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-documents h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
}

.empty-documents p {
  font-size: 14px;
  color: var(--ink-m);
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.document-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.document-card:hover {
  background: var(--bg);
  border-color: var(--blue);
  transform: translateY(-2px);
}

.doc-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-icon.doc-pdf { background: #fee2e2; color: #dc2626; }
.doc-icon.doc-word { background: #dbeafe; color: #2563eb; }
.doc-icon.doc-excel { background: #d1fae5; color: #16a34a; }
.doc-icon.doc-ppt { background: #fed7aa; color: #ea580c; }
.doc-icon.doc-image { background: #fce7f3; color: #db2777; }
.doc-icon.doc-text { background: #e0e7ff; color: #6366f1; }
.doc-icon.doc-default { background: var(--bg); color: var(--ink-m); }

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-meta {
  font-size: 12px;
  color: var(--ink-m);
  display: flex;
  gap: 8px;
}

.doc-actions {
  display: flex;
  gap: 4px;
}

.icon-btn-sm {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  color: var(--ink-m);
}

.icon-btn-sm:hover {
  background: var(--blue-soft);
  color: var(--blue);
}

.icon-btn-sm.danger:hover {
  background: #fee2e2;
  color: var(--red);
}

/* ========== MODAL ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 27, 54, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-content {
  background: var(--white);
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.upload-modal {
  max-width: 600px;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--fdisp);
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  color: var(--ink-m);
}

.modal-close:hover {
  background: var(--red);
  color: var(--white);
}

.modal-body {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.loading-document,
.error-document {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.error-document p {
  color: var(--red);
  margin-bottom: 16px;
}

.document-frame {
  width: 100%;
  height: 600px;
  border: 1px solid var(--border);
  border-radius: 12px;
}

.upload-area {
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s var(--ease);
}

.upload-area:hover {
  border-color: var(--blue);
  background: var(--blue-soft);
}

.upload-area svg {
  color: var(--blue);
  margin-bottom: 16px;
}

.upload-area p {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}

.upload-area span {
  font-size: 13px;
  color: var(--ink-m);
}

.selected-files {
  margin-top: 24px;
}

.selected-files h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--bg);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--ink);
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: var(--white);
  border-radius: 6px;
  cursor: pointer;
  color: var(--red);
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s var(--ease);
}

.remove-btn:hover {
  background: var(--red);
  color: var(--white);
}

.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

/* ========== TRANSITIONS ========== */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s var(--ease);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(20px);
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
  .project-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 16px;
  }

  .project-header {
    padding: 20px;
  }

  .project-title {
    font-size: 24px;
  }

  .header-actions {
    flex-direction: column;
  }

  .back-btn span {
    display: none;
  }

  .breadcrumbs {
    display: none;
  }
}
</style>