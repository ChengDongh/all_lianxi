<template>
    <div>
      <mt-tabbar v-model="$store.state.selected">
        <mt-tab-item id="首页" class="pad">
          <router-link class="link_a" to="/" :style="{color:$store.state.selected=='首页'? 'orangered':'black'}">
            <img class="img_icon" src="../assets/100.png">
            <span>首页</span>
          </router-link>
        </mt-tab-item>
        <mt-tab-item id="购物车" class="pad">
          <router-link class="link_a" to="/car" :style="{color:$store.state.selected=='首页'? 'black':'orangered'}">
            <img class="img_icon" src="../assets/100.png">
            <span>购物车</span>
          </router-link>
        </mt-tab-item>
      </mt-tabbar>
      <!--1225-->
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
    export default {
        name: "Tabbers",
      data(){
          return{
            // selected: '首页',
          }
      },
      computed:{
        ...mapGetters({
          selected:'selected',//引进是静态的
        })
      },
      methods:{

      },
    }
</script>

<style scoped>
  .img_icon{
    display: block;
    width: 20px;
    height: 20px;
    margin: 0 auto;
  }
  .link_a{
    text-decoration: none;
    color: black;
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 7px 0;
  }
  .pad{
    padding: 0;
  }
</style>
