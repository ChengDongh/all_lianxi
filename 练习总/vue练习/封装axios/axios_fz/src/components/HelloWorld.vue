<template>
  <div class="hello">
    <el-button type="primary" @click="post">发送post请求</el-button>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    post(){
      var data={
        page: 1,
        order_md5:'',
        title:'',
        state: '',
      }
      this.$http.post("/orderDeliveryIndex6",data).then(res => {
          console.log(res);
        }).catch(error => {
          console.log(error);
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
