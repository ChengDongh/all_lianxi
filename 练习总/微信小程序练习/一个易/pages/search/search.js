var WxSearch = require('../../wxSearch/wxSearch.js')
var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    products: [],
    brands: [],
    status: true,
    page: 1,
    wxSearchData:null
  },
  onLoad: function (options) {
    var that = this
    //初始化的时候渲染wxSearchdata
    if (options.key) {
      WxSearch.init(that, 44, [...wx.getStorageSync('hotSearch')], true);
      const wxSearchData = this.data.wxSearchData;
      wxSearchData.value = options.key
      this.setData({
        wxSearchData: wxSearchData,
        status: false
      })
      WxSearch.wxSearchAddHisKey(that)
      this.search(0)
    } else {
      WxSearch.init(that, 44, [...wx.getStorageSync('hotSearch')], true);
    }
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    this.setData({
      page:1
    })
    this.search()
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
      var that = this
      WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    this.setData({
      page:1
    })
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
    this.search()
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  search(text) {
    this.loadData(0);
  },
  onPullDownRefresh: function () {
    this.loadData(0,
      function () {
        wx.stopPullDownRefresh()
      }
    )
  },
  onReachBottom: function () {
    this.setData({
      page: ++this.data.page
    })
    this.loadData(this.data.products.length)
  },
  loadData: function (offset, callback) {
    var that = this
    var keyword = this.data.wxSearchData.value
    if (!keyword || keyword.length == 0) {
      callback && callback();
      return
    }
    var that = this
    wx.request({
      url: 'https://yiapi.qiqiangkeji.com/productWXIndex',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      data: {
        title: keyword,
        page: that.data.page
      },
      success: function (res) {
        if (callback) {
          callback()
        }
        if (that.data.page !== 1) {
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 500
          })
          setTimeout(() => {
            const products = []
            products.push(...that.data.products, ...res.data.data.data)
            that.setData({
              products
            })
          }, 500)
        } else {
          that.setData({
            products: [...res.data.data.data]
          })
        }
      }
    })
  }
})
