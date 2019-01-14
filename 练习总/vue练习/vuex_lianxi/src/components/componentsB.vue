<template>
  <div class="componentsB">
    <P class="title">组件B</P>
    <P class="titleName">餐馆名称：{{resturantName}}</P>
    <p class="titleName">{{example2.num}}</p>
    <div>
      <!-- 点击修改 为 B 餐馆 -->
      <button class="btn" @click="modifyBName(-1)">修改为B餐馆</button>
    </div>
    <div class="marTop">
      <button class="btn" @click="trunToA">跳转到A页面</button>
      <button class="btn" @click="add">增加</button>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'componentsB',
    data () {
      return {
        example2:{
          num:1
        }
      }
    },
    mounted(){

    },
    watch:{
      example2:{
        //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
        handler(curVal,oldVal){
          console.log(curVal,oldVal)
        },
        deep:true
      }
    },
    methods:{
      ...mapActions( // 语法糖
        ['modifyBName'] // 相当于this.$store.dispatch('modifyName'),提交这个方法
      ),
      trunToA () {
        this.$router.push({path: '/'}) // 路由跳转到A
      },
      add:function () {
        this.example2.num = this.example2.num + 1;
      }
    },
    computed: {
      ...mapGetters(['resturantName']) // 动态计算属性，相当于this.$store.getters.resturantName
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title,.titleName{
    color: red;
    font-size: 20px;
  }
  .btn{
    width: 160px;
    height: 40px;
    background-color: red;
    border: none;
    outline: none;
    color: #ffffff;
    border-radius: 4px;
  }
  .marTop{
    margin-top: 20px;
  }
</style>
