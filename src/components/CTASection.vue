<!-- components/CTASection.vue -->
<template>
  <section class="cta">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="cta-background">
      <div class="cta-pattern"></div>
      <div class="cta-gradient"></div>
    </div>

    <div class="container">
      <div class="cta-content">
        <div class="cta-badge">
          <i class="fas fa-rocket"></i>
          <span>Get Started Today</span>
        </div>
        
        <h2 class="cta-title">Ready to Transform Your Workspace?</h2>
        <p class="cta-subtitle">
          Join thousands of teams already using NovaSpace to collaborate smarter, 
          work faster, and achieve more together
        </p>

        <div class="cta-buttons">
          <button class="cta-btn cta-btn--primary">
            <span class="btn-text">Get Started</span>
            <i class="fas fa-arrow-right btn-icon"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CTASection'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.cta {
  position: relative;
  padding: 200px 0 120px;
  font-family: 'Manrope', sans-serif;
  overflow: hidden;
  margin-top: 200px;
}

/* Background Layers */
.cta-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.cta-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0d1b36 0%, #1a3a5e 50%, #2c6fbd 100%);
}

.cta-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a90e2' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.6;
  animation: patternMove 60s linear infinite;
}

@keyframes patternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* CTA Content */
.cta-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.cta-badge i {
  font-size: 1.1rem;
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 24px 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.cta-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 48px 0;
  line-height: 1.6;
  font-weight: 500;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* CTA Buttons */
.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 20px 36px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cta-btn:hover::before {
  left: 100%;
}

.cta-btn--primary {
  background: #ffffff;
  color: #2c6fbd;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.25);
}

.cta-btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.35);
  background: #f8fafc;
}

.cta-btn--primary .btn-icon {
  transition: transform 0.3s ease;
}

.cta-btn--primary:hover .btn-icon {
  transform: translateX(5px);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-icon {
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

/* Responsive Design */
@media (max-width: 968px) {
  .cta {
    padding: 150px 0 100px;
    margin-top: 150px;
  }

  .cta-title {
    font-size: 2.5rem;
  }

  .cta-subtitle {
    font-size: 1.15rem;
  }

  .cta-content {
    margin-bottom: 0;
  }
}

@media (max-width: 640px) {
  .cta {
    padding: 120px 0 80px;
    margin-top: 120px;
  }

  .container {
    padding: 0 16px;
  }

  .cta-badge {
    font-size: 0.8rem;
    padding: 8px 18px;
    margin-bottom: 24px;
  }

  .cta-title {
    font-size: 2rem;
  }

  .cta-subtitle {
    font-size: 1.05rem;
    margin-bottom: 36px;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 16px;
  }

  .cta-btn {
    width: 100%;
    justify-content: center;
    padding: 18px 32px;
    font-size: 1rem;
  }
}

/* Advanced animations */
@media (prefers-reduced-motion: no-preference) {
  .cta-content {
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>