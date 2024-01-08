import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'

// const DemoView = () => import('@/views/DemoView.vue')

const LicenseView = () => import('@/views/LicenseView.vue')
const LicenseTable = () => import('@/components/License/LicenseTable.vue')
const LicenseListTable = () => import('@/components/License/LicenseListTable.vue')


const RecordView = () => import('@/views/RecordView.vue')
const RecordTable = () => import('@/components/Record/RecordTable.vue')
const PlateRecognitionTable = () => import('@/components/Record/PlateRecognitionTable.vue')
// const TrafficFlowTable = () => import('@/components/Record/TrafficFlowTable.vue')
// const violationTable = () => import('@/components/Record/violationTable.vue')

// import AppLayoutDefault from '@/layouts/AppLayoutDefault.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: LoginView
    },

    {
      path: '/Demo',
      name: 'Demo',
      meta: { layout: 'AppLayoutDefault' },
      component: () => import('@/views/DemoView.vue'),
    },

    {
      path: '/Demo/Public',
      name: 'Demo-Public',
      meta: { layout: 'AppLayoutPublic' },
      component: () => import('@/views/DemoView.vue'),
    },

    {
      path: '/Demo/Login',
      name: 'Demo-Login',
      meta: { layout: 'AppLayoutPublic' },
      component: () => import('@/views/DemoView.vue'),
    },

    {
      path: '/Demo/User',
      name: 'Demo-User',
      meta: { layout: 'AppLayoutUser' },
      component: () => import('@/views/DemoView.vue'),
    },

    {
      path: '/Demo/Admin',
      name: 'Demo-Admin',
      meta: { layout: 'AppLayoutAdmin' },
      component: () => import('@/views/DemoView.vue'),
    },



    {
      path: '/License',
      name: 'License',
      component: LicenseView,
      // meta: { requiresAuth: true, layout: 'defaultLayout' },
      meta: { requiresAuth: true },
      children: [
        {
          path: 'Table',
          component: LicenseTable,
          children: [
            {
              path: '/License/',
              redirect: '/License/Table/List'
            },
            {
              path: '/License/Table/',
              redirect: '/License/Table/List'
            },
            {
              path: 'List',
              name: 'LicenseListTable',
              component: LicenseListTable,
              meta: { requiresAuth: true },
            },
          ]
        },
      ]
    },
    

    {
      path: '/Record',
      name: 'Record',
      component: RecordView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'Table',
          component: RecordTable,
          children: [
            {
              path: '/Record/',
              redirect: '/Record/Table/PlateRecognition'
            },
            {
              path: '/Record/Table/',
              redirect: '/Record/Table/PlateRecognition'
            },
            {
              path: 'PlateRecognition',
              name: 'tableLPDR',
              component: PlateRecognitionTable,
              meta: { requiresAuth: true },
            },
            // {
            //   path: 'TrafficFlow',
            //   name: 'tableTFA',
            //   component: TrafficFlowTable,
            //   meta: { requiresAuth: true },
            // },
            // {
            //   path: 'violation',
            //   name: 'tableVD',
            //   component: violationTable,
            //   meta: { requiresAuth: true },
            // },
          ]
        },
        // {
        //   path: '/Graph',
        //   name: 'graph',
        //   component: RecordGraph,
        //   meta: { requiresAuth: true }
        // }
      ]
    },


    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
      // component: NotFound
    }

  ]
})



router.beforeEach(async (to, from, next) => {
  // const authStore = useAuthStore();
  // const hasToken = getCookie('token');
  // const publicPages = ['/Login'];
  // const needAuthPages = ['/GisView'];

  // 檢查是否需要登入
  // if (!publicPages.includes(to.path) && !hasToken && to.meta.requiresAuth) {
  //   authStore.returnUrl = to.fullPath;
  //   swalErrorModal.fire(i18n.global.t("swalErrorModal.401_error"))
  //   next('/Login'); // 執行登入頁面的重定向
  // }

  // 檢查是否需要授權
  // if ((to.meta.requireSentinel || needAuthPages.includes(to.path)) && !authStore.authStatus) {
  //   await authStore.getLicenseStatusApi();
  //   if (!authStore.authStatus) {
  //     next('/'); // 執行默認頁面的重定向
  //   }
  // }

  // 如果不需要重定向，繼續路由導航
  next();
});




export default router
