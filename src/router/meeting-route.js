// router/meeting-routes.js
// Routes that match MeetingController endpoints and the existing views.
//
// Controller endpoints covered:
//   POST /api/meetings/create
//   POST /api/meetings/start/:code
//   POST /api/meetings/join              (auth)
//   POST /api/meetings/join/guest        (public)
//   POST /api/meetings/end/:code
//   GET  /api/meetings/validate/:code    (public)
//   GET  /api/meetings/my-meetings
//   POST /api/meetings/daily-token       (auth)
//   POST /api/meetings/daily-token/guest (public)

export const meetingRoutes = [

  // ── Redirect /meetings → /meetings/join ────────────────────
  {
    path: '/meetings',
    name: 'Meetings',
    redirect: '/meetings/join',
    meta: { requiresAuth: false },
  },

  // ── Join by entering a code ─────────────────────────────────
  // Calls POST /api/meetings/join OR /api/meetings/join/guest
  // depending on auth state — logic lives in JoinMeeting.vue
  {
    path: '/meetings/join',
    name: 'JoinMeeting',
    component: () => import('@/views/meetings/JoinMeeting.vue'),
    meta: { requiresAuth: false },
  },

  // ── Create a new meeting ────────────────────────────────────
  // Calls POST /api/meetings/create  (requires JWT)
  // Redirects to /meeting?create=true so Meeting.vue renders
  // the create form instead of trying to join.
  {
    path: '/meetings/create',
    name: 'CreateMeeting',
    component: () => import('@/views/meetings/Meeting.vue'),
    meta: { requiresAuth: true },
    beforeEnter(to, from, next) {
      // Pass ?create=true so Meeting.vue knows to show the form
      if (!to.query.create) {
        next({ path: '/meetings/create', query: { create: 'true' } });
      } else {
        next();
      }
    },
  },

  // ── Host / participant meeting room ─────────────────────────
  // :code is the meetingCode from the DB.
  // Meeting.vue resolves the Daily room by calling:
  //   POST /api/meetings/daily-token       (auth users)
  //   POST /api/meetings/daily-token/guest (guests)
  // Both endpoints return { token, roomUrl, roomName, isOwner }.
  {
    path: '/meetings/:code',
    name: 'Meeting',
    component: () => import('@/views/meetings/Meeting.vue'),
    meta: { requiresAuth: false },
    props: true,
  },

  // ── Authenticated user's meeting dashboard ──────────────────
  // Calls GET /api/meetings/my-meetings
  // Shows stats, active meetings, end/restart controls.
  {
    path: '/meeting-dashboard',
    name: 'MeetingsDashboard',
    component: () => import('@/views/meetings/MeetingsDashboard.vue'),
    meta: { requiresAuth: true },
  },

  // ── Alias: /meeting (no code) ───────────────────────────────
  // Used by MeetingsDashboard and JoinMeeting when they push to
  // '/meeting' after storing the code in sessionStorage.
  // Meeting.vue will read the code from MeetingSession.getMeetingCode().
  {
    path: '/meeting',
    name: 'MeetingRoot',
    component: () => import('@/views/meetings/Meeting.vue'),
    meta: { requiresAuth: false },
  },

  // ── Alias: /join-meeting (used by MeetingsDashboard) ───────
  {
    path: '/join-meeting',
    name: 'JoinMeetingAlias',
    redirect: '/meetings/join',
    meta: { requiresAuth: false },
  },
];

// ─────────────────────────────────────────────────────────────
//  HOW TO INTEGRATE INTO YOUR EXISTING router/index.js
// ─────────────────────────────────────────────────────────────
//
//  import { createRouter, createWebHistory } from 'vue-router';
//  import { meetingRoutes } from './meeting-routes';
//  import { TokenService } from '@/utils/apiService';
//
//  const routes = [
//    // ... your existing routes
//    ...meetingRoutes,
//  ];
//
//  const router = createRouter({
//    history: createWebHistory(),
//    routes,
//  });
//
//  // Guard — redirect unauthenticated users away from requiresAuth routes
//  router.beforeEach((to, from, next) => {
//    if (to.meta.requiresAuth && !TokenService.isAuthenticated()) {
//      next({ path: '/auth', query: { redirect: to.fullPath } });
//    } else {
//      next();
//    }
//  });
//
//  export default router;