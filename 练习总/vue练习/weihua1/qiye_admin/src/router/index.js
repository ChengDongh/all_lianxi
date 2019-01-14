import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Information from '@/pages/information'
import Modular from '@/pages/modular'
import Transport from '@/pages/transport'
import TransportList from '@/pages/transportList'
import Car from '@/pages/car'
import CarList from '@/pages/carList'
import Factory from '@/pages/factory'
import FactoryList from '@/pages/factoryList'
import Packing from '@/pages/packing'
import PackingList from '@/pages/packingList'
import Chemicals from '@/pages/chemicals'
import ChemicalsList from '@/pages/chemicalsList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'modular',
      component: Modular
    },
    {
      path: '/information',
      name: 'information',
      component: Information
    },
    {
      path: '/car',
      name: 'car',
      component: Car
    },
    {
      path: '/packing',
      name: 'packing',
      component: Packing
    },
    {
      path: '/factory',
      name: 'factory',
      component: Factory
    },
    {
      path: '/transport',
      name: 'transport',
      component: Transport
    },
    {
      path: '/chemicals',
      name: 'chemicals',
      component: Chemicals
    },
    {
      path: '/packingList',
      name: 'packingList',
      component: PackingList
    },
    {
      path: '/carList',
      name: 'carList',
      component: CarList
    },
    {
      path: '/transportList',
      name: 'transportList',
      component: TransportList
    },
    {
      path: '/factoryList',
      name: 'factoryList',
      component: FactoryList
    },
    {
      path: '/chemicalsList',
      name: 'chemicalsList',
      component: ChemicalsList
    }
  ]
})
