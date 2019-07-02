<template>
  <div>
    <button @click="add">add</button>
    <ComponentB></ComponentB>
  </div>
</template>

<script>
  import ComponentB from './componentB'

  export default {
    name: "componentA",
    components: {
      ComponentB
    },
    data(){
      return{
       msg:990099
      }
    },
    provide(){
      return {
        msg:this.msg,
        _this:this,
      }
    },
    methods:{
      add(){
        this.msg = 55425662
      },
    }
  }
</script>

<style scoped>

</style>
