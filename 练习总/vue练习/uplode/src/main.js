// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import VueCookie from 'vue-cookie'
import httpRequest from './utils/httpRequerst'
import filter from './filters/filters'
// 全局挂载filter
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))
// Object.keys(filter).forEach(function (key) {
//   return Vue.filter(key, filter[key])
// })
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.use(iView);


Vue.prototype.$http = httpRequest
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
