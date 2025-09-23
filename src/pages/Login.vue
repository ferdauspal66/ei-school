<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <!-- Left Side - Modifikasi untuk mobile -->
      <div
        class="col-12 col-md-8 bg-image align-items-center justify-content-center text-white text-start position-relative mobile-banner"
      >
        <div class="content-overlay text-center text-md-start p-4">
          <div class="logo-section mb-4">
            <div class="logo-container mb-3">
              <img src="../assets/logo.png" alt="Logo" class="logo-img" />
            </div>
            <h2 class="fw-bold h1 mb-2">Electronic Islamic</h2>
            <p class="fs-4 mb-0 opacity-90">School Management System</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Modifikasi untuk mobile -->
      <div class="col-12 col-md-4 d-flex align-items-center justify-content-center bg-light">
        <div class="login-form-container w-75" style="max-width: 420px">
          <div class="mb-4">
            <h3 class="fw-bold mb-2 text-dark">Ahlan wa sahlan,</h3>
            <p class="text-muted mb-0">Login below to access all our feature or try register</p>
          </div>

          <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
            <div class="mb-3">
              <label class="form-label fw-medium">Email Address</label>
              <input
                type="email"
                class="form-control form-control-lg"
                v-model="email"
                placeholder="Email Address"
                required
                :class="{ 'is-invalid': emailError }"
              />
              <div v-if="emailError" class="invalid-feedback">
                {{ emailError }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-medium">Password</label>
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control form-control-lg"
                  v-model="password"
                  placeholder="Password"
                  required
                  :class="{ 'is-invalid': passwordError }"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="togglePassword"
                  tabindex="-1"
                >
                  <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div v-if="passwordError" class="invalid-feedback d-block">
                {{ passwordError }}
              </div>
            </div>

            <div class="d-flex justify-content-end mb-4">
              <a href="#" class="text-decoration-none text-muted small">Forgot password?</a>
            </div>

            <div class="d-flex gap-3 mb-3">
              <button type="button" class="btn btn-outline-dark btn-lg w-50" @click="goToRegister">
                Sign up
              </button>
              <button type="submit" class="btn btn-dark btn-lg w-50" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
                Log in
              </button>
            </div>

            <!-- Alert for login status -->
            <div v-if="alertMessage" :class="alertClass" class="alert" role="alert">
              {{ alertMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      isLoading: false,
      emailError: '',
      passwordError: '',
      alertMessage: '',
      alertClass: '',
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    validateForm() {
      this.emailError = ''
      this.passwordError = ''
      let isValid = true

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.emailError = 'Email is required'
        isValid = false
      } else if (!emailPattern.test(this.email)) {
        this.emailError = 'Please enter a valid email address'
        isValid = false
      }

      // Password validation
      if (!this.password) {
        this.passwordError = 'Password is required'
        isValid = false
      } else if (this.password.length < 4) {
        this.passwordError = 'Password must be at least 4 characters'
        isValid = false
      }

      return isValid
    },

    async handleLogin() {
      this.alertMessage = ''

      if (!this.validateForm()) {
        return
      }

      this.isLoading = true

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email.trim(),
          password: this.password,
        })

        if (error) throw error

        this.alertMessage = 'Login berhasil! Mengalihkan...'
        this.alertClass = 'alert-success'

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))

        // Immediate redirect
        this.$router.push({ name: 'Dashboard' }) // Gunakan name router
      } catch (error) {
        console.error('Login error:', error)
        this.alertMessage = 'Email atau password salah'
        this.alertClass = 'alert-danger'
      } finally {
        this.isLoading = false
      }
    },

    goToRegister() {
      this.$router.push('/register')
    },
  },

  watch: {
    email() {
      if (this.emailError) {
        this.emailError = ''
      }
    },
    password() {
      if (this.passwordError) {
        this.passwordError = ''
      }
    },
  },
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.bg-image {
  background: url(../assets/bg-login.jpg);
  background-size: cover;
  background-position: center;
  position: relative;
  min-height: 100vh;
}

.content-overlay {
  position: relative;
  z-index: 2;
  padding: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-section {
  text-align: center;
  width: 100%;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.logo-img {
  max-width: 120px;
  height: auto;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem 1rem;
}

.form-control {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1.5px solid #e9ecef;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
  background-color: white;
}

.form-control::placeholder {
  color: #6c757d;
  font-size: 0.9rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: none;
}

.btn-outline-dark {
  color: #495057;
  border-color: #dee2e6;
  background: white;
}

.btn-outline-dark:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.btn-dark {
  background-color: #212529;
  border-color: #212529;
}

.btn-dark:hover {
  background-color: #1a1e21;
  border-color: #1a1e21;
}

.input-group .btn-outline-secondary {
  border-left: none;
  border-color: #e9ecef;
  background: #f8f9fa;
  color: #6c757d;
}

.input-group .btn-outline-secondary:hover {
  background: #e9ecef;
  border-color: #e9ecef;
  color: #495057;
}

.input-group .form-control {
  border-right: none;
}

.input-group .form-control:focus {
  border-right: none;
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.alert {
  border-radius: 6px;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
}

.text-muted {
  font-size: 0.9rem;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .mobile-banner {
    min-height: 300px !important;
    height: auto !important;
    display: flex !important;
  }

  .content-overlay {
    padding: 2rem 1rem;
    text-align: center;
  }

  .logo-img {
    max-width: 80px;
  }

  .logo-section h2 {
    font-size: 1.75rem;
  }

  .logo-section p {
    font-size: 1.1rem !important;
  }
}

/* Ensure full height on all browsers */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}
</style>
