import Vue from 'vue'
import Router from 'vue-router'

const HelloWorld = () => import('@/components/HelloWorld');
const ComponentA = () => import('@/pages/componentA');
const ComponentB = () => import('@/pages/componentB')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/',
      name: 'componentA',
      component: ComponentA
    }, {
      path: '/componentB',
      name: 'componentB',
      component: ComponentB
    }
  ]
})
