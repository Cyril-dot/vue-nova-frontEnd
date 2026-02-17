<!-- AIAssistant.vue -->
<!-- Nova AI Chat Page — ChatGPT Style (Prompt Right, Response Left) -->
<template>
  <div class="chat-shell">

    <!-- ══════ SIDEBAR ══════ -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': sidebarCollapsed }">

      <!-- Header with Logo -->
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="var(--purple)"/>
              <path d="M16 24h16M24 16v16" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">Nova AI</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" title="Toggle sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- New Chat Button -->
      <button class="new-chat-btn" @click="createNewChat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span>New chat</span>
      </button>

      <!-- Chat History -->
      <div class="chats-section">
        <!-- Search -->
        <div class="sidebar-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input v-model="chatSearch" placeholder="Search chats..." />
        </div>

        <div v-if="chatsLoading" class="chats-loading">
          <div class="mini-spin"></div>
        </div>

        <div v-else-if="filteredChats.length === 0" class="chats-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>No chats yet</span>
        </div>

        <div v-else class="chat-list">
          <div
            v-for="chat in filteredChats"
            :key="chat.chatId"
            class="chat-item"
            :class="{ 'chat-item--active': activeChatId === chat.chatId }"
            @click="loadChat(chat.chatId)"
          >
            <div class="chat-item-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="chat-item-body">
              <span class="chat-item-title">{{ chat.title }}</span>
              <span class="chat-item-meta">{{ chat.messageCount }} msgs · {{ timeAgo(chat.updatedAt) }}</span>
            </div>
            <button class="chat-item-delete" @click.stop="deleteChat(chat.chatId)" title="Delete chat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <!-- Model Selector -->
        <div class="model-selector">
          <div class="model-selector-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Model</span>
          </div>
          <div class="model-dropdown">
            <button class="model-dropdown-btn" @click="modelDropdownOpen = !modelDropdownOpen">
              <span class="model-pill-dot" :class="`dot--${currentModelObj.color}`"></span>
              <span>{{ currentModelObj.label }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div v-if="modelDropdownOpen" class="model-dropdown-menu">
              <button
                v-for="m in models"
                :key="m.value"
                class="model-dropdown-item"
                :class="{ 'model-dropdown-item--active': selectedModel === m.value }"
                @click="selectedModel = m.value; modelDropdownOpen = false"
              >
                <span class="model-pill-dot" :class="`dot--${m.color}`"></span>
                <div class="model-dropdown-item-text">
                  <span class="model-dropdown-item-name">{{ m.label }}</span>
                  <span class="model-dropdown-item-desc">{{ m.desc }}</span>
                </div>
                <svg v-if="selectedModel === m.value" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ✅ NEW: Apps Button -->
        <button class="user-profile-btn apps-btn" @click="$router.push('/apps')">
          <div class="user-avatar apps-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="user-profile-text">Apps</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Notebooks Button -->
        <button class="user-profile-btn notebooks-btn" @click="$router.push('/notebooks')">
          <div class="user-avatar notebooks-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="user-profile-text">Notebooks</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- User Profile -->
        <button class="user-profile-btn" @click="$router.push('/dashboard')">
          <div class="user-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="user-profile-text">Back to Dashboard</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- ══════ MAIN CHAT AREA ══════ -->
    <main class="chat-main">

      <!-- Top Bar -->
      <header class="chat-topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="active-model-badge">
            <span class="model-badge-dot" :class="`dot--${currentModelObj.color}`"></span>
            {{ currentModelObj.label }}
          </div>
          <span v-if="activeChatId" class="active-chat-title">{{ activeChatTitle }}</span>
        </div>
        <div class="topbar-right">
          <button v-if="activeChatId" class="topbar-btn" @click="clearCurrentChat" title="Clear chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="topbar-btn topbar-btn--star" title="Star chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages Area -->
      <div class="messages-area" ref="messagesArea">

        <!-- Welcome State -->
        <div v-if="messages.length === 0 && !isSending" class="welcome-state">
          <div class="welcome-orb">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="var(--purple)"/>
              <path d="M16 24h16M24 16v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 class="welcome-title">How can I help you today?</h2>
          <p class="welcome-sub">Ask me anything about your projects, code, or generate new ideas.</p>
          <div class="quick-prompts">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt.text"
              class="quick-prompt"
              @click="useQuickPrompt(prompt.text)"
            >
              <span class="quick-prompt-icon">{{ prompt.icon }}</span>
              <span>{{ prompt.text }}</span>
            </button>
          </div>
        </div>

        <!-- Messages: USER (right) and ASSISTANT (left) -->
        <template v-else>
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="msg-row"
            :class="msg.role === 'USER' ? 'msg-row--user' : 'msg-row--ai'"
          >
            <!-- AI Avatar (left side) -->
            <div v-if="msg.role === 'ASSISTANT'" class="msg-avatar msg-avatar--ai">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="14" fill="var(--purple)"/>
                <path d="M16 24h16M24 16v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>

            <!-- Message Bubble -->
            <div class="msg-bubble" :class="msg.role === 'USER' ? 'msg-bubble--user' : 'msg-bubble--ai'">
              <div class="msg-content" v-html="renderContent(msg.content)"></div>
              <div class="msg-time">{{ formatMsgTime(msg.timestamp) }}</div>
            </div>

            <!-- User Avatar (right side) -->
            <div v-if="msg.role === 'USER'" class="msg-avatar msg-avatar--user">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>

          <!-- Loading / Thinking -->
          <div v-if="isSending" class="msg-row msg-row--ai">
            <div class="msg-avatar msg-avatar--ai">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="14" fill="var(--purple)"/>
                <path d="M16 24h16M24 16v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="msg-bubble msg-bubble--ai">
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ══════ INPUT AREA ══════ -->
      <div class="input-zone">
        <div class="input-card">
          <textarea
            ref="inputEl"
            v-model="inputText"
            class="input-textarea"
            :placeholder="`Message ${currentModelObj.label}...`"
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
          ></textarea>

          <div class="input-footer">
            <button class="tool-btn" title="Attach file" @click="$refs.fileInput.click()">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <input ref="fileInput" type="file" class="hidden-file" @change="handleFileAttach" />

            <button
              class="send-btn"
              :class="{ 'send-btn--active': inputText.trim() }"
              :disabled="isSending || !inputText.trim()"
              @click="sendMessage"
            >
              <svg v-if="!isSending" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-else class="send-spin"></div>
            </button>
          </div>
        </div>
      </div>
    </main>

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

const ChatAPI = {
  async getUserChats() {
    const res = await apiRequest('/v1/chat/list', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to load chats');
    return res.json();
  },

  async getChatHistory(chatId) {
    const res = await apiRequest(`/v1/chat/${chatId}`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to load chat history');
    return res.json();
  },

  async createNewChat(model) {
    const res = await apiRequest(`/v1/chat/new?model=${model}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create chat');
    return res.json();
  },

  async sendMessage(payload) {
    const res = await apiRequest('/v1/chat/message', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async deleteChat(chatId) {
    const res = await apiRequest(`/v1/chat/${chatId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete chat');
    return true;
  },

  async clearChat(chatId) {
    const res = await apiRequest(`/v1/chat/${chatId}/clear`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to clear chat');
    return true;
  }
};

export default {
  name: 'AIAssistant',

  data() {
    return {
      sidebarCollapsed: false,
      chatSearch: '',
      selectedModel: 'LLM',
      modelDropdownOpen: false,
      models: [
        { value: 'LLM',      label: 'LLM',      desc: 'Llama 3.1 8B via Hugging Face', color: 'purple' },
        { value: 'CEREBRAS', label: 'Cerebras',  desc: 'Fast Cerebras inference',        color: 'blue'   },
        { value: 'SEARCH',   label: 'Search',    desc: 'Web search powered results',     color: 'green'  }
      ],
      chats: [],
      chatsLoading: false,
      activeChatId: null,
      activeChatTitle: 'New Chat',
      messages: [],
      inputText: '',
      isSending: false,
      quickPrompts: [
        { icon: '💡', text: 'Explain this concept simply' },
        { icon: '🔧', text: 'Help me debug my code' },
        { icon: '✍️', text: 'Write a project summary' },
        { icon: '🔍', text: 'Search for latest trends' }
      ],
      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    currentModelObj() {
      return this.models.find(m => m.value === this.selectedModel) || this.models[0];
    },
    filteredChats() {
      if (!this.chatSearch.trim()) return this.chats;
      const q = this.chatSearch.toLowerCase();
      return this.chats.filter(c => c.title.toLowerCase().includes(q));
    }
  },

  methods: {
    async loadChats() {
      this.chatsLoading = true;
      try {
        this.chats = await ChatAPI.getUserChats();
      } catch (e) {
        this.showToast('Could not load chats', 'error');
      } finally {
        this.chatsLoading = false;
      }
    },

    async loadChat(chatId) {
      this.activeChatId = chatId;
      const chat = this.chats.find(c => c.chatId === chatId);
      this.activeChatTitle = chat?.title || 'Chat';
      this.messages = [];
      try {
        const data = await ChatAPI.getChatHistory(chatId);
        this.messages = data.messages || [];
        this.activeChatTitle = data.title || 'Chat';
        this.$nextTick(() => this.scrollToBottom());
      } catch (e) {
        this.showToast('Could not load chat history', 'error');
      }
    },

    async createNewChat() {
      try {
        const chat = await ChatAPI.createNewChat(this.selectedModel);
        this.chats.unshift(chat);
        this.activeChatId = chat.chatId;
        this.activeChatTitle = chat.title || 'New Chat';
        this.messages = [];
      } catch (e) {
        this.activeChatId = null;
        this.activeChatTitle = 'New Chat';
        this.messages = [];
      }
    },

    async sendMessage() {
      const text = this.inputText.trim();
      if (!text || this.isSending) return;

      this.messages.push({ 
        role: 'USER', 
        content: text, 
        timestamp: new Date().toISOString() 
      });
      
      this.inputText = '';
      this.$nextTick(() => { 
        this.autoResize(); 
        this.scrollToBottom(); 
      });

      const payload = {
        message: text,
        model: this.selectedModel,
        chatId: this.activeChatId || null
      };

      await this.sendRegular(payload);
    },

    async sendRegular(payload) {
      this.isSending = true;
      try {
        const data = await ChatAPI.sendMessage(payload);
        
        if (!this.activeChatId && data.chatId) {
          this.activeChatId = data.chatId;
          this.activeChatTitle = data.title || 'New Chat';
        }
        
        this.messages.push({
          role: 'ASSISTANT',
          content: data.response,
          timestamp: data.timestamp || new Date().toISOString()
        });
        
        await this.loadChats();
        
        this.$nextTick(() => this.scrollToBottom());
      } catch (e) {
        console.error('Send message error:', e);
        this.showToast('Failed to send message', 'error');
      } finally {
        this.isSending = false;
      }
    },

    async deleteChat(chatId) {
      try {
        await ChatAPI.deleteChat(chatId);
        this.chats = this.chats.filter(c => c.chatId !== chatId);
        if (this.activeChatId === chatId) {
          this.activeChatId = null;
          this.messages = [];
          this.activeChatTitle = 'New Chat';
        }
        this.showToast('Chat deleted', 'success');
      } catch (e) {
        this.showToast('Failed to delete chat', 'error');
      }
    },

    async clearCurrentChat() {
      if (!this.activeChatId) return;
      if (!confirm('Clear all messages in this chat?')) return;
      try {
        await ChatAPI.clearChat(this.activeChatId);
        this.messages = [];
        this.showToast('Chat cleared', 'success');
      } catch (e) {
        this.showToast('Failed to clear chat', 'error');
      }
    },

    useQuickPrompt(text) {
      this.inputText = text;
      this.$refs.inputEl.focus();
    },

    handleFileAttach(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.inputText += ` [Attached: ${file.name}]`;
    },

    scrollToBottom() {
      const el = this.$refs.messagesArea;
      if (el) el.scrollTop = el.scrollHeight;
    },

    autoResize() {
      const el = this.$refs.inputEl;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    },

    renderContent(text) {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/🔗 (https?:\/\/\S+)/g, '<a href="$1" target="_blank" rel="noopener">🔗 $1</a>');
    },

    formatMsgTime(ts) {
      if (!ts) return '';
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },

    timeAgo(ts) {
      if (!ts) return '';
      const diff = Date.now() - new Date(ts).getTime();
      const mins = Math.floor(diff / 60000);
      const hrs  = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1)  return 'just now';
      if (mins < 60) return `${mins}m ago`;
      if (hrs  < 24) return `${hrs}h ago`;
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
    await this.loadChats();
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
.chat-shell {
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

/* Sidebar Header */
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

/* New Chat Button */
.new-chat-btn {
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
.new-chat-btn:hover { 
  background: var(--bg);
  border-color: var(--ink-m);
}

/* Chats Section */
.chats-section {
  flex: 1;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Search */
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

.chats-loading { 
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

.chats-empty {
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 6px;
  padding: 24px 0; 
  color: var(--ink-m); 
  font-size: 13px;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.chat-list::-webkit-scrollbar { width: 4px; }
.chat-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.chat-item:hover { background: var(--white); }
.chat-item--active { 
  background: var(--white);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.chat-item-icon {
  width: 24px; 
  height: 24px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: var(--ink-m);
  flex-shrink: 0;
}
.chat-item--active .chat-item-icon { color: var(--purple); }

.chat-item-body { 
  flex: 1; 
  min-width: 0; 
  display: flex; 
  flex-direction: column; 
  gap: 2px; 
}
.chat-item-title {
  font-size: 13px; 
  font-weight: 600; 
  color: var(--ink);
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}
.chat-item-meta { 
  font-size: 11px; 
  color: var(--ink-m); 
}

.chat-item-delete {
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
.chat-item:hover .chat-item-delete { display: flex; }
.chat-item-delete:hover { 
  background: #fee2e2; 
  color: var(--red); 
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Model Selector */
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.model-selector-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-m);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.model-dropdown {
  position: relative;
}

.model-dropdown-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
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
.model-dropdown-btn:hover {
  background: var(--bg);
}
.model-dropdown-btn svg {
  margin-left: auto;
  flex-shrink: 0;
}

.model-dropdown-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 6px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 6px;
  z-index: 100;
  animation: dropdown-in 0.15s var(--ease);
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.model-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  font-family: var(--font);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.model-dropdown-item:hover {
  background: var(--bg);
}
.model-dropdown-item--active {
  background: var(--purple-soft);
}

.model-dropdown-item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.model-dropdown-item-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.model-dropdown-item-desc {
  font-size: 11px;
  color: var(--ink-m);
}

.model-pill-dot { 
  width: 8px; 
  height: 8px; 
  border-radius: 50%; 
  flex-shrink: 0; 
}
.dot--purple { background: var(--purple); }
.dot--blue   { background: var(--blue); }
.dot--green  { background: var(--green); }

/* User Profile Button */
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

/* ✅ NEW: Apps Button Styling */
.apps-btn:hover {
  background: #fef3c7;
  border-color: var(--orange);
}

.apps-avatar {
  background: #fef3c7;
  color: var(--orange);
}

/* Notebooks Button */
.notebooks-btn:hover {
  background: #dbeafe;
  border-color: var(--blue);
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

.notebooks-avatar {
  background: #dbeafe;
  color: var(--blue);
}

.user-profile-text {
  flex: 1;
}

/* ═══ MAIN CHAT ════════════════════════════════════════════ */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg);
}

/* Topbar */
.chat-topbar {
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
  gap: 12px; 
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

.active-model-badge {
  display: flex; 
  align-items: center; 
  gap: 6px;
  padding: 6px 12px;
  background: var(--purple-soft);
  border-radius: 20px;
  font-size: 12px; 
  font-weight: 700; 
  color: var(--purple);
}
.model-badge-dot { 
  width: 6px; 
  height: 6px; 
  border-radius: 50%; 
  flex-shrink: 0; 
}

.active-chat-title {
  font-size: 14px; 
  font-weight: 600; 
  color: var(--ink-m);
  max-width: 300px; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap;
}

.topbar-right { 
  display: flex; 
  gap: 8px; 
}

.topbar-btn {
  width: 36px; 
  height: 36px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer; 
  color: var(--ink-m);
  transition: all 0.15s;
}
.topbar-btn:hover { 
  border-color: var(--ink-m); 
  color: var(--ink); 
}
.topbar-btn--star:hover { 
  border-color: var(--orange); 
  color: var(--orange); 
  background: #fffbeb; 
}

/* Messages area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
  scroll-behavior: smooth;
}
.messages-area::-webkit-scrollbar { width: 6px; }
.messages-area::-webkit-scrollbar-thumb { 
  background: var(--border); 
  border-radius: 3px; 
}

/* Welcome */
.welcome-state {
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  min-height: 60vh;
  padding: 40px 24px;
  text-align: center;
}

.welcome-orb {
  width: 64px; 
  height: 64px;
  background: var(--purple-soft);
  border-radius: 16px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 28px; 
  font-weight: 700; 
  color: var(--ink);
  font-family: var(--fdisp); 
  margin-bottom: 10px;
}
.welcome-sub {
  font-size: 15px; 
  color: var(--ink-m); 
  font-weight: 500;
  max-width: 420px; 
  line-height: 1.6; 
  margin-bottom: 32px;
}

.quick-prompts {
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 10px;
  max-width: 600px; 
  width: 100%;
}

.quick-prompt {
  display: flex; 
  align-items: center; 
  gap: 10px;
  padding: 14px 16px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 13px; 
  font-weight: 600; 
  color: var(--ink);
  font-family: var(--font); 
  cursor: pointer; 
  text-align: left;
  transition: all 0.2s var(--ease);
}
.quick-prompt:hover {
  border-color: var(--purple); 
  background: var(--purple-soft); 
  color: var(--purple);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}
.quick-prompt-icon { font-size: 18px; }

/* Messages - ChatGPT Style: USER right, AI left */
.msg-row {
  display: flex; 
  align-items: flex-start; 
  gap: 12px;
  padding: 16px 28px;
  max-width: 900px; 
  margin: 0 auto; 
  width: 100%;
  animation: msg-in 0.25s var(--ease);
}
@keyframes msg-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* AI messages: avatar left, content right */
.msg-row--ai { 
  flex-direction: row;
}

/* USER messages: avatar right, content left */
.msg-row--user { 
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px; 
  height: 32px; 
  border-radius: 8px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}
.msg-avatar--ai { 
  background: var(--purple-soft); 
}
.msg-avatar--user {
  background: var(--user-bg);
  color: var(--ink);
}

.msg-bubble {
  flex: 1;
  padding: 0;
  border-radius: 0;
}
.msg-bubble--ai {
  background: none;
  border: none;
}
.msg-bubble--user {
  background: none;
  border: none;
  text-align: left;
}

.msg-content { 
  font-size: 15px; 
  line-height: 1.7; 
  word-break: break-word; 
  color: var(--ink);
}

.msg-content :deep(strong) { font-weight: 700; }
.msg-content :deep(code) {
  background: var(--bg); 
  border: 1px solid var(--border);
  border-radius: 5px; 
  padding: 2px 6px;
  font-family: 'Fira Mono', monospace; 
  font-size: 13px; 
  color: var(--purple);
}
.msg-content :deep(a) { 
  color: var(--blue); 
  text-decoration: underline; 
}

.msg-time { 
  font-size: 11px; 
  margin-top: 8px; 
  color: var(--ink-m);
  font-weight: 500; 
}

/* Typing */
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
  30%            { transform: translateY(-6px); opacity: 1; }
}

/* ═══ INPUT ZONE ═══════════════════════════════════════════ */
.input-zone {
  padding: 0 28px 24px;
  background: var(--bg);
  flex-shrink: 0;
}

.input-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  max-width: 860px;
  margin: 0 auto;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 12px;
}
.input-card:focus-within {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
}

.input-textarea {
  width: 100%;
  min-height: 24px; 
  max-height: 160px;
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
.input-textarea::placeholder { color: var(--ink-m); }

.input-footer {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  gap: 8px;
}

.tool-btn {
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
  transition: all 0.15s;
  flex-shrink: 0;
}
.tool-btn:hover { 
  background: var(--bg);
  color: var(--ink); 
}
.hidden-file { display: none; }

.send-btn {
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
.send-btn--active {
  background: var(--ink);
  cursor: pointer;
}
.send-btn--active:hover { 
  background: var(--purple); 
}
.send-btn:disabled { opacity: 0.5; }

.send-spin {
  width: 16px; 
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ═══ TOAST ════════════════════════════════════════════════ */
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
.toast--error   { border-left: 3px solid var(--red); }
.toast--error svg { color: var(--red); }

.toast-enter-active, .toast-leave-active { 
  transition: all 0.3s var(--ease); 
}
.toast-enter-from, .toast-leave-to { 
  opacity: 0; 
  transform: translateY(12px); 
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ═══ RESPONSIVE ═══════════════════════════════════════════ */
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
  
  .msg-row { padding: 12px 16px; }
  .input-zone { padding: 0 16px 20px; }
  .quick-prompts { grid-template-columns: 1fr; }
  .welcome-title { font-size: 24px; }
}
</style>