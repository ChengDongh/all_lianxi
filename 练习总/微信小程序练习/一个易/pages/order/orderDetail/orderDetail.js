var ktop = require('../../../utils/ktop.js')
var utils = require('../../../utils/util.js')
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js")
var wxpay = require('../../../utils/wxpay.js')
Page({
  data: {
    orderId: 0,
    order: null,
    tips: []
  },
  onLoad: function (options) {
    var id = options.id ? options.id : 0;
    this.setData({
      orderId: id
    })
    this.loadData()
  },
  loadData: function (callback) {
    var that = this
    ktop.request({
      api: 'kml.o.order',
      data: {
        orderId: that.data.orderId
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        that.setupOrder(res)
        that.setData({ order: res })
      }
    })
  },
  setupOrder: function (order) {
    order.ct_time = utils.formatDay(order.create_time)
    var states = {
      1: "待付款",
      4: "待发货",
      7: "待收货",
      10: "交易完成",
      13: "已评价",
      15: "退款中",
      16: "已退款",
      19: "交易已关闭"
    }
    order.order_state = states[order.state]
    var stateStrs = {
      1: "请在2小时内完成付款，否则交易将自动关闭。",
      4: order.stockover_time > 0 ? "备货完成，等待揽件" : (order.stocking_time > 0 ? "订单处理完成，正在备货中" : "付款成功，订单等待处理"),
      7: order.orderExpressInfos ? ('您有' + order.orderExpressInfos.length + '个包裹在路上') : '',
      10: "感谢您使用我们的服务",
      13: "感谢您使用我们的服务。",
      15: "您的退款申请正在处理中，请耐心等候",
      16: "您的退款申请已处理完毕，感谢您使用我们的服务",
      19: "感谢您使用我们的服务。"
    }
    order.order_stateStr = stateStrs[order.state]

    var order_time = new Array();
    if (order.order_sn) {
      order_time.push({ "title": "订单号", "detail": order.order_sn })
    }
    if (order.create_time > 0) {
      order_time.push({ "title": "订单生成时间", "detail": utils.formatDay(order.create_time, 1) })
    }
    if (order.cancel_time > 0) {
      order_time.push({ "title": "交易关闭时间", "detail": utils.formatDay(order.cancel_time, 1) })
    }
    if (order.pay_time > 0) {
      order_time.push({ "title": "支付时间", "detail": utils.formatDay(order.pay_time, 1) })
    }
    if (order.delivery_time > 0) {
      order_time.push({ "title": "发货时间", "detail": utils.formatDay(order.delivery_time, 1) })
    }
    if (order.orderExpressInfos) {
      for (var i = 0; i < order.orderExpressInfos.length; i++) {
        var express = order.orderExpressInfos[i];
        if (order.orderExpressInfos.length == 1) {
          order_time.push({ "title": "运单号", "detail": express.express_number })
        } else {
          order_time.push({ "title": "运单号" + (i + 1), "detail": express.express_number })
        }
      }
    }
    if (order.delivered_time > 0) {
      order_time.push({ "title": "确认收货时间", "detail": utils.formatDay(order.delivered_time, 1) })
    }
    order.order_time = order_time;
    // 1.关闭交易 2.付款 3.订单追踪 4.再下一单 5.确认收获 6.删除订单
    var btnState = {
      1: { center: { flag: 1, title: "关闭交易" }, right: { flag: 2, title: "付款" } },
      4: { center: { flag: 3, title: "订单追踪" }, right: { flag: 4, title: "再下一单" } },
      7: { left: { flag: 4, title: "再下一单" }, center: { flag: 3, title: "订单追踪" }, right: { flag: 5, title: "确认收货" } },
      10: { center: { flag: 3, title: "订单追踪" }, right: { flag: 4, title: "再下一单" } },
      13: { center: { flag: 3, title: "订单追踪" }, right: { flag: 4, title: "再下一单" } },
      15: order.delivery_time > 0 ? { left: { flag: 3, title: "订单追踪" }, center: { flag: 6, title: "删除订单" } } : { center: { flag: 6, title: "删除订单" } },
      16: order.delivery_time > 0 ? { left: { flag: 3, title: "订单追踪" }, center: { flag: 6, title: "删除订单" } } : { center: { flag: 6, title: "删除订单" } },
      19: { center: { flag: 6, title: "删除订单" } }
    }
    order.buttonState = btnState[order.state]
  },
  gotoProduct: function (e) {
    var id = e.currentTarget.dataset.id
    wx.switchTab({
      url: '/pages/market/market',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/product/product?id=' + id
        })
      }
    })
  },
  orderTap: function (e) {
    var flag = e.currentTarget.dataset.flag
    switch (flag) {
      // 1.关闭交易 2.付款 3.订单追踪 4.再下一单 5.确认收获 6.删除订单
      case 1: {
        this.cancelOrder()
      }
        break;
      case 2: {
        var that = this
        wxpay.request({
          orderId: this.data.orderId,
          complete: function (res, code) {
            if (code == 0) {
              that.loadData();
              WxNotificationCenter.postNotificationName("orderStateChangeNotification");
            }
          }
        })
      }
        break;
      case 3: {
        wx.showToast({
          title: '请下载卡美啦App使用此功能',
          icon: 'loading'
        });
      }
        break;
      case 4: {
        var product_id = this.data.order.orderDetails[0].product_id
        wx.switchTab({
          url: '/pages/market/market',
          success: function (res) {
            wx.navigateTo({
              url: '/pages/product/product?id=' + product_id
            })
          }
        })
      }
        break;
      case 5: {
        this.sinOrder();
      }
        break;
      case 6: {
        this.deleOrder();
      }
        break;
    }
  },
  cancelOrder: function (callback) {
    var that = this
    ktop.request({
      api: 'kml.o.cancelOrder',
      data: {
        orderId: that.data.orderId
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        that.loadData();
        WxNotificationCenter.postNotificationName("orderStateChangeNotification");
      }
    })
  },
  deleOrder: function (callback) {
    var that = this
    ktop.request({
      api: 'kml.o.hiddenOrder',
      data: {
        orderId: that.data.orderId
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function (res) {
            WxNotificationCenter.postNotificationName("orderStateChangeNotification");
          }
        })
      }
    })
  },
  sinOrder: function (callback) {
    var that = this
    ktop.request({
      api: 'kml.o.acceptOrder',
      data: {
        orderId: that.data.orderId
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        that.loadData();
        WxNotificationCenter.postNotificationName("orderStateChangeNotification");
      }
    })
  }
})
