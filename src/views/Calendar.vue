<!-- Calendar.vue -->
<!-- Professional Calendar with Projects and Tasks Integration -->
<template>
  <div class="calendar-wrapper">
    <!-- Top Navigation -->
    <nav class="calendar-topbar">
      <div class="calendar-topbar-inner">
        <div class="calendar-topbar-left">
          <div class="calendar-brand">
            <div class="calendar-brand-icon">
              <svg width="28" height="28" viewBox="0 0 42 42" fill="none">
                <rect width="42" height="42" rx="11" fill="#8b5cf6"/>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" stroke-width="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="calendar-brand-text">
              <span class="calendar-brand-name">NovaSpace</span>
              <span class="calendar-brand-plan">Calendar</span>
            </div>
          </div>
        </div>

        <div class="calendar-topbar-right">
          <button class="calendar-export-btn" @click="exportCalendar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Export
          </button>
          <button class="calendar-create-btn" @click="showCreateEventDialog = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Create Event
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside class="calendar-sidebar">
      <div class="calendar-nav-section">
        <div class="calendar-nav-label">NAVIGATION</div>
        <nav class="calendar-nav-list">
          <router-link to="/dashboard" class="calendar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/tasks" class="calendar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Tasks</span>
          </router-link>

          <router-link to="/projects" class="calendar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Projects</span>
          </router-link>

          <router-link to="/calendar" class="calendar-nav-item calendar-nav-item--active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Calendar</span>
          </router-link>
        </nav>
      </div>

      <!-- Current Date & Time Widget -->
      <div class="calendar-datetime-widget">
        <div class="calendar-datetime-time">{{ currentTime }}</div>
        <div class="calendar-datetime-date">{{ currentDateFormatted }}</div>
        <div class="calendar-datetime-day">{{ currentDayOfWeek }}</div>
      </div>

      <!-- Mini Calendar -->
      <div class="calendar-mini">
        <div class="calendar-mini-header">
          <button @click="goToPreviousMonth" class="calendar-mini-nav">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="calendar-mini-title">{{ miniMonthYear }}</span>
          <button @click="goToNextMonth" class="calendar-mini-nav">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="calendar-mini-grid">
          <div class="calendar-mini-day-label" v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day">
            {{ day }}
          </div>
          <button
            v-for="date in miniCalendarDates"
            :key="date.key"
            :class="[
              'calendar-mini-date',
              date.isToday ? 'calendar-mini-date--today' : '',
              date.isSelected ? 'calendar-mini-date--selected' : '',
              date.isOtherMonth ? 'calendar-mini-date--other' : '',
              date.hasEvents ? 'calendar-mini-date--has-events' : ''
            ]"
            @click="selectDate(date.date)"
          >
            {{ date.day }}
          </button>
        </div>
      </div>

      <!-- Event Legend -->
      <div class="calendar-legend">
        <div class="calendar-legend-title">Event Types</div>
        <div class="calendar-legend-item">
          <span class="calendar-legend-dot calendar-legend-dot--project"></span>
          <span>Projects</span>
        </div>
        <div class="calendar-legend-item">
          <span class="calendar-legend-dot calendar-legend-dot--task"></span>
          <span>Tasks</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="calendar-main">
      <!-- Page Header -->
      <header class="calendar-page-header">
        <div>
          <h1 class="calendar-page-title">Calendar</h1>
          <p class="calendar-page-subtitle">Manage your schedule and events</p>
        </div>
      </header>

      <!-- Calendar Controls -->
      <div class="calendar-controls">
        <div class="calendar-month-nav">
          <button @click="goToPreviousMonth" class="calendar-month-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <h2 class="calendar-month-title">{{ currentMonthYear }}</h2>
          <button @click="goToNextMonth" class="calendar-month-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="calendar-view-tabs">
          <button 
            :class="['calendar-view-tab', viewMode === 'month' ? 'calendar-view-tab--active' : '']"
            @click="viewMode = 'month'"
          >
            Month
          </button>
          <button 
            :class="['calendar-view-tab', viewMode === 'week' ? 'calendar-view-tab--active' : '']"
            @click="viewMode = 'week'"
          >
            Week
          </button>
          <button 
            :class="['calendar-view-tab', viewMode === 'day' ? 'calendar-view-tab--active' : '']"
            @click="viewMode = 'day'"
          >
            Day
          </button>
        </div>

        <button @click="goToToday" class="calendar-today-btn">Today</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="calendar-state-loading">
        <div class="calendar-spinner"></div>
        <p>Loading calendar events...</p>
      </div>

      <!-- Calendar Grid -->
      <div v-else class="calendar-grid">
        <!-- Day Headers -->
        <div class="calendar-day-headers">
          <div class="calendar-day-header" v-for="day in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="day">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="calendar-days">
          <div
            v-for="date in calendarDates"
            :key="date.key"
            :class="[
              'calendar-day',
              date.isToday ? 'calendar-day--today' : '',
              date.isOtherMonth ? 'calendar-day--other' : '',
              date.isWeekend ? 'calendar-day--weekend' : ''
            ]"
            @click="selectDate(date.date)"
          >
            <div class="calendar-day-number">{{ date.day }}</div>
            
            <!-- Events for this day -->
            <div class="calendar-day-events">
              <div
                v-for="event in date.events.slice(0, 3)"
                :key="event.id"
                :class="['calendar-event', `calendar-event--${event.type}`]"
                :style="{ borderLeftColor: event.color }"
                @click.stop="viewEvent(event)"
              >
                <span class="calendar-event-title">{{ event.title }}</span>
              </div>
              <button
                v-if="date.events.length > 3"
                class="calendar-more-events"
                @click.stop="showMoreEvents(date)"
              >
                +{{ date.events.length - 3 }} more
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar - Upcoming Events -->
    <aside class="calendar-upcoming">
      <h3 class="calendar-upcoming-title">Upcoming Reminders</h3>
      <p class="calendar-upcoming-subtitle">Next 7 days</p>

      <div v-if="loadingUpcoming" class="calendar-upcoming-loading">
        <div class="calendar-spinner-sm"></div>
      </div>

      <div v-else-if="upcomingEvents.length === 0" class="calendar-upcoming-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>No upcoming events</p>
      </div>

      <div v-else class="calendar-upcoming-list">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          :class="['calendar-upcoming-item', `calendar-upcoming-item--${event.type}`]"
          @click="viewEvent(event)"
        >
          <div class="calendar-upcoming-date">
            <span class="calendar-upcoming-date-badge" :style="{ background: event.color }">
              {{ formatUpcomingDate(event.dueDate) }}
            </span>
            <span class="calendar-upcoming-time">{{ formatTime(event.dueDate) }}</span>
          </div>
          <div class="calendar-upcoming-content">
            <h4 class="calendar-upcoming-event-title">{{ event.title }}</h4>
            <p class="calendar-upcoming-event-desc">{{ event.description || 'No description' }}</p>
          </div>
        </div>
      </div>

      <!-- Event Count -->
      <div class="calendar-event-count">
        <div class="calendar-event-count-badge">
          {{ monthEventCount }}
        </div>
        <span>Events This Month</span>
      </div>

      <button class="calendar-add-reminder-btn" @click="showCreateEventDialog = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add Reminder
      </button>
    </aside>

    <!-- Toast Notification -->
    <transition name="calendar-toast">
      <div v-if="toast.show" class="calendar-toast" :class="'calendar-toast--' + toast.type">
        <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { TokenService } from '@/utils/apiService';
