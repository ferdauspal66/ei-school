<template>
  <div class="dashboard">
    <Sidebar />
    <div class="main-content">
      <TopBar />
      <div class="content-wrapper">
        <div class="keuangan">
          <!-- Header Section -->
          <div class="page-header">
            <h1 class="page-title">Keuangan Santri</h1>
            <p class="page-subtitle">Kelola data pembayaran dan saldo santri</p>
          </div>

          <!-- Filter Section -->
          <div class="filter-section">
            <div class="section-card">
              <div class="card-header">
                <h2 class="card-title">
                  <Filter class="title-icon" />
                  Filter Data
                </h2>
              </div>

              <div class="filter-controls">
                <div class="filter-group">
                  <label class="form-label">Pilih Santri</label>
                  <select v-model="selectedSantriId" class="form-select" @change="loadKeuanganData">
                    <option value="">-- Pilih Santri --</option>
                    <option v-for="santri in santriList" :key="santri.id" :value="santri.santriId">
                      {{ santri.name }} ({{ santri.santriId }})
                    </option>
                  </select>
                </div>

                <div class="filter-group">
                  <button
                    class="btn btn-primary"
                    @click="loadKeuanganData"
                    :disabled="!selectedSantriId || isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <RefreshCw class="btn-icon" />
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Keuangan Section -->
          <div v-if="selectedSantriId && keuanganData" class="keuangan-data-section">
            <div class="section-card">
              <div class="card-header">
                <h2 class="card-title">
                  <Wallet class="title-icon" />
                  Data Keuangan
                  <span class="badge">{{ keuanganData.nama_santri }}</span>
                </h2>
              </div>

              <!-- Summary Cards -->
              <div class="summary-cards">
                <div class="summary-card spp">
                  <div class="card-icon">
                    <CreditCard class="icon" />
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">SPP</h3>
                    <p class="card-amount">Rp {{ formatCurrency(keuanganData.spp) }}</p>
                  </div>
                </div>

                <div class="summary-card saldo">
                  <div class="card-icon">
                    <DollarSign class="icon" />
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Saldo</h3>
                    <p class="card-amount" :class="{ negative: keuanganData.saldo < 0 }">
                      Rp {{ formatCurrency(keuanganData.saldo) }}
                    </p>
                  </div>
                </div>

                <div class="summary-card laundry">
                  <div class="card-icon">
                    <Shirt class="icon" />
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Laundry</h3>
                    <p class="card-amount">Rp {{ formatCurrency(keuanganData.laundry) }}</p>
                  </div>
                </div>

                <div class="summary-card lainnya">
                  <div class="card-icon">
                    <MoreHorizontal class="icon" />
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Lainnya</h3>
                    <p class="card-amount">Rp {{ formatCurrency(keuanganData.lainnya) }}</p>
                  </div>
                </div>
              </div>

              <!-- Detail Information -->
              <div class="detail-section">
                <h3 class="detail-title">Informasi Detail</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">ID Santri:</span>
                    <span class="detail-value">{{ keuanganData.id_santri }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Nama Santri:</span>
                    <span class="detail-value">{{ keuanganData.nama_santri }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Total Tagihan:</span>
                    <span class="detail-value total">Rp {{ formatCurrency(totalTagihan) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Status Pembayaran:</span>
                    <span class="detail-value" :class="statusClass">
                      {{ statusPembayaran }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="selectedSantriId && !keuanganData" class="empty-state">
            <div class="section-card">
              <div class="empty-content">
                <FileX class="empty-icon" />
                <h3 class="empty-title">Data Tidak Ditemukan</h3>
                <p class="empty-description">
                  Data keuangan untuk santri ini belum tersedia di Google Sheets
                </p>
              </div>
            </div>
          </div>

          <!-- No Selection State -->
          <div v-else class="no-selection-state">
            <div class="section-card">
              <div class="empty-content">
                <Wallet class="empty-icon" />
                <h3 class="empty-title">Pilih Santri</h3>
                <p class="empty-description">
                  Pilih santri dari dropdown di atas untuk melihat data keuangan
                </p>
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
import {
  Filter,
  RefreshCw,
  Wallet,
  CreditCard,
  DollarSign,
  Shirt,
  MoreHorizontal,
  FileX,
  CheckCircle,
  AlertCircle,
} from 'lucide-vue-next'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

export default {
  name: 'Keuangan',
  components: {
    Filter,
    RefreshCw,
    Wallet,
    CreditCard,
    DollarSign,
    Shirt,
    MoreHorizontal,
    FileX,
    CheckCircle,
    AlertCircle,
    Sidebar,
    TopBar,
  },
  data() {
    return {
      selectedSantriId: '',
      santriList: [],
      keuanganData: null,
      isLoading: false,
      message: '',
      messageType: '',
      messageClass: '',
    }
  },
  computed: {
    totalTagihan() {
      if (!this.keuanganData) return 0
      return this.keuanganData.spp + this.keuanganData.laundry + this.keuanganData.lainnya
    },
    statusPembayaran() {
      if (!this.keuanganData) return ''
      if (this.keuanganData.saldo >= 0) return 'Lunas'
      return 'Belum Lunas'
    },
    statusClass() {
      if (!this.keuanganData) return ''
      if (this.keuanganData.saldo >= 0) return 'status-lunas'
      return 'status-belum-lunas'
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
          }))
        }
      } catch (error) {
        console.error('Load santri error:', error)
        this.showMessage('Gagal memuat data santri', 'error')
      }
    },

    async loadKeuanganData() {
      if (!this.selectedSantriId) return

      this.isLoading = true
      this.message = ''

      try {
        const response = await fetch(
          'http://localhost/ei-school/backend/api/keuangan.php?action=get-data',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              santri_id: this.selectedSantriId,
            }),
          },
        )

        const data = await response.json()

        if (data.success) {
          this.keuanganData = data.data
          this.showMessage('Data keuangan berhasil dimuat', 'success')
        } else {
          this.keuanganData = null
          this.showMessage(data.message || 'Data keuangan tidak ditemukan', 'error')
        }
      } catch (error) {
        console.error('Load keuangan error:', error)
        this.showMessage('Terjadi kesalahan saat memuat data', 'error')
        this.keuanganData = null
      } finally {
        this.isLoading = false
      }
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID').format(amount)
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

