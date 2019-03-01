import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Father from '@/components/father'
import Children from '@/components/children'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/father',
      name:'father',
      component:Father
    },
    {
      path:'/children',
      name:'father',
      component:Children
    }
  ]
})
