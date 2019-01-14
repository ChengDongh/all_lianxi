<template>
  <div class="packingList_box">
    <div class="info_cont">
      <span>包装容器信息</span>
    </div>
    <div class="contents">
      <Table :columns="columns1" :data="data1" ref="table"></Table>
    </div>
    <div style="text-align: center;margin-top: 30px">
      <button class="submit_btn" @click="add">新增</button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "packingList",
      data() {
        return {
          columns1: [
            {
              title: '包装物名称',
              key: 'package_name',
            },
            {
              title: '所在厂区',
              key: 'package_address',
            },
            {
              title: '包装类型',
              key: 'package_type',
            },
            {
              title: '包装材料',
              key: 'package_science',
            },
            {
              title: '包装级别',
              key: 'package_level',
            }
          ],
          data1: [
            {
              package_name: '三硝基甲苯',
              package_address: '生产厂区一',
              package_type: '桶',
              package_science: '塑料',
              package_level:'Ⅱ级',
            },
            {
              package_name: '乙酸乙酯(醋酸乙酯)',
              package_address: '生产厂区二',
              package_type: '瓶',
              package_science: '玻璃',
              package_level:'Ⅲ级',
            }
          ]
        }
      },
      methods:{
        add:function () {
          this.$router.push({
            path:'/packing'
          })
        }
      }
    }
</script>

<style scoped>
  .packingList_box{
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
