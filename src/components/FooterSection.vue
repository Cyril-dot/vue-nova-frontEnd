<!-- components/FooterSection.vue -->
<template>
  <footer class="footer">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <!-- Footer Main Content -->
      <div class="footer-main">

        <!-- Brand Column -->
        <div class="footer-brand">
          <div class="brand-logo">
            <div class="logo-icon">
              <svg width="40" height="40" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="42" height="42" rx="11" fill="#4a90e2"/>
                <line x1="8" y1="21" x2="34" y2="21" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/>
                <line x1="21" y1="8" x2="21" y2="34" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/>
                <polygon points="21,10 33,16 21,22 9,16" fill="#ffffff" opacity="0.95"/>
                <rect x="29" y="16" width="2" height="8" rx="1" fill="#ffffff"/>
                <circle cx="30" cy="25" r="2" fill="#ffffff" opacity="0.8"/>
                <rect x="13" y="25" width="16" height="7" rx="2" fill="#ffffff" opacity="0.9"/>
                <line x1="21" y1="25" x2="21" y2="32" stroke="#4a90e2" stroke-width="1"/>
              </svg>
            </div>
            <div class="logo-text">
              <div class="logo-name">Nova<span class="logo-accent">Space</span></div>
              <div class="logo-tagline">EdTech AI Platform</div>
            </div>
          </div>
          <p class="brand-description">
            Empowering teams with intelligent collaboration tools and AI-powered workspace solutions.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="footer-links">

          <!-- Platform -->
          <div class="footer-column">
            <h4 class="column-title">Platform</h4>
            <ul class="column-list">
              <li><router-link to="/dashboard" class="footer-link">Dashboard</router-link></li>
              <li><router-link to="/projects" class="footer-link">Projects</router-link></li>
              <li><router-link to="/tasks" class="footer-link">Tasks</router-link></li>
              <li><router-link to="/notebooks" class="footer-link">Notebooks</router-link></li>
              <li><router-link to="/calendar" class="footer-link">Calendar</router-link></li>
            </ul>
          </div>

          <!-- Workspace -->
          <div class="footer-column">
            <h4 class="column-title">Workspace</h4>
            <ul class="column-list">
              <li><router-link to="/workspace" class="footer-link">My Workspace</router-link></li>
              <li><router-link to="/teams" class="footer-link">Teams</router-link></li>
              <li><router-link to="/team-workspace" class="footer-link">Team Workspace</router-link></li>
              <li><router-link to="/team-projects" class="footer-link">Team Projects</router-link></li>
              <li><router-link to="/chat" class="footer-link">Chat</router-link></li>
            </ul>
          </div>

          <!-- AI & Tools -->
          <div class="footer-column">
            <h4 class="column-title">AI & Tools</h4>
            <ul class="column-list">
              <li><router-link to="/ai-assistant" class="footer-link">AI Assistant</router-link></li>
              <li><router-link to="/apps" class="footer-link">Apps</router-link></li>
              <li><router-link to="/search" class="footer-link">Web Search</router-link></li>
              <li><router-link to="/meeting" class="footer-link">Meeting</router-link></li>
              <li><router-link to="/about" class="footer-link">About</router-link></li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <span>© 2026 NovaSpace. All rights reserved.</span>
        </div>
        <div class="footer-meta">
          <a href="#" class="meta-link">Sitemap</a>
          <span class="meta-divider">•</span>
          <a href="#" class="meta-link">Accessibility</a>
          <span class="meta-divider">•</span>
          <span class="meta-text">Made with <i class="fas fa-heart"></i> in Ghana</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.footer {
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
  border-top: 1px solid #e2ecf6;
  padding: 80px 0 0;
  font-family: 'Manrope', sans-serif;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Footer Main */
.footer-main {
  display: grid;
  grid-template-columns: 1.4fr 2fr;
  gap: 80px;
  padding-bottom: 60px;
  border-bottom: 1px solid #e2ecf6;
}

/* Brand Section */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 12px rgba(74, 144, 226, 0.3));
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0d1b36;
  line-height: 1;
  letter-spacing: -0.02em;
}

.logo-accent {
  color: #4a90e2;
}

.logo-tagline {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.brand-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  font-weight: 500;
  max-width: 400px;
  margin: 0;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2ecf6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #4a90e2;
  border-color: #4a90e2;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
}

/* Footer Links */
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0d1b36;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.column-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  font-size: 0.95rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4a90e2;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #4a90e2;
  transform: translateX(4px);
}

.footer-link:hover::after {
  width: 100%;
}

/* Footer Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-copyright {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-link {
  font-size: 0.9rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.meta-link:hover {
  color: #4a90e2;
}

.meta-divider {
  color: #e2ecf6;
  font-weight: 300;
}

.meta-text {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.meta-text i {
  color: #ef4444;
  font-size: 0.85rem;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10% { transform: scale(1.2); }
  20% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 968px) {
  .footer {
    padding: 60px 0 0;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 50px;
    padding-bottom: 50px;
  }

  .footer-links {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 50px 0 0;
  }

  .container {
    padding: 0 16px;
  }

  .footer-main {
    gap: 40px;
    padding-bottom: 40px;
  }

  .brand-logo {
    margin-bottom: 4px;
  }

  .logo-icon svg {
    width: 36px;
    height: 36px;
  }

  .logo-name {
    font-size: 1.5rem;
  }

  .logo-tagline {
    font-size: 0.75rem;
  }

  .brand-description {
    font-size: 0.95rem;
  }

  .social-links {
    gap: 10px;
  }

  .social-link {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .column-title {
    font-size: 0.85rem;
    margin-bottom: 16px;
  }

  .column-list {
    gap: 10px;
  }

  .footer-link {
    font-size: 0.9rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    padding: 28px 0;
    gap: 12px;
  }

  .footer-copyright {
    font-size: 0.85rem;
  }

  .footer-meta {
    justify-content: center;
    font-size: 0.85rem;
  }

  .meta-link {
    font-size: 0.85rem;
  }

  .meta-text {
    font-size: 0.85rem;
  }
}
</style>