import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LoginSignUp from '../components/authPage/LoginSignUp.vue'
import { TokenService } from '../utils/apiService'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home | NovaSpace'
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: LoginSignUp,
    meta: { 
      guestOnly: true,
      title: 'Login | NovaSpace'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashBoard.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Dashboard | NovaSpace'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Project.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Projects | NovaSpace'
    }
  },
  {
    path: '/projects/create',
    name: 'CreateProject',
    component: () => import('../views/CreateProject.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Create Project | NovaSpace'
    }
  },
  {
    path: '/projects/:id/edit',
    name: 'EditProject',
    component: () => import('../views/CreateProject.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Edit Project | NovaSpace'
    }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('../views/ProjectDetail.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Project Details | NovaSpace'
    }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/Tasks.vue'),
    meta: {
      requiresAuth: true,
      title: 'Tasks | NovaSpace'
    }
  },
  {
    path: '/tasks/create',
    name: 'CreateTask',
    component: () => import('../views/CreateTask.vue'),
    meta: {
      requiresAuth: true,
      title: 'Create Task | NovaSpace'
    }
  },
  {
    path: '/tasks/:id/edit',
    name: 'EditTask',
    component: () => import('../views/TaskDetail.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Task | NovaSpace'
    }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetail.vue'),
    meta: {
      requiresAuth: true,
      title: 'Task Details | NovaSpace'
    }
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: () => import('../views/AIAssistant.vue'),
    meta: { requiresAuth: true, title: 'AI Assistant | NovaSpace' }
  },
  {
    path: '/notebooks',
    name: 'Notebooks',
    component: () => import('../views/Notebooks.vue'),
    meta: { requiresAuth: true, title: 'Notebooks | NovaSpace' }
  },
  {
    path: '/apps',
    name: 'Apps',
    component: () => import('../views/AppsPage.vue'),
    meta: { requiresAuth: true, title: 'Apps | NovaSpace' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchPage.vue'),
    meta: { requiresAuth: true, title: 'Web Search | NovaSpace' }
  },
  {
    path: '/workout',
    name: 'Workout',
    component: () => import('../views/WorkoutPage.vue'),
    meta: { requiresAuth: true, title: 'Workout Planner | NovaSpace' }
  },
  {
    path: '/nutrition',
    name: 'Nutrition',
    component: () => import('../views/NutritionPage.vue'),
    meta: { requiresAuth: true, title: 'Nutrition Advisor | NovaSpace' }
  },
  {
    path: '/exercise',
    name: 'Exercise',
    component: () => import('../views/ExercisePage.vue'),
    meta: { requiresAuth: true, title: 'Exercise Guide | NovaSpace' }
  },
  {
    path: '/song-recognition',
    name: 'SongRecognition',
    component: () => import('../views/SongRecognitionPage.vue'),
    meta: { requiresAuth: true, title: 'Song Recognition | NovaSpace' }
  },
  {
    path: '/city-weather',
    name: 'CityWeather',
    component: () => import('../views/CityWeatherPage.vue'),
    meta: { requiresAuth: true, title: 'City Weather | NovaSpace' }
  },
  {
    path: '/country-weather',
    name: 'CountryWeather',
    component: () => import('../views/CountryWeatherPage.vue'),
    meta: { requiresAuth: true, title: 'Country Weather | NovaSpace' }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
    meta: { requiresAuth: true, title: 'Calendar | NovaSpace' }
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('../views/WorkSpace.vue'),
    meta: { requiresAuth: true, title: 'Workspace | NovaSpace' }
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('../views/Team.vue'),
    meta: { requiresAuth: true, title: 'Teams | NovaSpace' }
  },
  {
    path: '/team-projects',
    name: 'TeamProjects',
    component: () => import('../views/TeamProjects.vue'),
    meta: { requiresAuth: true, title: 'Team Projects | NovaSpace' }
  },
  {
    path: '/team-workspace',
    name: 'TeamWorkspace',
    component: () => import('../views/TeamworkSpace.vue'),
    meta: { requiresAuth: true, title: 'Team Workspace | NovaSpace' }
  },
  {
    path: '/team-workspace-admin',
    name: 'TeamAdmin',
    component: () => import('../views/TeamWorkspaceAdmin.vue'),
    meta: { requiresAuth: true, title: 'Team Workspace Admin | NovaSpace' }
  },
  {
    path: '/team-workspace-members',
    name: 'TeamMembers',
    component: () => import('../views/TeamWorkspaceMember.vue'),
    meta: { requiresAuth: true, title: 'Team Workspace Members | NovaSpace' }
  },
  {
    path: '/meeting',
    name: 'Meeting',
    component: () => import('../views/Meeting.vue'),
    meta: { requiresAuth: true, title: 'Meeting | NovaSpace' }
  },
  { path: '/meeting/:code', component: Meeting, props: true },
{ path: '/meeting/create', component: Meeting, query: { create: 'true' } },
  {
    path: '/join-meeting',
    name: 'JoinMeeting',
    component: () => import('../views/JoinMeeting.vue'),
    meta: { requiresAuth: true, title: 'Join Meeting | NovaSpace' }
  },
  {
    path: '/meeting-dashboard',
    name: 'MeetingDashboard',
    component: () => import('../views/meetingDashboard.vue'),
    meta: { requiresAuth: true, title: 'Meeting Dashboard | NovaSpace' }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatPage.vue'),
    meta: { requiresAuth: true, title: 'Chat | NovaSpace' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
    meta: { title: 'About | NovaSpace' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.isReady().then(() => {
  console.log('✅ Router is ready');
});

// ============================================================
// ✅ CHANGE 1: Removed unused `patchProp` import from original
// ✅ CHANGE 2: OAuth token interception moved to TOP of guard
// ✅ CHANGE 3: guestOnly no longer blocks OAuth redirect flow
// ============================================================
router.beforeEach((to, from, next) => {
  console.log(`\n=== ROUTER NAVIGATION ===`);
  console.log(`From: ${from.path} → To: ${to.path}`);

  // ✅ CHANGE: Check for OAuth tokens in URL FIRST before any auth logic
  // This runs before we even look at localStorage, fixing the race condition
  const urlParams = new URLSearchParams(window.location.search);
  const oauthAccessToken = urlParams.get('accessToken');
  const oauthRefreshToken = urlParams.get('refreshToken');

  if (oauthAccessToken) {
    console.log('🔑 OAuth tokens detected in URL - saving to storage NOW');
    try {
      const decodedAccess = decodeURIComponent(oauthAccessToken);
      const decodedRefresh = oauthRefreshToken ? decodeURIComponent(oauthRefreshToken) : null;

      localStorage.setItem('accessToken', decodedAccess);
      sessionStorage.setItem('accessToken', decodedAccess);

      if (decodedRefresh) {
        localStorage.setItem('refreshToken', decodedRefresh);
        sessionStorage.setItem('refreshToken', decodedRefresh);
      }

      // Clean the tokens out of the URL
      window.history.replaceState({}, document.title, to.path);

      console.log('✅ OAuth tokens saved - redirecting to dashboard');
      document.title = 'Dashboard | NovaSpace';
      return next('/dashboard');

    } catch (err) {
      console.error('❌ Failed to save OAuth tokens:', err);
      // Fall through to normal auth logic if token save fails
    }
  }

  // Normal token check from storage
  const localToken = localStorage.getItem('accessToken');
  const sessionToken = sessionStorage.getItem('accessToken');
  const hasToken = !!(localToken || sessionToken);

  console.log('Token check:', {
    localStorage: !!localToken,
    sessionStorage: !!sessionToken,
    isAuthenticated: hasToken
  });

  document.title = to.meta.title || 'NovaSpace';

  if (to.meta.requiresAuth) {
    if (!hasToken) {
      console.log('❌ Not authenticated - redirecting to /auth');
      next({ path: '/auth', query: { redirect: to.fullPath } });
    } else {
      console.log('✅ Authenticated - allowing access');
      next();
    }
  } else if (to.meta.guestOnly) {
    if (hasToken) {
      console.log('✅ Already authenticated - redirecting to dashboard');
      next(to.query.redirect || '/dashboard');
    } else {
      console.log('✅ Not authenticated - allowing access to auth page');
      next();
    }
  } else {
    console.log('✅ Public route - allowing access');
    next();
  }
});

router.afterEach((to) => {
  console.log(`✅ Navigation complete: ${to.path}`);
});

if (typeof window !== 'undefined') {
  window.addEventListener('auth-logout', () => {
    console.log('🔴 Auth logout event received');
    router.push('/auth');
  });

  window.addEventListener('auth-token-updated', () => {
    console.log('🟢 Auth token updated event received');
  });
}

export default router