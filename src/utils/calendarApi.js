// utils/calendarApi.js
// API service for calendar-related data (projects and tasks)

import { apiRequest } from './apiService';

export const CalendarAPI = {
  /**
   * Get all events (projects + tasks) for calendar display
   */
  async getAllEvents() {
    try {
      // Fetch both projects and tasks in parallel
      const [projectsResponse, tasksResponse] = await Promise.all([
        apiRequest('/projects?includeDocuments=false', { method: 'GET' }),
        apiRequest('/tasks/user/all', { method: 'GET' })
      ]);

      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      if (!tasksResponse.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const projectsData = await projectsResponse.json();
      const tasksData = await tasksResponse.json();

      // Transform projects into calendar events
      const projectEvents = (projectsData.projects || []).map(project => ({
        id: `project-${project.id}`,
        type: 'project',
        title: project.name,
        description: project.description,
        dueDate: project.endDate,
        startDate: project.startDate,
        status: project.status,
        color: getProjectColor(project.status),
        originalData: project
      }));

      // Transform tasks into calendar events
      const taskEvents = (tasksData || []).map(task => ({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        color: getTaskColor(task.priority),
        originalData: task
      }));

      return [...projectEvents, ...taskEvents];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  /**
   * Get events for a specific month
   */
  async getEventsForMonth(year, month) {
    try {
      const allEvents = await this.getAllEvents();
      
      // Filter events that fall within the month
      return allEvents.filter(event => {
        if (!event.dueDate) return false;
        
        const eventDate = new Date(event.dueDate);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
      });
    } catch (error) {
      console.error('Error fetching events for month:', error);
      throw error;
    }
  },

  /**
   * Get upcoming events (next 7 days)
   */
  async getUpcomingEvents() {
    try {
      const allEvents = await this.getAllEvents();
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      return allEvents
        .filter(event => {
          if (!event.dueDate) return false;
          const eventDate = new Date(event.dueDate);
          return eventDate >= today && eventDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },

  /**
   * Get events for a specific date
   */
  async getEventsForDate(date) {
    try {
      const allEvents = await this.getAllEvents();
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      return allEvents.filter(event => {
        if (!event.dueDate) return false;
        const eventDate = new Date(event.dueDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === targetDate.getTime();
      });
    } catch (error) {
      console.error('Error fetching events for date:', error);
      throw error;
    }
  }
};

// Helper functions
function getProjectColor(status) {
  const colorMap = {
    'PLANNING': '#f59e0b',    // orange
    'ACTIVE': '#10b981',       // green
    'IN_PROGRESS': '#3b82f6',  // blue
    'COMPLETED': '#8b5cf6',    // purple
    'ARCHIVED': '#6b7280'      // gray
  };
  return colorMap[status] || '#10b981';
}

function getTaskColor(priority) {
  const colorMap = {
    'HIGH': '#ef4444',     // red
    'MEDIUM': '#f59e0b',   // orange
    'LOW': '#06b6d4'       // cyan
  };
  return colorMap[priority] || '#f59e0b';
}

export default CalendarAPI;