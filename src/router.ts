import Vue from 'vue';
import Router from 'vue-router';

import RouterComponent from './components/RouterComponent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "start" */ './views/main/Start.vue'),
      children: [
        {
          path: 'login',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
        },
        {
          path: 'recover-password',
          component: () => import(/* webpackChunkName: "recover-password" */ './views/PasswordRecovery.vue'),
        },
        {
          path: 'reset-password',
          component: () => import(/* webpackChunkName: "reset-password" */ './views/ResetPassword.vue'),
        },
        {
          path: 'main',
          component: () => import(/* webpackChunkName: "main" */ './views/main/Main.vue'),
          redirect: 'main/dashboard',
          children: [
            {
              path: 'dashboard',
              redirect: 'search'
            },
            {
              path: 'search',
              component: () => import(/* webpackChunkName: "main-search" */ './views/main/search/SearchView.vue'),
              meta: {
                disableSearchBar: true
              }
            },
            {
              path: 'profile',
              component: RouterComponent,
              redirect: 'profile/view',
              children: [
                {
                  path: 'view',
                  redirect: 'view/me'
                },
                {
                  path: 'view/:id',
                  component: () => import(
                    /* webpackChunkName: "main-profile" */ './views/main/profile/UserProfile.vue'),
                  children: [
                    {
                      // ensures ids are passed
                      path: '',
                      redirect: (to) => ({ name: 'profile-about', params: { id: to.params?.id || 'me' } })
                    },
                    {
                      path: 'skills',
                      name: 'profile-skills',
                      component: () => import(
                        /* webpackChunkName: "main-profile-skills" */ './views/main/profile/UserProfileSkills.vue')
                    },
                    {
                      path: 'projects',
                      name: 'profile-projects',
                      component: () => import(
                        /* webpackChunkName: "main-profile-projects" */  './views/main/profile/UserProfileProjects.vue'),
                    },
                    {
                      path: 'about',
                      name: 'profile-about',
                      component: () => import(
                        /* webpackChunkName: "main-profile-about" */  './views/main/profile/UserProfileAbout.vue'),
                    }
                  ]
                },
                {
                  path: 'edit',
                  name: 'profile-edit',
                  component: () => import(
                    /* webpackChunkName: "main-profile-edit" */ './views/main/profile/UserProfileEdit.vue'),
                },
                {
                  path: 'password',
                  component: () => import(
                    /* webpackChunkName: "main-profile-password" */ './views/main/profile/UserProfileEditPassword.vue'),
                },
              ],
            },
            {
              path: 'admin',
              component: () => import(/* webpackChunkName: "main-admin" */ './views/main/admin/Admin.vue'),
              redirect: 'admin/users/all',
              children: [
                {
                  path: 'users',
                  redirect: 'users/all',
                },
                {
                  path: 'users/all',
                  component: () => import(
                    /* webpackChunkName: "main-admin-users" */ './views/main/admin/AdminUsers.vue'),
                },
                {
                  path: 'users/edit/:id',
                  name: 'main-admin-users-edit',
                  component: () => import(
                    /* webpackChunkName: "main-admin-users-edit" */ './views/main/admin/EditUser.vue'),
                },
                {
                  path: 'users/create',
                  name: 'main-admin-users-create',
                  component: () => import(
                    /* webpackChunkName: "main-admin-users-edit" */ './views/main/admin/EditUser.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/*', redirect: '/',
    },
  ],
});
