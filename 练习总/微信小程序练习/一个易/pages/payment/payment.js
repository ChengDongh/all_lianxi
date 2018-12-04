var ktop = require('../../utils/ktop.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var utils = require("../../utils/util.js");

Page({
  data: {
    order: [],
    need_identity: '',
    level: '',
    num: 1,
    addressInfo: null,
    arr: [],
    totalPrice: null,
    skuid: [],
    shopCarInfo: null,
    sort: []
  },
  onLoad: function (options) {
    var that = this;
    var data = this.data.order
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          level: res.data.user_level  //获得 level 等级
        })
      }
    })
    WxNotificationCenter.addNotification("expressChooseNotification", this.expressChoosed, this)
    WxNotificationCenter.addNotification("senderChooseNotification", this.senderChoosed, this)
  },
  onShow: function () {
    var that = this
    var address = this.data.addressInfo
    wx.getStorage({
      key: 'order',
      success: function (res) {
        that.setData({
          order: res.data
        })
        that.identity(res.data) //计算身份
        that.postFee() //计算运费
      }
    })
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data
        })
      }
    })
    wx.getStorage({
      key: 'sort',
      success: function (res) {
        that.setData({
          sort: res.data
        })
      }
    })
  },
  onUnload: function () {
    var that = this
    WxNotificationCenter.removeNotification("expressChooseNotification", that)
    WxNotificationCenter.removeNotification("senderChooseNotification", that)
  },
  identity: function (data) {
    var need_identity = 0;
    for (var item in data) {
      if (typeof data[item] == 'object') {
        for (var i = 0; i < data[item].shop.length; i++) {
          if (data[item].shop[i].product.need_identity == 1) {
            need_identity = 1;
            this.setData({
              need_identity: need_identity
            })
            return
          }
          if (data[item].shop[i].product.need_identity == 2) {
            need_identity = 2;
            this.setData({
              need_identity: need_identity
            })
            return
          }
        }
      }
    }
    this.setData({
      need_identity: need_identity
    })
  },
  chooseAddress: function (e) {
    wx.navigateTo({
      url: '/pages/express/express?isFromePlaceOrder=true&need_identity=' + this.data.need_identity
    })
  },
  expressChoosed: function (exp) {
    this.setData({
      addressInfo: exp
    })
  },
  postFee: function () {
    var that = this
    var data = this.data.order
    var addressInfo;
    if (this.data.addressInfo) {
      addressInfo = this.data.addressInfo.province_id
    } else {
      addressInfo = 0
    }
    var arr = [];
    var obj = {};
    var skuid = []
    for (var item in data) {
      if (typeof data[item] == 'object') {
        obj[item] = {}
        obj[item].orderKey = item
        obj[item].orderDetailParseInfos = [];
      }
    }
    for (var item in data) {
      if (typeof data[item] == 'object') {
        for (var i = 0; i < data[item].shop.length; i++) {
          var os = {
            productSkuId: data[item].shop[i].skus.id,
            quantity: data[item].shop[i].skus.quantity
          }
          skuid.push(data[item].shop[i].skus.id)
          obj[item].orderDetailParseInfos.push(os)
        }
      }
    }

    for (var q in obj) {
      arr.push(obj[q])
    }
    this.setData({
      skus: obj,
      skuid: skuid
    })
    var json = JSON.stringify(arr)
    var that = this
    ktop.request({
      api: "kml.p.postfee",
      loading: true,
      data: {
        orders: json,
        provinceId: addressInfo
      },
      finish: function (res, code) {
        that.warehouse(res)
      }
    })
  },
  /**
   * 重组仓库邮费
   */
  warehouse: function (data) {
    var order = this.data.order
    var address = this.data.addressInfo
    var obj = {}
    var totalPrice = 0;
    for (var i = 0; i < data.length; i++) {
      obj[data[i].orderKey] = {
        skusPrice: data[i].skusPrice,
        taxFee: data[i].taxFee,
        postFee: data[i].postFee,
        addressInfo: address || '',
        senderAddressInfo: { real_name: "" }
      }
    }
    console.log(obj)
    for (var j in obj) {
      order[j].skusPrice = obj[j].skusPrice
      order[j].taxFee = obj[j].taxFee
      order[j].postFee = obj[j].postFee
      totalPrice += obj[j].skusPrice + obj[j].postFee
    }
    this.setData({
      order: order,
      obj: obj,
      totalPrice: totalPrice
    })
  },
  /** 
   * 提交订单
  */
  subOrder: function () {
    var skus = this.data.skus
    var obj = this.data.obj
    var arr = []
    var that = this
    if (!this.data.addressInfo) {
      wx.showToast({
        title: '请选择收件人',
        icon: 'loading'
      });
      return
    }
    for (var item in obj) {
      obj[item].orderDetailParseInfos = skus[item].orderDetailParseInfos
    }
    for (var q in obj) {
      arr.push(obj[q])
    }
    var json = JSON.stringify(arr)
    that.removeSku()
    ktop.request({
      api: "kml.o.placeOrders",
      loading: true,
      data: {
        total_price: that.data.totalPrice,
        ordersInfo: json
      },
      finish: function (res, code) {
        if (code == 0) {
          that.removeSku()
          wx.redirectTo({
            url: '/pages/order/orderList/orderList?id=0'
          })
        } else {
          wx.navigateBack()
        }
      }
    })
  },
  /**
   * 提交订单成功 购物车删除同款商品
   */
  removeSku: function () {
    var skuid = this.data.skuid;
    var shopCarInfo = this.data.shopCarInfo
    var sort = this.data.sort
    for (var i = 0; i < skuid.length; i++) {
      for (var item in shopCarInfo) {
        if (typeof shopCarInfo[item] == 'object') {
          for (var j = 0; j < shopCarInfo[item].shop.length; j++) {
            if (skuid[i] == shopCarInfo[item].shop[j].skus.id) {
              shopCarInfo[item].shop.splice(j, 1)

            }
          }
          if (shopCarInfo[item].shop.length == 0) {
            for (var w = 0; w < sort.length; w++) {
              if (sort[w] == item) {
                sort.splice(w, 1)
              }
            }
            delete shopCarInfo[item]
          }
        }
      }
    }
    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo,
    })
    wx.setStorage({
      key: 'sort',
      data: sort,
    })
    wx.removeStorage({
      key: 'order',
    })
  }
})