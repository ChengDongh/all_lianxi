<template>
  <div>
    <div class="top">
      <span class="out" @click="logout">退出</span>
    </div>
    <div class="left_box">
      <Menu :theme="theme3" ref="shop" :active-name="shop">
      <MenuItem name="speeding_week" to="/speeding_week">
      车辆超速报警周报表
      </MenuItem>
      <MenuItem name="rest" to="/rest">
      凌晨连续休息未超过三小时抽查表
      </MenuItem>
      <MenuItem name="vehicle_month" to="/vehicle_month">
      危险货运车辆月报表
      </MenuItem>
      <MenuItem name="vehicle_online" to="/vehicle_online">
      危险货运车量在线排名月报表
      </MenuItem>
      <MenuItem name="speeding_month" to="/speeding_month">
      危险货运车量超速排名月报表
      </MenuItem>
      <MenuItem name="warehouse_distribution" to="/warehouse_distribution">
      化工企业厂区仓库布局图
      </MenuItem>
      <MenuItem name="vehicle_survey" to="/vehicle_survey">
      化工运输车辆概览
      </MenuItem>
      <MenuItem name="real_time_monitoring" to="/real_time_monitoring">
      运输车辆即时监控
      </MenuItem>
      </Menu>
    </div>
  </div>

</template>
<script>
  import {post} from '../libs/ajax'

  export default {
    data() {
      return {
        theme3: 'dark',
        shop:''
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.shop = this.$route.path.slice(1)
        this.$refs.shop.updateActiveName()
      })
    },
    methods: {
      logout() {
        var that = this;
        post('/logout', function (res) {
          if (res.code == 0) {
            localStorage.setItem('adminId', '');
            that.$router.push({
              path: '/'
            })
          }
        })
      },
    }
  }
</script>
<style scoped>
  .ivu-menu-dark {
    height: 95vh;
    width: 18vw !important;
    background: #515a6e;
  }
  .top {
    height: 5vh;
    width: 100%;
    background: #515a6e;
    position: relative;
  }

  .out {
    color: #2db7f5;
    font-size: 14px;
    position: absolute;
    right: 30px;
    top: 8px;
    cursor: pointer;
  }
</style>
