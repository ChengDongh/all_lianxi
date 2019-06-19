<template>
  <!--<div>{{val1}}</div>-->
  <div>
    <div>
      999{{val1}}
    </div>
    <next v-bind="$attrs" v-on="$listeners">
    </next>
  </div>


</template>

<script>
  import Next from './conponent_g'
  export default {
    name: "component_s",
    props: ['val1'],
    components:{
      Next
    },
    inheritAttrs:false,
    created(){
      console.log(this.$attrs)
    }
  }
</script>

<style scoped>

</style>
