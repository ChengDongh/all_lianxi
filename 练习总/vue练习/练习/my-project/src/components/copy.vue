<template>
  <div>
    <!--<p id="msg"> copy message </p>-->
    <input type="text" id="msg" :value="msg">
    <button class="btn" data-clipboard-target="#msg" data-clipboard-text @click="copy">复制</button>
  </div>

</template>

<script>
  import Clipboard from 'clipboard';

  export default {
    name: "copy",
    data(){
      return{
        msg:'666666666'
      }
    },
    methods: {
      copy() {
        let clipboard = new Clipboard('.btn') //注意要使用let或者const，不能使用var，否则会出现复制次数叠加的问题，即复制不止一次。
//因为var是全局变量，let和const是局部
        clipboard.on('success', e => {
          alert('copy success')
          clipboard.destroy() //使用destroy可以清楚缓存
        })
        clipboard.on('error', e => {
          alert('failed')
          clipboard.destroy()
        })
      }
    }
  }
</script>

<style scoped>

</style>
