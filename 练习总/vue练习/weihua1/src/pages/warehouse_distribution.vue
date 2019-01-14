<template>
  <div>
    <navLeft></navLeft>
    <div class="right_box">
      <div id="container"></div>
      <div id="myPageTop">
        <input placeholder="请输入关键字" id="tipinput"/>
      </div>
      <div class="explain">
        <div class="card_box">
          <img class="img_1" src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" alt="">
          <span>生产企业</span>
        </div>
        <div class="card_box">
          <img class="img_1" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" alt="">
          <span>仓库</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navLeft from '@/components/nav_left'
  import $ from 'jquery'
  export default {
    name: "warehouse_distribution",
    components: {
      navLeft
    },
    data(){
      return{
        mapicon:[],
        maplist:[{
          type: 1,
          longitude: 120.216061,
          latitude: 30.272635,
          title: '仓库1',
          address: '西湖区',
          photo: 13155555555,
          info: '西湖区厂区'
        }, {
          type: 1,
          longitude: 120.139156,
          latitude: 30.276193,
          title: '仓库2',
          address: '西湖区',
          photo: 15981286165,
          info: '西湖区厂区'
        }, {
          type: 2,
          longitude: 120.240093,
          latitude: 30.205008,
          title: '公司2',
          address: '西湖区',
          photo: 19845616515,
          info: '西湖区厂区'
        }, {
          type: 2,
          longitude: 120.176922,
          latitude: 30.183643,
          title: '公司1',
          address: '西湖区',
          photo: 15465498165,
          info: '西湖区厂区'
        }
        ],
        map:'',
      }
    },
    mounted(){
      var that = this;
      that.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 10
      });
      //搜索
      var autoOptions = {
        input: "tipinput"
      };
      var auto = new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
        map: that.map
      });  //构造地点查询类
      $('#tipinput').on('keypress', function (event) {
        if (event.keyCode == 13) {
          placeSearch.search($('#tipinput').val())
          $('#tipinput').val('')
          $('.amap-sug-result').hide();
        }
      });
      AMap.event.addListener(auto, "select", function (e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
        $('#tipinput').val('')
      });
      //定位
      var citysearch = new AMap.CitySearch();
      //自动获取用户IP，返回当前城市
      citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            // var cityinfo = result.city;
            var citybounds = result.bounds;
            //地图显示当前城市
            that.map.setBounds(citybounds);
            //显示当前城市的点标记
            // var maplist = that.maplist;
            that.setMarker();
          }
        }
      });
    },
    methods:{
      setMarker(){
        var that = this;
        $.each(that.maplist, function () {
          if(this.type == 2){
            var marker = new AMap.Marker({
              icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
              position: [this.longitude,this.latitude],
              offset: new AMap.Pixel(-13, -30),
              title: this.title
            });
          }else {
            marker = new AMap.Marker({
              position: new AMap.LngLat(this.longitude, this.latitude),
              offset: new AMap.Pixel(-10, -10),
              title: this.title
            });
          }
          marker.setMap(that.map);
        })
      }
    }
  }
</script>

<style scoped>
  .right_box{
    padding: 1px;
    /*position: relative;*/
  }
  #container{
    width: 80vw!important;
    height: 90vh!important;
    margin: 2vh 0 0 1vw;
  }
  .explain{
    width:90px;
    height: 70px;
    position: absolute;
    background: white;
    top: 2vh;
    left: 1vw;
    opacity: 0.9;
  }
  .img_1 {
    margin-left: 15px;
    margin-top: 10px;
    width: 10px;
    height: 15px;
    vertical-align: bottom;
  }
  #myPageTop{
    position: absolute;
    top: 4vh;
    right: 6vw;
    opacity: 0.9;
  }
</style>
