import { readRouteUser } from './store/main/getters';
import Vue from 'vue';
import Router, { Route } from 'vue-router';

import RouterComponent from './components/RouterComponent.vue';
import { State } from './store/state';
import { Store } from 'vuex';
import { component } from 'vue/types/umd';

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
                  path: 'finance-requests',
                  component: () => import(/* webpackChunkName: "admin-user-invite" */ './views/main/people/admin/AdminFinanceRequests.vue')
                }
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
                          path: 'trainings',
                          name: 'profile-trainings',
                          component: () => import(
                          /* webpackChunkName: "main-profile-trainings" */ './views/main/people/profile/UserProfileTrainings.vue')
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
                        },
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
                      path: 'requests',
                      name: 'profile-requests',
                      meta: {
                        title: 'Anträge',
                      },
                      component: () => import(
                      /* webpackChunkName: "main-profile-requests" */ './views/main/people/profile/requests/UserProfileRequests.vue'),
                    }, 
                    {
                      path: 'request-create',
                      name: 'profile-request-create',
                      meta: {
                        title: 'Antrag erstellen',
                      },
                      component: () => import(
                      /* webpackChunkName: "main-profile-request-create" */ './views/main/people/profile/requests/UserProfileRequestCreate.vue'),
                      redirect: 'request-create/ressort-change',
                      children: [
                        {
                          path: 'ressort-change',
                          name: 'profile-request-ressort-change',
                          component: () => import('./views/main/people/profile/requests/RequestRessortChange.vue'),
                        },
                        {
                          path: 'alumni',
                          name: 'profile-request-alumni',
                          component: () => import('./views/main/people/profile/requests/RequestAlumni.vue'),
                        },
                        {
                          path: 'passive',
                          name: 'profile-request-passive',
                          component: () => import('./views/main/people/profile/requests/RequestPassive.vue'),
                        }, 
                        {
                          path: 'memberstatus',
                          name: 'profile-request-memberstatus',
                          component: () => import('./views/main/people/profile/requests/RequestMemberstatus.vue'),
                        } 
                      ]
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
                    {
                      path: 'requests',
                      name: 'main-admin-requests',
                      component: () => import(
                      /* webpackChunkName: "main-admin-requests" */ './views/main/people/admin/AdminRequests.vue'),
                    },
                  ],
                }
              ]
            },
            {
              path: 'guide',
              component: () => import('./views/main/guide/Guide.vue')
            },
            {
              path: 'trainings',
              name: 'trainings-all',
              component: RouterComponent,
              children: [
                {
                  path: '',
                  component: () => import(/* webpackChunkName: "admin-training" */ './views/main/training/TrainingMain.vue'),
                },
                {
                  path: 'create',
                  name: 'training-create',
                  component: () => import(/* webpackChunkName: "admin-training-create" */ './views/main/training/EditTraining.vue'),
                },
                {
                  path: 'edit/:id',
                  name: 'training-edit',
                  component: () => import(/* webpackChunkName: "admin-training-edit" */ './views/main/training/EditTraining.vue'),
                },
                {
                  path: ':id',
                  name: 'trainings-details',
                  component: () => import(
                  /* webpackChunkName: "training-detail" */ './views/main/training/TrainingDetail.vue'),
                },
              ]
            },
            {
              path: 'finance-requests',
              component: RouterComponent,
              children: [
                {
                  path: '',
                  name: 'finance-request',
                  component: () => import('./views/main/finance-request/UserFinanceRequests.vue'),
                },
                {
                  path: ':id',
                  name: 'finance-request-detail',
                  component: () => import('./views/main/finance-request/FinanceRequestDetail.vue'),
                },
                {
                  path: 'edit/:id',
                  name: 'finance-request-edit',
                  component: () => import('./views/main/finance-request/CreateFinanceRequest.vue'),
                },
                {
                  path: 'create',
                  name: 'finance-request-create',
                  component: () => import('./views/main/finance-request/CreateFinanceRequest.vue'),
                },
              ]
            },
            {
              path: 'calendar',
              component: () => import('./views/main/calendar/Calendar.vue')
            },
            {
              path: 'tower',
              component: () => import('./views/main/tower/Tower.vue')
            },
            {
              path: 'shop',
              component: () => import('./views/main/shop/Shop.vue')
            },
            {
              path: 'hochladen',
              component: () => import('./views/main/hochladen/Hochladen.vue')
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
