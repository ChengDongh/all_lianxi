<template>
  <div>
    <navLeft></navLeft>
    <div class="right_box">
      <div class="search_top">
        <Row>
          <Col span="2">
            <span style="font-size: 14px">按时间查询: </span>
          </Col>
          <Col span="4">
            <DatePicker size="small" v-model="data" type="month" placeholder="Select date"></DatePicker>
          </Col>
          <Col span="4">
            <Button type="primary" @click="search">搜索</Button>
          </Col>
          <Row span="8" type="flex" justify="end">
            <a :href="exports"><Button style="margin-right: 80px" type="primary">导出</Button></a>
          </Row>
        </Row>
      </div>
      <div class="from">
        <div style="text-align: center;font-size: 16px;margin-bottom: 10px">{{msg}}</div>
        <Table :loading="loading" stripe :columns="columns1" :data="data1"></Table>
      </div>
    </div>
  </div>
</template>

<script>
  import navLeft from '@/components/nav_left'
  import {post} from '../libs/ajax'
  import {exportMonth} from '../libs/commons'
  export default {
    name: "vehicle_online",
    components: {
      navLeft
    },
    data(){
      return{
        data:new Date(),
        msg: '',
        loading:true,
        columns1: [
        ],
        data1: [

        ]
      }
    },
    created(){
        this.search();
    },
    methods:{
      search(){
        var that = this;
        that.columns1 = [];
        that.loading = true;
        var year = that.data.getFullYear();
        var month = that.data.getMonth() + 1
        var data = {
          year:year,
          month:month
        }
        post('/DCOnlineRank', data, function(res) {
          if (res.code == 0) {
            for (let msg in res.data.data) {
              that.msg = msg;
              let titles = res.data.data[msg].title;
              for (let i = 0; i < titles.length; i++) {
                let object = {};
                object.title = titles[i];
                that.columns1.push(object)
              }
              that.columns1[0].key = 'id'
              that.columns1[1].key = 'name'
              that.columns1[1].className='tab_sty'
              that.columns1[2].key = 'install_car'
              that.columns1[3].key = 'location_car'
              that.columns1[4].key = 'out_online_car'
              that.columns1[5].key = 'online'
            }
            that.loading = false
          } else {
            that.$Message.info(res.msg)
          }
        })
      }
    },
    computed:{
      exports:function () {
        var now=new Date();
        var y=now.getFullYear();
        var m=now.getMonth()+1;
        return exportMonth(y,m,'DCOnlineRank')
      }
    }
  }
</script>

<style scoped>

</style>
