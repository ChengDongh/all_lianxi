<template>
  <div class="login_box">
    <div class="imgs">
      <img class="img_1 img_s" src="../assets/logo1.png" alt="">
      <img class="img_2 img_s" src="../assets/logo1.png" alt="">
      <img class="img_3 img_s" src="../assets/logo1.png" alt="">
      <img class="img_4 img_s" src="../assets/logo1.png" alt="">
      <img class="img_5 img_s" src="../assets/logo1.png" alt="">
      <img class="img_6 img_s" src="../assets/logo1.png" alt="">
      <img class="img_7 img_s" src="../assets/logo1.png" alt="">
      <img class="img_8" src="../assets/map.png" alt="">
      <img class="img_9" src="../assets/1-right.png" alt="">
    </div>
    <div class="from">
      <div style="padding-bottom: 20px;font-size: 18px">危化品运输包装监测管理平台</div>
      <Form :model="formItem" :label-width="80">
        <FormItem label="账号:">
          <Input v-model="formItem.username" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="密码:">
          <Input type="password" v-model="formItem.password" placeholder="输入密码"></Input>
        </FormItem>
        <Button type="primary" @click="submit">登 录</Button>
      </Form>
    </div>
  </div>
</template>

<script>
  import {post} from '../libs/ajax'
  import {hex_md5} from '../libs/md5'
  export default {
    name: "login",
    data() {
      return {
        formItem: {
          username: '',
          password: ''
        }
      }
    },
    created() {
      var name = localStorage.getItem('username');
      var password = localStorage.getItem('password')
      if(name){
        this.formItem.username = name
      }
      if(password){
        this.formItem.password = password
      }
    },
    methods: {
      submit() {
        var that = this;
        that.formItem.username = that.formItem.username.trim()
        that.formItem.password = that.formItem.password.trim()
        if (!that.formItem.username) {
          that.$Message.info('请输入用户名');
          return false
        }
        if (!that.formItem.password) {
          that.$Message.info('请输入密码');
          return false
        }
        var password = hex_md5(that.formItem.password.trim())
        var username = that.formItem.username
        post('/login', {username: that.formItem.username, password: password},
          function (res) {
            if (res.code == 0) {
              localStorage.setItem('username', username);
              localStorage.setItem('password',that.formItem.password);
              if(res.data.admin.id === 1){
                localStorage.setItem('adminId','good')
              } else {
                localStorage.setItem('adminId','')
              }
              that.$router.push({
                path:'/index'
              })
            } else {
              that.$Message.info('用户名或者密码错误')
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  .login_box {
    background: #303941;
    width: 100%;
    height: 100vh;
    position: relative;
  }

  .from {
    width: 400px;
    height: 400px;
    padding: 60px 10px 80px 20px;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    position: absolute;
    right: 100px;
    top: 19%;
    opacity: 0.8;
    border-radius: 10px;
  }

  .ivu-input-wrapper {
    width: 70% !important;
    left: -30px;
  }

  .ivu-btn-primary {
    width: 200px!important;
    margin-top: 10px;
  }
  .img_s {
    width: 45px;
    height: 45px;
    position: absolute;
    z-index: 999;
  }

  .img_1 {
    top: 46%;
    left: 35%;
  }

  .img_2 {
    top: 30%;
    left: 46%;
  }

  .img_3 {
    top: 40%;
    left: 41%;
  }

  .img_4 {
    top: 45%;
    left: 24%;
  }

  .img_5 {
    top: 63%;
    left: 40%;
  }

  .img_6 {
    top: 57%;
    left: 32%;
  }

  .img_7 {
    top: 52%;
    left: 42%;
  }

  .img_8 {
    width: 600px;
    height: 500px;
    position: absolute;
    top: 18%;
    left: 13%;
    display: block;
  }

  .img_9 {
    position: absolute;
    top: 8%;
    left: 5%;
  }
</style>
