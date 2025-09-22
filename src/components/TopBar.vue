<template>
  <div>
    <!-- Tambahkan overlay -->
    <div v-if="isShowingSidebar" class="sidebar-overlay" @click="closeSidebar"></div>

    <header class="topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle" @click="toggleSidebar" aria-label="Toggle Sidebar">
          <Menu class="toggle-icon" />
        </button>

        <div class="page-title">
          <h1>{{ pageTitle }}</h1>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Search Bar -->
        <div class="search-container">
          <Search class="search-icon" />
          <input type="text" placeholder="Search..." class="search-input" v-model="searchQuery" />
        </div>

        <!-- Notifications -->
        <button class="notification-btn" @click="toggleNotifications">
          <Bell class="notification-icon" />
          <span v-if="notificationCount > 0" class="notification-badge">
            {{ notificationCount }}
          </span>
        </button>

        <!-- User Profile -->
        <div class="user-profile" @click="toggleUserMenu">
          <img src="../assets/logo.png" alt="User Avatar" class="user-avatar" />
          <div class="user-info">
            <span class="user-name">Admin User</span>
            <span class="user-role">Administrator</span>
          </div>
          <ChevronDown class="dropdown-icon" />
        </div>
      </div>

      <!-- User Dropdown Menu -->
      <div v-if="showUserMenu" class="user-dropdown">
        <div class="dropdown-item" @click="goToProfile">
          <User class="dropdown-icon" />
          <span>Profile</span>
        </div>
        <div class="dropdown-item" @click="goToSettings">
          <Settings class="dropdown-icon" />
          <span>Settings</span>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" @click="logout">
          <LogOut class="dropdown-icon" />
          <span>Logout</span>
        </div>
      </div>
    </header>

    <!-- Mobile Sidebar -->
    <div class="mobile-sidebar" :class="{ 'mobile-sidebar-open': isShowingSidebar }">
      <!-- Ganti dengan render Sidebar component -->
      <div class="mobile-sidebar-header">
        <img src="../assets/logo.png" alt="Logo" class="mobile-logo" />
        <button class="close-sidebar" @click="closeSidebar">
          <X class="close-icon" />
        </button>
      </div>
      <!-- Import dan gunakan komponen Sidebar yang sudah ada -->
      <Sidebar />
    </div>
  </div>
</template>

<script>
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut, X } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'
import { supabase } from '@/lib/supabase' // Tambahkan import supabase

export default {
  name: 'TopBar',
  components: {
    Menu,
    Search,
    Bell,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Sidebar,
    X,
  },
  props: {
    sidebarCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      notificationCount: 3,
      showUserMenu: false,
      pageTitle: 'Home',
      isShowingSidebar: false,
    }
  },
  methods: {
    toggleNotifications() {
      // Handle notifications
      console.log('Toggle notifications')
    },

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },

    goToProfile() {
      this.showUserMenu = false
      // Navigate to profile
      console.log('Go to profile')
    },

    goToSettings() {
      this.showUserMenu = false
      // Navigate to settings
      console.log('Go to settings')
    },

    async logout() {
      try {
        this.showUserMenu = false
        const { error } = await supabase.auth.signOut()

        if (error) throw error

        // Hapus data user dari localStorage
        localStorage.removeItem('user')

        // Redirect ke halaman login
        this.$router.push('/login')
      } catch (error) {
        console.error('Error logging out:', error.message)
      }
    },
    toggleSidebar() {
      this.isShowingSidebar = !this.isShowingSidebar
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = this.isShowingSidebar ? 'hidden' : ''
    },
    closeSidebar() {
      this.isShowingSidebar = false
      document.body.style.overflow = ''
    },
  },

  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false
      }
    })
    // Close sidebar on route change
    this.$router.afterEach(() => {
      this.closeSidebar()
    })
  },
}
</script>

<style scoped>
.topbar {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-toggle:hover {
  background-color: #f8f9fa;
}

.toggle-icon {
  width: 20px;
  height: 20px;
  color: #495057;
}

.page-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  color: #6c757d;
  z-index: 1;
}

.search-input {
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 25px;
  background-color: #f8f9fa;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover {
  background-color: #f8f9fa;
}

.notification-icon {
  width: 20px;
  height: 20px;
  color: #495057;
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.3rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.user-profile:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.2;
}

.user-role {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.2;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #6c757d;
  transition: transform 0.2s ease;
}

.user-profile:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 1rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
  color: #495057;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item .dropdown-icon {
  width: 16px;
  height: 16px;
}

.dropdown-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 0.5rem 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .topbar {
    padding: 0 1rem;
  }

  .search-container {
    display: none;
  }

  .user-info {
    display: none;
  }

  .page-title h1 {
    font-size: 1.25rem;
  }
}

/* Mobile Sidebar Styles */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: -280px; /* width of sidebar */
  height: 100vh;
  width: 280px;
  background-color: white;
  z-index: 999;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex; /* Add this */
  flex-direction: column; /* Add this */
}

.mobile-sidebar-open {
  transform: translateX(280px);
}

/* Adjust mobile responsiveness */
@media (min-width: 769px) {
  .mobile-sidebar,
  .sidebar-overlay {
    display: none;
  }
}

/* Mobile Sidebar Additional Styles */
.mobile-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.mobile-logo {
  height: 40px;
}

.close-sidebar {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-sidebar:hover {
  background-color: #f8f9fa;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #495057;
}

.mobile-sidebar :deep(.sidebar) {
  position: relative; /* Override fixed position */
  width: 100%; /* Take full width */
  background-color: white; /* Override dark background */
}

/* Ensure sidebar content scrolls if needed */
.mobile-sidebar :deep(.sidebar) {
  overflow-y: auto;
  flex: 1;
}
</style>
