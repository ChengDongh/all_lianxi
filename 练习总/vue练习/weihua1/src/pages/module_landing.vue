<template>
    <div class="module">
      <div class="content">
        <router-link class="cont_left cont" :to="{path:'/login'}">
          危化品监管系统
        </router-link>
        <a class="cont_right cont" href="http://jk.qiqiangkeji.com" target="_blank">
          危化品登记系统(企业端)
        </a>
      </div>
    </div>
</template>

<script>
    export default {
        name: "module_landing"
    }
</script>

<style scoped>
  .module{
    width: 100vw;
    height: 100vh;
    background: rgb(48,57,65);
  }
  .content{
    text-align: center;
    padding-top: 260px;
  }
  .cont{
    width: 260px;
    height: 100px;
    display: inline-block;
    background: linear-gradient(to right , rgb(64, 138, 185), rgb(9, 119, 182));
    line-height: 100px;
    color: white;
    font-size: 18px;
    text-align: center;
  }
  .cont_left{
    margin-right: 10px;
  }
  .cont_right{
    margin-left: 10px;
  }
</style>