import CalendarAPI from '@/utils/calendarApi';

export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(),
      selectedDate: new Date(),
      viewMode: 'month',
      loading: true,
      loadingUpcoming: true,
      events: [],
      upcomingEvents: [],
      showCreateEventDialog: false,
      // Real-time clock data
      currentTime: '',
      currentDateFormatted: '',
      currentDayOfWeek: '',
      clockInterval: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  computed: {
    isAuthenticated() {
      return TokenService.isAuthenticated();
    },
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },
    miniMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    },
    calendarDates() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const startingDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const dates = [];
      
      // Previous month days
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = new Date(year, month - 1, day);
        dates.push({
          day,
          date,
          key: `prev-${day}`,
          isOtherMonth: true,
          isToday: this.isToday(date),
          isWeekend: this.isWeekend(date),
          events: this.getEventsForDate(date)
        });
      }
      
      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push({
          day,
          date,
          key: `current-${day}`,
          isOtherMonth: false,
          isToday: this.isToday(date),
          isWeekend: this.isWeekend(date),
          events: this.getEventsForDate(date)
        });
      }
      
      // Next month days
      const remainingDays = 42 - dates.length;
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        dates.push({
          day,
          date,
          key: `next-${day}`,
          isOtherMonth: true,
          isToday: this.isToday(date),
          isWeekend: this.isWeekend(date),
          events: this.getEventsForDate(date)
        });
      }
      
      return dates;
    },
    miniCalendarDates() {
      return this.calendarDates.map(date => ({
        ...date,
        isSelected: this.isSameDay(date.date, this.selectedDate),
        hasEvents: date.events.length > 0
      }));
    },
    monthEventCount() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      return this.events.filter(event => {
        if (!event.dueDate) return false;
        const eventDate = new Date(event.dueDate);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
      }).length;
    }
  },
  methods: {
    // Real-time clock methods
    updateClock() {
      const now = new Date();
      
      // Update time (HH:MM:SS AM/PM format)
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      // Update date (Month Day, Year format)
      this.currentDateFormatted = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      // Update day of week
      this.currentDayOfWeek = now.toLocaleDateString('en-US', {
        weekday: 'long'
      });
    },

    startClock() {
      this.updateClock(); // Initial update
      this.clockInterval = setInterval(this.updateClock, 1000); // Update every second
    },

    stopClock() {
      if (this.clockInterval) {
        clearInterval(this.clockInterval);
        this.clockInterval = null;
      }
    },

    // Calendar data methods
    async loadEvents() {
      try {
        this.loading = true;
        this.events = await CalendarAPI.getAllEvents();
      } catch (error) {
        console.error('Error loading events:', error);
        this.showToast('Failed to load calendar events', 'error');
        this.events = [];
      } finally {
        this.loading = false;
      }
    },
    
    async loadUpcomingEvents() {
      try {
        this.loadingUpcoming = true;
        this.upcomingEvents = await CalendarAPI.getUpcomingEvents();
      } catch (error) {
        console.error('Error loading upcoming events:', error);
        this.upcomingEvents = [];
      } finally {
        this.loadingUpcoming = false;
      }
    },
    
    getEventsForDate(date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      return this.events.filter(event => {
        if (!event.dueDate) return false;
        const eventDate = new Date(event.dueDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === targetDate.getTime();
      });
    },
    
    isToday(date) {
      const today = new Date();
      return this.isSameDay(date, today);
    },
    
    isSameDay(date1, date2) {
      return date1.getDate() === date2.getDate() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear();
    },
    
    isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
    
    goToPreviousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    },
    
    goToNextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    },
    
    goToToday() {
      this.currentDate = new Date();
      this.selectedDate = new Date();
    },
    
    selectDate(date) {
      this.selectedDate = date;
    },
    
    viewEvent(event) {
      if (event.type === 'project') {
        this.$router.push(`/projects/${event.originalData.id}`);
      } else if (event.type === 'task') {
        this.$router.push(`/tasks/${event.originalData.id}`);
      }
    },
    
    showMoreEvents(date) {
      this.selectDate(date.date);
    },
    
    formatUpcomingDate(dateString) {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (this.isSameDay(date, today)) return 'TODAY';
      if (this.isSameDay(date, tomorrow)) return 'TOMORROW';
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    },
    
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    },
    
    exportCalendar() {
      this.showToast('Export feature coming soon', 'info');
    },
    
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  },
  async mounted() {
    if (!this.isAuthenticated) {
      this.$router.push('/auth');
      return;
    }

    // Start the real-time clock
    this.startClock();

    // Load calendar data
    await Promise.all([
      this.loadEvents(),
      this.loadUpcomingEvents()
    ]);
  },
  beforeUnmount() {
    // Clean up clock interval to prevent memory leaks
    this.stopClock();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

.calendar-wrapper {
  --calendar-purple:    #8b5cf6;
  --calendar-purple-dk: #7c3aed;
  --calendar-purple-lt: #ede9fe;
  --calendar-blue:      #3b82f6;
  --calendar-blue-lt:   #dbeafe;
  --calendar-green:     #10b981;
  --calendar-green-lt:  #d1fae5;
  --calendar-orange:    #f59e0b;
  --calendar-orange-lt: #fef3c7;
  --calendar-red:       #ef4444;
  --calendar-red-lt:    #fee2e2;
  --calendar-ink:       #0d1b36;
  --calendar-ink-m:     #64748b;
  --calendar-white:     #ffffff;
  --calendar-border:    #e2ecf6;
  --calendar-bg:        #f8fafc;
  --calendar-bar-h:     64px;
  --calendar-sidebar-w: 260px;
  --calendar-right-w:   280px;
  --calendar-font:      'Manrope', sans-serif;
  --calendar-fdisp:     'Space Grotesk', sans-serif;
  --calendar-ease:      cubic-bezier(0.22,1,0.36,1);
  --calendar-shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --calendar-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --calendar-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  
  min-height: 100vh;
  background: var(--calendar-bg);
  font-family: var(--calendar-font);
  display: grid;
  grid-template-areas: "nav nav nav" "sidebar main upcoming";
  grid-template-rows: var(--calendar-bar-h) 1fr;
  grid-template-columns: var(--calendar-sidebar-w) 1fr var(--calendar-right-w);
}

.calendar-wrapper * { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
}

/* ========== TOP BAR ========== */
.calendar-topbar {
  grid-area: nav;
  background: var(--calendar-white);
  border-bottom: 1px solid var(--calendar-border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--calendar-bar-h);
}

.calendar-topbar-inner {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-topbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.calendar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-brand-icon { width: 36px; height: 36px; flex-shrink: 0; }

.calendar-brand-text { display: flex; flex-direction: column; }

.calendar-brand-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--calendar-ink);
  line-height: 1.2;
  font-family: var(--calendar-fdisp);
}

