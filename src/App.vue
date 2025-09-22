<template>
  <router-view></router-view>
</template>

<script>
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Layout from './components/Layout.vue'
import Dashboard from './pages/Dashboard.vue'
import SantriSaya from './pages/SantriSaya.vue'
import Keuangan from './pages/Keuangan.vue'

export default {
  name: 'App',
  components: {
    Login,
    Register,
    Layout,
    Dashboard,
    SantriSaya,
    Keuangan,
  },
  data() {
    return {
      currentPage: 'login', // 'login' or 'dashboard'
    }
  },
  methods: {
    handleLoginSuccess() {
      this.currentPage = 'dashboard'
    },
    handleNavigation(route) {
      this.currentPage = route
    },
    goToRegister() {
      this.currentPage = 'register'
    },
    goToLogin() {
      this.currentPage = 'login'
    },
  },
}
</script>

<style>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f6fa;
}

/* Layout consistency */
.page-container {
  display: flex;
  min-height: 100vh;
}
</style>
