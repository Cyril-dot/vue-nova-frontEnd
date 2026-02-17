<!-- components/AIFeaturesSection.vue -->
<template>
  <section class="ai-features">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-wand-magic-sparkles"></i>
          AI-Powered
        </span>
        <h2 class="section-title">Intelligent AI That Works With You</h2>
        <p class="section-subtitle">Advanced artificial intelligence built into every feature to accelerate your productivity and enhance collaboration</p>
      </div>
      
      <div class="ai-grid">
        <div v-for="(feature, index) in aiFeatures" :key="feature.title" class="ai-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="ai-card-header">
            <div class="ai-icon-wrapper" :style="{ background: feature.gradient }">
              <i :class="feature.icon" class="ai-icon"></i>
            </div>
            <div class="ai-badge">{{ feature.badge }}</div>
          </div>
          
          <h3 class="ai-title">{{ feature.title }}</h3>
          <p class="ai-description">{{ feature.description }}</p>
          
          <ul class="ai-list">
            <li v-for="item in feature.items" :key="item" class="ai-item">
              <span class="ai-check">
                <i class="fas fa-circle-check"></i>
              </span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>

          <div class="ai-footer">
            <a href="#" class="ai-link">
              Explore feature
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- AI Capabilities Showcase -->
      <div class="ai-showcase">
        <div class="showcase-content">
          <div class="showcase-badge">
            <i class="fas fa-robot"></i>
            <span>AI Technology</span>
          </div>
          <h3 class="showcase-title">Powered by Advanced Machine Learning</h3>
          <p class="showcase-text">
            NovaSpace leverages cutting-edge AI models trained on billions of data points to understand context, 
            predict needs, and automate repetitive tasks. Our AI continuously learns from your workflow patterns 
            to provide increasingly personalized and accurate assistance.
          </p>
          <div class="showcase-stats">
            <div class="stat-box">
              <div class="stat-icon">
                <i class="fas fa-bolt"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">10x</div>
                <div class="stat-label">Faster Code Generation</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <i class="fas fa-brain"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">95%</div>
                <div class="stat-label">Accuracy Rate</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">5hrs</div>
                <div class="stat-label">Saved Per Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AIFeaturesSection',
  data() {
    return {
      aiFeatures: [
        {
          icon: 'fas fa-code',
          title: 'AI Coding Assistant',
          description: 'Intelligent code generation and optimization powered by advanced AI models',
          badge: 'Code AI',
          gradient: 'linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%)',
          items: [
            'Generate full-stack code instantly',
            'Smart refactoring & optimization',
            'Real-time bug detection & fixes',
            'Context-aware code completion',
            'Multi-language support'
          ]
        },
        {
          icon: 'fas fa-lightbulb',
          title: 'Smart Workspace Organization',
          description: 'AI-driven workspace intelligence that keeps your projects perfectly organized',
          badge: 'Smart AI',
          gradient: 'linear-gradient(135deg, #5ba4ef 0%, #4a90e2 100%)',
          items: [
            'Automatic file categorization',
            'Intelligent tagging system',
            'Predictive file suggestions',
            'Smart search with context',
            'Workflow pattern recognition'
          ]
        },
        {
          icon: 'fas fa-pen-fancy',
          title: 'AI Content Generator',
          description: 'Create professional content in seconds with AI-powered writing assistance',
          badge: 'Content AI',
          gradient: 'linear-gradient(135deg, #7db8f0 0%, #4a90e2 100%)',
          items: [
            'Draft professional emails instantly',
            'Generate technical documentation',
            'Summarize long meetings & calls',
            'Create detailed project reports',
            'Multi-language translation'
          ]
        },
        {
          icon: 'fas fa-chart-line',
          title: 'AI-Powered Analytics',
          description: 'Deep insights and intelligent recommendations based on your team\'s data',
          badge: 'Analytics AI',
          gradient: 'linear-gradient(135deg, #2c6fbd 0%, #1a5fb4 100%)',
          items: [
            'Real-time productivity metrics',
            'Team collaboration insights',
            'Predictive trend analysis',
            'Performance recommendations',
            'Custom reporting dashboards'
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.ai-features {
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
  padding: 100px 0;
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
}

.ai-features::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #c9dff5 20%, #c9dff5 80%, transparent 100%);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Section Header */
.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 70px;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #e8f2fc 0%, #d1e5f7 100%);
  color: #2c6fbd;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 20px;
  border: 1px solid #c9dff5;
}

.section-badge i {
  font-size: 0.9rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.15rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
}

/* AI Grid */
.ai-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

/* AI Card */
.ai-card {
  background: #ffffff;
  border: 1px solid #e2ecf6;
  border-radius: 20px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4a90e2 0%, #2c6fbd 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.15);
  border-color: #c9dff5;
}

.ai-card:hover::before {
  transform: scaleX(1);
}

/* Card Header */
.ai-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.ai-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.2);
  transition: transform 0.3s ease;
}

.ai-card:hover .ai-icon-wrapper {
  transform: scale(1.05) rotate(5deg);
}

.ai-icon {
  font-size: 28px;
  color: #ffffff;
}

.ai-badge {
  padding: 6px 14px;
  background: #e8f2fc;
  color: #4a90e2;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #c9dff5;
}

/* Card Content */
.ai-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.ai-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-weight: 500;
}

/* AI List */
.ai-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.ai-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #2d3748;
  line-height: 1.5;
}

.ai-check {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: linear-gradient(135deg, #e8f2fc 0%, #d1e5f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a90e2;
  font-size: 11px;
  flex-shrink: 0;
  margin-top: 2px;
  border: 1px solid #c9dff5;
}

.item-text {
  font-weight: 500;
}

/* Card Footer */
.ai-footer {
  padding-top: 20px;
  border-top: 1px solid #e8f2fc;
}

.ai-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4a90e2;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.ai-link:hover {
  gap: 12px;
  color: #2c6fbd;
}

.ai-link i {
  font-size: 0.85rem;
  transition: transform 0.3s ease;
}

.ai-link:hover i {
  transform: translateX(4px);
}

/* AI Showcase */
.ai-showcase {
  background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%);
  border-radius: 24px;
  padding: 60px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.3);
}

.ai-showcase::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
}

.showcase-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.showcase-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.showcase-badge i {
  font-size: 1.1rem;
}

.showcase-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.showcase-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 48px 0;
  line-height: 1.7;
  font-weight: 500;
}

/* Showcase Stats */
.showcase-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-box:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-info {
  flex: 1;
  text-align: left;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  line-height: 1.3;
}

/* Responsive Design */
@media (max-width: 968px) {
  .ai-features {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.05rem;
  }

  .ai-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    margin-bottom: 60px;
  }

  .ai-card {
    padding: 28px;
  }

  .ai-showcase {
    padding: 48px 32px;
  }

  .showcase-title {
    font-size: 1.75rem;
  }

  .showcase-text {
    font-size: 1rem;
  }

  .showcase-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .ai-features {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  .section-header {
    margin-bottom: 50px;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .ai-grid {
    grid-template-columns: 1fr;
  }

  .ai-card {
    padding: 24px;
  }

  .ai-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .ai-icon {
    font-size: 24px;
  }

  .ai-title {
    font-size: 1.25rem;
  }

  .ai-description {
    font-size: 0.95rem;
  }

  .ai-showcase {
    padding: 40px 24px;
  }

  .showcase-title {
    font-size: 1.5rem;
  }

  .showcase-text {
    font-size: 0.95rem;
    margin-bottom: 36px;
  }

  .stat-box {
    padding: 20px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }
}
</style>