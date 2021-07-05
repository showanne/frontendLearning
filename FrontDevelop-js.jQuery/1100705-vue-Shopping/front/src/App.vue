<template lang="pug">
  #app
    b-navbar(toggleable='lg' type='dark' variant='primary').mb-3
      b-container
        b-navbar-brand(to='/') 購物網
      b-navbar-toggle(target='nav-collapse')
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav.ml-auto
          b-nav-item(v-if="!user.islogin" to='/register') 註冊
          b-nav-item(v-if="!user.islogin" to='/login') 登入
          //- 如果是登入狀態才會顯示
          b-nav-item(v-if="user.islogin" ) 購物車
          b-nav-item(v-if="user.islogin" ) 訂單
          b-nav-item(v-if="user.islogin && user.isAdmin" ) 管理
          b-nav-item(v-if="user.islogin" ) 登出
    router-view
</template>

<script>
// 僅在這個檔案呼叫 mixin
// import mixin from './mixin.js'

export default {
  name: 'App'
  // 僅在這個檔案呼叫 mixin
  // mixins: [mixin]
}
</script>
