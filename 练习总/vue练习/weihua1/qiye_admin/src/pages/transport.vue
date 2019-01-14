<template>
  <div class="transport_box">
    <div class="info_cont">
      <span>化工运输信息登记</span>
    </div>
    <div style="width:50%">
      <div class="transport">
        <span>目的地</span>
        <div style="display: inline-block;margin-left: 20px;width: 80%">
          <Cascader style="width: 60%" v-model="value3" placeholder="选择公司－选择厂区" :data="data" trigger="hover"></Cascader>
        </div>
      </div>
      <div class="transport">
        <span>出发时间</span>
        <div style="display: inline-block;margin-left: 20px;width: 70%">
          <DatePicker :value="value1" type="datetime" placeholder="出发时间" style="width: 200px"></DatePicker>
        </div>
      </div>
      <div class="transport">
        <span>预计到达时间</span>
        <div style="display: inline-block;margin-left: 20px;width: 70%">
          <DatePicker type="datetime" :value="value2" placeholder="预计到达时间" style="width: 200px"></DatePicker>
        </div>
      </div>
      <div class="transport">
        <span>选择车辆</span>
        <div style="display: inline-block;margin-left: 20px;width: 44%">
          <Select v-model="model3" placeholder="请选择车辆" style="width:200px">
            <Option v-for="item in cityList3" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <span>选择路线</span>
      </div>
      <div class="transport">
        <span>选择容器</span>
        <div style="display: inline-block;margin-left: 20px;width: 40%">
          <Select v-model="model4" placeholder="请选择容器" style="width:150px">
            <Option v-for="item in cityList4" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <span style="margin-left: 30px">数量</span>
        <div style="display: inline-block;margin-left: 20px;width: 30%">
          <input type="text" v-model="num">
        </div>
      </div>
      <div class="transport">
        <span>运载品清单</span>
        <div style="display: inline-block;margin-left: 50px">
          <button style="line-height: 30px" class="submit_btn" @click="add">扫码录入</button>
        </div>
      </div>
      <div class="list" v-if="show" style="margin-left: 1px">
        <Table :columns="columns1" :data="data1"></Table>
      </div>
    </div>
    <div class="map_style">
      <div style="width: 100%;height: 100%;" id="container" class="map"></div>
      <div id="panel"></div>
      <div id="explain"></div>
    </div>
    <div style="text-align: left;padding-top: 30px;padding-left: 300px">
      <button class="submit_btn">保存</button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "transport",
    data() {
      return {
        polyline: '',
        pathParams: [],
        pathlists: [],
        show: true,
        num: '10',
        value1: '2018-12-19 15:38:00',
        value2: '2018-12-19 20:32:00',
        value3: ['xingcheng', 'cang1'],
        columns1: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '数量',
            key: 'number'
          },
          {
            title: '单位',
            key: 'company'
          }
        ],
        data1: [
          {
            name: '高氯酸',
            number: 18,
            company: '罐',
          },
          {
            name: '环三次甲基三硝胺[钝感的]',
            number: 24,
            company: '罐',
          },
          {
            name: '三硝基甲苯与硝基萘混合物梯萘炸药',
            number: 30,
            company: '桶',
          },
          {
            name: '三硝基甲苯与三硝基苯混合物',
            number: 26,
            company: '吨',
          }
        ],
        cityList1: [
          {
            value: '生产厂区一',
            label: '生产厂区一'
          },
          {
            value: '仓库二',
            label: '仓库二'
          }
        ],
        model1: '',
        cityList2: [
          {
            value: '生产厂区一',
            label: '生产厂区一'
          },
          {
            value: '仓库二',
            label: '仓库二'
          }
        ],
        model2: '',
        cityList3: [
          {
            value: '浙AFF123',
            label: '浙AFF123'
          },
          {
            value: '浙ASS002',
            label: '浙ASS002'
          }
        ],
        model3: '浙AFF123',
        cityList4: [
          {
            value: '桶',
            label: '桶'
          },
          {
            value: '罐',
            label: '罐'
          },
          {
            value: '箱',
            label: '箱'
          },
          {
            value: '瓶',
            label: '瓶'
          },
          {
            value: '其他',
            label: '其他'
          }
        ],
        model4: '桶',
        data: [{
          value: 'xingcheng',
          label: '金华市星辰化工有限公司',
          children: [
            {
              value: 'cang1',
              label: '仓库一'
            },
            {
              value: 'cang2',
              label: '仓库二'
            }
          ]
        }, {
          value: 'yutong',
          label: '金华市宇通化工有限公司',
          children: [
            {
              value: 'yu1',
              label: '生产厂房一',
            },
            {
              value: 'yu2',
              label: '生产厂房二',
            }
          ],
        }],
        map: '',
        polygon: [
          {
            polygonPath: "120.428921, 30.672986;120.408321, 30.645815;120.474239, 30.630454;120.456387, 30.66708",
          },
          {
            polygonPath: '120.625301, 30.700148;120.663754, 30.716678;120.6871, 30.690701;120.644528, 30.670623'
          },
          {
            polygonPath: '120.656544, 30.990782;120.703407, 30.981805;120.700317, 30.946478;120.650536, 30.962671'
          }
        ],
        polygonPath:[],
      }
    },
    mounted() {
      // var str = '';
      // var arr = [[{x:120.63092,y:30.772958},{x:120.63092,y:30.772958},{x:120.63092,y:30.772958},{x:120.63092,y:30.772958}],[{x:120.63092,y:30.772958},{x:120.63092,y:30.772958},{x:120.63092,y:30.772958},{x:120.63092,y:30.772958}]];
      // for(var i =0;i<arr.length;i++){
      //   for(var j =0;j<arr[i].length;j++){
      //     str = str + arr[i][j].x + ',' + arr[i][j].y + ';'
      //   }
      //   str = str + '|';
      // }
      // str = str.substring(0,str.length-2)
      // console.log(str)
      var that = this;
      that.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 18
      });
      axios({
        method: 'get',
        url: 'https://restapi.amap.com/v3/direction/driving?key=d293b754400cc855f849e87fb2c941ad&origin=120.167738,30.251218&destination=120.683666,31.292562&originid=&destinationid=&extensions=base&strategy=0&waypoints=&avoidpolygons=120.63092,30.772958;120.705078,30.794194;120.733917,30.754667;120.654953,30.723978|120.674912,30.930576;120.680576,30.93087;120.681006,30.928294;120.678002,30.927116&avoidroad=',
        // url:'https://restapi.amap.com/v3/direction/driving?key=d293b754400cc855f849e87fb2c941ad&origin=120.167738,30.251218&destination=120.683666,31.292562&&originid=120.167738,30.251218&destinationid=120.683666,31.292562&extensions=base&strategy=0&waypoints=&avoidroad=',
      }).then((response) => {          //这里使用了ES6的语法
        var data = response.data.route.paths[0].steps;
        // console.log(data);
        for (var i = 0; i < data.length; i++) {
          let paths = data[i].polyline;
          let pathlist = paths.split(';');
          that.pathlists.push(pathlist)
        }
        for (var i = 0; i < that.pathlists.length; i++) {
          for (var j = 0; j < that.pathlists[i].length; j++) {
            let path_one = {};
            path_one.x = that.pathlists[i][j].split(',')[0];
            path_one.y = that.pathlists[i][j].split(',')[1];
            that.pathParams.push(path_one)
          }
        }
        var path3 = [];
        for (var i = 0; i < that.pathParams.length; i += 1) {
          path3.push([that.pathParams[i].x, that.pathParams[i].y])
        }
        var oldLine3 = new AMap.Polyline({
          path: path3,
          strokeWeight: 8,
          strokeOpacity: 1,
          strokeColor: 'red'
        })
        that.map.add(oldLine3);
        that.map.setFitView();
      }).catch((error) => {
        console.log(error)       //请求失败返回的数据
      })


      //红色路线
      // var pathParam = [
      //   {"x": 120.43759, "y": 30.475309, "sp": 19, "ag": 0, "tm": 1478031031},
      //   {"x": 120.435938, "y": 30.481319, "sp": 10, "ag": 0, "tm": 2},
      //   {"x": 120.43568, "y": 30.483131, "sp": 10, "ag": 110, "tm": 3},
      //   {"x": 120.435465, "y": 30.48879, "sp": 10, "ag": 120, "tm": 4},
      //   {"x": 120.435337, "y": 30.496445, "sp": 10, "ag": 120, "tm": 5},
      //   {"x": 120.435165, "y": 30.503877, "sp": 10, "ag": 30, "tm": 6},
      //   {"x": 120.434435, "y": 30.506096, "sp": 10, "ag": 30, "tm": 7},
      //   {"x": 120.433835, "y": 30.506761, "sp": 10, "ag": 30, "tm": 8},
      //   {"x": 120.429329, "y": 30.509682, "sp": 10, "ag": 30, "tm": 9},
      //   {"x": 120.427269, "y": 30.511826, "sp": 10, "ag": 30, "tm": 10},
      //   {"x": 120.428642, "y": 30.512677, "sp": 10, "ag": 30, "tm": 11},
      //   {"x": 120.432161, "y": 30.517113, "sp": 10, "ag": 30, "tm": 12},
      //   {"x": 120.438598, "y": 30.521365, "sp": 10, "ag": 30, "tm": 13},
      //   {"x": 120.445207, "y": 30.528019, "sp": 10, "ag": 30, "tm": 14},
      //   {"x": 120.454949, "y": 30.53556, "sp": 10, "ag": 30, "tm": 15},
      //   {"x": 120.469154, "y": 30.541511, "sp": 10, "ag": 30, "tm": 16},
      //   {"x": 120.482501, "y": 30.546094, "sp": 10, "ag": 30, "tm": 17},
      //   {"x": 120.483445, "y": 30.546833, "sp": 10, "ag": 30, "tm": 18},
      //   {"x": 120.484174, "y": 30.547831, "sp": 10, "ag": 30, "tm": 19},
      //   {"x": 120.491685, "y": 30.56084, "sp": 10, "ag": 30, "tm": 20},
      //   {"x": 120.492794, "y": 30.5619, "sp": 10, "ag": 30, "tm": 21},
      //   {"x": 120.505497, "y": 30.572394, "sp": 10, "ag": 30, "tm": 22},
      //   {"x": 120.511677, "y": 30.583774, "sp": 10, "ag": 30, "tm": 23},
      //   {"x": 120.518543, "y": 30.591311, "sp": 10, "ag": 30, "tm": 24}]
      // var path1 = [];
      // for (var i = 0; i < pathParam.length; i += 1) {
      //   path1.push([pathParam[i].x, pathParam[i].y])
      // }
      // var oldLine = new AMap.Polyline({
      //   path: path1,
      //   strokeWeight: 8,
      //   strokeOpacity: 1,
      //   strokeColor: 'red'
      // })
      // that.map.add(oldLine)
      //
      // var pathParam2 = [
      //   {"x": 120.289875, "y": 30.375172, "sp": 19, "ag": 0, "tm": 1478031031},
      //   {"x": 120.327641, "y": 30.368656, "sp": 10, "ag": 0, "tm": 2},
      //   {"x": 120.399738, "y": 30.391166, "sp": 10, "ag": 110, "tm": 3},
      //   {"x": 120.453983, "y": 30.40005, "sp": 10, "ag": 120, "tm": 4},
      //   {"x": 120.519558, "y": 30.417223, "sp": 10, "ag": 120, "tm": 5},
      //   {"x": 120.645214, "y": 30.408341, "sp": 10, "ag": 120, "tm": 6}]
      // var path2 = [];
      // for (var i = 0; i < pathParam2.length; i += 1) {
      //   path2.push([pathParam2[i].x, pathParam2[i].y])
      // }
      // var oldLine2 = new AMap.Polyline({
      //   path: path2,
      //   strokeWeight: 8,
      //   strokeOpacity: 1,
      //   strokeColor: 'red'
      // })
      // that.map.add(oldLine2);
      // that.map.setFitView();

      // 创建面覆盖物
      for (let i = 0; i < that.polygon.length; i++) {
        that.polygonPath = [];
        let poly = that.polygon[i].polygonPath.split(';');
        for (let j = 0; j < poly.length; j++) {
          let lng = parseFloat(poly[j].split(',')[0]);
          let lat = parseFloat(poly[j].split(',')[1]);
          that.polygonPath.push(new AMap.LngLat(lng, lat))
        }
        that.map.add(new AMap.Polygon({
          path: that.polygonPath,
          fillColor: 'red',
          strokeColor: 'white',
          strokeOpacity: 0.5,
          fillColor: 'red',
          fillOpacity: 0.7
        }))
      }
    },
    methods: {
      add: function () {
        this.show = true;
      }
    },
  }
</script>

<style scoped>
  .info_cont {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: white;
    font-size: 18px;
    text-indent: 30px;
    background: linear-gradient(to right, rgb(112, 175, 226), rgb(59, 120, 165));
  }

  .transport {
    height: 60px;
    line-height: 60px;
    padding-left: 15px;
    border-bottom: 1px solid #aaa;
  }

  .transport input {
    width: 80px;
    height: 30px;
  }

  .map_style {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 800px;
    top: 70px;
  }

  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none;
  }

  #panel .amap-call {
    background-color: #009cf9;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  #panel .amap-lib-driving {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
  }

  .submit_btn {
    width: 80px;
    height: 30px;
    border: none;
    background: #2db7f5;
    border-radius: 5px;
    color: white;
    line-height: 30px;
  }

  #explain {

  }
</style>
