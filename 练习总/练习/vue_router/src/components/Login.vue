<template>
  <div class="login">
    <div>
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="username" id="username">
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="text" v-model="password" id="password">
      </div>
      <button @click="submit">登录</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        username_s:'root',
        password_s:123456,
        username:"",
        password:""
      }
    },
    methods:{
      submit(){
        // console.log(data.username)
        if(this.username == this.username_s && this.password == this.password_s){
          var data = {
            username_s:'root',
            password_s:123456,
          }
          localStorage.setItem('login',JSON.stringify(data))
          this.$router.push('/Index');
        }else {
          alert('错误')
        }
      }
    }
  }
</script>

<style scoped>

</style>
