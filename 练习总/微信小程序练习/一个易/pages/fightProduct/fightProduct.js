var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')

Page({
  data: {
    product: {},
    hongbao: 0
  },
  onLoad (options) {
    if (!options.id) {
      this.loadData(1)
    } else {
      this.loadData(options.id)
    }
    /*const refId = options.refOpenid
    if (refId) {*/
    /*}*/
  },
  loadData (id) {
    wx.showShareMenu({
      withShareTicket: true
    })
    const that = this
    wx.request({
      url: 'https://newyear.qiqiangkeji.com/productWXDetail',
      header: {
        'content-type': 'application/json'
      },
      data: {
        product_id: id,
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      success: function (res) {
        let hongbao = res.data.data.hongbao
        const product = res.data.data.product
        if (!hongbao) {
          /*if (wx.getStorageSync('refOpenid')) {*/
              if (product.hongbao_price > 0) {
                hongbao = 2
              }
          /*}*/
        }
        product.skuId = product.sku[0].id
        product.price = product.sku[0].price
        product.inventory = product.sku[0].inventory
        product.pre_price = product.sku[0].pre_price
        const app = getApp();
        app.product = product;
        
        that.setData({
          product: product,
          hongbao: hongbao
        })
      }
    })
  },
  buyProduct () {
    var app = getApp()
    app.product = this.data.product
    wx.redirectTo({
      url: `/pages/product/product?id=${this.data.product.id}`
    })
  },
  more () {
    wx.switchTab({
      url: '/pages/market/market'
    })
  },
  onShareAppMessage: function () {
    return {
      title: `快来抢${this.data.product.title}`,
      desc: '全球精选 美妆个护、母婴、保健品，对比多个供应商选择价格。只做正品， 假一罚三！',
      path: `/pages/fightProduct/fightProduct?refOpenid=${wx.getStorageSync('openid')}&id=${this.data.product.id}`
    }
  },
  getHb () {
    const that = this
    wx.request({
      url: 'https://newyear.qiqiangkeji.com/getHongbao',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: wx.getStorageSync('openid'),
        product_id: that.data.product.id,
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          hongbao: 1
        })
        wx.showModal({
          title: '提示',
          content: '优惠券领取成功'
        })
      }
    })
  }
})

