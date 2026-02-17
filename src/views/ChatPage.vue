<!-- NovaChat.vue -->
<!--
  NovaTech Chat — Vue SFC
  Token is read from localStorage/sessionStorage via TokenService (no login screen).
  Design: matches Nova Meeting dark theme (nc-* scoped prefix).
-->
<template>
  <div class="nc-root">

    <!-- ════════════════════════════════════════════════════════
         NOT AUTHENTICATED — edge-case fallback only
    ═════════════════════════════════════════════════════════ -->
    <div v-if="!isAuthenticated" class="nc-unauth">
      <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#4a90e2" opacity=".15"/>
        <path d="M9 10h14M9 16h10M9 22h12" stroke="#4a90e2" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <h2>Session not found</h2>
      <p>You are not logged in. Please sign in first.</p>
      <button class="nc-btn-primary" @click="$router.push('/auth')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
        Go to Login
      </button>
    </div>

    <!-- ════════════════════════════════════════════════════════
         MAIN APP
    ═════════════════════════════════════════════════════════ -->
    <div v-else class="nc-app">

      <!-- ── Header ── -->
      <header class="nc-header">
        <div class="nc-hleft">
          <div class="nc-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4a90e2"/>
              <path d="M9 10h14M9 16h10M9 22h12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <span class="nc-brand-name">NovaTech Chat</span>
          </div>

          <div class="nc-search-wrap">
            <svg class="nc-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              class="nc-search-input"
              type="text"
              v-model="searchQuery"
              placeholder="Search friends…"
              @input="filterFriends"
            />
          </div>
        </div>

        <div class="nc-hright">
          <div class="nc-user-chip">
            <div class="nc-user-avatar">{{ userInitials }}</div>
            <div class="nc-user-meta">
              <span class="nc-user-name">{{ userName }}</span>
              <span class="nc-user-status">
                <span class="nc-status-dot"></span>Online
              </span>
            </div>
          </div>
          <button class="nc-btn-logout" @click="logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Logout
          </button>
        </div>
      </header>

      <!-- ── Body ── -->
      <div class="nc-body">

        <!-- ════════ SIDEBAR ════════ -->
        <aside class="nc-sidebar">

          <!-- New Chat / Add Friend -->
          <div class="nc-sidebar-section">
            <div class="nc-section-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
              New Chat
            </div>

            <div class="nc-add-row">
              <input class="nc-finput" type="text" v-model="newChatUser"
                placeholder="Username or email" @keydown.enter="startChat" />
              <button class="nc-btn-small" @click="startChat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Chat
              </button>
            </div>

            <div class="nc-add-row">
              <input class="nc-finput" type="text" v-model="friendRequestUser"
                placeholder="Add friend…" @keydown.enter="addFriend" />
              <button class="nc-btn-small" @click="addFriend">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Add
              </button>
            </div>
          </div>

          <!-- Pending Friend Requests -->
          <div class="nc-sidebar-section">
            <div class="nc-section-label">
              <div class="nc-label-left">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Friend Requests
                <span v-if="pendingRequests.length" class="nc-badge">{{ pendingRequests.length }}</span>
              </div>
              <button class="nc-btn-icon" @click="refreshRequests" title="Refresh">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
            </div>
            <div class="nc-list">
              <p v-if="!pendingRequests.length" class="nc-empty">No pending requests</p>
              <div v-for="req in pendingRequests" :key="req.id" class="nc-request-item">
                <div class="nc-avatar-circle">{{ initials(req.name) }}</div>
                <div class="nc-friend-info">
                  <div class="nc-friend-name">{{ req.name }}</div>
                  <div class="nc-friend-email">{{ req.email }}</div>
                </div>
                <div class="nc-req-actions">
                  <button class="nc-btn-accept" @click="acceptRequest(req.id)" title="Accept">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button class="nc-btn-reject" @click="rejectRequest(req.id)" title="Decline">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Friends -->
          <div class="nc-sidebar-section">
            <div class="nc-section-label">
              <div class="nc-label-left">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Active Friends
              </div>
              <button class="nc-btn-icon" @click="refreshFriends" title="Refresh">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
            </div>
            <div class="nc-list">
              <p v-if="!filteredFriends.length" class="nc-empty">No friends yet</p>
              <div
                v-for="friend in filteredFriends"
                :key="friend.id"
                class="nc-friend-item"
                :class="{ 'nc-friend-item--active': currentChat?.id === friend.id }"
                @click="openChat(friend)"
              >
                <div class="nc-avatar-circle">{{ initials(friend.name) }}</div>
                <div class="nc-friend-info">
                  <div class="nc-friend-name">{{ friend.name }}</div>
                  <div class="nc-friend-email">{{ friend.email }}</div>
                </div>
                <span v-if="friend.unread" class="nc-unread-dot">{{ friend.unread }}</span>
              </div>
            </div>
          </div>

        </aside>

        <!-- ════════ CHAT AREA ════════ -->
        <main class="nc-chat-main">

          <!-- Chat Header -->
          <div class="nc-chat-header">
            <div class="nc-chat-meta">
              <div class="nc-chat-avatar">
                <span v-if="currentChat">{{ initials(currentChat.name) }}</span>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <h3 class="nc-chat-name">{{ currentChat ? currentChat.name : 'Select a friend to chat' }}</h3>
                <span class="nc-chat-sub">{{ currentChat ? currentChat.email : 'Click on a friend to start chatting' }}</span>
              </div>
            </div>
            <button v-if="currentChat" class="nc-btn-icon" @click="refreshMessages" title="Refresh messages">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
          </div>

          <!-- Messages -->
          <div class="nc-messages" ref="messagesArea">
            <div v-if="!currentChat" class="nc-welcome">
              <div class="nc-welcome-icon">
                <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#4a90e2" opacity=".12"/>
                  <path d="M9 10h14M9 16h10M9 22h12" stroke="#4a90e2" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="nc-welcome-title">Welcome to NovaTech Chat</h2>
              <p class="nc-welcome-sub">Select a friend from the sidebar to start messaging</p>
            </div>

            <template v-else>
              <div v-if="!messages.length" class="nc-welcome">
                <p class="nc-welcome-sub">No messages yet — say hello! 👋</p>
              </div>
              <transition-group name="nc-msg" tag="div" class="nc-msg-list">
                <div
                  v-for="msg in messages"
                  :key="msg.id"
                  class="nc-bubble"
                  :class="msg.isSelf ? 'nc-bubble--sent' : 'nc-bubble--recv'"
                >
                  <div v-if="msg.replyTo" class="nc-bubble-reply">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 11 4 6 9 1"/><path d="M4 6h11a5 5 0 0 1 5 5v3"/></svg>
                    {{ msg.replyTo }}
                  </div>
                  <div class="nc-bubble-content">
                    <div v-if="msg.fileUrl" class="nc-file-chip">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      <a :href="msg.fileUrl" target="_blank" class="nc-file-link">{{ msg.fileName || 'Attachment' }}</a>
                    </div>
                    <p v-if="msg.text" class="nc-bubble-text">{{ msg.text }}</p>
                  </div>
                  <div class="nc-bubble-foot" :class="{ 'nc-bubble-foot--right': msg.isSelf }">
                    <span class="nc-bubble-time">{{ msg.time }}</span>
                    <button class="nc-reply-btn" @click="setReply(msg)" title="Reply">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 11 4 6 9 1"/><path d="M4 6h11a5 5 0 0 1 5 5v3"/></svg>
                    </button>
                  </div>
                </div>
              </transition-group>
            </template>
          </div>

          <!-- Input Area -->
          <div class="nc-input-area">
            <transition name="nc-fade">
              <div v-if="replyTo" class="nc-reply-preview">
                <div class="nc-reply-info">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 11 4 6 9 1"/><path d="M4 6h11a5 5 0 0 1 5 5v3"/></svg>
                  <span class="nc-reply-text">{{ replyTo.text || replyTo.fileName }}</span>
                </div>
                <button class="nc-btn-icon" @click="clearReply">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </transition>

            <div class="nc-compose-row">
              <input type="file" ref="fileInput" style="display:none" @change="handleFileSelect" />
              <button class="nc-btn-icon" :disabled="!currentChat" @click="$refs.fileInput.click()" title="Attach file">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input
                class="nc-msg-input"
                type="text"
                v-model="messageText"
                placeholder="Type a message…"
                :disabled="!currentChat"
                @keydown.enter.prevent="sendMessage"
              />
              <button
                class="nc-btn-send"
                :disabled="!currentChat || (!messageText.trim() && !selectedFile)"
                @click="sendMessage"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

        </main>
      </div><!-- /nc-body -->
    </div><!-- /nc-app -->

    <!-- Loading overlay -->
    <transition name="nc-fade">
      <div v-if="loading" class="nc-loading">
        <div class="nc-spinner"></div>
        <p>Loading…</p>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="nc-toast-fx">
      <div v-if="toastVisible" class="nc-toast" :class="`nc-toast--${toastType}`">
        <svg v-if="toastType === 'success'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else-if="toastType === 'error'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ toastMessage }}
      </div>
    </transition>

  </div>
