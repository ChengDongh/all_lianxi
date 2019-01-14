<template>
  <div class="index">
    <navLeft></navLeft>
    <div class="right_box">
      <div>
        欢迎登录危化品监管平台
      </div>
    </div>
  </div>
</template>

<script>
  import navLeft from '@/components/nav_left'
  export default {
    name: "index",
    components: {
      navLeft,
    }
  }
</script>

<style scoped>
  .index{
    position: relative;
  }
  .right_box{
    font-size: 18px;
    text-align: center;
    padding-top: 100px;
  }
</style>
