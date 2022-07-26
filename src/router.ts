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
          name: 'request-password-reset',
          path: 'request-password-reset',
          component: () => import(/* webpackChunkName: "account-create" */ './views/RequestPasswordReset.vue')
        },

        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import(/* webpackChunkName: "account-create" */ './views/PasswordReset.vue')
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
                  component: () => import(/* webpackChunkName: "admin-dashboard" */ './views/main/admin/AdminDashboard.vue'),
                  meta: {
                    permissions: ['*admin*']
                  }
                },  
                {
                  path: 'user-invite',
                  component: () => import(/* webpackChunkName: "admin-user-invite" */ './views/main/admin/UserInvitation.vue')
                },
                {
                  path: 'finance-requests',
                  component: () => import(/* webpackChunkName: "admin-user-invite" */ './views/main/admin/AdminFinanceRequests.vue')
                },
                {
                  path: 'groups',
                  component: RouterComponent,
                  children: [
                    {
                      path: '',
                      component: () => import(/* webpackChunkName: "admin-user-groups" */ './views/main/admin/AdminGroups.vue')
                    },
                    {
                      path: 'create',
                      name: 'main-admin-groups-create',
                      component: () => import(/* webpackChunkName: "admin-user-groups-create" */ './views/main/admin/EditGroup.vue')
                    },
                    {
                      path: ':id',
                      name: 'main-admin-groups-edit',
                      component: () => import(/* webpackChunkName: "admin-user-groups-create" */ './views/main/admin/EditGroup.vue')
                    },
                  ]
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
                      name: 'profile',
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
                          path: 'meetings',
                          name: 'profile-meetings',
                          meta: {
                            event_type: 'meeting',
                          },
                          component: () => import(/* webpackChunkName: "main-profile-events" */ './views/main/people/profile/UserProfileEvents.vue'),
                        },
                        {
                          path: 'trainings',
                          name: 'profile-trainings',
                          meta: {
                            event_type: 'training',
                          },
                          component: () => import(/* webpackChunkName: "main-profile-events" */ './views/main/people/profile/UserProfileEvents.vue'),
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
                      path: 'settings',
                      name: 'profile-settings',
                      meta: {
                        title: 'Accounteinstellungen',
                      },
                      component: () => import(
                      /* webpackChunkName: "main-profile-edit" */ './views/main/people/profile/UserProfileSettings.vue'),
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
                      path: 'alumni/all',
                      component: () => import(
                      /* webpackChunkName: "main-admin-alumni-users" */ './views/main/admin/AdminAlumniUsers.vue'),
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
              name: 'trainings',
              meta: {
                event_type: 'training',
              },
              component: () => import(/* webpackChunkName: "admin-event" */ './views/main/event/EventMain.vue'),
            },
            {
              path: 'wms',
              name: 'wms',
              component: RouterComponent,
              children: [
                {
                  path: 'meetings',
                  name: 'meetings',
                  component: RouterComponent,
                  children: [
                    {
                      meta: {
                        event_type: 'meeting',
                      },
                      path: '',
                      component: () => import(/* webpackChunkName: "admin-event" */ './views/main/event/EventMain.vue'),
                    },
                  ]
                }, 
                {
                  path: 'documents',
                  component: RouterComponent,
                  children: [
                    {
                      path: '',
                      redirect: { name: 'member-progression' }
                    },
                    {
                      path: 'member-progression',
                      name: 'member-progression',
                      meta: {
                        document_type: 'member-progression',
                      },
                      component: () => import('./views/main/document/DocumentMain.vue')
                    },
                    {
                      path: 'recruiting',
                      name: 'recruiting',
                      meta: {
                        document_type: 'recruiting',
                      },
                      component: () => import('./views/main/document/DocumentMain.vue')
                    },
                    {
                      path: 'archive',
                      name: 'archive',
                      meta: {
                        document_type: 'archive',
                      },
                      component: () => import('./views/main/document/DocumentMain.vue')
                    },
                    {
                      path: 'public-affairs',
                      name: 'public-affairs',
                      meta: {
                        document_type: 'public-affairs',
                      },
                      component: () => import('./views/main/document/DocumentMain.vue')
                    },
                    {
                      path: 'quality-management',
                      name: 'quality-management',
                      meta: {
                        document_type: 'quality-management',
                      },
                      component: () => import('./views/main/document/DocumentMain.vue')
                    },
                    {
                      path: 'create',
                      name: 'document-create',
                      component: () => import('./views/main/document/EditDocument.vue')
                    },
                    {
                      path: 'edit/:id',
                      name: 'document-edit',
                      component: () => import('./views/main/document/EditDocument.vue'),
                    },
                  ]
                }
              ]
            },
            {
              path: 'events',
              name: 'events-all',
              component: RouterComponent,
              children: [
                {
                  path: '',
                  redirect: { name: 'trainings' }
                },
                {
                  path: 'edit/:id',
                  name: 'event-edit',
                  component: () => import(/* webpackChunkName: "admin-event-edit" */ './views/main/event/EditEvent.vue'),
                },
                {
                  path: 'create',
                  name: 'event-create',
                  component: () => import(/* webpackChunkName: "admin-event-create-entry" */ './views/main/event/EditEventEntry.vue'),
                  children: [
                    {
                      path: '',
                      redirect: () => ({ name: 'event-create-training' })
                    },
                    {
                      meta: {
                        event_type: 'training',
                      },
                      path: 'training',
                      name: 'event-create-training',
                      component: () => import(/* webpackChunkName: "admin-event-create" */ './views/main/event/EditEvent.vue'),
                    },
                    {
                      meta: {
                        event_type: 'meeting',
                      },
                      path: 'meeting',
                      name: 'event-create-meeting',
                      component: () => import(/* webpackChunkName: "admin-event-create" */ './views/main/event/EditEvent.vue'),
                    },
                  ]
                },
                {
                  path: ':id',
                  name: 'events-details',
                  component: () => import(
                  /* webpackChunkName: "event-detail" */ './views/main/event/EventDetail.vue'),
                },
                {
                  path: 'check-in/:id',
                  name: 'check-in',
                  component: () => import(
                    /* webpackChunkName: "event-detail" */ './views/main/event/EventCheckin.vue'),
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
                  path: 'edit/:id',
                  name: 'finance-request-edit',
                  component: () => import('./views/main/finance-request/CreateFinanceRequest.vue'),
                },
                {
                  path: 'create',
                  name: 'finance-request-create',
                  component: () => import('./views/main/finance-request/CreateFinanceRequest.vue'),
                },
                {
                  path: ':id',
                  name: 'finance-request-detail',
                  component: () => import('./views/main/finance-request/FinanceRequestDetail.vue'),
                },
              ]
            },
            {
              path:'calendar',
              redirect: 'calendar/week/today'
              // component: () => import('./views/main/calendar/Calendar.vue')
            },
            {
              path: 'calendar/:viewType/:viewDate',
              component: () => import('./views/main/calendar/CalendarMain.vue'),
              meta: {
                featureFlag: 'calendar'
              }
            },
            {
              path: 'towernutzung/:viewType/:viewDate',
              component: () => import('./views/main/calendar/CalendarMain.vue'),
              meta: {
                featureFlag: 'calendar',
                towernutzung: true,
              }
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
