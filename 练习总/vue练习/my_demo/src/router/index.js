import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Detail from '@/pages/details'
import Car from '@/pages/car'
import Settle from '@/pages/settle'
import Address from '@/pages/address'
import Search from '@/pages/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta:{
        isUseCache:false,
        keepAlive:true
      }
    },
    {
      path: '/details/:id',
      name: 'detail',
      component: Detail
    },
    {
      path: '/car',
      name: 'car',
      component: Car
    },
    {
      path: '/settle',
      name: 'settle',
      component: Settle
    },
    {
      path: '/address',
      name: 'address_i',
      component: Address
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
