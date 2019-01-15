<template>
  <div>
    <Form ref="FormOne" :model="FormOne" :rules="ruleFormOne" :label-width="80">
      <FormItem label="姓名" prop="name">
        <i-input type="text" v-model="FormOne.name"></i-input>
      </FormItem>
      <FormItem label="身份证" prop="idCard">
        <i-input type="text" v-model="FormOne.idCard"></i-input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('FormOne')">提 交</Button>
        <Button @click="handleReset('FormOne')" style="margin-left: 8px">重 置</Button>
      </FormItem>
    </Form>
    <Page ref="page" :total="100" :current="current" show-elevator @on-change="page_change"/>
    <Button type="primary" @click="to">跳转</Button>
    <div>
      <Table border ref="selection" :columns="columns4" :data="data1" @on-select="change_1" @on-select-cancel="change_4"
             @on-select-all-cancel="change_3" @on-select-all="change_2" @on-row-click="row_a"></Table>
      <!--<Button @click="handleSelectAll(true)">Set all selected</Button>-->
      <!--<Button @click="handleSelectAll(false)">Cancel all selected</Button>-->
      <Button @click="remove">删除</Button>
    </div>
    <Col span="12">
      <DatePicker @on-open-change="info" v-model="data" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker>
    </Col>
    <Button @click="start">Start</Button>
    <Button @click="finish">Finish</Button>
    <Button @click="error">Error</Button>
  </div>
</template>

<script>
  import Format from "../js/Format.js"

  export default {
    name: 'HelloWorld',
    data() {
      return {
        value2: ['2016-01-01', '2016-02-15'],
        data:'',
        FormOne: {
          name: "",
          idCard: "",
          age: ""
        },
        current: 3,
        ruleFormOne: {
          name: [
            {
              validator: Format.FormValidate.FormOne().Name,
              trigger: "blur"
            }
          ],
          idCard: [
            {
              validator: Format.FormValidate.Form().ID,
              trigger: "blur"
            }
          ]
        },
        columns4: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          },
          {
            title: '操作',
            key: 'address',
            render:(h, params) => {
              return h('div', [
                h('strong', {
                  style: {
                    marginRight: '5px'
                  },
                }, '处理'),
                h('i-switch', { //数据库1是已处理，0是未处理
                  props: {
                    type: 'primary',
                    value: params.row.treatment == true  //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  scopedSlots:{
                    open:()=>h('span','开'),
                    close:()=>h('span','关')
                  },
                  on: {
                    'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      console.log(params.index)
                      console.log(params.row)
                      // this.switch(params.index) //params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                }, )
              ]);
            }
          }
        ],
        data1: [
          {
            id: 12,
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03',
            _checked: false,
            treatment:true,

          },
          {
            id: 8,
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01',
            _checked: true,
            treatment:true,
          },
          {
            id: 129,
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02',
            _checked: false,
            treatment:true,
          },
          {
            id: 102,
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04',
            _checked: false,
            treatment:true,
          }
        ],
        selection: [],
      };
    },
    mounted() {
      // console.log(Format.FormValidate.FormOne().name);
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.$Message.success("Success!");
          } else {
            this.$Message.error("Fail!");
          }
        });
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      page_change(val) {
        console.log(val)
        // console.log(this.current)
      },
      change_1(selection, row) {
        for (let i in this.data1) {
          if (this.data1[i].id == row.id) {
            this.data1[i]._checked = !this.data1[i]._checked
          }
        }
      },
      change_4(selection, row) {
        for (let i in this.data1) {
          if (this.data1[i].id == row.id) {
            this.data1[i]._checked = !this.data1[i]._checked
          }
        }
      },
      change_2() {
        for (let i in this.data1) {
          this.data1[i]._checked = true;
        }
      },
      change_3() {
        for (let i in this.data1) {
          this.data1[i]._checked = false;
        }
      },
      row_a(val, index) {
        // this.data1[index]._checked = !this.data1[index]._checked;
      },
      remove() {
        for (var i=0;i<this.data1.length;i++) {
          if (this.data1[i]._checked == true) {
            this.data1.splice(i, 1);
            i = i - 1
          }
        }
      },
      //为ivew的Page组件的跳页增加跳页确定按钮
      to() {
        let t_value = this.$refs.page.$el.lastElementChild.lastElementChild.childNodes[1].value;
        if (t_value == "") {
          this.$Message.info('请填写页数');
          return false;
        }
        if (t_value > 10) {
          this.$Message.info('超过总页数，无法跳转');
          this.$refs.page.$el.lastElementChild.lastElementChild.childNodes[1].value = this.current;
          return false;
        }
        this.current = parseInt(t_value);
        // this.getData();//请求后台数据方法
      },
      info(val){
        if(val == false){
          if(this.data[0] && this.data[1]){
            console.log(this.data[0].getTime(),this.data[1].getTime())
          }
        }
      },
      start () {
        this.$Loading.start();
        setTimeout(()=>{
          this.$Loading.finish();
        },3000)
      },
      finish () {
        this.$Loading.finish();
      },
      error () {
        this.$Loading.error();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
