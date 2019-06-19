var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var utils = require("../../utils/util.js");
Page({
  data: {
    openid:'',
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
      openid: wx.getStorageSync('openid'),
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
    wx.hideLoading();
    wx.request({
      url: 'http://hisin.natapp1.cc/order/getOrders',
      method: 'POST',
      data: {
        openid: that.data.openid,
        orderId: that.data.orderid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          let state = -1;
          if (res.data.data[0].order.status == 1 && res.data.data[0].expiredTime>=0) {
            that.settime(res.data.data[0].expiredTime);
          }
          var order_state = '';
          if (res.data.data[0].order.status == 9){
            state = -1;
            wx.setNavigationBarTitle({
              title: '已取消的订单',
            })
            order_state = '交易关闭';
          } else if (res.data.data[0].order.status == 1){
            state = -1;
            wx.setNavigationBarTitle({
              title: '待付款的订单',
            })
          } else if (res.data.data[0].order.status == 4){
            state = 0;
            wx.setNavigationBarTitle({
              title: '待发货的订单',
            })
            order_state = '等待商家发货';
          } else if (res.data.data[0].order.status == 5) {
            state = 1;
            wx.setNavigationBarTitle({
              title: '待收货的订单',
            })
            order_state = '商家已发货';
          } else if (res.data.data[0].order.status == 10) {
            state = 2;
            wx.setNavigationBarTitle({
              title: '已完成的订单',
            })
            order_state = '交易完成';
          }
          // switch (res.data.data[0].order.status) {
          //   case "1":
          //     state = -1;
          //     wx.setNavigationBarTitle({
          //       title: '待付款的订单',
          //     })
          //     break;
          //   case "4":
          //     state = 0;
          //     wx.setNavigationBarTitle({
          //       title: '待发货的订单',
          //     })
          //     order_state = '等待商家发货';
          //     break;
          //   case "5":
          //     state = 1;
          //     wx.setNavigationBarTitle({
          //       title: '待收货的订单',
          //     })
          //     order_state = '商家已发货';
          //     break;
          //   case "10":
          //     state = 2;
          //     wx.setNavigationBarTitle({
          //       title: '已完成的订单',
          //     })
          //     order_state = '交易完成';
          //     break;
          //   case "12":
          //     state = 2;
          //     wx.setNavigationBarTitle({
          //       title: '已评价的订单',
          //     })
          //     order_state = '交易完成';
          //     break;
          //   case "15":
          //     state = -1;
          //     wx.setNavigationBarTitle({
          //       title: '退款中的订单',
          //     })
          //     order_state = '退款中';
          //     break;
          //   case "16":
          //     state = -1;
          //     wx.setNavigationBarTitle({
          //       title: '已退款的订单',
          //     })
          //     order_state = '已退款';
          //     break;
          //   case "9":
          //     state = -1;
          //     wx.setNavigationBarTitle({
          //       title: '已取消的订单',
          //     })
          //     order_state = '交易关闭';
          //     break;
          // }
          res.data.data[0].order.createTime = utils.formatTime(res.data.data[0].order.createTime); //转换时间
          that.setData({
            product: res.data.data[0],
            currentExpress: res.data.data[0].address,
            state,
            order_state
          })
          // if (res.data.hongbao_id) {
          //   that.getcoupon(res.data.hongbao_id)
          // }
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
          })
        }
      },
      fail: function (err) {
        console.log(err)
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
        that.getshopinfor()
        WxNotificationCenter.postNotificationName("changeorder");
        clearInterval(timer);
        
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
  orderTap: function() { //确认付款
    let that = this;
    var product = that.data.product
    var cart = [];
    for (let i of that.data.product.orderDetailVo) {
      cart.push({
        num: i.orderDetail.quantity,
        id: i.orderDetail.skuId
      });
    }
    
    var data = {
      openid: that.data.openid,
      addressId: product.address.id,
      comment: product.order.userNote,
      cart: cart,
      notifyFlag: product.order.notifyFlag,
      payPrice: product.order.payPrice,
      orderNum: product.order.orderNum
    }
    wx.request({
      url: 'http://hisin.natapp1.cc/order/createOrder',
      method: 'POST',
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          let timeStamp = String(res.data.data.timeStamp); //时间戳
          let nonceStr = res.data.data.nonceStr; //随机字符串
          let packages = res.data.data.wxOrderPrepayId; //返回的订单id
          let paySign = res.data.data.paySign;
          let signType = res.data.data.signType;
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': packages,
            'signType': signType,
            'paySign': paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    WxNotificationCenter.postNotificationName("changeorder");
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '/pages/orderList/orderList',
                      })
                    }, 1500)
                  }
                })
              }
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000,
              })
            }
          })
        }
      },
      fail: function (err) {
        console.log(err)
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
  // extendgoods: function() { //延长收货
  //   let that = this;
  //   wx.showModal({
  //     title: '延长收货时间',
  //     content: '每笔订单只能延长一次收货时间，如需多次延长请联系商家！',
  //     success: function(res) {
  //       if (res.confirm) {
  //       ktop.request({
  //         api: '/orderDelayFinish',
  //         data: {
  //           openid: wx.getStorageSync('openid'),
  //           order_id: that.data.orderid
  //         },
  //         finish: function(res) {
  //           if (res.code == 0) {
  //             wx.showToast({
  //               title: res.msg,
  //               icon: 'success'
  //             })
  //           } else {
  //             wx.showToast({
  //               title: res.msg,
  //               icon: 'none'
  //             })
  //           }
  //         }
  //       })
  //       }
  //     }
  //   })

  // },
  // logistics: function(e) { //物流

  // },
  // evaluate: function() { //评价
  //   wx.navigateTo({
  //     url: '/pages/evaluate/evaluate?orderid=' + this.data.orderid,
  //   })
  // },
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
  },
})