<template>
    <div class="packing_box">
      <div class="packing_cont">
        <span>包装容器登记</span>
      </div>
      <div class="packing">
        <div class="packing_boxs" style="width: 10%">包装物名称</div>
        <div class="packing_boxs" style="width: 40%;padding-left: 1px"><input type="text" v-model="infos.packing_name"></div>
        <div class="packing_boxs" style="width: 10%">所在厂区</div>
        <div class="packing_boxs" style="width: 40%">
          <Select v-model="model1" placeholder="请选择厂区" style="width:200px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
      <div class="packing">
        <div class="packing_boxs" style="width: 10%">包装类型</div>
        <div class="packing_boxs" style="width: 40%;padding-left: 1px">
          <Select v-model="model2" placeholder="请选择包装类型" style="width:200px">
          <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </div>
        <div class="packing_boxs" style="width: 10%">包装材料</div>
        <div class="packing_boxs" style="width: 40%"><input type="text" v-model="infos.material"></div>
      </div>
      <div class="packing">
        <div class="packing_boxs" style="width: 10%">包装级别</div>
        <div class="packing_boxs" style="width: 40%;padding-left: 1px">
          <Select v-model="model3" placeholder="请选择包装级别" style="width:200px">
            <Option v-for="item in cityList3" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="packing_boxs" style="width: 50%"></div>
      </div>
      <div style="text-align: center;margin-top: 30px">
        <button class="submit_btn">保存</button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "packing",
      data () {
        return {
          infos:{
            packing_name:"三硝基甲苯",
            material:"玻璃",
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
          model1: '生产厂区一',
          cityList2: [
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
          model2: '罐',
          cityList3: [
            {
              value: 'Ⅰ级',
              label: 'Ⅰ级'
            },
            {
              value: 'Ⅱ级',
              label: 'Ⅱ级'
            },
            {
              value: 'Ⅲ级',
              label: 'Ⅲ级'
            }
          ],
          model3: 'Ⅰ级'
        }
      }
    }
</script>

<style scoped>
  .packing_cont {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: white;
    font-size: 18px;
    text-indent: 30px;
    background: linear-gradient(to right, rgb(112, 175, 226), rgb(59, 120, 165));
  }
  .packing {
    display: flex;
  }
  .packing_boxs {
    height: 50px;
    border: 1px solid #aaa;
    line-height: 50px;
    text-indent: 15px;
    background: rgb(238, 238, 238);
  }

  .packing_boxs input {
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
