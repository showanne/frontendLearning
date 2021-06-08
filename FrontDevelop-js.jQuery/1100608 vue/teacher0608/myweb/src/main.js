import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGift, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

library.add(faGift, faShoppingCart)

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
