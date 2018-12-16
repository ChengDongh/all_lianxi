<template>
  <div class="cat">
    <div>
      {{msg}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "Cat",
    data() {
      return {
        msg: 'vue-router demo'
      }
    }
  }
</script>

<style scoped>

</style>
