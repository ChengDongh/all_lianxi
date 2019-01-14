<template>
  <div>
    <div v-if="Ismodel"
         style="width: 100vw;height: 100vh;position: absolute;background: #aaa;z-index: 999;opacity: 0.5"></div>
    <navLeft></navLeft>
    <div class="right_box">
      <div class="search_top">
        <Row>
          <Col span="7">
            <Input id="input_search" v-model="value" placeholder="请输入车牌号" style="width: 300px"/>
          </Col>
          <Col span="2">
            <Button type="primary" @click="search">搜索</Button>
          </Col>
        </Row>
      </div>
      <div class="search_content">
        <div style="width: 50vw;display: inline-block" v-if="showBox">
          <div>
            <Row>
              <Col span="24">
                <Table :columns="columns1" :data="data1"></Table>
              </Col>
            </Row>
          </div>
          <div style="margin-top: 20px">
            <span style="display:inline-block;margin-bottom: 10px">包装性能信息</span>
            <Row>
              <Col span="24">
                <Table :columns="columns2" :data="data2"></Table>
              </Col>
            </Row>
          </div>
          <div style="margin-top: 20px">
            <span style="display:inline-block;margin-bottom: 10px">运载品清单</span>
            <Row>
              <Col span="24">
                <Table :columns="columns3" :data="data3"></Table>
              </Col>
            </Row>
          </div>
        </div>
        <div v-show="showBox" style="width:27vw;height:50vh;display: inline-block;vertical-align: top;margin-left: 24px;position: absolute;right: 25px">
          <div style="width: 100%;height: 100%;" id="container" class="map"></div>
        </div>
      </div>
      <div id="table4" v-cloak v-if="Isinstructions">
        <span style="margin-top: 10px;font-size: 18px;display: block;text-align: center">化学品安全技能说明书详情</span><span
        style="position: absolute;top:0px;font-size: 18px;right: 10px;cursor: pointer"
        @click="instructions_close">X</span>
        <ul style="width: 560px;border: 1px solid #aaa;margin: 30px 120px 30px 120px;max-height: 600px;overflow: auto;">
          <li><span>1.危险产品及企业标识</span></li>
          <li style="margin-bottom: 5px"><span>产品识别者</span></li>
          <li><span>化学品中文(英文)名称，化学品俗名或商品名</span></li>
          <li style="margin-bottom: 5px"><span>原材料的应用/准备工作进行</span></li>
          <li><span>安全技术说明书内供应商详细信息</span></li>
          <li><span>企业名称: </span><span>*******</span></li>
          <li><span>制作商: </span><span>************</span></li>
          <li><span>地址: </span><span>*****************</span></li>
          <li style="margin-bottom: 5px"><span>电话: </span><span>*****************</span></li>
          <li><span>可获取更多资料的部门: </span><span>*******</span></li>
          <li><span>健康安全环保部(工作日，9点到下午5点): </span><span>************</span></li>
          <li style="margin-bottom: 5px"><span>紧急联系电话号码: </span><span>*****************</span></li>
          <li><span>2.危险特性概述</span></li>
          <li><span>紧急情况概述: </span><span style="margin-left: 10px">淡绿色、液体，可能腐蚀金属。引起严重的皮肤灼伤和眼睛损伤，可刺激呼吸道</span></li>
          <li><span>GHS危险性类别: </span><span style="margin-left: 10px">a.金属腐蚀性 第一类&nbsp&nbsp&nbsp&nbsp&nbsp H290 可能腐蚀金属;&nbsp&nbsp b.皮肤腐蚀/刺激 第18类&nbsp&nbsp&nbsp&nbsp&nbsp H314引起严重的皮肤灼伤和眼睛损伤，可刺激呼吸道;&nbsp&nbsp c.严重眼睛损伤/眼睛刺激性 第一类&nbsp&nbsp&nbsp&nbsp&nbsp H318引起严重的眼睛损伤</span>
          </li>
          <li><span>GHS卷标元素: </span><span style="margin-left: 10px">本产品根据化学物质分类及标志全球协调制度(GHS)进行分类及标志。</span></li>
          <li><span style="vertical-align: top">图示: </span><span style="margin-left: 10px;display: inline-block"><img
            style="width: 40px;height: 40px;display: block"
            src="http://cdn.qiqiangkeji.com/20181220.a28eaa62a7c51d87e63448e103909c00_388x388.png"
            alt=""><span>GHSCS</span></span></li>
          <li><span>标签上辨别危险的成分: </span><span style="margin-left: 10px">三氯化铬 硝酸</span></li>
          <li><span>危险字句: </span><span style="margin-left: 10px">H290 可能腐蚀金属; H314 引起严重的皮肤灼伤和眼睛损伤 H335 可刺激呼吸道</span>
          </li>
          <li><span>防护措施: </span><span
            style="margin-left: 10px">P260 不要吸入粉层/雾/气体/烟雾/煤气/喷雾; P280 戴防护手套/穿防护服/戴防护眼罩/戴防护面具</span></li>
          <li><span>事故响应: </span><span style="margin-left: 10px">P303+P361+P353 如皮肤(或头发)沾染: 立即脱掉所有沾染的衣服。用水清洗皮肤/淋浴。 P305+P351+P338 如进入眼睛: 用水小心冲洗几分钟。如戴隐形眼睛并可方便地取出，取出隐形眼睛，继续冲洗。 P310 立即呼叫解毒中心/医生 P321 具体治疗(见本标签上的)</span>
          </li>
          <li><span>安全储存: </span><span style="margin-left: 10px">P405 存放处须加锁。 P406 贮存于抗腐蚀/带抗腐蚀性的容器中。</span></li>
          <li><span>废弃处理: </span><span style="margin-left: 10px">按照本地/地区/国家/国际规则内含物/容器。</span></li>
        </ul>
      </div>
      <div id="table5" v-cloak v-if="Isreport">
        <span style="margin-top: 10px;font-size: 18px;display: block;text-align: center">危险特性分析鉴别报告详情</span><span
        style="position: absolute;top:0px;font-size: 18px;right: 10px;cursor: pointer" @click="report_close">X</span>
        <ul style="width: 560px;border: 1px solid #aaa;margin: 30px 120px 30px 120px;max-height: 600px;overflow: auto;">
          <li style="margin-bottom: 3px"><span>1.正式运输名称:</span><span
            style="margin-left: 10px">腐蚀性液体,为另作规定的(含氟化铬和硝酸)</span></li>
          <li style="margin-bottom: 3px"><span>2.联合国编号</span><span style="margin-left: 10px">UN 1760</span></li>
          <li style="margin-bottom: 3px"><span>3.危险货物类别</span><span style="margin-left: 10px">第8类 腐蚀性物质/Class 8 Corrosive Substance</span>
          </li>
          <li><span>4.建议包装类别</span><span style="margin-left: 10px">PG II</span></li>
          <li style="margin-bottom: 3px"><span style="vertical-align: middle">5.运输表签:</span><span
            style="margin-left: 10px;display: inline-block;vertical-align: middle"><img
            style="width: 40px;height: 40px;display: block;"
            src="http://cdn.qiqiangkeji.com/20181220.a28eaa62a7c51d87e63448e103909c00_388x388.png" alt=""></span></li>
          <li style="margin-bottom: 3px"><span style="vertical-align: middle">6.GHS象形图:</span><span
            style="margin-left: 10px;display: inline-block;vertical-align: middle"><img
            style="width: 40px;height: 40px;display: block"
            src="http://cdn.qiqiangkeji.com/20181220.a28eaa62a7c51d87e63448e103909c00_388x388.png" alt=""></span></li>
          <li style="margin-bottom: 3px"><span>7.GHS分类:</span><span style="margin-left: 10px">金属腐蚀性 1类/Corrosive to metals 1: 皮肤腐蚀/刺激 1B类/Skin corrosion/initation 1B</span>
          </li>
          <li style="margin-bottom: 3px"><span>8.是否属于《危险化学品目录》(2015版)列明的化学品:</span><span style="margin-left: 10px">否 (查询样品名"SurTee 662三阶铬抗回火",未列入《危险化学品目录》(2015版))</span>
          </li>
          <li><span>&nbsp&nbsp 是否属于《危险化学品目录》(2015版)中关于"危险化学品的定义和特殊原则":</span><span style="margin-left: 10px"> 是</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import navLeft from '@/components/nav_left'
  import {formatDate} from '../libs/commons'
  import {get} from '../libs/ajax'
  import $ from 'jquery'
  export default {
    name: "real_time_monitoring",
    components: {
      navLeft
    },
    data() {
      return {
        value: "浙AFF123",
        Isinstructions: false,
        Isreport: false,
        Ismodel: false,
        showBox:false,
        columns1: [
          {
            title: '目的地',
            key: 'address'
          },
          {
            title: '出发时间',
            key: 'start_time',
            render: (h, params) => {
              return h('div',
                formatDate(params.row.start_time)
              )
            }
          },
          {
            title: '预计到达时间',
            key: 'end_time',
            render: (h, params) => {
              return h('div',
                formatDate(params.row.end_time)
              )
            }
          }
        ],
        data1: [
          {
            address: '金华市星辰化工有限公司/仓库一',
            start_time: "1546935765",
            end_time: '1547022165',
          }
        ],
        columns2: [
          {
            title: '包装容器名称及规格',
            key: 'specifications'
          },
          {
            title: '包装容器标记及批号',
            key: 'batch_number',
          },
          {
            title: '包装容器及数量',
            key: 'number',
          }
        ],
        data2: [
          {
            specifications: '闭口塑料罐 25L皮重1.6kg',
            batch_number: "3H1/Y1.8/100/17CN/33000402",
            number: '500',
          }
        ],
        columns3: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '数量',
            key: 'number',
            width: 60
          },
          {
            title: '单位',
            key: 'company',
            width: 60
          },
          {
            title: '安全技术说明书(SDS)',
            key: 'Instructions',
            width: 160,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginLeft: '15px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看详情')
              ]);
            }
          },
          {
            title: '危险特性鉴别报告',
            key: 'report',
            width: 160,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginLeft: '15px'
                  },
                  on: {
                    click: () => {
                      this.show_1(params.index)
                    }
                  }
                }, '查看详情')
              ]);
            }
          }
        ],
        data3: [
          {
            name: '三硝基甲苯与硝基萘混合物梯萘炸药',
            number: 30,
            company: '桶',
            Instructions: '666',
            report: '999'
          },
          {
            name: '三硝基甲苯与硝基萘混合物梯萘炸药',
            number: 30,
            company: '桶',
            Instructions: '666',
            report: '999'
          }
        ],
        map:"",
      }
    },
    mounted(){
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 8
      });
    },
    methods: {
      search: function () {
        var that = this;
        that.polyline = '';
        that.pathParams = [];
        that.pathlists = [];
        that.showBox = false;
        if (that.value.trim() == '') {
          that.$Message.info('请输入车牌号');
          return false;
        } else {
          get('https://restapi.amap.com/v3/direction/driving?key=d293b754400cc855f849e87fb2c941ad&origin=120.167738,30.251218&destination=120.683666,31.292562&originid=&destinationid=&extensions=base&strategy=0&waypoints=&avoidpolygons=120.63092,30.772958;120.705078,30.794194;120.733917,30.754667;120.654953,30.723978&avoidroad=', null, function (res) {
            if (res.infocode == 10000) {
              that.showBox = true;
              var data = res.route.paths[0].steps;
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
              var path = [];
              for (var i = 0; i < that.pathParams.length; i += 1) {
                path.push([that.pathParams[i].x, that.pathParams[i].y])
              }
              var oldLine = new AMap.Polyline({
                path: path,
                strokeWeight: 8,
                strokeOpacity: 1,
                strokeColor: 'red'
              })
              that.map.add(oldLine);
              that.map.setFitView();
              var startIcon = new AMap.Icon({
                // 图标尺寸
                size: new AMap.Size(40, 40),
                // 图标的取图地址
                image: 'http://cdn.qiqiangkeji.com/20181228.ce988210a9a8dad9a164a5aa8b84f0e8_720x720.png',
                // 图标所用图片大小
                imageSize: new AMap.Size(40, 40),
                // 图标取图偏移量
              });
              // 将 icon 传入 marker
              var startMarker = new AMap.Marker({
                position: new AMap.LngLat(120.528383, 30.727892),
                icon: startIcon,
                offset: new AMap.Pixel(-40, -10)
              });
              that.map.add(startMarker);
            } else {
              that.$Message.info(res.msg)
            }
          }, 1)
        }
      },
      show() {
        // if (this.Isreport == false) {
          this.Isinstructions = true;
          this.Ismodel = true;
        // }
      },
      show_1() {
        // if (this.Isinstructions == false) {
          this.Isreport = true;
          this.Ismodel = true;
        // }
      },
      instructions_close() {
        this.Isinstructions = false;
        this.Ismodel = false;
      },
      report_close() {
        this.Isreport = false;
        this.Ismodel = false;
      }
    }
  }
</script>

<style scoped>
  .search_content {
    margin-top: 20px;
  }

  #table4, #table5 {
    position: relative;
    width: 800px;
    max-height: 700px;
    background: white;
    top: -450px;
    border: 1px solid #d9d9d9;
    z-index: 9999;
    text-align: left;
    padding-left: 10px;
    border-radius: 5px;
    margin: 0 auto;
    z-index: 99999;
  }

  [v-cloak] {
    display: none;
  }
</style>
