import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Component_f from '@/components/component_f'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'component_f',
      component: Component_f
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
