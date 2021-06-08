// 安裝套件
import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

// fontawesome 必要引用
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAward, faShoppingCart, faComments, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons' // fas 開頭

// 本地
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

// fontawesome 使用
library.add(faAward, faShoppingCart, faComments, faHandHoldingHeart)

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
