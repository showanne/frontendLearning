import VueAxios from 'vue-axios'
import axios from 'axios'
import Vue from 'vue'
import store from '../store'
import router from '../router'

axios.defaults.baseURL = process.env.VUE_APP_API

// axios 攔截器，當 axios 請求完成時使用的 function
// axios.xxx --> 攔截器 --> 呼叫地方的 then 或 catch
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  // 如果 axios 請求有回傳東西
  if (error.response) {
    if (error.response.status === 401) {
      const extendUrl = '/users/extend'
      // 如果原始請求的位址不是延長登入的話，才延長登入
      if (error.config.url !== extendUrl) {
        const originalRequest = error.config
        // 傳送延長登入請求
        return axios.post(extendUrl, {}, {
          headers: {
            authorization: 'Bearer ' + store.state.jwt.token
          }
        }).then((response) => {
          store.commit('extend', response.data.result)
          originalRequest.headers.authorization = 'Bearer ' + store.state.jwt.token
          return axios(originalRequest)
        }).catch((error) => {
          store.commit('logout')
          router.push('/login')
          return Promise.reject(error)
        })
      }
    }
  } else {
    if (error.code === 'ECONNABORTED' && error.message && error.message.includes('timeout')) {
      alert('請求逾時')
    } else {
      alert('網路不穩定')
    }
  }
  return Promise.reject(error)
})

Vue.use(VueAxios, axios)
