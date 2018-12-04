var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
Page({
  data:{
    type:0,
    products:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var type = options.type ? options.type : 0;
   
    //  2天天特惠，4满返，5每日必转，6上新商品
   var titles ={
    6:"上新日报",
    5:"每日必转",
    2:"天天特惠"
   }
    this.setData({
      type :type,
      title:titles[type]
    })

   wx.setNavigationBarTitle({
     title: this.data.title
   })
    this.loadData(0);
  },
  onShow: function () {
    var app = getApp()
    if (app.user.id) {
        if(this.data.products.length == 0) {
            this.loadData()
        }
    } else {
      wx.redirectTo({
        url: '/pages/welcome/welcome'
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      desc: '全球正品货源S2B服务专家,无需囤货，零库存低风险，一件代发,无忧售后',
      path: '/pages/productList/productList?type='+this.data.type
    }
  },
  loadData:function(offset,callback){
    var that = this;
    ktop.request({
      api:"kml.p.productsByType",
      data:{
       type: that.data.type,
       limit:10,
       offset:offset
      },
      loading:true,
      finish:function(res, code){
        callback && callback();
        utils.removewebps(res, "country_url")
        if(offset == 0){
        that.setData({ products: res })
        } else {
       that.setData({ products: that.data.products.concat(res) })
        }
      }
    })
  },
   onPullDownRefresh: function () {
        this.loadData(0,
            function () {
                wx.stopPullDownRefresh()
            }
        )
  },
    onReachBottom: function () {
        this.loadData(this.data.products.length)
    },
})