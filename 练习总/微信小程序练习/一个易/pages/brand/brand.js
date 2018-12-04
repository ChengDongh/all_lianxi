var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
Page({
  data: {
    brandId: 0,
    brand: {},
    products: []
  },
  onShareAppMessage: function () {
    return {
      title: '卡美啦',
      desc: '全球正品货源S2B服务专家,无需囤货，零库存低风险，一件代发,无忧售后',
      path: '/pages/welcome/welcome'
    }
  }
  ,
  onLoad: function (options) {
    this.setData({ brandId: options.id })
    this.loadData()
  },
  onPullDownRefresh: function () {
    this.loadData(
      function () {
        wx.stopPullDownRefresh()
      }
    )
  },
  onReachBottom: function () {
    this.loadProduct(this.data.products.length)
  },
  loadData: function (callback) {
    var that = this
    ktop.request({
      api: "kml.p.brandInfo",
      data: {
        brandId: that.data.brandId,
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        wx.setNavigationBarTitle({
          title: res.title
        })
        that.setData({ brand: res })
      }
    })
    this.loadProduct(0)
  },
  loadProduct: function (offset) {
    var that = this
    ktop.request({
      api: "kml.p.products",
      loading: true,
      data: {
        sortType: 2,
        brandId: that.data.brandId,
        limit: 10,
        offset: offset
      },
      finish: function (res, code) {
        utils.removewebps(res, "cover_image")
        if (offset == 0) {
          that.setData({ products: res })
        } else {
          that.setData({ products: that.data.products.concat(res) })
        }
      }
    })
  }
})