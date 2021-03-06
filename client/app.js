import Vue from 'vue'
import {sync} from 'vuex-router-sync'
import App from './components/App'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

sync(store, router)
Vue.use(ElementUi)

const app = new Vue({
  router,
  store,
  ...App
})

export {app, router, store}
