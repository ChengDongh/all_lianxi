<template>
  <div class="factory_box">
      <div class="info_cont">
        <span>企业厂区信息登记</span>
      </div>
    <div style="width: 40%">
      <div class="address">
        <span>具体地址</span>
        <div style="display: inline-block;margin-left: 20px"><input type="text" v-model="infos"></div>
      </div>
      <div class="map">
        <span>地图定位</span>
        <div style="display: inline-block;margin-left: 20px;">
          <input  type="text" v-model="location" readonly="true" id="lnglat">
        </div>
      </div>
      <div class="type">
        <span>类型</span>
        <Select v-model="model1" style="width:150px;margin-left: 70px">
          <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div style="text-align: center;margin-top: 30px">
        <button class="submit_btn">保存</button>
      </div>
    </div>
    <div class="map_style">
      <div style="width: 100%;height: 100%;" id="container" class="map"></div>
      <div id="tip">
        <input type="text" id="tipinput" name="keyword" value="请输入关键字" onfocus='this.value=""'/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "factory",
    data() {
      return {
        location:'119.709031,29.095456',
        infos:"金华市星辰化工有限公司",
        cityList1: [
          {
            value: '生产厂区',
            label: '生产厂区'
          },
          {
            value: '仓库',
            label: '仓库'
          }
        ],
        model1: '生产厂区',
      }
    },
    mounted() {
      var map = new AMap.Map("container", {
        resizeEnable: true
      });
      map.on('click', function (e) {
        document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
      });
      var auto = new AMap.Autocomplete({
        input: "tipinput"
      });
      var autoOptions = {
        input: "tipinput"
      };
      var auto = new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
        map: map
      });  //构造地点查询类
      AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
      function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
      }
      $('#tipinput').on('keypress', function (event) {
        if (event.keyCode == 13) {
          placeSearch.search($('#tipinput').val())
        }
      });
    }
  }
</script>

<style scoped>
  .factory_box{
    position: relative;
  }
  .info_cont {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: white;
    font-size: 18px;
    text-indent: 30px;
    background: linear-gradient(to right, rgb(112, 175, 226), rgb(59, 120, 165));
  }

  .address, .type {
    border-bottom: 1px solid #aaa;
    height: 60px;
    padding: 10px 0;
    font-size: 18px;
    text-indent: 15px;
  }
  .map {
    height: 60px;
    padding: 10px 0;
    font-size: 18px;
    text-indent: 15px;
    width: 100%;
  }
  .map_style{
    width: 600px;
    height: 600px;
    position: absolute;
    left: 650px;
    top: 70px;
  }
  .submit_btn{
     width: 80px;
     height: 30px;
     border: none;
     background: #2db7f5;
     border-radius: 5px;
     color: white;
   }
    #tip{
      position: absolute;
      top: 10px;
      left: 10px;
    }
</style>