</template>

<script>
import { TokenService, apiRequest } from '@/utils/apiService';

export default {
  name: 'NovaChat',

  data() {
    return {
      // ── Auth ─────────────────────────────
      isAuthenticated: false,

      // ── User (decoded from stored token) ─
      userId:       null,
      userName:     '',
      userEmail:    '',
      userInitials: '',

      // ── Search ───────────────────────────
      searchQuery: '',

      // ── Friends ──────────────────────────
      friends:         [],
      filteredFriends: [],
      pendingRequests: [],

      // ── Sidebar inputs ───────────────────
      newChatUser:       '',
      friendRequestUser: '',

      // ── Active conversation ──────────────
      currentChat: null,
      messages:    [],

      // ── Compose ──────────────────────────
      messageText:  '',
      replyTo:      null,
      selectedFile: null,

      // ── UI ───────────────────────────────
      loading:      false,
      toastVisible: false,
      toastMessage: '',
      toastType:    'success',  // 'success' | 'error' | 'info'
    };
  },

  methods: {
    // ─────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────
    initials(name) {
      return name ? name.trim().charAt(0).toUpperCase() : '?';
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesArea;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg;
      this.toastType    = type;
      this.toastVisible = true;
      setTimeout(() => { this.toastVisible = false; }, 3000);
    },

    // ─────────────────────────────────────
    //  BOOT — reads token from storage
    //  No login screen needed; TokenService
    //  handles localStorage + sessionStorage.
    // ─────────────────────────────────────
    async boot() {
      // 1. Check if a token exists at all
      if (!TokenService.isAuthenticated()) {
        this.isAuthenticated = false;
        return;
      }
      this.isAuthenticated = true;

      // 2. Decode user info from the JWT payload
      try {
        const raw     = TokenService.getAccessToken();
        const payload = JSON.parse(
          atob(raw.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        this.userId       = payload.userId || payload.sub || payload.id || null;
        this.userName     = payload.username || payload.name || payload.email?.split('@')[0] || 'User';
        this.userEmail    = payload.email || '';
        this.userInitials = this.userName.charAt(0).toUpperCase();
      } catch {
        // Fallback: hit the /auth/me endpoint
        try {
          const res  = await apiRequest('/auth/me', { method: 'GET' });
          const data = await res.json();
          const u    = data.data || data;
          this.userId       = u.id   || u.userId   || null;
          this.userName     = u.name || u.username || u.email?.split('@')[0] || 'User';
          this.userEmail    = u.email || '';
          this.userInitials = this.userName.charAt(0).toUpperCase();
        } catch {
          this.userName     = 'User';
          this.userInitials = 'U';
        }
      }

      // 3. Load initial data
      await Promise.all([this.refreshFriends(), this.refreshRequests()]);
    },

    // ─────────────────────────────────────
    //  LOGOUT
    // ─────────────────────────────────────
    logout() {
      TokenService.clearTokens();
      if (this.$router) {
        this.$router.push('/auth');
      } else {
        window.location.href = '/auth';
      }
    },

    // ─────────────────────────────────────
    //  SEARCH
    // ─────────────────────────────────────
    filterFriends() {
      const q = this.searchQuery.toLowerCase();
      this.filteredFriends = this.friends.filter(f =>
        f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)
      );
    },

    // ─────────────────────────────────────
    //  FRIENDS
    // ─────────────────────────────────────
    async refreshFriends() {
      try {
        const res = await apiRequest('/friends', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          this.friends = (data.data || data || []).map(f => ({
            id:     f.id     || f.userId,
            name:   f.name   || f.username || f.email,
            email:  f.email  || '',
            unread: 0,
          }));
          this.filterFriends();
        }
      } catch { /* silent on first load */ }
    },

    async refreshRequests() {
      try {
        const res = await apiRequest('/friends/requests', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          this.pendingRequests = (data.data || data || []).map(r => ({
            id:    r.id          || r.requestId,
            name:  r.name        || r.username || r.senderName || r.email,
            email: r.email       || r.senderEmail || '',
          }));
        }
      } catch { /* silent */ }
    },

    async addFriend() {
      const target = this.friendRequestUser.trim();
      if (!target) return;
      this.loading = true;
      try {
        const res  = await apiRequest('/friends/request', {
          method: 'POST',
          body: JSON.stringify({ usernameOrEmail: target }),
        });
        const data = await res.json();
        if (res.ok) {
          this.friendRequestUser = '';
          this.showToast(`Friend request sent to ${target}!`, 'success');
        } else {
          this.showToast(data.message || 'Could not send request', 'error');
        }
      } catch {
        this.showToast('Error sending friend request', 'error');
      } finally {
        this.loading = false;
      }
    },

    startChat() {
      const target = this.newChatUser.trim().toLowerCase();
      if (!target) return;
      const found = this.friends.find(f =>
        f.name.toLowerCase() === target || f.email.toLowerCase() === target
      );
      if (found) {
        this.openChat(found);
        this.newChatUser = '';
      } else {
        this.showToast('User not found in your friends list', 'error');
      }
    },

    async acceptRequest(requestId) {
      this.loading = true;
      try {
        const res = await apiRequest(`/friends/accept/${requestId}`, { method: 'POST' });
        if (res.ok) {
          const accepted = this.pendingRequests.find(r => r.id === requestId);
          this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
          if (accepted) { this.friends.push({ ...accepted, unread: 0 }); this.filterFriends(); }
          this.showToast('Friend request accepted!', 'success');
        }
      } catch {
        this.showToast('Could not accept request', 'error');
      } finally { this.loading = false; }
    },

    async rejectRequest(requestId) {
      this.loading = true;
      try {
        const res = await apiRequest(`/friends/reject/${requestId}`, { method: 'POST' });
        if (res.ok) {
          this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
          this.showToast('Request declined', 'info');
        }
      } catch {
        this.showToast('Could not decline request', 'error');
      } finally { this.loading = false; }
    },

    // ─────────────────────────────────────
    //  MESSAGES
    // ─────────────────────────────────────
    async openChat(friend) {
      this.currentChat = friend;
      friend.unread    = 0;
      this.messages    = [];
      this.replyTo     = null;
      await this.refreshMessages();
    },

    async refreshMessages() {
      if (!this.currentChat) return;
      this.loading = true;
      try {
        const res = await apiRequest(`/messages/${this.currentChat.id}`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          this.messages = (data.data || data || []).map(m => ({
            id:       m.id,
            text:     m.content  || m.message || m.text || '',
            isSelf:   String(m.senderId) === String(this.userId),
            time:     new Date(m.createdAt || m.timestamp)
                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyTo:  m.replyTo  || null,
            fileUrl:  m.fileUrl  || null,
            fileName: m.fileName || null,
          }));
          this.scrollToBottom();
        }
      } catch {
        this.showToast('Could not load messages', 'error');
      } finally { this.loading = false; }
    },

    async sendMessage() {
      const text = this.messageText.trim();
      if (!text && !this.selectedFile) return;
      if (!this.currentChat) return;

      // Optimistic push
      const optimistic = {
        id:       `tmp-${Date.now()}`,
        text,
        isSelf:   true,
        time:     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        replyTo:  this.replyTo ? (this.replyTo.text || this.replyTo.fileName) : null,
        fileUrl:  this.selectedFile ? URL.createObjectURL(this.selectedFile) : null,
        fileName: this.selectedFile?.name || null,
      };
      this.messages.push(optimistic);
      this.scrollToBottom();

      const sentText    = this.messageText;
      const sentFile    = this.selectedFile;
      const sentReplyTo = this.replyTo;
      this.messageText  = '';
      this.replyTo      = null;
      this.selectedFile = null;

      // Persist to API
      try {
        let body;
        const opts = { method: 'POST' };

        if (sentFile) {
          body = new FormData();
          body.append('recipientId', this.currentChat.id);
          if (sentText) body.append('content', sentText);
          if (sentReplyTo?.id) body.append('replyToId', sentReplyTo.id);
          body.append('file', sentFile);
          opts.body = body;
          // Let browser set multipart Content-Type automatically
        } else {
          opts.body = JSON.stringify({
            recipientId: this.currentChat.id,
            content:     sentText,
            replyToId:   sentReplyTo?.id || null,
          });
        }

        await apiRequest('/messages/send', opts);
      } catch {
        this.showToast('Message may not have delivered', 'error');
      }
    },

    // ─────────────────────────────────────
    //  REPLY / FILE
    // ─────────────────────────────────────
    setReply(msg)  { this.replyTo = msg; },
    clearReply()   { this.replyTo = null; },

    handleFileSelect(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      this.selectedFile = file;
      this.showToast(`Attached: ${file.name}`, 'info');
      e.target.value = ''; // allow re-selecting same file
    },
  },

  async mounted() {
    await this.boot();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* ── Design tokens ───────────────────────────────────── */
.nc-root {
  --c-bg:      #f8fafc;
  --c-surf:    #ffffff;
  --c-surf2:   #e8f2fc;
  --c-line:    #e2ecf6;
  --c-blue:    #4a90e2;
  --c-blue2:   #2c6fbd;
  --c-blue-soft: #e8f2fc;
  --c-blue-mid:  #c9dff5;
  --c-blue-glow: rgba(74,144,226,0.22);
  --c-green:   #10b981;
  --c-red:     #ef4444;
  --c-red-bg:  rgba(239,68,68,.12);
  --c-orange:  #f59e0b;
  --c-purple:  #8b5cf6;
  --c-pink:    #ec4899;
  --c-cyan:    #06b6d4;
  --c-text:    #0d1b36;
  --c-text2:   #64748b;
  --c-r:       8px;
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);

  font-family: 'Manrope', sans-serif;
  background: var(--c-bg);
  color: var(--c-text);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ══════════════════════════════════════════
   NOT AUTHENTICATED
══════════════════════════════════════════ */
.nc-unauth {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; height: 100vh; text-align: center; padding: 24px;
}
.nc-unauth h2 { font-size: 22px; font-weight: 600; }
.nc-unauth p  { font-size: 14px; color: var(--c-text2); }
.nc-btn-primary {
  margin-top: 8px; padding: 12px 28px;
  background: var(--c-blue); border: none; border-radius: var(--c-r);
  color: #fff; font-family: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer; display: inline-flex; align-items: center; gap: 9px;
  transition: background .15s, transform .1s;
  box-shadow: 0 2px 12px var(--c-blue-glow);
}
.nc-btn-primary:hover { background: var(--c-blue2); transform: translateY(-1px); }

/* ══════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════ */
.nc-app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

/* ── Header ── */
.nc-header {
  height: 60px; flex-shrink: 0;
  background: var(--c-surf); border-bottom: 1px solid var(--c-line);
  box-shadow: var(--shadow-sm);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; z-index: 10;
}
.nc-hleft, .nc-hright { display: flex; align-items: center; gap: 16px; }

.nc-brand        { display: flex; align-items: center; gap: 9px; }
.nc-brand-name   { font-size: 16px; font-weight: 700; letter-spacing: -.2px; }

.nc-search-wrap  { position: relative; }
.nc-search-icon  {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%); color: var(--c-text2); pointer-events: none;
}
.nc-search-input {
  padding: 8px 14px 8px 36px;
  background: var(--c-surf2); border: 1px solid var(--c-line); border-radius: 20px;
  color: var(--c-text); font-family: inherit; font-size: 13px; width: 230px;
  transition: border-color .15s, width .2s;
}
.nc-search-input::placeholder { color: var(--c-text2); }
.nc-search-input:focus { outline: none; border-color: var(--c-blue); width: 270px; }

.nc-user-chip {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 14px; background: var(--c-surf2);
  border: 1px solid var(--c-line); border-radius: 20px;
}
.nc-user-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, var(--c-blue), var(--c-blue2));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.nc-user-meta   { display: flex; flex-direction: column; line-height: 1.3; }
.nc-user-name   { font-size: 13px; font-weight: 600; color: var(--c-text); }
.nc-user-status { font-size: 11px; color: var(--c-green); display: flex; align-items: center; gap: 5px; }
.nc-status-dot  {
  width: 6px; height: 6px; border-radius: 50%; background: var(--c-green);
  animation: nc-pulse 2s ease-in-out infinite;
}
@keyframes nc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }

