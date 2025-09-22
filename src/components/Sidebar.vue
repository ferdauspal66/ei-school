<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="../assets/sidemenu-logo.png" alt="Logo" class="logo-img" />
        <div v-if="!isCollapsed" class="logo-text">
          <h3 class="logo-title">Electronic Islamic</h3>
          <p class="logo-subtitle">School Information</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <!-- General Section -->
      <div class="nav-section">
        <h4 v-if="!isCollapsed" class="section-title">General</h4>
        <ul class="nav-list">
          <li class="nav-item">
            <a
              href="#"
              class="nav-link"
              :class="{ active: currentRoute === 'home' }"
              @click.prevent="navigateToHome"
            >
              <Home class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Home</span>
            </a>
          </li>
          <li class="nav-item">
            <router-link
              to="/santri"
              class="nav-link"
              :class="{ active: currentRoute === 'santri' }"
            >
              <User class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Santri Saya</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/account"
              class="nav-link"
              :class="{ active: currentRoute === 'account' }"
            >
              <Settings class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Account</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Layanan Section -->
      <div class="nav-section">
        <h4 v-if="!isCollapsed" class="section-title">Layanan</h4>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link
              to="/raport"
              class="nav-link"
              :class="{ active: currentRoute === 'raport' }"
            >
              <FileText class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Raport</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/prestasi"
              class="nav-link"
              :class="{ active: currentRoute === 'prestasi' }"
            >
              <Trophy class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Data Prestasi</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/keuangan"
              class="nav-link"
              :class="{ active: currentRoute === 'keuangan' }"
            >
              <Wallet class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Keuangan</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/halaqah"
              class="nav-link"
              :class="{ active: currentRoute === 'halaqah' }"
            >
              <BookOpen class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Halaqah</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/perizinan"
              class="nav-link"
              :class="{ active: currentRoute === 'perizinan' }"
            >
              <Calendar class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Perizinan Bulanan</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/kesehatan"
              class="nav-link"
              :class="{ active: currentRoute === 'kesehatan' }"
            >
              <Heart class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Layanan Kesehatan</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/laundry"
              class="nav-link"
              :class="{ active: currentRoute === 'laundry' }"
            >
              <Shirt class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Laundry</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/paket" class="nav-link" :class="{ active: currentRoute === 'paket' }">
              <Package class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Pengiriman Paket</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/legalisir"
              class="nav-link"
              :class="{ active: currentRoute === 'legalisir' }"
            >
              <FileCheck class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-text">Legalisir Dokumen</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script>
import {
  Home,
  User,
  Settings,
  FileText,
  Trophy,
  Wallet,
  BookOpen,
  Calendar,
  Heart,
  Shirt,
  Package,
  FileCheck,
} from 'lucide-vue-next'

export default {
  name: 'Sidebar',
  components: {
    Home,
    User,
    Settings,
    FileText,
    Trophy,
    Wallet,
    BookOpen,
    Calendar,
    Heart,
    Shirt,
    Package,
    FileCheck,
  },
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPath: '',
    }
  },
  computed: {
    currentRoute() {
      // Get current route name from path
      return this.$route.path.split('/')[1] || 'dashboard'
    },
  },
  watch: {
    // Watch for route changes
    $route(to) {
      this.currentPath = to.path
    },
  },
  mounted() {
    // Set initial path
    this.currentPath = this.$route.path
  },
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #34495e;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  flex: 1;
  min-width: 0;
}

.logo-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.8;
  line-height: 1.2;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 1rem;
  opacity: 0.7;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0 25px 25px 0;
  margin-right: 1rem;
}

.nav-link:hover {
  background-color: #34495e;
  color: white;
}

.nav-link.active {
  background-color: #3498db;
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

/* Collapsed state */
.sidebar.collapsed .nav-link {
  justify-content: center;
  margin-right: 0.5rem;
  border-radius: 8px;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.sidebar.collapsed .section-title {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
