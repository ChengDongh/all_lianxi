<template>
  <div class="settle">
    <mt-header class="header" title="填写订单">
      <router-link to="" onclick="window.history.back()" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <ul class="userInfo" @click="goAddress">
      <li style="width: 90%" v-for="(value,index) in userInfos" :key="index">
        <div class="info"><span>{{value.name}}</span><span style="margin-left: 30px">{{value.tel}}</span></div>
        <div class="address">{{value.address}}</div>
      </li>
      <span class="icon">
        <i class="fa fa-chevron-right"></i>
      </span>
    </ul>
    <div class="payment" @click="actionSheet"><span>支付方式</span><span>{{payment_text}}</span></div>
    <mt-actionsheet
      :actions= "data"
      v-model="sheetVisible">
    </mt-actionsheet>
    <ul style="border-bottom: 1px solid #eeeeee;padding: 5px 10px;">
      <li class="shopList" v-for="(value,index) in list" :key="index" v-if="index<4">
        <img class="shopList_img" :src="value.images" alt="">
        <div class="dispatching">
          <span>配送</span><span>京东快递</span>
        </div>
        <div class="rejected">
          <div style="width: 75%">
            <div style="font-size: 14px"><span>退换无忧</span><span><span style="font-size: 12px"> ￥</span>{{value.rejected_pic}}.00 </span><span style="color: orangered"><i class="fa fa-exclamation-circle"></i></span></div>
            <span style="padding: 5px 0;display: inline-block">7天内退货，15天内换货，可享1次上门取件(不另收费)</span>
          </div>
          <div class="switchBox" v-if="value.rejected_pic">
            <mt-switch class="switch" v-model="value.isShow" @change="isOpen"></mt-switch>
          </div>
        </div>
      </li>
    </ul>
    <div class="priceAll">
      <div class="shop_price picFlex"><span>商品金额</span><span>￥{{priceALL}}.00</span></div>
      <div class="freight picFlex"><span>运费(总重:{{weight}})</span><span class="pic_color">+￥{{freight}}.00</span></div>
      <div class="coupon picFlex" v-if="coupon">优惠券<span class="pic_color">-￥{{coupon}}.00</span></div>
    </div>
    <div class="address_l" v-for="(value,index) in userInfos" :key="index">
      <span style="width: 85%;display: inline-block">{{value.address}}</span>
    </div>
    <div class="bottom">
      <div class="bottom_pic"><span style="font-size: 12px">￥</span>{{priceALL_coupon}}.00</div>
      <div class="bottom_sub" @click="submit">提交订单</div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "settle",
      data(){
          return{
            payment_text:'在线支付',
            data:[{
              name:'在线支付',
              method:this.payments
            },{
              name:'货到付款',
              method:this.goodActive
            },{
                name:'公司付款',
                method:this.firm
              }],
            sheetVisible:false,
            list:[
              {
                title:'陶瓷杯',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有，快点加入购物车吧！',
                num:1,
                checked:false,
                isShow:false,
                rejected_pic:1
              },
              {
                title:'玻璃杯',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有',
                num:1,
                checked:false,
                isShow:false,
                rejected_pic:10
              },
              {
                title:'高级吸汗毛巾',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！',
                num:1,
                checked:false,
                isShow:false,
                rejected_pic:15
              },
              {
                title:'纯棉围巾',
                price:120,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！',
                num:1,
                checked:false,
                isShow:false,
                rejected_pic:4
              },
            ],
            userInfo:[
              {
                id:'1',
                name:'张三0',
                tel:13233333330,
                address:'浙江杭州市西湖区 万塘路588古荡湾新村000号000室',
                checked:true
              },
              {
                id:'2',
                name:'张三1',
                tel:13233333331,
                address:'浙江杭州市西湖区 万塘路588古荡湾新村000号001室',
                checked:false
              },
              {
                id:'3',
                name:'张三2',
                tel:13233333332,
                address:'浙江杭州市西湖区 万塘路588古荡湾新村000号002室',
                checked:false
              },
              {
                id:'4',
                name:'张三3',
                tel:13233333333,
                address:'浙江杭州市西湖区 万塘路588古荡湾新村000号003室',
                checked:false
              }
            ],
            priceALL:0,
            rejected_pic_all:0,
            priceALL_coupon:0,
            priceALL_coupon_a:0,
            freight:0,
            coupon:5,
            weight:'14.410kg',
          }
      },
      computed:{
        userInfos:function() {  //通过方法访问
          return this.$store.getters.id_num;
        },
      },
      created(){
          this.tel();
          this.priceALL = 0;
          for(var i =0;i<this.list.length;i++){
            this.priceALL = this.priceALL + this.list[i].price * this.list[i].num;
          }
          this.priceALL_coupon = this.priceALL - this.coupon;
          this.priceALL_coupon_a = this.priceALL_coupon;
      },
      methods:{
        tel(){
          for(var i=0;i<this.userInfos.length;i++){
            var str = String(this.userInfos[i].tel)
            this.userInfos[i].tel = str.substr(0,3) + '****' + str.substr(7)
          }
        },
        actionSheet(){
          this.sheetVisible = true;
        },
        payments(){
          this.payment_text = '在线支付'
        },
        goodActive(){
          this.payment_text = '货到付款'
        },
        firm(){
          this.payment_text = '公司付款'
        },
        submit(){
          let instance = this.$toast('等待支付功能的完善');
          setTimeout(()=>{
            instance.close()
          },3000)
        },
        //退货保险
        isOpen(){
          this.rejected_pic_all = 0;
          for (var i=0;i<this.list.length;i++){
            if(this.list[i].isShow == true){
              this.rejected_pic_all = this.rejected_pic_all + this.list[i].rejected_pic;
            }
          }
          this.priceALL_coupon = this.priceALL_coupon_a
          this.priceALL_coupon = this.priceALL_coupon + this.rejected_pic_all;
        },

        goAddress(){
          this.$router.replace({
            name:"address_i"
          })
        }
      }
    }