/* Filter Section */
.filter-controls {
  display: flex;
  gap: 2rem;
  align-items: end;
}

.filter-group {
  flex: 1;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.form-select:focus {
  outline: none;
  border-color: #17a2b8;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.1);
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

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.summary-card:hover {
  border-color: #17a2b8;
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.1);
  transform: translateY(-2px);
}

.summary-card.spp {
  border-left: 4px solid #28a745;
}

.summary-card.saldo {
  border-left: 4px solid #007bff;
}

.summary-card.laundry {
  border-left: 4px solid #ffc107;
}

.summary-card.lainnya {
  border-left: 4px solid #6f42c1;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-card.spp .card-icon {
  background-color: #d4edda;
  color: #28a745;
}

.summary-card.saldo .card-icon {
  background-color: #cce7ff;
  color: #007bff;
}

.summary-card.laundry .card-icon {
  background-color: #fff3cd;
  color: #ffc107;
}

.summary-card.lainnya .card-icon {
  background-color: #e2d9f3;
  color: #6f42c1;
}

.card-icon .icon {
  width: 24px;
  height: 24px;
}

.card-content {
  flex: 1;
}

.card-content .card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
}

.card-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.card-amount.negative {
  color: #dc3545;
}

/* Detail Section */
.detail-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #dee2e6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #495057;
}

.detail-value {
  color: #2c3e50;
  font-weight: 500;
}

.detail-value.total {
  font-weight: 700;
  color: #17a2b8;
}

.detail-value.status-lunas {
  color: #28a745;
  font-weight: 600;
}

.detail-value.status-belum-lunas {
  color: #dc3545;
  font-weight: 600;
}

/* Empty States */
.empty-state,
.no-selection-state {
  text-align: center;
}

.empty-content {
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
  .keuangan-page {
    padding: 0 0.5rem;
  }

  .section-card {
    padding: 1.5rem;
  }

  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .alert-message {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
</style>
