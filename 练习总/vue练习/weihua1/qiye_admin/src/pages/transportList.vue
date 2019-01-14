<template>
  <div class="transportList_box">
    <div class="info_cont">
      <span>化工运输信息</span>
    </div>
    <div class="contents">
      <Table :columns="columns1" :data="data1"></Table>
    </div>
    <div style="text-align: center;margin-top: 30px">
      <button class="submit_btn" @click="add">新增</button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "transportList",
      data() {
        return {
          columns1: [
            {
              title: '目的地',
              key: 'address',
              width:220
            },
            {
              title: '出发时间',
              key: 'start_time'
            },
            {
              title: '预计到达时间',
              key: 'end_time'
            },
            {
              title: '选择车辆',
              key: 'car_choose'
            },
            {
              title: '所用容器',
              key: 'container'
            },
            {
              title: '数量',
              key: 'number'
            },
            {
              title: '操作',
              key: 'operation',
              render:(h,params) => {
                console.log(params)
                return h('div',[
                  h('Button', {
                    props: {
                      type: 'primary',
                    },
                    style: {
                      width: '80%',
                      display: 'flex',
                      'justify-content': 'center',
                      background: "#00A0E8"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          path:'/transport'
                        })
                      },
                    },
                  }, '修改')
                  ]
                )}
            }
          ],
          data1: [
            {
              address: '金华市星辰化工有限公司/仓库一',
              start_time: '2018-12-19 15:38:00',
              end_time: '2018-12-19 20:32:00',
              car_choose: '浙ASS002',
              container: '罐',
              number: '65',
            },
            {
              address: '金华市星辰化工有限公司/仓库二',
              start_time: '2018-11-09 10:12:26',
              end_time: '2018-11-09 15:34:18',
              car_choose: '浙AFF123',
              container: '箱',
              number: '15',
            }
          ]
        }
      },
      methods:{
        add:function () {
          this.$router.push({
            path:'/transport'
          })
        }
      }
    }
</script>

<style scoped>
  .transportList_box{
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
  .submit_btn{
    position: absolute;
    top: 15px;
    right: 20px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: none;
    background: #2db7f5;
    border-radius: 5px;
    color: white;
  }
</style>
