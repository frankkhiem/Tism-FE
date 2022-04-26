import Vue from 'vue'
import VueX from 'vuex'

import {modules} from './modules'

Vue.use(VueX);

export default new VueX.Store({
  modules: modules,
})
