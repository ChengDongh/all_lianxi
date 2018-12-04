import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Copy from '@/components/copy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/copy',
      name: 'copy',
      component: Copy
    }
  ]
})
