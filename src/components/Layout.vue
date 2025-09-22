<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <Sidebar
      :is-collapsed="sidebarCollapsed"
      @toggle="toggleSidebar"
      :current-route="currentRoute"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Top Bar -->
      <TopBar @toggle-sidebar="toggleSidebar" :sidebar-collapsed="sidebarCollapsed" />

      <!-- Page Content -->
      <main class="page-content">
        <slot @navigate="handleNavigation"></slot>
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    TopBar,
  },
  data() {
    return {
      sidebarCollapsed: false,
      currentRoute: this.$route?.name || 'home',
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    handleNavigation(route) {
      this.currentRoute = route
      this.$emit('navigate', route)
    },
  },
  watch: {
    $route(to) {
      this.currentRoute = to.name
    },
  },
}
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .main-content.sidebar-collapsed {
    margin-left: 0;
  }

  .page-content {
    padding: 1rem;
  }
}
</style>
