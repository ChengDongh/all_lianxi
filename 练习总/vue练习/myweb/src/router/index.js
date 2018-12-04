import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Good from '@/page/good'
import Search from '@/page/search'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/good/:id',
      name: 'good',
      component: Good
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
