<template>
    <div class="index">
        <div class="search" @click="go_search">
          <div class="search_div">
            <i class="fa fa-search search_icon"></i>
            <input type="search">
          </div>
        </div>
      <mt-navbar class="tab_list" v-model="selected">
        <mt-tab-item id="1" class="tab_s">商品一</mt-tab-item>
        <mt-tab-item id="2" class="tab_s">商品二</mt-tab-item>
        <mt-tab-item id="3" class="tab_s">商品三</mt-tab-item>
      </mt-navbar>
      <div><span></span><span></span><span></span></div>
        <div class="list">
          <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="projectUl"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                :infinite-scroll-immediate-check="true"
                infinite-scroll-distance="10">
              <li class="projectLi" v-for="(value,index) in list" :key="index" @click="toDetail(index)">
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
          </mt-loadmore>
          <!--显示加载中转菊花-->
          <div class="loading-box tc" v-if="isLoading">
            <mt-spinner type="snake" class="loading-more"></mt-spinner>
            <span class="loading-more-txt">加载中...</span>
          </div>

          <!--<div class="no-more" v-if="noMore">没有更多了~</div>-->
        </div>
      <Tabbers class="tabber"></Tabbers>
    </div>
</template>


<script>
  import Tabbers from '../components/Tabber'
    export default {
        name: "index",
      components:{
        Tabbers
      },
      data(){
          return{
            value:'',
            loading:false,
            isLoading: false,
            selected:'1',
            list:[],
            list_0:[
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
                title:'纯棉围巾',
                price:120,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'陶瓷杯',
                price:60,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'玻璃杯',
                price:80,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'高级吸汗毛巾',
                price:90,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'纯棉围巾',
                price:125,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有'
              }
            ],
            list_1:[
              {
                title:'陶瓷杯1',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'玻璃杯1',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'高级吸汗毛巾1',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'纯棉围巾1',
                price:120,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'陶瓷杯1',
                price:60,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'玻璃杯1',
                price:80,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'高级吸汗毛巾1',
                price:90,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'纯棉围巾1',
                price:125,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              }
            ],
            list_2:[
              {
                title:'陶瓷杯2',
                price:100,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'玻璃杯2',
                price:200,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'高级吸汗毛巾2',
                price:10,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'纯棉围巾2',
                price:120,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'陶瓷杯2',
                price:60,
                images:'http://cdn.qiqiangkeji.com/20180926.fff7f6be283261b884d7f400be65e1b1_1024x710.jpg',
                detail:'手工制作，值得拥有'
              },
              {
                title:'玻璃杯2',
                price:80,
                images:'http://cdn.qiqiangkeji.com/20180926.9383d209c5395f8598ca9a2731696a94_850x680.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'高级吸汗毛巾2',
                price:90,
                images:'http://cdn.qiqiangkeji.com/20180926.83a59e1a91b31003fc2b2beffd7702b7_320x220.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              },
              {
                title:'纯棉围巾2',
                price:125,
                images:'http://cdn.qiqiangkeji.com/20180926.3015a6dd5205bb599914c7b972f11f04_500x500.jpg',
                detail:'手工制作，值得拥有，手工制作，值得拥有，快点加入购物车吧！'
              }
            ],
            allLoaded:false,
            val_id:'1',
          }
      },
      created(){

      },
      mounted(){
        this.shop_list();
      },
      methods:{
        loadTop: function(){
          this.shop_list();
        },
        shop_list(){
          var that = this;
          that.isLoading = true;
          setTimeout(()=>{
            if(that.val_id ==1){
              that.list = that.list_0;
            }else if(that.val_id ==2){
              that.list = that.list_1;
            }else {
              that.list = that.list_2;
            }
            that.isLoading = false;
            that.$refs.loadmore.onTopLoaded();
          },2000)
        },
        loadMore() {
          this.loading = true;
          this.isLoading = true;
          setTimeout(() => {
            // let last = this.list[this.list.length - 1];
            // for (let i = 1; i <= 10; i++) {
            //   this.list.push(last + i);
            // }
            if(this.val_id == 1){
              this.list = this.list.concat(this.list_0)
            }else if(this.val_id == 2){
              this.list = this.list.concat(this.list_1)
            }else {
              this.list = this.list.concat(this.list_2)
            }

            this.loading = false;
            this.isLoading = false
          }, 2500);
        },
        toDetail(index){
          this.$router.push({
            name: 'detail',
            params: {
              id: index
            }
          })
        },
        go_search(){
          this.$router.push({
            name:'search'
          })
        },
      },
      activated(){
          console.log(this.$route.meta.isUseCache)
          if(!this.$route.meta.isUseCache){
            this.list = [];
            this.shop_list();
          }
      },
      watch: {
        selected: function (val) {
          console.log(val)
          this.list = []
           if(val == 1){
             this.val_id = 1;
             this.shop_list();
           }else if(val == 2){
             this.val_id = 2;
             this.shop_list();
           }else {
            this.val_id = 3;
             this.shop_list();
           }
        },
      }
    }
</script>

<style scoped>
  .search {
    height: 32px;
    width: 100%;
    position: fixed;
    z-index: 99999;
    text-align: center;
    line-height: 28px;
    background-color: #d9d9d9;
  }
  .search_div{
    width: 90%;
    height: 20px;
    vertical-align: middle;
    position: relative;
    display: inline-block;
    background: white;
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
    width: 95%;
    border: none;
    outline: none;
    padding: 0 5px;
    height: 20px;
    position: absolute;
    right: 0;
    vertical-align: top;
    color: #d9d9d9;
  }
  .tab_list{
    padding-top: 32px;
  }
  .list{
    /*padding-top: 32px;*/
    padding-bottom: 80px;
  }
  .loading-more-txt{
    position: absolute;
    left: 50%;
    transform: translate(-50%,0);
    font-size: 14px;
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
  .tabber{
    width: 100%;
    /*height: 50px;*/
    position: fixed;
    bottom: 0;
    /*background: orangered;*/
  }
  .tab_s{
    padding: 8px 0;
  }
  .loading-box{
    padding-top: 5px;
  }
</style>
