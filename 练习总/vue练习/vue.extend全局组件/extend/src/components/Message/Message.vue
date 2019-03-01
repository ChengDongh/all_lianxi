<template>
  <transition name="fade">
    <div class="message" :class="type" v-show="show">
      <i class="icon"></i>
      <span class="text">{{text}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "message",
    props: {
      type: {
        type: String,
        default: 'info',
        validate: val => ['info', 'success', 'warning', 'error'].includes(val)
      },
      text: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style scoped>
  .message{
    color: red;
    width: 200px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin: 0 auto;
    animation: frames 2s;
    position: relative;
    top: -120px;
  }
  @keyframes frames{
    form{top:-120px}
    to{top:50px}
  }
</style>