.calendar-brand-plan { 
  font-size: 11px; 
  font-weight: 600; 
  color: var(--calendar-ink-m); 
}

.calendar-topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-export-btn,
.calendar-create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--calendar-font);
  cursor: pointer;
  transition: all 0.3s var(--calendar-ease);
}

.calendar-export-btn {
  background: var(--calendar-white);
  border: 1px solid var(--calendar-border);
  color: var(--calendar-ink);
}

.calendar-export-btn:hover {
  background: var(--calendar-bg);
}

.calendar-create-btn {
  background: linear-gradient(135deg, var(--calendar-purple) 0%, var(--calendar-purple-dk) 100%);
  color: var(--calendar-white);
  border: none;
}

.calendar-create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);
}

/* ========== SIDEBAR ========== */
.calendar-sidebar {
  grid-area: sidebar;
  background: var(--calendar-white);
  border-right: 1px solid var(--calendar-border);
  padding: 24px 16px;
  overflow-y: auto;
  height: calc(100vh - var(--calendar-bar-h));
  position: sticky;
  top: var(--calendar-bar-h);
}

.calendar-nav-section { margin-bottom: 24px; }

.calendar-nav-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--calendar-ink-m);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 0 8px;
}

.calendar-nav-list { display: flex; flex-direction: column; gap: 4px; }