.nc-btn-logout {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px;
  background: var(--c-red-bg); border: 1px solid rgba(239,68,68,.25);
  border-radius: var(--c-r); color: #dc2626;
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .15s;
}
.nc-btn-logout:hover { background: rgba(239,68,68,.2); border-color: var(--c-red); color: var(--c-red); }

/* ── Body ── */
.nc-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
.nc-sidebar {
  width: 300px; flex-shrink: 0;
  background: var(--c-surf); border-right: 1px solid var(--c-line);
  overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 0;
  scrollbar-width: thin; scrollbar-color: var(--c-surf2) transparent;
}

.nc-sidebar-section {
  padding-bottom: 20px; margin-bottom: 20px;
  border-bottom: 1px solid var(--c-line);
}
.nc-sidebar-section:last-child { border-bottom: none; margin-bottom: 0; }

.nc-section-label {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 10px; font-weight: 700; letter-spacing: .8px;
  text-transform: uppercase; color: var(--c-text2);
  margin-bottom: 12px; gap: 6px;
}
.nc-label-left { display: flex; align-items: center; gap: 6px; }

.nc-badge {
  min-width: 17px; height: 17px; border-radius: 9px;
  background: var(--c-blue); color: #fff;
  font-size: 10px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; padding: 0 4px;
}

