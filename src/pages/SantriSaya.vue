<template>
  <div class="dashboard">
    <Sidebar />
    <div class="main-content">
      <TopBar />
      <div class="content-wrapper">
        <div class="santri-saya">
          <!-- Header Section -->
          <div class="page-header">
            <h1 class="page-title">Santri Saya</h1>
            <p class="page-subtitle">Kelola data santri anak Anda</p>
          </div>

          <!-- Add Santri Form -->
          <div class="add-santri-section">
            <div class="section-card">
              <div class="card-header">
                <h2 class="card-title">
                  <UserPlus class="title-icon" />
                  Tambah Santri
                </h2>
                <p class="card-description">Masukkan ID santri untuk menambahkan anak Anda</p>
              </div>

              <form @submit.prevent="addSantri" class="santri-form">
                <div class="form-group">
                  <label for="santriId" class="form-label">ID Santri</label>
                  <div class="input-group">
                    <input
                      type="text"
                      id="santriId"
                      v-model="newSantriId"
                      class="form-control"
                      :class="{ 'is-invalid': idError }"
                      placeholder="Contoh: A12345689b"
                      @input="validateId"
                      @keyup.enter="addSantri"
                    />
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="!isValidId || isLoading"
                    >
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <Plus class="btn-icon" />
                      Tambah
                    </button>
                  </div>
                  <div v-if="idError" class="invalid-feedback">
                    {{ idError }}
                  </div>
                  <div class="form-help">
                    <Info class="help-icon" />
                    <span>ID santri terdiri dari huruf dan angka, contoh: A12345689b</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Santri List -->
          <div class="santri-list-section">
            <div class="section-card">
              <div class="card-header">
                <h2 class="card-title">
                  <Users class="title-icon" />
                  Daftar Santri Saya
                  <span class="badge">{{ santriList.length }}</span>
                </h2>
              </div>

              <!-- Empty State -->
              <div v-if="santriList.length === 0" class="empty-state">
                <UserX class="empty-icon" />
                <h3 class="empty-title">Belum ada santri</h3>
                <p class="empty-description">
                  Tambahkan ID santri anak Anda untuk melihat informasi mereka
                </p>
              </div>

              <!-- Santri Cards -->
              <div v-else class="santri-grid">
                <div v-for="santri in santriList" :key="santri.id" class="santri-card">
                  <div class="santri-avatar">
                    <User class="avatar-icon" />
                  </div>

                  <div class="santri-info">
                    <h3 class="santri-name">{{ santri.name }}</h3>
                    <p class="santri-id">ID: {{ santri.santriId }}</p>
                    <div class="santri-details">
                      <div class="detail-item">
                        <GraduationCap class="detail-icon" />
                        <span>{{ santri.grade }}</span>
                      </div>
                      <div class="detail-item">
                        <Calendar class="detail-icon" />
                        <span>{{ santri.status }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="santri-actions">
                    <button class="action-btn primary" @click="viewSantri(santri)">
                      <Eye class="action-icon" />
                      Lihat Detail
                    </button>
                    <button class="action-btn danger" @click="removeSantri(santri.id)">
                      <Trash2 class="action-icon" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="message" :class="messageClass" class="alert-message">
            <CheckCircle v-if="messageType === 'success'" class="message-icon" />
            <AlertCircle v-else class="message-icon" />
            <span>{{ message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import {
  UserPlus,
  Plus,
  Info,
  Users,
  UserX,
  User,
  GraduationCap,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-vue-next'

export default {
  name: 'SantriSaya',
  components: {
    Sidebar,
    TopBar,
    UserPlus,
    Plus,
    Info,
    Users,
    UserX,
    User,
    GraduationCap,
    Calendar,
    Eye,
    Trash2,
    CheckCircle,
    AlertCircle,
  },
  data() {
    return {
      newSantriId: '',
      idError: '',
      isLoading: false,
      santriList: [],
      message: '',
      messageType: '',
      messageClass: '',
    }
  },
  computed: {
    isValidId() {
      return this.newSantriId.trim() !== '' && !this.idError
    },
  },
  async mounted() {
    await this.loadSantriList()
  },
  methods: {
    async loadSantriList() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        if (!user.id) {
          return
        }

        const response = await fetch(
          `http://localhost/ei-school/backend/api/santri.php?action=list&parent_id=${user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()

        if (data.success) {
          this.santriList = data.data.map((santri) => ({
            id: santri.id,
            santriId: santri.santri_id,
            name: santri.full_name,
            grade: santri.grade,
            status: santri.status,
            addedAt: new Date(santri.created_at).toLocaleDateString('id-ID'),
          }))
        }
      } catch (error) {
        console.error('Load santri error:', error)
      }
    },
    validateId() {
      const id = this.newSantriId.trim()

      if (id === '') {
        this.idError = ''
        return
      }

      // Validasi: hanya huruf dan angka, minimal 3 karakter
      const idPattern = /^[a-zA-Z0-9]+$/

      if (!idPattern.test(id)) {
        this.idError = 'ID santri hanya boleh berisi huruf dan angka'
        return
      }

      if (id.length < 3) {
        this.idError = 'ID santri minimal 3 karakter'
        return
      }

      // Cek apakah ID sudah ada
      if (this.santriList.some((santri) => santri.santriId.toLowerCase() === id.toLowerCase())) {
        this.idError = 'ID santri sudah terdaftar'
        return
      }

      this.idError = ''
    },

    async addSantri() {
      if (!this.isValidId) return

      this.isLoading = true
      this.message = ''

      try {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        if (!user.id) {
          this.showMessage('Sesi login tidak valid. Silakan login ulang.', 'error')
          return
        }

        // Validasi ID santri di database
        const validateResponse = await fetch(
          'http://localhost/ei-school/backend/api/santri.php?action=validate',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              santri_id: this.newSantriId.trim(),
            }),
          },
        )

        const validateData = await validateResponse.json()

        if (!validateData.success) {
          this.showMessage(validateData.message || 'ID santri tidak ditemukan di database', 'error')
          return
        }

        // Tambah santri ke parent
        const addResponse = await fetch(
          'http://localhost/ei-school/backend/api/santri.php?action=add-to-parent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              parent_id: user.id,
              santri_id: this.newSantriId.trim(),
            }),
          },
        )

        const addData = await addResponse.json()

        if (addData.success) {
          // Tambah ke list lokal
          const newSantri = {
            id: addData.data.id,
            santriId: addData.data.santri_id,
            name: addData.data.full_name,
            grade: addData.data.grade,
            status: addData.data.status,
            addedAt: new Date().toLocaleDateString('id-ID'),
          }

          this.santriList.push(newSantri)
          this.newSantriId = ''
          this.idError = ''

          this.showMessage(`Santri ${newSantri.name} berhasil ditambahkan!`, 'success')
        } else {
          this.showMessage(addData.message || 'Gagal menambahkan santri', 'error')
        }
      } catch (error) {
        console.error('Add santri error:', error)
        this.showMessage('Terjadi kesalahan. Silakan coba lagi.', 'error')
      } finally {
        this.isLoading = false
      }
    },

    async removeSantri(santriId) {
      const santri = this.santriList.find((s) => s.id === santriId)
      if (santri && confirm(`Apakah Anda yakin ingin menghapus ${santri.name}?`)) {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}')

          if (!user.id) {
            this.showMessage('Sesi login tidak valid. Silakan login ulang.', 'error')
            return
          }

          const response = await fetch(
            'http://localhost/ei-school/backend/api/santri.php?action=remove',
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                parent_id: user.id,
                santri_id: santriId,
              }),
            },
          )

          const data = await response.json()

          if (data.success) {
            this.santriList = this.santriList.filter((s) => s.id !== santriId)
            this.showMessage(`${santri.name} berhasil dihapus`, 'success')
          } else {
            this.showMessage(data.message || 'Gagal menghapus santri', 'error')
          }
        } catch (error) {
          console.error('Remove santri error:', error)
          this.showMessage('Terjadi kesalahan. Silakan coba lagi.', 'error')
        }
      }
    },

    viewSantri(santri) {
      // Simulate navigation to detail page
      this.showMessage(`Membuka detail ${santri.name}...`, 'success')
      console.log('View santri:', santri)
    },

    showMessage(text, type) {
      this.message = text
      this.messageType = type
      this.messageClass = type === 'success' ? 'alert-success' : 'alert-error'

      // Auto hide message after 3 seconds
      setTimeout(() => {
        this.message = ''
      }, 3000)
    },
  },
}
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f5f6fa;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.content-wrapper {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
}

/* Section Cards */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: #17a2b8;
}

.card-description {
  color: #6c757d;
  margin: 0;
  font-size: 0.95rem;
}

/* Form Styles */
.santri-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.form-control {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.form-control:focus {
  outline: none;
  border-color: #17a2b8;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.1);
}

.form-control.is-invalid {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.help-icon {
  width: 16px;
  height: 16px;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.btn-primary {
  background-color: #17a2b8;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #138496;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Badge */
.badge {
  background-color: #17a2b8;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #dee2e6;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #495057;
}

.empty-description {
  font-size: 0.95rem;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
}

/* Santri Grid */
.santri-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.santri-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.santri-card:hover {
  border-color: #17a2b8;
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.1);
  transform: translateY(-2px);
}

.santri-avatar {
  width: 60px;
  height: 60px;
  background: #17a2b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.avatar-icon {
  width: 30px;
  height: 30px;
  color: white;
}

.santri-info {
  margin-bottom: 1.5rem;
}

.santri-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.santri-id {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-family: 'Courier New', monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.santri-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #17a2b8;
}

.santri-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background-color: #17a2b8;
  color: white;
}

.action-btn.primary:hover {
  background-color: #138496;
}

.action-btn.danger {
  background-color: #dc3545;
  color: white;
}

.action-btn.danger:hover {
  background-color: #c82333;
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* Alert Messages */
.alert-message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message-icon {
  width: 20px;
  height: 20px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .santri-page {
    padding: 0 0.5rem;
  }

  .section-card {
    padding: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .santri-grid {
    grid-template-columns: 1fr;
  }

  .santri-actions {
    flex-direction: column;
  }

  .alert-message {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
</style>
