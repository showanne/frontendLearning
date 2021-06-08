import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/guitar',
    name: 'Guitar',
    component: () => import(/* webpackChunkName: "guitar" */ '../views/Guitar.vue')
  },
  {
    path: '/guitar/event',
    name: 'GuitarEvent',
    component: () => import(/* webpackChunkName: "guitar-event" */ '../views/GuitarEvent.vue')
  },
  {
    path: '/guitar/learning',
    name: 'GuitarLearning',
    component: () => import(/* webpackChunkName: "guitar-learning" */ '../views/GuitarLearning.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
