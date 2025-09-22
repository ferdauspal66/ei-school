<template>
  <div class="dashboard">
    <!-- Tambahkan Sidebar dan TopBar -->
    <Sidebar />
    <div class="main-content">
      <TopBar />
      <div class="content-wrapper">
        <!-- Banner Section -->
        <div class="banner-section">
          <div class="banner-content">
            <div class="banner-logo">
              <img src="../assets/logo.png" alt="Logo" class="banner-logo-img" />
            </div>
            <div class="banner-text">
              <h1 class="banner-title">Ma'had El School</h1>
              <p class="banner-subtitle">Modern Islamic School With Latest Tech</p>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="dashboard-grid">
          <!-- Layanan Siswa Section -->
          <div class="dashboard-section">
            <h2 class="section-title">Layanan Siswa</h2>
            <div class="services-grid">
              <div
                v-for="service in services"
                :key="service.id"
                class="service-card"
                @click="navigateToService(service.route)"
              >
                <div class="service-icon">
                  <component 
                    :is="service.icon" 
                    v-if="$options.components[service.icon]"
                    size="24"
                  />
                </div>
                <span class="service-name">{{ service.name }}</span>
              </div>
            </div>
          </div>

          <!-- Pengumuman Section -->
          <div class="dashboard-section">
            <h2 class="section-title">Pengumuman</h2>
            <div class="announcements-list">
              <div
                v-for="announcement in announcements"
                :key="announcement.id"
                class="announcement-card"
              >
                <div class="announcement-content">
                  <h3 class="announcement-title">{{ announcement.title }}</h3>
                  <p class="announcement-description">{{ announcement.description }}</p>
                  <div class="announcement-meta">
                    <div class="announcement-time">
                      <Calendar class="time-icon" />
                      <span>{{ announcement.time }}</span>
                    </div>
                    <div class="announcement-actions">
                      <button class="action-btn">
                        <Share class="action-icon" />
                        <span>Bagikan</span>
                      </button>
                      <button class="action-btn">
                        <ArrowRight class="action-icon" />
                        <span>Baca Selengkapnya</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">
                <ChevronRight class="page-icon" />
              </button>
            </div>
          </div>

          <!-- Kalender Kegiatan Section -->
          <div class="dashboard-section">
            <h2 class="section-title">Kalender Kegiatan</h2>
            <div class="calendar-container">
              <div class="calendar-header">
                <h3 class="calendar-month">Januari 2025</h3>
                <span class="calendar-date">25 Januari 2025</span>
              </div>

              <div class="calendar-grid">
                <div class="calendar-weekdays">
                  <div class="weekday">MON</div>
                  <div class="weekday">TUE</div>
                  <div class="weekday">WED</div>
                  <div class="weekday">THUR</div>
                  <div class="weekday">FRI</div>
                  <div class="weekday">SAT</div>
                  <div class="weekday">SUN</div>
                </div>

                <div class="calendar-days">
                  <div
                    v-for="day in calendarDays"
                    :key="day.date"
                    class="calendar-day"
                    :class="{
                      'other-month': day.otherMonth,
                      'has-events': day.events.length > 0,
                    }"
                  >
                    <span class="day-number">{{ day.date }}</span>
                    <div v-if="day.events.length > 0" class="day-events">
                      <div v-for="event in day.events" :key="event" class="event-item">
                        {{ event }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  FileText,
  Trophy,
  Wallet,
  BookOpen,
  Calendar,
  Heart,
  Shirt,
  Package,
  FileCheck,
  Share,
  ArrowRight,
  ChevronRight,
} from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    TopBar,
    FileText,
    Trophy,
    Wallet,
    BookOpen,
    Calendar,
    Heart,
    Shirt,
    Package,
    FileCheck,
    Share,
    ArrowRight,
    ChevronRight,
  },
  data() {
    return {
      services: [],
      announcements: [],
      calendarDays: [],
    }
  },

  methods: {
    async fetchServices() {
      try {
        const { data, error } = await supabase.from('services').select('*')

        if (error) throw error
        this.services = data
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    },

    async fetchAnnouncements() {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.announcements = data
      } catch (error) {
        console.error('Error fetching announcements:', error)
      }
    },

    async fetchCalendarEvents() {
      try {
        const { data, error } = await supabase.from('calendar_events').select('*')

        if (error) throw error
        // Transform data to match calendarDays format
        // Implementation needed based on your data structure
      } catch (error) {
        console.error('Error fetching calendar events:', error)
      }
    },

    navigateToService(route) {
      // Navigate to service page
      if (route === 'keuangan') {
        this.$emit('navigate', 'keuangan')
      } else {
        console.log('Navigate to:', route)
        // this.$router.push(route)
      }
    },
  },

  async mounted() {
    await Promise.all([this.fetchServices(), this.fetchAnnouncements(), this.fetchCalendarEvents()])
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

/* Banner Section */
.banner-section {
  background: linear-gradient(135deg, #17a2b8, #138496);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.banner-logo-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.banner-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.service-card:hover {
  background: #e3f2fd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: #17a2b8;
}

.service-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #495057;
}

/* Announcements */
.announcements-list {
  margin-bottom: 1.5rem;
}

.announcement-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s ease;
}

.announcement-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.announcement-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.announcement-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.announcement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.announcement-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.time-icon {
  width: 14px;
  height: 14px;
}

.announcement-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #17a2b8;
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-btn:hover {
  color: #138496;
}

.action-icon {
  width: 14px;
  height: 14px;
}

/* Pagination */
.pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  color: #495057;
}

.page-btn:hover {
  background: #f8f9fa;
}

.page-btn.active {
  background: #17a2b8;
  color: white;
  border-color: #17a2b8;
}

.page-icon {
  width: 16px;
  height: 16px;
}

/* Calendar */
.calendar-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-month {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.calendar-date {
  font-size: 0.9rem;
  color: #6c757d;
}

.calendar-grid {
  background: white;
  border-radius: 6px;
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #e9ecef;
}

.weekday {
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #495057;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 60px;
  padding: 0.5rem;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}

.calendar-day:last-child {
  border-right: none;
}

.day-number {
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
}

.calendar-day.other-month .day-number {
  color: #adb5bd;
}

.calendar-day.has-events {
  background: #e3f2fd;
}

.day-events {
  margin-top: 0.25rem;
}

.event-item {
  font-size: 0.7rem;
  color: #17a2b8;
  background: white;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  margin-bottom: 0.1rem;
  border: 1px solid #b3e5fc;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .banner-title {
    font-size: 2rem;
  }

  .announcement-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .announcement-actions {
    width: 100%;
    justify-content: space-between;
  }
}

/* Tambahkan style untuk TopBar */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

/* Tambahkan style untuk Sidebar */
.sidebar {
  width: 260px;
  height: 100vh;
  background: #1e293b;
  border-right: 1px solid #e9ecef;
}
</style>
