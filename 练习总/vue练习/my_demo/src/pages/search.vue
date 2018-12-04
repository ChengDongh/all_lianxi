<template>
    <div class="search_vue">
      <!--<div v-if="title_IsShow" class="search">-->
        <!--<div class="search_val search_div">-->
          <!--<i @click="submit" class="fa fa-search search_icon"></i>-->
          <!--<input class="search_val" autofocus="autofocus" type="search" @keyup.enter="submit">-->
        <!--</div>-->
        <!--<div class="search_close" @click="go_index"><span>取消</span></div>-->
      <!--</div>-->
      <div class="search">
        <i v-if="!title_IsShow" @click="go_index" class="fa fa-angle-left search_left"></i>
        <div class="search_div">
          <i @click="submit" class="fa fa-search search_icon"></i>
          <input id="search_val" @focus="focus" class="search_val" :value="input_val" autofocus type="search" @keyup.enter="submit">
        </div>
        <div v-if="title_IsShow" class="search_close" @click="go_index"><span>取消</span></div>
      </div>
      <div class="search_title" v-if="title_IsShow">
        <div>
          <h5>热搜</h5>
          <ul class="hot_search slide-box">
            <li class="slide-item" v-for="(value,index) in slide_item" :key="index">{{value}}</li>
          </ul>
        </div>
        <div v-if="past_item.length>0">
          <div style="width: 100%;height: 10px;background: #eee;margin-top: 10px"></div>
          <h5 class="past">历史搜索</h5>
          <ul class="past_search">
            <li class="past-item" v-for="(value,index) in past_item" :key="index">{{value}}</li>
            <div @click="clearList" class="clear_past"><i class="fa fa-trash-o fa-lg"></i> 清空历史搜索</div>
          </ul>
        </div>
      </div>
      <div v-if="!title_IsShow" style="padding-top: 34px">
        <ul v-if="list.length>0" class="projectUl"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-distance="10">
          <li class="projectLi" v-for="(value,index) in list" :key="index">
            <div class="liDes">
              <img :src="value.images" alt="">
              <div style="display: inline-block;vertical-align: top;font-size: 14px;margin-left: 1.12%;width: 56%">
                <div class="pad">
                  <span>{{value.title}}</span>
                </div>
                <div class="pad">
                  <span>价格：</span>
                  <span style="color: orangered" class="title">{{value.price}}.00</span>
                </div>
                <div class="pad">
                  <span>{{value.detail}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="loading-box tc" v-if="isLoading">
          <mt-spinner type="snake" class="loading-more"></mt-spinner>
          <span class="loading-more-txt">加载中...</span>
        </div>
      </div>
    </div>
</template>

<script>
  import $ from 'jquery'
    export default {
        name: "search",
      data(){
          return{
            title_IsShow:true,
            loading:false,
            isLoading: false,
            input_val:null,
            list:[],
            list1:[
              {
                title:'陶瓷杯',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'玻璃杯',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'高级吸汗毛巾',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'陶瓷杯',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'玻璃杯',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'高级吸汗毛巾',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'陶瓷杯',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'玻璃杯',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'高级吸汗毛巾',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有'
              },

            ],
            slide_item:['乔丹裤子','泡茶水壶','车子玩具','阿根廷球衣','易拉罐水杯','牛奶箱','仙鹤衬衣'],
            past_item:['乔丹裤子','泡茶水壶','车子玩具','阿根廷球衣','易拉罐水杯','牛奶箱','仙鹤衬衣'],
          }
      },
      created(){},
      mounted(){
          $('#search_val').focus()
      },
      methods:{
          shopList(){
            this.isLoading = true
            setTimeout(()=>{
              this.list = this.list1;
              this.isLoading = false;
            },2000)
          },
        go_index(){
          this.$router.push({
            name:'index'
          })
        },
        clearList(){
          this.past_item = []
        },
        submit(){
            var that = this;
          that.list = [];
          that.input_val = $.trim($('.search_val').val())
          if($.trim($('.search_val').val())!='' && $.trim($('.search_val').val())!= null){
            that.title_IsShow = false;
            this.past_item.push(that.input_val);
            $(".search_val").blur();
            that.shopList()
          }else {
            this.$toast('请输入商品名');
          }
        },
        loadMore() {
          this.loading = true;
          this.isLoading = true;
          setTimeout(() => {
            this.list = this.list.concat(this.list1)
            this.loading = false;
            this.isLoading = false
          }, 2500);
        },
        focus(){
          var that = this;
          console.log(that.input_val)
          if($.trim($('.search_val').val())!='' && $.trim($('.search_val').val())!=null){
            $(".search_val").val('');
            that.list = [];
            that.title_IsShow = true;
          }
        },
      },
      // 搜索页面的beforeRouteLeave钩子函数
      beforeRouteLeave (to, from, next) {
        if (to.name == 'index' && from.name == 'search') {
          to.meta.isUseCache = true;
        }
        next();
      },
    }
</script>

<style scoped>
  ul{
    margin: 0;
    padding: 0;
  }
  ui li{
    list-style: none;
  }
  h5{
    padding: 10px 0 5px 5px;
    margin: 0;
  }
  .search {
    height: 32px;
    width: 100%;
    position: fixed;
    z-index: 99999;
    line-height: 28px;
    background-color: #d9d9d9;
  }
  .search_div{
    width: 80%;
    height: 20px;
    vertical-align: middle;
    position: relative;
    display: inline-block;
    background: white;
    margin-left: 5%;
  }
  .search_div_one{
    width: 75%;
    height: 20px;
    vertical-align: middle;
    position: relative;
    display: inline-block;
    background: white;
    margin-left: 10%;
  }
  .search_left{
    position: relative;
    left: 5%;
    font-size: 18px;
    top: 1px;
    color: #aaa;
    display: inline-block;
    margin-right: 12px;
  }
  .search_close{
    display: inline-block;
    height: 30px;
    text-align: center;
    color: #aaaaaa;
    font-size: 14px;
    width: 11%;
  }
  .search_close span{
    vertical-align: middle;
    display: inline-block;
    width: 100%;
  }
  .search_icon{
    position: absolute;
    top: 20%;
    left: 1%;
    font-size: 12px;
    color: #d9d9d9;
  }
  .search input::-webkit-search-cancel-button {
    display: none;
  }
  .search input{
    width: 94%;
    border: none;
    outline: none;
    padding: 0 5px;
    height: 20px;
    position: absolute;
    right: 0;
    vertical-align: top;
    color: #d9d9d9;
  }
  .search_title{
    padding-top: 32px;
  }
  .slide-box{
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space:nowrap;
  }
  .slide-item{
    margin: 0 5px;
    padding:2px 5px;
    border:1px solid #eee;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    color: black;
    font-weight: 400;
    border-radius: 10px;
    background: #eee;
  }
  .slide-box::-webkit-scrollbar{
    height: 0;
  }
  .past_search{
    font-size: 12px;
    color: #aaa;
  }
  .past-item{
    border-bottom: 1px solid #eee;
    padding: 10px 8px;
  }
  .clear_past{
    width: 80%;
    height: 30px;
    margin: 20px auto;
    text-align: center;
    line-height: 30px;
    border: 1px solid #ddd;
    border-radius: 20px;
    color: black;
  }
  .projectLi{
    padding: 10px 5px 0 5px;
  }
  .projectLi .liDes img{
    width: 40%;
    height: 80px;
    vertical-align:top
  }
  .pad{
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loading-more-txt{
    position: absolute;
    left: 50%;
    transform: translate(-50%,0);
    font-size: 14px;
  }
</style>