</script>

<style scoped>
  .shopList{

  }
  .shopList_img{
    display: inline-block;
    vertical-align: top;
    width: 30%;
    height: 60px;
  }
  .dispatching{
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    font-size: 14px;
    padding: 5px 0px;
  }
  .dispatching span{
    display: block;
  }
  .dispatching span:nth-of-type(2){
    margin-right: 10px;
  }
  .rejected{
    font-size: 12px;
    /*margin-top: 10px;*/
    display: flex;
    justify-content: space-between;
    /*padding: 5px 10px;*/
  }
  .payment{
    border-bottom: 1px solid #eeeeee;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    height: 25px;
    line-height: 25px;
  }
  .userInfo{
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    border-bottom: 1px solid #eeeeee;
    margin-top: 40px;
  }
  .icon{
    display: inline-block;
    display: flex;
    align-items: center;
  }
  .info{
    padding: 5px 0;
  }
  .address{
    font-size: 12px;
    color: #aaaaaa;
  }
  .switchBox{
    display: flex;
    align-items: center;
  }
  .pic_color{
    color: orangered;
  }
  .picFlex{
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
  }
  .priceAll{
    padding: 5px 10px 130px 10px;
    font-size: 14px;
  }
  .bottom{
    position: fixed;
    bottom: 0;
    height: 40px;
    width: 100%;
    display: flex;
    text-align: center;
    line-height: 40px;
  }
  .bottom_pic{
    background: orangered;
    width: 60%;
    height: 40px;
    text-align: left;
    text-indent: 3px;
    color: red;
  }
  .bottom_sub{
    background: red;
    width: 40%;
    color: white;
    height: 40px;
  }
  .header{
    background: orangered;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99999;
  }
  .address_l{
    position: fixed;
    bottom: 40px;
    width: 100%;
    background: #FFDEAD;
    padding: 5px 8px;
    text-align: left;
    font-size: 12px;
    color: 	#DEB887;
  }
</style>
