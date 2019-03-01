<template>
  <div>
    999
    <div>{{this.msg1}}</div>
    <button @click="childclose">点击</button>
  </div>
</template>

<script>
  export default {
    name: "children",
    props:['msg'],
    data() {
      return {
        msg1:this.msg
      }
    },
    methods:{
      childclose(){
        this.msg1 = 993211225841223655
        this.$emit('childclose',6666999996)
      }
    },
    watch:{
      msg:function name(params) {
        console.log(params)
        this.msg1 = this.msg
      }
    }
  }
</script>

<style scoped>

</style>
