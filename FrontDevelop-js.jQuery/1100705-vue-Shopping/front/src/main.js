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

// 獨立寫 axios 另外設定
import './plugins/axios.js'

import VueGtag from 'vue-gtag'

import { BootstrapVue, BIcon, BIconCartPlus } from 'bootstrap-vue'

// 全域引用 mixin，這樣各分頁要是用變數就可以直接使用
import mixin from './mixin.js'

Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
Vue.component('ImgInputer', ImgInputer)

// BootstrapVue Icon
Vue.component('BIcon', BIcon)
Vue.component('BIconCartPlus', BIconCartPlus)

// 全域引用 mixin，這樣各分頁要是要用變數就可以直接使用
Vue.mixin(mixin)

// google analytics 評估 ID
Vue.use(VueGtag, {
  config: { id: 'G-NYSBPCDN0G' }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
