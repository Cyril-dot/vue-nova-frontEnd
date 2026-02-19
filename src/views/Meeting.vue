<!-- Meeting.vue — SCREEN SHARE FIXED (FIX F) -->
<!--
  FIXES IN THIS VERSION:
  ✅ FIX A: peerStreams uses object spread to stay reactive
  ✅ FIX B: bindPeerVideo retries up to 20× waiting for DOM element
  ✅ FIX C: NAME_SYNC — both sides always know each other's username
  ✅ FIX D: PARTICIPANT_LIST peers handled as objects or bare strings
  ✅ FIX E: JOIN echo from server (fromPeerId=null) ignored cleanly
  ✅ FIX F: Screen share correctly shown (not the camera).
            Uses peerCameraStreamIds map: first stream.id per peer = camera,
            any new stream.id = screen share. Eliminates the old race-condition
            heuristic that checked peerStreams[peerId] existence.
-->
<template>
  <div class="nv-root">

    <div v-if="view === 'create'" class="nv-create-wrap">
      <nav class="nv-cnav">
        <div class="nv-cbrand" @click="goToDashboard">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1a73e8"/><path d="M20 16L26 11V21L20 16Z" fill="white"/><rect x="6" y="10" width="15" height="12" rx="2" fill="white"/></svg>
          <span>Nova</span>
        </div>
        <button class="nv-cnav-back" @click="goToDashboard">Dashboard</button>
      </nav>

      <main class="nv-cmain">
        <div class="nv-chead">
          <h1 class="nv-ctitle">New meeting</h1>
          <p class="nv-csub">Configure and launch your meeting instantly.</p>
        </div>
        <div class="nv-card">
          <div v-if="created.code" class="nv-success-banner">
            <div class="nv-success-check">✓</div>
            <div>
              <div class="nv-success-title">Meeting created!</div>
              <div class="nv-code-pill" @click="copyCreatedCode">{{ created.code }}</div>
            </div>
          </div>

          <div v-if="!created.code" class="nv-form-body">
            <div class="nv-field">
              <label class="nv-flabel">Title *</label>
              <input class="nv-finput" v-model="form.title" type="text" />
            </div>
            <button class="nv-btn-primary" @click="createMeeting" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create meeting' }}
            </button>
          </div>

          <div v-if="created.code" class="nv-postcreate">
            <button class="nv-btn-primary" @click="enterMeeting">Start meeting now</button>
          </div>
        </div>
      </main>
    </div>

    <div v-if="view === 'meeting'" class="nv-meet">
      <header class="nv-header">
        <div class="nv-hleft">
          <div class="nv-brand"><span>Nova</span> <span class="nv-live-pill">LIVE</span></div>
          <button class="nv-code-chip" @click="copyMeetingCode">{{ meetingCode }}</button>
          <div class="nv-pcount">Participants: {{ participantCount }}</div>
        </div>
        <div class="nv-hright">
          <span class="nv-clock">{{ currentTime }}</span>
          <button class="nv-hbtn" @click="toggleChat">Chat</button>
          <button class="nv-hbtn nv-hbtn--danger" @click="goBack">Back</button>
        </div>
      </header>

      <div class="nv-grid" :class="{ 'nv-grid--presenting': isPresenting }">
        
        <template v-if="isPresenting">
          <div class="nv-gmain">
            <div v-if="screenStream" class="nv-tile nv-tile--screen">
              <video ref="screenVideo" :key="'local-screen'" autoplay playsinline muted></video>
              <div class="nv-tilebar"><div class="nv-tilemeta">You are presenting</div></div>
            </div>
            <div v-else-if="activePresenterId" class="nv-tile nv-tile--screen">
              <video :ref="`peerScreen_${activePresenterId}`" :key="`remote-screen-${activePresenterId}`" autoplay playsinline></video>
              <div class="nv-tilebar"><div class="nv-tilemeta">{{ getPeerName(activePresenterId) }} is presenting</div></div>
            </div>
          </div>

          <div class="nv-gsidebar">
            <div class="nv-tile nv-tile--me">
              <video ref="localVideo" :key="'local-cam-side'" autoplay muted playsinline></video>
              <div v-if="!videoOn" class="nv-nocam"><div class="nv-avatar">{{ userInitials }}</div></div>
            </div>
            <div v-for="pid in peerIds" :key="`side-${pid}`" class="nv-tile">
              <video :ref="`peerVideo_${pid}`" :key="`peer-vid-side-${pid}`" autoplay playsinline></video>
              <div v-if="!peerStreams[pid]" class="nv-nocam"><div class="nv-avatar">{{ getPeerName(pid).charAt(0) }}</div></div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="nv-tile nv-tile--me">
            <video ref="localVideo" :key="'local-cam-grid'" autoplay muted playsinline></video>
            <div v-if="!videoOn" class="nv-nocam"><div class="nv-avatar">{{ userInitials }}</div></div>
          </div>
          <div v-for="pid in peerIds" :key="`grid-${pid}`" class="nv-tile">
            <video :ref="`peerVideo_${pid}`" :key="`peer-vid-grid-${pid}`" autoplay playsinline></video>
            <div v-if="!peerStreams[pid]" class="nv-nocam"><div class="nv-avatar">{{ getPeerName(pid).charAt(0) }}</div></div>
          </div>
        </template>
      </div>

      <div class="nv-controls">
        <button class="nv-ctrl" @click="toggleAudio">{{ audioOn ? 'Mute' : 'Unmute' }}</button>
        <button class="nv-ctrl" @click="toggleVideo">{{ videoOn ? 'Stop Video' : 'Start Video' }}</button>
        <button class="nv-ctrl" :class="{'nv-ctrl--sharing': screenStream}" @click="toggleScreen">
          {{ screenStream ? 'Stop Sharing' : 'Share Screen' }}
        </button>
        <button v-if="isHost" class="nv-ctrl nv-ctrl--end" @click="endMeeting">End</button>
        <button class="nv-ctrl nv-ctrl--leave" @click="leave">Leave</button>
      </div>
    </div>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';

