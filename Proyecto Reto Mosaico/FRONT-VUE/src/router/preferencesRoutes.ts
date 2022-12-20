const preferencesRoutes = [
  {
    path: '/preferences',
    name: 'user-preferences',
    redirect: '/preferences/profile',
    component: () => import('components/preferences/PreferencesSidebarComponent.vue'),
    children: [
      {
        path: '/preferences/profile',
        name: 'user-profile',
        component: () =>
          import('components/preferences/ProfileUserComponent.vue'),
      },
      {
        path: '/preferences/answers',
        name: 'user-answers',
        component: () =>
          import('components/preferences/AnswerUserComponent.vue'),
      },
      {
        path: '/preferences/passuser',
        name: 'user-password',
        component: () =>
          import('components/preferences/PasswordUserComponent.vue'),
      },
    ],
  },
];

export default preferencesRoutes;
