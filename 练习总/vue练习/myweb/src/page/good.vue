<template>
    <div>
      <div>good页面欢迎你</div>
      <router-link :to="{name:'index',params:{id:id}}">go index页面</router-link>
      {{id_item}}
    </div>

</template>

<script>
    export default {
        name: "good",
      data(){
          return{
            id:10000,
            id_item:null,
            ids:null
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

</style>
