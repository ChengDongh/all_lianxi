import Vue from 'vue'
import Router from 'vue-router'
import componentsA from '@/components/componentsA'
import componentsB from '@/components/componentsB'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'componentsA',
      component: componentsA
    },
    {
      path: '/componentsB',
      name: 'componentsB',
      component: componentsB
    }
  ]
})
