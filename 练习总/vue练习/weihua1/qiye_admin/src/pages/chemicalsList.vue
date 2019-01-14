<template>
  <div class="chemicalsList_box">
    <div class="info_cont">
      <span>危化品列表</span>
    </div>
    <div class="contents">
      <Table :columns="columns1" :data="data1" ref="table"></Table>
    </div>
    <div style="text-align: center;margin-top: 30px">
      <button class="submit_btn" @click="add">新增</button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "chemicalsList",
      data() {
        return {
          columns1: [
            {
              title: '危险性提示词',
              key: 'tips',
            },
            {
              title: '品名',
              key: 'product_name',
            },
            {
              title: '英文名及分子式',
              key: 'name_formula',
            },
            {
              title: 'CC码及CAS号',
              key: 'cc_code',
            },
            {
              title: '危险标志',
              key: 'danger_label',
              render:(h,params) => {
                console.log(params)
                return h('div',[
                    h('img',{
                      attrs:{
                        src: params.row.danger_signs,
                      },
                      style: {
                        width: '40px',
                        height: '40px'
                      }
                    }),
                  ]
                )}
            }
          ],
          data1: [
            {
              tips: '易燃',
              product_name: '乙酸乙酯(醋酸乙酯)',
              name_formula: 'ethyl acetate',
              cc_code: 'CAS号:141-78-6',
              danger_signs:'http://cdn.qiqiangkeji.com/20181220.a28eaa62a7c51d87e63448e103909c00_388x388.png',
            },
            {
              tips: '易爆',
              product_name: '重氮甲烷',
              name_formula: 'diazomethane',
              cc_code: 'CAS号:334-88-3',
              danger_signs:'http://cdn.qiqiangkeji.com/20181220.9a25f85d9b60b0eb926950a5555a09fc_388x388.png',
            }
          ]
        }
      },
      methods:{
        add:function () {
          this.$router.push({
            path:'/chemicals'
          })
        }
      }
    }
</script>

<style scoped>
  .chemicalsList_box{
    position: relative;
  }
  .info_cont {
    height: 60px;
    width: 100%;
    line-height: 60px;
    color: white;
    font-size: 18px;
    text-indent: 30px;
    background: linear-gradient(to right, rgb(112, 175, 226), rgb(59, 120, 165));
  }
  .submit_btn{
    position: absolute;
    top: 15px;
    right: 20px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: none;
    background: #2db7f5;
    border-radius: 5px;
    color: white;
  }
</style>
