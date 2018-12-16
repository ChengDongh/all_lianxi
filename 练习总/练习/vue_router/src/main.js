// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
const islogin = false
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  console.log(to.path)
  // localStorage.removeItem('login');
  if (to.path === '/Index' && localStorage.getItem('login')) {
    console.log(6666)
    localStorage.removeItem('login');
    next()
  }
})


