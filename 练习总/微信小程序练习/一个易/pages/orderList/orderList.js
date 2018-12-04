var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
var wxpay = require('../../utils/wxpay.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")

Page({
  data: {
    orders: [{
        id: 0,
        orderState: 0,
        title: "全部",
        selected: "unselected",
        orders: []
      },
      {
        id: 1,
        orderState: 1,
        title: "待付款",
        selected: "unselected",
        orders: []
      },
      {
        id: 2,
        orderState: 4,
        selected: "unselected",
        title: "待发货",
        orders: []
      },
      {
        id: 3,
        orderState: 5,
        selected: "unselected",
        title: "已发货",
        orders: []
      },
      {
        id: 4,
        orderState: 10,
        selected: "unselected",
        title: "已完成",
        orders: []
      }
    ],
    page: 1, //请求的页
    currentOrder: null, //选中光标的产品信息,
    id: 0
    // states: ['未付款', '已完成', '已付款','已取消']
  },
  onLoad: function(options) {
    var id = options.id ? options.id : 0;
    this.setData({
      id
    })
    // WxNotificationCenter.addNotification("orderStateChangeNotification", that.orderChange, that)
  },
  onShow: function() {
    console.log(11111)
    this.updateCurrentOrder(this.data.id);
  },
  onUnload: function() {
    // 页面关闭  移除通知
    var that = this
    WxNotificationCenter.removeNotification("orderStateChangeNotification", that)
  },
  doAction: function(e) {
    var id = e.currentTarget.dataset.id
    if (id === this.data.currentOrder.id) {
      return false;
    }
    this.updateCurrentOrder(id);

  },
  updateCurrentOrder: function(id) {
    this.setData({
      page: 1
    })
    if (this.data.currentOrder) {
      this.data.orders[this.data.currentOrder.id].selected = "unselected"
    }
    var currentOrder = this.data.orders[id]
    currentOrder.selected = "selected";
    this.setData({
      currentOrder: currentOrder,
      orders: this.data.orders,
      id
    })
    this.loadData(this.data.currentOrder.orderState, 1);
  },
  onReachBottom: function() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page
    })
    this.loadData(this.data.currentOrder.orderState, this.data.page);
  },
  onPullDownRefresh:function(){
    let currentOrder = this.data.currentOrder;
    this.setData({
      page:1
    })
    this.loadData(this.data.currentOrder.orderState, this.data.page, function () {
      wx.stopPullDownRefresh();
      currentOrder.orders = [];
    })
  },
  loadData: function(option, page,callback) {
    let that = this;
    let currentOrder = this.data.currentOrder;
    if(callback)
    callback();
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let openid = wx.getStorageSync('openid');
    ktop.request({
      api: '/myOrders',
      data: {
        openid: openid,
        state: option,
        page: page
      },
      finish: function(res) {
        wx.hideLoading()
        if (res.code == 0) {
          for (let i of res.data.data) {
            switch (i.state) {
              case "1":
                i.statename = "待支付"
                break;
              case "4":
                i.statename = "已支付"
                break;
              case "5":
                i.statename = "已发货"
                break;
              case "10":
                i.statename = "已完成"
                break;
              case "12":
                i.statename = "已评价"
                break;
              case "15":
                i.statename = "退款中"
                break;
              case "16":
                i.statename = "已退款"
                break;
              case "19":
                i.statename = "已取消"
                break;
            }
          }
          currentOrder.orders.push(...res.data.data)
          that.setData({
            currentOrder,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
          })
        }
      }
    })
  },
  // 订单按钮点击！！！！！！！！！！
  orderTap: function(e) { //确认付款
    let that = this;
    let state = e.target.dataset.state;
    let orderid = e.target.dataset.order.id;
    ktop.request({
      api: '/wxPrepay',
      data: {
        order_id: orderid,
        openid: wx.getStorageSync('openid')
      },
      finish: function(res) {
        let timeStamp = String(res.data.timestamp); //时间戳
        let nonceStr = res.data.nonceStr; //随机字符串
        let packages = res.data.package; //返回的订单id
        let paySign = res.data.paySign;
        let signType = res.data.signType;
        wx.requestPayment({
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': packages,
          'signType': signType,
          'paySign': paySign,
          'success': function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000,
              success: function() {
                setTimeout(function() {
                  that.updateCurrentOrder(2);
                }, 2000)
              }
            })
          },
          'fail': function(res) {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000,
            })
          },
          'complete': function(res) {}
        })
      }
    })
  },
  // 取消订单
  cancelorder: function(e) {
    let that = this;
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function(res) {
        if (res.confirm) {
          ktop.request({
            api: '/orderCancel',
            data: {
              openid: wx.getStorageSync('openid'),
              order_id: e.target.dataset.order.id
            },
            finish: function(res) {
              if (res.code == 0) {
                wx.showToast({
                  title: res.msg,
                  icon: 'success',
                  duration: 1000,
                  success: function() {
                    setTimeout(function() {
                      that.updateCurrentOrder(that.data.currentOrder.id)
                    }, 1000)
                  }
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  collectgoods: function(e) { //确认收货
    let that = this;
    wx, wx.showModal({
      title: '确认收货',
      content: '确认收货吗?',
      success: function(res) {
        if (res.confirm) {
          ktop.request({
            api: '/orderFinish',
            data: {
              openid: wx.getStorageSync('openid'),
              order_id: e.target.dataset.order.id
            },
            finish: function(res) {
              if (res.code == 0) {
                wx.showToast({
                  title: res.msg,
                  icon: 'success',
                  success: function() {
                    setTimeout(function() {
                      that.updateCurrentOrder(that.data.currentOrder.id)
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      },
    })
  },
  extendgoods: function(e) { //延长收货
    wx.showModal({
      title: '延长收货时间',
      content: '每笔订单只能延长一次收货时间，如需多次延长请联系商家！',
      success: function(res) {
        if (res.confirm) {
          ktop.request({
            api: '/orderDelayFinish',
            data: {
              openid: wx.getStorageSync('openid'),
              order_id: e.target.dataset.order.id
            },
            finish: function(res) {
              if (res.code == 0) {
                wx.showToast({
                  title: res.msg,
                  icon: 'success'
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  logistics: function(e) { //物流

  },
  evaluate: function(e) { //评价
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderid=' + e.target.dataset.order.id,
    })
  },
  againorder: function(e) { //再来一单
    let order = [];
    for (let i of e.target.dataset.order.order_detail) {
      let or = {};
      or.num = i.quantity;
      or.title = i.product_name;
      or.image = i.image;
      or.productId = i.product_id;
      or.sku = {
        id: i.sku_id,
        price: i.price,
        param1: i.param1,
        param2: i.param2,
      }
      order.push(or);
    }
    wx.setStorage({
      key: 'orderinfor',
      data: order,
      success: function() {
        wx.navigateTo({
          url: '/pages/placeorder/placeorder?fromid=1',
        })
      }
    })
  }

})