<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch:{
    '$route':'change_path'
  },
  methods:{
    change_path(){
      var adminId = localStorage.getItem('adminId');
      if(adminId == ''){
        this.$router.push({
          path:'/'
        })
      }
    }
  }
}
</script>

<style>
  body{
    overflow-x: hidden;
    overflow-y: hidden;
  }
  #app{
    position: relative;
  }
  .right_box{
    position: absolute;
    left: 18vw;
    top: 5vh;
    width: 82vw!important;
    height: 95vh!important;
    padding: 40px 20px;
  }
  .ivu-btn-primary {
    height: 28px;
    width: 80px !important;
    line-height: 1;
  }
  .from {
    margin-top: 50px;
  }
  .amap-marker-content{
    display: none!important;
  }
</style>
