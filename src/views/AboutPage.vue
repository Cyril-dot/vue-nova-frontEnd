<!-- views/AboutPage.vue -->
<template>
  <div class="about-wrapper">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="container">
        <div class="hero-inner">

          <div class="avatar-wrap">
            <div class="avatar-ring"></div>
            <div class="avatar">
              <svg width="56" height="56" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="21" fill="#4a90e2"/>
                <circle cx="21" cy="16" r="7" fill="#ffffff" opacity="0.9"/>
                <path d="M7 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#ffffff" opacity="0.7"/>
              </svg>
            </div>
          </div>

          <div class="hero-text">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              Open to opportunities
            </div>
            <h1 class="hero-name">Chuks Ottih<span class="accent">.</span></h1>
            <p class="hero-role">Full-Stack Developer &amp; Creator of NovaSpace</p>
            <p class="hero-bio">
              I build intelligent, human-centered software. NovaSpace is my flagship platform —
              an EdTech AI workspace designed to help teams collaborate, learn, and ship faster.
              I care deeply about clean architecture, great UX, and tools that actually make people's lives easier.
            </p>
            <div class="hero-actions">
              <a href="mailto:chukwukaottih@gmail.com" class="btn-primary">
                <i class="fas fa-envelope"></i> Get in touch
              </a>
              <a href="https://github.com/Cyril-dot" class="btn-outline" target="_blank" rel="noopener">
                <i class="fab fa-github"></i> GitHub
              </a>
              <a href="https://www.linkedin.com/in/chukwuka-ifekwe-ottih-b48532387/" class="btn-outline" target="_blank" rel="noopener">
                <i class="fab fa-linkedin-in"></i> LinkedIn
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── Stats Strip ── -->
    <section class="stats-strip">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">30+</span>
            <span class="stat-label">Routes &amp; Views</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">10+</span>
            <span class="stat-label">AI-Powered Tools</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">1</span>
            <span class="stat-label">Platform, Many Possibilities</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">2026</span>
            <span class="stat-label">Built &amp; Shipped</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── About NovaSpace ── -->
    <section class="section">
      <div class="container">
        <div class="section-grid">
          <div class="section-content">
            <div class="section-eyebrow">The Project</div>
            <h2 class="section-heading">What is NovaSpace?</h2>
            <p class="section-body">
              NovaSpace is a full-stack EdTech AI platform I designed and built from scratch.
              It brings together project management, team collaboration, AI assistance, meetings,
              notebooks, and a suite of productivity apps — all under one roof.
            </p>
            <p class="section-body">
              The goal was simple: give individuals and teams a single intelligent workspace that
              adapts to how they actually work — not the other way around.
            </p>
            <div class="feature-pills">
              <span class="pill">AI Assistant</span>
              <span class="pill">Real-time Chat</span>
              <span class="pill">Video Meetings</span>
              <span class="pill">Project Tracking</span>
              <span class="pill">Smart Notebooks</span>
              <span class="pill">Team Workspaces</span>
            </div>
          </div>
          <div class="section-visual">
            <div class="app-card">
              <div class="app-card-header">
                <div class="app-card-dots">
                  <span></span><span></span><span></span>
                </div>
                <span class="app-card-title">NovaSpace Dashboard</span>
              </div>
              <div class="app-card-body">
                <div class="mock-row mock-row--blue"></div>
                <div class="mock-row mock-row--short"></div>
                <div class="mock-grid">
                  <div class="mock-tile"></div>
                  <div class="mock-tile mock-tile--accent"></div>
                  <div class="mock-tile"></div>
                  <div class="mock-tile mock-tile--light"></div>
                </div>
                <div class="mock-row mock-row--short"></div>
                <div class="mock-row"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Tech Stack ── -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-center">
          <div class="section-eyebrow">Tech Stack</div>
          <h2 class="section-heading">Built with modern tools</h2>
          <p class="section-body section-body--center">
            Every part of NovaSpace was chosen deliberately — fast, scalable, and maintainable.
          </p>
        </div>
        <div class="tech-grid">
          <div class="tech-card" v-for="tech in techStack" :key="tech.name">
            <div class="tech-icon" :style="{ background: tech.bg }">
              <i :class="tech.icon" :style="{ color: tech.color }"></i>
            </div>
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-role">{{ tech.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Platform Showcase ── -->
    <section class="section">
      <div class="container">
        <div class="section-center">
          <div class="section-eyebrow">What's Inside</div>
          <h2 class="section-heading">Every tool you need</h2>
        </div>
        <div class="routes-grid">
          <router-link
            v-for="route in showcaseRoutes"
            :key="route.path"
            :to="route.path"
            class="route-card"
          >
            <div class="route-icon" :style="{ background: route.bg }">
              <i :class="route.icon" :style="{ color: route.color }"></i>
            </div>
            <div class="route-info">
              <span class="route-name">{{ route.name }}</span>
              <span class="route-desc">{{ route.desc }}</span>
            </div>
            <i class="fas fa-arrow-right route-arrow"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-inner">
          <div class="cta-glow"></div>
          <h2 class="cta-heading">Ready to explore?</h2>
          <p class="cta-sub">Sign in and see everything NovaSpace has to offer.</p>
          <div class="cta-actions">
            <router-link to="/auth" class="btn-primary btn-primary--lg">
              Get started <i class="fas fa-arrow-right"></i>
            </router-link>
            <router-link to="/dashboard" class="btn-ghost">
              Go to Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      techStack: [
        { name: 'Vue 3',          role: 'Frontend Framework',  icon: 'fab fa-vuejs',    color: '#42b883', bg: 'rgba(66,184,131,.12)'  },
        { name: 'Vue Router',     role: 'Client-side Routing', icon: 'fas fa-route',    color: '#4a90e2', bg: 'rgba(74,144,226,.12)'  },
        { name: 'JavaScript',     role: 'Core Language',       icon: 'fab fa-js',       color: '#f59e0b', bg: 'rgba(245,158,11,.12)'  },
        { name: 'Spring Boot',    role: 'Backend Framework',   icon: 'fas fa-leaf',     color: '#6db33f', bg: 'rgba(109,179,63,.12)'  },
        { name: 'Java',           role: 'Backend Language',    icon: 'fab fa-java',     color: '#e76f00', bg: 'rgba(231,111,0,.12)'   },
        { name: 'REST API',       role: 'Data Layer',          icon: 'fas fa-plug',     color: '#8b5cf6', bg: 'rgba(139,92,246,.12)'  },
        { name: 'JWT Auth',       role: 'Authentication',      icon: 'fas fa-lock',     color: '#ef4444', bg: 'rgba(239,68,68,.12)'   },
        { name: 'WebRTC',         role: 'Video Meetings',      icon: 'fas fa-video',    color: '#06b6d4', bg: 'rgba(6,182,212,.12)'   },
        { name: 'WebSockets',     role: 'Real-time Chat',      icon: 'fas fa-bolt',     color: '#f59e0b', bg: 'rgba(245,158,11,.12)'  },
        { name: 'PostgreSQL',     role: 'Database',            icon: 'fas fa-database', color: '#336791', bg: 'rgba(51,103,145,.12)'  },
      ],
      showcaseRoutes: [
        { path: '/dashboard',    name: 'Dashboard',     desc: 'Your personal command centre',      icon: 'fas fa-th-large',     color: '#4a90e2', bg: 'rgba(74,144,226,.12)'  },
        { path: '/projects',     name: 'Projects',      desc: 'Track and manage your projects',    icon: 'fas fa-folder-open',  color: '#8b5cf6', bg: 'rgba(139,92,246,.12)'  },
        { path: '/tasks',        name: 'Tasks',         desc: 'Stay on top of every to-do',        icon: 'fas fa-check-circle', color: '#10b981', bg: 'rgba(16,185,129,.12)'  },
        { path: '/ai-assistant', name: 'AI Assistant',  desc: 'Your intelligent co-pilot',         icon: 'fas fa-robot',        color: '#f59e0b', bg: 'rgba(245,158,11,.12)'  },
        { path: '/notebooks',    name: 'Notebooks',     desc: 'Smart notes and ideas',             icon: 'fas fa-book-open',    color: '#ec4899', bg: 'rgba(236,72,153,.12)'  },
        { path: '/workspace',    name: 'Workspace',     desc: 'Your personal workspace',           icon: 'fas fa-desktop',      color: '#06b6d4', bg: 'rgba(6,182,212,.12)'   },
        { path: '/teams',        name: 'Teams',         desc: 'Collaborate with your crew',        icon: 'fas fa-users',        color: '#4a90e2', bg: 'rgba(74,144,226,.12)'  },
        { path: '/meeting',      name: 'Meetings',      desc: 'Video calls, right in the browser', icon: 'fas fa-video',        color: '#ef4444', bg: 'rgba(239,68,68,.12)'   },
        { path: '/chat',         name: 'Chat',          desc: 'Real-time messaging',               icon: 'fas fa-comments',     color: '#10b981', bg: 'rgba(16,185,129,.12)'  },
        { path: '/calendar',     name: 'Calendar',      desc: 'Schedule and stay organised',       icon: 'fas fa-calendar-alt', color: '#8b5cf6', bg: 'rgba(139,92,246,.12)'  },
        { path: '/apps',         name: 'Apps',          desc: 'Extra tools and mini-apps',         icon: 'fas fa-th',           color: '#f59e0b', bg: 'rgba(245,158,11,.12)'  },
        { path: '/search',       name: 'Web Search',    desc: 'Google-powered web search',         icon: 'fas fa-search',       color: '#06b6d4', bg: 'rgba(6,182,212,.12)'   },
      ],
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap');

