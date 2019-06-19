<template>
  <div>
    <!--<child :val1="val1" :val2="val2"></child>-->
    <child @func1='Func1Click' @func2='Func2Click' :val1="val1" :second="second" :third="third"></child>
  </div>
</template>

<script>
  import Child from './component_s'
  export default {
    name: "component_f",
    components:{
      Child
    },
    data(){
      return{
        val1:"props val1",
        val2:"props val2",
        second:'props second',
        third:'props third'
      }
    },
    methods:{
      Func1Click(val) {
        this.second = val
      },
      Func2Click(val) {
        this.third = val
      }
    }
  }
</script>

<style scoped>

</style>
