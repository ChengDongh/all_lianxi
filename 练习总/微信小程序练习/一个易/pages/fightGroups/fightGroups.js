var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')

Page({
  data: {
    source: [],
    page: 1,
    id: 1
  },
  onLoad (options) {
    this.setData({
      id: options.id
    })
    this.loadData()
  },
  onShareAppMessage: function () {
    const that = this
    return {
      title: '快来抢优惠券',
      desc: '全球精选 美妆个护、母婴、保健品，对比多个供应商选择价格。只做正品， 假一罚三！',
      path: `/pages/fightProduct/fightProduct?id=${that.data.id}&refOpenid=${wx.getStorageSync('openid')}`
    }
  },
  more () {
    wx.switchTab({
      url: '/pages/market/market'
    })
  },
  loadData () {
    const that = this;
    wx.request({
      url: 'https://newyear.qiqiangkeji.com/productHongbaoIndex',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        let source = [];
        for (let product of res.data.data.data) {
          product.hongbao = 1;
          source.push(product);
        }
        that.setData({
          source
        })
      }
    })
  },
  product (e) {
    wx.redirectTo({
      url: `/pages/product/product?id=${e.currentTarget.dataset.id}`,
    })
  },
  getCoupon (e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const that = this;
    wx.request({
      url: 'https://newyear.qiqiangkeji.com/getHongbao',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: wx.getStorageSync('openid'),
        product_id: id,
      },
      method: 'POST',
      success: function (res) {
        const source = that.data.source
        console.log(source,index)
        source[index].hongbao = 0;
        that.setData({
          source
        })
        wx.showModal({
          title: '提示',
          content: '优惠券领取成功'
        })
      }
    })
  }
})

