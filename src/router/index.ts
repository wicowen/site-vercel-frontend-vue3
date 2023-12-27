import { createRouter, createWebHistory } from 'vue-router'


import LoginView from '@/views/LoginView.vue'

const RecordView = () => import('@/views/RecordView.vue')
const RecordTable = () => import('@/components/RecordTable.vue')
const PlateRecognitionTable = () => import('@/components/Record/PlateRecognitionTable.vue')
// const TrafficFlowTable = () => import('@/components/Record/TrafficFlowTable.vue')
// const violationTable = () => import('@/components/Record/violationTable.vue')


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
            // {
            //   path: 'TrafficFlow',
            //   name: 'tableTFA',
            //   component: TrafficFlowTable,
            //   meta: { requiresAuth: true },
            // },
            {
              path: 'PlateRecognition',
              name: 'tableLPDR',
              component: PlateRecognitionTable,
              meta: { requiresAuth: true },
            },
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
      redirect: '/'
    }



    // default route
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
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
