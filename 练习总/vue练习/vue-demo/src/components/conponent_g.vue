<template>
  <div>
    {{second}}{{third}}
    <button @click='handleFunc1'>fuc1 button</button>
    <button @click='handleFunc2'>fuc2 button</button>
  </div>
</template>

<script>
  export default {
    name: "conponent_g",
    props:['second','third'],
    methods:{
      handleFunc1() {
        this.$listeners.func1('props changed second')
      },
      handleFunc2() {
        this.$listeners.func2('props changed third')
      }
    }
  }
</script>

<style scoped>

</style>
