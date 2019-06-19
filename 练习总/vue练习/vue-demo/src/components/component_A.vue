<template>
  <div>
    <child></child>
  </div>
</template>

<script>
  import Child from './component_B'

  export default {
    name: "component_A",
    components: {
      Child
    },
    provide(){
      return {
        for:this.click
      }

    },
    methods:{
      click:function () {
        console.log(9999)
      }
    }
  }
</script>

<style scoped>

</style>
