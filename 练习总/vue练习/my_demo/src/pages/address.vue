<template>
    <div class="address">
      <!--<mt-header class="header" title="收货地址">-->
        <!--<router-link to="" slot="left" @click="go_settle">-->
          <!--<mt-button icon="back"></mt-button>-->
        <!--</router-link>-->
      <!--</mt-header>-->
      <header class="header">
        <div class="header_con">
          <i style="font-size: 24px" class="fa fa-angle-left header_icon" @click="go_settle"></i>
          <span>收货地址</span>
        </div>
      </header>
      <ul class="address_list">
        <li class="userInfo" v-for="(value,index) in userInfo" :key="index" @click="choose(value.id)">
          <div class="check" v-if="$store.state.id == value.id"><input type="checkbox" :checked="$store.state.id == value.id? 'true':'false'"></div>
          <div style="width: 85%">
            <div class="info"><span>{{value.name}}</span><span style="margin-left: 30px">{{value.tel}}</span></div>
            <div class="address">{{value.address}}</div>
          </div>
          <span class="icon">
            <i class="fa fa-trash-o"></i>
          </span>
        </li>
      </ul>
    </div>
</template>

<script>
  import {mapMutations} from 'vuex'
    export default {
        name: "address_i",
      data(){
          return{
            userInfo:[
              {
                id:'1',
                name:'张三0',
                tel:13233333330,
                address:'浙江杭州市西湖区 万塘路588古荡湾新村000号000室',
                checked:false
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
          }
      },
      created(){
        this.tel();
        for(var i=0;i<this.userInfo.length;i++){
          if(this.userInfo[i].id==this.userInfos()[0].id){
            if(i!=0){
              this.userInfo.splice(i, 1, ...this.userInfo.splice(0, 1, this.userInfo[i]))
            }
          }
        }
      },
      methods:{
        tel(){
          for(var i=0;i<this.userInfo.length;i++){
            var str = String(this.userInfo[i].tel);
            this.userInfo[i].tel = str.substr(0,3) + '****' + str.substr(7);
          }
        },
        ...mapMutations([
          'choose_id',
        ]),
        choose(id){
          this.$router.replace({
            name:'settle'
          });
          this.choose_id(id);
        },
        userInfos:function() {  //通过方法访问
          return this.$store.getters.id_num;
        },
        go_settle(){
          this.$router.replace({
            name:'settle'
          });
        },
      },
    }
</script>

<style scoped>
  .header{
    background: orangered;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99999;
    height: 40px;
    font-size: 14px;
    color: white;
    text-align: center;
    line-height: 40px;
    /*padding: 0 10px;*/
    font-weight: 400;
  }
  .header_con{
    width: 100%;
    height: 100%;
    position: relative;
    line-height: 40px;
  }
  .header_icon{
    position: absolute;
    top: 16%;
    /*transform: translate(0,-51%);*/
    left: 12px;
  }
  .address_list{
    margin-top: 40px;
  }
  .userInfo{
    display: flex;
    padding: 5px;
    font-size: 14px;
    justify-content: space-between;
  }
  .check{
    display: flex;
    align-items: center;
    padding-right: 2px;
  }
  .icon{
    display: flex;
    align-items: center;
    margin-right: 5px;
  }
</style>
