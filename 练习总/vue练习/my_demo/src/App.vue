<template>
  <div id="app">
    <!--<router-view/>-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
export default {
  name: 'App',
  mounted(){
    if(this.$route.path == '/'){
      this.choose_one()
    }
    if(this.$route.path == '/car'){
      this.choose_two()
    }
  },
  methods:{
    // ...mapMutations([
    //   'choose',
    // ]),
    ...mapActions([
      'choose_one',
      'choose_two',
      // 'show_true',
      // 'show_false'
    ]),
  },
  watch:{
    '$route'(){
      // console.log(to.path)
      // console.log(from.path)
      if(this.$route.path == '/'){
        this.choose_one()
      }
      if(this.$route.path == '/car'){
        this.choose_two()
      }
      // if(from.path.indexOf('details')>=0){
      //   this.show_true()
      // }else {
      //   this.show_false()
      // }
    }
  }
}
</script>
<style>
  body{
    margin: 0;
    padding: 0;
  }
  .mint-spinner-snake{
    margin: 0 auto;
    height: 20px!important;
    width: 20px!important;
  }
  ul,p{
    margin: 0;
    padding: 0;
  }
  ul li{
    list-style: none;
  }
  .mint-searchbar{
    padding: 5px 10px!important;
  }
  .mint-searchbar-inner{
    height: 14px!important;
  }
</style>
