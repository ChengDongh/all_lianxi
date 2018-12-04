var ktop = require('../../utils/ktop.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var utils = require("../../utils/util.js");
const md5 = require('../../utils/md5.js');
Page({
  data: {
    orderDetails: [],
    state: -1,
    product: null,
    ticket: null,
    productPrice: 0,
    currentExpress: {},
    orderid: null,
    checked: true,
    order_state: '',
    time: null,
  },
  onLoad: function(options) {
    this.setData({
      orderid: options.orderid ? options.orderid : null,
    })
  },
  refundorder: function(e) { //申请退款
    wx.navigateTo({
      url: '/pages/refund/refund?orderid=' + e.target.dataset.order.id,
    })
  },
  evaluate: function(e) { //评价
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderid=' + e.target.dataset.order.id,
    })
  },
  getcoupon: function(id) {
    let that = this;
    ktop.request({
      api: '/getUserHongbao1',
      data: {
        id: id,
        openid: wx.getStorageSync('openid')
      },
      finish: function(res) {
        // console.log(res)
        if (res.code == 0) {
          that.setData({
            ticket: res.data
          })
        }
      }
    })
  },
  getshopinfor: function() { //获取订单的信息
    let that = this;
    ktop.request({
      api: '/orderDetail',
      data: {
        openid: wx.getStorageSync('openid'),
        order_id: this.data.orderid
      },
      finish: function(res) {
        console.log(res)
        if (res.code == 0) {
          let state = -1;
          if (res.data.state == 1) {
            that.settime(res.data.remain_pay_seconds);
          }
          let order_state = '';
          switch (res.data.state) {
            case "1":
              state = -1;
              wx.setNavigationBarTitle({
                title: '待付款的订单',
              })
              break;
            case "4":
              state = 0;
              wx.setNavigationBarTitle({
                title: '待发货的订单',
              })
              order_state = '等待商家发货';
              break;
            case "5":
              state = 1;
              wx.setNavigationBarTitle({
                title: '待收货的订单',
              })
              order_state = '商家已发货';
              break;
            case "10":
              state = 2;
              wx.setNavigationBarTitle({
                title: '已完成的订单',
              })
              order_state = '交易完成';
              break;
            case "12":
              state = 2;
              wx.setNavigationBarTitle({
                title: '已评价的订单',
              })
              order_state = '交易完成';
              break;
            case "15":
              state = -1;
              wx.setNavigationBarTitle({
                title: '退款中的订单',
              })
              order_state = '退款中';
              break;
            case "16":
              state = -1;
              wx.setNavigationBarTitle({
                title: '已退款的订单',
              })
              order_state = '已退款';
              break;
            case "19":
              state = -1;
              wx.setNavigationBarTitle({
                title: '已取消的订单',
              })
              order_state = '交易关闭';
              break;
          }
          res.data.create_time = utils.formatTime(res.data.create_time, 1); //转换时间
          that.setData({
            product: res.data,
            currentExpress: res.data.address,
            state,
            order_state
          })
          if (res.data.hongbao_id) {
            that.getcoupon(res.data.hongbao_id)
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
          })
        }
      }
    })
  },
  settime: function(times) { //设置倒计时时间
    let that = this;
    var timer = null;
    let time;
    timer = setInterval(function() {
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0; //时间默认值
      if (times > 0) {
        hour = times / 3600 >= 1 ? times / 3600 : 0;
        minute = Math.floor((times - (hour * 3600)) / 60) >= 1 ? Math.floor((times - (hour * 3600)) / 60): 0;
        second = times-hour*3600-minute*60;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        time = {
          day,
          hour,
          minute,
          second
        };
      } else {
        time = {
          day,
          hour,
          minute,
          second
        };
        clearInterval(timer)
      }
      that.setData({
        time,
      })
      times--;
    }, 1000);

  },
  onShow: function() {
    this.getshopinfor();
  },
  onUnload: function() {
    // var that = this
    // WxNotificationCenter.removeNotification("expressChooseNotification", that)
    // WxNotificationCenter.removeNotification("senderChooseNotification", that)
    // WxNotificationCenter.removeNotification("expressChooseCoupon", that)
    // var app = getApp()
    // app.product = null
  },
  orderTap: function() { //确认付款
    let that = this;
    ktop.request({
      api: '/wxPrepay',
      data: {
        order_id: this.data.orderid,
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
                  that.getshopinfor();
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
  collectgoods: function() { //确认收货
    let that = this;
    wx.showModal({
      title: '确认收货',
      content: '确认收货吗?',
      success: function(res) {
        if (res.confirm) {
        ktop.request({
          api: '/orderFinish',
          data: {
            openid: wx.getStorageSync('openid'),
            order_id: that.data.orderid
          },
          finish: function(res) {
            console.log(res)
            if (res.code == 0) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                success: function() {
                  setTimeout(function() {
                    that.getshopinfor();
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
      }
    })

  },
  extendgoods: function() { //延长收货
    let that = this;
    wx.showModal({
      title: '延长收货时间',
      content: '每笔订单只能延长一次收货时间，如需多次延长请联系商家！',
      success: function(res) {
        if (res.confirm) {
        ktop.request({
          api: '/orderDelayFinish',
          data: {
            openid: wx.getStorageSync('openid'),
            order_id: that.data.orderid
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
  evaluate: function() { //评价
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderid=' + this.data.orderid,
    })
  },
  againorder: function(e) { //再来一单
  console.log(e)
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
  },
})