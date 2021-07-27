import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import ImgInputer from 'vue-img-inputer'
import 'vue-img-inputer/dist/index.css'
import './plugins/axios.js'

import mixin from './mixin.js'

import VueGtag from 'vue-gtag'
Vue.use(VueGtag, {
  config: { id: 'G-78YVENP49Q' }
})

Vue.use(VueSweetalert2)
Vue.component('ImgInputer', ImgInputer)

Vue.mixin(mixin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
