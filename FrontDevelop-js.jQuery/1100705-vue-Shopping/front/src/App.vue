<template lang="pug">
  #app
    b-navbar(toggleable='lg' type='dark' variant='primary').mb-3
      b-container
        b-navbar-brand(to='/') ɾ⚈▿⚈ɹ 購物網
        //- .h2.mb-0
        //-   b-icon(icon='shop-window' variant='success')
        b-navbar-toggle(target='nav-collapse')
        b-collapse#nav-collapse(is-nav)
          b-navbar-nav.ml-auto
            b-nav-item(to='/about') 關於
            b-nav-item(v-if="!user.islogin" to='/register') 註冊
            b-nav-item(v-if="!user.islogin" to='/login') 登入
            //- 如果是登入狀態才會顯示
            b-nav-item(v-if="user.islogin" to='/cart') 購物車
            b-nav-item(v-if="user.islogin" to='/orders') 訂單
            b-nav-item(v-if="user.islogin && user.isAdmin" to='/admin') 管理
            b-nav-item(v-if="user.islogin" @click="logout") 登出
    router-view
</template>

<script>
// 區域引用 - 僅在這個檔案呼叫 mixin
// import mixin from './mixin.js'

export default {
  name: 'App',
  methods: {
    async logout () {
      try {
        await this.axios.delete('/users/logout', {
          headers: {
            // 驗證欄位 'Bearer ' + token  -> Bearer要空格
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        // 呼叫 logout 的 mutations
        this.$store.commit('logout')
        // 判斷現在不是在首頁的話，登出成功就導回首頁
        if (this.$route.path !== '/') this.$router.push('/')
        // $route 路由資訊
        // $router 是可以對 $route 修改變數的 function
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '發生錯誤'
        })
      }
    }
  },
  async mounted () {
    if (this.$store.state.jwt.token.length === 0) return
    const diff = Date.now() - this.$store.state.jwt.received
    try {
      // 如果進入網頁時，距離收到 jwt 過了六天，重新取得一次新的 jwt
      // 1000 * 60 * 60 * 24 * 6 = 6 天的毫秒數
      if (diff > 1000 * 60 * 60 * 24 * 6) {
        const { data } = await this.axios.post('/users/extend', {}, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$store.commit('extend', data.result)
      }
      // 進入網頁時重新取一次使用者資料
      const { data } = await this.axios.get('/users/', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.$store.commit('getinfo', data.result)
    } catch (error) {
      this.$store.commit('logout')
    }
  }
  // 區域引用 - 僅在這個檔案呼叫 mixin
  // mixins: [mixin]
  // 全部檔案都會用到的 function 可以一起寫在 mixin ，不要每個檔案重複寫
  // computed: {
  //   user () {
  //     return this.$store.state.user
  //   }
  // }
}
</script>