const API    = 'https://nova-test-ctne.onrender.com/api';
const WS_URL = 'wss://nova-test-ctne.onrender.com/ws/webrtc';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export default {
  name: 'Meeting',

  data() {
    return {
      view: 'create',
      form: {
        title: '', description: '', maxParticipants: 50, password: '',
        allowGuests: true, videoEnabled: true, audioEnabled: true,
        chatEnabled: true, screenShareEnabled: true,
      },
      toggleOpts: [
        { key: 'allowGuests',        label: 'Allow guests',       sub: 'Anyone can join without an account' },
        { key: 'videoEnabled',       label: 'Video on by default' },
        { key: 'audioEnabled',       label: 'Audio on by default' },
        { key: 'chatEnabled',        label: 'Enable chat' },
        { key: 'screenShareEnabled', label: 'Screen sharing' },
      ],
      creating: false, createError: '',
      created: { code: null, title: null },

      ws: null,

      peers: {},
      peerStreams: {},          // peerId → camera MediaStream (for peerVideo_ tile)
      peerScreenStreams: {},    // peerId → screen MediaStream (for peerScreen_ tile)
      // ✅ FIX F: Track each peer's camera stream.id so we can identify screen tracks
      // by stream.id comparison instead of an existence check (which had a race condition).
      peerCameraStreamIds: {},  // peerId → camera stream.id string
      peerNames: {},
      peerMuted: {},
      peerVideoOff: {},
      pendingCandidates: {},

      localStream: null,
      screenStream: null,

      meetingCode: '',
      myPeerId: `peer_${Math.random().toString(36).substr(2, 9)}`,
      participantCount: 1,
      isHost: false,

      showEndModal: false, showRestartModal: false,
      ending: false, restarting: false,

      userName: 'Guest', userInitials: 'G',
      videoOn: true, audioOn: true,
      activePresenterId: null,

      chatOpen: false, chatMessage: '', messages: [], unreadCount: 0,
      toastVisible: false, toastMessage: '', toastType: 'success',
      currentTime: '', clockInterval: null,
    };
  },

  computed: {
    isAuthenticated() { return TokenService.isAuthenticated(); },
    token()           { return TokenService.getAccessToken(); },
    peerIds()         { return Object.keys(this.peers); },
    isPresenting()    { return !!(this.screenStream || this.activePresenterId); },
  },

  watch: {
    isPresenting() {
      this.$nextTick(() => this.$nextTick(() => this.bindAllVideos()));
    },
    peerIds(newIds, oldIds) {
      this.$nextTick(() => {
        newIds.forEach(pid => {
          if (!oldIds.includes(pid) && this.peerStreams[pid]) {
            this.bindPeerVideoWithRetry(pid);
          }
        });
      });
    },
  },

  methods: {
    getPeerName(peerId) {
      if (this.peerNames[peerId]) return this.peerNames[peerId];
      const adjectives = ['Happy', 'Clever', 'Swift', 'Brave', 'Calm', 'Bold', 'Kind', 'Wise', 'Cool', 'Bright', 'Sharp', 'Neat'];
      const animals    = ['Panda', 'Falcon', 'Otter', 'Tiger', 'Koala', 'Eagle', 'Fox', 'Wolf', 'Lynx', 'Hawk', 'Bear', 'Deer'];
      let seed = 0;
      for (let i = 0; i < peerId.length; i++) seed += peerId.charCodeAt(i);
      return `${adjectives[seed % adjectives.length]} ${animals[Math.floor(seed / adjectives.length) % animals.length]}`;
    },

    setPeerStream(peerId, stream) {
      this.peerStreams = { ...this.peerStreams, [peerId]: stream };
    },

    bindPeerVideoWithRetry(peerId, attempt = 0) {
      const stream = this.peerStreams[peerId];
      if (!stream) {
        if (attempt < 20) setTimeout(() => this.bindPeerVideoWithRetry(peerId, attempt + 1), 100);
        return;
      }
      const el = this.resolveRef(`peerVideo_${peerId}`);
      if (el) {
        if (el.srcObject !== stream) { el.srcObject = stream; el.play().catch(() => {}); }
        console.log(`✅ Bound peerVideo_${peerId} (attempt ${attempt})`);
      } else if (attempt < 20) {
        setTimeout(() => this.bindPeerVideoWithRetry(peerId, attempt + 1), 100);
      } else {
        console.warn(`⚠️ Could not bind peerVideo_${peerId} after ${attempt} attempts`);
      }
    },

    bindPeerScreenWithRetry(peerId, attempt = 0) {
      const stream = this.peerScreenStreams[peerId];
      if (!stream) return;
      // If activePresenterId isn't set yet, the peerScreen_ element won't exist in DOM.
      // Keep retrying — SCREEN_SHARE_START will also call us again once it's set.
      const el = this.resolveRef(`peerScreen_${peerId}`);
      if (el) {
        if (el.srcObject !== stream) { el.srcObject = stream; el.play().catch(() => {}); }
        console.log(`🖥️ Bound peerScreen_${peerId} (attempt ${attempt})`);
      } else if (attempt < 40) {
        setTimeout(() => this.bindPeerScreenWithRetry(peerId, attempt + 1), 100);
      } else {
        console.warn(`⚠️ Could not bind peerScreen_${peerId} after ${attempt} attempts`);
      }
    },

    goToDashboard() {
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/join-meeting');
    },

    async createMeeting() {
      if (!this.form.title.trim()) { this.createError = 'Please enter a meeting title.'; return; }
      if (!this.token)             { this.createError = 'Session expired — please sign in again.'; return; }
      this.creating = true; this.createError = '';

      const pw = this.form.password.trim();
      const body = {
        title: this.form.title.trim(), description: this.form.description.trim() || null,
        maxParticipants: this.form.maxParticipants || 50, allowGuests: this.form.allowGuests,
        requiresPassword: pw.length > 0, password: pw || null,
        videoEnabled: this.form.videoEnabled, audioEnabled: this.form.audioEnabled,
        chatEnabled: this.form.chatEnabled, screenShareEnabled: this.form.screenShareEnabled,
        isPublic: false,
      };
      try {
        const res = await fetch(`${API}/meetings/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
          body: JSON.stringify(body),
        });
        let data; try { data = await res.json(); } catch { throw new Error(`HTTP ${res.status}`); }
        if (!res.ok || data.success === false) throw new Error(data.message || data.error || `HTTP ${res.status}`);

        const code = data?.data?.meetingCode || data?.data?.meeting_code || data?.data?.code
          || data?.data?.meeting?.meetingCode || data?.data?.meeting?.code
          || data?.meetingCode || data?.code || null;
        if (!code) throw new Error('No meeting code returned from server.');

        try {
          await fetch(`${API}/meetings/start/${code}`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
          });
        } catch (_) {}

        const recent = JSON.parse(sessionStorage.getItem('nova_recent') || '[]');
        recent.unshift({ code, title: body.title, date: new Date().toLocaleDateString() });
        sessionStorage.setItem('nova_recent', JSON.stringify(recent.slice(0, 10)));
        this.created = { code, title: body.title };
      } catch (err) {
        this.createError = err.message || 'Unexpected error.';
      } finally { this.creating = false; }
    },

    copyCreatedCode() {
      if (!this.created.code) return;
      navigator.clipboard.writeText(this.created.code).then(() => this.showToast('Code copied!'));
    },

    enterMeeting() {
      if (!this.created.code) return;
      sessionStorage.setItem('nova_meeting_code', this.created.code);
      this.meetingCode = this.created.code;
      this.isHost = true;
      this.view = 'meeting';
      this.$nextTick(() => this.initMeeting());
    },

    updateClock() {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    async initMeeting() {
      if (!this.meetingCode) {
        this.meetingCode = this.$route?.params?.code || sessionStorage.getItem('nova_meeting_code');
      }
      if (!this.meetingCode) { this.$router.push('/join-meeting'); return; }

      const user = JSON.parse(sessionStorage.getItem('nova_user') || '{}');
      this.userName = user.name || user.username || user.displayName || user.firstName || '';

      if (!this.userName && this.token) {
        try {
          const res = await fetch(`${API}/auth/me`, {
            headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
          });
          if (res.ok) {
            const data = await res.json();
            const u = data?.data || data?.user || data || {};
            this.userName = u.name || u.username || u.displayName || u.firstName || u.email?.split('@')[0] || '';
            if (this.userName) sessionStorage.setItem('nova_user', JSON.stringify({ ...user, name: this.userName }));
          }
        } catch (_) {}
      }

      if (!this.userName) this.userName = 'Guest';
      this.userInitials = this.userName.charAt(0).toUpperCase();

      if (!this.isHost) this.isHost = sessionStorage.getItem('nova_is_host') === 'true';
      if (this.isHost)  sessionStorage.setItem('nova_is_host', 'true');

      this.updateClock();
      this.clockInterval = setInterval(this.updateClock, 10000);

      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
      } catch (err) {
        console.warn('Camera/mic unavailable:', err.message);
        this.videoOn = false; this.audioOn = false;
      }

      await this.$nextTick();
      if (this.$refs.localVideo && this.localStream) {
        this.$refs.localVideo.srcObject = this.localStream;
      }

      this.connectWebSocket();
    },

    connectWebSocket() {
      const url = this.token ? `${WS_URL}?token=${this.token}` : WS_URL;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('✅ WS open');
        this.sendWs({ type: 'JOIN', data: { name: this.userName, peerId: this.myPeerId } });
      };

      this.ws.onmessage = async (e) => {
        let msg;
        try { msg = JSON.parse(e.data); } catch { return; }
        if (!msg.fromPeerId || msg.fromPeerId === this.myPeerId) return;
        await this.handleWsMsg(msg);
      };

      this.ws.onerror = (e) => console.error('WS error', e);
      this.ws.onclose = () => console.log('WS closed');
    },

    sendWs(obj) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        obj.meetingCode = this.meetingCode;
        obj.fromPeerId  = this.myPeerId;
        this.ws.send(JSON.stringify(obj));
      }
    },

    sendNameSync(toPeerId) {
      this.sendWs({ type: 'NAME_SYNC', toPeerId, data: { name: this.userName } });
    },

    async handleWsMsg(msg) {
      const fromId = msg.fromPeerId;
      console.log('📨 WS message:', msg.type, '| from:', fromId);

      switch (msg.type) {

        case 'PARTICIPANT_LIST': {
          const raw = Array.isArray(msg.data) ? msg.data
            : Array.isArray(msg.data?.peers) ? msg.data.peers : [];
          const peerList = raw
            .map(p => (typeof p === 'string' ? { id: p, name: null } : { id: p.peerId || p.id, name: p.name || null }))
            .filter(p => p.id && p.id !== this.myPeerId);
          this.participantCount = peerList.length + 1;
          for (const { id, name } of peerList) {
            if (name) this.peerNames = { ...this.peerNames, [id]: name };
            await this.createPC(id, true);
            this.sendNameSync(id);
          }
          break;
        }

        case 'JOIN': {
          if (!fromId) break;
          this.participantCount++;
          const joinName = msg.data?.name || msg.data?.userName || msg.data?.displayName || null;
          if (joinName) this.peerNames = { ...this.peerNames, [fromId]: joinName };
          await this.createPC(fromId, true);
          this.sendNameSync(fromId);
          break;
        }

        case 'NAME_SYNC': {
          const syncName = msg.data?.name;
          if (fromId && syncName) this.peerNames = { ...this.peerNames, [fromId]: syncName };
          break;
        }

        case 'LEAVE':
          this.peerLeave(fromId);
          break;

        case 'OFFER':
          await this.handleOffer(msg);
          this.sendNameSync(fromId);
          break;

        case 'ANSWER':
          await this.handleAnswer(msg);
          break;

        case 'ICE_CANDIDATE':
          await this.handleICE(msg);
          break;

        case 'CHAT_MESSAGE':
          this.addMsg(msg.data?.senderName || this.peerNames[fromId] || 'Participant', msg.data?.message || '', false);
          if (!this.chatOpen) this.unreadCount++;
          break;

        case 'TOGGLE_AUDIO':
          this.peerMuted = { ...this.peerMuted, [fromId]: !msg.data?.enabled };
          break;

        case 'TOGGLE_VIDEO':
          this.peerVideoOff = { ...this.peerVideoOff, [fromId]: !msg.data?.enabled };
          break;

        case 'SCREEN_SHARE_START':
          this.activePresenterId = fromId;
          await this.$nextTick(); await this.$nextTick();
          // ✅ FIX G: The screen stream may have already arrived via ontrack BEFORE
          // this WS signal (WebRTC negotiation is often faster than WS signaling).
          // Re-trigger bindPeerScreenWithRetry now that the peerScreen_ DOM element
          // exists (activePresenterId just set → v-else-if branch rendered).
          if (this.peerScreenStreams[fromId]) {
            this.bindPeerScreenWithRetry(fromId);
          }
          this.bindAllVideos();
          break;

        case 'SCREEN_SHARE_STOP':
          if (this.activePresenterId === fromId) {
            this.activePresenterId = null;
            const ss = { ...this.peerScreenStreams }; delete ss[fromId]; this.peerScreenStreams = ss;
            await this.$nextTick(); await this.$nextTick();
            this.bindAllVideos();
          }
          break;

        case 'MEETING_ENDED':
          this.showToast('Meeting ended by host.', 'error');
          setTimeout(() => this.cleanupAndNavigate(), 1800);
          break;

        case 'MEETING_RESTARTED':
          this.showToast('Meeting restarted by host.');
          this.cleanupPeers();
          if (this.ws) { this.ws.onclose = null; this.ws.close(); this.ws = null; }
          await this.$nextTick();
          this.connectWebSocket();
          break;
      }
    },

    // ═══════════════════════════════════════════════════════
    //  WEBRTC CORE
    // ═══════════════════════════════════════════════════════
    async createPC(peerId, sendOffer) {
      if (!peerId || peerId === this.myPeerId) return null;
      if (this.peers[peerId]) return this.peers[peerId];

      const pc = new RTCPeerConnection(ICE_SERVERS);

      if (this.localStream) {
        // Camera + audio tracks are added together in localStream
        this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream));
      }

      // ─────────────────────────────────────────────────────────────────
      // ✅ FIX F — Correct camera vs screen track identification
      //
      // THE BUG (old code):
      //   Used `if (!this.peerStreams[peerId])` to decide camera vs screen.
      //   This was unreliable because Vue reactivity doesn't update synchronously,
      //   so the second track could arrive before the first track's reactive update
      //   was committed — both tracks would be treated as "camera".
      //
      // THE FIX:
      //   On the SENDER side, we add the screen track in a brand-new MediaStream
      //   (`screenOnlyStream = new MediaStream([screenTrack])`), giving it a unique
      //   stream.id different from `localStream.id`.
      //
      //   On the RECEIVER side, we remember the FIRST stream.id we see per peer
      //   as `peerCameraStreamIds[peerId]`. Any track that arrives in a stream with
      //   a DIFFERENT id is unambiguously the screen share track.
      //
      //   This is a deterministic check — no races, no timing dependencies.
      // ─────────────────────────────────────────────────────────────────
      pc.ontrack = (event) => {
        const track = event.track;
        const incomingStream = event.streams[0];

        // Audio is routed automatically; skip it here.
        if (track.kind === 'audio') return;

        console.log(`🎥 ontrack from ${peerId}: kind=${track.kind}, streamId=${incomingStream?.id}`);

        if (!incomingStream) {
          // Orphan track (no stream) — wrap it and treat as camera fallback
          if (!this.peerCameraStreamIds[peerId]) {
            const s = new MediaStream([track]);
            this.peerCameraStreamIds = { ...this.peerCameraStreamIds, [peerId]: s.id };
            this.setPeerStream(peerId, s);
            this.$nextTick(() => this.bindPeerVideoWithRetry(peerId));
          }
          return;
        }

        const knownCamId = this.peerCameraStreamIds[peerId];

        if (!knownCamId) {
          // ── First video track → CAMERA ──
          this.peerCameraStreamIds = { ...this.peerCameraStreamIds, [peerId]: incomingStream.id };
          this.setPeerStream(peerId, incomingStream);
          this.$nextTick(() => this.bindPeerVideoWithRetry(peerId));
          console.log(`📷 Camera stream set for ${peerId}: ${incomingStream.id}`);

        } else if (incomingStream.id !== knownCamId) {
          // ── Different stream.id → SCREEN SHARE ──
          this.peerScreenStreams = { ...this.peerScreenStreams, [peerId]: incomingStream };
          this.$nextTick(() => this.bindPeerScreenWithRetry(peerId));
          console.log(`🖥️ Screen stream set for ${peerId}: ${incomingStream.id}`);

        } else {
          // ── Same stream.id as camera → re-negotiation / update of camera ──
          this.setPeerStream(peerId, incomingStream);
          this.$nextTick(() => this.bindPeerVideoWithRetry(peerId));
          console.log(`🔄 Camera stream updated for ${peerId}: ${incomingStream.id}`);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendWs({ type: 'ICE_CANDIDATE', toPeerId: peerId, data: event.candidate.toJSON() });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`🔗 [${peerId.slice(-4)}] connectionState: ${pc.connectionState}`);
        if (pc.connectionState === 'failed') pc.restartIce();
        if (pc.connectionState === 'disconnected') {
          setTimeout(() => {
            if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) this.peerLeave(peerId);
          }, 5000);
        }
      };

      this.peers = { ...this.peers, [peerId]: pc };
      this.pendingCandidates[peerId] = [];

      if (sendOffer) {
        try {
          const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
          await pc.setLocalDescription(offer);
          this.sendWs({ type: 'OFFER', toPeerId: peerId, data: pc.localDescription, senderName: this.userName });
          console.log(`📤 Offer → ${peerId}`);
        } catch (err) {
          console.error('createOffer failed:', err);
        }
      }

      return pc;
    },

    async handleOffer(msg) {
      const peerId = msg.fromPeerId;
      if (!peerId || peerId === this.myPeerId) return;
      console.log(`📥 Offer ← ${peerId}`);

      const offererName = msg.senderName || msg.data?.senderName || null;
      if (offererName) this.peerNames = { ...this.peerNames, [peerId]: offererName };

      const pc = this.peers[peerId] || await this.createPC(peerId, false);

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        const queued = this.pendingCandidates[peerId] || [];
        for (const c of queued) { try { await pc.addIceCandidate(c); } catch (e) { console.warn('ICE drain:', e); } }
        this.pendingCandidates[peerId] = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.sendWs({ type: 'ANSWER', toPeerId: peerId, data: pc.localDescription, senderName: this.userName });
        console.log(`📤 Answer → ${peerId}`);
      } catch (err) {
        console.error('handleOffer error:', err);
      }
    },

    async handleAnswer(msg) {
      const peerId = msg.fromPeerId;
      const pc = this.peers[peerId];
      if (!pc) return;

      const answererName = msg.senderName || msg.data?.senderName || null;
      if (answererName) this.peerNames = { ...this.peerNames, [peerId]: answererName };

      try {
        if (pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
          console.log(`✅ Answer set for ${peerId}`);
          const queued = this.pendingCandidates[peerId] || [];
          for (const c of queued) { try { await pc.addIceCandidate(c); } catch (e) { console.warn('ICE drain:', e); } }
          this.pendingCandidates[peerId] = [];
        }
      } catch (err) {
        console.error('handleAnswer error:', err);
      }
    },

    async handleICE(msg) {
      const peerId = msg.fromPeerId;
      const pc = this.peers[peerId];
      if (!pc || !msg.data) return;

      const candidate = new RTCIceCandidate(msg.data);
      if (!pc.remoteDescription?.type) {
        if (!this.pendingCandidates[peerId]) this.pendingCandidates[peerId] = [];
        this.pendingCandidates[peerId].push(candidate);
        return;
      }
      try { await pc.addIceCandidate(candidate); }
      catch (e) { console.warn('addIceCandidate error:', e); }
    },

    resolveRef(key) {
      const r = this.$refs[key];
      return Array.isArray(r) ? r[0] : r;
    },

    bindAllVideos() {
      const localEl = this.$refs.localVideo;
      if (localEl && this.localStream && localEl.srcObject !== this.localStream) {
        localEl.srcObject = this.localStream;
      }
      const screenEl = this.$refs.screenVideo;
      if (screenEl && this.screenStream && screenEl.srcObject !== this.screenStream) {
        screenEl.srcObject = this.screenStream;
        screenEl.play().catch(() => {});
      }
      this.peerIds.forEach(pid => {
        this.bindPeerVideoWithRetry(pid);
        if (this.peerScreenStreams[pid]) this.bindPeerScreenWithRetry(pid);
      });
    },

    peerLeave(peerId) {
      try { this.peers[peerId]?.close(); } catch (_) {}
      const p = { ...this.peers };   delete p[peerId];   this.peers = p;
      const s = { ...this.peerStreams }; delete s[peerId]; this.peerStreams = s;
      const ss = { ...this.peerScreenStreams }; delete ss[peerId]; this.peerScreenStreams = ss;
      const ci = { ...this.peerCameraStreamIds }; delete ci[peerId]; this.peerCameraStreamIds = ci;
      const n = { ...this.peerNames };   delete n[peerId];   this.peerNames = n;
      const m = { ...this.peerMuted };   delete m[peerId];   this.peerMuted = m;
      const v = { ...this.peerVideoOff }; delete v[peerId]; this.peerVideoOff = v;
      delete this.pendingCandidates[peerId];
      if (this.activePresenterId === peerId) this.activePresenterId = null;
      this.participantCount = Math.max(1, this.participantCount - 1);
      console.log(`👋 ${peerId} left`);
    },

    cleanupPeers() {
      Object.values(this.peers).forEach(pc => { try { pc.close(); } catch (_) {} });
      this.peers = {}; this.peerStreams = {}; this.peerScreenStreams = {};
      this.peerCameraStreamIds = {};
      this.peerNames = {}; this.peerMuted = {}; this.peerVideoOff = {};
      this.pendingCandidates = {}; this._screenSenders = [];
      this.activePresenterId = null; this.participantCount = 1;
    },

    toggleAudio() {
      if (!this.localStream) return;
      this.audioOn = !this.audioOn;
      this.localStream.getAudioTracks().forEach(t => { t.enabled = this.audioOn; });
      this.sendWs({ type: 'TOGGLE_AUDIO', data: { enabled: this.audioOn } });
    },

    toggleVideo() {
      if (!this.localStream) return;
      this.videoOn = !this.videoOn;
      this.localStream.getVideoTracks().forEach(t => { t.enabled = this.videoOn; });
      this.sendWs({ type: 'TOGGLE_VIDEO', data: { enabled: this.videoOn } });
    },

 async toggleScreen() {
  if (this.screenStream) {
    // ── STOP SHARING ──
    this.screenStream.getTracks().forEach(t => t.stop());
    this.screenStream = null;

    // Remove the screen track from all peer connections
    for (const [peerId, pc] of Object.entries(this.peers)) {
      if (this._screenSenders && this._screenSenders[peerId]) {
        try {
          pc.removeTrack(this._screenSenders[peerId]);
        } catch (e) { console.warn(e); }
      }
      // Re-negotiate after removing track
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.sendWs({ type: 'OFFER', toPeerId: peerId, data: pc.localDescription });
    }
    this._screenSenders = {};

    this.sendWs({ type: 'SCREEN_SHARE_STOP' });
    await this.$nextTick(); 
    this.bindAllVideos();
  } else {
    // ── START SHARING ──
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: 'always' }, 
        audio: false 
      });
      const screenTrack = this.screenStream.getVideoTracks()[0];

      if (!this._screenSenders) this._screenSenders = {};

      for (const [peerId, pc] of Object.entries(this.peers)) {
        try {
          // Create a stream with a unique ID for the screen
          const screenOnlyStream = new MediaStream([screenTrack]);
          const sender = pc.addTrack(screenTrack, screenOnlyStream);
          this._screenSenders[peerId] = sender;

          // ✅ CRITICAL: Trigger Renegotiation
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          this.sendWs({ 
            type: 'OFFER', 
            toPeerId: peerId, 
            data: pc.localDescription, 
            senderName: this.userName 
          });
        } catch (e) { console.warn('addTrack failed for peer:', peerId, e); }
      }

      screenTrack.onended = () => this.toggleScreen();
      this.sendWs({ type: 'SCREEN_SHARE_START' });
      
      await this.$nextTick();
      this.bindAllVideos();
    } catch (err) {
      if (err.name !== 'NotAllowedError') this.showToast('Screen share failed.', 'error');
      this.screenStream = null;
    }
  }
},

    endMeeting()     { this.showEndModal = true; },
    restartMeeting() { this.showRestartModal = true; },

    async confirmEndMeeting() {
      this.ending = true;
      try {
        await fetch(`${API}/meetings/end/${this.meetingCode}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        });
        this.sendWs({ type: 'MEETING_ENDED', data: { endedBy: this.userName } });
      } catch (err) { console.error('End meeting error:', err); }
      setTimeout(() => {
        this.ending = false; this.showEndModal = false;
        sessionStorage.removeItem('nova_is_host');
        sessionStorage.removeItem('nova_meeting_code');
        this.cleanupAndNavigate();
      }, 600);
    },

    async confirmRestartMeeting() {
      this.restarting = true;
      try {
        await fetch(`${API}/meetings/end/${this.meetingCode}`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        }).catch(() => {});
        await fetch(`${API}/meetings/start/${this.meetingCode}`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${this.token}`, 'ngrok-skip-browser-warning': 'true' },
        }).catch(() => {});

        this.sendWs({ type: 'MEETING_RESTARTED', data: { restartedBy: this.userName } });
        this.cleanupPeers();
        if (this.ws) { this.ws.onclose = null; this.ws.close(); this.ws = null; }
        this.showRestartModal = false; this.restarting = false;
        this.messages = [];
        this.showToast('Meeting restarted!');
        await this.$nextTick();
        this.connectWebSocket();
      } catch (err) {
        console.error('Restart error:', err);
        this.restarting = false;
        this.showToast('Failed to restart meeting.', 'error');
      }
    },

    toggleChat() {
      this.chatOpen = !this.chatOpen;
      if (this.chatOpen) this.unreadCount = 0;
    },

    sendMessage() {
      const text = this.chatMessage.trim(); if (!text) return;
      this.addMsg(this.userName, text, true);
      this.sendWs({ type: 'CHAT_MESSAGE', data: { message: text, senderName: this.userName, timestamp: Date.now() } });
      this.chatMessage = '';
    },

    addMsg(sender, text, isSelf) {
      this.messages.push({ id: Date.now() + Math.random(), sender, text, isSelf });
      this.$nextTick(() => {
        const c = this.$refs.messagesContainer;
        if (c) c.scrollTop = c.scrollHeight;
      });
    },

    copyMeetingCode() {
      navigator.clipboard.writeText(this.meetingCode).then(() => this.showToast('Code copied!'));
    },

    showToast(msg, type = 'success') {
      this.toastMessage = msg; this.toastType = type; this.toastVisible = true;
      setTimeout(() => { this.toastVisible = false; }, 2800);
    },

    goBack() {
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/join-meeting');
    },

    cleanupAndNavigate() {
      this.localStream?.getTracks().forEach(t => t.stop());
      this.screenStream?.getTracks().forEach(t => t.stop());
      this.cleanupPeers();
      if (this.ws) {
        this.ws.onclose = null;
        try { this.sendWs({ type: 'LEAVE' }); } catch (_) {}
        this.ws.close(); this.ws = null;
      }
      sessionStorage.removeItem('nova_meeting_code');
      sessionStorage.removeItem('nova_is_host');
      clearInterval(this.clockInterval);
      if (window.history.length > 1) this.$router.go(-1);
      else this.$router.push(this.isAuthenticated ? '/meeting-dashboard' : '/join-meeting');
    },

    leave() {
      const msg = this.isHost ? 'Leave this meeting? (Use "End" to close for everyone.)' : 'Leave this meeting?';
      if (!confirm(msg)) return;
      this.cleanupAndNavigate();
    },
  },

  mounted() {
    const forceCreate = this.$route?.query?.create === 'true';
    if (forceCreate) {
      sessionStorage.removeItem('nova_meeting_code');
      sessionStorage.removeItem('nova_is_host');
      this.view = 'create';
    } else {
      const routeCode = this.$route?.params?.code || sessionStorage.getItem('nova_meeting_code');
      if (routeCode) {
        this.meetingCode = routeCode;
        this.isHost = sessionStorage.getItem('nova_is_host') === 'true';
        this.view = 'meeting';
        this.$nextTick(() => this.initMeeting());
      }
    }

    this._keyHandler = (e) => {
      if (this.view !== 'meeting') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'd') this.toggleVideo();
      if (e.key === 'a') this.toggleAudio();
    };
    window.addEventListener('keydown', this._keyHandler);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this._keyHandler);
    clearInterval(this.clockInterval);
    this.localStream?.getTracks().forEach(t => t.stop());
    this.screenStream?.getTracks().forEach(t => t.stop());
    this.cleanupPeers();
    if (this.ws) { this.ws.onclose = null; this.ws.close(); this.ws = null; }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Mono&display=swap');

.nv-root {
  --c-bg:     #202124; --c-surf:   #292b2f; --c-surf2:  #3c4043;
  --c-line:   #3c4043; --c-blue:   #1a73e8; --c-blue2:  #174ea6;
  --c-green:  #34a853; --c-red:    #ea4335; --c-red-bg: rgba(234,67,53,.15);
  --c-orange: #fa7b17; --c-text:   #e8eaed; --c-text2:  #9aa0a6; --c-r: 8px;
  font-family: 'Google Sans', system-ui, sans-serif;
}

/* ── CREATE ───────────────────────────────────────────── */
.nv-create-wrap { min-height:100vh; background:var(--c-bg); color:var(--c-text); display:flex; flex-direction:column; }
.nv-cnav { display:flex; align-items:center; justify-content:space-between; padding:14px 32px; background:var(--c-surf); border-bottom:1px solid var(--c-line); }
.nv-cbrand { display:flex; align-items:center; gap:10px; font-size:17px; font-weight:600; color:var(--c-text); cursor:pointer; }
.nv-cnav-back { display:flex; align-items:center; gap:7px; padding:7px 16px; border:1px solid var(--c-line); border-radius:var(--c-r); background:transparent; color:var(--c-text2); font-family:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; }
.nv-cnav-back:hover { border-color:var(--c-blue); color:var(--c-text); background:rgba(26,115,232,.08); }
.nv-cmain { max-width:560px; margin:0 auto; padding:44px 24px 60px; width:100%; }
.nv-chead { margin-bottom:28px; }
.nv-ctitle { font-size:26px; font-weight:600; color:var(--c-text); letter-spacing:-.3px; margin-bottom:6px; }
.nv-csub { font-size:14px; color:var(--c-text2); }
.nv-card { background:var(--c-surf); border:1px solid var(--c-line); border-radius:16px; padding:32px; box-shadow:0 8px 40px rgba(0,0,0,.4); }
.nv-success-banner { display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:12px; background:rgba(52,168,83,.1); border:1px solid rgba(52,168,83,.3); margin-bottom:24px; flex-wrap:wrap; }
.nv-success-check { width:36px; height:36px; border-radius:50%; background:rgba(52,168,83,.2); border:1px solid rgba(52,168,83,.4); display:flex; align-items:center; justify-content:center; color:#81c995; flex-shrink:0; }
.nv-success-title { font-size:14px; font-weight:600; color:var(--c-text); }
.nv-success-sub { font-size:12px; color:var(--c-text2); margin-top:2px; }
.nv-code-pill { display:flex; align-items:center; gap:7px; margin-left:auto; padding:8px 16px; border-radius:24px; background:rgba(52,168,83,.12); border:1px solid rgba(52,168,83,.3); font-family:'Google Sans Mono',monospace; font-size:15px; font-weight:600; color:#81c995; cursor:pointer; letter-spacing:1px; transition:background .15s; }
.nv-code-pill:hover { background:rgba(52,168,83,.22); }
.nv-section-label { font-size:11px; font-weight:600; letter-spacing:.8px; text-transform:uppercase; color:var(--c-text2); margin-bottom:14px; }
.nv-field { margin-bottom:16px; }
.nv-flabel { display:block; font-size:13px; font-weight:500; color:var(--c-text2); margin-bottom:7px; }
.nv-req { color:var(--c-red); } .nv-opt { color:#5f6368; font-weight:400; }
.nv-finput { width:100%; padding:11px 14px; background:var(--c-surf2); border:1px solid var(--c-line); border-radius:var(--c-r); color:var(--c-text); font-family:inherit; font-size:14px; transition:border-color .15s,box-shadow .15s; box-sizing:border-box; }
.nv-finput::placeholder { color:#5f6368; }
.nv-finput:focus { outline:none; border-color:var(--c-blue); box-shadow:0 0 0 3px rgba(26,115,232,.18); }
.nv-ftextarea { resize:vertical; min-height:70px; line-height:1.5; }
.nv-row2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.nv-toggle-list { border:1px solid var(--c-line); border-radius:var(--c-r); overflow:hidden; }
.nv-trow { display:flex; align-items:center; justify-content:space-between; padding:13px 16px; cursor:pointer; border-bottom:1px solid var(--c-line); transition:background .12s; }
.nv-trow:last-child { border-bottom:none; }
.nv-trow:hover { background:rgba(255,255,255,.03); }
.nv-trow-label { font-size:14px; color:var(--c-text); } .nv-trow-sub { font-size:12px; color:var(--c-text2); margin-top:2px; }
.nv-switch { width:40px; height:22px; border-radius:22px; background:var(--c-surf2); border:1px solid var(--c-line); position:relative; flex-shrink:0; transition:background .2s,border-color .2s; }
.nv-switch--on { background:var(--c-blue); border-color:var(--c-blue); }
.nv-switch-thumb { position:absolute; width:16px; height:16px; border-radius:50%; background:var(--c-text2); top:2px; left:2px; transition:transform .2s,background .2s; }
.nv-switch--on .nv-switch-thumb { transform:translateX(18px); background:#fff; }
.nv-btn-primary { width:100%; margin-top:24px; padding:13px 20px; background:var(--c-blue); border:none; border-radius:var(--c-r); color:#fff; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s,transform .1s,box-shadow .15s; box-shadow:0 2px 12px rgba(26,115,232,.35); }
.nv-btn-primary:hover:not(:disabled) { background:var(--c-blue2); transform:translateY(-1px); box-shadow:0 6px 20px rgba(26,115,232,.45); }
.nv-btn-primary:disabled { opacity:.55; cursor:not-allowed; }
.nv-btn-go { background:#34a853; box-shadow:0 2px 12px rgba(52,168,83,.35); }
.nv-btn-go:hover:not(:disabled) { background:#2d9248; }
.nv-btn-ghost { width:100%; margin-top:10px; padding:12px 20px; background:transparent; border:1px solid var(--c-line); border-radius:var(--c-r); color:var(--c-text2); font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; transition:all .15s; }
.nv-btn-ghost:hover { border-color:var(--c-blue); color:var(--c-text); background:rgba(26,115,232,.06); }
.nv-postcreate { margin-top:8px; }
.nv-alert-error { display:flex; align-items:center; gap:8px; margin-top:14px; padding:11px 14px; border-radius:var(--c-r); background:rgba(234,67,53,.1); border:1px solid rgba(234,67,53,.3); font-size:13px; color:#f28b82; }
.nv-spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:nv-spin .65s linear infinite; }
.nv-spinner--sm { width:13px; height:13px; border:2px solid rgba(255,255,255,.25); border-top-color:currentColor; }
@keyframes nv-spin { to { transform:rotate(360deg); } }

/* ── MEETING ──────────────────────────────────────────── */
.nv-meet { background:var(--c-bg); color:var(--c-text); display:flex; flex-direction:column; position:fixed; inset:0; z-index:9999; overflow:hidden; }
.nv-header { height:60px; flex-shrink:0; background:var(--c-bg); border-bottom:1px solid var(--c-line); display:flex; align-items:center; justify-content:space-between; padding:0 20px; z-index:10; }
.nv-hleft,.nv-hright { display:flex; align-items:center; gap:12px; }
.nv-brand { display:flex; align-items:center; gap:8px; }
.nv-brand-name { font-size:16px; font-weight:600; letter-spacing:-.2px; }
.nv-live-pill { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; letter-spacing:.5px; padding:3px 8px; border-radius:20px; background:rgba(234,67,53,.14); border:1px solid rgba(234,67,53,.3); color:#f28b82; }
.nv-live-dot { width:6px; height:6px; border-radius:50%; background:var(--c-red); animation:nv-pulse 2s ease-in-out infinite; }
@keyframes nv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.65)} }
.nv-host-badge { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:600; padding:3px 9px; border-radius:20px; background:rgba(250,123,23,.14); border:1px solid rgba(250,123,23,.35); color:#fba45c; }
.nv-code-chip { display:flex; align-items:center; gap:6px; padding:5px 12px; background:var(--c-surf); border:1px solid var(--c-line); border-radius:var(--c-r); color:#8ab4f8; font-family:'Google Sans Mono',monospace; font-size:12px; cursor:pointer; transition:background .15s; }
.nv-code-chip:hover { background:var(--c-surf2); border-color:#8ab4f8; }
.nv-pcount { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--c-text2); }
.nv-clock { font-size:13px; color:var(--c-text2); min-width:42px; text-align:right; }
.nv-hbtn { display:flex; align-items:center; gap:6px; padding:7px 14px; border:1px solid var(--c-line); border-radius:var(--c-r); background:transparent; color:var(--c-text2); font-family:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; position:relative; }
.nv-hbtn:hover,.nv-hbtn--on { background:var(--c-surf2); color:var(--c-text); border-color:var(--c-surf2); }
.nv-hbtn--danger { border-color:rgba(234,67,53,.35); color:#f28b82; }
.nv-hbtn--danger:hover { background:rgba(234,67,53,.14); border-color:var(--c-red); }
.nv-unread { min-width:17px; height:17px; border-radius:9px; background:var(--c-blue); color:#fff; font-size:10px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; padding:0 4px; }

/* ── GRID ─────────────────────────────────────────────── */
.nv-grid { flex:1; min-height:0; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px; padding:16px; overflow-y:auto; align-content:start; background:var(--c-bg); }
.nv-grid:has(> .nv-tile:nth-child(2))  { grid-template-columns:repeat(2,1fr); }
.nv-grid:has(> .nv-tile:nth-child(5))  { grid-template-columns:repeat(3,1fr); }
.nv-grid:has(> .nv-tile:nth-child(10)) { grid-template-columns:repeat(4,1fr); }
.nv-grid--presenting { grid-template-columns:1fr 300px; grid-template-rows:1fr; align-content:stretch; gap:12px; }
.nv-gmain { grid-column:1; grid-row:1; display:flex; align-items:center; justify-content:center; min-height:0; border-radius:16px; overflow:hidden; background:#000; }
.nv-gsidebar { grid-column:2; grid-row:1; display:flex; flex-direction:column; gap:10px; overflow-y:auto; min-height:0; padding-right:4px; }
.nv-gsidebar .nv-tile { flex-shrink:0; aspect-ratio:16/9; min-height:100px; }
.nv-gsidebar::-webkit-scrollbar { width:6px; }
.nv-gsidebar::-webkit-scrollbar-thumb { background:var(--c-surf2); border-radius:3px; }
.nv-tile { position:relative; background:var(--c-surf); border-radius:12px; overflow:hidden; aspect-ratio:16/9; border:1px solid var(--c-line); transition:border-color .2s; }
.nv-tile:hover { border-color:#5f6368; }
.nv-tile--me { border:2px solid rgba(52,168,83,.4); box-shadow:0 0 0 1px rgba(52,168,83,.2); }
.nv-tile--me:hover { border-color:var(--c-green); }
.nv-tile--screen { width:100%; height:100%; aspect-ratio:unset; border:2px solid var(--c-blue); box-shadow:0 0 0 1px rgba(26,115,232,.25); }
.nv-tile video { width:100%; height:100%; object-fit:cover; display:block; }
.nv-tile--screen video { object-fit:contain; background:#000; }
.nv-tilebar { position:absolute; bottom:0; left:0; right:0; padding:22px 10px 9px; background:linear-gradient(to top,rgba(0,0,0,.72) 0%,transparent 100%); display:flex; align-items:flex-end; justify-content:space-between; pointer-events:none; z-index:2; }
.nv-tilemeta { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.5); }
.nv-tilebadges { display:flex; gap:4px; }
.nv-you-dot { width:6px; height:6px; border-radius:50%; background:var(--c-green); flex-shrink:0; }
.nv-badge { width:22px; height:22px; border-radius:5px; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); }
.nv-badge--red  { background:rgba(234,67,53,.88); }
.nv-badge--blue { background:rgba(26,115,232,.88); }
.nv-nocam { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:var(--c-surf); z-index:1; }
.nv-avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#1a73e8,#0d47a1); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:600; color:#fff; box-shadow:0 4px 16px rgba(26,115,232,.35); }
.nv-avatar--sm { width:40px; height:40px; font-size:14px; }

/* ── CONTROLS ─────────────────────────────────────────── */
.nv-controls { height:80px; flex-shrink:0; background:var(--c-bg); border-top:1px solid var(--c-line); display:flex; align-items:center; justify-content:center; }
.nv-ctrl-row { display:flex; align-items:center; gap:6px; }
.nv-cslot { display:flex; flex-direction:column; align-items:center; gap:5px; }
.nv-ctrl { width:48px; height:48px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s,transform .1s; color:var(--c-text); }
.nv-ctrl:hover:not(:disabled) { transform:scale(1.06); }
.nv-ctrl:disabled { opacity:.5; cursor:not-allowed; }
.nv-ctrl--on  { background:var(--c-surf2); border:1px solid var(--c-line); }
.nv-ctrl--on:hover { background:#4e5256; }
.nv-ctrl--off { background:var(--c-red-bg); color:#f28b82; border:1px solid rgba(234,67,53,.3); }
.nv-ctrl--off:hover { background:rgba(234,67,53,.25); }
.nv-ctrl--sharing { background:rgba(26,115,232,.2); color:#8ab4f8; border:1px solid rgba(26,115,232,.3); }
.nv-ctrl--leave { width:52px; height:52px; background:var(--c-red); color:#fff; box-shadow:0 2px 12px rgba(234,67,53,.4); }
.nv-ctrl--leave:hover { background:#d33828; }
.nv-ctrl--end { width:52px; height:52px; background:rgba(234,67,53,.18); color:#f28b82; border:2px solid rgba(234,67,53,.5); }
.nv-ctrl--end:hover:not(:disabled) { background:var(--c-red); color:#fff; border-color:var(--c-red); }
.nv-ctrl--restart { background:rgba(250,123,23,.15); color:#fba45c; border:1.5px solid rgba(250,123,23,.4); }
.nv-ctrl--restart:hover:not(:disabled) { background:rgba(250,123,23,.3); }
.nv-clabel { font-size:10px; color:var(--c-text2); white-space:nowrap; font-weight:500; }
.nv-clabel--red    { color:#f28b82; }
.nv-clabel--orange { color:#fba45c; }
.nv-cdivider { width:1px; height:32px; background:var(--c-line); margin:0 8px; }

/* ── CHAT ─────────────────────────────────────────────── */
.nv-chat { position:fixed; top:0; right:-380px; height:100%; width:360px; background:var(--c-surf); border-left:1px solid var(--c-line); display:flex; flex-direction:column; z-index:10000; transition:right .25s cubic-bezier(.4,0,.2,1); }
.nv-chat--open { right:0; }
.nv-chdr { height:56px; flex-shrink:0; border-bottom:1px solid var(--c-line); display:flex; align-items:center; justify-content:space-between; padding:0 18px; }
.nv-chdr-title { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; }
.nv-chdr-close { width:32px; height:32px; border:none; background:transparent; border-radius:50%; color:var(--c-text2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.nv-chdr-close:hover { background:var(--c-surf2); color:var(--c-text); }
.nv-cmsgs { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; scrollbar-width:thin; }
.nv-cempty { display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--c-text2); font-size:13px; padding-top:40px; }
.nv-cmsg { padding:10px 13px; background:var(--c-surf2); border-radius:10px; }
.nv-cmsg--self { background:rgba(26,115,232,.18); border:1px solid rgba(26,115,232,.25); }
.nv-cmsg-who  { font-size:11px; font-weight:600; color:#8ab4f8; margin-bottom:4px; }
.nv-cmsg-body { font-size:14px; line-height:1.5; word-break:break-word; }
.nv-cfoot { padding:12px 14px; border-top:1px solid var(--c-line); display:flex; gap:8px; flex-shrink:0; }
.nv-cinput { flex:1; padding:10px 14px; background:var(--c-surf2); border:1px solid var(--c-line); border-radius:24px; color:var(--c-text); font-family:inherit; font-size:14px; transition:border-color .15s; }
.nv-cinput::placeholder { color:var(--c-text2); }
.nv-cinput:focus { outline:none; border-color:var(--c-blue); }
.nv-csend { width:38px; height:38px; border:none; border-radius:50%; background:var(--c-blue); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; flex-shrink:0; }
.nv-csend:disabled { opacity:.4; cursor:default; }
.nv-csend:not(:disabled):hover { background:var(--c-blue2); }

/* ── MODALS ───────────────────────────────────────────── */
.nv-modal-overlay { position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,.65); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:nv-fade-in .18s ease; }
@keyframes nv-fade-in { from{opacity:0} to{opacity:1} }
.nv-modal { background:var(--c-surf); border:1px solid var(--c-line); border-radius:20px; padding:36px 32px 28px; width:100%; max-width:420px; text-align:center; box-shadow:0 24px 80px rgba(0,0,0,.6); animation:nv-slide-up .2s cubic-bezier(.34,1.56,.64,1); }
@keyframes nv-slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.nv-modal-icon { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
.nv-modal-icon--red  { background:rgba(234,67,53,.15); color:#f28b82; border:1.5px solid rgba(234,67,53,.4); }
.nv-modal-icon--blue { background:rgba(26,115,232,.15); color:#8ab4f8; border:1.5px solid rgba(26,115,232,.4); }
.nv-modal-title { font-size:20px; font-weight:600; color:var(--c-text); margin-bottom:12px; }
.nv-modal-body  { font-size:14px; color:var(--c-text2); line-height:1.6; margin-bottom:28px; }
.nv-modal-actions { display:flex; gap:10px; justify-content:center; }
.nv-modal-btn { flex:1; padding:12px 20px; border-radius:var(--c-r); font-family:inherit; font-size:14px; font-weight:600; cursor:pointer; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:7px; max-width:180px; }
.nv-modal-btn--ghost   { background:transparent; border:1px solid var(--c-line); color:var(--c-text2); }
.nv-modal-btn--ghost:hover { border-color:var(--c-text2); color:var(--c-text); }
.nv-modal-btn--danger  { background:var(--c-red); border:none; color:#fff; }
.nv-modal-btn--danger:hover:not(:disabled) { background:#d33828; }
.nv-modal-btn--danger:disabled { opacity:.55; cursor:not-allowed; }
.nv-modal-btn--primary { background:var(--c-blue); border:none; color:#fff; }
.nv-modal-btn--primary:hover:not(:disabled) { background:var(--c-blue2); }
.nv-modal-btn--primary:disabled { opacity:.55; cursor:not-allowed; }

/* ── TOAST ────────────────────────────────────────────── */
.nv-toast { position:fixed; bottom:96px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:8px; padding:10px 20px; border-radius:24px; background:var(--c-surf2); border:1px solid var(--c-line); font-size:13px; font-weight:500; color:#81c995; box-shadow:0 4px 24px rgba(0,0,0,.4); z-index:10001; pointer-events:none; white-space:nowrap; }
.nv-toast--error { color:#f28b82; border-color:rgba(234,67,53,.35); }
.nv-toast-fx-enter-active,.nv-toast-fx-leave-active { transition:opacity .2s,transform .2s; }
.nv-toast-fx-enter-from { opacity:0; transform:translateX(-50%) translateY(10px); }
.nv-toast-fx-leave-to   { opacity:0; transform:translateX(-50%) translateY(10px); }

@media (max-width:960px) {
  .nv-grid--presenting { grid-template-columns:1fr; grid-template-rows:1fr auto; }
  .nv-gmain   { grid-column:1; grid-row:1; }
  .nv-gsidebar { grid-column:1; grid-row:2; flex-direction:row; max-height:140px; overflow-x:auto; overflow-y:hidden; }
  .nv-gsidebar .nv-tile { min-width:180px; }
  .nv-chat { width:100vw; right:-100vw; }
  .nv-modal { margin:0 16px; }
}
</style>