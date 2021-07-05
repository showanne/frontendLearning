<template lang="pug">
#app
  b-navbar(toggleable='lg' type='dark' variant='info')
    b-container
      b-navbar-brand(to='/') 購物網
      b-navbar-toggle(target='nav-collapse')
      b-collapse#nav-collapse(is-nav)
        b-navbar-nav.ml-auto
          b-nav-item(v-if="!user.islogin" to='/register') 註冊
          b-nav-item(v-if="!user.islogin" to='/login') 登入
          b-nav-item(v-if="user.islogin" ) 購物車
          b-nav-item(v-if="user.islogin" ) 訂單
          b-nav-item(v-if="user.islogin && user.isAdmin" ) 管理
          b-nav-item(v-if="user.islogin" ) 登出
  router-view
</template>

<script>
export default {
  name: 'App'
}
</script>
