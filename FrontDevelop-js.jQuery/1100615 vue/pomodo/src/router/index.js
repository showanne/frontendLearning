import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '番茄鐘'
    }
  },
  // {
  //   path: '/settings',        當網頁路徑 為 '/    ' 時
  //   name: 'Settings',         網頁名稱叫 '     '
  //   component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),                lazyload 當網頁展入時，還沒點到此頁，不會先載入
  //   meta: {
  //     title: '番茄鐘 | 設定'   網頁標籤名稱
  //   }
  // }
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      title: '番茄鐘 | 設定'
    }
  },
  {
    path: '/list',
    name: 'List',
    component: () => import(/* webpackChunkName: "list" */ '../views/List.vue'),
    meta: {
      title: '番茄鐘 | 清單'
    }
  }
]

const router = new VueRouter({
  routes
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
