<template>
  <div class="information_box">
    <div class="info_conts info_cont">
      <span>企业信息</span>
    </div>
    <div class="info_cont1 info_cont">
      <span>经办人信息</span>
    </div>
    <div>
      <div class="info_1">
        <div class="info_box text_style" style="width: 10%">经办人</div>
        <div class="info_box" style="width: 50%;padding-left: 15px"><input type="text" v-model="infos.handle_people"></div>
        <div class="info_box text_style" style="width: 10%">电话</div>
        <div class="info_box" style="width: 30%;padding-left: 15px"><input type="text" v-model="infos.tel"></div>
      </div>
      <div class="info_2">
        <div class="info_box text_style" style="width: 10%">mail</div>
        <div class="info_box" style="width: 50%;padding-left: 15px"><input type="text" v-model="infos.mail"></div>
        <div class="info_box text_style" style="width: 10%">邮编</div>
        <div class="info_box" style="width: 30%;padding-left: 15px"><input type="text" v-model="infos.zip_code"></div>
      </div>
      <div class="info_3">
        <div class="info_box text_style" style="width: 10%">传真</div>
        <div class="info_box" style="width: 50%;padding-left: 15px"><input type="text" v-model="infos.pass_value"></div>
        <div class="info_box" style="width: 40%"></div>
      </div>
    </div>
    <div class="info_cont2 info_cont">
      <span>企业基本信息</span>
    </div>
    <div>
      <div class="info_4">
        <div class="info_box text_style" style="width: 10%">企业名称</div>
        <div class="info_box" style="width: 50%;padding-left: 15px">
          <input type="text" v-model="infos.enterprise_name">
        </div>
        <div class="info_box text_style" style="width: 14%">工商注册地址</div>
        <div class="info_box" style="width: 26%;padding-left: 15px"><input type="text" v-model="infos.registered_address"></div>
      </div>
      <div class="info_5">
        <div class="info_box text_style" style="width: 10%">省市县</div>
        <div class="info_box" style="width: 50%;padding-left: 15px">
          <div style="width: 50%;padding-top: 10px">
            <Cascader style="width: 300px;" :data="data" v-model="value2"></Cascader>
          </div>
        </div>
        <div class="info_box text_style" style="width: 14%">邮政编码</div>
        <div class="info_box" style="width: 26%;padding-left: 15px"><input type="text" v-model="infos.zip_code2"></div>
      </div>
      <div class="info_6">
        <div class="info_box text_style" style="width: 10%">单位性质</div>
        <div class="info_box" style="width: 50%;padding-left: 15px">
          生产企业
        </div>
        <div class="info_box text_style" style="width: 14%">成立时间</div>
        <div class="info_box" style="width: 26%;padding-left: 15px">
          <Col span="8">
            <DatePicker type="date" :value="time" placeholder="Select date"></DatePicker>
          </Col>
        </div>
      </div>
      <div class="info_7">
        <div class="info_box text_style" style="width: 10%">工商营业执照编号</div>
        <div class="info_box" style="width: 50%;padding-left: 15px">
          <input type="text" v-model="infos.license_number">
        </div>
        <div class="info_box text_style" style="width: 14%">工商营业执照生产范围</div>
        <div class="info_box" style="width: 26%;padding-left: 15px"><input type="text" v-model="infos.production_scope"></div>
      </div>
      <div class="info_8">
        <div class="info_box text_style" style="width: 10%">法定代表人</div>
        <div class="info_box" style="width: 50%;padding-left: 15px">
          <input type="text" v-model="infos.legal_representative">
        </div>
        <div class="info_box text_style" style="width: 14%">经济类型</div>
        <div class="info_box" style="width: 26%;padding-left: 15px">
            <Select v-model="model1" placeholder="请选择经济类型大类" style="width:150px">
              <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          <Select v-model="model2" placeholder="请选择经济类型小类" style="width:150px">
            <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
      <div class="info_9">
        <div class="info_box text_style" style="width: 10%">组织机构代码</div>
        <div class="info_box" style="width: 50%;padding-left: 15px">
          <input type="text" v-model="infos.organizational_code">
        </div>
        <div class="info_box text_style" style="width: 14%">生产场所地址(多条,分割)</div>
        <div class="info_box" style="width: 26%;padding-left: 15px">
          <textarea name="" id="" cols="50" rows="1" v-model="infos.production_address" style="height: 40px;margin-top: 5px;resize: none;width: 300px;line-height: 25px;text-indent: 8px"></textarea>
        </div>
      </div>
    </div>
    <div style="text-align: center;margin-top: 30px">
      <button class="submit_btn">保存</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "information",
    data() {
      return {
        infos:{
          handle_people:'李四',
          tel:13156589456,
          mail:'2153444121@qq.com',
          zip_code:430018,
          pass_value:'kjdhhffb',
          enterprise_name:'杭州科技股份有限公司',
          registered_address:'杭州市西湖区1100号',
          zip_code2:430000,
          license_number:85288111884155488,
          production_scope:'信息技术服务',
          legal_representative:'李四',
          organizational_code:95202851225855225,
          production_address:"杭州市西湖区10052号"
        },
        time:'2016-01-01',
        value2: ['hangzhou', 'yuhangqu'],
        cityList1: [
          {
            value: '经济类型大类一',
            label: '经济类型大类一'
          },
          {
            value: '经济类型大类二',
            label: '经济类型大类二'
          }
        ],
        model1: '经济类型大类二',
        cityList2: [
          {
            value: '经济类型小类一',
            label: '经济类型小类一'
          },
          {
            value: '经济类型小类二',
            label: '经济类型小类二'
          }
        ],
        model2: '经济类型小类二',
        data: [{
          value: 'hangzhou',
          label: '杭州市',
          children: [
            {
              value: 'xihuqu',
              label: '西湖区'
            },
            {
              value: 'yuhangqu',
              label: '余杭区'
            },
            {
              value: 'jiangganqu',
              label: '江干区'
            }
          ]
        }, {
          value: 'jiangsu',
          label: '江苏',
          children: [
            {
              value: 'nanjing',
              label: '南京',
              children: [
                {
                  value: 'fuzimiao',
                  label: '夫子庙',
                }
              ]
            },
            {
              value: 'suzhou',
              label: '苏州',
              children: [
                {
                  value: 'zhuozhengyuan',
                  label: '拙政园',
                },
                {
                  value: 'shizilin',
                  label: '狮子林',
                }
              ]
            }
          ],
        }]
      }
    }
  }
</script>

<style scoped>
  .text_style{
    text-indent: 15px;
  }
  .input_style{
    padding-left: 15px;
  }
  .info_cont{
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: white;
    font-size: 18px;
  }
  .info_conts{
    text-indent: 30px;
    background: linear-gradient(to right, rgb(112,175,226),rgb(59,120,165));
  }
  .info_cont1{
    background: linear-gradient(to right, rgb(1,137,199),rgb(3,189,240));
    text-indent: 3px;
  }
  .info_cont2{
    background: linear-gradient(to right, rgb(1,93,166),rgb(1,118,197));
    text-indent: 3px;
  }
  .info_1,.info_2,.info_3,.info_4,.info_5,.info_6,.info_7,.info_8,.info_9{
    display: flex;
  }
  .info_box{
    height: 50px;
    border: 1px solid #aaa;
    line-height: 50px;
    background: rgb(238,238,238);
  }
  .info_box input{
    width: 300px;
    height: 35px;
  }
 .submit_btn{
   width: 80px;
   height: 30px;
   border: none;
   background: #2db7f5;
   border-radius: 5px;
   color: white;
 }
</style>
