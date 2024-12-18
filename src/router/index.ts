import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { AuthService } from '../service/AuthService';
import { useUserProfileStore } from '@/store/userProfileStore';

const errorRoutes: RouteRecordRaw[] = [
  //error
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/pages/error/Error.vue')
  },
  //403 (access denied)
  {
    path: '/access-denied',
    name: 'accessDenied',
    component: () => import('@/views/pages/error/Access.vue')
  },
  //404 (not found)
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/pages/error/NotFound.vue')
  }
];

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/callback',
    name: 'callback',
    component: () => import('@/views/pages/auth/Callback.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          redirect: '/home'
        },
        {
          path: 'home',
          name: 'dashboard',
          component: () => import('@/views/pages/Dashboard.vue')
        },
        {
          path: 'create-user-profile',
          name: 'create-user-profile',
          component: () => import('@/views/pages/auth/CreateUserProfile.vue')
        },
        {
          path: 'my-devices',
          name: 'my-devices',
          component: () => import('@/views/pages/my-devices/MyDevices.vue')
        },
        {
          path: 'my-properties',
          name: 'my-properties',
          component: () => import('@/views/pages/my-properties/MyProperties.vue')
        },
        {
          path: '/my-properties/:property_id/my-areas',
          name: 'my-areas',
          component: () => import('@/views/pages/my-areas/MyAreas.vue')
        },
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/pages/events/Events.vue')
        },
        {
          path: 'help',
          name: 'help',
          component: () => import('@/views/pages/assistance/Assistance.vue')
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/pages/contact/Contact.vue')
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: () => import('@/views/pages/pricing/Pricing.vue')
        },

        //UI KIT
        {
          path: '/uikit',
          children: [
            {
              path: 'formlayout',
              name: 'formlayout',
              component: () => import('@/views/uikit/FormLayout.vue')
            },
            {
              path: 'input',
              name: 'input',
              component: () => import('@/views/uikit/InputDoc.vue')
            },
            {
              path: 'charts',
              name: 'charts',
              component: () => import('@/views/uikit/ChartDoc.vue')
            }
          ]
        }
      ]
    },
    ...publicRoutes,
    ...errorRoutes
  ]
});

//middleware to check if user is authenticated
router.beforeEach(async (to, from, next) => {
  const { isProfileCreated } = useUserProfileStore();
  const authenticatedUser = await AuthService.getUser();
  const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth);
  const isPublicRoute = publicRoutes.some((route) => route.path === to.path);

  if (isAuthRequired && !authenticatedUser) {
    next({ path: '/login', query: { then: to.fullPath } });
  } else if (authenticatedUser) {
    //redirect to home if user tries to access /create-user-profile but already has a profile
    if (isProfileCreated && to.name === 'create-user-profile') {
      next({ path: '/home' });
    }
    //redirect to profile creation if user profile is not created
    else if (isProfileCreated === false && to.name !== 'create-user-profile') {
      next({ path: '/create-user-profile' });
    } else if (isPublicRoute) {
      next({ path: '/home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
