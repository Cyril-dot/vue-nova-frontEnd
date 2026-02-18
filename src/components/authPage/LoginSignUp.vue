<!-- pages/AuthPage.vue -->
<template>
  <div class="auth-page">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <!-- Main Container -->
    <div class="auth-container">
      <!-- Left Side - Branding with Background -->
      <div class="auth-branding">
        <!-- Background Pattern (now scoped to left side only) -->
        <div class="branding-background">
          <div class="branding-gradient"></div>
          <div class="branding-pattern"></div>
        </div>

        <div class="branding-content">
          <div class="brand-logo">
            <svg width="60" height="60" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42" height="42" rx="11" fill="#ffffff"/>
              <line x1="8" y1="21" x2="34" y2="21" stroke="#e8f2fc" stroke-width="0.8"/>
              <line x1="21" y1="8" x2="21" y2="34" stroke="#e8f2fc" stroke-width="0.8"/>
              <polygon points="21,10 33,16 21,22 9,16" fill="#4a90e2" opacity="0.95"/>
              <rect x="29" y="16" width="2" height="8" rx="1" fill="#4a90e2"/>
              <circle cx="30" cy="25" r="2" fill="#7db8f0"/>
              <rect x="13" y="25" width="16" height="7" rx="2" fill="#2c6fbd"/>
              <line x1="21" y1="25" x2="21" y2="32" stroke="#4a90e2" stroke-width="1"/>
            </svg>
          </div>
          <h1 class="brand-title">Nova<span class="brand-accent">Space</span></h1>
          <p class="brand-tagline">Your intelligent workspace for collaboration</p>
          
          <div class="features-list">
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>AI-powered collaboration tools</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Real-time team workspace</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>Enterprise-grade security</span>
            </div>
          </div>

          <div class="testimonial">
            <div class="testimonial-text">
              "NovaSpace transformed how our team works together. The AI features are incredible!"
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="author-info">
                <div class="author-name">Sarah Mitchell</div>
                <div class="author-title">CTO, TechFlow</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Auth Form -->
      <div class="auth-form-container">
        <div class="auth-form-wrapper">
          <!-- MFA Verification Modal -->
          <div v-if="showMfaModal" class="mfa-modal-overlay" @click.self="closeMfaModal">
            <div class="mfa-modal">
              <button class="mfa-close-btn" @click="closeMfaModal">
                <i class="fas fa-times"></i>
              </button>
              
              <div class="mfa-header">
                <div class="mfa-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h3 class="mfa-title">Two-Factor Authentication</h3>
                <p class="mfa-subtitle">Enter the 6-digit code from your authenticator app</p>
              </div>

              <form @submit.prevent="handleMfaVerification" class="mfa-form">
                <div class="mfa-input-group">
                  <input 
                    v-for="(digit, index) in mfaCode" 
                    :key="index"
                    :ref="el => mfaInputs[index] = el"
                    v-model="mfaCode[index]"
                    type="text"
                    maxlength="1"
                    class="mfa-input"
                    @input="handleMfaInput(index, $event)"
                    @keydown="handleMfaKeydown(index, $event)"
                    @paste="handleMfaPaste"
                  />
                </div>

                <div v-if="mfaError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  <span>{{ mfaError }}</span>
                </div>

                <button type="submit" class="mfa-submit-btn" :disabled="isLoading || mfaCode.join('').length !== 6">
                  <span v-if="!isLoading">Verify Code</span>
                  <span v-else class="loading-spinner">
                    <i class="fas fa-circle-notch fa-spin"></i>
                    Verifying...
                  </span>
                </button>
              </form>
            </div>
          </div>

          <!-- Toggle Buttons -->
          <div class="auth-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: isLogin }"
              @click="switchMode(true)"
            >
              Log In
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: !isLogin }"
              @click="switchMode(false)"
            >
              Sign Up
            </button>
          </div>

          <!-- Form Header -->
          <div class="form-header">
            <h2 class="form-title">{{ isLogin ? 'Welcome back' : 'Create your account' }}</h2>
            <p class="form-subtitle">
              {{ isLogin ? 'Enter your credentials to access your workspace' : 'Get started with NovaSpace today' }}
            </p>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="errorMessage" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <div v-if="successMessage" class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <span>{{ successMessage }}</span>
          </div>

          <!-- OAuth Buttons -->
          <div class="oauth-buttons">
            <button class="oauth-btn oauth-btn--google" @click="handleGoogleLogin" :disabled="isLoading">
              <svg class="oauth-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button class="oauth-btn oauth-btn--github" @click="handleGithubLogin" :disabled="isLoading">
              <i class="fab fa-github oauth-icon"></i>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">or continue with email</span>
          </div>

          <!-- Email/Password Form -->
          <form @submit.prevent="handleSubmit" class="auth-form">
            <!-- Sign Up Fields -->
            <div v-if="!isLogin" class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name</label>
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    id="firstName" 
                    v-model="formData.firstName"
                    class="form-input" 
                    placeholder="John"
                    :class="{ 'input-error': errors.firstName }"
                    required
                  />
                </div>
                <span v-if="errors.firstName" class="field-error">{{ errors.firstName }}</span>
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name</label>
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    id="lastName" 
                    v-model="formData.lastName"
                    class="form-input" 
                    placeholder="Doe"
                    :class="{ 'input-error': errors.lastName }"
                    required
                  />
                </div>
                <span v-if="errors.lastName" class="field-error">{{ errors.lastName }}</span>
              </div>
            </div>

            <div v-if="!isLogin" class="form-group">
              <label for="username" class="form-label">Username</label>
              <div class="input-wrapper">
                <i class="fas fa-at input-icon"></i>
                <input 
                  type="text" 
                  id="username" 
                  v-model="formData.username"
                  class="form-input" 
                  placeholder="johndoe"
                  :class="{ 'input-error': errors.username }"
                  required
                />
              </div>
              <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email"
                  class="form-input" 
                  placeholder="you@example.com"
                  :class="{ 'input-error': errors.email }"
                  required
                />
              </div>
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="formData.password"
                  class="form-input" 
                  placeholder="Enter your password"
                  :class="{ 'input-error': errors.password }"
                  required
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <div v-if="!isLogin" class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <div class="input-wrapper">
                <i class="fas fa-lock input-icon"></i>
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="formData.confirmPassword"
                  class="form-input" 
                  placeholder="Confirm your password"
                  :class="{ 'input-error': errors.confirmPassword }"
                  required
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
            </div>

            <div v-if="!isLogin" class="form-group">
              <label class="checkbox-wrapper mfa-checkbox">
                <input type="checkbox" v-model="formData.mfaEnabled" />
                <span class="checkbox-label">
                  <i class="fas fa-shield-alt"></i>
                  Enable Two-Factor Authentication (MFA)
                </span>
              </label>
            </div>

            <div v-if="isLogin" class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkbox-label">Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">{{ isLogin ? 'Log In' : 'Create Account' }}</span>
              <span v-else class="loading-spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
                {{ isLogin ? 'Logging in...' : 'Creating account...' }}
              </span>
              <i v-if="!isLoading" class="fas fa-arrow-right"></i>
            </button>
          </form>

          <!-- Footer Links -->
          <div class="form-footer">
            <p class="footer-text">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <a href="#" @click.prevent="switchMode(!isLogin)" class="footer-link">
                {{ isLogin ? 'Sign up' : 'Log in' }}
              </a>
            </p>
          </div>

          <!-- Terms & Privacy -->
          <div class="legal-text">
            By continuing, you agree to our 
            <a href="#" class="legal-link">Terms of Service</a> and 
            <a href="#" class="legal-link">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TokenService, AuthAPI } from '@/utils/apiService';

