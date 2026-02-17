<template>
  <div>
    <HeroSection />
    <TrustedBy />
    <FeaturesSection />
    <WorkspaceSection />
    <AIFeaturesSection />
    <CollaborationSection />
    <SecuritySection />
    <CTASection />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue'
import TrustedBy from '../components/TrustedBy.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import WorkspaceSection from '../components/WorkspaceSection.vue'
import AIFeaturesSection from '../components/AIFeaturesSection.vue'
import CollaborationSection from '../components/CollaborationSection.vue'
import SecuritySection from '../components/SecuritySection.vue'
import CTASection from '../components/CTASection.vue'

export default {
  name: 'Home',
  components: {
    HeroSection,
    TrustedBy,
    FeaturesSection,
    WorkspaceSection,
    AIFeaturesSection,
    CollaborationSection,
    SecuritySection,
    CTASection
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

section {
  padding: 80px 0;
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

p {
  color: #4a4a4a;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background-color: #e6f0fa;
  color: #1a1a1a;
  border: 1px solid #b8d1e6;
}

.btn-primary:hover {
  background-color: #d1e2f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 209, 230, 0.3);
}

.btn-outline {
  background-color: transparent;
  color: #1a1a1a;
  border: 1px solid #b8d1e6;
}

.btn-outline:hover {
  background-color: #e6f0fa;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  section {
    padding: 60px 0;
  }
}
</style>
