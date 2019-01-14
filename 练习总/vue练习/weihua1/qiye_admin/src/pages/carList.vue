<template>
    <div class="carList_box">
      <div class="info_cont">
        <span>运输车辆信息</span>
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
        name: "carList",
      data() {
        return {
          columns1: [
            {
              title: '车牌号',
              key: 'plate_number'
            },
            {
              title: '所在厂区',
              key: 'factory_area'
            },
            {
              title: '行驶证',
              key: 'driving_license'
            },
            {
              title: '营运证',
              key: 'taxi_license'
            }
          ],
          data1: [
            {
              plate_number: '浙AFF123',
              factory_area: '生产厂区一',
              driving_license: 'YBHKF1G89C9658538',
              taxi_license:'浙b2-20150510'
            },
            {
              plate_number: '浙AFS005',
              factory_area: '仓库一',
              driving_license: 'LMGBF1G89C1006638',
              taxi_license:'浙a2-13650510'
            }
          ]
        }
      },
      methods:{
        add:function () {
          this.$router.push({
            path:'/car'
          })
        }
      }
    }
</script>

<style scoped>
  .carList_box{
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
