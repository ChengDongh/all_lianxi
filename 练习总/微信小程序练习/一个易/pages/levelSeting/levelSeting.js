var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
var wxpay = require('../../utils/wxpay.js')

Page({
  data: {
    user: {},
    settings: []
  },
  onLoad: function (options) {
    var app = getApp()
    app.user.user_expire_day = utils.formatDay(app.user.user_expire_time)
    this.setData({
      user: app.user
    })
    this.loadData()
  },
  loadData: function (callback) {
    var that = this
    ktop.request({
      api: "kml.level.levelSettings",
      loading: true,
      finish: function (res, code) {
        if (callback) {
          callback();
        }
        if (code == 0) {
          that.setData({
            settings: res
          })
        }
      }
    })
  },
  buy: function (e) {
    var setting = e.target.dataset.setting
    var that = this
    wxpay.upgrade({
      price: setting.price,
      levelSettingId: setting.id,
      complete: function (res, code) {
        if (code == 0) {
          that.tokenLogin();
        }
      }
    })
  },
  tokenLogin: function () {
    var that = this
    var app = getApp()
    ktop.request({
      api: "kml.u.tokenLogin",
      finish: function (res, code) {
        if (code == 0) {
          wx.setStorageSync('user', res)
          app.user = res
          that.loadData();
        }
      }
    })
  },
  onUnload: function () {
    // 页面关闭
  }
})