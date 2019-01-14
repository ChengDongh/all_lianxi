import Vue from 'vue'
import Router from 'vue-router'
import module_landing from '@/pages/module_landing'
import index from '@/pages/index'
import login from '@/pages/login'
import speeding_week from '@/pages/speeding_week'
import rest from '@/pages/rest'
import vehicle_month from '@/pages/vehicle_month'
import vehicle_online from '@/pages/vehicle_online'
import speeding_month from '@/pages/speeding_month'
import warehouse_distribution from '@/pages/warehouse_distribution'
import vehicle_survey from '@/pages/vehicle_survey'
import real_time_monitoring from '@/pages/real_time_monitoring'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'module_landing',
      component: module_landing
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/speeding_week',
      name: 'speeding_week',
      component: speeding_week
    },
    {
      path: '/rest',
      name: 'rest',
      component: rest
    },
    {
      path: '/vehicle_month',
      name: 'vehicle_month',
      component: vehicle_month
    },
    {
      path: '/vehicle_online',
      name: 'vehicle_online',
      component: vehicle_online
    },
    {
      path: '/speeding_month',
      name: 'speeding_month',
      component: speeding_month
    },
    {
      path: '/warehouse_distribution',
      name: 'warehouse_distribution',
      component: warehouse_distribution
    },
    {
      path: '/vehicle_survey',
      name: 'vehicle_survey',
      component: vehicle_survey
    },
    {
      path: '/real_time_monitoring',
      name: 'real_time_monitoring',
      component: real_time_monitoring
    }
  ]
})
