<template>
    <div class="login_box">
      <div class="form" id="form">
        <div class="row" style="text-align:center;padding-top: 80px;padding-bottom:20px;font-size: 14px">
          危险化学品信息登记管理平台
        </div>
        <div class="row">
          <label class="col-3" style="margin-left: 16px;">帐号：</label>
          <div class="input-wrap">
            <input type="text" class="input" placeholder="输入用户名" v-model="username">
            <!--<span class="input-warning">{{ error1 }}</span>-->
          </div>
        </div>
        <div class="row">
          <label class="col-3" style="margin-left: 16px;">密码：</label>
          <div class="input-wrap col-6">
            <input type="password" class="input" placeholder="输入密码" v-model="password">
            <!--<span class="input-warning">{{ error2 }}</span>-->
          </div>
        </div>
        <div class="row">
          <div class="login-btn" @click="submit">
            登 录
          </div>
        </div>
      </div>
      <div id="particles-js">
        <b></b>
        <strong></strong>
        <img class="img_1" src="../assets/logo1.png" alt="">
        <img class="img_2" src="../assets/logo1.png" alt="">
        <img class="img_3" src="../assets/logo1.png" alt="">
        <img class="img_4" src="../assets/logo1.png" alt="">
        <img class="img_5" src="../assets/logo1.png" alt="">
        <img class="img_6" src="../assets/logo1.png" alt="">
        <img class="img_7" src="../assets/logo1.png" alt="">
      </div>
    </div>
</template>

<script>
    export default {
        name: "login",
      data(){
          return{
            username:'root',
            password:'123456'
          }
      },
      methods:{
        submit:function () {
          this.$router.push({
            path: `/modular`
          })
        }
      }
    }
</script>

<style scoped>
  .login_box{
    background: rgb(48,57,65);
    width: 100vw;
    height: 100vh;
  }
  .form{
    width: 400px;
    height: 400px;
    background: rgb(189,221,250);
    text-align: center;
    position: absolute;
    right: 8%;
    top: 10%;
    border-radius: 5px;
  }
  .row .input-wrap{
    display: inline-block;
    margin-right:80px;
  }
  .row{
    padding-bottom: 20px;
  }
  .input:focus, .input:hover {
    border-color: #57c5f7;
  }
  .input {
    cursor: text;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    margin-left: 10px;
  }
  input, .textarea {
    display: inline-block;
    padding: 6px 7px;
    width: 100%;
    line-height: 1.5;
    background-image: none;
    font-size: 12px;
    box-sizing: border-box;
  }
  .login-btn {
    width: 200px;
    color: white;
    background: #2db7f5;
    display: block;
    text-align: center;
    padding: 8px 7px;
    border-radius: 6px;
    cursor: pointer;
    margin: 0 auto;
    box-sizing: border-box;
  }
  #particles-js b{
    width: 100px;
    height: 110px;
    position:absolute;
    top: 5%;
    left: 5%;
    display:block;
    background-image: url("../assets/1-right.png");
    background-repeat: no-repeat;
  }
  #particles-js {
    width: 100vw;
    height: 100vh;
    background-size: cover;
  }
  .img_1{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 20%;
    left:45%;
  }
  .img_2{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 35%;
    left: 20%;
  }
  .img_3{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 45%;
    left: 25%;
  }
  .img_4{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 35%;
    left: 30%;
  }
  .img_5{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 53%;
    left: 33%;
  }
  .img_6{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 38%;
    left: 38%;
  }
  .img_7{
    width: 45px;
    height: 45px;
    position: absolute;
    top: 54%;
    left: 40%;
  }
  #particles-js strong{
    width: 600px;
    height: 600px;
    position: absolute;
    top: 10%;
    left: 10%;
    display: block;
    background-image: url("../assets/map.png");
    background-repeat: no-repeat;
    -webkit-background-size: 600px;
    background-size: 600px;
  }
</style>
