<!-- components/SecuritySection.vue -->
<template>
  <section class="security">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-shield-halved"></i>
          Enterprise Security
        </span>
        <h2 class="section-title">Bank-Grade Security & Compliance</h2>
        <p class="section-subtitle">Your data is protected with enterprise-level security standards, comprehensive compliance certifications, and industry-leading encryption</p>
      </div>
      
      <div class="security-grid">
        <div v-for="(feature, index) in securityFeatures" :key="feature.title" class="security-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="security-header">
            <h3 class="security-title">{{ feature.title }}</h3>
            <div class="security-badge" :class="`security-badge--${feature.level}`">
              {{ feature.level }}
            </div>
          </div>
          <p class="security-description">{{ feature.description }}</p>
          <ul class="security-list">
            <li v-for="item in feature.items" :key="item" class="security-item">
              <i class="fas fa-check"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Compliance Badges -->
      <div class="compliance-section">
        <h3 class="compliance-title">Compliance & Certifications</h3>
        <p class="compliance-subtitle">Trusted by enterprises worldwide with industry-standard certifications</p>
        <div class="compliance-grid">
          <div v-for="cert in certifications" :key="cert.name" class="compliance-badge">
            <div class="compliance-icon">
              <i :class="cert.icon"></i>
            </div>
            <div class="compliance-name">{{ cert.name }}</div>
            <div class="compliance-description">{{ cert.description }}</div>
          </div>
        </div>
      </div>

      <!-- Security Promise -->
      <div class="security-promise">
        <div class="promise-content">
          <h3 class="promise-title">Our Security Promise</h3>
          <p class="promise-text">
            We take security seriously. Your data is encrypted end-to-end, stored in SOC 2 compliant data centers, 
            and protected by multiple layers of security. We undergo regular third-party security audits and maintain 
            strict access controls. Your trust is our top priority.
          </p>
          <div class="promise-features">
            <div class="promise-feature">
              <i class="fas fa-lock"></i>
              <span>Zero-Knowledge Architecture</span>
            </div>
            <div class="promise-feature">
              <i class="fas fa-eye-slash"></i>
              <span>No Data Tracking or Selling</span>
            </div>
            <div class="promise-feature">
              <i class="fas fa-shield-check"></i>
              <span>Regular Security Audits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SecuritySection',
  data() {
    return {
      securityFeatures: [
        {
          title: 'Data Encryption',
          level: 'critical',
          description: 'Military-grade encryption protecting your data at every layer',
          items: [
            'AES-256 encryption at rest',
            'TLS 1.3 encryption in transit',
            'End-to-end encrypted communications',
            'Encrypted database backups'
          ]
        },
        {
          title: 'Access Control',
          level: 'high',
          description: 'Comprehensive authentication and authorization systems',
          items: [
            'Multi-factor authentication (MFA)',
            'Single Sign-On (SSO) support',
            'Role-based access control (RBAC)',
            'Session management & monitoring'
          ]
        },
        {
          title: 'Infrastructure Security',
          level: 'high',
          description: 'Enterprise-grade infrastructure with 99.9% uptime guarantee',
          items: [
            'SOC 2 Type II certified data centers',
            'Distributed denial-of-service (DDoS) protection',
            'Real-time threat detection',
            'Automated security patching'
          ]
        },
        {
          title: 'Data Privacy',
          level: 'critical',
          description: 'Complete control over your data with strict privacy policies',
          items: [
            'GDPR & CCPA compliant',
            'Data residency options',
            'Right to deletion & portability',
            'Zero data retention after deletion'
          ]
        }
      ],
      certifications: [
        {
          name: 'SOC 2 Type II',
          icon: 'fas fa-certificate',
          description: 'Security controls verified'
        },
        {
          name: 'ISO 27001',
          icon: 'fas fa-award',
          description: 'Information security management'
        },
        {
          name: 'GDPR',
          icon: 'fas fa-shield-halved',
          description: 'EU data protection compliance'
        },
        {
          name: 'HIPAA',
          icon: 'fas fa-user-shield',
          description: 'Healthcare data protection'
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.security {
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
  padding: 100px 0;
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
}

.security::before {
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

/* Security Grid */
.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

/* Security Card */
.security-card {
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

.security-card::before {
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

.security-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.15);
  border-color: #c9dff5;
}

.security-card:hover::before {
  transform: scaleX(1);
}

/* Security Header */
.security-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.security-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0;
  line-height: 1.3;
}

.security-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}

.security-badge--critical {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.security-badge--high {
  background: linear-gradient(135deg, #e8f2fc 0%, #d1e5f7 100%);
  color: #2c6fbd;
  border: 1px solid #c9dff5;
}

.security-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
  font-weight: 500;
}

/* Security List */
.security-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #2d3748;
  line-height: 1.5;
  font-weight: 500;
}

.security-item i {
  color: #4a90e2;
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-top: 3px;
}

/* Compliance Section */
.compliance-section {
  background: #ffffff;
  border: 1px solid #e2ecf6;
  border-radius: 24px;
  padding: 60px;
  margin-bottom: 60px;
  text-align: center;
}

.compliance-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.compliance-subtitle {
  font-size: 1.05rem;
  color: #64748b;
  margin: 0 0 48px 0;
  line-height: 1.6;
  font-weight: 500;
}

.compliance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.compliance-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.compliance-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e8f2fc 0%, #d1e5f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a90e2;
  font-size: 32px;
  border: 1px solid #c9dff5;
  margin-bottom: 8px;
}

.compliance-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0d1b36;
  line-height: 1.2;
}

.compliance-description {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

/* Security Promise */
.security-promise {
  background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%);
  border-radius: 24px;
  padding: 60px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.3);
}

.security-promise::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
}

.promise-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.promise-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.promise-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 40px 0;
  line-height: 1.7;
  font-weight: 500;
}

.promise-features {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.promise-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.promise-feature i {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Responsive Design */
@media (max-width: 968px) {
  .security {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.05rem;
  }

  .security-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    margin-bottom: 60px;
  }

  .compliance-section {
    padding: 48px 32px;
  }

  .compliance-title {
    font-size: 1.75rem;
  }

  .security-promise {
    padding: 48px 32px;
  }

  .promise-title {
    font-size: 1.75rem;
  }

  .promise-features {
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .security {
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

  .security-grid {
    grid-template-columns: 1fr;
  }

  .security-card {
    padding: 28px;
  }

  .security-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .security-title {
    font-size: 1.25rem;
  }

  .compliance-section {
    padding: 40px 24px;
  }

  .compliance-title {
    font-size: 1.5rem;
  }

  .compliance-subtitle {
    font-size: 1rem;
    margin-bottom: 36px;
  }

  .compliance-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .compliance-icon {
    width: 64px;
    height: 64px;
    font-size: 26px;
  }

  .security-promise {
    padding: 40px 24px;
  }

  .promise-title {
    font-size: 1.5rem;
  }

  .promise-text {
    font-size: 0.95rem;
    margin-bottom: 32px;
  }

  .promise-features {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
}
</style>