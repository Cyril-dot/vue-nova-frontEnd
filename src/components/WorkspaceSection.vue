<!-- components/WorkspaceSection.vue -->
<template>
  <section class="workspace">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="container">
      <div class="section-header">
        <span class="section-badge">
          <i class="fas fa-layer-group"></i>
          Workspace
        </span>
        <h2 class="section-title">Create and Manage Work in Any Format</h2>
        <p class="section-subtitle">Powerful multi-format workspace supporting all your favorite file types and languages</p>
      </div>
      
      <div class="workspace-grid">
        <!-- File Types Card -->
        <div class="workspace-card workspace-card--large">
          <div class="card-header">
            <div class="card-icon-wrapper" style="background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%)">
              <i class="fas fa-file-lines card-icon"></i>
            </div>
            <div class="card-badge">Documents</div>
          </div>
          
          <h3 class="card-title">Document Formats</h3>
          <p class="card-description">Create and edit professional documents in multiple formats</p>
          
          <div class="formats-grid">
            <div v-for="format in documentFormats" :key="format.name" class="format-item">
              <i :class="format.icon" class="format-icon"></i>
              <span class="format-name">{{ format.name }}</span>
            </div>
          </div>
        </div>

        <!-- Code Types Card -->
        <div class="workspace-card workspace-card--large">
          <div class="card-header">
            <div class="card-icon-wrapper" style="background: linear-gradient(135deg, #5ba4ef 0%, #4a90e2 100%)">
              <i class="fas fa-code card-icon"></i>
            </div>
            <div class="card-badge">Programming</div>
          </div>
          
          <h3 class="card-title">Code & Scripts</h3>
          <p class="card-description">Write and manage code in all major programming languages</p>
          
          <div class="formats-grid">
            <div v-for="format in codeFormats" :key="format.name" class="format-item">
              <i :class="format.icon" class="format-icon"></i>
              <span class="format-name">{{ format.name }}</span>
            </div>
          </div>
        </div>

        <!-- Data Types Card -->
        <div class="workspace-card">
          <div class="card-header">
            <div class="card-icon-wrapper" style="background: linear-gradient(135deg, #7db8f0 0%, #4a90e2 100%)">
              <i class="fas fa-database card-icon"></i>
            </div>
            <div class="card-badge">Data</div>
          </div>
          
          <h3 class="card-title">Data Formats</h3>
          <p class="card-description">Handle structured data with ease</p>
          
          <div class="formats-list">
            <div v-for="format in dataFormats" :key="format" class="format-tag">
              <i class="fas fa-check-circle"></i>
              {{ format }}
            </div>
          </div>
        </div>

        <!-- Web Types Card -->
        <div class="workspace-card">
          <div class="card-header">
            <div class="card-icon-wrapper" style="background: linear-gradient(135deg, #2c6fbd 0%, #1a5fb4 100%)">
              <i class="fas fa-globe card-icon"></i>
            </div>
            <div class="card-badge">Web</div>
          </div>
          
          <h3 class="card-title">Web Development</h3>
          <p class="card-description">Build modern web applications</p>
          
          <div class="formats-list">
            <div v-for="format in webFormats" :key="format" class="format-tag">
              <i class="fas fa-check-circle"></i>
              {{ format }}
            </div>
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="workspace-features">
        <div v-for="(feature, index) in features" :key="feature.title" class="feature-item" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="feature-icon-circle">
            <i :class="feature.icon"></i>
          </div>
          <div class="feature-content">
            <h4 class="feature-title">{{ feature.title }}</h4>
            <p class="feature-text">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WorkspaceSection',
  data() {
    return {
      documentFormats: [
        { name: 'PDF', icon: 'fas fa-file-pdf' },
        { name: 'Word', icon: 'fas fa-file-word' },
        { name: 'Markdown', icon: 'fab fa-markdown' },
        { name: 'Plain Text', icon: 'fas fa-file-lines' }
      ],
      codeFormats: [
        { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'Python', icon: 'fab fa-python' },
        { name: 'Java', icon: 'fab fa-java' },
        { name: 'C/C++', icon: 'fas fa-code' }
      ],
      dataFormats: [
        'JSON',
        'XML',
        'SQL',
        'YAML',
        'CSV'
      ],
      webFormats: [
        'HTML',
        'CSS',
        'React',
        'Vue',
        'Angular'
      ],
      features: [
        {
          icon: 'fas fa-download',
          title: 'Export Options',
          description: 'Download your work in multiple formats with one click'
        },
        {
          icon: 'fas fa-clock-rotate-left',
          title: 'Version History',
          description: 'Track changes and restore previous versions anytime'
        },
        {
          icon: 'fas fa-floppy-disk',
          title: 'Auto-Save',
          description: 'Never lose your work with automatic saving every few seconds'
        },
        {
          icon: 'fas fa-share-nodes',
          title: 'Easy Sharing',
          description: 'Share files with teammates or export to cloud storage'
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.workspace {
  background: #ffffff;
  padding: 100px 0;
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
}

.workspace::before {
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

/* Workspace Grid */
.workspace-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

/* Workspace Cards */
.workspace-card {
  background: #ffffff;
  border: 1px solid #e2ecf6;
  border-radius: 20px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.workspace-card--large {
  grid-column: span 1;
}

.workspace-card::before {
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

.workspace-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(74, 144, 226, 0.15);
  border-color: #c9dff5;
}

.workspace-card:hover::before {
  transform: scaleX(1);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.2);
}

.card-icon {
  font-size: 24px;
  color: #ffffff;
}

.card-badge {
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

.card-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0d1b36;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.card-description {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.5;
  font-weight: 500;
}

/* Formats Grid */
.formats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e8f2fc;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.format-item:hover {
  background: #e8f2fc;
  border-color: #c9dff5;
  transform: translateX(4px);
}

.format-icon {
  font-size: 20px;
  color: #4a90e2;
}

.format-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

/* Formats List */
.formats-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.format-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e8f2fc;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  transition: all 0.3s ease;
}

.format-tag:hover {
  background: #e8f2fc;
  border-color: #c9dff5;
  transform: translateX(4px);
}

.format-tag i {
  color: #4a90e2;
  font-size: 0.85rem;
}

/* Features List */
.workspace-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border: 1px solid #e8f2fc;
  border-radius: 16px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-item:hover {
  background: #ffffff;
  border-color: #c9dff5;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.1);
  transform: translateY(-4px);
}

.feature-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8f2fc 0%, #d1e5f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a90e2;
  font-size: 20px;
  flex-shrink: 0;
  border: 1px solid #c9dff5;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0d1b36;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.feature-text {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 968px) {
  .workspace {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.05rem;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .workspace-card--large {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .workspace {
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

  .workspace-card {
    padding: 24px;
  }

  .formats-grid {
    grid-template-columns: 1fr;
  }

  .workspace-features {
    grid-template-columns: 1fr;
  }
}
</style>