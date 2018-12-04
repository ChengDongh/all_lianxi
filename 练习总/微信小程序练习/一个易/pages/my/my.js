var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')

Page({
  data: {
    user: null,
    orderCount: null,
    items: [
      [
        {
          title: "优惠券管理",
          icon: "/resource/image/hongbao.png",
          path: "/pages/coupon/coupon"
        },
        {
          title: "收件人管理",
          icon: "/resource/image/icon_receive.png",
          path: "/pages/express/express"
        },
        /*{
          title: "正品保障",
          icon: "/resource/image/iconfont-zhengpinbaozhang.png",
          path: "/pages/zhengpin/zhengpin"
        },
        {
          title: "货源需求",
          icon: "/resource/image/feedback.png",
          path: "/pages/feedback/feedback"
        }*/
      ],
      [
        {
          title: "联系客服&合作",
          icon: "/resource/image/service.png",
          path: "mobile"
        }
      ],
      // [
      //   {
      //     title: "新手入门",
      //     icon: "/resource/image/icon_new.png",
      //     path: "/pages/welcome/welcome"
      //   },
      //   {
      //     title: "设置",
      //     icon: "/resource/image/setting.png",
      //     path: "/pages/welcome/welcome"
      //   }
      // ]
    ]
  },
  onLoad:function(){
  },
  onShow: function () {
    var app = getApp()
    app.user.user_expire_day = utils.formatDay(app.user.user_expire_time)
    this.setData({
      user: app.user
    })
    this.loadData();
  },
  loadData: function () {
    var that = this
    /*ktop.request({
      api: "kml.o.ordersCount",
      finish: function (res, code) {
        if (code == 0) {
          that.setData({
            orderCount: res
          })
        }
      }
    })*/
  },
  doAction: function (e) {
    var path = e.currentTarget.dataset.path
    if (path == "mobile") {
      wx.makePhoneCall({
        phoneNumber: '13185061951'
      })
    } else {
      wx.navigateTo({
        url: path
      })
    }
  },
  gotoOrders: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/orderList/orderList?id=' + id
    })
  },
  upgrade:function(){
    wx.navigateTo({
       url: '/pages/levelSeting/levelSeting'
    })
  }
})

