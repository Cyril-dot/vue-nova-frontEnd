// router/meeting-routes.js
// Meeting-related routes to integrate into your main router

export const meetingRoutes = [
  {
    path: '/meetings',
    name: 'Meetings',
    redirect: '/meetings/join',
    meta: { requiresAuth: false }
  },
  {
    path: '/meetings/join',
    name: 'JoinMeeting',
    component: () => import('@/views/meetings/JoinMeeting.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/meetings/create',
    name: 'CreateMeeting',
    component: () => import('@/views/meetings/CreateMeeting.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/meetings/:code',
    name: 'Meeting',
    component: () => import('@/views/meetings/Meeting.vue'),
    meta: { requiresAuth: false },
    props: true
  }
];

// Add this to your existing router/index.js:
/*
import { meetingRoutes } from './meeting-routes';

const routes = [
  // ... your existing routes
  ...meetingRoutes
];
*/