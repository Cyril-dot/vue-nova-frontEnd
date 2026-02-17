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
          <button class="btn btn-primary btn-large">
            <i class="fas fa-rocket icon"></i>
            Get Started Free
          </button>
          <button class="btn btn-outline btn-large">
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
                <div class="code-line"></div>
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
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>
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
}
</style>