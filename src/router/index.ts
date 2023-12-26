import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import LoginView from '../views/LoginView.vue'
import LoginView from '@/views/LoginView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'login-view',
      component: LoginView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }

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

export default router
