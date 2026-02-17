<!-- Notebooks.vue -->
<template>
  <div class="notebooks-shell">

    <!-- ══════ SIDEBAR ══════ -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': sidebarCollapsed }">

      <!-- Header with Logo -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="var(--purple)"/>
              <path d="M20 16h8M16 24h16M20 32h8" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">Notebooks</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" title="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- New Project Button -->
      <button class="new-project-btn" @click="showUploadModal = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span>New Project</span>
      </button>

      <!-- Documents List -->
      <div class="documents-section">
        <!-- Search -->
        <div class="sidebar-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input v-model="documentSearch" placeholder="Search documents..." />
        </div>

        <div class="section-label">YOUR DOCUMENTS</div>

        <div v-if="documentsLoading" class="docs-loading">
          <div class="mini-spin"></div>
        </div>

        <div v-else-if="filteredDocuments.length === 0" class="docs-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14 2v6h6" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>No documents yet</span>
        </div>

        <div v-else class="doc-list">
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="doc-item"
            :class="{ 'doc-item--active': activeDocId === doc.id }"
            @click="loadDocument(doc.id)"
          >
            <div class="doc-item-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="doc-item-body">
              <span class="doc-item-title">{{ doc.fileName }}</span>
              <span class="doc-item-meta">{{ formatFileSize(doc.fileSize) }} · {{ timeAgo(doc.uploadedAt) }}</span>
            </div>
            <button class="doc-item-delete" @click.stop="deleteDocument(doc.id)" title="Delete document">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button class="user-profile-btn" @click="$router.push('/chat')">
          <div class="user-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="user-profile-text">Back to Chat</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- ══════ MAIN AREA ══════ -->
    <main class="main-area">

      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <h1 class="topbar-title">AI Document Processing</h1>
          <span v-if="activeDocId" class="topbar-subtitle">{{ activeDocument?.fileName }}</span>
        </div>
      </header>

      <!-- Content Area -->
      <div class="content-area" v-if="!activeDocId">
        <!-- Welcome State -->
        <div class="welcome-state">
          <div class="welcome-orb">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="var(--purple)"/>
              <path d="M20 16h8M16 24h16M20 32h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 class="welcome-title">Upload your documents</h2>
          <p class="welcome-sub">Analyze, summarize, and chat with your PDFs and documents using AI</p>
          
          <!-- Upload Zone -->
          <div class="upload-zone" @click="$refs.fileInput.click()" @drop.prevent="handleDrop" @dragover.prevent>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>Drop your documents here</h3>
            <p>Supports PDF, DOC, DOCX • Max 50MB</p>
            <button class="choose-files-btn">Choose Files</button>
          </div>
          <input ref="fileInput" type="file" class="hidden-file" accept=".pdf,.doc,.docx" @change="handleFileSelect" />
        </div>
      </div>

      <!-- Document View -->
      <div class="content-area" v-else>
        <div class="document-view">
          <!-- Actions Panel -->
          <div class="actions-panel">
            <h3 class="panel-title">AI Actions</h3>
            
            <button 
              v-for="action in aiActions" 
              :key="action.type"
              class="action-card"
              @click="performAction(action.type)"
              :disabled="processingAction === action.type"
            >
              <div class="action-icon" :class="`icon--${action.color}`">
                <component :is="action.icon" />
              </div>
              <div class="action-body">
                <div class="action-title">{{ action.title }}</div>
                <div class="action-desc">{{ action.description }}</div>
              </div>
              <div v-if="processingAction === action.type" class="action-spinner">
                <div class="mini-spin"></div>
              </div>
            </button>

            <!-- Recent Actions -->
            <div class="recent-actions" v-if="recentActions.length > 0">
              <div class="section-label">RECENT ACTIONS</div>
              <div
                v-for="action in recentActions"
                :key="action.id"
                class="recent-action-item"
                @click="viewActionResult(action)"
              >
                <div class="recent-action-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="recent-action-body">
                  <span class="recent-action-title">{{ getFunctionalityLabel(action.functionalityType) }}</span>
                  <span class="recent-action-time">{{ timeAgo(action.processedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat/Results Panel -->
          <div class="results-panel">
            <div class="results-header">
              <h3>Notebook AI Chat</h3>
              <span class="status-badge" :class="{ 'status-badge--online': true }">
                <span class="status-dot"></span>
                Online
              </span>
            </div>

            <!-- Messages -->
            <div class="messages-area" ref="messagesArea">
              <div v-if="chatMessages.length === 0" class="chat-empty">
                <p>Ask me anything about your document. I've analyzed it and I'm ready to help!</p>
              </div>

              <template v-else>
                <div
                  v-for="(msg, idx) in chatMessages"
                  :key="idx"
                  class="chat-msg"
                  :class="msg.role === 'user' ? 'chat-msg--user' : 'chat-msg--ai'"
                >
                  <div v-if="msg.role === 'ai'" class="chat-avatar chat-avatar--ai">
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="14" fill="var(--purple)"/>
                      <path d="M20 16h8M16 24h16M20 32h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                  </div>

                  <div class="chat-bubble">
                    <div class="chat-content" v-html="renderContent(msg.content)"></div>
                    <div class="chat-time">{{ formatMsgTime(msg.timestamp) }}</div>
                  </div>

                  <div v-if="msg.role === 'user'" class="chat-avatar chat-avatar--user">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                </div>

                <!-- Thinking -->
                <div v-if="isProcessing" class="chat-msg chat-msg--ai">
                  <div class="chat-avatar chat-avatar--ai">
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="14" fill="var(--purple)"/>
                      <path d="M20 16h8M16 24h16M20 32h8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="chat-bubble">
                    <div class="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Input -->
            <div class="chat-input-zone">
              <div class="chat-input-card">
                <textarea
                  ref="chatInput"
                  v-model="chatInputText"
                  class="chat-input-textarea"
                  placeholder="Ask about your document..."
                  rows="1"
                  @keydown.enter.exact.prevent="sendChatMessage"
                  @input="autoResize"
                ></textarea>

                <div class="chat-input-footer">
                  <span class="input-hint">Press Enter to send</span>
                  <button
                    class="chat-send-btn"
                    :class="{ 'chat-send-btn--active': chatInputText.trim() }"
                    :disabled="isProcessing || !chatInputText.trim()"
                    @click="sendChatMessage"
                  >
                    <svg v-if="!isProcessing" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div v-else class="send-spin"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Upload Modal -->
    <transition name="modal">
      <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <h2>Upload Document</h2>
            <button class="modal-close" @click="showUploadModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="upload-zone-modal" @click="$refs.modalFileInput.click()" @drop.prevent="handleDrop" @dragover.prevent>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3>Drop your document here</h3>
              <p>Supports PDF, DOC, DOCX • Max 50MB</p>
              <button class="choose-files-btn">Choose Files</button>
            </div>
            <input ref="modalFileInput" type="file" class="hidden-file" accept=".pdf,.doc,.docx" @change="handleFileSelect" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script>
import { TokenService, apiRequest } from '@/utils/apiService';

const API_BASE = 'https://poikiloblastic-leeanne-gazeless.ngrok-free.dev/api';

const DocumentAPI = {
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await apiRequest('/v1/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type with boundary
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  async processDocument(file, functionality, question, customPrompt) {
    const formData = new FormData();
    formData.append('file', file);
    
    let url = `/v1/documents/process?functionality=${functionality}`;
    if (question) url += `&question=${encodeURIComponent(question)}`;
    if (customPrompt) url += `&customPrompt=${encodeURIComponent(customPrompt)}`;
    
    const res = await apiRequest(url, {
      method: 'POST',
      body: formData,
      headers: {}
    });
    if (!res.ok) throw new Error('Failed to process document');
    return res.json();
  },

  async processExisting(documentId, functionality, question, customPrompt) {
    const res = await apiRequest(`/v1/documents/${documentId}/process`, {
      method: 'POST',
      body: JSON.stringify({
        functionality,
        question,
        customPrompt
      })
    });
    if (!res.ok) throw new Error('Failed to process document');
    return res.json();
  },

  async getUserDocuments() {
    const res = await apiRequest('/v1/documents', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to load documents');
    return res.json();
  },

  async getDocumentById(id) {
    const res = await apiRequest(`/v1/documents/${id}`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to load document');
    return res.json();
  },

  async deleteDocument(id) {
    const res = await apiRequest(`/v1/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },

  async getDocumentHistory(id) {
    const res = await apiRequest(`/v1/documents/${id}/history`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  }
};

export default {
  name: 'Notebooks',

  data() {
    return {
      sidebarCollapsed: false,
      documentSearch: '',
      documents: [],
      documentsLoading: false,
      activeDocId: null,
      activeDocument: null,
      showUploadModal: false,
      chatMessages: [],
      chatInputText: '',
      isProcessing: false,
      processingAction: null,
      recentActions: [],
      aiActions: [
        {
          type: 'SUMMARIZATION',
          title: 'Summarize Content',
          description: 'Generate concise summaries and key points',
          color: 'purple',
          icon: 'SummarizeIcon'
        },
        {
          type: 'QUESTION_ANSWERING',
          title: 'Ask Questions',
          description: 'Get answers from your document',
          color: 'blue',
          icon: 'QuestionIcon'
        },
        {
          type: 'MULTI_FEATURE',
          title: 'Deep Analysis',
          description: 'Comprehensive document analysis',
          color: 'green',
          icon: 'AnalysisIcon'
        }
      ],
      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    filteredDocuments() {
      if (!this.documentSearch.trim()) return this.documents;
      const q = this.documentSearch.toLowerCase();
      return this.documents.filter(d => d.fileName.toLowerCase().includes(q));
    }
  },

  methods: {
    async loadDocuments() {
      this.documentsLoading = true;
      try {
        this.documents = await DocumentAPI.getUserDocuments();
      } catch (e) {
        this.showToast('Could not load documents', 'error');
      } finally {
        this.documentsLoading = false;
      }
    },

    async loadDocument(id) {
      this.activeDocId = id;
      try {
        this.activeDocument = await DocumentAPI.getDocumentById(id);
        this.recentActions = await DocumentAPI.getDocumentHistory(id);
        this.chatMessages = [];
      } catch (e) {
        this.showToast('Could not load document', 'error');
      }
    },

    async handleFileSelect(e) {
      const file = e.target.files[0];
      if (!file) return;
      await this.uploadDocument(file);
      e.target.value = '';
    },

    async handleDrop(e) {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      await this.uploadDocument(file);
    },

    async uploadDocument(file) {
      try {
        this.isProcessing = true;
        const response = await DocumentAPI.uploadDocument(file);
        
        if (response.success) {
          this.showToast('Document uploaded successfully', 'success');
          await this.loadDocuments();
          this.loadDocument(response.documentId);
          this.showUploadModal = false;
        } else {
          this.showToast(response.error || 'Upload failed', 'error');
        }
      } catch (e) {
        console.error('Upload error:', e);
        this.showToast('Failed to upload document', 'error');
      } finally {
        this.isProcessing = false;
      }
    },

    async performAction(actionType) {
      if (!this.activeDocId) return;
      
      this.processingAction = actionType;
      
      try {
        let response;
        
        if (actionType === 'QUESTION_ANSWERING') {
          const question = prompt('What would you like to know about this document?');
          if (!question) {
            this.processingAction = null;
            return;
          }
          response = await DocumentAPI.processExisting(this.activeDocId, actionType, question, null);
        } else {
          response = await DocumentAPI.processExisting(this.activeDocId, actionType, null, null);
        }
        
        if (response.success) {
          this.chatMessages.push({
            role: 'ai',
            content: this.formatAIResponse(response),
            timestamp: new Date().toISOString()
          });
          await this.loadDocument(this.activeDocId); // Refresh history
          this.scrollToBottom();
        } else {
          this.showToast(response.error || 'Action failed', 'error');
        }
      } catch (e) {
        console.error('Action error:', e);
        this.showToast('Failed to perform action', 'error');
      } finally {
        this.processingAction = null;
      }
    },

    formatAIResponse(response) {
      if (response.data) {
        if (response.data.summary) return response.data.summary;
        if (response.data.answer) return `**Answer:** ${response.data.answer}`;
        if (response.data.analysis) return response.data.analysis;
        if (response.data.response) return response.data.response;
      }
      return response.message || 'Processing complete';
    },

    async sendChatMessage() {
      const text = this.chatInputText.trim();
      if (!text || this.isProcessing || !this.activeDocId) return;

      this.chatMessages.push({
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      });

      this.chatInputText = '';
      this.$nextTick(() => {
        this.autoResize();
        this.scrollToBottom();
      });

      this.isProcessing = true;

      try {
        const response = await DocumentAPI.processExisting(
          this.activeDocId,
          'CHAT',
          null,
          text
        );

        if (response.success) {
          this.chatMessages.push({
            role: 'ai',
            content: this.formatAIResponse(response),
            timestamp: new Date().toISOString()
          });
          this.scrollToBottom();
        } else {
          this.showToast(response.error || 'Chat failed', 'error');
        }
      } catch (e) {
        console.error('Chat error:', e);
        this.showToast('Failed to send message', 'error');
      } finally {
        this.isProcessing = false;
      }
    },

    async deleteDocument(id) {
      if (!confirm('Delete this document?')) return;
      
      try {
        await DocumentAPI.deleteDocument(id);
        this.documents = this.documents.filter(d => d.id !== id);
        if (this.activeDocId === id) {
          this.activeDocId = null;
          this.activeDocument = null;
          this.chatMessages = [];
        }
        this.showToast('Document deleted', 'success');
      } catch (e) {
        this.showToast('Failed to delete document', 'error');
      }
    },

    viewActionResult(action) {
      this.chatMessages.push({
        role: 'ai',
        content: action.aiResponse || 'No response available',
        timestamp: action.processedAt
      });
      this.scrollToBottom();
    },

    getFunctionalityLabel(type) {
      const labels = {
        'SUMMARIZATION': 'Summary',
        'QUESTION_ANSWERING': 'Q&A',
        'MULTI_FEATURE': 'Analysis',
        'CHAT': 'Chat'
      };
      return labels[type] || type;
    },

    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesArea;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },

    autoResize() {
      const el = this.$refs.chatInput;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },

    renderContent(text) {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    },

    formatMsgTime(ts) {
      if (!ts) return '';
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },

    timeAgo(ts) {
      if (!ts) return '';
      const diff = Date.now() - new Date(ts).getTime();
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      if (hrs < 24) return `${hrs}h ago`;
      return `${days}d ago`;
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },

  async mounted() {
    if (!TokenService.isAuthenticated()) {
      this.$router.push('/auth');
      return;
    }
    await this.loadDocuments();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

:root {
  --blue:        #4a90e2;
  --ink:         #0d1b36;
  --ink-m:       #64748b;
  --white:       #ffffff;
  --border:      #e2ecf6;
  --bg:          #f8fafc;
  --sidebar-bg:  #f9fafb;
  --purple:      #8b5cf6;
  --purple-dk:   #7c3aed;
  --purple-soft: #ede9fe;
  --green:       #10b981;
  --orange:      #f59e0b;
  --red:         #ef4444;
  --cyan:        #06b6d4;
  --user-bg:     #f0f0f0;
  --sidebar-w:   280px;
  --font:        'Manrope', sans-serif;
  --fdisp:       'Space Grotesk', sans-serif;
  --ease:        cubic-bezier(0.22, 1, 0.36, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

/* ═══ SHELL ════════════════════════════════════════════════ */
.notebooks-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  font-family: var(--font);
}

/* ═══ SIDEBAR ══════════════════════════════════════════════ */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s var(--ease);
}

.sidebar--collapsed {
  width: 0;
  border-right: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--fdisp);
}

.collapse-btn {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ink-m);
  flex-shrink: 0;
  transition: background 0.15s;
}
.collapse-btn:hover {
  background: var(--bg);
}

.new-project-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 12px 12px 0;
  height: 40px;
  padding: 0 16px;
  background: var(--white);
  color: var(--ink);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s var(--ease);
  flex-shrink: 0;
}
.new-project-btn:hover {
  background: var(--bg);
  border-color: var(--ink-m);
}

.documents-section {
  flex: 1;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.sidebar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--ink-m);
  flex-shrink: 0;
  margin-bottom: 12px;
}
.sidebar-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: var(--font);
  color: var(--ink);
}
.sidebar-search input::placeholder { color: var(--ink-m); }

.section-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--ink-m);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.docs-loading {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.mini-spin {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--purple);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.docs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 0;
  color: var(--ink-m);
  font-size: 13px;
}

.doc-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.doc-list::-webkit-scrollbar { width: 4px; }
.doc-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.doc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.doc-item:hover { background: var(--white); }
.doc-item--active {
  background: var(--white);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.doc-item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-m);
  flex-shrink: 0;
}
.doc-item--active .doc-item-icon { color: var(--purple); }

.doc-item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.doc-item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.doc-item-meta {
  font-size: 11px;
  color: var(--ink-m);
}

.doc-item-delete {
  width: 24px;
  height: 24px;
  display: none;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 5px;
  color: var(--ink-m);
  cursor: pointer;
  flex-shrink: 0;
}
.doc-item:hover .doc-item-delete { display: flex; }
.doc-item-delete:hover {
  background: #fee2e2;
  color: var(--red);
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.user-profile-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  color: var(--ink);
  cursor: pointer;
  transition: all 0.15s;
}
.user-profile-btn:hover {
  background: var(--bg);
}

.user-avatar {
  width: 28px;
  height: 28px;
  background: var(--purple-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--purple);
  flex-shrink: 0;
}

.user-profile-text {
  flex: 1;
}

/* ═══ MAIN AREA ════════════════════════════════════════════ */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg);
}

.topbar {
  height: 60px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ink-m);
  transition: background 0.15s;
}
.mobile-menu-btn:hover {
  background: var(--bg);
}

.topbar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--fdisp);
}

.topbar-subtitle {
  font-size: 14px;
  color: var(--ink-m);
  font-weight: 500;
}

/* ═══ CONTENT AREA ════════════════════════════════════════ */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* Welcome State */
.welcome-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.welcome-orb {
  width: 80px;
  height: 80px;
  background: var(--purple-soft);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--ink);
  font-family: var(--fdisp);
  margin-bottom: 12px;
}

.welcome-sub {
  font-size: 16px;
  color: var(--ink-m);
  font-weight: 500;
  max-width: 480px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.upload-zone {
  width: 100%;
  max-width: 600px;
  padding: 60px 40px;
  background: var(--white);
  border: 2px dashed var(--border);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.upload-zone:hover {
  border-color: var(--purple);
  background: var(--purple-soft);
  transform: translateY(-2px);
}

.upload-zone svg {
  color: var(--ink-m);
}

.upload-zone h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.upload-zone p {
  font-size: 14px;
  color: var(--ink-m);
  margin: 0;
}

.choose-files-btn {
  margin-top: 8px;
  padding: 10px 24px;
  background: var(--purple);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: all 0.15s;
}
.choose-files-btn:hover {
  background: var(--purple-dk);
  transform: translateY(-1px);
}

.hidden-file {
  display: none;
}

/* Document View */
.document-view {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  height: calc(100vh - 124px);
}

/* Actions Panel */
.actions-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.action-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.action-card:hover {
  border-color: var(--purple);
  background: var(--purple-soft);
  transform: translateY(-1px);
}
.action-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon--purple { background: var(--purple-soft); color: var(--purple); }
.icon--blue { background: #dbeafe; color: var(--blue); }
.icon--green { background: #d1fae5; color: var(--green); }

.action-body {
  flex: 1;
}

.action-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: var(--ink-m);
  line-height: 1.4;
}

.action-spinner {
  flex-shrink: 0;
}

.recent-actions {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.recent-action-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.recent-action-item:hover {
  background: var(--bg);
}

.recent-action-icon {
  width: 28px;
  height: 28px;
  background: var(--bg);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-m);
  flex-shrink: 0;
}

.recent-action-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-action-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.recent-action-time {
  font-size: 11px;
  color: var(--ink-m);
}

/* Results Panel */
.results-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.results-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--bg);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-m);
}
.status-badge--online {
  background: #d1fae5;
  color: var(--green);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}
.messages-area::-webkit-scrollbar { width: 6px; }
.messages-area::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: var(--ink-m);
  font-size: 14px;
  padding: 40px;
}

.chat-msg {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  animation: msg-in 0.25s var(--ease);
}
@keyframes msg-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-msg--ai {
  flex-direction: row;
}

.chat-msg--user {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}
.chat-avatar--ai {
  background: var(--purple-soft);
}
.chat-avatar--user {
  background: var(--user-bg);
  color: var(--ink);
}

.chat-bubble {
  flex: 1;
  padding: 0;
}

.chat-content {
  font-size: 15px;
  line-height: 1.7;
  word-break: break-word;
  color: var(--ink);
}

.chat-content :deep(strong) { font-weight: 700; }
.chat-content :deep(code) {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 2px 6px;
  font-family: 'Fira Mono', monospace;
  font-size: 13px;
  color: var(--purple);
}

.chat-time {
  font-size: 11px;
  margin-top: 8px;
  color: var(--ink-m);
  font-weight: 500;
}

.typing-dots {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 8px 0;
}
.typing-dots span {
  width: 8px;
  height: 8px;
  background: var(--ink-m);
  border-radius: 50%;
  animation: bounce 1.2s ease-in-out infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* Chat Input */
.chat-input-zone {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.chat-input-card {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.chat-input-card:focus-within {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
}

.chat-input-textarea {
  width: 100%;
  min-height: 24px;
  max-height: 120px;
  padding: 0;
  margin-bottom: 8px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-family: var(--font);
  font-weight: 500;
  color: var(--ink);
  resize: none;
  outline: none;
  line-height: 1.6;
  overflow-y: auto;
}
.chat-input-textarea::placeholder { color: var(--ink-m); }

.chat-input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.input-hint {
  font-size: 11px;
  color: var(--ink-m);
}

.chat-send-btn {
  width: 32px;
  height: 32px;
  background: var(--ink-m);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  color: var(--white);
  transition: all 0.15s var(--ease);
  flex-shrink: 0;
}
.chat-send-btn--active {
  background: var(--ink);
  cursor: pointer;
}
.chat-send-btn--active:hover {
  background: var(--purple);
}
.chat-send-btn:disabled { opacity: 0.5; }

.send-spin {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: var(--white);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ink-m);
  transition: background 0.15s;
}
.modal-close:hover {
  background: var(--bg);
}

.modal-body {
  padding: 24px;
}

.upload-zone-modal {
  width: 100%;
  padding: 60px 40px;
  background: var(--bg);
  border: 2px dashed var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.upload-zone-modal:hover {
  border-color: var(--purple);
  background: var(--purple-soft);
}

.upload-zone-modal svg {
  color: var(--ink-m);
}

.upload-zone-modal h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.upload-zone-modal p {
  font-size: 13px;
  color: var(--ink-m);
  margin: 0;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s var(--ease);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  color: var(--ink);
}
.toast--success { border-left: 3px solid var(--green); }
.toast--success svg { color: var(--green); }
.toast--error { border-left: 3px solid var(--red); }
.toast--error svg { color: var(--red); }

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s var(--ease);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 1024px) {
  .document-view {
    grid-template-columns: 1fr;
  }
  
  .actions-panel {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 200;
    box-shadow: 2px 0 12px rgba(0,0,0,0.1);
  }
  
  .sidebar--collapsed {
    transform: translateX(-100%);
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>