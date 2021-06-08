import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/award',
    name: 'Award',
    component: () => import(/* webpackChunkName: "award" */ '../views/Award.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import(/* webpackChunkName: "product" */ '../views/Product.vue')
  },
  {
    path: '/msg',
    name: 'Msg',
    component: () => import(/* webpackChunkName: "msg" */ '../views/Msg.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
