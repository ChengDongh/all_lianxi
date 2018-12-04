<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  // watch: {
  //   '$route'(to, from) {
  //     if (this.$route.path == '/'){
  //       console.log(333333)
  //     }
  //     console.log(to)
  //     console.log(from)
  //     console.log(this.$route.path);
  //   }
  // }
}
</script>
<style>
  body{
    margin: 0;
    padding: 0;
  }
</style>

