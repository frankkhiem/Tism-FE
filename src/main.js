import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import SeUIVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.min.css';
import './assets/css/general.css';
Vue.use(SeUIVue)

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import VueConfirmDialog from 'vue-confirm-dialog'
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

import VModal from 'vue-js-modal'
Vue.use(VModal)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