.calendar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--calendar-ink-m);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s var(--calendar-ease);
}

.calendar-nav-item:hover {
  background: var(--calendar-bg);
  color: var(--calendar-ink);
}

.calendar-nav-item--active {
  background: var(--calendar-purple-lt);
  color: var(--calendar-purple);
  font-weight: 600;
}

.calendar-nav-item svg { flex-shrink: 0; }

/* ========== DATE & TIME WIDGET ========== */
.calendar-datetime-widget {
  background: linear-gradient(135deg, var(--calendar-purple) 0%, var(--calendar-purple-dk) 100%);
  border-radius: 12px;
  padding: 18px 16px;
  margin-bottom: 24px;
  text-align: center;
  color: var(--calendar-white);
  box-shadow: var(--calendar-shadow-md);
}

.calendar-datetime-time {
  font-size: 26px;
  font-weight: 800;
  font-family: var(--calendar-fdisp);
  margin-bottom: 6px;
  letter-spacing: -0.5px;
  line-height: 1;
}

.calendar-datetime-date {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 3px;
}

.calendar-datetime-day {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ========== MINI CALENDAR ========== */
.calendar-mini {
  background: var(--calendar-bg);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.calendar-mini-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.calendar-mini-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--calendar-ink);
  font-family: var(--calendar-fdisp);
}

