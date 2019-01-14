<template>
  <div class="componentsA" style="position: relative">
    <!--<P class="title">组件A</P>-->
    <!--<P class="titleName">餐馆名称：{{resturantName}}</P>-->
    <Select v-model="model2" style="width:200px" @on-change="change_all">
      <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }} ({{item.num}})</Option>
    </Select>
    <div style="margin-top: 20px">
      <Select v-model="model1" style="width:200px" @on-change="change_one">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }} ({{item.num}})</Option>
      </Select>
    </div>
    <div style="margin-top: 50px;padding: 0px 20px">
      <Tabs v-model="value" type="card" @on-click="Click">
        <TabPane v-for="(item ,index) in label_children" :label="item.label + '(' + item.num + ')'" :key="index">
          <Table stripe :columns="columns1" :data="data1"></Table>
        </TabPane>
      </Tabs>
    </div>

    <div style="position: absolute;top: 0;right: 100px">
      <!-- 点击修改 为 A 餐馆 -->
      <button class="btn" @click="modifyAName(1)">改变</button>
    </div>
    <!--<div class="marTop">-->
      <!--<button class="btn" @click="trunToB">跳转到B页面</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'componentsA',
    data () {
      return {
        nums:999,
        cityList: [
          {
            value: 0,
            label: 'A组第一组人数',
            num:50,
            label_children:[
              {
                label: 'A1组人数',
                num:8,
                children:[
                  {
                    name: 'John Brown',
                    num: 3,
                  },
                  {
                    name: 'Jim Green',
                    num: 5,
                  }
                ],
              },
              {
                label: 'A2组人数',
                num:12,
                children:[
                  {
                    name: 'Brown',
                    num: 8,
                  },
                  {
                    name: 'Green',
                    num: 4,
                  }
                ],
              },
              {
                label: 'A3组人数',
                num:30,
                children:[
                  {
                    name: 'John',
                    num: 19,
                  },
                  {
                    name: 'Jim',
                    num: 11,
                  }
                ],
              }
            ]
          },
          {
            value: 1,
            label: 'A组第二组人数',
            num:20,
            label_children:[
              {
                label: 'A4组人数',
                num:5,
                children:[
                  {
                    name: 'John',
                    num: 1,
                  },
                  {
                    name: 'Jim',
                    num: 4,
                  }
                ],
              },
              {
                label: 'A5组人数',
                num:15,
                children:[
                  {
                    name: 'John',
                    num: 7,
                  },
                  {
                    name: 'Jim',
                    num: 8,
                  }
                ],
              }
            ]
          }
        ],
        model1: 0,
        cityList2: [
          {
            value: 0,
            label: 'A组总人数',
            num:70
          }
        ],
        model2: 0,
        label_children:[],
        columns1: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '数量',
            key: 'num'
          },
          {
            title: '操作',
            key: 'address',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.cons();
                    }
                  }
                }, '增加')
              ]);
            }
          }
        ],
        data1: [],
        value:0,
        tabs:0,
        selects:0,
        select_all:0,
      }
    },
    created(){
      this.label_children = this.cityList[0].label_children;
      this.data1 = this.cityList[0].label_children[0].children;
    },
    methods:{
      ...mapActions( // 语法糖
        ['modifyAName'] // 相当于this.$store.dispatch('modifyName'),提交这个方法
      ),
      change_one(vals){
        console.log(vals)
        var that = this;
        that.selects = vals?vals:0;
        for(let val of that.cityList){
          if(val.value == vals){
            that.label_children = val.label_children
            that.value = 0;
            that.Click()
          }
        }
      },
      Click(val){
        this.tabs = val?val:0;
        if(val){
          this.data1 = this.label_children[val].children;
        }else {
          this.data1 = this.label_children[0].children;
        }

      },
      change_all(val){
        this.select_all = val;
      },
      cons(){
        this.value = this.tabs;
      },
    },
    computed: {
      ...mapGetters(['resturantName']) // 动态计算属性，相当于this.$store.getters.resturantName
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title,.titleName{
    color: blue;
    font-size: 20px;
  }
  .btn{
    width: 160px;
    height: 40px;
    background-color: blue;
    border: none;
    outline: none;
    color: #ffffff;
    border-radius: 4px;
  }
  .marTop{
    margin-top: 20px;
  }
</style>
