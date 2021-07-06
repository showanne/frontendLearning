import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 將後端傳回的資料存 Vuex
    jwt: {
      token: '',
      // 時間戳記 - 計算取得 token 的時間
      // 不用每次開網頁都更新序號，等到大概過了5~6天再去換 (後端設定7天過期)，但是每次開網頁都要與後端確認序號可不可以
      received: 0
      // typeof new Date().getTime() 類型是 number
      // new Date().getTime() -> 1625498219087
    },
    user: {
      account: '',
      // 使用者身分
      role: 0,
      email: ''
    }
  },
  mutations: {
    login (state, data) {
      state.jwt.token = data.token
      state.jwt.received = new Date().getTime()
      state.user.account = data.account
      state.user.role = data.role
      state.user.email = data.email
    },
    logout (state) {
      // 登出 將存 Vuex 的資料清空
      state.jwt = {
        token: '',
        received: 0
      }
      state.user = {
        account: '',
        role: 0,
        email: ''
      }
    }
  },
  actions: {
  },
  modules: {
  },
  // getters (Vuex) 是先將 Vuex 的資料處理後，再return出來
  getters: {
    user (state) {
      // ...state.user 其餘運算子 (解構寫法) 將上方 state: {user} 展開
      return {
        islogin: state.user.account.length > 0,
        isAdmin: state.user.role === 1,
        ...state.user
      }
    }
  }
})
