<template>
  <div>
    <ul>
      <li>123</li>
      <li></li>
      <li>5555</li>
      <li></li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "background"
    }
</script>

<style scoped>
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li{
    width: 100%;
    height: 300px;
  }
  li:nth-of-type(1){
    background: url("../assets/902397dda144ad34ca686189d7a20cf430ad85ed.jpg");
    background-repeat: no-repeat;
    background-size: 100%;
    background-attachment:fixed;
  }
  li:nth-of-type(3){
    background: url("../assets/662286107586445060.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-attachment:fixed
  }
  li:nth-of-type(2){
    background: orangered;
  }
  li:nth-of-type(4){
    background: orange;
  }
</style>
