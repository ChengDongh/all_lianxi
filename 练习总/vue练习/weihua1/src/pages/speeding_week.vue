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
            <DatePicker size="small" v-model="data" type="date" placeholder="Select date"></DatePicker>
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
  import {exportDay} from '../libs/commons'

  export default {
    name: "speeding_week",
    components: {
      navLeft
    },
    data() {
      return {
        data: new Date(),
        msg: '',
        loading:true,
        columns1: [
        ],
        data1: [

        ]
      }
    },
    created() {
        this.search()
    },
    methods: {
      search() {
        var that = this;
        that.columns1 = [];
        that.loading = true;
        var data = {
          day: Math.round(this.data.getTime() / 1000)
        }
        post('/NativeGnss', data, function (res) {
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
              that.columns1[2].key = 'b_week'
              that.columns1[3].key = 's_week'
              that.columns1[4].key = 'Percentage'
            }
            that.loading = false
          } else {
            that.$Message.info(res.msg);
          }
        })
      },
    },
    computed:{
      exports:function () {
          var now=(new Date()).getTime();
          var str=exportDay(now,"NativeGnss")
          console.log(str)
          return str
      },
    }
  }
</script>

<style scoped>

</style>
