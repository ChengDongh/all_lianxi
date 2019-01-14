<template>
  <div class="car_box">
    <div class="car_cont">
      <span>运输车辆信息登记</span>
    </div>
    <div class="car">
      <div class="car_boxs" style="width: 10%">车牌号</div>
      <div class="car_boxs" style="width: 40%;padding-left: 1px"><input type="text" v-model="infos.plate_number"></div>
      <div class="car_boxs" style="width: 10%">所在厂区</div>
      <div class="car_boxs" style="width: 40%">
        <Select v-model="model1" placeholder="请选择厂区" style="width:200px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="car">
      <div class="car_boxs" style="width: 10%">行驶证</div>
      <div class="car_boxs" style="width: 40%;padding-left: 1px"><input type="text" v-model="infos.travel_num"></div>
      <div class="car_boxs" style="width: 10%">运营证</div>
      <div class="car_boxs" style="width: 40%"><input type="text" v-model="infos.operate_num"></div>
    </div>
    <div style="text-align: center;margin-top: 30px">
      <button class="submit_btn">保存</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "car",
    data () {
      return {
        infos:{
          plate_number:"浙AFF123",
          travel_num:"LMGBF1G89C1006638",
          operate_num:"浙b2-20150510"
        },
        cityList: [
          {
            value: '生产厂区一',
            label: '生产厂区一'
          },
          {
            value: '仓库二',
            label: '仓库二'
          },
          {
            value: '厂库三',
            label: '仓库三'
          }
        ],
        model1: '生产厂区一'
      }
    }
  }
</script>

<style scoped>
  .car_cont {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: white;
    font-size: 18px;
    text-indent: 30px;
    background: linear-gradient(to right, rgb(112, 175, 226), rgb(59, 120, 165));
  }
  .car {
    display: flex;
  }
  .car_boxs {
    height: 50px;
    border: 1px solid #aaa;
    line-height: 50px;
    text-indent: 15px;
    background: rgb(238, 238, 238);
  }

  .car_boxs input {
    width: 300px;
    height: 35px;
  }

  .submit_btn {
    width: 80px;
    height: 30px;
    border: none;
    background: #2db7f5;
    border-radius: 5px;
    color: white;
  }
</style>