.nc-add-row { display: flex; gap: 8px; margin-bottom: 10px; }
.nc-add-row:last-child { margin-bottom: 0; }

.nc-finput {
  flex: 1; padding: 9px 12px;
  background: var(--c-surf2); border: 1px solid var(--c-line);
  border-radius: var(--c-r); color: var(--c-text);
  font-family: inherit; font-size: 13px; transition: border-color .15s;
}
.nc-finput::placeholder { color: #5f6368; }
.nc-finput:focus { outline: none; border-color: var(--c-blue); }

.nc-btn-small {
  display: flex; align-items: center; gap: 5px;
  padding: 9px 12px; background: var(--c-blue);
  border: none; border-radius: var(--c-r);
  color: #fff; font-family: inherit; font-size: 12px; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: background .15s;
}
.nc-btn-small:hover { background: var(--c-blue2); }

.nc-btn-icon {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 50%;
  background: transparent; border: none; color: var(--c-text2);
  cursor: pointer; transition: background .15s, color .15s; flex-shrink: 0;
}
.nc-btn-icon:hover   { background: var(--c-surf2); color: var(--c-text); }
.nc-btn-icon:disabled { opacity: .35; cursor: not-allowed; }

.nc-list   { display: flex; flex-direction: column; gap: 6px; }
.nc-empty  { text-align: center; padding: 20px 12px; color: var(--c-text2); font-size: 13px; }

.nc-request-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; background: var(--c-surf2);
  border-radius: 10px; border: 1px solid transparent; transition: border-color .15s;
}
.nc-request-item:hover { border-color: var(--c-line); }

