<!-- components/HeroSection.vue -->
<template>
  <section class="hero">
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <div class="container hero-container">
      <div class="hero-content">
        <h1>Powering Intelligent Collaboration with Nova Space</h1>
        <p class="hero-subtitle">
          A unified AI-powered workspace for collaboration, live chat, conferencing,
          and multi-format document creation.
        </p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-large" @click="$router.push('/auth')">
            <i class="fas fa-rocket icon"></i>
            Get Started Free
          </button>
          <button class="btn btn-outline btn-large" @click="openDemo">
            <i class="fas fa-play-circle icon"></i>
            Watch Demo
          </button>
        </div>
      </div>

      <div class="hero-image">
        <div class="dashboard-mockup">
          <div class="mockup-header">
            <div class="mockup-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="mockup-title">Workspace - Project Nova</div>
          </div>
          <div class="mockup-content">
            <div class="workspace-panel">
              <div class="panel-header">
                <i class="fas fa-file-alt icon"></i>
                <span>Document Editor</span>
              </div>
              <div class="editor-content">
                <div class="code-line"></div>
                <div class="code-line short"></div>
                <div class="code-line"></div>
              </div>
            </div>
            <div class="chat-panel">
              <div class="panel-header">
                <i class="fas fa-comments icon"></i>
                <span>Team Chat</span>
              </div>
              <div class="chat-messages">
                <div class="message"></div>
                <div class="message"></div>
              </div>
            </div>
            <div class="ai-panel">
              <div class="panel-header">
                <i class="fas fa-brain icon"></i>
                <span>AI Assistant</span>
              </div>
              <div class="ai-suggestion"></div>
            </div>
            <div class="video-panel">
              <div class="panel-header">
                <i class="fas fa-video icon"></i>
                <span>Video Call</span>
              </div>
              <div class="video-preview"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DEMO MODAL ===== -->
    <transition name="fade">
      <div v-if="demoOpen" class="modal-overlay" @click.self="closeDemo">
        <div class="modal-box">
          <button class="modal-close" @click="closeDemo" aria-label="Close demo">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-header">
            <i class="fas fa-play-circle modal-icon"></i>
            <span>Nova Space — Product Demo</span>
          </div>
          <div class="video-wrapper">
            <iframe
              v-if="demoOpen"
              :src="`https://www.youtube.com/embed/BxNWGgSvAWY?autoplay=1&rel=0&modestbranding=1`"
              title="Nova Space Demo"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      demoOpen: false,
    }
  },
  methods: {
    openDemo() {
      this.demoOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeDemo() {
      this.demoOpen = false
      document.body.style.overflow = ''
    },
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.demoOpen) this.closeDemo()
    })
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
}
</script>

<style scoped>
/* ========== HERO ========== */
.hero {
  background: linear-gradient(135deg, #ffffff 0%, #e6f0fa 100%);
  padding: 60px 0;
  overflow: hidden;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  max-width: 600px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4a4a4a;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.btn-large .icon {
  font-size: 1.1rem;
}

.panel-header .icon {
  font-size: 14px;
  color: #4a90e2;
}

.btn-large:hover .icon {
  transform: translateX(3px);
}

.btn-outline:hover .icon {
  transform: scale(1.15);
}

/* ========== MOCKUP ========== */
.hero-image {
  position: relative;
}

.dashboard-mockup {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(184, 209, 230, 0.3);
  overflow: hidden;
  border: 1px solid #e6f0fa;
}

.mockup-header {
  background-color: #f8fafc;
  padding: 16px;
  border-bottom: 1px solid #e6f0fa;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mockup-dots {
  display: flex;
  gap: 8px;
}

.mockup-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e6f0fa;
}

.mockup-dots span:first-child {
  background-color: #4a90e2;
}

.mockup-title {
  font-size: 14px;
  color: #4a4a4a;
}

.mockup-content {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.workspace-panel {
  grid-column: span 2;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e6f0fa;
}

.chat-panel,
.ai-panel,
.video-panel {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e6f0fa;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 500;
}

.editor-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-line {
  height: 8px;
  background: linear-gradient(90deg, #e6f0fa 60%, transparent 100%);
  border-radius: 4px;
}

.code-line.short {
  width: 60%;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  height: 8px;
  background-color: #e6f0fa;
  border-radius: 4px;
  width: 80%;
}

.message:nth-child(even) {
  width: 60%;
  align-self: flex-end;
}

.ai-suggestion {
  height: 40px;
  background: linear-gradient(135deg, #e6f0fa 0%, #d1e2f0 100%);
  border-radius: 8px;
}

.video-preview {
  height: 60px;
  background-color: #e6f0fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========== MODAL ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 40, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-box {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 860px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: relative;
  animation: modal-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: linear-gradient(90deg, #1B4F72 0%, #2E86C1 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.modal-icon {
  font-size: 18px;
  color: #90caf9;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  background: #000;
}

.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* ========== MODAL TRANSITION ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    margin: 0 auto;
  }

  .hero-buttons {
    justify-content: center;
  }

  .dashboard-mockup {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .mockup-content {
    grid-template-columns: 1fr;
  }

  .workspace-panel {
    grid-column: span 1;
  }

  .modal-box {
    border-radius: 12px;
  }
}
</style>