/* ── Base ── */
.about-wrapper {
  font-family: 'Manrope', sans-serif;
  background: #f8fafc;
  color: #0d1b36;
  min-height: 100vh;
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* ── Hero ── */
.hero { position: relative; padding: 100px 0 80px; overflow: hidden; }
.hero-glow {
  position: absolute; top: -120px; right: -100px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(74,144,226,.14) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner { display: flex; align-items: center; gap: 60px; }

/* Avatar */
.avatar-wrap { position: relative; flex-shrink: 0; }
.avatar-ring {
  position: absolute; inset: -8px; border-radius: 50%;
  border: 2px dashed rgba(74,144,226,.35);
  animation: spin-slow 18s linear infinite;
}
@keyframes spin-slow { to { transform: rotate(360deg); } }
.avatar {
  width: 120px; height: 120px; border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2, #2c6fbd);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 40px rgba(74,144,226,.35);
}

/* Hero text */
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; background: rgba(16,185,129,.1);
  border: 1px solid rgba(16,185,129,.25); border-radius: 20px;
  font-size: .8rem; font-weight: 600; color: #059669; margin-bottom: 20px;
}
.badge-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #10b981;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:.4; transform:scale(.6); }
}
.hero-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.5rem; font-weight: 800; color: #0d1b36;
  line-height: 1.05; letter-spacing: -.03em; margin: 0 0 12px;
}
.accent { color: #4a90e2; }
.hero-role { font-size: 1.15rem; font-weight: 600; color: #4a90e2; margin: 0 0 20px; }
.hero-bio  {
  font-size: 1.05rem; color: #64748b; line-height: 1.75;
  max-width: 560px; margin: 0 0 32px;
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 26px; background: #4a90e2; color: #fff; border-radius: 12px;
  font-size: .95rem; font-weight: 700; text-decoration: none;
  transition: all .25s ease; box-shadow: 0 4px 16px rgba(74,144,226,.35);
}
.btn-primary:hover { background: #2c6fbd; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(74,144,226,.4); }
.btn-primary--lg   { padding: 14px 32px; font-size: 1rem; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px; background: #fff; color: #0d1b36;
  border: 1px solid #e2ecf6; border-radius: 12px;
  font-size: .95rem; font-weight: 600; text-decoration: none; transition: all .25s ease;
}
.btn-outline:hover { border-color: #4a90e2; color: #4a90e2; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74,144,226,.15); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 26px; background: rgba(255,255,255,.15); color: #fff;
  border: 1px solid rgba(255,255,255,.3); border-radius: 12px;
  font-size: .95rem; font-weight: 600; text-decoration: none; transition: all .25s ease;
}
.btn-ghost:hover { background: rgba(255,255,255,.25); transform: translateY(-2px); }

/* ── Stats Strip ── */
.stats-strip {
  background: #fff; border-top: 1px solid #e2ecf6; border-bottom: 1px solid #e2ecf6; padding: 40px 0;
}
.stats-grid { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }
.stat-item  { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0 56px; }
.stat-number {
  font-family: 'Space Grotesk', sans-serif; font-size: 2.25rem; font-weight: 800;
  color: #4a90e2; letter-spacing: -.02em;
}
.stat-label { font-size: .85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
.stat-divider { width: 1px; height: 50px; background: #e2ecf6; }

/* ── Sections ── */
.section       { padding: 100px 0; }
.section--alt  { background: #fff; }

.section-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

.section-eyebrow {
  font-size: .8rem; font-weight: 700; color: #4a90e2;
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;
}
.section-heading {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.25rem; font-weight: 800; color: #0d1b36;
  letter-spacing: -.02em; margin: 0 0 20px; line-height: 1.15;
}
.section-body { font-size: 1rem; color: #64748b; line-height: 1.75; margin: 0 0 16px; }
.section-body--center { text-align: center; max-width: 560px; margin: 0 auto; }

.section-center { text-align: center; margin-bottom: 56px; }
.section-center .section-eyebrow,
.section-center .section-heading { text-align: center; }

.feature-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.pill {
  padding: 7px 16px; background: #e8f2fc; border: 1px solid #c9dff5;
  border-radius: 20px; font-size: .85rem; font-weight: 600; color: #2c6fbd;
}

/* ── App Card Mock ── */
.section-visual { display: flex; justify-content: center; }
.app-card {
  background: #fff; border: 1px solid #e2ecf6; border-radius: 16px;
  overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.08);
  width: 100%; max-width: 400px;
}
.app-card-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; background: #f8fafc; border-bottom: 1px solid #e2ecf6;
}
.app-card-dots { display: flex; gap: 6px; }
.app-card-dots span { width: 10px; height: 10px; border-radius: 50%; background: #e2ecf6; }
.app-card-dots span:first-child  { background: #ef4444; }
.app-card-dots span:nth-child(2) { background: #f59e0b; }
.app-card-dots span:nth-child(3) { background: #10b981; }
.app-card-title { font-size: .8rem; font-weight: 600; color: #64748b; }
.app-card-body  { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.mock-row { height: 10px; border-radius: 5px; background: #e8f2fc; }
.mock-row--blue  { background: #4a90e2; opacity: .6; height: 14px; }
.mock-row--short { width: 60%; }
.mock-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mock-tile { height: 52px; border-radius: 8px; background: #e8f2fc; }
.mock-tile--accent { background: rgba(74,144,226,.25); }
.mock-tile--light  { background: #f8fafc; border: 1px solid #e2ecf6; }

/* ── Tech Grid ── */
.tech-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;
}
.tech-card {
  background: #fff; border: 1px solid #e2ecf6; border-radius: 16px;
  padding: 24px 16px; display: flex; flex-direction: column; align-items: center;
  gap: 10px; text-align: center; transition: all .25s ease;
}
.tech-card:hover { border-color: #c9dff5; transform: translateY(-4px); box-shadow: 0 8px 28px rgba(74,144,226,.12); }
.tech-icon {
  width: 52px; height: 52px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
}
.tech-name { font-size: .9rem; font-weight: 700; color: #0d1b36; }
.tech-role { font-size: .78rem; color: #64748b; font-weight: 500; }

/* ── Routes Grid ── */
.routes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.route-card {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 20px; background: #fff; border: 1px solid #e2ecf6;
  border-radius: 14px; text-decoration: none; color: inherit;
  transition: all .22s ease;
}
.route-card:hover {
  border-color: #c9dff5; transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(74,144,226,.1);
}
.route-icon {
  width: 42px; height: 42px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.route-info { flex: 1; min-width: 0; }
.route-name {
  display: block; font-size: .92rem; font-weight: 700;
  color: #0d1b36; margin-bottom: 3px;
}
.route-desc {
  display: block; font-size: .78rem; color: #64748b;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.route-arrow {
  color: #c9dff5; font-size: .82rem; flex-shrink: 0;
  transition: color .2s, transform .2s;
}
.route-card:hover .route-arrow { color: #4a90e2; transform: translateX(3px); }

/* ── CTA ── */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #1a3a6b 0%, #2c6fbd 50%, #4a90e2 100%);
  position: relative; overflow: hidden;
}
.cta-glow {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 600px; height: 300px;
  background: radial-gradient(ellipse, rgba(255,255,255,.1) 0%, transparent 70%);
  pointer-events: none;
}
.cta-inner    { text-align: center; position: relative; }
.cta-heading  {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem; font-weight: 800; color: #fff;
  margin: 0 0 16px; letter-spacing: -.02em;
}
.cta-sub      { font-size: 1.1rem; color: rgba(255,255,255,.75); margin: 0 0 40px; }
.cta-actions  { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .tech-grid   { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 1024px) {
  .tech-grid   { grid-template-columns: repeat(3, 1fr); }
  .routes-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .hero-inner  { flex-direction: column; gap: 36px; text-align: center; }
  .hero-name   { font-size: 2.5rem; }
  .hero-actions{ justify-content: center; }
  .hero-bio    { margin-left: auto; margin-right: auto; }
  .avatar-wrap { margin: 0 auto; }
  .section-grid{ grid-template-columns: 1fr; gap: 48px; }
  .tech-grid   { grid-template-columns: repeat(2, 1fr); }
  .stats-grid  { gap: 0; }
  .stat-item   { padding: 20px 28px; }
  .stat-divider{ display: none; }
  .cta-heading { font-size: 2.2rem; }
}
@media (max-width: 560px) {
  .hero        { padding: 64px 0 56px; }
  .section     { padding: 64px 0; }
  .hero-name   { font-size: 2rem; }
  .routes-grid { grid-template-columns: 1fr; }
  .tech-grid   { grid-template-columns: repeat(2, 1fr); }
  .section-heading { font-size: 1.75rem; }
  .cta-heading { font-size: 1.75rem; }
}
</style>