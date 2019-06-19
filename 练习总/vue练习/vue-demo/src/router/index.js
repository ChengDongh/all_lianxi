import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Component_f from '@/components/component_f'
// import component_A from '@/components/component_A'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Component_f',
      component: Component_f
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
