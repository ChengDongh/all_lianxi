<template>
  <div class="page-search">
    <mt-search
      v-model="value"
      cancel-text="取消"
      placeholder="搜索">
    </mt-search>
  </div>
</template>

<script>
  export default {
    name: 'search',
    data() {
      return {
        value: '',
        // 默认数据
        defaultResult: [
          'Apple',
          'Banana',
          'Orange',
          'Durian',
          'Lemon',
          'Peach',
          'Cherry',
          'Berry',
          'Core',
          'Fig',
          'Haw',
          'Melon',
          'Plum',
          'Pear',
          'Peanut',
          'Other'
        ]
      };
    },
    computed: {
      filterResult() {
        return this.defaultResult.filter(value => new RegExp(this.value, 'i').test(value));
      }
    }
  };
</script>

<style lang="css">
  .page-search {
    height: 100%;
  }
</style>
