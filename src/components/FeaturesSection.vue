<!-- components/FeaturesSection.vue -->
<template>
  <section class="features">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-sparkles"></i>
          Features
        </span>
        <h2 class="section-title">Everything You Need in One Intelligent Workspace</h2>
        <p class="section-subtitle">Powerful features designed to supercharge your team's productivity and collaboration</p>
      </div>
      
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="feature.title" class="feature-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="feature-header">
            <div class="feature-icon-wrapper" :style="{ background: feature.gradient }">
              <i :class="feature.icon" class="feature-icon"></i>
            </div>
            <div class="feature-badge">{{ feature.badge }}</div>
          </div>
          
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          
          <ul class="feature-list">
            <li v-for="item in feature.items" :key="item" class="feature-item">
              <span class="check-icon">
                <i class="fas fa-check"></i>
              </span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>

          <div class="feature-footer">
            <a href="#" class="learn-more">
              Learn more
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection',
  data() {
    return {
      features: [
        {
          icon: 'fas fa-brain',
          title: 'Smart AI Assistant',
          description: 'Intelligent assistance powered by advanced AI to accelerate your workflow',
          badge: 'AI-Powered',
          gradient: 'linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%)',
          items: [
            'AI code generation & debugging',
            'Intelligent document drafting',
            'Smart content summarization',
            'Context-aware suggestions'
          ]
        },
        {
          icon: 'fas fa-users-between-lines',
          title: 'Real-Time Collaboration',
          description: 'Work together seamlessly with your team from anywhere in the world',
          badge: 'Team Sync',
          gradient: 'linear-gradient(135deg, #5ba4ef 0%, #4a90e2 100%)',
          items: [
            'Multi-user live editing',
            'Shared team workspaces',
            'Smart team organization',
            'Granular permission control'
          ]
        },
        {
          icon: 'fas fa-comments',
          title: 'Live Chat & Messaging',
          description: 'Instant communication with powerful features for seamless team interaction',
          badge: 'Instant',
          gradient: 'linear-gradient(135deg, #7db8f0 0%, #4a90e2 100%)',
          items: [
            'One-to-one private chat',
            'Group channels & threads',
            'File & media sharing',
            'Rich message reactions'
          ]
        },
        {
          icon: 'fas fa-video',
          title: 'Video Conferencing',
          description: 'Crystal-clear HD meetings with enterprise-grade features built in',
          badge: 'HD Quality',
          gradient: 'linear-gradient(135deg, #2c6fbd 0%, #1a5fb4 100%)',
          items: [
            'Full HD video meetings',
            'Screen & window sharing',
            'Advanced host controls',
            'Cloud recording & transcripts'
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.features {
  background: linear-gradient(180deg, #ffffff 0%, #fafcff 100%);
  padding: 100px 0;
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
}

.features::before {
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

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}

/* Feature Card */
.feature-card {
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

.feature-card::before {
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

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.15);
  border-color: #c9dff5;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

/* Feature Header */
.feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.feature-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.2);
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.05) rotate(5deg);
}

.feature-icon {
  font-size: 28px;
  color: #ffffff;
}

.feature-badge {
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

/* Feature Content */
.feature-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.feature-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-weight: 500;
}

/* Feature List */
.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #2d3748;
  line-height: 1.5;
}

.check-icon {
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

/* Feature Footer */
.feature-footer {
  padding-top: 20px;
  border-top: 1px solid #e8f2fc;
}

.learn-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4a90e2;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.learn-more:hover {
  gap: 12px;
  color: #2c6fbd;
}

.learn-more i {
  font-size: 0.85rem;
  transition: transform 0.3s ease;
}

.learn-more:hover i {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 968px) {
  .features {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.05rem;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .feature-card {
    padding: 28px;
  }
}

@media (max-width: 640px) {
  .features {
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

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 24px;
  }

  .feature-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .feature-icon {
    font-size: 24px;
  }

  .feature-title {
    font-size: 1.25rem;
  }

  .feature-description {
    font-size: 0.95rem;
  }
}
</style>