<template>
  <div>
    <!--<div>-->
    <span>dausihdiu</span>
    <div>qajsdajsd</div>
    <!--</div>-->
    <button @click="sss">点击 </button>
  </div>
</template>

<script>
  export default {
    name: "child",
    data(){
      return{
        values:'',
        value1:'661',
        value2:'662'
      }
    },
    props:['val'],
    created(){
      this.values = this.val;
      console.log(this.values)
    },
    methods:{
      sss(){
        this.$emit('bbb',this.value1,this.value2)
      }
    }
  }
</script>

<style scoped>

</style>