.calendar-mini-nav {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  border-radius: 6px;
  color: var(--calendar-ink-m);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s var(--calendar-ease);
}

.calendar-mini-nav:hover {
  background: var(--calendar-white);
  color: var(--calendar-ink);
}

.calendar-mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-mini-day-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--calendar-ink-m);
  text-align: center;
  padding: 4px 0;
}

.calendar-mini-date {
  aspect-ratio: 1;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--calendar-ink);
  cursor: pointer;
  transition: all 0.2s var(--calendar-ease);
  position: relative;
}

.calendar-mini-date:hover {
  background: var(--calendar-white);
}

.calendar-mini-date--other {
  color: var(--calendar-ink-m);
  opacity: 0.4;
}

.calendar-mini-date--today {
  background: var(--calendar-purple);
  color: var(--calendar-white);
  font-weight: 700;
}

.calendar-mini-date--selected {
  background: var(--calendar-purple-lt);
  color: var(--calendar-purple);
  font-weight: 700;
}

.calendar-mini-date--has-events::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--calendar-purple);
}

/* ========== LEGEND ========== */
.calendar-legend {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--calendar-border);
}

.calendar-legend-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--calendar-ink);
  margin-bottom: 12px;
}

.calendar-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  color: var(--calendar-ink-m);
}

.calendar-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.calendar-legend-dot--project { background: var(--calendar-green); }
.calendar-legend-dot--task { background: var(--calendar-orange); }

/* ========== MAIN CONTENT ========== */
.calendar-main {
  grid-area: main;
  padding: 32px;
  overflow-y: auto;
  max-height: calc(100vh - var(--calendar-bar-h));
}

.calendar-page-header { margin-bottom: 32px; }

.calendar-page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--calendar-ink);
  font-family: var(--calendar-fdisp);
  margin-bottom: 6px;
  line-height: 1.2;
}

.calendar-page-subtitle {
  font-size: 15px;
  color: var(--calendar-ink-m);
  font-weight: 500;
}

/* ========== CALENDAR CONTROLS ========== */
.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;
}

.calendar-month-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.calendar-month-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--calendar-border);
  background: var(--calendar-white);
  border-radius: 10px;
  color: var(--calendar-ink-m);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s var(--calendar-ease);
}

.calendar-month-btn:hover {
  background: var(--calendar-bg);
  color: var(--calendar-ink);
  border-color: var(--calendar-purple);
}

.calendar-month-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--calendar-ink);
  font-family: var(--calendar-fdisp);
  min-width: 200px;
  text-align: center;
}

.calendar-view-tabs {
  display: flex;
  gap: 4px;
  background: var(--calendar-bg);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--calendar-border);
}

