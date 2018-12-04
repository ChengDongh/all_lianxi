<template>
  <!--<div id="app">-->
      <!-- vue静态的常量   -->  <!-- $store是共有的意思 -->
    <!--<div class="">-->
      <!--<button type="button" name="buttonAdd" @click="$store.commit('add')">加一个</button>&lt;!&ndash; vue2.0  的写法 &ndash;&gt;-->
      <!--<button type="button" name="buttonAdd" @click="$store.commit('minus')">减一个</button>-->
    <!--</div>-->
  <!--</div>-->
  <div>
    {{ count }}
    {{ bbb }}
    {{ all_num }}
    <router-link :to="{name:'good',params:{id:id}}">去good页面</router-link>
  </div>
</template>
<script>
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  export default {
    name: 'index',
    data(){
      return{
        id:10
      }
    },
    computed:{
      ...mapState({
        count:'num',//引进是静态的
        //   bbb:'aaa'
      }),
      countNew(){
        return this.$store.state.a.num
      },
      /*count(){
        return this.$store.getters.num
      }*/
      //map对象方式获取getters
      ...mapGetters({
        count:'num',//引进是静态的
        bbb:'aaa',
        all_num:'all_num'
      })
    },
    methods:{
      ...mapMutations([
        'add',
        'minus'
      ]),
      ...mapActions([
        'addPlus',
      ]),
      ...mapActions({
        minusPlus:'minusPlus'
      })
    },
    mounted () {
      this.$store.state.a.num = 110;
      this.$store.state.a.aaa = 210;
    },
  }
</script>
