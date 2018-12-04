<template>
  <div class="hello">
    <input type="text" v-model="cookie" @change="setCookies">
    <input type="text" v-model="localStorage" @change="setStorages">
    <input type="file" @change="upload($event)" />
    <img id="aaa" src="" alt="" />

  </div>
</template>

<script>

  import Cookie from '../unitl/cookie';
  import storage from '../unitl/storage';
  import $ from 'jquery'

  export default {
    name: 'HelloWorld',

    data() {
      return {
        cookie: '111',
        localStorage: ''
      }
    },
    created() {
      // Cookie.delCookie("name", '', -1);
      // Cookie.setCookie('names','123',1);
      // storage.setStorage('name',1231654);
      // console.log(Cookie.getCookie('names'));
      // console.log(storage.getStorage('name'))
      // http://api.douban.com/v2/movie/top250?start=25&count=25
      // http://yiapi.qiqiangkeji.com/upload
      // console.log($('hello'))
      // var baseUrl = 'http://api.douban.com/v2/movie/top250';
      // var start = 25;
      // var count = 20;
      // $.ajax({
      //   type:'get',
      //   dataType: "jsonp",
      //   url:`${baseUrl}?start=${start}&count=${count}`,
      //   success:function (data) {
      //     console.log(data)
      //   }
      // })
    },
    methods: {
      setCookies() {
        Cookie.setCookie('names', this.cookie, 1);
        console.log(Cookie.getCookie('names'));
        if (Cookie.getCookie('names') == '') {
          console.log(1111)
          Cookie.removeCookie('names')
          console.log(2222)
        } else {
          console.log(Cookie.getCookie('names'));
        }
      },
      setStorages() {
        storage.setStorage('name', this.localStorage);
        console.log(storage.getStorage('name'))
      },



      // processData: false,因为data值是formdata对象，不需要对数据做处理。
      // contentType: false,
      // xhrFields: { 跨域请求设置
      //   withCredentials: true
      // },
      // upload(event){
      //   var formData = new FormData();
      //   console.log(formData)
      //   for(var i = 0; i < event.target.files.length; i++) {
      //     formData.append("img", event.target.files[i]);
      //     $.ajax({
      //       type: "post",
      //       url: "http://yiapi.qiqiangkeji.com/upload",
      //       async: true,//异步
      //       data: formData,
      //       dataType: "json",
      //       processData: false,
      //       contentType: false,
      //       xhrFields: {
      //         withCredentials: true
      //       },
      //       success: function(res) {
      //         if(res.code == 0) {
      //           $('#aaa').attr("src", res.data.url)
      //         }
      //       },
      //     });
      //   }
      // },
      upload(event){
        var formData = new  FormData();
        formData.append('img',event.target.files[0]);
        $.ajax({
          type:'post',
          url:'http://yiapi.qiqiangkeji.com/upload',
          dataType:'json',
          data:formData,
          processData:false,
          contentType:false,
          xhrFields:{
            withCredentials:true
          },
          success(res){
            if(res.code == 0){
              $('#aaa').attr('src',res.data.url)
            }
          }
        })
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
</style>
