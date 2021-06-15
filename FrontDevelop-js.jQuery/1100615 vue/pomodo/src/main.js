// 安裝套件
import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

// fontawesome 必要引用
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faPen, faUndo, faTrash, faPlay, faPause, faStepForward } from '@fortawesome/free-solid-svg-icons' // fas 開頭

// VueSweetalert2
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// 本地
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'

// fontawesome 使用
library.add(faCheck, faPen, faUndo, faTrash, faPlay, faPause, faStepForward)

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueSweetalert2)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
