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
          b-nav-item(v-if="user.islogin && user.isAdmin" to='/admin') 管理
          b-nav-item(v-if="user.islogin" @click="logout") 登出
  router-view
</template>

<script>
export default {
  name: 'App',
  methods: {
    async logout () {
      try {
        await this.axios.delete('/users/logout', {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$store.commit('logout')
        if (this.$route.path !== '/') this.$router.push('/')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '發生錯誤'
        })
      }
    }
  }
}
</script>
