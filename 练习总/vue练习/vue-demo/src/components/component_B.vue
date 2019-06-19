<template>
  <div @click="aa">
    点击
  </div>
</template>

<script>
  export default {
    name: "component_B",
    inject:['for'],
    data() {

      return {
      }
    },
    methods:{
      aa:function () {
        this.for()
      }
    }
  }
</script>

<style scoped>

</style>
