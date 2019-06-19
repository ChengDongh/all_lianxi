var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    page: 1,
    orders: [{
        id: 0,
        orderState: 0,
        title: "全部",
        bar_color: "bar_color",
      },
      {
        id: 1,
        orderState: 1,
        title: "待付款",
        bar_color: "unbar_color",
      },
      {
        id: 2,
        orderState: 9,
        title: "已取消",
        bar_color: "unbar_color",
      },
      {
        id: 3,
        orderState: 4,
        bar_color: "unbar_color",
        title: "待发货",
      },
      {
        id: 4,
        orderState: 5,
        bar_color: "unbar_color",
        title: "已发货",
      },
      {
        id: 5,
        orderState: 10,
        bar_color: "unbar_color",
        title: "已完成",
      }
    ],
    currentOrder: [],
    status: 0,
    isBack: 'true',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (JSON.stringify(options) != '{}') {
      this.setData({
        isBack: options.isBack
      })
    }
    this.setData({
      id: 0,
      openid: wx.getStorageSync('openid')
    })
    this.loadData()
  },
  //头部的tabbar
  selectBar: function(e) {
    var orders = this.data.orders;
    var status = e.currentTarget.dataset.id;
    for (let value of orders) {
      if (value.orderState != e.currentTarget.dataset.id) {
        value.bar_color = 'unbar_color';
      } else {
        value.bar_color = 'bar_color';
      }
    }
    this.setData({
      page: 1,
      orders,
      status,
      currentOrder: [],
    })
    this.loadData();
  },
  //再来一单
  go_back: function(e) {
    var that = this;
    var orderID = e.currentTarget.dataset.index;
    var allOrder = wx.getStorageSync('allOrder');
    var orderInfo = wx.getStorageSync('orderInfo');
    for (let val of allOrder) {
      if (val.orderID == orderID) {
        orderInfo = val.content;
      }
    }
    wx.setStorage({
      key: 'orderInfo',
      data: orderInfo,
      success: function() {
        if (that.data.isBack == 'true') {
          that.setData({
            isBack: 'false'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.navigateTo({
            url: '/pages/placeorder/palceorder',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    WxNotificationCenter.addNotification("changeorder", this.getoptions, this);
  },
  updateBtn:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: 'http://hisin.natapp1.cc/order/updateStatus',
      method: 'POST',
      data: {
        openid: that.data.openid,
        orderNum: e.currentTarget.dataset.index,
        status:10
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            page:1,
            currentOrder:[],
          })
          that.loadData()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  getoptions:function(){
    this.setData({
      page:1,
      currentOrder:[]
    })
    this.loadData();
  },
  loadData: function() {
    var that = this;
    var currentOrder = that.data.currentOrder
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://hisin.natapp1.cc/order/getOrders',
      method: 'POST',
      data: {
        openid: that.data.openid,
        status: that.data.status,
        page: that.data.page,
        orderId: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          currentOrder.push(...res.data.data)
          that.setData({
            currentOrder
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  //取消订单
  cancelBtn: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗?',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: 'http://hisin.natapp1.cc/order/closeOrder',
            method: 'POST',
            data: {
              openid: that.data.openid,
              orderNum: index
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: res.msg,
                  icon: 'success',
                  duration: 1000,
                  success: function() {
                    setTimeout(function() {
                      that.setData({
                        page: 1,
                        currentOrder: [],
                      })
                      that.loadData();
                    }, 1000)
                  }
                })

              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            },
            fail: function(err) {
              console.log(err)
            }
          })
        }
      }
    })
  },
  //确定支付
  confirmBtn: function(e) {
    let that = this;
    var orderId = e.currentTarget.dataset.index;
    var product;
    for (let i of that.data.currentOrder){
      if (i.order.id == orderId){
        product = i;
        break;
      }
    }
    var cart = [];
    for (let i of product.orderDetailVo) {
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
                  success:function(res){
                    this.setData({
                      page: 1,
                      currentOrder: []
                    })
                    that.loadData();
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      currentOrder: []
    })
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page
    })
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})