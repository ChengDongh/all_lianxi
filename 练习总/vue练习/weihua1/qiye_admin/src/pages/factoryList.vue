<template>
  <div class="factoryList_box">
    <div class="info_cont">
      <span>企业厂区信息</span>
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
    name: "factoryList",
    data() {
      return {
        columns1: [
          {
            title: '具体地址',
            key: 'address'
          },
          {
            title: '地图定位',
            key: 'location'
          },
          {
            title: '类型',
            key: 'type'
          }
        ],
        data1: [
          {
            address: '金华市星辰化工有限公司',
            location: '119.709031,29.095456',
            type: '生产厂区',
          },
          {
            address: '金华市宇通化工有限公司',
            location: '119.708125,29.096375',
            type: '生产厂区',
          }
        ]
      }
    },
    methods:{
      add:function () {
        this.$router.push({
          path:'/factory'
        })
      }
    }
  }
</script>

<style scoped>
  .factoryList_box{
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
