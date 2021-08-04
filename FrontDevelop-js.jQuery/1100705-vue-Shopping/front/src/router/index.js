import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '購物網'
    }
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import(/* webpackChunkName: "product" */ '../views/Product.vue'),
    meta: {
      title: '商品 | 購物網'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/Cart.vue'),
    meta: {
      login: true,
      title: '購物車 | 購物網'
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import(/* webpackChunkName: "orders" */ '../views/Orders.vue'),
    meta: {
      login: true,
      title: '訂單 | 購物網'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: '關於 | 購物網'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      title: '註冊 | 購物網'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      title: '登入 | 購物網'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    children: [
      {
        // path: '', 不打代表跟上面路徑相同
        // /* webpackChunkName: "admin" */ 打包時 是否要單獨存 js 檔
        path: '',
        name: 'AdminHome',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminHome.vue'),
        meta: {
          login: true,
          admin: true,
          title: '管理 | 購物網'
        }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminProducts.vue'),
        meta: {
          login: true,
          admin: true,
          title: '商品管理 | 購物網'
        }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import(/* webpackChunkName: "admin" */ '../views/AdminOrders.vue'),
        meta: {
          login: true,
          admin: true,
          title: '訂單管理 | 購物網'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// .beforeEach 在進去每頁之前，判斷是否為登入狀態及是否有權限訪問該頁面
// to 從哪頁來 / from 要去哪頁 / next 如果符合判斷條件要丟去哪裡
router.beforeEach((to, from, next) => {
  // console.log(store.state.user)
  // console.log('beforeEach')
  if (to.meta.login && store.state.user.account.length === 0) {
    // 如果現在不是登入 且 帳號長度為 0
    // 未登入者導去登入畫面
    next('/login')
  } else if (to.meta.admin && store.state.user.role !== 1) {
    // 如果現在不是管理員登入 且 使用者角色不等於 1
    // 導回首頁
    next('/')
  } else {
    // () 內有放路徑就是指定要跳去哪頁
    // () 內沒放東西就是原本要去哪頁就直接去哪頁
    next()
  }
})

// .afterEach 在進去每頁之後，更改網頁標題
router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
