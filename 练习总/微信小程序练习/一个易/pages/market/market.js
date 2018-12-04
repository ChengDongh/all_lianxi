var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
Page({
  data: {
    banners: [],
    countryBanners: [],
    homenavs: [],
    dayProduct: {},
    bannerNewResult: {},
    bannerPriceResult: {},
    products: [],
    page: 1,
    category_id: 0,
    title: '',
    hotSearch: [],
    hotSearch1: {
      title: '推荐'
    },
    animationData: '',
    showhongbao: false,
    hbtitle: '',
    hbprice: '',
    hongbaocg: false,
  },
  onShareAppMessage: function() {
    return {
      title: '一个易商城',
      path: `/pages/market/market?refOpenid=${wx.getStorageSync('openid')}`
    }
  },
  onLoad: function() {
    var app = getApp()
    this.loadData();
    let that = this;
    ktop.request({
      api: '/checkHongbao',
      data: {
        openid: wx.getStorageSync('openid')
      },
      finish: function(res) {
        if (res.code == 0) {
          that.setData({
            hbtitle: res.data.title,
            hbprice: res.data.price
          })
          let animation = wx.createAnimation({
            duration: 500,
            timingFunction: "linear",
            delay: 0
          })
          that.animation = animation;
          setTimeout(function() {
            that.setData({
              showhongbao: true
            })
            let animation = that.animation;
            animation.width("632rpx").height("764rpx").opacity(1).step();
            that.setData({
              animationData: animation.export()
            })
          }, 1000)
        }
      }
    })

  },
  onShow: function() {

  },
  tokenLogin: function() {
    var app = getApp()
    ktop.request({
      api: "kml.u.tokenLogin",
      finish: function(res, code) {
        if (code == 0) {
          wx.setStorageSync('user', res)
          app.user = res
        }
      }
    })
  },
  onPullDownRefresh: function() {
    this.loadData(
      function() {
        wx.stopPullDownRefresh()
      }
    )
  },
  onReachBottom: function() {
    this.setData({
      page: ++this.data.page
    })
    this.loadData()
  },
  loadData: function(callback) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    ktop.request({
      api: "/productWXIndex",
      data: {
        page: this.data.page,
        category_id: this.data.category_id,
        title: this.data.title
      },
      finish: function(res) {
        console.log(res)
        wx.hideLoading();
        if (callback) {
          callback()
        }
        if (that.data.page !== 1) {
          setTimeout(() => {
            const products = that.data.products;
            products.push(...res.data.s.data)
            that.setData({
              products
            })
          }, 500)
        } else {
          that.setData({
            products: [...res.data.s.data],
            banners: res.data.banners
          })
        }
      }
    })
    if (this.data.page == 1) {
      ktop.request({
        api: "/homeWX",
        finish: function(res) {
          let hotSearch = res.data.cats;
          wx.setStorageSync('hotSearch', hotSearch);
          that.setData({
            hotSearch,
          })
        }
      })
    }
  },
  setupProduct: function(result) {
    if (result.productInfosResult.length > 5) {
      var arr = result.productInfosResult.slice(0, 5);
      result.productInfosResult = arr;
      result.needLookMore = true;
      result.url = "/pages/productList/productList?type=" + result.param_type;
    }
  },
  hotSearch(e) {
    let category_id = 0;
    let title = '';
    category_id = e.currentTarget.dataset.key.id;
    this.setData({
      page: 1,
      category_id,
      title
    })
    this.loadData();
  },
  hotSearcht: function(e) {
    let category_id = 0;
    this.setData({
      page: 1,
      title: e.detail.value,
      category_id
    })
    this.loadData();
  },
  closehb: function() {
    this.setData({
      showhongbao: false
    })
  },
  accepthb: function() {
    let that = this;
    ktop.request({
      api: '/exchangeHongbao',
      data: {
        openid: wx.getStorageSync('openid')
      },
      finish: function(res) {
        if (res.code == 0) {
          that.setData({
            hongbaocg: true
          })
          setTimeout(function() {
            that.setData({
              showhongbao: false
            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }
})