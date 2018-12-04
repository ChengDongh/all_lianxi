<template>
    <div class="detail">
      <div class="detail_list">
        <div class="detail_img">
          <img :src="list.images" alt="">
          <span @click="go_back" class="detail_back"><i class="fa fa-chevron-left"></i></span>
        </div>
        <div class="content_text">
          <span style="display: inline-block;padding-top: 10px">{{list.title}}</span>
          <div style="padding: 10px 0">
            <span>{{list.detail}}</span>
          </div>
          <div>
            <span>价格：</span>
            <span style="color: orangered">{{list.price}}.00</span>
          </div>
        </div>
      </div>
      <mt-button class="primary" type="primary" @click="toCar">加入购物车</mt-button>
    </div>
</template>

<script>
  // import {mapActions} from 'vuex'
    export default {
        name: "detail",
      data(){
          return{
            list:{
              title:'陶瓷杯',
              price:100,
              images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
              detail:'手工制作，值得拥有，快点加入购物车吧！'
            }
          }
      },
      created(){

      },
      methods:{
        go_back(){
          this.$router.push({
            name:'index'
          })
          // window.history.back(-1);
        },
        toCar(){
          var that = this
          that.$router.push({
            name:'car',
          })
        }
      },
      beforeRouteLeave (to, from, next) {
        if (to.name == 'index' && from.name == 'detail') {
          to.meta.isUseCache = true;
        }
        next();
      },
    }
</script>

<style scoped>
  .detail_list img{
    display: inline-block;
    width: 100%;
    vertical-align: top;
  }
  .content_text{
    padding: 10px 5px;
  }
  .detail_img{
    position: relative;
  }
  .detail_back{
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #aaaaaa;
    opacity: 0.3;
    top: 5px;
    left: 5px;
    color: black;
    text-align: center;
    line-height: 30px;
    /*font-size: 20px;*/
  }
  .primary{
    width: 80%;
    margin-left: 10%;
    margin-top: 10px;
  }
</style>
