<template>
  <div>
    666
    <div>{{this.num}}</div>
    <children @childclose="childclose" :msg="msg"></children>
  </div>
</template>

<script>
  import children from './children'
  export default {
    name: "father",
    components:{
      children
    },
    data() {
      return {
        msg:'我传值给你好吗',
        num:''
      }
    },
    mounted(){
      if(JSON.stringify(this.$route.params) != '{}'){
        console.log(this.$route.params.userId)
        console.log(this.$route.query.plan)
      }
    },
    methods:{
      childclose(close){
        this.num = close
      }
    }
  }
</script>

<style scoped>

</style>
