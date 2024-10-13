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
          component: () => import('@/views/Dashboard.vue')
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
          path: '/my-properties/:property_id/my-areas/:area_id/devices',
          name: 'devices',
          component: () => import('@/views/pages/my-devices/DevicesXArea.vue')
        },
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/pages/events/Events.vue')
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
              path: 'button',
              name: 'button',
              component: () => import('@/views/uikit/ButtonDoc.vue')
            },
            {
              path: 'table',
              name: 'table',
              component: () => import('@/views/uikit/TableDoc.vue')
            },
            {
              path: 'list',
              name: 'list',
              component: () => import('@/views/uikit/ListDoc.vue')
            },
            {
              path: 'tree',
              name: 'tree',
              component: () => import('@/views/uikit/TreeDoc.vue')
            },
            {
              path: 'panel',
              name: 'panel',
              component: () => import('@/views/uikit/PanelsDoc.vue')
            },

            {
              path: 'overlay',
              name: 'overlay',
              component: () => import('@/views/uikit/OverlayDoc.vue')
            },
            {
              path: 'media',
              name: 'media',
              component: () => import('@/views/uikit/MediaDoc.vue')
            },
            {
              path: 'message',
              name: 'message',
              component: () => import('@/views/uikit/MessagesDoc.vue')
            },
            {
              path: 'file',
              name: 'file',
              component: () => import('@/views/uikit/FileDoc.vue')
            },
            {
              path: 'menu',
              name: 'menu',
              component: () => import('@/views/uikit/MenuDoc.vue')
            },
            {
              path: 'charts',
              name: 'charts',
              component: () => import('@/views/uikit/ChartDoc.vue')
            },
            {
              path: 'misc',
              name: 'misc',
              component: () => import('@/views/uikit/MiscDoc.vue')
            },
            {
              path: 'timeline',
              name: 'timeline',
              component: () => import('@/views/uikit/TimelineDoc.vue')
            }
          ]
        },
        //PAGES
        {
          path: '/pages/crud',
          name: 'crud',
          component: () => import('@/views/pages/Crud.vue')
        }
      ]
    },
    {
      path: '/landing',
      name: 'landing',
      component: () => import('@/views/pages/Landing.vue')
    },
    ...publicRoutes,
    ...errorRoutes
  ]
});

//middleware to check if user is authenticated
router.beforeEach(async (to, from, next) => {
  const authenticatedUser = await AuthService.getUser();
  const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth);
  const isPublicRoute = publicRoutes.some((route) => route.path === to.path);

  if (isAuthRequired && !authenticatedUser) {
    next({ path: '/login', query: { then: to.fullPath } });
  } else if (authenticatedUser) {
    const userProfileStore = useUserProfileStore();
    const isUserProfileCreated = await userProfileStore.checkUserProfile();

    //redirect to home if user tries to access /create-user-profile but already has a profile
    if (isUserProfileCreated && to.name === 'create-user-profile') {
      next({ path: '/home' });
    }
    //redirect to profile creation if user profile is not created
    else if (!isUserProfileCreated && to.name !== 'create-user-profile') {
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