.calendar-view-tab {
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--calendar-ink-m);
  cursor: pointer;
  font-family: var(--calendar-font);
  transition: all 0.2s var(--calendar-ease);
}

.calendar-view-tab:hover {
  color: var(--calendar-ink);
}

.calendar-view-tab--active {
  background: var(--calendar-white);
  color: var(--calendar-purple);
  box-shadow: var(--calendar-shadow-sm);
}

.calendar-today-btn {
  height: 40px;
  padding: 0 20px;
  background: var(--calendar-purple);
  color: var(--calendar-white);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--calendar-font);
  transition: all 0.3s var(--calendar-ease);
}

.calendar-today-btn:hover {
  background: var(--calendar-purple-dk);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);
}

/* ========== LOADING STATE ========== */
.calendar-state-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--calendar-white);
  border-radius: 16px;
  padding: 48px;
  border: 1px solid var(--calendar-border);
}

.calendar-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--calendar-border);
  border-top-color: var(--calendar-purple);
  border-radius: 50%;
  animation: calendar-spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes calendar-spin { to { transform: rotate(360deg); } }

.calendar-state-loading p {
  font-size: 16px;
  color: var(--calendar-ink-m);
  font-weight: 600;
}

/* ========== CALENDAR GRID ========== */
.calendar-grid {
  background: var(--calendar-white);
  border-radius: 16px;
  border: 1px solid var(--calendar-border);
  overflow: hidden;
}

.calendar-day-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--calendar-bg);
  border-bottom: 1px solid var(--calendar-border);
}

.calendar-day-header {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--calendar-ink-m);
  letter-spacing: 0.5px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(120px, 1fr);
}

.calendar-day {
  border-right: 1px solid var(--calendar-border);
  border-bottom: 1px solid var(--calendar-border);
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s var(--calendar-ease);
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: var(--calendar-bg);
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day--other {
  background: #fafbfc;
}

.calendar-day--other .calendar-day-number {
  color: var(--calendar-ink-m);
  opacity: 0.4;
}

.calendar-day--today {
  background: var(--calendar-purple-lt);
}

.calendar-day--today .calendar-day-number {
  background: var(--calendar-purple);
  color: var(--calendar-white);
}

.calendar-day--weekend {
  background: #fafbfc;
}

.calendar-day-number {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--calendar-ink);
  margin-bottom: 8px;
}

.calendar-day-events {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.calendar-event {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s var(--calendar-ease);
  border-left: 3px solid;
  background: var(--calendar-bg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-event:hover {
  transform: translateX(2px);
  box-shadow: var(--calendar-shadow-sm);
}

.calendar-event--project {
  background: var(--calendar-green-lt);
  color: #065f46;
}

.calendar-event--task {
  background: var(--calendar-orange-lt);
  color: #92400e;
}

.calendar-event-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-more-events {
  padding: 4px 8px;
  border: none;
  background: none;
  font-size: 11px;
  font-weight: 600;
  color: var(--calendar-purple);
  cursor: pointer;
  text-align: left;
  font-family: var(--calendar-font);
}

.calendar-more-events:hover {
  text-decoration: underline;
}

/* ========== RIGHT SIDEBAR - UPCOMING ========== */
.calendar-upcoming {
  grid-area: upcoming;
  background: var(--calendar-white);
  border-left: 1px solid var(--calendar-border);
  padding: 24px;
  overflow-y: auto;
  height: calc(100vh - var(--calendar-bar-h));
  position: sticky;
  top: var(--calendar-bar-h);
}

.calendar-upcoming-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--calendar-ink);
  font-family: var(--calendar-fdisp);
  margin-bottom: 4px;
}

.calendar-upcoming-subtitle {
  font-size: 13px;
  color: var(--calendar-ink-m);
  margin-bottom: 20px;
}

.calendar-upcoming-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.calendar-spinner-sm {
  width: 32px;
  height: 32px;
  border: 3px solid var(--calendar-border);
  border-top-color: var(--calendar-purple);
  border-radius: 50%;
  animation: calendar-spin 0.8s linear infinite;
}

.calendar-upcoming-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.calendar-upcoming-empty svg {
  color: var(--calendar-ink-m);
  opacity: 0.3;
  margin-bottom: 12px;
}

.calendar-upcoming-empty p {
  font-size: 14px;
  color: var(--calendar-ink-m);
}

.calendar-upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.calendar-upcoming-item {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--calendar-border);
  cursor: pointer;
  transition: all 0.2s var(--calendar-ease);
}

