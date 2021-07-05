import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
// 全域引用 mixin，這樣各分頁要是用變數就可以直接使用
import mixin from './mixin.js'

// 要注意有多個請求 api 不能寫 baseURL
// 使用 baseURL 的方便之處在於 文件內有用到 axios 需要網址的地方可直接省略
axios.defaults.baseURL = process.env.VUE_APP_API
Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2)

// 全域引用 mixin，這樣各分頁要是要用變數就可以直接使用
Vue.mixin(mixin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
