// 创建文件
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  selected:'首页',
  id:'2',
  userInfo:[
    {
      id:'1',
      name:'张三0',
      tel:13233333330,
      address:'浙江杭州市西湖区 万塘路588古荡湾新村000号000室',
      checked:true
    },
    {
      id:'2',
      name:'张三1',
      tel:13233333331,
      address:'浙江杭州市西湖区 万塘路588古荡湾新村000号001室',
      checked:false
    },
    {
      id:'3',
      name:'张三2',
      tel:13233333332,
      address:'浙江杭州市西湖区 万塘路588古荡湾新村000号002室',
      checked:false
    },
    {
      id:'4',
      name:'张三3',
      tel:13233333333,
      address:'浙江杭州市西湖区 万塘路588古荡湾新村000号003室',
      checked:false
    },
  ],
  path_id:null
}

const mutations = {
  choose(state,val){
    state.selected = val;
  },
  choose_id(state,val){
    state.id = val;
  },
  path(state,val){
    state.path_id = val;
  },
}

const getters = {
  selected:function (state) {
    return state.selected;
  },
  id:function (state) {
    return state.id = '1';
  },
  id_num:function (state) {
    return state.userInfo.filter(userInfo => userInfo.id == state.id)
  },
}

const actions = {
  choose_one(context){//context代表了整个的store
    context.commit('choose','首页');
    // console.log(1)
  },
  choose_two(context) {//context代表了整个的store
    context.commit('choose', '购物车');
    // console.log(2)
  },
}

const module ={
  state,
  mutations,
  getters,
  actions
}

export default new Vuex.Store(module)