.calendar-upcoming-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--calendar-shadow-md);
  border-color: var(--calendar-purple);
}

.calendar-upcoming-item--project {
  background: var(--calendar-green-lt);
}

.calendar-upcoming-item--task {
  background: var(--calendar-orange-lt);
}

.calendar-upcoming-date {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.calendar-upcoming-date-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  color: var(--calendar-white);
  letter-spacing: 0.5px;
}

.calendar-upcoming-time {
  font-size: 12px;
  font-weight: 600;
  color: var(--calendar-ink-m);
}

.calendar-upcoming-event-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--calendar-ink);
  margin-bottom: 4px;
  font-family: var(--calendar-fdisp);
}

.calendar-upcoming-event-desc {
  font-size: 12px;
  color: var(--calendar-ink-m);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.calendar-event-count {
  background: var(--calendar-purple);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
}

.calendar-event-count-badge {
  width: 64px;
  height: 64px;
  background: var(--calendar-white);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  color: var(--calendar-purple);
  font-family: var(--calendar-fdisp);
  margin: 0 auto 12px;
}

.calendar-event-count span {
  font-size: 14px;
  font-weight: 600;
  color: var(--calendar-white);
}

.calendar-add-reminder-btn {
  width: 100%;
  height: 44px;
  background: var(--calendar-white);
  border: 2px dashed var(--calendar-border);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--calendar-purple);
  cursor: pointer;
  font-family: var(--calendar-font);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s var(--calendar-ease);
}

.calendar-add-reminder-btn:hover {
  background: var(--calendar-purple-lt);
  border-color: var(--calendar-purple);
}

/* ========== TOAST ========== */
.calendar-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--calendar-white);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(13, 27, 54, 0.16);
  font-size: 14px;
  font-weight: 600;
  z-index: 2000;
  border: 1px solid var(--calendar-border);
}

.calendar-toast--success { border-left: 4px solid var(--calendar-green); }
.calendar-toast--success svg { color: var(--calendar-green); }
.calendar-toast--error { border-left: 4px solid var(--calendar-red); }
.calendar-toast--error svg { color: var(--calendar-red); }

.calendar-toast-enter-active,
.calendar-toast-leave-active { transition: all 0.3s var(--calendar-ease); }

.calendar-toast-enter-from,
.calendar-toast-leave-to { opacity: 0; transform: translateY(20px); }

/* ========== RESPONSIVE ========== */
@media (max-width: 1400px) {
  .calendar-wrapper {
    grid-template-columns: var(--calendar-sidebar-w) 1fr;
    grid-template-areas: "nav nav" "sidebar main";
  }
  .calendar-upcoming { display: none; }
}

@media (max-width: 968px) {
  .calendar-wrapper {
    grid-template-areas: "nav" "main";
    grid-template-columns: 1fr;
  }
  .calendar-sidebar { display: none; }
  .calendar-main { padding: 24px 20px; }
  .calendar-controls { flex-direction: column; align-items: stretch; }
}

@media (max-width: 640px) {
  .calendar-wrapper { --calendar-bar-h: 56px; }
  .calendar-page-title { font-size: 22px; }
  .calendar-days { grid-auto-rows: minmax(80px, 1fr); }
  .calendar-day { min-height: 80px; padding: 4px; }
  .calendar-day-events { gap: 2px; }
  .calendar-event { font-size: 10px; padding: 2px 4px; }
}
</style>