import { readRouteUser } from './store/main/getters';
import Vue from 'vue';
import Router, { Route } from 'vue-router';

import RouterComponent from './components/RouterComponent.vue';
import { State } from './store/state';
import { Store } from 'vuex';

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
          path: 'account-create',
          component: () => import(/* webpackChunkName: "account-create" */ './views/main/AccountCreate.vue')
        },
        {
          path: 'main',
          component: () => import(/* webpackChunkName: "main" */ './views/main/Main.vue'),
          redirect: 'main/people',
          meta: {
            title: 'Dashboard' 
          },
          children: [
            {
              path: 'welcome',
              component: () => import('./views/main/Welcome.vue'),
            },
            {
              path: 'admin',
              redirect: 'admin/dashboard',
              component: () => import(/* webpackChunkName: "main-admin" */ './views/main/AdminGuard.vue'),
              children: [
                {
                  path: 'dashboard',
                  component: () => import(/* webpackChunkName: "admin-dashboard" */ './views/main/admin/AdminDashboard.vue')
                },  
                {
                  path: 'user-invite',
                  component: () => import(/* webpackChunkName: "admin-user-invite" */ './views/main/admin/UserInvitation.vue')
                },
                {
                  path: 'training',
                  component: () => import(/* webpackChunkName: "admin-training" */ './views/main/training/AdminViewTraining.vue')
                },
              ]
            },
            {
              path: 'people',
              redirect: 'people/dashboard',
              component: RouterComponent,
              children: [
                {
                  path: 'dashboard',
                  redirect: 'search'
                },
                {
                  path: 'search',
                  component: () => import(/* webpackChunkName: "main-search" */ './views/main/people/search/SearchView.vue'),
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
                      /* webpackChunkName: "main-profile" */ './views/main/people/profile/UserProfile.vue'),
                      meta: {
                        title: (route: Route, $store: Store<State>) => {
                          const user = readRouteUser($store)(route);
                          return user?.full_name;
                        }
                      },
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
                          /* webpackChunkName: "main-profile-skills" */ './views/main/people/profile/UserProfileSkills.vue')
                        },
                        {
                          path: 'projects',
                          name: 'profile-projects',
                          component: () => import(
                          /* webpackChunkName: "main-profile-projects" */  './views/main/people/profile/UserProfileProjects.vue'),
                        },
                        {
                          path: 'about',
                          name: 'profile-about',
                          component: () => import(
                          /* webpackChunkName: "main-profile-about" */  './views/main/people/profile/UserProfileAbout.vue'),
                        }
                      ]
                    },
                    {
                      path: 'edit',
                      name: 'profile-edit',
                      meta: {
                        title: 'Profil bearbeiten',
                      },
                      component: () => import(
                      /* webpackChunkName: "main-profile-edit" */ './views/main/people/profile/UserProfileEdit.vue'),
                    }, 
                    {
                      path: 'edit-password',
                      name: 'profile-edit-password',
                      meta: {
                        title: 'Passwort ändern',
                      },
                      component: () => import(
                      /* webpackChunkName: "main-profile-edit-password" */ './views/main/people/profile/UserProfileEditPassword.vue'),
                    }
                  ],
                },
                {
                  path: 'admin',
                  component: () => import(/* webpackChunkName: "main-admin" */ './views/main/AdminGuard.vue'),
                  redirect: 'admin/users/all',
                  children: [
                    {
                      path: 'users',
                      redirect: 'users/all',
                    },
                    {
                      path: 'users/all',
                      component: () => import(
                      /* webpackChunkName: "main-admin-users" */ './views/main/people/admin/AdminUsers.vue'),
                    },
                    {
                      path: 'users/edit/:id',
                      name: 'main-admin-users-edit',
                      component: () => import(
                      /* webpackChunkName: "main-admin-users-edit" */ './views/main/people/admin/EditUser.vue'),
                    },
                    {
                      path: 'users/create',
                      name: 'main-admin-users-create',
                      component: () => import(
                      /* webpackChunkName: "main-admin-users-edit" */ './views/main/people/admin/EditUser.vue'),
                    },
                  ],
                }
              ]
            },
            {
              path: 'guide',
              component: () => import('./views/main/guide/Guide.vue')
            }
          ],
        },
      ],
    },
    {
      path: '/*', redirect: '/',
    },
  ],
});
