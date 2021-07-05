import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 將後端傳回的資料存 Vuex
    jwt: {
      token: '',
      // 計算取得 token 的時間
      received: 0
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
    }
  },
  actions: {
  },
  modules: {
  },
  // getters 是處理
  getters: {
    user (state) {
      // mixin 與 getters 的差異
      // ...state.user (解構寫法) 將上方 state: {user} 展開
      return { islogin: state.user.account.length > 0, isAdmin: state.user.role === 1, ...state.user }
    }
  }
})
