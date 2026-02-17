<!-- components/CollaborationSection.vue -->
<template>
  <section class="collaboration">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-users"></i>
          For Everyone
        </span>
        <h2 class="section-title">Built for Teams, Students & Enterprises</h2>
        <p class="section-subtitle">Whether you're a solo developer, student team, or global enterprise, NovaSpace adapts to your workflow</p>
      </div>
      
      <div class="use-cases-grid">
        <div v-for="(useCase, index) in useCases" :key="useCase.title" class="use-case-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="use-case-header">
            <div class="use-case-icon-wrapper" :style="{ background: useCase.gradient }">
              <i :class="useCase.icon" class="use-case-icon"></i>
            </div>
          </div>
          
          <h3 class="use-case-title">{{ useCase.title }}</h3>
          <p class="use-case-description">{{ useCase.description }}</p>
          
          <ul class="use-case-features">
            <li v-for="feature in useCase.features" :key="feature" class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <div class="use-case-footer">
            <span class="use-case-badge">{{ useCase.badge }}</span>
          </div>
        </div>
      </div>

      <!-- Benefits Grid -->
      <div class="benefits-section">
        <h3 class="benefits-title">Why Teams Choose NovaSpace</h3>
        <div class="benefits-grid">
          <div v-for="(benefit, index) in benefits" :key="benefit.title" class="benefit-card" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="benefit-icon">
              <i :class="benefit.icon"></i>
            </div>
            <h4 class="benefit-title">{{ benefit.title }}</h4>
            <p class="benefit-description">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CollaborationSection',
  data() {
    return {
      useCases: [
        {
          icon: 'fas fa-graduation-cap',
          title: 'Students & Educators',
          description: 'Perfect for academic projects, research collaboration, and remote learning',
          badge: 'Education',
          gradient: 'linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%)',
          features: [
            'Group project management',
            'Assignment collaboration',
            'Research documentation',
            'Study group workspaces'
          ]
        },
        {
          icon: 'fas fa-code',
          title: 'Developers & Engineers',
          description: 'Built for software teams who need powerful tools and seamless workflows',
          badge: 'Development',
          gradient: 'linear-gradient(135deg, #5ba4ef 0%, #4a90e2 100%)',
          features: [
            'Real-time code collaboration',
            'Git integration support',
            'API documentation tools',
            'Technical project tracking'
          ]
        },
        {
          icon: 'fas fa-building',
          title: 'Teams & Enterprises',
          description: 'Scale effortlessly with enterprise-grade security and admin controls',
          badge: 'Enterprise',
          gradient: 'linear-gradient(135deg, #7db8f0 0%, #4a90e2 100%)',
          features: [
            'Multi-team organization',
            'Advanced permissions',
            'SSO & compliance',
            'Priority support'
          ]
        },
        {
          icon: 'fas fa-rocket',
          title: 'Startups & Agencies',
          description: 'Move fast and stay organized with tools designed for rapid growth',
          badge: 'Growth',
          gradient: 'linear-gradient(135deg, #2c6fbd 0%, #1a5fb4 100%)',
          features: [
            'Rapid project setup',
            'Client collaboration',
            'Resource management',
            'Budget-friendly plans'
          ]
        }
      ],
      benefits: [
        {
          icon: 'fas fa-shield-halved',
          title: 'Enterprise Security',
          description: 'Bank-level encryption and compliance certifications'
        },
        {
          icon: 'fas fa-clock',
          title: '24/7 Availability',
          description: 'Work from anywhere, anytime with 99.9% uptime'
        },
        {
          icon: 'fas fa-headset',
          title: 'Expert Support',
          description: 'Dedicated support team ready to help you succeed'
        },
        {
          icon: 'fas fa-arrows-spin',
          title: 'Easy Integration',
          description: 'Connect with your favorite tools seamlessly'
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Scalable Growth',
          description: 'From small teams to global enterprises'
        },
        {
          icon: 'fas fa-bolt',
          title: 'Lightning Fast',
          description: 'Optimized performance for instant collaboration'
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.collaboration {
  background: #ffffff;
  padding: 100px 0;
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
}

.collaboration::before {
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

/* Use Cases Grid */
.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

/* Use Case Card */
.use-case-card {
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

.use-case-card::before {
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

.use-case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.15);
  border-color: #c9dff5;
}

.use-case-card:hover::before {
  transform: scaleX(1);
}

/* Card Header */
.use-case-header {
  text-align: center;
  margin-bottom: 24px;
}

.use-case-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.2);
  transition: transform 0.3s ease;
}

.use-case-card:hover .use-case-icon-wrapper {
  transform: scale(1.05) rotate(5deg);
}

.use-case-icon {
  font-size: 36px;
  color: #ffffff;
}

/* Card Content */
.use-case-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0 0 12px 0;
  line-height: 1.3;
  text-align: center;
}

.use-case-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-weight: 500;
  text-align: center;
}

/* Features List */
.use-case-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 500;
}

.feature-item i {
  color: #4a90e2;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Card Footer */
.use-case-footer {
  padding-top: 20px;
  border-top: 1px solid #e8f2fc;
  text-align: center;
}

.use-case-badge {
  display: inline-block;
  padding: 8px 18px;
  background: #e8f2fc;
  color: #4a90e2;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #c9dff5;
}

/* Benefits Section */
.benefits-section {
  margin-top: 60px;
}

.benefits-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0d1b36;
  text-align: center;
  margin: 0 0 50px 0;
  line-height: 1.2;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.benefit-card {
  background: #f8fafc;
  border: 1px solid #e8f2fc;
  border-radius: 16px;
  padding: 28px;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.benefit-card:hover {
  background: #ffffff;
  border-color: #c9dff5;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.1);
  transform: translateY(-4px);
}

.benefit-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e8f2fc 0%, #d1e5f7 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4a90e2;
  font-size: 28px;
  margin-bottom: 20px;
  border: 1px solid #c9dff5;
}

.benefit-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0d1b36;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.benefit-description {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 968px) {
  .collaboration {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.05rem;
  }

  .use-cases-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    margin-bottom: 50px;
  }

  .benefits-section {
    margin-top: 50px;
  }

  .benefits-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 640px) {
  .collaboration {
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

  .use-cases-grid {
    grid-template-columns: 1fr;
  }

  .use-case-card {
    padding: 28px;
  }

  .use-case-icon-wrapper {
    width: 72px;
    height: 72px;
  }

  .use-case-icon {
    font-size: 32px;
  }

  .use-case-title {
    font-size: 1.35rem;
  }

  .team-showcase {
    padding: 40px 24px;
  }

  .showcase-title {
    font-size: 1.5rem;
  }

  .showcase-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 24px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .benefits-title {
    font-size: 1.5rem;
    margin-bottom: 40px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .benefit-card {
    padding: 24px;
  }

  .benefit-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
}
</style>