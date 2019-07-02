<template>
  <div>
    {{_this.msg}}
  </div>
</template>

<script>
  export default {
    name: "componentB",
    inject:['msg','_this'],
  }
</script>

<style scoped>

</style>