export default {
  name: 'AuthPage',
  data() {
    return {
      isLogin: true,
      showPassword: false,
      showConfirmPassword: false,
      rememberMe: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      showMfaModal: false,
      mfaCode: ['', '', '', '', '', ''],
      mfaInputs: [],
      mfaError: '',
      pendingMfaEmail: '',
      formData: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        mfaEnabled: false
      },
      errors: {}
    }
  },
  methods: {
    switchMode(loginMode) {
      this.isLogin = loginMode;
      this.clearMessages();
      this.clearErrors();
      this.resetForm();
    },

    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },

    clearErrors() {
      this.errors = {};
    },

    resetForm() {
      this.formData = {
        firstName: '',
        lastName: '',
        username: '',
        email: this.formData.email,
        password: '',
        confirmPassword: '',
        mfaEnabled: false
      };
    },

    validateForm() {
      this.clearErrors();
      let isValid = true;

      if (!this.isLogin) {
        if (!this.formData.firstName || this.formData.firstName.length < 2) {
          this.errors.firstName = 'First name must be at least 2 characters';
          isValid = false;
        }
        if (!this.formData.lastName || this.formData.lastName.length < 2) {
          this.errors.lastName = 'Last name must be at least 2 characters';
          isValid = false;
        }
        if (!this.formData.username || this.formData.username.length < 3) {
          this.errors.username = 'Username must be at least 3 characters';
          isValid = false;
        }
        if (this.formData.password !== this.formData.confirmPassword) {
          this.errors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
      }

      if (!this.formData.email || !this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      if (!this.formData.password || this.formData.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }

      return isValid;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async handleSubmit() {
      this.clearMessages();
      
      if (!this.validateForm()) {
        this.errorMessage = 'Please fix the errors in the form';
        return;
      }

      this.isLoading = true;

      try {
        if (this.isLogin) {
          await this.handleLogin();
        } else {
          await this.handleRegister();
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async handleLogin() {
      try {
        console.log('=== LOGIN PROCESS STARTED ===');
        const data = await AuthAPI.login(this.formData.email, this.formData.password);

        console.log('=== LOGIN RESPONSE ===', data);

        if (data.message && data.message.toLowerCase().includes('mfa')) {
          console.log('MFA required');
          this.pendingMfaEmail = this.formData.email;
          this.showMfaModal = true;
          this.successMessage = 'Please enter your MFA code';
          return;
        }

        if (data.accessToken) {
          console.log('✅ Access token received');
          TokenService.setTokens(data.accessToken, data.refreshToken);
          
          this.successMessage = 'Login successful! Redirecting...';
          const redirectPath = this.$route.query.redirect || '/dashboard';
          
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 500);
        } else {
          throw new Error('No authentication token received from server');
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }
    },

    async handleRegister() {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', this.formData.firstName);
        formDataToSend.append('lastName', this.formData.lastName);
        formDataToSend.append('username', this.formData.username);
        formDataToSend.append('email', this.formData.email);
        formDataToSend.append('password', this.formData.password);
        formDataToSend.append('confirmPassword', this.formData.confirmPassword);
        formDataToSend.append('mfaEnabled', this.formData.mfaEnabled);

        const data = await AuthAPI.register(formDataToSend);

        this.successMessage = 'Account created successfully! Redirecting to login...';
        
        if (data.user && data.user.mfaSecret && data.user.mfaSecret !== 'MFA not enabled') {
          alert(`Your MFA Secret: ${data.user.mfaSecret}\nPlease save this in your authenticator app!`);
        }

        setTimeout(() => {
          this.switchMode(true);
          this.formData.email = data.user.email;
          this.successMessage = 'Registration successful! Please log in.';
        }, 2000);
      } catch (error) {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    },

    handleGoogleLogin() {
      console.log('🔐 Initiating Google OAuth login...');
      window.location.href = 'https://nova-test-ctne.onrender.com/api/oauth2/login/google';
    },

    handleGithubLogin() {
      console.log('🔐 Initiating GitHub OAuth login...');
      window.location.href = 'https://nova-test-ctne.onrender.com/api/oauth2/login/github';
    },

    handleMfaInput(index, event) {
      const value = event.target.value;
      
      if (value && index < 5) {
        this.mfaInputs[index + 1]?.focus();
      }
    },

    handleMfaKeydown(index, event) {
      if (event.key === 'Backspace' && !this.mfaCode[index] && index > 0) {
        this.mfaInputs[index - 1]?.focus();
      }
    },

    handleMfaPaste(event) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      
      for (let i = 0; i < pastedData.length; i++) {
        this.mfaCode[i] = pastedData[i];
      }
      
      if (pastedData.length > 0) {
        const lastIndex = Math.min(pastedData.length - 1, 5);
        this.mfaInputs[lastIndex]?.focus();
      }
    },

    async handleMfaVerification() {
      const code = this.mfaCode.join('');
      
      if (code.length !== 6) {
        this.mfaError = 'Please enter a 6-digit code';
        return;
      }

      this.isLoading = true;
      this.mfaError = '';

      try {
        const data = await AuthAPI.verifyMfa(this.pendingMfaEmail, code);

        if (data.accessToken) {
          TokenService.setTokens(data.accessToken, data.refreshToken);
          
          this.showMfaModal = false;
          this.successMessage = 'Login successful! Redirecting...';
          
          const redirectPath = this.$route.query.redirect || '/dashboard';
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 500);
        }
      } catch (error) {
        this.mfaError = error.message || 'Invalid code. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },

    closeMfaModal() {
      this.showMfaModal = false;
      this.mfaCode = ['', '', '', '', '', ''];
      this.mfaError = '';
      this.pendingMfaEmail = '';
    }
  },

  mounted() {
    console.log('🔥🔥🔥 === AUTHPAGE MOUNTED - CHECKING FOR OAUTH TOKENS === 🔥🔥🔥');
    
    // ⭐ CRITICAL: Check for OAuth tokens FIRST - this must run BEFORE router guard check
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    
    console.log('🔍 URL Parameters:');
    console.log('- accessToken present:', !!accessToken);
    console.log('- refreshToken present:', !!refreshToken);
    
    // If we have OAuth tokens, process them IMMEDIATELY
    if (accessToken) {
      console.log('🔑🔑🔑 OAUTH TOKENS RECEIVED FROM BACKEND 🔑🔑🔑');
      console.log('- Access Token length:', accessToken.length);
      console.log('- Refresh Token length:', refreshToken ? refreshToken.length : 'N/A');
      
      try {
        // Decode URL-encoded tokens
        const decodedAccessToken = decodeURIComponent(accessToken);
        const decodedRefreshToken = refreshToken ? decodeURIComponent(refreshToken) : null;
        
        console.log('✅ Tokens decoded successfully');
        console.log('- Decoded Access Token length:', decodedAccessToken.length);
        console.log('- Decoded Refresh Token length:', decodedRefreshToken ? decodedRefreshToken.length : 'N/A');
        
        // ⭐ SAVE TOKENS IMMEDIATELY using TokenService
        TokenService.setTokens(decodedAccessToken, decodedRefreshToken);
        console.log('✅✅✅ TOKENS SAVED TO STORAGE ✅✅✅');
        
        // Verify tokens were saved
        const savedAccessToken = TokenService.getAccessToken();
        const savedRefreshToken = TokenService.getRefreshToken();
        console.log('✅ Storage verification:');
        console.log('- AccessToken saved:', !!savedAccessToken);
        console.log('- RefreshToken saved:', !!savedRefreshToken);
        console.log('- Access token match:', savedAccessToken === decodedAccessToken);
        
        if (!savedAccessToken) {
          throw new Error('Failed to save tokens to storage');
        }
        
        // Clean URL
        console.log('🧹 Cleaning URL...');
        window.history.replaceState({}, document.title, '/auth');
        
        // Redirect to dashboard
        console.log('🚀🚀🚀 REDIRECTING TO DASHBOARD 🚀🚀🚀');
        this.successMessage = 'Login successful! Redirecting to dashboard...';
        
        setTimeout(() => {
          console.log('→→→ Navigating to /dashboard');
          this.$router.push('/dashboard');
        }, 1000);
        
        return; // ⭐ STOP HERE - don't continue to auth check below
        
      } catch (error) {
        console.error('❌ ERROR SAVING OAUTH TOKENS:', error);
        this.errorMessage = 'Failed to process authentication. Please try again.';
        return;
      }
    }
    
    // If no OAuth tokens, check if already authenticated
    console.log('ℹ️ No OAuth tokens in URL, checking existing auth...');
    
    if (TokenService.isAuthenticated()) {
      console.log('✅ User already authenticated - redirecting to dashboard');
      this.$router.push('/dashboard');
    } else {
      console.log('ℹ️ User not authenticated - showing auth page');
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  font-family: 'Manrope', sans-serif;
  position: relative;
}

.auth-container {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  isolation: isolate;
}

.auth-branding {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.branding-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.branding-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0d1b36 0%, #1a3a5e 50%, #2c6fbd 100%);
}

.branding-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a90e2' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.6;
}

.branding-content {
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.brand-logo {
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.brand-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1;
  letter-spacing: -0.02em;
}

.brand-accent {
  color: #7dd3fc;
}

.brand-tagline {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
  font-weight: 500;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
}

.feature-item i {
  color: #7dd3fc;
  font-size: 1.1rem;
}

.testimonial {
  padding: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.testimonial-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-style: italic;
  margin-bottom: 20px;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.1rem;
}

.author-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
}

.author-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.auth-form-container {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  z-index: 1;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 480px;
}

.alert {
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.alert-success {
  background: #efe;
  color: #3c3;
  border: 1px solid #cfc;
}

.alert i {
  font-size: 1.1rem;
}

.auth-toggle {
  display: flex;
  gap: 8px;
  padding: 6px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 40px;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Manrope', sans-serif;
}

.toggle-btn.active {
  background: #ffffff;
  color: #4a90e2;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.15);
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0d1b36;
  margin-bottom: 8px;
  line-height: 1.2;
}

.form-subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  border: 1.5px solid #e2ecf6;
  background: #ffffff;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Manrope', sans-serif;
}

.oauth-btn:hover:not(:disabled) {
  border-color: #c9dff5;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.1);
}

.oauth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.oauth-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.divider {
  position: relative;
  text-align: center;
  margin: 32px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2ecf6;
}

.divider-text {
  position: relative;
  display: inline-block;
  padding: 0 16px;
  background: #ffffff;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #64748b;
  font-size: 1rem;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid #e2ecf6;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: 'Manrope', sans-serif;
  color: #2d3748;
  transition: all 0.3s ease;
  background: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
}

.form-input.input-error {
  border-color: #f87171;
}

.form-input::placeholder {
  color: #94a3b8;
}

.field-error {
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 500;
  margin-top: -4px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #4a90e2;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4a90e2;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mfa-checkbox .checkbox-label {
  color: #4a90e2;
  font-weight: 600;
}

.forgot-link {
  font-size: 0.9rem;
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #2c6fbd;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Manrope', sans-serif;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.submit-btn i {
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) i {
  transform: translateX(4px);
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mfa-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.mfa-modal {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mfa-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.mfa-close-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.mfa-header {
  text-align: center;
  margin-bottom: 32px;
}

.mfa-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #ffffff;
  font-size: 1.8rem;
}

.mfa-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0d1b36;
  margin-bottom: 8px;
}

.mfa-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.mfa-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mfa-input-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.mfa-input {
  width: 56px;
  height: 64px;
  border: 2px solid #e2ecf6;
  border-radius: 12px;
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'Manrope', sans-serif;
  color: #0d1b36;
  transition: all 0.3s ease;
}

.mfa-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.mfa-submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4a90e2 0%, #2c6fbd 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Manrope', sans-serif;
}

.mfa-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.mfa-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
}

.footer-text {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.footer-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #2c6fbd;
}

.legal-text {
  text-align: center;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 20px;
  line-height: 1.5;
}

.legal-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #4a90e2;
}

@media (max-width: 968px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-branding {
    display: none;
  }

  .auth-form-container {
    padding: 40px 24px;
  }
}

@media (max-width: 640px) {
  .auth-form-container {
    padding: 32px 16px;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-subtitle {
    font-size: 0.95rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .oauth-btn {
    font-size: 0.9rem;
    padding: 12px;
  }

  .form-input {
    padding: 12px 14px 12px 44px;
    font-size: 0.9rem;
  }

  .submit-btn {
    padding: 14px;
    font-size: 0.95rem;
  }

  .mfa-modal {
    padding: 28px 20px;
  }

  .mfa-input {
    width: 48px;
    height: 56px;
    font-size: 1.5rem;
  }

  .mfa-input-group {
    gap: 8px;
  }
}
</style>