.nc-friend-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; background: var(--c-surf2);
  border-radius: 10px; border: 1px solid transparent;
  cursor: pointer; transition: all .15s;
}
.nc-friend-item:hover { border-color: var(--c-blue-mid); background: var(--c-blue-soft); transform: translateX(3px); }
.nc-friend-item--active { border-color: var(--c-blue) !important; background: var(--c-blue-soft) !important; }

.nc-avatar-circle {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--c-blue), var(--c-blue2));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 15px; flex-shrink: 0;
}
.nc-friend-info  { flex: 1; min-width: 0; }
.nc-friend-name  { font-size: 13px; font-weight: 600; color: var(--c-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nc-friend-email { font-size: 11px; color: var(--c-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.nc-req-actions { display: flex; gap: 5px; flex-shrink: 0; }
.nc-btn-accept, .nc-btn-reject {
  width: 28px; height: 28px; border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s;
}
.nc-btn-accept { background: rgba(16,185,129,.15); color: #059669; }
.nc-btn-accept:hover { background: rgba(16,185,129,.28); }
.nc-btn-reject { background: var(--c-red-bg); color: #dc2626; }
.nc-btn-reject:hover { background: rgba(239,68,68,.22); }

.nc-unread-dot {
  min-width: 18px; height: 18px; border-radius: 9px;
  background: var(--c-blue); color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  padding: 0 5px; flex-shrink: 0;
}

/* ══════════════════════════════════════════
   CHAT MAIN
══════════════════════════════════════════ */
.nc-chat-main {
  flex: 1; display: flex; flex-direction: column;
  min-height: 0; overflow: hidden; background: var(--c-bg);
}

.nc-chat-header {
  height: 60px; flex-shrink: 0;
  background: var(--c-surf); border-bottom: 1px solid var(--c-line);
  display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
}
.nc-chat-meta { display: flex; align-items: center; gap: 14px; }
.nc-chat-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--c-blue), var(--c-blue2));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0;
}
.nc-chat-name { font-size: 16px; font-weight: 600; color: var(--c-text); margin-bottom: 2px; }
.nc-chat-sub  { font-size: 12px; color: var(--c-text2); }

.nc-messages {
  flex: 1; overflow-y: auto; padding: 24px;
  display: flex; flex-direction: column;
  scrollbar-width: thin; scrollbar-color: var(--c-surf2) transparent;
}
.nc-msg-list { display: flex; flex-direction: column; gap: 10px; }

.nc-welcome {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  flex: 1; gap: 14px; min-height: 200px;
}
.nc-welcome-icon  { opacity: .75; }
.nc-welcome-title { font-size: 22px; font-weight: 600; color: var(--c-text); }
.nc-welcome-sub   { font-size: 14px; color: var(--c-text2); text-align: center; max-width: 320px; line-height: 1.6; }

/* Bubbles */
.nc-bubble {
  max-width: 68%; display: flex; flex-direction: column; gap: 4px;
  animation: nc-slidein .22s ease-out;
}
@keyframes nc-slidein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.nc-bubble--sent { align-self: flex-end; }
.nc-bubble--recv { align-self: flex-start; }

.nc-bubble-reply {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 10px; border-radius: 6px; margin-bottom: 2px;
  background: var(--c-blue-soft); border-left: 3px solid var(--c-blue);
  font-size: 11px; color: var(--c-blue2);
}
.nc-bubble-content { padding: 11px 15px; border-radius: 16px; word-break: break-word; }
.nc-bubble--sent .nc-bubble-content {
  background: var(--c-blue-soft); border: 1px solid var(--c-blue-mid);
  border-bottom-right-radius: 4px;
}
.nc-bubble--recv .nc-bubble-content {
  background: var(--c-surf); border: 1px solid var(--c-line);
  border-bottom-left-radius: 4px; box-shadow: var(--shadow-sm);
}
.nc-bubble-text { font-size: 14px; line-height: 1.5; color: var(--c-text); }

.nc-file-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; margin-bottom: 6px;
  background: var(--c-blue-soft); border-radius: 8px; font-size: 13px; color: var(--c-blue2);
}
.nc-file-link { color: var(--c-blue2); text-decoration: none; }
.nc-file-link:hover { text-decoration: underline; }

.nc-bubble-foot { display: flex; align-items: center; gap: 8px; }
.nc-bubble-foot--right { justify-content: flex-end; }
.nc-bubble-time { font-size: 11px; color: var(--c-text2); }

.nc-reply-btn {
  background: none; border: none; color: var(--c-text2); cursor: pointer;
  padding: 3px 5px; border-radius: 4px; opacity: 0; transition: opacity .15s, background .15s;
}
.nc-bubble:hover .nc-reply-btn { opacity: 1; }
.nc-reply-btn:hover { background: var(--c-surf2); color: var(--c-text); }

/* Input area */
.nc-input-area {
  background: var(--c-surf); border-top: 1px solid var(--c-line);
  padding: 14px 20px; flex-shrink: 0;
}
.nc-reply-preview {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; margin-bottom: 12px;
  background: var(--c-blue-soft);
  border: 1px solid var(--c-blue-mid); border-left: 3px solid var(--c-blue);
  border-radius: var(--c-r);
}
.nc-reply-info  { display: flex; align-items: center; gap: 8px; color: var(--c-blue2); font-size: 13px; }
.nc-reply-text  { color: var(--c-text2); font-size: 12px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.nc-compose-row { display: flex; align-items: center; gap: 10px; }
.nc-msg-input {
  flex: 1; padding: 12px 18px;
  background: var(--c-surf2); border: 1px solid var(--c-line); border-radius: 24px;
  color: var(--c-text); font-family: inherit; font-size: 14px;
  transition: border-color .15s, background .15s;
}
.nc-msg-input::placeholder { color: var(--c-text2); }
.nc-msg-input:focus    { outline: none; background: var(--c-bg); border-color: var(--c-blue); }
.nc-msg-input:disabled { opacity: .4; cursor: not-allowed; }

.nc-btn-send {
  width: 44px; height: 44px; border-radius: 50%; border: none;
  background: var(--c-blue); color: #fff; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .15s, transform .1s;
  box-shadow: 0 2px 10px var(--c-blue-glow);
}
.nc-btn-send:hover:not(:disabled) { background: var(--c-blue2); transform: scale(1.07); }
.nc-btn-send:disabled { background: var(--c-line); box-shadow: none; cursor: not-allowed; opacity: .45; }

/* ══════════════════════════════════════════
   LOADING
══════════════════════════════════════════ */
.nc-loading {
  position: fixed; inset: 0;
  background: rgba(248,250,252,.88); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 3000; gap: 16px;
}
.nc-loading p { color: var(--c-text2); font-size: 14px; }
.nc-spinner {
  width: 44px; height: 44px; border-radius: 50%;
  border: 3px solid var(--c-blue-mid); border-top-color: var(--c-blue);
  animation: nc-spin .7s linear infinite;
}
@keyframes nc-spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
.nc-toast {
  position: fixed; bottom: 28px; right: 28px;
  display: flex; align-items: center; gap: 9px;
  padding: 12px 20px; border-radius: 12px;
  font-size: 13px; font-weight: 500;
  box-shadow: var(--shadow-lg); z-index: 4000; max-width: 340px;
}
.nc-toast--success { background: #10b981; border: 1px solid rgba(16,185,129,.4); color: #fff; }
.nc-toast--error   { background: #ef4444; border: 1px solid rgba(239,68,68,.4);  color: #fff; }
.nc-toast--info    { background: var(--c-blue); border: 1px solid var(--c-blue-mid); color: #fff; }

/* ══════════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════════ */
.nc-fade-enter-active, .nc-fade-leave-active { transition: opacity .2s; }
.nc-fade-enter-from, .nc-fade-leave-to       { opacity: 0; }

.nc-toast-fx-enter-active, .nc-toast-fx-leave-active { transition: opacity .22s, transform .22s; }
.nc-toast-fx-enter-from  { opacity: 0; transform: translateY(12px); }
.nc-toast-fx-leave-to    { opacity: 0; transform: translateY(12px); }

.nc-msg-enter-active { transition: opacity .22s, transform .22s; }
.nc-msg-enter-from   { opacity: 0; transform: translateY(8px); }

/* ══════════════════════════════════════════
   SCROLLBARS
══════════════════════════════════════════ */
.nc-sidebar::-webkit-scrollbar,
.nc-messages::-webkit-scrollbar { width: 5px; }
.nc-sidebar::-webkit-scrollbar-track,
.nc-messages::-webkit-scrollbar-track { background: transparent; }
.nc-sidebar::-webkit-scrollbar-thumb,
.nc-messages::-webkit-scrollbar-thumb { background: var(--c-surf2); border-radius: 3px; }

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */
@media (max-width: 768px) {
  .nc-sidebar { width: 240px; }
  .nc-search-wrap { display: none; }
}
@media (max-width: 560px) {
  .nc-sidebar { display: none; }
}
</style>