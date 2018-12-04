/* 仓库文件 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
/* 访问状态对象  都是不变的 常量 */
const state = { //一般通过外部文件引入的，东西很多的。
                //定义数据 --- 类似data
  num: null,//生成了一个静态的常量
  aaa:null,
  all_num:null,
  todos: [{ id: 1, text: '水果类', done: true },
{ id: 2, text: '苹果', done: true },
{ id: 3, text: '苹果', done: false}]
}

/* 放方法  访问触发状态 */
const mutations = {
  //定义方法 --- 类似methods
  add(state,n){//state 是把上面的数据引入进来的
    console.log(n);
    state.num+= n.a*2;
    state.aaa=state.aaa - n.a;
  },
  minus(state){
    state.num--;
    state.aaa++;
  }
}

const getters = {
  num:function (state) {
    return state.num += 0;
  },
  aaa:function (state) {
    return state.aaa +=0;
  },
  all_num:function (state) {
    return state.all_num = 100
  },
  doneTodos: state => {//通过方法访问
    return state.todos.filter(todo => todo.done)
  },
  doneTodosCount: (state, getters) => {//通过属性访问
    return getters.doneTodos.length
  }
}

const actions = {
  addPlus(context){//context代表了整个的store
    context.commit('add',{a:2}); //每次加2
    setTimeout(()=>{
      context.commit('minus');
    },3000)
    console.log('Actions中的加');
  },
  minusPlus({commit}){//commit
    commit('minus')
  }
}

const moduleA ={
  state,
  mutations,
  getters,
  actions
}

const moduleB ={
  state: {
    numB: 666
  }
}

export default new Vuex.Store({
  modules:{
    a:moduleA,
    b:moduleB
  }
});
