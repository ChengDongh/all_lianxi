<template>
  <div class="hello">
    <router-link :to="{path:'father'}">go father</router-link>
    <!--//参数不显示在浏览的路径里-->
    <router-link :to="{name:'father',params:{userId:123}}">go father</router-link>
    <!--//参数显示在浏览器的路径里-->
    <router-link :to="{path:'father',query:{plan:'123456'}}">go father</router-link>

    <router-link :to="{path:'children'}">go children</router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
