<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <!-- Left Side - Banner -->
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

      <!-- Right Side - Register Form -->
      <div class="col-12 col-md-4 d-flex align-items-center justify-content-center bg-light">
        <div class="register-form-container w-75" style="max-width: 420px">
          <div class="mb-4">
            <h3 class="fw-bold mb-2 text-dark">Daftar Akun Baru</h3>
            <p class="text-muted mb-0">Buat akun untuk mengakses semua fitur sistem</p>
          </div>

          <form @submit.prevent="handleRegister" class="needs-validation" novalidate>
            <div class="mb-3">
              <label class="form-label fw-medium">Full Name</label>
              <input
                type="text"
                class="form-control form-control-lg"
                v-model="fullName"
                placeholder="Masukkan nama lengkap"
                required
                :class="{ 'is-invalid': fullNameError }"
              />
              <div v-if="fullNameError" class="invalid-feedback">
                {{ fullNameError }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-medium">Email Address</label>
              <input
                type="email"
                class="form-control form-control-lg"
                v-model="email"
                placeholder="Masukkan email address"
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
                  placeholder="Masukkan password"
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
              <div class="form-text">Password minimal 6 karakter</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-medium">Confirm Password</label>
              <div class="input-group">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control form-control-lg"
                  v-model="confirmPassword"
                  placeholder="Konfirmasi password"
                  required
                  :class="{ 'is-invalid': confirmPasswordError }"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="toggleConfirmPassword"
                  tabindex="-1"
                >
                  <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div v-if="confirmPasswordError" class="invalid-feedback d-block">
                {{ confirmPasswordError }}
              </div>
            </div>

            <div class="d-flex gap-3 mb-3">
              <button type="button" class="btn btn-outline-dark btn-lg w-50" @click="goToLogin">
                Login
              </button>
              <button type="submit" class="btn btn-dark btn-lg w-50" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
                Register
              </button>
            </div>

            <!-- Alert for register status -->
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
// Import supabase di bagian atas file
import { supabase } from '@/lib/supabase'

export default {
  name: 'Register',
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      fullNameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      alertMessage: '',
      alertClass: '',
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },

    validateForm() {
      this.fullNameError = ''
      this.emailError = ''
      this.passwordError = ''
      this.confirmPasswordError = ''
      let isValid = true

      // Full Name validation
      if (!this.fullName.trim()) {
        this.fullNameError = 'Nama lengkap harus diisi'
        isValid = false
      } else if (this.fullName.trim().length < 2) {
        this.fullNameError = 'Nama lengkap minimal 2 karakter'
        isValid = false
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.emailError = 'Email harus diisi'
        isValid = false
      } else if (!emailPattern.test(this.email)) {
        this.emailError = 'Format email tidak valid'
        isValid = false
      }

      // Password validation
      if (!this.password) {
        this.passwordError = 'Password harus diisi'
        isValid = false
      } else if (this.password.length < 6) {
        this.passwordError = 'Password minimal 6 karakter'
        isValid = false
      }

      // Confirm Password validation
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Konfirmasi password harus diisi'
        isValid = false
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Password tidak sama'
        isValid = false
      }

      return isValid
    },

    async handleRegister() {
      this.alertMessage = ''

      if (!this.validateForm()) {
        return
      }

      this.isLoading = true

      try {
        const { data, error } = await supabase.auth.signUp({
          email: this.email.trim(),
          password: this.password,
          options: {
            data: {
              full_name: this.fullName.trim(),
            },
          },
        })

        if (error) throw error

        this.alertMessage = 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.'
        this.alertClass = 'alert-success'

        // Clear form
        this.fullName = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      } catch (error) {
        console.error('Register error:', error)
        this.alertMessage = error.message || 'Gagal melakukan registrasi'
        this.alertClass = 'alert-danger'
      } finally {
        this.isLoading = false
      }
    },

    goToLogin() {
      this.$emit('go-to-login')
    },
  },

  watch: {
    fullName() {
      if (this.fullNameError) {
        this.fullNameError = ''
      }
    },
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
    confirmPassword() {
      if (this.confirmPasswordError) {
        this.confirmPasswordError = ''
      }
    },
  },
}
</script>

<style scoped>
.register-wrapper {
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

.register-form-container {
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

.form-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
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
