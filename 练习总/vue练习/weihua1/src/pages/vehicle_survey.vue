<template>
  <div>
    <navLeft></navLeft>
    <div class="right_box">
      <div id="container"></div>
      <div id="myPageTop">
        <input placeholder="请输入关键字" id="tipinput"/>
      </div>
    </div>
  </div>
</template>

<script>
  import navLeft from '@/components/nav_left'
  import $ from 'jquery'

  export default {
    name: "vehicle_survey",
    components: {
      navLeft
    },
    data() {
      return {
        mapicon: [],
        maplist: [{
          longitude: 120.216061,
          latitude: 30.272635,
          title: '汽车1',
          address: '西湖区',
          photo: 13155555555,
          info: '西湖区厂区'
        }, {
          longitude: 120.139156,
          latitude: 30.276193,
          title: '汽车2',
          address: '西湖区',
          photo: 13155555555,
          info: '西湖区厂区'
        }, {
          longitude: 120.240093,
          latitude: 30.205008,
          title: '汽车3',
          address: '西湖区',
          photo: 13155555555,
          info: '西湖区厂区'
        }, {
          longitude: 120.176922,
          latitude: 30.183643,
          title: '汽车4',
          address: '西湖区',
          photo: 13155555555,
          info: '西湖区厂区'
        }
        ],
        map: '',
      }
    },
    mounted() {
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
      citysearch.getLocalCity(function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            // var cityinfo = result.city;
            var citybounds = result.bounds;
            //地图显示当前城市
            that.map.setBounds(citybounds);
            //显示当前城市的点标记
            that.setMarker()
          }
        }
      });
    },
    methods: {
      setMarker() {
        var that = this;
        $.each(that.maplist, function () {
          var marker = new AMap.Marker({
            size: new AMap.Size(25, 34),
            icon: "http://cdn.qiqiangkeji.com/20190109.d6f197c8291c0951b8441bbf35e6ae35_40x40.png",
            position: [this.longitude, this.latitude],
            offset: new AMap.Pixel(-13, -30),
            title: this.title,
          });
          marker.setMap(that.map);
        });
      },
    }
  }
</script>

<style scoped>
  .right_box {
    padding: 1px;
    /*position: relative;*/
  }

  #container {
    width: 80vw !important;
    height: 90vh !important;
    margin: 2vh 0 0 1vw;
  }

  #myPageTop {
    position: absolute;
    top: 4vh;
    right: 6vw;
    opacity: 0.9;
  }
</style>
