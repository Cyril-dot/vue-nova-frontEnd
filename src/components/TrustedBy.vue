<!-- components/TrustedBy.vue -->
<template>
  <section class="trusted-by">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <div class="trusted-header">
        <span class="trusted-badge">
          <i class="fas fa-shield-check"></i>
          Trusted by Industry Leaders
        </span>
      </div>
      
      <div class="logos-marquee">
        <div class="logos-track">
          <div v-for="(logo, index) in [...logos, ...logos]" :key="`${logo.name}-${index}`" class="logo-card">
            <div class="logo-wrapper">
              <div class="logo-icon" :style="{ background: logo.gradient }">
                <i :class="logo.icon"></i>
              </div>
              <div class="logo-info">
                <h3 class="logo-name">{{ logo.name }}</h3>
                <p class="logo-category">{{ logo.category }}</p>
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
  name: 'TrustedBy',
  data() {
    return {
      logos: [
        { 
          name: 'TechFlow', 
          icon: 'fas fa-microchip',
          gradient: 'linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%)',
          category: 'Technology'
        },
        { 
          name: 'DataCore', 
          icon: 'fas fa-database',
          gradient: 'linear-gradient(135deg, #5ba4ef 0%, #4a90e2 100%)',
          category: 'Analytics'
        },
        { 
          name: 'CloudSync', 
          icon: 'fas fa-cloud',
          gradient: 'linear-gradient(135deg, #7db8f0 0%, #4a90e2 100%)',
          category: 'Cloud Services'
        },
        { 
          name: 'SecureNet', 
          icon: 'fas fa-shield-halved',
          gradient: 'linear-gradient(135deg, #2c6fbd 0%, #1a5fb4 100%)',
          category: 'Security'
        },
        { 
          name: 'DevStream', 
          icon: 'fas fa-code',
          gradient: 'linear-gradient(135deg, #4a90e2 0%, #3a7bc8 100%)',
          category: 'Development'
        },
        { 
          name: 'InnovateLabs', 
          icon: 'fas fa-flask',
          gradient: 'linear-gradient(135deg, #5ba4ef 0%, #2c6fbd 100%)',
          category: 'Research'
        },
        { 
          name: 'PixelForge', 
          icon: 'fas fa-palette',
          gradient: 'linear-gradient(135deg, #7db8f0 0%, #5ba4ef 100%)',
          category: 'Design'
        },
        { 
          name: 'BrainAI', 
          icon: 'fas fa-brain',
          gradient: 'linear-gradient(135deg, #4a90e2 0%, #1a5fb4 100%)',
          category: 'AI/ML'
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.trusted-by {
  background: #ffffff;
  padding: 80px 0;
  overflow: hidden;
  position: relative;
  font-family: 'Manrope', sans-serif;
  border-top: 1px solid #e2ecf6;
  border-bottom: 1px solid #e2ecf6;
}

.trusted-by::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #c9dff5 20%, #c9dff5 80%, transparent 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header with Badge */
.trusted-header {
  text-align: center;
  margin-bottom: 50px;
}

.trusted-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%);
  color: white;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.25);
  animation: float 3s ease-in-out infinite;
}

.trusted-badge i {
  font-size: 1.1rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

/* Marquee Animation */
.logos-marquee {
  margin-bottom: 60px;
  overflow: hidden;
  position: relative;
}

.logos-marquee::before,
.logos-marquee::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.logos-marquee::before {
  left: 0;
  background: linear-gradient(90deg, #ffffff 0%, transparent 100%);
}

.logos-marquee::after {
  right: 0;
  background: linear-gradient(270deg, #ffffff 0%, transparent 100%);
}

.logos-track {
  display: flex;
  gap: 24px;
  animation: scroll 40s linear infinite;
  will-change: transform;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.logos-track:hover {
  animation-play-state: paused;
}

/* Logo Cards */
.logo-card {
  flex-shrink: 0;
  width: 280px;
}

.logo-wrapper {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e8edf7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.logo-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(74, 144, 226, 0.15);
  border-color: #c9dff5;
}

.logo-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-info {
  flex: 1;
  min-width: 0;
}

.logo-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.logo-category {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 968px) {
  .trusted-by {
    padding: 60px 0;
  }

  .trusted-header {
    margin-bottom: 40px;
  }

  .logos-marquee {
    margin-bottom: 40px;
  }

  .logo-card {
    width: 240px;
  }
}

@media (max-width: 640px) {
  .trusted-by {
    padding: 50px 0;
  }

  .container {
    padding: 0 16px;
  }

  .trusted-badge {
    font-size: 0.85rem;
    padding: 10px 22px;
  }

  .logos-marquee::before,
  .logos-marquee::after {
    width: 50px;
  }

  .logo-card {
    width: 220px;
  }

  .logo-wrapper {
    padding: 16px 18px;
    gap: 12px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .logo-name {
    font-size: 1rem;
  }

  .logo-category {
    font-size: 0.8rem;
  }
}
</style>