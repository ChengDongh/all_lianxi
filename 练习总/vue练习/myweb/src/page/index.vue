<template>
  <!--<div>-->
    <!--<div>index页面欢迎你</div>-->
    <!--<router-link :to="{name:'good',params:{id:id_one}}">去good页面1</router-link>-->
    <!--<router-link :to="{name:'good',params:{id:id_two}}">去good页面2</router-link>-->
  <!--</div>-->
  <div>
    <div class="page-tabbar">
      <router-link :to="{name:'search',params:{id:id_one}}">搜索页面</router-link>
      <div class="page-wrap">
        <div class="page-title">Tabbar</div>
        <div>
          <mt-cell class="page-part" title="当前选中" :value="selected" />
        </div>
        <!-- tabcontainer -->
        <mt-tab-container class="page-tabbar-container" v-model="selected">
          <mt-tab-container-item id="外卖">
            <mt-cell :to="{name:'good',params:{id:n}}" v-for="n in 10" :title="'餐厅 ' + n" />
          </mt-tab-container-item>
          <mt-tab-container-item id="订单">
            <mt-cell v-for="n in 5" :title="'订单 ' + n" />
          </mt-tab-container-item>
          <mt-tab-container-item id="发现">
            <mt-cell v-for="n in 7" :title="'发现 ' + n" />
          </mt-tab-container-item>
          <mt-tab-container-item id="我的">
            <div class="page-part">
              <!-- cell -->
              <mt-cell v-for="n in 12" :title="'我的 ' + n" />
            </div>
            <router-link to="/">
              <!-- button -->
              <mt-button type="danger" size="large">退出</mt-button>
            </router-link>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>

      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="外卖">
          <img slot="icon" src="../assets/100.png">
          外卖
        </mt-tab-item>
        <mt-tab-item id="订单">
          <img slot="icon" src="../assets/100.png">
          订单
        </mt-tab-item>
        <mt-tab-item id="发现">
          <img slot="icon" src="../assets/100.png">
          发现
        </mt-tab-item>
        <mt-tab-item id="我的">
          <img slot="icon" src="../assets/100.png">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>

</template>

<script>
    export default {
        name: "index",
      data(){
          return{
            id_one:10,
            id_two:20,
            value:'',
            selected: '外卖',
          }
      },
      created(){
          this.getParams()
      },
      methods:{
        getParams(){
          console.log(this.$route.params.id)
        }
      },
    }
</script>

<style scoped>
  .page-tabbar {
    overflow: hidden;
    height: 100vh;
    padding-bottom: 55px;
  }

  .page-wrap {
    overflow: auto;
    height: 100%;
    padding-bottom: 100px;
  }
</style>
