<template>
  <div class="modular_box">
    <ul class="list_conts clearfix">
      <!--<li><router-link :to="{ path: '/information' }">生产端</router-link></li>-->
      <!--<li><router-link :to="{ path: '/factoryList' }">危化品ERP/危包ERP</router-link></li>-->
      <!--<li><router-link :to="{ path: '/chemicalsList' }">运输端</router-link></li>-->
      <!--<li style="display: none;"><router-link :to="{ path: '/carList' }">运输车辆登记</router-link></li>-->
      <!--<li><router-link :to="{ path: '/packingList' }">需求端</router-link></li>-->
      <!--<li><router-link :to="{ path: '/transportList' }">化工运输登记</router-link></li>-->

      <li><router-link :to="{}">生产端</router-link></li>
      <span style="display: inline-block;width: 40px;height: 100px;float: left;line-height: 100px;vertical-align: bottom;margin-top: 10px;text-align: center;color: white">——</span>
      <li><router-link :to="{}">危化品ERP/危包ERP</router-link></li>
      <li><router-link :to="{}">运输端</router-link></li>
      <li style="opacity: 0;cursor: none"><router-link :to="{}" style="opacity: 0;cursor: default">运输车辆登记</router-link></li>
      <li><router-link :to="{}">需求端</router-link></li>
      <li><router-link :to="{path: '/transportList'}">化工运输登记</router-link></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "modular"
  }
</script>

<style scoped>
  .modular_box {
    background: rgb(48, 57, 65);
    width: 100vw;
    height: 100vh;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .clearfix {
    content: '';
    display: block;
    overflow: hidden;
    clear: both;
  }

  .list_conts {
    width: 580px;
    margin: 0 auto;
    padding-top: 160px;
  }

  .list_conts li a {
    color: white;
    display: block;
    width: 100%;
    height: 100%;
  }

  .list_conts li {
    width: 240px;
    height: 100px;
    float: left;
    margin: 10px 20px;
    text-align: center;
    line-height: 100px;
  }

  .list_conts li:nth-of-type(1) {
    background: linear-gradient(rgb(64, 138, 185), rgb(9, 119, 182));
    margin-right: 0px;
  }

  .list_conts li:nth-of-type(2) {
    background: linear-gradient(rgb(83, 97, 172), rgb(47, 67, 153));
    margin-left: 0px;
  }

  .list_conts li:nth-of-type(3) {
    background: linear-gradient(rgb(84, 153, 148), rgb(6, 107, 93));
  }

  .list_conts li:nth-of-type(4) {
    background: linear-gradient(rgb(132, 185, 112), rgb(102, 179, 51));
  }
  .list_conts li:nth-of-type(5) {
    background: linear-gradient(rgb(227, 83, 12), rgb(233, 15, 19));
  }
  .list_conts li:nth-of-type(6) {
    width: 520px;
    background: linear-gradient(rgb(64, 138, 185), rgb(225, 109, 6));
  }
</style>
