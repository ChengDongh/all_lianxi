<template>
  <div class="car">
    <mt-header class="header" title="购物车">
      <router-link to="" onclick="window.history.back()" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div>
      <ul class="car_list" v-if="list.length>0">
        <li class="list_item" v-for="(value,index) in list" :key="index">
          <input class="input_list" type="checkbox" :checked="value.checked" @click="inputCheck(index)"/>
          <img @click="go_detail(index)" :src="value.images" alt="">
          <div class="content_text">
            <span style="display: inline-block;padding-bottom: 5px">{{value.title}}</span>
            <div style="display: flex;justify-content: space-between;width: 100%">
              <span style="display: inline-block">￥{{value.price}}.00</span>
              <div style="display: inline-block;"><button class="btn" @click="lessen(index)">-</button><span style="width: 30px;display: inline-block;background: #eeeeee;text-align: center">{{value.num}}</span><button class="btn" @click="add(index)">+</button></div>
            </div>
          </div>
          <span @click="remove(index)" class="danger_btn">删除</span>
        </li>
      </ul>
      <div style="margin-top: 60px;text-align: center" v-if="list.length<=0">您的购物车是空的，前去购物 <i @click="go_back" style="color: orangered;font-size: 18px" class="fa fa-angle-double-right"></i></div>
      <div class="bottom">
        <div class="prices">
          <input id="all_check" class="input_all" type="checkbox" :checked="checked_all" @click="checkAll"/>
          <label for="all_check" style="font-size: 12px">全选</label>
          <span style="font-size: 16px">合计:￥{{all_prices}}.00</span>
        </div>
        <div class="balance" @click="account">
          <span>去结算({{list_nums}})</span>
        </div>
      </div>
    </div>
    <Tabbers class="tabber"></Tabbers>
  </div>
</template>

<script>
  import Tabbers from '../components/Tabber'
    export default {
        name: "car",
      components:{
        Tabbers
      },
      data(){
          return{
            all_prices:0,
            checked_all:false,
            check_nums:0,
            list_nums:0,
            list:[
              {
                title:'陶瓷杯',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有，快点加入购物车吧！',
                num:1,
                checked:false,
              },
              {
                title:'玻璃杯',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有',
                num:1,
                checked:false,
              },
              {
                title:'高级吸汗毛巾',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！',
                num:1,
                checked:false,
              },
              {
                title:'纯棉围巾',
                price:120,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！',
                num:1,
                checked:false,
              },
            ],
          }
      },
      created(){

      },
      methods:{
        //  数量减
        lessen(index){
          if(this.list[index].num>1){
            this.list[index].num = this.list[index].num - 1;
            this.allNums();
          }
        },
        //数量加
        add(index){
          this.list[index].num = this.list[index].num + 1;
          this.list[index].checked = true;
          this.allNums();
        },
        //点击加好时，选中按钮
        inputCheck(index){
          this.list[index].checked = !this.list[index].checked;
          this.allNums();
        },
        //总金额
        prices(){
          this.all_prices = 0;
          for (var i=0;i<this.list.length;i++){
            if(this.list[i].checked == true){
              this.all_prices =this.all_prices + this.list[i].num * this.list[i].price;
            }
          }
        },
        //商品总数
        allNums(){
          this.list_nums = 0;
          for (var i=0;i<this.list.length;i++){
            if(this.list[i].checked == true){
              this.list_nums = this.list_nums + this.list[i].num;
            }
          }
          this.prices();
          this.check_num()
        },
        //全选 全不选
        checkAll(){
          this.checked_all = !this.checked_all
          if(this.checked_all == true){
            for(var i=0;i<this.list.length;i++){
              this.list[i].checked = true
            }
          }else {
            for(var i=0;i<this.list.length;i++){
              this.list[i].checked = false
            }
          }
          this.allNums();
        },
        //通过选中的数量判断是否为全选状态
        check_num(){
          this.check_nums = 0
          if(this.list.length>0){
            for(var i =0;i<this.list.length;i++){
              if(this.list[i].checked == true){
                this.check_nums = this.check_nums + 1
              }
            }
            if(this.check_nums == this.list.length){
              this.checked_all = true
            }else {
              this.checked_all = false
            }
          }
        },
        remove(index){
          this.list.splice(index,1);
          this.allNums();
        },
        account(){
          if(this.list_nums<=0){
            let instance = this.$toast('请先选择商品');
            setTimeout(() => {
              instance.close();
            }, 2000);
          }else {
            // let instance = this.$toast('等待结算功能');
            // setTimeout(() => {
            //   instance.close();
            // }, 2000);
            this.$router.push({
              name:'settle'
              // params:{
              //   price: this.all_prices
              // }
            })
          }
        },
        go_detail(index){
          this.$router.push({
            name:'detail',
            params:{
              id:index
            }
          })
        },
        go_back(){
          this.$router.push({
            name:'index'
          })
        },
      },
      beforeRouteLeave (to, from, next) {
        if (to.name == 'index' && from.name == 'car') {
          to.meta.isUseCache = true;
        }
        next();
      },
    }
</script>

<style scoped>
  .list_item{
    padding: 10px 5px;
    position: relative;
  }
  .list_item img{
    display: inline-block;
    width: 30%;
    height: 60px;
    vertical-align: top;
  }
  .content_text{
    display: inline-block;
    width: 48%;
  }
  .btn{
    border: none;
    background: white;
    font-size: 16px;
    outline: none;
    padding: 0;
    margin: 0 5px;
    vertical-align: top;
  }
  .prices{
    /*display: inline-block;*/
    width: 60%;
    height: 50px;
    line-height: 50px;
    /*text-align: center;*/
    background: orangered;
  }
  .bottom{
    position: fixed;
    display: flex;
    bottom: 46px;
    width: 100%;
  }
  .balance{
    /*display: inline-block;*/
    width: 40%;
    height: 50px;
    line-height: 50px;
    background: red;
    text-align: center;
    color: white;
    font-size: 16px;
  }
  .danger_btn{
    display: inline-block;
    color: white;
    width: 10%;
    height: 15px;
    text-align: center;
    line-height: 15px;
    font-size: 12px;
    background-color: #ef4f4f;
    border-radius: 3px;
  }
  .tabber{
    width: 100%;
    /*height: 50px;*/
    position: fixed;
    bottom: 0;
    /*background: orangered;*/
  }
  .header{
    background: orangered;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99999;
  }
  .car_list{
    margin-top: 40px;
  }
</style>
