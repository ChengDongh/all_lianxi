<template>
  <div class="chemicals_box">
    <div class="info_cont">
      <span>危化品登记</span>
    </div>
    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%">危险性提示词</div>
      <div class="chemicals_box" style="width: 40%;padding-left: 1px">
        <Select v-model="model1" placeholder="请选择" style="width:200px">
          <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="chemicals_box" style="width: 10%">品名</div>
      <div class="chemicals_box" style="width: 40%"><input type="text" v-model="infos.product_name"></div>
    </div>


    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%">英文名及分子式</div>
      <div class="chemicals_box" style="width: 40%;padding-left: 1px">
        <input type="text" v-model="infos.name_formula">
      </div>
      <div class="chemicals_box" style="width: 10%">CC码及CAS号</div>
      <div class="chemicals_box" style="width: 40%"><input type="text" v-model="infos.cc_code"></div>
    </div>
    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%">危险标志</div>
      <div class="chemicals_box" style="width: 90%;padding-left: 1px">
        <CheckboxGroup v-model="social">
          <Checkbox label="wh1">
            <img src="../assets/wh1.png" alt="">
          </Checkbox>
          <Checkbox label="wh2">
            <img src="../assets/wh2.png" alt="">
          </Checkbox>
          <Checkbox label="wh3">
            <img src="../assets/wh3.png" alt="">
          </Checkbox>
          <Checkbox label="wh4">
            <img src="../assets/wh4.png" alt="">
          </Checkbox>
          <Checkbox label="wh5">
            <img src="../assets/wh5.png" alt="">
          </Checkbox>
        </CheckboxGroup>
      </div>
    </div>
    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%;height: 112px;line-height: 112px">危险性理化数据</div>
      <div class="chemicals_box" style="width: 40%;padding-left: 1px;height: 112px;">
        <textarea name="" cols="50" rows="3" v-model="infos.physicochemical_data"
                  style="height: 100px;margin-top: 5px;resize: none"></textarea>
      </div>
      <div class="chemicals_box" style="width: 10%;height: 112px;line-height: 112px">危险特性</div>
      <div class="chemicals_box" style="width: 40%;height: 112px;">
        <textarea name="" cols="50" rows="3" v-model="infos.characteristics"
                  style="height:100px;margin-top: 5px;resize: none"></textarea>
      </div>
    </div>
    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%;height: 112px;line-height: 112px">接触后表现</div>
      <div class="chemicals_box" style="width: 40%;padding-left: 1px;height: 112px;">
        <textarea name="" cols="50" rows="3" v-model="infos.contact_performance"
                  style="height: 100px;margin-top: 5px;resize: none"></textarea>
      </div>
      <div class="chemicals_box" style="width: 10%;height: 112px;line-height: 112px">现场急救措施</div>
      <div class="chemicals_box" style="width: 40%;height: 112px;">
        <textarea name="" cols="50" rows="3" v-model="infos.measures"
                  style="height:100px;margin-top: 5px;resize: none"></textarea>
      </div>
    </div>
    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%;height: 112px;line-height: 112px">泄漏应急处理</div>
      <div class="chemicals_box" style="width: 40%;padding-left: 1px;height: 112px;">
        <textarea name="" cols="50" rows="3" v-model="infos.emergency_management"
                  style="height: 100px;margin-top: 5px;resize: none"></textarea>
      </div>
      <div class="chemicals_box" style="width: 50%;height: 112px;line-height: 112px"></div>
    </div>
    <div class="chemicals">
      <div class="chemicals_box" style="width: 10%">身体防护措施</div>
      <div class="chemicals_box" style="width: 90%;padding-left: 1px">
        <CheckboxGroup v-model="social2">
          <Checkbox label="f1">
            <img src="../assets/f1.png" alt="">
          </Checkbox>
          <Checkbox label="f2">
            <img src="../assets/f2.png" alt="">
          </Checkbox>
          <Checkbox label="f3">
            <img src="../assets/f3.png" alt="">
          </Checkbox>
          <Checkbox label="f4">
            <img src="../assets/f4.png" alt="">
          </Checkbox>
        </CheckboxGroup>
      </div>
    </div>
    <div style="text-align: center;padding-top: 30px">
      <button class="submit_btn">保存</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "chemicals",
    data() {
      return {
        social: ['wh1', 'wh3'],
        social2: ['f1', 'f4'],
        infos: {
          product_name: '乙酸乙酯(醋酸乙酯)',
          name_formula: 'ethyl acetate',
          cc_code: 'CAS号:141-78-6',
          physicochemical_data: "熔点(℃): -83.6; 沸点(℃): 77.2; 相对密度(水=1): .9",
          characteristics: '易燃,其蒸气与空气可形成爆炸性混合物，遇明火、高热能引起燃烧爆炸,与氧化剂接触猛烈反应。',
          contact_performance: '对眼、鼻、咽喉有刺激作用。高浓度吸入可引进行性麻醉作用，急性肺水肿，肝、肾损害。持续大量吸入，可致呼吸麻痹。',
          measures: '皮肤接触，提起眼脸，用流水清水或生理盐水冲洗，就医。脱去污染的衣着，用肥皂和清水彻底冲洗皮肤。',
          emergency_management:'隔离泄漏的污染区域并限制进入。建议应急人员佩戴自备式呼吸器和防酸碱工作服。尽量切断泄漏源。不要直接接触泄漏。小泄漏：避免灰尘，用干净的铲子在干燥、清洁和有盖的容器中收集，或用大量的水冲洗，稀释并投入废水系统，大泄漏，收集和回收或运输到废物处置场地进行处置。'
        },
        cityList1: [
          {
            value: '易燃',
            label: '易燃'
          },
          {
            value: '易爆',
            label: '易爆'
          },
          {
            value: '有害',
            label: '有害'
          },
          {
            value: '放射性物品',
            label: '放射性物品'
          },
          {
            value: '腐蚀',
            label: '腐蚀'
          },
          {
            value: '刺激性',
            label: '刺激性'
          },
          {
            value: '氧化剂',
            label: '氧化剂'
          },
          {
            value: '感染性物品',
            label: '感染性物品'
          }
        ],
        model1: '易燃'
      }
    }
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

  .chemicals {
    display: flex;
  }

  .chemicals_box {
    height: 50px;
    border: 1px solid #aaa;
    line-height: 50px;
    text-indent: 15px;
    background: rgb(238, 238, 238);
  }

  .chemicals_box input {
    width: 300px;
    height: 35px;
  }

  .chemicals_box img {
    width: 30px;
    height: 30px;
    position: relative;
    top: 10px;
    margin-left: 5px;
  }

  textarea {
    line-height: 25px;
    padding: 0 10px;
  }
  .submit_btn{
    width: 80px;
    height: 30px;
    border: none;
    background: #2db7f5;
    border-radius: 5px;
    color: white;
    line-height: 30px;
  }
</style>
