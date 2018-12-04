<template>
  <div id="index">
    <router-link to="/copy">去复制</router-link>
    <div class="heights" style="height: 1000px">1215</div>
    <span>{{time_now}}</span><br>
    <span>{{time_now | timeData}}</span>
    <span>{{pages}}</span>
    <testComponent :val=value @bbb="aaa"></testComponent>
  </div>
</template>

<script>
  import testComponent from './child';

  export default {
    name: "Index",
    components: {
      testComponent
    },
    data() {
      return {
        value: 666,
        time_now: '',
        pages: 0,
        height: 1000,
      }
    },
    created() {

    },
    mounted() {
      this.getTime();
      var that = this;
      window.addEventListener('scroll', function () {
// console.log(document.documentElement.clientHeight+'-----------'+window.innerHeight); // 可视区域高度
        console.log(document.documentElement.scrollTop); // 滚动高度
        console.log(document.body.offsetHeight); // 文档高度
        console.log(window.innerHeight);
// 判断是否滚动到底部
        if (document.documentElement.scrollTop + window.innerHeight - 16 >= document.body.offsetHeight) {
          that.get();
        }
      });
    },
    methods: {
      aaa(value1, value2) {
        console.log(value1);
        console.log(value2);
      },
      getTime() {
        setInterval(() => {
          this.time_now = Date.parse(new Date());
        }, 1000)
      },
      get() {
        this.pages = this.pages + 1;
        this.height = this.height + 100;
        $('.heights').height(this.height)
        console.log(this.pages)
      }
    }
  }
</script>

<style scoped>

</style>

<!--//下拉刷新 上拉加载-->
<!--<template>-->
  <!--<scroller :on-infinite="infinite" :on-refresh="refresh" ref="my_scroller">-->
    <!--<div style="height: 1px;"></div>-->
    <!--<div v-for="(item, index) in items">-->
      <!--<div :key="item.id" class="row" :class="{'grey-bg': index % 2 == 0}">-->
        <!--<span>{{index}}</span>{{item.original_title}}-->
      <!--</div>-->
    <!--</div>-->
  <!--</scroller>-->

<!--</template>-->
<!--<script>-->
  <!--import VueScroller from 'vue-scroller'-->
  <!--import Vue from 'vue'-->

  <!--Vue.use(VueScroller)-->
  <!--export default {-->
    <!--name: 'Shopping',-->
    <!--components: {},-->
    <!--data() {-->
      <!--return {-->
        <!--items: [],-->
        <!--count:0,-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--// this.getDate(1)-->
    <!--},-->
    <!--methods: {-->
      <!--getDate (count, fn) {-->
        <!--console.log(count)-->
        <!--var that = this;-->
        <!--$.ajax({-->
          <!--url: `http://api.douban.com/v2/movie/top250?start=25&count=${that.count}`,-->
          <!--type:'get',-->
          <!--dataType: "jsonp",-->
          <!--success: data => {-->
            <!--console.log(data.subjects)-->
            <!--if (data.subjects.length < 10) {    //每次请求数据是10条，如果数据不够10条，就是没数据了 让页数=0；-->
              <!--fn(true)-->
              <!--return-->
            <!--} else {-->
              <!--if (fn) fn()-->
            <!--}-->
            <!--// if (count === 10) {-->
              <!--this.items = data.subjects   //如果是想下滑动，刷新数据 就让items等于最新数据-->
            <!--// } else {-->
            <!--//   this.items = data.subjects //否则就把数据拼接-->
            <!--// }-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--refresh(done) { //这是向下滑动的时候请求最新的数据-->
        <!--console.log(2)-->
        <!--this.count = 10;-->
        <!--this.getDate(this.count,done)-->
      <!--},-->
      <!--infinite(done) {-->
        <!--this.count = this.count + 10;    //每当向上滑动的时候就让数量加10-->
        <!--this.getDate(this.count,done)-->
      <!--},-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style>-->
  <!--.row {-->
    <!--display: block;-->
    <!--width: 100%;-->
    <!--height: 50px;-->
    <!--padding: 10px 0 10px 15px;-->
    <!--font-size: 16px;-->
    <!--line-height: 30px;-->
    <!--color: #444;-->
    <!--background-color: #fff;-->
  <!--}-->

  <!--.grey-bg {-->
    <!--background-color: #eee;-->
  <!--}-->
<!--</style>-->
