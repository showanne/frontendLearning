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
    component: () =>
      import(/* webpackChunkName: 'guitar' */ '../views/Guitar.vue')
  },
  {
    path: '/guitar/event',
    name: 'GuitarEvent',
    component: () =>
      import(/* webpackChunkName: 'guitar-event' */ '../views/GuitarEvent.vue')
  },
  {
    path: '/guitar/learning',
    name: 'GuitarLearning',
    component: () =>
      import(/* webpackChunkName: 'guitar-learning' */ '../views/GuitarLearning.vue')
  },
  // {
  //   path: '/settings',        當網頁路徑 為 '/    ' 時
  //   name: 'Settings',         網頁名稱叫 '     '
  //   component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),                lazyload 當網頁展入時，還沒點到此頁，不會先載入
  //   meta: {
  //     title: '設定'   網頁標籤名稱
  //   }
  // }
  {
    // 一定要放在最後面  -- 找不到頁面
    // 網頁路徑為沒有設定的網頁(所有能配對的都配對過，從上面抓不到)會顯示的頁面
    // 用意：不會看到空頁白白一片
    path: '*',   
    name: 'NotFound',
    component: NotFound
    // 最上面記得要引用 import NotFound from '../views/NotFound.vue'
  }
  // ,
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: 'about' */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
